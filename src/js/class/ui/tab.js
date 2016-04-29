module.exports = (function() {
	var wouaf = require('./wouaf.js');
	var i18n = require('../resource/i18n.js');
	var self = {};
	self.getContent = function (data) {
		var content = [], i, l, obj;
		if (data.type == 'result') {
			l = data.data.results.length;
			if (l) {
				content = content.concat([
					'<button class="w-menu" type="button" data-menu="listing" data-proximity="yes" data-sort="proximity" data-filter="no">',
						'<i class="fa fa-cog"></i> '+ i18n.t('Menu'),
					'</button>',
					'<div class="row">',
				]);
				for(i = 0; i < l; i++) {
					obj = data.data.results[i];
					content = content.concat([
						'<div class="w-container" data-id="'+ obj.id +'" data-proximity="'+ i +'" data-date="'+ obj.date[0].sec +'" data-comments="'+ obj.com +'" data-type="'+ obj.cat +'" >',
							wouaf.getWouafHeader(obj),
						'</div>'
					]);
				}
				content.push('</div>');
			} else {
				content = content.concat([
					'<div class="jumbotron">',
						'<h1>', i18n.t('No Wouaf here') ,'</h1>',
						'<p class="lead">', i18n.t('At the moment there are no Wouaf there with your search parameters') ,'</p>',
						'<hr class="m-y-md">',
						'<p>', i18n.t('what if you add one yourself') ,'</p>',
						'<p class="lead text-xs-right">',
						'<a class="btn btn-primary btn-lg" href="/add/" role="button"',
						' data-action="add">', i18n.t('Add a Wouaf') ,'</a>',
						'</p>',
					'</div>',
				]);
			}
		} else if (data.type == 'list') {
			content = content.concat([
				'<button class="w-menu" type="button" data-menu="listing" data-proximity="no" data-sort="date-desc" data-filter="no">',
					'<i class="fa fa-cog"></i> '+ i18n.t('Menu'),
				'</button>',
				'<div class="row">',
			]);
			for(i = 0, l = data.data.results.length; i < l; i++) {
				obj = data.data.results[i];
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