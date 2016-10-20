<div class="modal-header">
	<button type="button" class="close" data-dismiss="modal" aria-label="<%= htmlWebpackPlugin.options.i18n['Close'] %>">
		<span aria-hidden="true">&times;</span>
		<span class="sr-only"><%= htmlWebpackPlugin.options.i18n['Close'] %></span>
	</button>
	<h4 class="modal-title">Frenquently asked questions</h4>
</div>
<div class="modal-body">
	<p>stuff ...</p>

	<p>Follow Wouaf IT on <i class="fa fa-twitter"></i> <a href="https://twitter.com/Wouaf_IT" target="_blank">Twitter</a> and
		<i class="fa fa-facebook-official"></i> <a href="https://www.facebook.com/wouafit/" target="_blank">Facebook</a> to get more informations!</p>
	<hr />
	<p>Wouaf IT © <%= htmlWebpackPlugin.options.data.year %>.</p>
</div>
<div class="modal-footer">
	<button type="button" class="btn btn-secondary" data-dismiss="modal"><%= htmlWebpackPlugin.options.i18n['Close'] %></button>
</div>