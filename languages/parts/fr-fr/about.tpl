<div class="modal-header">
	<button type="button" class="close" data-dismiss="modal" aria-label="<%= htmlWebpackPlugin.options.i18n['Close'] %>">
		<span aria-hidden="true">&times;</span>
		<span class="sr-only"><%= htmlWebpackPlugin.options.i18n['Close'] %></span>
	</button>
	<h4 class="modal-title">A propos de Wouaf IT</h4>
</div>
<div class="modal-body">
	<p>Imaginez une source d'information géolocalisée ou tout le monde peut signaler les événements locaux. De la manifestation
		de quartier à la vente de votre canapé en passant par le chien perdu du voisin.</p>

	<p>Les sources d'informations contributives ont déjà montré leur qualité et leur exhaustivité. Wikipedia, Twitter, Facebook,
		Reddit et bien autres sont irremplaçable pour nous informer.</p>

	<p>Wouaf IT souhaite mettre en avant les événements publics qui sont rares et difficiles à trouver autour de vous.
		Ces événements qui n'ont que peu ou pas de budget marketing et sont rarement connus en dehors du cercle
		des proches de l'organisateur. Si le public sait qu'il y a quelque chose, il pourra en profiter tous les jours.</p>

	<p>Quelques exemples de ce vous pouvez trouver et publier sur Wouaf IT :</p>
	<ul>
		<li>Informer d'une soirée à thème.</li>
		<li>Vendre un bien.</li>
		<li>Trouver un quatrième joueur de belote.</li>
		<li>Chercher quelqu'un pour amener ses enfants à l'école.</li>
		<li>Communiquer sur des promotions et des invendus.</li>
		<li>Offrir des services à domicile (garde d'enfants, ménage, jardinage, ...).</li>
		<li>Chercher des partenaires de sortie.</li>
		<li>Retrouver un animal ou un objet perdu et prévenir d'un animal ou d'un objet trouvé.</li>
		<li>Lancer une alerte (accident, innondation, ...).</li>
		<li>Donner ou échanger des objets.</li>
		<li>et bien d'autres choses encore ...</li>
	</ul>

	<p>Sur Wouaf IT vous pouvez dire à tout le monde, tout ce qu'il se passe autour de vous.</p>

	<p>Suivez Wouaf IT sur <i class="fa fa-twitter"></i> <a href="https://twitter.com/Wouaf_IT" target=_blank">Twitter</a> et
		<i class="fa fa-facebook-official"></i> <a href="https://www.facebook.com/wouafit/" target=_blank">Facebook</a> pour plus d'informations !</p>

	<p>L'utilisation de Wouaf IT est gratuit. Son code source est distribué sous licence libre Apache et
		disponible sur <i class="fa fa-github"></i> <a href="https://github.com/WouafIT">Github</a>.</p>
	<hr />
	<p>Wouaf IT © <%= htmlWebpackPlugin.options.data.year %>.</p>
</div>
<div class="modal-footer">
	<button type="button" class="btn btn-secondary" data-dismiss="modal"><%= htmlWebpackPlugin.options.i18n['Close'] %></button>
</div>