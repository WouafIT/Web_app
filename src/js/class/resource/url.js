module.exports = (function() {
	var self = {};
	var data = require('./data.js');
	var utils = require('../utils.js');
	self.getPath = function(states) {
		var href = '/';
		if (states.map) {
			href += '@'+ states.map.center +','+ states.map.zoom +'z/';
		}
		if (states.wouaf) {
			href += 'wouaf/'+ states.wouaf +'/';
		}
		if (states.tag) {
			href += 'tag/'+ states.tag +'/';
		}
		if (states.user) {
			href += 'user/'+ states.user +'/';
		} else if (states.windows) {
			href += states.windows +'/';
		}
		return href;
	};
	self.getAnalyticsPath = function(states) {
		var href = '/';
		if (states.map) {
			href += '@location/';
		}
		if (states.wouaf) {
			href += 'wouaf/wouafId/';
		}
		if (states.tag) {
			href += 'tag/hashtag/';
		}
		if (states.user) {
			href += 'user/userId/';
		} else if (states.windows) {
			href += states.windows +'/';
		}
		return href;
	};
	self.isStateValid = function(state) {
		//check value
		if (!state || !state.name) {
			return false;
		}
		switch(state.name) {
			case 'map':
				if (state.value === null || (state.value.zoom && state.value.center)) {
					return true;
				}
				break;
			case 'windows':
				if (state.value === null || utils.isValidPageName(state.value)) {
					return true;
				}
				break;
			case 'wouaf':
				if (state.value === null || utils.isId(state.value)) {
					return true;
				}
				break;
			case 'user':
				if (state.value === null || utils.isValidUsername(state.value)) {
					return true;
				}
				break;
			case 'tag':
				if (state.value === null || utils.isValidHashtag(state.value)) {
					return true;
				}
				break;
		}
		return false;
	};
	self.getCurrentPath = function () {
		var states = data.getObject('navigation');
		return self.getPath(states);
	};
	self.getAbsoluteURLForStates = function (states, localeUrl) {
		var localeUrl = localeUrl || false;
		var statesObj = {};
		for (var i = 0, l = states.length; i < l; i++) {
			var state = states[i];
			if (state && self.isStateValid(state)) {
				statesObj[state.name] = state.value;
			}
		}
		var path = self.getPath(statesObj);
		if (localeUrl) {
			return window.location.protocol +'//'+ window.location.hostname + path;
		} else {
			return (__DEV__ ? DEV_URL : PROD_URL) + path;
		}
	};
	return self;
})();