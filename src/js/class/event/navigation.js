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

	$document.on('navigation.set-state', function(e, state) {
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

			$document.triggerHandler('app.pushed-state');
		}
	});

	$(window).on('popstate', function(e) {
		var eventStates = e.originalEvent.state;
		if (!eventStates) {
			//append on a link with an anchor
			return;
		}
		states = eventStates;
		data.setObject('navigation', states, true);
		//TODO : handle hash like #wouafs or #search
		if (states) {
			if (states.map) {
				var coordinates = states.map.center.split(',');
				map.setCenter({lat: parseFloat(coordinates[0]), lng: parseFloat(coordinates[1])}, true);
				map.getMap().setZoom(parseInt(states.map.zoom, 10));
			}
			if (states.wouaf) {
				map.showResult(states.wouaf);
			} else {
				map.hideResult();
			}
			if (states.user) {
				windows.show({
					href: 'user',
					navigationOpen: {name: 'user', value: states.user},
					navigationClose: {name: 'user', value: null}
				});
			} else if (states.windows) {
				windows.show({href: states.windows});
			} else {
				windows.close();
			}
		} else {
			map.hideResult();
			windows.close();
		}

		$document.triggerHandler('app.poped-state');
	});

	$document.on('navigation.load-state', function(e, callback) {
		allowSetState = false; //disallow state change during URL parsing
		var pathname = window.location.pathname;
		if (pathname !== '/') {
			var part, parts = pathname.split('/');
			for (var i = 0, l = parts.length; i < l; i++) {
				part = parts[i];
				if (part) {
					if (part.substr(0, 1) === '@' && part.substr(-1) === 'z') {
						var coordinates = part.substr(1, (part.length - 1)).split(',');
						if (coordinates.length === 3) {
							var position = {lat: parseFloat(coordinates[0]), lng: parseFloat(coordinates[1])};
							map.setCenter(position, true);
							map.getMap().setZoom(parseInt(coordinates[2].substr(0, (coordinates[2].length - 1)), 10));
							//store map position: url
							data.setObject('position', position);
						}
					} else if (part === 'wouaf' && utils.isId(parts[i + 1])) {
						var wouafId = parts[++i];
						//check if wouaf data exists in html
						if (window.wouafit.wouaf && window.wouafit.wouaf.id == wouafId) {
							data.setObject('position', {lat: window.wouafit.wouaf.loc[0], lng: window.wouafit.wouaf.loc[1]});
						}
						$document.triggerHandler('navigation.set-state', {name: 'wouaf', value: wouafId});
					} else if (part === 'user' && utils.isValidUsername(parts[i + 1])) {
						part = parts[++i];
						windows.show({
							href: 'user',
							navigationOpen: {name: 'user', value: part},
							navigationClose: {name: 'user', value: null}
						});
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
		callback();
		allowSetState = true;

		$document.triggerHandler('app.loaded-state');
	});
	$document.on('click', 'a, button', function(e) {
		var $source = $(e.target);
		if (!$source.length || (!$source.data('user')/* && !$source.data('hash')*/
			&& !$source.data('wouaf') && !$source.data('show'))) {
			return;
		}
		e.preventDefault();
		if ($source.data('user') && utils.isValidUsername($source.data('user'))) {
			windows.show({
				href: 'user',
				navigationOpen: {name: 'user', value: $source.data('user')},
				navigationClose: {name: 'user', value: null}
			});
		/*} else if ($source.data('hash')) {
			console.info('TODO show hash '+ $source.data('hash'));*/
		} else if ($source.data('wouaf') && utils.isId($source.data('wouaf'))) {
			map.showResult($source.data('wouaf'));
		} else if ($source.data('show') == 'modal' && $source.data('href') && utils.isValidPageName($source.data('href'))) {
			windows.show({href: $source.data('href')});
		}
	});
})();