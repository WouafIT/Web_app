var wouaf 	= require('./wouaf.js');
var user 	= require('./user.js');
var utils 	= require('../utils.js');
var i18n 	= require('../resource/i18n.js');
var users 	= require('../resource/users.js');
var wouafs 	= require('../resource/wouafs.js');

module.exports = (function() {
	var self = {};
	self.getContent = function (data, title) {
		var content = [], i, l, obj;
		if (data.type === 'result') {
			l = data.data.results.length;
			if (l) {
				content = content.concat([
					'<div class="tab-head">',
						'<button class="w-menu" type="button" data-menu="listing" data-relevance="yes" data-sort="relevance" data-filter="no">',
							'<i class="fa fa-bars"></i> ', i18n.t('Menu'),
						'</button>',
						'<p class="lead">',
							'<span class="update-search"><a href="#search" data-action="search" title="', i18n.t('Edit your search') ,'"><i class="fa fa-pencil"></i> ', data.description ,'</a> : </span>',
							i18n.t('{{count}} result', {count: l}) ,
						'</p>',
					'</div>',
					'<div class="tab-content-list">'
				]);
				//store wouafs
				wouafs.sets(data.data.results);
				for(i = 0; i < l; i++) {
					obj = data.data.results[i];
					content = content.concat([
					'<div class="w-container" data-id="', obj.id ,'" data-relevance="', i ,'" data-date="', obj.dates[0].start ,'" data-comments="', obj.com ,'" data-fav="', obj.fav ,'" data-interest="', obj.interest ,'" data-type="', obj.cat ,'">',
							wouaf.getHeader(obj),
						'</div>'
					]);
				}
				content.push('</div>');
			} else {
				content = content.concat([
					'<div class="jumbotron">',
						'<h1>', i18n.t('No Wouaf here') ,'</h1>',
						'<p class="lead">', i18n.t('At the moment there are no Wouaf there with your search parameters ({{params}})',
							{params: '<a href="#search" data-action="search" title="'+ i18n.t('Edit your search') +'"><i class="fa fa-pencil"></i> '+ data.description +'</a>', interpolation: {escapeValue: false}}) ,
						'</p>',
						'<hr class="m-y-md">',
						'<p>', i18n.t('what if you add one yourself') ,'</p>',
						'<p class="lead text-right">',
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
					'<div class="tab-head">',
						'<button class="w-menu" type="button" data-menu="listing" data-relevance="no" data-sort="date-desc" data-filter="no">',
							'<i class="fa fa-bars"></i> ', i18n.t('Menu'),
						'</button>',
						'<p class="lead">', (title ? title : i18n.t('{{count}} Wouaf', {count: l})) ,'</p>',
					'</div>',
					'<div class="tab-content-list">'
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
				'<div class="tab-head">',
					'<p class="lead">', title ,'</p>',
				'</div>',
				'<div class="tab-content-list">'
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