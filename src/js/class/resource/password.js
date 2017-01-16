var i18n = require('./i18n.js');

module.exports = (function() {
	var classes = {
		0: 'bg-danger',
		1: 'bg-danger',
		2: 'bg-warning',
		3: 'bg-info',
		4: 'bg-success'
	};
	var texts = {
		0: 'tooWeak',
		1: 'weak',
		2: 'medium',
		3: 'strong',
		4: 'veryStrong'
	};
	var self = {};
	self.score = function($pass, $progress, inputs) {
		inputs = inputs || [];
		var result = zxcvbn($pass.val(), inputs);
		$progress.animate({ width:((result.score + 1) * 20)+ '%' })
			.removeClass('bg-danger bg-warning bg-info bg-success')
			.addClass(classes[result.score])
			.html(i18n.t(texts[result.score]));
	};
	return self;
}());