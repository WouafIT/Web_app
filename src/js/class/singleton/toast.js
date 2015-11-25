module.exports = (function() {
	var $ = require('jquery');
	var $toast = $('#toast > div');
	var self = {};
	self.show = function(text, delay) {
		delay = delay || 2000;
		$toast.html('<p>'+ text +'</p>').parent().fadeIn().delay(delay).fadeOut();
	}
	return self;
})();