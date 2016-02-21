module.exports = (function() {
	var $document = $(document);
	var windows = require('../resource/windows.js');
	var map = require('../resource/map.js');
	var utils = require('../utils.js');
	var data = require('../resource/data.js');
	var url = require('../resource/url.js');
	var allowSetState = true;
	var states = {
		windows: 	null,
		map: 		null,
		wouaf:		null,
		user:		null
	};
	data.setObject('navigation', states, true);

	$document.on('navigation.disable-state', function() {
		allowSetState = false;
	});

	$document.on('navigation.enable-state', function() {
		allowSetState = true;
		$document.triggerHandler('navigation.set-state');
	});

	$document.on('navigation.set-state', function(event, state) {
		if (state) {
			if (!url.isStateValid(state)) {
				return;
			}
			states[state.name] = state.value;
			data.setObject('navigation', states, true);
		}
		if (!allowSetState) {
			return;
		}
		var href = url.getPath(states);
		if (href !== window.location.pathname) {
			window.history.pushState(states, '', href);
		}
	});

	$(window).on('popstate', function(event) {
		states = event.originalEvent.state;
		if (!states && __DEV__) {
			console.error('popstate: null state', event);
		}
		data.setObject('navigation', states, true);
		//TODO : handle hash like #wouafs or #search
		if (states && states.map) {
			var coordinates = states.map.center.split(',');
			map.getMap().setCenter({lat: parseFloat(coordinates[0]), lng: parseFloat(coordinates[1])});
			map.getMap().setZoom(parseInt(states.map.zoom, 10));
		}
		if (states && states.wouaf) {
			map.showResult(states.wouaf);
		} else {
			map.hideResult();
		}
		if (states && states.user && !states.windows) {
			console.info('TODO show user '+ states.user);
		}
		if (states && states.windows) {
			windows.show({href: states.windows});
		} else {
			windows.close();
		}
	});

	$document.on('navigation.load-state', function(event, callback) {
		allowSetState = false; //disallow state change during URL parsing
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
							map.getMap().setZoom(parseInt(coordinates[2].substr(0, (coordinates[2].length - 1)), 10));
						}
					} else if (part === 'wouaf' && utils.isValidWouafId(part[i + 1])) {
						var wouafId = parts[++i];
						$document.one('map.show-results', function() {
							map.showResult(wouafId);
						});
						$document.triggerHandler('navigation.set-state', {name: 'wouaf', value: wouafId});
					} else if (part === 'user' && utils.isValidUsername(part[i + 1])) {
						part = parts[++i];
						console.info('TODO show user '+ part);
					/*} else if (part === 'hash') {
						part = parts[++i];
						console.info('TODO show user '+ part);*/
					} else if(utils.isValidPageName(part)) {
						//load queried windows
						windows.show({href: part});
					}
				}
			}
		}
		//launch callback
		callback(mapState);
		allowSetState = true;
	});
	$document.on('click', 'a, button', function(e) {
		var $source = $(e.target);
		if (!$source.length || (!$source.data('user')/* && !$source.data('hash')*/
			&& !$source.data('wouaf') && !$source.data('show'))) {
			return;
		}
		e.preventDefault();
		if ($source.data('user') && utils.isValidUsername($source.data('user'))) {
			console.info('TODO show user '+ $source.data('user'));
		/*} else if ($source.data('hash')) {
			console.info('TODO show hash '+ $source.data('hash'));*/
		} else if ($source.data('wouaf') && utils.isValidWouafId($source.data('wouaf'))) {
			map.showResult($source.data('wouaf'));
		} else if ($source.data('show') == 'modal' && $source.data('href') && utils.isValidPageName($source.data('href'))) {
			windows.show({href: $source.data('href')});
		}
	});
})();