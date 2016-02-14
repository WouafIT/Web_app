module.exports = (function() {
	var i18n = require('../resource/i18n.js');
	var twitterText = require('twitter-text');
	var utils = require('../utils');
	var categories = require('../resource/categories.js');
	var dtp = require('../resource/datetimepicker.js');

	var getCurrentPath = function() {
		var l = window.location;
		return l.protocol+'//'+l.host+l.pathname;
	}

	var textToHTML = function(text) {
		//remove HTML
		text = utils.escapeHtml(text);
		//create HTML text content
		//grab links and tags positions
		var path = getCurrentPath();
		var entities = twitterText.extractUrlsWithIndices(text)
			.concat(twitterText.extractMentionsOrListsWithIndices(text))
			/*.concat(twitterText.extractHashtagsWithIndices(text, {checkUrlOverlap: false}))*/;
		if (entities.length) {
			twitterText.removeOverlappingEntities(entities);
		}

		var pos = 0;
		var textContent = '';
		for (var i = 0, l = entities.length; i < l; i++) {
			//var hash = entities[i].hashtag;
			var screenName = entities[i].screenName;
			var url = entities[i].url;
			var indices = entities[i].indices;
			//text before entity
			textContent += text.substr(pos, indices[0] - pos);
			//entity
			if (screenName) {
				textContent += '<a href="'+ path +'user/'+ screenName +'/" data-user="'+ screenName +'">@' + screenName + '</a>';
			/*} else if (hash) { //hash
				textContent += '<a href="'+ path +'hash/'+ hash +'/" data-hash="'+ hash +'">#' + hash + '</a>';*/
			} else if (url) { //link
				textContent += '<a href="'+ (url.substr(0, 4) != 'http' ? 'http://' : '') + url +'" target="_blank">' + url + '</a>';
			}
			pos = indices[1];
		}
		if (pos != text.length) {
			//text after entities
			textContent += text.substr(pos, text.length - pos);
		}
		return textContent.replace(/\r?\n/g, "<br />");
	}

	var self = {};
	self.getWouaf = function (obj) {
		var path = getCurrentPath();
		var title = obj.title || obj.text.substr(0, 49) +'…';
		var text = textToHTML(obj.text);
		var author = i18n.t('By {{author}}', {
			author: '<a href="'+ path +'user/'+ obj.author[1] +'/" data-user="'+ obj.author[1] +'">'+
					utils.escapeHtml(obj.author[2] || obj.author[1]) +'</a>',
			interpolation: {escape: false}
		});
		//state
		var time = new Date();
		obj.state = (obj.date[0].sec * 1000) > time.getTime() ? 'post' : ((obj.date[1].sec * 1000) < time.getTime() ? 'past' : 'current');
		if (obj.state != 'current') {
			//todo
		}
		//length
		var start = new Date();
		start.setTime(obj.date[0].sec * 1000);
		var length = obj.date[1].sec - obj.date[0].sec;
		var eventLength;
		var oneDay = 86400;
		var oneHour = 3600;
		if (length >= oneDay && length % oneDay == 0 && (length / oneDay) < 10) {
			eventLength = i18n.t('{{count}} day', {count: length / oneDay});
		} else if (length % oneHour == 0)  {
			eventLength = i18n.t('{{count}} hour', {count: length / oneHour});
		}
		var timeStart;
		if (!eventLength) {
			var end = new Date();
			end.setTime(obj.date[1].sec * 1000);
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

		console.info(obj, eventLength);



		/*
		 Images
		 Date (du 22 novembre 10:00 au 23 nov. 10:00)
		 Nombre de favoris (up/downvotes ?)

		 Actions :
		 - Contacter l'auteur
		 - Ajouter à vos favoris
		 - Ajouter un commentaire
		 - J'aime
		 - Partage réseaux sociaux (FB, Tw, G+, ...)
		 - Voir sur Gmap (intérêt ?)
		 - Aller à cet endroit
		 - Signaler un contenu abusif
		 */

		var content = ['<div class="w-container">',
			'<div class="w-title" style="background-color: ', categories.getColor(obj.cat) ,';">', utils.escapeHtml(title),
				'<div class="w-cat cat', obj.cat ,'"><span>' , categories.getLabel(obj.cat) , '</span> - ', eventLength ,'</div>',
			'</div>',
			'<div class="w-menu dropdown">',
				'<button id="dLabel-'+ obj.id +'" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">',
					'<i class="fa fa-chevron-circle-down"></i>',
				'</button>',
				'<div class="dropdown-menu dropdown-menu-right" aria-labelledby="dLabel-'+ obj.id +'">',
					'<h6 class="dropdown-header">Actions</h6>',
					'<a class="dropdown-item" href="#"><i class="fa fa-envelope"></i> Contacter l\'auteur</a>',
					'<a class="dropdown-item" href="#"><i class="fa fa-star"></i> Ajouter à vos favoris</a>',
					'<a class="dropdown-item" href="#"><i class="fa fa-comment"></i> Ajouter un commentaire</a>',
					'<a class="dropdown-item" href="#"><i class="fa fa-heart"></i> J\aime</a>',
					'<a class="dropdown-item" href="#"><i class="fa fa-share-alt"></i> Partager</a>',
					'<a class="dropdown-item" href="#"><i class="fa fa-map"></i> Voir sur Google Map</a>',
					'<a class="dropdown-item" href="#"><i class="fa fa-location-arrow"></i> Itinéraire vers ce lieu</a>',
					'<a class="dropdown-item" href="#"><i class="fa fa-ban"></i> Signaler un contenu abusif</a>',
				'</div>',
			'</div>',
			'<div class="w-content">',
				'<div class="w-subTitle">', author ,'</div>',
					'<p>', text ,'</p>'];
		if (obj.pics.length) {
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
		}
		content.concat(['</div>',
				'<div class="w-bottom"></div>',
			'</div>']);
		return content.join('');
	};
	self.getList = function(list) {
		return '';
	};

	return self;
})();