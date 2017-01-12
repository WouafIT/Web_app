<div data-ui="lost-password">
	<div class="modal-header">
		<h4 class="modal-title"><%= htmlWebpackPlugin.options.i18n['Reset password'] %></h4>
		<button type="button" class="close" data-dismiss="modal" aria-label="<%= htmlWebpackPlugin.options.i18n['Close'] %>">
			<span aria-hidden="true">&times;</span>
		</button>
	</div>
	<div class="modal-body">
		<p><%= htmlWebpackPlugin.options.i18n['Lost_password_details'] %></p>
		<form>
			<fieldset class="form-group">
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-at"></i></div>
					<input type="email" class="form-control" name="email"
						   placeholder="<%= htmlWebpackPlugin.options.i18n['Email'] %>" />
				</div>
			</fieldset>
			<p class="text-right"><button type="submit" class="btn btn-primary"><i class="fa fa-check"></i> <%= htmlWebpackPlugin.options.i18n['Reset my password'] %></button></p>
		</form>
	</div>
</div>