<div data-ui="activation">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-label="<%= htmlWebpackPlugin.options.i18n['Close'] %>">
			<span aria-hidden="true">&times;</span>
			<span class="sr-only"><%= htmlWebpackPlugin.options.i18n['Close'] %></span>
		</button>
		<h4 class="modal-title"><%= htmlWebpackPlugin.options.i18n['Activate your user profile'] %></h4>
	</div>
	<div class="modal-body">
		<form>
			<fieldset class="form-group">
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-key"></i></div>
					<input type="text" class="form-control" name="key"
						   placeholder="<%= htmlWebpackPlugin.options.i18n['Your activation key'] %>" />
				</div>
			</fieldset>
			<p class="text-xs-right"><button type="submit" class="btn btn-primary"><%= htmlWebpackPlugin.options.i18n['Activate your profile'] %></button></p>
		</form>
	</div>
	<div class="modal-footer">
		<button type="button" class="btn btn-secondary" data-dismiss="modal"><%= htmlWebpackPlugin.options.i18n['Cancel'] %></button>
	</div>
</div>