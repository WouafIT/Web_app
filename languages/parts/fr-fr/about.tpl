<div class="modal-header">
	<button type="button" class="close" data-dismiss="modal" aria-label="<%= htmlWebpackPlugin.options.i18n['Close'] %>">
		<span aria-hidden="true">&times;</span>
		<span class="sr-only"><%= htmlWebpackPlugin.options.i18n['Close'] %></span>
	</button>
	<h4 class="modal-title">A propos de Wouaf IT</h4>
</div>
<div class="modal-body">

	<div id="accordionAbout" role="tablist" aria-multiselectable="true">
		<div class="card">
			<div class="card-header" role="tab" id="headingAboutOne">
				<h5>
					<a data-toggle="collapse" data-parent="#accordionAbout" href="#collapseAboutOne" aria-expanded="true" aria-controls="collapseAboutOne">
						Quel est l'usage de Wouaf IT ?
					</a>
				</h5>
			</div>
			<div id="collapseAboutOne" class="collapse in" role="tabpanel" aria-labelledby="headingAboutOne">
				<div class="card-block">
					<p>Imaginez une source d'information géolocalisée où tout le monde peut signaler les événements locaux. De la manifestation
						de quartier à la vente de votre canapé en passant par le chien perdu du voisin.</p>

					<p>Les sources d'informations contributives ont déjà montré leur qualité et leur exhaustivité. Wikipedia, Twitter, Facebook,
						Reddit et bien d'autres sont irremplaçables pour nous informer.</p>

					<p>Wouaf IT souhaite mettre en avant les événements publics qui sont rares ou difficiles à trouver autour de vous.
						Tous ces événements qui n'ont que peu ou pas de budget marketing et sont rarement connus en dehors du cercle
						des proches de l'organisateur. Si le public sait qu'il y a quelque chose autour de lui, il pourra aussi en profiter !</p>

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
						<li>Lancer une alerte (accident, inondation, ...).</li>
						<li>Donner ou échanger des objets.</li>
						<li>et bien d'autres choses encore ...</li>
					</ul>

					<p>Sur Wouaf IT vous pouvez dire à tout le monde, tout ce qu'il se passe autour de vous.</p>

					<p class="text-xs-center"><img src="https://img.wouaf.it/outside.jpg" class="rounded img-fluid" /></p>
				</div>
			</div>
		</div>
		<div class="card">
			<div class="card-header" role="tab" id="headingAboutTwo">
				<h5>
					<a data-toggle="collapse" data-parent="#accordionAbout" href="#collapseAboutTwo" aria-expanded="true" aria-controls="collapseAboutTwo">
						Qui sommes nous ?
					</a>
				</h5>
			</div>
			<div id="collapseAboutTwo" class="collapse" role="tabpanel" aria-labelledby="headingAboutTwo">
				<div class="card-block">
					<p>Wouaf IT est l'initiative d'un père de famille aidé par des amis proches.
						Nous souhaitons fournir un nouveau service de qualité sur Internet qui recensera tous les événements de proximité.
						Nous sommes basés dans la technopole de Sophia Antipolis, près de Nice.</p>

					<p>L'utilisation et la publication sur Wouaf IT sont gratuites. Son code source est distribué sous licence libre Apache et
						est disponible sur <i class="fa fa-github"></i> <a href="https://github.com/WouafIT" target="_blank">Github</a>.</p>
				</div>
			</div>
		</div>
		<div class="card">
			<div class="card-header" role="tab" id="headingAboutThree">
				<h5>
					<a data-toggle="collapse" data-parent="#accordionAbout" href="#collapseAboutThree" aria-expanded="true" aria-controls="collapseAboutThree">
						Qui sont nos fournisseurs de contenu ?
					</a>
				</h5>
			</div>
			<div id="collapseAboutThree" class="collapse" role="tabpanel" aria-labelledby="headingAboutThree">
				<div class="card-block">
					<p>
						En dehors des nombreuses contributions des internautes eux mêmes, nous importons un certain nombre
						d'événements directement depuis des fournisseurs spécialisés dans l'événementiel ou dans un domaine
						spécifique qui trouve sa place sur Wouaf IT.
					</p>
					<p>En voici la liste, merci pour leur contribution !</p>
					<ul>
						<li><a href="/user/Fnac_Spectacles/">Fnac Spectacles</a></li>
						<li><a href="/user/Open_Agenda/">Open Agenda</a></li>
						<li><a href="/user/Chat_Perdu/">Chat Perdu</a></li>
						<li><a href="/user/Chien_Perdu/">Chien Perdu</a></li>
						<li><a href="/user/Infolocale/">Infolocale</a></li>
					</ul>
				</div>
			</div>
		</div>
	</div>
	<p>Suivez Wouaf IT sur <i class="fa fa-twitter"></i> <a href="https://twitter.com/Wouaf_IT" target="_blank">Twitter</a> et
		<i class="fa fa-facebook-official"></i> <a href="https://www.facebook.com/wouafit/" target="_blank">Facebook</a> pour plus d'informations !</p>
	<hr />
	<p>Wouaf IT © <%= htmlWebpackPlugin.options.data.year %>.</p>
</div>
<div class="modal-footer">
	<button type="button" class="btn btn-secondary" data-dismiss="modal"><%= htmlWebpackPlugin.options.i18n['Close'] %></button>
</div>