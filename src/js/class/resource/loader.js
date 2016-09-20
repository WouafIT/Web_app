module.exports = (function() {
	var $loader = $('#loader');
	$loader.before('<div id="loader-background" hidden></div>');
	var $bg = $('#loader-background');
	$loader.hide().removeAttr('hidden');
	$bg.hide().removeAttr('hidden');
	var self = {};
	self.show = function() {
		$loader.show();
		$bg.show();
	};
	self.hide = function() {
		$loader.hide();
		$bg.hide();
	};
	return self;
}());