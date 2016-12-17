var wouaf 	= require('./wouaf.js');
var user 	= require('./user.js');
var utils 	= require('../utils.js');
var i18n 	= require('../resource/i18n.js');
var users 	= require('../resource/users.js');
var wouafs 	= require('../resource/wouafs.js');
var search 	= require('./search.js');

module.exports = (function() {
	var self = {};
	self.getContent = function (data, title, id) {
		var content = [], i, l, obj;
		id = id || utils.getRandomInt(1, 10000);
		if (data.type === 'result') {
			l = data.data.results.length;
			if (l) {
				content = content.concat([
					'<div class="w-tab-head">',
						'<button class="w-menu" type="button" data-menu="listing" data-proximity="yes" data-sort="proximity" data-filter="no">',
							'<i class="fa fa-sort"></i> ', i18n.t('Sort'),
						'</button>',
						'<button class="w-search" type="button" data-toggle="collapse" href="#collapseSearch', id ,'" aria-expanded="false" aria-controls="collapseSearch', id ,'">',
							'<i class="fa fa-filter"></i> ', i18n.t('Filter'),
						'</button>',
						'<p class="lead">', i18n.t('{{count}} result for your search', {count: l}) ,'</p>',
						'<div class="collapse w-collapse" data-tab="', id ,'" id="collapseSearch', id ,'">',
							'<div class="card card-block"></div>',
						'</div>',
					'</div>',
					'<div class="row w-tab-content">'
				]);
				//store wouafs
				wouafs.sets(data.data.results);
				for(i = 0; i < l; i++) {
					obj = data.data.results[i];
					content = content.concat([
						'<div class="w-container" data-id="', obj.id ,'" data-proximity="', i ,'" data-date="', obj.dates[0].start ,'" data-comments="', obj.com ,'" data-fav="', obj.fav ,'" data-interest="', obj.interest ,'" data-type="', obj.cat ,'">',
							wouaf.getHeader(obj),
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
					'</div>'
				]);
			}
		} else if (data.type === 'list') {
			l = data.data.results.length;
			if (l) {
				content = content.concat([
					'<div class="w-tab-head">',
						'<button class="w-menu" type="button" data-menu="listing" data-proximity="yes" data-sort="proximity" data-filter="no">',
							'<i class="fa fa-sort"></i> ', i18n.t('Sort'),
						'</button>',
						'<button class="w-search" type="button" data-toggle="collapse" href="#collapseSearch', id ,'" aria-expanded="false" aria-controls="collapseSearch', id ,'">',
							'<i class="fa fa-filter"></i> ', i18n.t('Filter'),
						'</button>',
						'<p class="lead">', (title ? title : i18n.t('{{count}} Wouaf', {count: l})) ,'</p>',
						'<div class="collapse w-collapse" data-tab="', id ,'" id="collapseSearch', id ,'">',
							'<div class="card card-block"></div>',
						'</div>',
					'</div>',
					'<div class="row w-tab-content">'
				]);
				//store wouafs
				wouafs.sets(data.data.results);
				for(i = 0; i < l; i++) {
					obj = data.data.results[i];
					content = content.concat([
						'<div class="w-container" data-id="', obj.id ,'" data-date="', obj.dates[0].start ,'" data-comments="', obj.com ,'" data-fav="', obj.fav ,'" data-interest="', obj.interest ,'" data-type="', obj.cat ,'">',
							wouaf.getHeader(obj),
						'</div>'
					]);
				}
				content.push('</div>');
			} else {
				content = content.concat(['<p class="lead">', i18n.t('No Wouaf yet') ,'</p>']);
			}
		} else if (data.type === 'user') {
			content = content.concat([
				'<div class="w-tab-head">',
					'<p class="lead">', title ,'</p>',
				'</div>',
				'<div class="row w-tab-content">'
			]);
			//store users
			users.sets(data.data.results);
			for(i = 0, l = data.data.results.length; i < l; i++) {
				obj = data.data.results[i];
				content = content.concat([
					'<div class="w-container" data-user="', utils.escapeHtml(obj.username) ,'">',
						user.getHeader(obj),
					'</div>'
				]);
			}
			content.push('</div>');
		}
		return content.join('');
	};
	return self;
}());