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
module.exports = (function() {
	var map = require('../singleton/map.js');
	var $document = $(document);

	$document.on('app.wouaf-show', function(e, data) {


		console.info(data);
		console.info(map.getResults());
		// InfoWindow content
		var content = '<div id="iw-container">' +
		 '<div class="iw-title">Porcelain Factory of Vista Alegre</div>' +
		 '<div class="iw-content">' +
		 '<div class="iw-subTitle">History</div>' +
		 '<img src="http://maps.marnoto.com/en/5wayscustomizeinfowindow/images/vistalegre.jpg" alt="Porcelain Factory of Vista Alegre" height="115" width="83">' +
		 '<p>Founded in 1824, the Porcelain Factory of Vista Alegre was the first industrial unit dedicated to porcelain production in Portugal. For the foundation and success of this risky industrial development was crucial the spirit of persistence of its founder, José Ferreira Pinto Basto. Leading figure in Portuguese society of the nineteenth century farm owner, daring dealer, wisely incorporated the liberal ideas of the century, having become "the first example of free enterprise" in Portugal.</p>' +
		 '<div class="iw-subTitle">Contacts</div>' +
		 '<p>VISTA ALEGRE ATLANTIS, SA<br>3830-292 Ílhavo - Portugal<br>'+
		 '<br>Phone. +351 234 320 600<br>e-mail: geral@vaa.pt<br>www: www.myvistaalegre.com</p>'+
		 '</div>' +
		 '<div class="iw-bottom-gradient"></div>' +
		 '</div>';
		data.iw.setContent(content);
		data.iw.open(data.map);
	});
})();
