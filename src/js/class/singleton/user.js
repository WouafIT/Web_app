module.exports = (function() {
	// Reference to "this" that won't get clobbered by some other "this"
	var self = this;
	// Public methods
	self.init = function () {
		//todo: get current user from cookies if any
	}
	self.set = function (key, value) {
		self[key] = value;
	}
	self.get = function (key) {
		return self[key] || null;
	}
	return self;
})();