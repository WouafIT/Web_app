module.exports = (function() {
	var $ = require('jquery');
	var $toast = $('#toast');
	$toast.hide().removeAttr('hidden');
	var $toastContent = $toast.find('> div');
	var self = {};
	self.show = function(text, delay, callback) {
		delay = delay || 2500;
		callback = callback || function() {};
		$toastContent.html('<p>'+ text +'</p>').parent().fadeIn().delay(delay).fadeOut({complete: callback});
	};
	return self;
})();