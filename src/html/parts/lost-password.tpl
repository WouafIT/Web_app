<div data-ui="lost-password">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-label="{%= o.htmlWebpackPlugin.options.i18n['Close'] %}">
			<span aria-hidden="true">&times;</span>
			<span class="sr-only">{%= o.htmlWebpackPlugin.options.i18n['Close'] %}</span>
		</button>
		<h4 class="modal-title">{%= o.htmlWebpackPlugin.options.i18n['Lost password?'] %}</h4>
	</div>
	<div class="modal-body">
		<p>{%= o.htmlWebpackPlugin.options.i18n['Lost_password_details'] %}</p>
		<form>
			<fieldset class="form-group">
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-at"></i></div>
					<input type="email" class="form-control" name="email"
						   placeholder="{%= o.htmlWebpackPlugin.options.i18n['Email'] %}" />
				</div>
			</fieldset>
			<p class="text-xs-right"><button type="submit" class="btn btn-primary">{%= o.htmlWebpackPlugin.options.i18n['Reset my password'] %}</button></p>
		</form>
	</div>
</div>