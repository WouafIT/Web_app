module.exports = (function() {
	var $ = require('jquery');
	var $toast = $('#toast');
	$toast.hide().removeAttr('hidden');
	var $toastContent = $toast.find('> div');
	var self = {};
	self.show = function(text, delay) {
		delay = delay || 2000;
		$toastContent.html('<p>'+ text +'</p>').parent().fadeIn().delay(delay).fadeOut();
	};
	return self;
})();