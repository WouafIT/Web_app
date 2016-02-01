module.exports = (function() {
	var $document = $(document);
	var windows = require('../resource/windows.js');
	var map = require('../resource/map.js');
	var states = {
		windows: 	null,
		map: 		null,
		wouaf:		null,
		user:		null
	};

	$document.on('navigation.set-state', function(event, data) {
		states[data.state] = data.value;
		var href = '/';
		if (states.map) {
			href += '@'+ states.map.center +','+ states.map.zoom +'z/';
		}
		if (states.windows) {
			href += states.windows.name +'/';
		}
		if (states.wouaf) {
			href += 'wouaf/'+ states.wouaf.id +'/';
		}
		if (states.user) {
			href += 'user/'+ states.user +'/';
		}
		if (states.hash) {
			href += 'hash/'+ states.hash +'/';
		}
		if (href !== window.location.pathname) {
			window.history.pushState(states, '', href);
		}
	});

	$(window).on('popstate', function(event) {
		states = event.originalEvent.state;
		if (!states && __DEV__) {
			console.error('popstate: null state', event);
		}
		//TODO : handle hash like #wouafs or #search
		if (states && states.map) {
			var coordinates = states.map.center.split(',');
			map.getMap().setCenter({lat: parseFloat(coordinates[0]), lng: parseFloat(coordinates[1])});
			map.getMap().setZoom(states.map.zoom);
		}
		if (states && states.windows && states.windows.href) {
			windows.show({href: states.windows.href});
		} else {
			windows.close();
		}
	});

	$document.on('navigation.load-state', function(event, callback) {
		var pathname = window.location.pathname;
		var mapState = false;
		if (pathname !== '/') {
			var part, parts = pathname.split('/');
			for (var i = 0, l = parts.length; i < l; i++) {
				part = parts[i];
				if (part) {
					if (part.substr(0, 1) === '@' && part.substr(-1) === 'z') {
						var coordinates = part.substr(1, (part.length - 1)).split(',');
						if (coordinates.length === 3) {
							mapState = true;
							map.getMap().setCenter({lat: parseFloat(coordinates[0]), lng: parseFloat(coordinates[1])});
							map.getMap().setZoom(parseFloat(coordinates[2].substr(0, (coordinates[2].length - 1))));
						}
					} else if (part === 'wouaf') {
						i++;
						part = parts[i];
						console.info('TODO show wouaf '+ part);
					} else if (part === 'user') {
						i++;
						part = parts[i];
						console.info('TODO show user '+ part);
					} else if (part === 'hash') {
						i++;
						part = parts[i];
						console.info('TODO show user '+ part);
					} else {
						//load queried windows
						var path = '/parts/'+ part +'.html';
						windows.show({href: path});
					}
				}
			}
		}
		//launch callback
		callback(mapState);
	});
	$document.on('click', 'a, button', function(e) {
		var $source = $(event.target);
		if (!$source.length || (!$source.data('user') && !$source.data('hash')
			&& !$source.data('wouaf') && !$source.data('show'))) {
			return;
		}
		e.preventDefault();
		if ($source.data('user')) {
			console.info('TODO show user '+ $source.data('user'));
		} else if ($source.data('hash')) {
			console.info('TODO show hash '+ $source.data('hash'));
		} else if ($source.data('wouaf')) {
			console.info('TODO show wouaf '+ $source.data('wouaf'));
		} else if ($source.data('show') == 'modal' && $source.data('href')) {
			windows.show({href: $source.data('href')});
		}
	});
})();