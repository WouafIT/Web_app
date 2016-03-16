<div data-ui="create-account">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="<%= htmlWebpackPlugin.options.i18n['Close'] %>">
            <span aria-hidden="true">&times;</span>
            <span class="sr-only"><%= htmlWebpackPlugin.options.i18n['Close'] %></span>
        </button>
        <h4 class="modal-title"><%= htmlWebpackPlugin.options.i18n['Create your account'] %></h4>
    </div>
    <div class="modal-body">
		<h4><%= htmlWebpackPlugin.options.i18n['Fill in the form below:'] %></h4>
		<form>
			<fieldset class="form-group">
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-user"></i></div>
					<input type="text" class="form-control" name="username"
						   placeholder="<%= htmlWebpackPlugin.options.i18n['ID / Nickname'] %>" />
				</div>
			</fieldset>
			<fieldset class="form-group">
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-key"></i></div>
					<input type="password" class="form-control" name="pass"
						   placeholder="<%= htmlWebpackPlugin.options.i18n['Password'] %>" />
				</div>
			</fieldset>
			<fieldset class="form-group">
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-key"></i></div>
					<input type="password" class="form-control" name="passConfirm"
						   placeholder="<%= htmlWebpackPlugin.options.i18n['Confirm password'] %>" />
				</div>
			</fieldset>
			<fieldset class="form-group">
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-at"></i></div>
					<input type="email" class="form-control" name="email"
						   placeholder="<%= htmlWebpackPlugin.options.i18n['Email'] %>" />
				</div>
				<small class="text-muted"><%= htmlWebpackPlugin.options.i18n['We\'ll never share your email with anyone else.'] %></small>
			</fieldset>
			<fieldset class="form-group">
				<label for="language"><%= htmlWebpackPlugin.options.i18n['Language'] %></label>
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-globe"></i></div>
					<select id="language" name="language" class="form-control">
						<option value="fr_FR"><%= htmlWebpackPlugin.options.i18n['French'] %></option>
						<option value="en_US"><%= htmlWebpackPlugin.options.i18n['English'] %></option>
					</select>
				</div>
			</fieldset>
			<div class="checkbox text-xs-center">
				<label>
					<input type="checkbox" name="remember"> <%= htmlWebpackPlugin.options.i18n['Remember me on each connection'] %>
				</label>
			</div>

			<p class="text-xs-right"><button type="submit" class="btn btn-primary"><%= htmlWebpackPlugin.options.i18n['Create your account'] %></button></p>
		</form>
	</div>
    <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal"><%= htmlWebpackPlugin.options.i18n['Cancel'] %></button>
    </div>
</div>