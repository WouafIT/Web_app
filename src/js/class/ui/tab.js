module.exports = (function() {
	var wouaf = require('./wouaf.js');
	var i18n = require('../resource/i18n.js');
	var self = {};
	self.getContent = function (data) {
		var content = [];
		if (data.type == 'result') {
			content = content.concat([
			'<div class="row">',
				'<button class="w-menu" type="button" data-menu="listing">',
					'<i class="fa fa-cog"></i> '+ i18n.t('Menu'),
				'</button>'
			]);
			for(var i = 0, l = data.data.results.length; i < l; i++) {
				var obj = data.data.results[i];
				content = content.concat(['<div class="w-container" data-id="'+ obj.id +'">', wouaf.getWouafHeader(obj), '</div>']);
			}
			content.push('</div>');
		}
		return content.join('');
	};
	return self;
})();