module.exports = (function() {
	var i18n = require('../resource/i18n.js');
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

	var self = {};
	self.getWouaf = function (obj) {
		var l = window.location;
		var path = l.protocol+'//'+l.host+l.pathname;
		var title = obj.title || obj.text.substr(0, 49) +'…';
		var text = obj.text;
		var author = i18n.t('By {{author}}', {author: '<a href="'+ path +'u:'+ obj.author[0] +'/" data-user="'+ obj.author[0] +'">'+ utils.escapeHtml(obj.author[1]) +'</a>', interpolation: {escape: false}});
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