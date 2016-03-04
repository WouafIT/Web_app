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
		}
		if (states.windows) {
			href += states.windows +'/';
		}
		/*if (states.hash) {
			href += 'hash/'+ states.hash +'/';
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
	self.getCurrentPathForState = function (state) {
		var states = data.getObject('navigation');
		if (state && self.isStateValid(state)) {
			states[state.name] = state.value;
		}
		return self.getPath(states);
	};
	self.getAbsoluteURLForState = function (state) {
		var states = {};
		if (state && self.isStateValid(state)) {
			states[state.name] = state.value;
		}
		var path = self.getPath(states);
		return 'https://wouaf.it' + path;
	};
	self.getAbsoluteURLIcon = function () {
		return 'https://img.wouaf.it/icon.png';
	};
	return self;
})();