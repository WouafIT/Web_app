module.exports = (function() {
	var wouaf = require('./wouaf.js');
	var i18n = require('../resource/i18n.js');
	var self = {};
	self.getContent = function (data) {
		var content = [];
		if (data.type == 'result') {
			content = content.concat([
				'<button class="w-menu" type="button" data-menu="listing" data-proximity="yes" data-sort="proximity" data-filter="no">',
					'<i class="fa fa-cog"></i> '+ i18n.t('Menu'),
				'</button>',
				'<div class="row">',
			]);
			for(var i = 0, l = data.data.results.length; i < l; i++) {
				var obj = data.data.results[i];
				content = content.concat([
					'<div class="w-container" data-id="'+ obj.id +'" data-proximity="'+ i +'" data-date="'+ obj.date[0].sec +'" data-comments="'+ obj.com +'" data-type="'+ obj.cat +'" >',
						wouaf.getWouafHeader(obj),
					'</div>'
				]);
			}
			content.push('</div>');
		} else if (data.type == 'list') {
			content = content.concat([
				'<button class="w-menu" type="button" data-menu="listing" data-proximity="no" data-sort="date" data-filter="no">',
					'<i class="fa fa-cog"></i> '+ i18n.t('Menu'),
				'</button>',
				'<div class="row">',
			]);
			for(var i = 0, l = data.data.results.length; i < l; i++) {
				var obj = data.data.results[i];
				content = content.concat([
					'<div class="w-container" data-id="'+ obj.id +'" data-date="'+ obj.date[0].sec +'" data-comments="'+ obj.com +'" data-type="'+ obj.cat +'" >',
						wouaf.getWouafHeader(obj),
					'</div>'
				]);
			}
			content.push('</div>');
		}
		return content.join('');
	};
	return self;
})();