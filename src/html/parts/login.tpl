<div data-ui="login">
    <div class="modal-header">
		<h4 class="modal-title"><%= htmlWebpackPlugin.options.i18n['Login'] %></h4>
		<button type="button" class="close" data-dismiss="modal" aria-label="<%= htmlWebpackPlugin.options.i18n['Close'] %>">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <div class="modal-body">

		<h3><%= htmlWebpackPlugin.options.i18n['Choose your connection method'] %></h3>
		<h4><i class="fa fa-facebook-official"></i> <%= htmlWebpackPlugin.options.i18n['Facebook profile'] %></h4>
		<p class="text-center"><button type="button" class="btn btn-secondary btn-facebook"><i class="fa fa-facebook-official"></i> <%= htmlWebpackPlugin.options.i18n['Facebook login'] %></button></p>
		<small class="text-muted"><%= htmlWebpackPlugin.options.i18n['Facebook_profile_details'] %></small>
		<hr />

		<h4 class="wouaf-it"><%= htmlWebpackPlugin.options.i18n['Wouaf IT profile'] %></h4>
		<p class="text-center"><button type="button" class="btn btn-primary btn-wrap"
									   data-href="create-profile"
									   data-show="modal" data-target="#modalWindow"><i class="fa fa-plus"></i> <%= htmlWebpackPlugin.options.i18n['New Wouaffer? Create your profile!'] %></button></p>
		<p><%= htmlWebpackPlugin.options.i18n['Or enter your login'] %></p>
		<form>
			<fieldset class="form-group">
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-user"></i></div>
					<input type="text" class="form-control" id="login" name="username"
						   placeholder="<%= htmlWebpackPlugin.options.i18n['ID or Email'] %>" />
				</div>
			</fieldset>
			<fieldset class="form-group">
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-key"></i></div>
					<input type="password" class="form-control" id="password" name="password"
						   placeholder="<%= htmlWebpackPlugin.options.i18n['Password'] %>" />
				</div>
			</fieldset>
			<div class="checkbox text-center">
				<label>
					<input type="checkbox" name="remember"> <%= htmlWebpackPlugin.options.i18n['Remember me'] %>
				</label>
			</div>
			<p class="text-right"><button type="submit" class="btn btn-primary"><i class="fa fa-sign-in"></i> <%= htmlWebpackPlugin.options.i18n['Login'] %></button></p>
			<p class="text-center"><a href="/lost-password/"
									  data-href="lost-password"
									  data-show="modal" data-target="#modalWindow"><%= htmlWebpackPlugin.options.i18n['Lost password?'] %></a></p>
		</form>
	</div>
</div>