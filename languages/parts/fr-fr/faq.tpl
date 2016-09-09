<div class="modal-header">
	<button type="button" class="close" data-dismiss="modal" aria-label="<%= htmlWebpackPlugin.options.i18n['Close'] %>">
		<span aria-hidden="true">&times;</span>
		<span class="sr-only"><%= htmlWebpackPlugin.options.i18n['Close'] %></span>
	</button>
	<h4 class="modal-title">Questions fréquentes</h4>
</div>
<div class="modal-body">
	<p>Puis-je modifier un Wouaf ?</p>
	<p>Mes évènements Facebook ont été importés, comment puis-je les gérer ?</p>
	<p>Wouaf IT est-il payant ?</p>

	<p>J'ai une autre question ou un problème => Contact.</p>
	<p>...</p>

	<p>Suivez Wouaf IT sur <i class="fa fa-twitter"></i> <a href="https://twitter.com/Wouaf_IT" target=_blank">Twitter</a> et
		<i class="fa fa-facebook-official"></i> <a href="https://www.facebook.com/wouafit/" target=_blank">Facebook</a> pour plus d'informations !</p>
	<hr />
	<p>Wouaf IT © <%= htmlWebpackPlugin.options.data.year %>.</p>
</div>
<div class="modal-footer">
	<button type="button" class="btn btn-secondary" data-dismiss="modal"><%= htmlWebpackPlugin.options.i18n['Close'] %></button>
</div>