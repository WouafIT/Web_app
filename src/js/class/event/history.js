module.exports = (function() {
	var $document = $(document);
	var windows = require('../resource/windows.js');
	var map = require('../resource/map.js');
	var states = {
		windows: 	null,
		map: 		null,
		wouaf:		null,
		cluster:	null,
		user:		null
	};

	$document.on('history.set-state', function(event, data) {
		states[data.state] = data.value;
		var href = '/';
		if (states.map) {
			href += '@'+ states.map.center +','+ states.map.zoom +'z/';
		}
		if (states.windows) {
			href += states.windows.name +'/';
		}
		if (href !== window.location.pathname) {
			window.history.pushState(states, '', href);
		}
	});

	$(window).on('popstate', function(event) {
		states = event.originalEvent.state;
		//TODO : handle hash like #wouafs or #search
		if (states.map) {
			var coordinates = states.map.center.split(',');
			map.getMap().setCenter({lat: parseFloat(coordinates[0]), lng: parseFloat(coordinates[1])});
			map.getMap().setZoom(states.map.zoom);
		}
		if (states.windows && states.windows.href) {
			windows.show({href: states.windows.href});
		} else {
			windows.close();
		}
	});

	$document.on('history.load-state', function(event, callback) {
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
						//TODO
					} else if (part === 'cluster') {
						//TODO
					} else if (part === 'user') {
						//TODO
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
})();