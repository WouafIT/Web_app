module.exports = (function() {
	var i18n = require('../resource/i18n.js');
	var twitterText = require('twitter-text');
	var utils = require('../utils');
	var categories = require('../resource/categories.js');

	/*
	 icone
	 Catégorie : Perdue / trouvé
	 Par : Auteur (lien vers fiche auteur)
	 Titre (à ajouter)
	 Texte (avec liens et hashtag clicables)
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

	/**/

	var getCurrentPath = function() {
		var l = window.location;
		return l.protocol+'//'+l.host+l.pathname;
	}

	var textToHTML = function(text) {
		//create HTML text content
		//grab links and tags positions
		var path = getCurrentPath();
		var entities = twitterText.extractUrlsWithIndices(text)
			.concat(twitterText.extractMentionsOrListsWithIndices(text))
			.concat(twitterText.extractHashtagsWithIndices(text, {checkUrlOverlap: false}));
		if (entities.length) {
			twitterText.removeOverlappingEntities(entities);
		}

		var pos = 0;
		var textContent = '';
		for (var i = 0, l = entities.length; i < l; i++) {
			var hash = entities[i].hashtag;
			var screenName = entities[i].screenName;
			var url = entities[i].url;
			var indices = entities[i].indices;
			//text before entity
			textContent += text.substr(pos, indices[0] - pos);
			//entity
			if (screenName) {
				textContent += '<a href="'+ path +'user/'+ screenName +'/" data-user="'+ screenName +'">@' + screenName + '</a>';
			} else if (hash) { //hash
				textContent += '<a href="'+ path +'hash/'+ hash +'/" data-hash="'+ hash +'">#' + hash + '</a>';
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
		var author = i18n.t('By {{author}}', {author: '<a href="'+ path +'user/'+ obj.author[0] +'/" data-user="'+ obj.author[0] +'">'+ utils.escapeHtml(obj.author[1]) +'</a>', interpolation: {escape: false}});
		var content = '<div class="w-container">' +
			'<div class="w-title" style="background-color: '+ categories.getColor(obj.cat) +';">'+ title +
				'<div class="w-cat cat'+ obj.cat +'">' + categories.getLabel(obj.cat) + '</div>'+
			'</div>' +
			'<div class="w-content">' +
			'<div class="w-subTitle">'+ author +'</div>';
		if (obj.pics.length) {
			content += '<img src="http://maps.marnoto.com/en/5wayscustomizeinfowindow/images/vistalegre.jpg" alt="Porcelain Factory of Vista Alegre" height="115" width="83">';
		}
		content += '<p>'+ text +'</p>' +
			'</div>' +
			'<div class="w-bottom"></div>' +
			'</div>';
		return content;
	};
	self.getList = function(list) {
		return '';
	};

	return self;
})();