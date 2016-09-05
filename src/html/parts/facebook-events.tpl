<div data-ui="facebook-events">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-label="<%= htmlWebpackPlugin.options.i18n['Close'] %>">
			<span aria-hidden="true">&times;</span>
			<span class="sr-only"><%= htmlWebpackPlugin.options.i18n['Close'] %></span>
		</button>
		<h4 class="modal-title"><%= htmlWebpackPlugin.options.i18n['Your Facebook events'] %></h4>
	</div>
	<div class="modal-body">
		<h3>Importation de vos évènements Facebook</h3>
		<p>Wouaf IT vous permet d'importer en un clic les évènements public que vous avez déjà créé sur Facebook.</p>
		<p>Ainsi vous pourrez en faire profiter la communauté Wouaf IT et les rendres plus visibles grace à notre carte interactive. Vos évènements conserveront un lien vers leur page originale sur Facebook.</p>
		<p>Vous pourrez à tout moment les supprimer de Wouaf IT si vous le souhaitez.</p>

		<h4>Importer vos évènements personnels</h4>
		<p>Seuls les évènements public dont vous êtes l'auteur seront importés.</p>
		<p>Si vous avez déjà importé des évènements, ils ne seront pas réimportés, seuls les nouveaux évènements seront ajoutés.</p>
		<p class="text-xs-center"><button type="button" class="btn btn-secondary btn-facebook"><i class="fa fa-cloud-download"></i> <%= htmlWebpackPlugin.options.i18n['Import'] %></button></p>
		<hr />

		<h4>Importer les évènements de vos pages</h4>
		<p>Seuls les évènements public des pages Facebook dont vous êtes administrateur seront importés.</p>
		<p>Si vous avez déjà importé des évènements, ils ne seront pas réimportés, seuls les nouveaux évènements seront ajoutés.</p>
		<p>Si des évènements publics de vos pages Facebook ont déjà été automatiquement importés, ils seront rattachés à votre compte Wouaf IT, vous pourrez ainsi les gérer comme vous le souhaitez.</p>
		<p class="text-xs-center"><button type="button" class="btn btn-secondary btn-facebook"><i class="fa fa-cloud-download"></i> <%= htmlWebpackPlugin.options.i18n['Import'] %></button></p>

	</div>
	<div class="modal-footer">
		<button type="button" class="btn btn-secondary" data-dismiss="modal"><%= htmlWebpackPlugin.options.i18n['Cancel'] %></button>
	</div>
</div>