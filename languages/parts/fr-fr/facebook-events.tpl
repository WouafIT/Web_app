<div data-ui="facebook-events">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-label="<%= htmlWebpackPlugin.options.i18n['Close'] %>">
			<span aria-hidden="true">&times;</span>
			<span class="sr-only"><%= htmlWebpackPlugin.options.i18n['Close'] %></span>
		</button>
		<h4 class="modal-title"><%= htmlWebpackPlugin.options.i18n['Your Facebook events'] %></h4>
	</div>
	<div class="modal-body">
		<div class="no-email alert alert-danger" role="alert" hidden>
			<p><strong>Votre profil ne comporte pas d'adresse email. Vous ne pouvez pas importer vos événements Facebook.</strong></p>
			<p>Pour accéder à l'import des événements Facebook vous devez d'abord :</p>
			<ol>
				<li>Editer <a href="/profile/" data-href="profile" data-show="modal" data-target="#modalWindow">votre profil</a>
					et ajouter une adresse email.</li>
				<li>Valider votre nouvelle adresse email en cliquant sur le lien de confirmation contenu dans l'email que vous recevrez.</li>
			</ol>
		</div>

		<h3>Importation de vos événements Facebook</h3>
		<p>Wouaf IT vous permet d'importer en un clic les événements <strong>publics</strong> que vous avez déjà créé sur Facebook.</p>
		<p>Ainsi vous pourrez en faire profiter la communauté Wouaf IT et les rendre plus visibles grâce à la carte interactive.
			Vos événements conserveront un lien vers leur page originale sur Facebook.</p>
		<p>Vous pourrez à tout moment les supprimer de Wouaf IT si vous le souhaitez.</p>

		<div id="accordion" role="tablist" aria-multiselectable="true">
			<div class="card">
				<div class="card-header" role="tab" id="headingEvent">
					<h5>
						<a data-toggle="collapse" data-parent="#accordion" href="#collapseEvent" aria-expanded="true" aria-controls="collapseEvent">
							Importer vos événements personnels
						</a>
					</h5>
				</div>
				<div id="collapseEvent" class="collapse" role="tabpanel" aria-labelledby="headingEvent">
					<div class="card-block">
						<p>Seuls les événements publics dont vous êtes l'auteur seront importés.</p>
						<p>Si vous avez déjà importé des événements, ils ne seront pas réimportés, seuls les nouveaux événements seront ajoutés.</p>

						<div class="events-disabled alert alert-danger" role="alert" hidden>
							<strong>Oh zut !</strong> Vous n'avez pas accordé à Wouaf IT la permission de voir vos événements Facebook.
							Nous ne pouvons donc pas les importer ...
							<div class="text-xs-center"><button type="button" class="btn btn-success btn-sm events-rerequest">Y remédier ?</button></div>
						</div>

						<div class="no-events alert alert-warning" role="alert" hidden>
							<strong>Oh zut !</strong> Vous n'avez aucun événement public à venir. Nous ne pouvons donc rien importer ...
						</div>

						<p class="text-xs-center"><button type="button" class="btn btn-secondary btn-facebook events-import" disabled>
								<i class="fa fa-cloud-download"></i> <%= htmlWebpackPlugin.options.i18n['Import'] %></button></p>
					</div>
				</div>
			</div>
			<div class="card">
				<div class="card-header" role="tab" id="headingPage">
					<h5>
						<a data-toggle="collapse" data-parent="#accordion" href="#collapsePage" aria-expanded="true" aria-controls="collapsePage">
							Importer les événements de vos pages
						</a>
					</h5>
				</div>
				<div id="collapsePage" class="collapse" role="tabpanel" aria-labelledby="headingPage">
					<div class="card-block">
						<p>Seuls les événements publics des pages Facebook dont vous êtes administrateur seront importés dans votre compte Wouaf IT.</p>
						<p>Si vous avez déjà importé des événements, ils ne seront pas réimportés, seuls les nouveaux événements seront ajoutés.</p>
						<p>Si des événements publics de vos pages Facebook ont déjà été automatiquement importés, ils seront rattachés à votre compte Wouaf IT,
							vous pourrez ainsi les gérer comme vous le souhaitez.</p>

						<div class="pages-disabled alert alert-danger" role="alert" hidden>
							<strong>Oh zut !</strong> Vous n'avez pas accordé à Wouaf IT la permission de voir vos pages Facebook.
							Nous ne pouvons donc pas importer vos événements ...
							<div class="text-xs-center"><button type="button" class="btn btn-success btn-sm pages-rerequest">Y remédier ?</button></div>
						</div>

						<div class="no-pages-events alert alert-warning" role="alert" hidden>
							<strong>Oh zut !</strong> Vous n'avez aucune page Facebook dont vous êtes administrateur. Nous ne pouvons donc rien importer ...
						</div>

						<p class="text-xs-center"><button type="button" class="btn btn-secondary btn-facebook pages-import" disabled>
								<i class="fa fa-cloud-download"></i> <%= htmlWebpackPlugin.options.i18n['Import'] %></button></p>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="modal-footer">
		<button type="button" class="btn btn-secondary" data-dismiss="modal"><%= htmlWebpackPlugin.options.i18n['Cancel'] %></button>
	</div>
</div>