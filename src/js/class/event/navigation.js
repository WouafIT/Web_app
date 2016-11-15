var windows = require('../resource/windows.js');
var map = require('../resource/map.js');
var utils = require('../utils.js');
var data = require('../resource/data.js');
var url = require('../resource/url.js');
var wouafs = require('../resource/wouafs.js');
var users = require('../resource/users.js');

module.exports = (function() {
	var debug = false;
	var $document = $(document);
	var allowSetState = true;
	var states = {
		windows: 	null,
		map: 		null,
		wouaf:		null,
		user:		null
	};
	data.setObject('navigation', states, true);

	$document.on('navigation.disable-state', function() {
		if (debug) {
			console.info('Disable navigation state');
		}
		allowSetState = false;
	});

	$document.on('navigation.enable-state', function() {
		if (debug) {
			console.info('Enable navigation state');
		}
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
			if (debug) {
				console.info('Push URL: '+ href +' (old url: '+ window.location.pathname +')');
			}
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
		allowSetState = false; //disallow state change during URL parsing
		if (debug) {
			console.info('Pop URL: ', eventStates);
		}
		for(var i in eventStates) {
			if (eventStates.hasOwnProperty(i)) {
				if (states[i] !== eventStates[i]) {
					var state = eventStates[i];
					if (debug) {
						console.info('Set state: ', i, state);
					}
					switch(i) {
						case 'map':
							if (state) {
								var coordinates = state.center.split(',');
								if (debug) {
									console.info('Set map: '+coordinates[0]+','+coordinates[1]+','+state.zoom);
								}
								map.setCenter({lat: parseFloat(coordinates[0]), lng: parseFloat(coordinates[1])}, true);
								map.getMap().setZoom(parseInt(state.zoom, 10));
							}
							break;
						case 'wouaf':
							if (state) {
								map.showResult(state);
							} else {
								map.hideResult();
							}
							break;
						case 'tag':
							if (state) {
								$('#hashtag').val(state);
							} else {
								$('#hashtag').val('');
							}
							break;
						case 'user':
							if (state) {
								windows.show({
									href: 'user',
									navigationOpen: {name: 'user', value: state},
									navigationClose: {name: 'user', value: null}
								});
							}
							break;
						case 'windows':
							if (state) {
								windows.show({href: state});
							}
							break;
					}
				}
			}
		}
		states = eventStates;
		if (!states.windows && !states.user) {
			windows.close();
		}
		if (!states.wouaf) {
			map.hideResult();
		}

		data.setObject('navigation', states, true);

		allowSetState = true;
		$document.triggerHandler('app.popped-state');
		if (debug) {
			console.info('Pop URL: End');
		}
	});

	$document.on('navigation.load-state', function(e, callback) {
		allowSetState = false; //disallow state change during URL parsing
		var pathname 	= window.location.pathname;
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
						if (window.wouafit.wouaf && window.wouafit.wouaf.id === wouafId) {
							wouafs.set(wouafId, window.wouafit.wouaf);
							data.setObject('position', {lat: window.wouafit.wouaf.loc[0], lng: window.wouafit.wouaf.loc[1]});
						}
						$document.triggerHandler('navigation.set-state', {name: 'wouaf', value: wouafId});
					} else if (part === 'user' && utils.isValidUsername(parts[i + 1])) {
						var username = parts[++i];
						if (window.wouafit.user && window.wouafit.user.username === username) {
							users.set(window.wouafit.user.uid, window.wouafit.user);
						}
						windows.show({
							href: 'user',
							navigationOpen: {name: 'user', value: username},
							navigationClose: {name: 'user', value: null}
						});
					} else if (part === 'tag' && utils.isValidHashtag(parts[i + 1])) {
						var tag = parts[++i];
						$('#hashtag').val(tag);
						$('#hashtag-empty').toggle(!!tag);
						$document.triggerHandler('navigation.set-state', {name: 'tag', value: tag});
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
}());