<div class="modal-header">
	<button type="button" class="close" data-dismiss="modal" aria-label="<%= htmlWebpackPlugin.options.i18n['Close'] %>">
		<span aria-hidden="true">&times;</span>
		<span class="sr-only"><%= htmlWebpackPlugin.options.i18n['Close'] %></span>
	</button>
	<h4 class="modal-title">Conditions Générales d'Utilisation</h4>
</div>
<div class="modal-body">
	<h5>Conditions d'utilisation :</h5>
	<p>Vous êtes responsable de l'usage que vous faites de ce service. Vos publications sont publiques et visibles de tous.</p>
	<p>Publier sur Wouaf IT requiert le strict respect de quelques règles simples :</p>
	<ul>
		<li>Ne publiez pas de contenu choquant ou pouvant porter atteinte à autrui (appels à la haine, propos xénophobes ou
			homophobes, diffamation, etc.).</li>
		<li>Ne vous faites pas passer pour toute autre personne ou entité.</li>
		<li>Ne publiez aucune information fausse, mensongère ou de nature à tromper, induire en erreur ou importuner quiconque.</li>
		<li>Ne proposez aucun service en désaccord avec les lois du pays concerné par votre publication.</li>
	</ul>
	<p>Wouaf IT supprimera toute publication ne respectant pas ces conditions d'utilisation dès qu'il en aura connaissance.</p>

	<h5>Protection des données personnelles :</h5>
	<p>Wouaf IT est et restera respectueux de vos données personnelles. Elles ne seront ni revendues ni exploitées commercialement
		en dehors de l'usage nécessaire au fonctionnement du service.</p>
	<p>Vous pouvez à tout moment supprimer votre profil. Vos données seront intégralement et immédiatement supprimées elles aussi.
		Un délai de quelques jours est nécessaire pour que cette suppression se propage aux sauvegardes du service.</p>

	<p>Suivez Wouaf IT sur <i class="fa fa-twitter"></i> <a href="https://twitter.com/Wouaf_IT" target="_blank">Twitter</a> et
		<i class="fa fa-facebook-official"></i> <a href="https://www.facebook.com/wouafit/" target="_blank">Facebook</a> pour plus d'informations !</p>
	<hr />
	<p>Wouaf IT © <%= htmlWebpackPlugin.options.data.year %>.</p>
</div>
<div class="modal-footer">
	<button type="button" class="btn btn-secondary" data-dismiss="modal"><%= htmlWebpackPlugin.options.i18n['Close'] %></button>
</div>