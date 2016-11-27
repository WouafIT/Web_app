<div class="modal-header">
	<button type="button" class="close" data-dismiss="modal" aria-label="<%= htmlWebpackPlugin.options.i18n['Close'] %>">
		<span aria-hidden="true">&times;</span>
		<span class="sr-only"><%= htmlWebpackPlugin.options.i18n['Close'] %></span>
	</button>
	<h4 class="modal-title">Questions fréquentes</h4>
</div>
<div class="modal-body">
	<p>Sur cette page vous trouverez les réponses aux questions les plus fréquentes. Si vous ne trouvez pas votre réponse,
		que vous rencontrez un problème ou pour toute autre raison, n'hésitez pas à
		<a href="/contact/" data-href="contact" data-show="modal" data-target="#modalWindow">nous contacter</a> !</p>
	<div id="accordion" role="tablist" aria-multiselectable="true">
		<div class="card">
			<div class="card-header" role="tab" id="headingThirteen">
				<h5>
					<a data-toggle="collapse" data-parent="#accordion" href="#collapseThirteen" aria-expanded="true" aria-controls="collapseThirteen">
						Comment ajouter un événement sur Wouaf IT ?
					</a>
				</h5>
			</div>
			<div id="collapseThirteen" class="collapse" role="tabpanel" aria-labelledby="headingThirteen">
				<div class="card-block">
					<p>Sur Wouaf IT, un événement se nomme un Wouaf.</p>
					<p>Vous pouvez ajouter autant de Wouafs que vous le souhaitez, la procédure est très simple :</p>
					<p>Tout d'abord, créez votre compte sur Wouaf IT à partir de
						<a href="/login/" data-href="login" data-show="modal" data-target="#modalWindow">la page de connexion</a>.</p>
					<p>Deux types de comptes sont disponibles : Si vous disposez d'un compte Facebook, cliquez sur le bouton bleu
						"Connexion avec Facebook" et saisissez vos information de connexion dans la fenêtre Facebook qui s'est ouverte.
						Sinon, vous pouvez créer un compte Wouaf IT en cliquant sur le bouton vert "Nouveau Wouaffeur ? Créez votre compte !"
						puis en saisissant vos informations d'identification.</p>
					<p>Une fois votre compte créé, vous pouvez créer un Wouaf en cliquant sur l'icone <i class="fa fa-plus-circle"></i>
						en bas à droite de la carte. Positionnez d'abord la carte à l'endroit de votre événement et cliquez sur "OK".
						Une page s'ouvrira alors qui vous permettra de renseigner toutes les informations de votre événement.</p>
				</div>
			</div>
		</div>
		<div class="card">
			<div class="card-header" role="tab" id="headingOne">
				<h5>
					<a data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
						Quelles sont les limites de contenu d'un Wouaf ?
					</a>
				</h5>
			</div>
			<div id="collapseOne" class="collapse" role="tabpanel" aria-labelledby="headingOne">
				<div class="card-block">
					<p>Il y en a quelques-unes :</p>
					<ul>
						<li>Le texte ne peut pas dépasser 300 caractères.</li>
						<li>Le titre ne peut pas dépasser 80 caractères.</li>
						<li>Pas plus de 3 images.</li>
						<li>La durée de validité ne doit pas excéder 4 semaines.</li>
						<li>... et évidemment le contenu de votre Wouaf doit respecter les
							<a href="/tos/" data-href="tos" data-show="modal" data-target="#modalWindow">conditions d'utilisation</a>.</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="card">
			<div class="card-header" role="tab" id="headingTwo">
				<h5>
					<a data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
						Comment puis-je modifier un Wouaf ?
					</a>
				</h5>
			</div>
			<div id="collapseTwo" class="collapse" role="tabpanel" aria-labelledby="headingTwo">
				<div class="card-block">
					<p>Vous ne pouvez pas. Si vous avez fait une erreur ou que vous souhaitez mettre à jour un Wouaf, vous devez le
					supprimer puis le recréer.</p>
				</div>
			</div>
		</div>
		<div class="card">
			<div class="card-header" role="tab" id="headingThree">
				<h5>
					<a data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="true" aria-controls="collapseThree">
						Pourquoi ces contraintes ?
					</a>
				</h5>
			</div>
			<div id="collapseThree" class="collapse" role="tabpanel" aria-labelledby="headingThree">
				<div class="card-block">
					<p>Un Wouaf doit rester un événement rapide à consulter et éphémère. C'est dans cette optique qu'a été pensé
					Wouaf IT et ces contraintes découlent directement de ces choix. Si vous le souhaitez, vous pouvez ajouter un
					commentaire explicatif ou un lien "Plus d'infos" à votre Wouaf.</p>
				</div>
			</div>
		</div>
		<div class="card">
			<div class="card-header" role="tab" id="headingFour">
				<h5>
					<a data-toggle="collapse" data-parent="#accordion" href="#collapseFour" aria-expanded="true" aria-controls="collapseFour">
						Comment puis-je ajouter un avatar sur mon profil ?
					</a>
				</h5>
			</div>
			<div id="collapseFour" class="collapse" role="tabpanel" aria-labelledby="headingFour">
				<div class="card-block">
					<p>Wouaf IT utilise <a href="http://gravatar.com" target="_blank">Gravatar</a> pour la gestion des avatars de ses utilisateurs.
					Pour ajouter un avatar à votre compte, vous n'avez qu'à créer un compte
					<a href="http://gravatar.com" target="_blank">Gravatar</a> avec la même adresse email que vous employez sur Wouaf IT.</p>
				</div>
			</div>
		</div>
		<div class="card">
			<div class="card-header" role="tab" id="headingFive">
				<h5>
					<a data-toggle="collapse" data-parent="#accordion" href="#collapseFive" aria-expanded="true" aria-controls="collapseFive">
						Puis-je publier du contenu à but lucratif sur Wouaf IT ?
					</a>
				</h5>
			</div>
			<div id="collapseFive" class="collapse" role="tabpanel" aria-labelledby="headingFive">
				<div class="card-block">
					<p>Oui, tant que ce contenu respecte nos <a href="/tos/" data-href="tos" data-show="modal" data-target="#modalWindow">
						conditions d'utilisation</a>, vous pouvez le publier.</p>
				</div>
			</div>
		</div>
		<div class="card">
			<div class="card-header" role="tab" id="headingSix">
				<h5>
					<a data-toggle="collapse" data-parent="#accordion" href="#collapseSix" aria-expanded="true" aria-controls="collapseSix">
						Mes événements Facebook ont été importés, comment puis-je les gérer ?
					</a>
				</h5>
			</div>
			<div id="collapseSix" class="collapse" role="tabpanel" aria-labelledby="headingSix">
				<div class="card-block">
					<p>Nous avons importons régulièrement un certain nombre de sources de contenu disponibles sur Internet,
						parmi lesquelles les événements publics publiés sur les pages de Facebook.
						<br />
						Si vous êtes l'administrateur de l'une de ces pages, vous pouvez regagner le contrôle de vos événements sur Wouaf IT en suivant ces étapes :
					</p>
					<ol>
						<li>Connectez-vous à Wouaf IT à l'aide de votre compte Facebook (bouton "Connection avec Facebook" sur la
							<a href="/login/" data-href="login" data-show="modal" data-target="#modalWindow">page de connexion</a>).</li>
						<li>Attention à bien autoriser Wouaf IT à accéder à vos événements et pages Facebook lors de la première connexion.</li>
						<li>Une fois connecté, allez dans votre profil puis cliquez sur le bouton "Vos événements Facebook".</li>
						<li>Sur la page qui s'ouvrira, cliquez sur "Importer les événements de vos pages".</li>
						<li>Cette opération prendra quelques minutes et une fois effectuée, vous recevrez un email de confirmation.</li>
						<li>Durant cette opération d'import, Wouaf IT associera aussi vos événements Facebook préalablement importés à
							votre compte Wouaf IT, ainsi vous pourrez facilement les gérer.</li>
					</ol>

					<p>Si cela ne réponds pas à votre besoin (si votre compte Facebook est un compte personnel mais qu'il est rattaché à une page pro ou à plusieurs
						pages distinctes), nous n'avons malheureusement pas encore de moyen automatique pour importer vos événements Facebook vers un compte "pro" ou
						plusieurs comptes distincts sur Wouaf IT.</p>

					<p>Cependant, vous pouvez créer un ou plusieurs comptes Wouaf IT classiques aux noms et avec les adresses emails de vos entreprises et saisir
						directement vos événements dans Wouaf IT.</p>

					<p>N'hésitez pas à <a href="/contact/" data-href="contact" data-show="modal" data-target="#modalWindow">nous contacter</a>
						si vous avez des questions ou en cas de problème !</p>
				</div>
			</div>
		</div>
		<div class="card">
			<div class="card-header" role="tab" id="headingFourteen">
				<h5>
					<a data-toggle="collapse" data-parent="#accordion" href="#collapseFourteen" aria-expanded="true" aria-controls="collapseFourteen">
						A quelle fréquence sont importés les événements Facebook ?
					</a>
				</h5>
			</div>
			<div id="collapseFourteen" class="collapse" role="tabpanel" aria-labelledby="headingFourteen">
				<div class="card-block">
					<p>Les événements Facebook sont importés une fois par semaine.</p>
					<p>Une fois qu'un événement Facebook a été importé dans notre système, il ne sera plus mis à jour,
						même si l'événement d'origine est modifié sur Facebook.</p>
					<p>Cependant, une fois que vous avez créé votre compte sur Wouaf IT à l'aide du bouton "Connection avec Facebook"
						vous pouvez gérer vous même vos événements directement depuis notre site.</p>
				</div>
			</div>
		</div>
		<div class="card">
			<div class="card-header" role="tab" id="headingSeven">
				<h5>
					<a data-toggle="collapse" data-parent="#accordion" href="#collapseSeven" aria-expanded="true" aria-controls="collapseSeven">
						Wouaf IT est-il payant ?
					</a>
				</h5>
			</div>
			<div id="collapseSeven" class="collapse" role="tabpanel" aria-labelledby="headingSeven">
				<div class="card-block">
					<p>Non Wouaf IT n'est pas payant et il restera gratuit pour les particuliers et petites entreprises !</p>
				</div>
			</div>
		</div>
		<div class="card">
			<div class="card-header" role="tab" id="headingFifteen">
				<h5>
					<a data-toggle="collapse" data-parent="#accordion" href="#collapseFifteen" aria-expanded="true" aria-controls="collapseFifteen">
						Pourquoi la carte me positionne mal à l'ouverture du site ?
					</a>
				</h5>
			</div>
			<div id="collapseFifteen" class="collapse" role="tabpanel" aria-labelledby="headingFifteen">
				<div class="card-block">
					<p>La position de la carte lors de l'ouverture du site dépend de la position qui nous est retournée
						par votre navigateur internet lorsque vous vous rendez sur le site.</p>
					<p>Selon le navigateur employé, selon votre fournisseur d'accès et selon que vous acceptez ou non d'être géolocalisé
						à l'ouverture du site, cette dernière peut être plus ou moins précise.</p>
					<p>Pour des questions de respect de vie privée nous nous refusons à effectuer un tracking géographique
						plus agressif de nos utilisateurs, nous ne pouvons donc rien faire pour améliorer votre position lors de l'ouverture du site.</p>
				</div>
			</div>
		</div>
		<div class="card">
			<div class="card-header" role="tab" id="headingEight">
				<h5>
					<a data-toggle="collapse" data-parent="#accordion" href="#collapseEight" aria-expanded="true" aria-controls="collapseEight">
						Wouaf IT est-il international ?
					</a>
				</h5>
			</div>
			<div id="collapseEight" class="collapse" role="tabpanel" aria-labelledby="headingEight">
				<div class="card-block">
					<p>A terme oui, Wouaf IT a pour objectif de couvrir tous les pays, mais nous allons monter doucement en puissance.
					Vous pouvez déjà créer des Wouafs ou vous le souhaitez et nous ajouterons d'autres sources de contenu petit à petit.</p>
				</div>
			</div>
		</div>
		<div class="card">
			<div class="card-header" role="tab" id="headingNine">
				<h5>
					<a data-toggle="collapse" data-parent="#accordion" href="#collapseNine" aria-expanded="true" aria-controls="collapseNine">
						Y a-t-il des applications mobiles pour Wouaf IT ?
					</a>
				</h5>
			</div>
			<div id="collapseNine" class="collapse" role="tabpanel" aria-labelledby="headingNine">
				<div class="card-block">
					<p>Le site internet a été conçu pour être parfaitement compatible avec les mobiles. Par ailleurs, si vous employez Chrome sur Android,
					Wouaf IT vous proposera d'installer un raccourci sur votre écran d'accueil à partir du deuxième lancement à 24h d'intervalle.
					Enfin, à terme, des applications natives sont bien prévues pour Android et iOS mais il n'y a pas encore de calendrier précis pour cela.</p>
				</div>
			</div>
		</div>
		<div class="card">
			<div class="card-header" role="tab" id="headingTen">
				<h5>
					<a data-toggle="collapse" data-parent="#accordion" href="#collapseTen" aria-expanded="true" aria-controls="collapseTen">
						Que veut dire Wouaf IT ?
					</a>
				</h5>
			</div>
			<div id="collapseTen" class="collapse" role="tabpanel" aria-labelledby="headingTen">
				<div class="card-block">
					<p>L'idée derrière Wouaf IT remonte à 2012, lors d'un trajet en voiture à la campagne en famille. Nous avons croisé
						un chien errant sur la route. Il semblait visiblement perdu et a pris la fuite lorsque nous avons voulu l'approcher.
						Nous avons alors pensé que son maitre n'était peut-être qu'à quelques minutes de là en train de le chercher mais nous n'avions
						aucun moyen simple de pouvoir l'avertir.
						<br />
						C'est de cette histoire qu'est née l'idée derrière Wouaf IT : Proposer un service qui permette à tout un chacun
						de pouvoir dire aux gens géographiquement proches "Hey, ici il se passe quelque chose !".
						<br />
						Cette idée a pris le temps de murir pour devenir le site actuel après quelques mois de développement.
						Nous avons donc nommé "Wouaf" une publication sur le site en référence à ce chien qui, nous l'espérons, a retrouvé
						son maitre.
					</p>
				</div>
			</div>
		</div>
		<div class="card">
			<div class="card-header" role="tab" id="headingEleven">
				<h5>
					<a data-toggle="collapse" data-parent="#accordion" href="#collapseEleven" aria-expanded="true" aria-controls="collapseEleven">
						J'ai du contenu que je souhaite importer automatiquement dans Wouaf IT, comment faire ?
					</a>
				</h5>
			</div>
			<div id="collapseEleven" class="collapse" role="tabpanel" aria-labelledby="headingEleven">
				<div class="card-block">
					<p>Nous pouvons vous donner accès à l'API de Wouaf IT. Selon la nature de votre contenu, cet accès ne sera peut-être pas gratuit.
					Actuellement Wouaf IT est un projet à but non lucratif. Ceci étant, il génère des frais d'infrastructure et
					si vous tirez des bénéfices de votre contenu, il est normal de vous demander une contribution en retour.
					Pour en savoir plus, <a href="/contact/" data-href="contact" data-show="modal" data-target="#modalWindow">contactez-nous</a>
					en décrivant ce que vous souhaitez importer.</p>
				</div>
			</div>
		</div>
		<div class="card">
			<div class="card-header" role="tab" id="headingTwelve">
				<h5>
					<a data-toggle="collapse" data-parent="#accordion" href="#collapseTwelve" aria-expanded="true" aria-controls="collapseTwelve">
						J'aime Wouaf IT, comment faire ?
					</a>
				</h5>
			</div>
			<div id="collapseTwelve" class="collapse" role="tabpanel" aria-labelledby="headingTwelve">
				<div class="card-block">
					<p>Le développement de Wouaf IT et la visibilité des événements qui y sont publiés dépendent d'abord de l'audience du site.
						Vous pouvez donc parler de Wouaf IT autour de vous et sur vos réseaux sociaux. Le bouche à oreille est la meilleure des aides !
					</p>
					<p>Nous avons aussi besoin de bonnes volontés pour traduire le site en différentes langues, notamment Espagnol, Allemand, etc.
						Si vous souhaitez contribuer aux traductions,
						<a href="/contact/" data-href="contact" data-show="modal" data-target="#modalWindow">contactez-nous</a>.</p>
					<p>Enfin, vous pouvez aller voir la page <i class="fa fa-github"></i> <a href="https://github.com/WouafIT" target="_blank">Github</a>
						du projet, certaines informations complémentaires s'y trouvent.</p>
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