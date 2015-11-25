module.exports = (function() {
	var $ = require('jquery');
	var $loader = $('#loader');
	var self = {};
	self.show = function(text, delay) {
		$loader.show();
	}
	self.hide = function(text, delay) {
		$loader.hide();
	}
	return self;
})();