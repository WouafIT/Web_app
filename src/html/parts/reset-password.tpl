<div data-ui="reset-password">
	<div class="modal-header">
		<h4 class="modal-title"><%= htmlWebpackPlugin.options.i18n['Update your password'] %></h4>
		<button type="button" class="close" data-dismiss="modal" aria-label="<%= htmlWebpackPlugin.options.i18n['Close'] %>">
			<span aria-hidden="true">&times;</span>
		</button>
	</div>
	<div class="modal-body">
		<form>
			<fieldset class="form-group">
				<label for="password"><%= htmlWebpackPlugin.options.i18n['Enter and confirm your new password below'] %></label>
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-key"></i></div>
					<input id="password" type="password" class="form-control" name="pass"
						   placeholder="<%= htmlWebpackPlugin.options.i18n['Password'] %>" />
				</div>
				<div class="progress">
					<div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100"></div>
				</div>
			</fieldset>
			<fieldset class="form-group">
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-key"></i></div>
					<input type="password" class="form-control" name="passConfirm"
						   placeholder="<%= htmlWebpackPlugin.options.i18n['Confirm password'] %>" />
				</div>
			</fieldset>
			<input type="hidden" class="form-control" name="reset-password" />

			<p class="text-right"><button type="submit" class="btn btn-primary"><i class="fa fa-check"></i> <%= htmlWebpackPlugin.options.i18n['Save'] %></button></p>
		</form>
	</div>
	<div class="modal-footer">
		<button type="button" class="btn btn-secondary" data-dismiss="modal"><%= htmlWebpackPlugin.options.i18n['Cancel'] %></button>
	</div>
</div>