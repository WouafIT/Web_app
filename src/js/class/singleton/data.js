module.exports = (function() {
	if (!window.localStorage) {
		console.error('window.localStorage does not exists');
	}
	// Reference to "this" that won't get clobbered by some other "this"
	var self = {};
	// Public methods
	self.set = function (key, value) {
		if (value && typeof value == 'object') {
			value = 'object:'+ JSON.stringify(value);
		}
		localStorage.setItem(key, value);
	}
	self.get = function (key) {
		var value = localStorage.getItem(key) || null;
		if (value && value.substr(0, 7) == 'object:') {
			value = JSON.parse(value.substr(7));
		}
		return value;
	}
	return self;
})();