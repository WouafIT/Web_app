var $ = require('jquery');

module.exports = (function() {
	var $toast = $('#toast');
	$toast.hide().removeAttr('hidden');
	var $toastContent = $toast.find('> div');
	var self = {};
	var last = '';
	self.show = function(text, delay, callback, nomultiple) {
		if (nomultiple && text === last) { //do not display the same toast multiple times
			if (callback) {
				callback();
			}
			return;
		}
		last = text;
		delay = delay || 3000;
		callback = callback || function() {};
		$toastContent.html('<p>'+ text +'</p>').parent().stop(false, true).fadeIn().delay(delay).fadeOut({complete: callback});
	};
	return self;
}());