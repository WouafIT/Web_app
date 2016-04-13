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
		if (states.user) {
			href += 'user/'+ states.user +'/';
		} else if (states.windows) {
			href += states.windows +'/';
		}
		/*if (states.hash) {
		 href += 'hash/'+ states.hash +'/';
		 }*/
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
		if (states.user) {
			href += 'user/userId/';
		} else if (states.windows) {
			href += states.windows +'/';
		}
		/*if (states.hash) {
		 href += 'hash/hashId/';
		 }*/
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
				if (state.value === null || utils.isValidWouafId(state.value)) {
					return true;
				}
				break;
			case 'user':
				if (state.value === null || utils.isValidUsername(state.value)) {
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
	self.getAbsoluteURLForStates = function (states) {
		var statesObj = {};
		for (var i = 0, l = states.length; i < l; i++) {
			var state = states[i];
			if (state && self.isStateValid(state)) {
				statesObj[state.name] = state.value;
			}
		}
		var path = self.getPath(statesObj);
		return (__DEV__ ? DEV_URL : PROD_URL) + path;
	};
	self.getAbsoluteURLIcon = function () {
		return 'https://img.wouaf.it/icon.png';
	};
	return self;
})();