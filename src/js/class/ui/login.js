module.exports = (function() {
	// Reference to "this" that won't get clobbered by some other "this"
	var self = {};
	self.show = function (e) {
		console.info('ok login');
	}
	return self;
})();