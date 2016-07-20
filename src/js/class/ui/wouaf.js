module.exports = (function() {
	var i18n = require('../resource/i18n.js');
	var utils = require('../utils');
	var categories = require('../resource/categories.js');
	var url = require('../resource/url.js');
	var dtp = require('../resource/datetimepicker.js');
	var self = {};
	self.getHeader = function (obj, collapse) {
		collapse = collapse || false;
		var title = utils.getWouafTitle(obj);
		//state
		var time = new Date();
		obj.state = (obj.date[0]) > time.getTime() ? 'w-post' : ((obj.date[1]) < time.getTime() ? 'w-past' : 'w-current');
		//length
		var start = new Date(obj.date[0]);
		var length = (obj.date[1] - obj.date[0]) / 1000;
		var eventLength;
		var oneDay = 86400;
		var oneWeek = 604800;
		var oneHour = 3600;
		if (length >= oneWeek && length % oneWeek == 0) {
			eventLength = i18n.t('{{count}} week', {count: length / oneWeek});
		} else if (length >= oneDay && length % oneDay == 0 && length <= (oneWeek * 2)) {
			eventLength = i18n.t('{{count}} day', {count: length / oneDay});
		} else if (length % oneHour == 0 && length <= (oneDay * 2))  {
			eventLength = i18n.t('{{count}} hour', {count: length / oneHour});
		}
		var timeStart;
		if (!eventLength) {
			var end = new Date(obj.date[1]);
			timeStart = dtp.formatTime(start);
			var timeEnd = dtp.formatTime(end);
			eventLength = i18n.t('From {{from}} to {{to}}', {
				from: dtp.formatDate(start, 'long') + (timeStart != '00:00' ? ' '+ i18n.t('at {{at}}', {at: timeStart}) : ''),
				to: dtp.formatDate(end, 'long') + (timeEnd != '00:00' ? ' '+ i18n.t('at {{at}}', {at: timeEnd}) : '')
			});
		} else {
			timeStart = dtp.formatTime(start);
			eventLength = i18n.t('On {{on}} for {{for}}', {
				on: dtp.formatDate(start, 'long') + (timeStart != '00:00' ? ' '+ i18n.t('at {{at}}', {at: timeStart}) : ''),
				for: eventLength
			});
		}
		switch (obj.state) {
			case 'w-post':
				eventLength = i18n.t('Upcoming') +' <i class="fa fa-step-forward w-yellow"></i><br />'+ eventLength;
				break;
			case 'w-past':
				eventLength = i18n.t('Gone') +' <i class="fa fa-step-backward w-red"></i><br />'+ eventLength;
				break;
			case 'w-current':
				eventLength = i18n.t('Currently') +' <i class="fa fa-play w-green"></i><br />'+ eventLength;
				break;
		}
		return [
			'<div',
				(collapse
					? ' data-toggle="collapse" data-parent=".w-accordion" data-target="#collapse-'+ obj.id +'" class="panel-title collapsed w-title '+ obj.state +'"'
					: ' class="w-title '+ obj.state +'"'),
				' style="border-color: ', categories.getColor(obj.cat) ,';">',
				'<div class="w-cat w-cat'+ obj.cat +'">',
					utils.escapeHtml(title),
				'</div>',
				'<div class="w-details"><span>' , categories.getLabel(obj.cat) , '</span> - ', eventLength ,'</div>',
				'<div class="w-comments"><i class="fa fa-comment"></i> ', obj.com ,'</div>',
			'</div>'
		].join('');
	};

	self.getWouaf = function (obj, collapse) {
		collapse = collapse || false;
		var text = utils.textToHTML(obj.text);
		var authorUrl = url.getAbsoluteURLForStates([{name: 'user', value: obj.author[1]}]);
		var author = i18n.t('By {{author}}', {
			author: '<a href="'+ authorUrl +'" data-user="'+ utils.escapeHtml(obj.author[1]) +'">'+
					utils.escapeHtml(obj.author[2] || obj.author[1]) +'</a>',
			interpolation: {escape: false}
		});

		var content = ['<div data-id="'+ obj.id +'"',
			 	(collapse ? ' class="panel panel-default w-container">' : ' class="w-container">'),
			self.getHeader(obj, collapse),
			'<div',
				(collapse ? ' id="collapse-'+ obj.id +'" class="panel-collapse collapse w-content">' : ' class="w-content">'),
				'<button class="w-menu" data-id="'+ obj.id +'" type="button" data-menu="wouaf">',
					'<i class="fa fa-cog"></i> '+ i18n.t('Menu'),
				'</button>',
				'<div class="w-subTitle">', author ,'</div>',
					'<p>', text ,'</p>'];
		if (obj.pics && obj.pics.length) {
			content.push('<div class="w-pics">');
			var pic, thumb;
			for(var i = 0, l = obj.pics.length; i < l; i++) {
				pic = obj.pics[i];
				if (pic.substr(0, 4) === 'http' && pic.indexOf('imgur.com') !== -1) {
					//use https
					pic = pic.replace('http://', 'https://');
					//use "b" thumbnail
					thumb = pic.replace(/\.(jpg|png|gif|bmp|gifv)$/, 'b$&');
					content.push('<a rel="gallery-'+ obj.id +'" href="'+ pic +'" class="swipebox"><img src="'+ thumb +'" height="90" width="90" /></a>');
				}
			}
			content.push('</div>');
		}
		content = content.concat(['<a href="'+ url.getAbsoluteURLForStates([{name: 'wouaf', value: obj.id}, {name: 'windows', value: 'comments'}]) +'" class="w-comments" data-action="comments" data-menu="wouaf"><i class="fa fa-comment"></i> '+
							(obj.com ? i18n.t('{{count}} comment', {count: obj.com}) : i18n.t('Add a comment', {count: obj.com})) +'</a>',
				'</div>',
			'</div>']);
		return content.join('');
	};
	self.getClusterList = function(list, zoom) {
		var content = ['<div class="w-accordion">'];
		var l = list.length;
		var max = zoom !== 21 ? 10 : l;
		for(var i = 0; i < l && i < max ; i++) {
			content.push(self.getWouaf(list[i], true));
		}
		content.push('</div>');
		if (l > max) {
			content.push('<div class="w-more"><p class="text-muted text-xs-center">'+ i18n.t('{{count}} more. Zoom in to see all of them', {count: l - max}) +'</p></div>');
		}
		return content.join('');
	};

	return self;
})();