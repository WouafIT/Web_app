module.exports = (function() {
	var $loader = $('#loader');
	$loader.hide().removeAttr('hidden');
	var self = {};
	self.show = function(text, delay) {
		$loader.show();
	}
	self.hide = function(text, delay) {
		$loader.hide();
	}
	return self;
})();