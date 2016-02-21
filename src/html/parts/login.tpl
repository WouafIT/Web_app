<div data-ui="login">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="{%= o.htmlWebpackPlugin.options.i18n['Close'] %}">
            <span aria-hidden="true">&times;</span>
            <span class="sr-only">{%= o.htmlWebpackPlugin.options.i18n['Close'] %}</span>
        </button>
        <h4 class="modal-title">{%= o.htmlWebpackPlugin.options.i18n['Login'] %}</h4>
    </div>
    <div class="modal-body">
		<h3>{%= o.htmlWebpackPlugin.options.i18n['Choose your connection method'] %}</h3>
		<h4><i class="fa fa-facebook-official"></i> {%= o.htmlWebpackPlugin.options.i18n['Facebook account'] %}</h4>
		<p class="text-xs-center"><button type="button" class="btn btn-secondary" data-dismiss="modal">Facebook connect</button></p>
		<small class="text-muted">{%= o.htmlWebpackPlugin.options.i18n['Facebook_account_details'] %}</small>
		<hr />
		<h4><i class="fa fa-google-plus"></i> {%= o.htmlWebpackPlugin.options.i18n['Google account'] %}</h4>
		<p class="text-xs-center"><button type="button" class="btn btn-secondary" data-dismiss="modal">Google connect</button></p>
		<hr />
		<h4 class="wouaf-it">{%= o.htmlWebpackPlugin.options.i18n['Wouaf IT account'] %}</h4>
		<p class="text-xs-center"><button type="button" class="btn btn-primary btn-wrap"
									   data-href="create-account"
									   data-show="modal" data-target="#modalWindow">{%= o.htmlWebpackPlugin.options.i18n['New Wouaffer? Create your account!'] %}</button></p>
		<p>{%= o.htmlWebpackPlugin.options.i18n['Or enter your login'] %}</p>
		<form>
			<fieldset class="form-group">
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-user"></i></div>
					<input type="text" class="form-control" id="login" name="username"
						   placeholder="{%= o.htmlWebpackPlugin.options.i18n['ID or Email'] %}" />
				</div>
			</fieldset>
			<fieldset class="form-group">
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-key"></i></div>
					<input type="password" class="form-control" id="password" name="password"
						   placeholder="{%= o.htmlWebpackPlugin.options.i18n['Password'] %}" />
				</div>
			</fieldset>
			<div class="checkbox text-xs-center">
				<label>
					<input type="checkbox" name="remember"> {%= o.htmlWebpackPlugin.options.i18n['Remember me'] %}
				</label>
			</div>
			<p class="text-xs-right"><button type="submit" class="btn btn-primary">{%= o.htmlWebpackPlugin.options.i18n['Login'] %}</button></p>
			<p class="text-xs-center"><a href="/lost-password/"
									  data-href="lost-password"
									  data-show="modal" data-target="#modalWindow">{%= o.htmlWebpackPlugin.options.i18n['Lost password?'] %}</a></p>
		</form>
	</div>
</div>