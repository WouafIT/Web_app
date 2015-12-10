<div class="modal-content" data-ui="login">
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
		<p class="text-center"><button type="button" class="btn btn-secondary" data-dismiss="modal">Facebook connect</button></p>
		<small class="text-muted">{%= o.htmlWebpackPlugin.options.i18n['Facebook_account_details'] %}</small>
		<hr />
		<h4><i class="fa fa-google-plus"></i> {%= o.htmlWebpackPlugin.options.i18n['Google account'] %}</h4>
		<p class="text-center"><button type="button" class="btn btn-secondary" data-dismiss="modal">Google connect</button></p>
		<hr />
		<h4>{%= o.htmlWebpackPlugin.options.i18n['Wouaf IT account'] %}</h4>
		<p class="text-center"><button type="button" class="btn btn-primary"
									   data-href="/parts/create-account.html?{%= o.htmlWebpackPlugin.options.data.timestamp %}"
									   data-show="modal" data-target="#modalWindow">{%= o.htmlWebpackPlugin.options.i18n['New Wouaffer? Create your account!'] %}</button></p>
		<p>{%= o.htmlWebpackPlugin.options.i18n['Or enter your login'] %}</p>
		<form>
			<fieldset class="form-group">
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-user"></i></div>
					<input type="text" class="form-control" id="login" name="login"
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
			<p class="text-right"><button type="submit" class="btn btn-primary">{%= o.htmlWebpackPlugin.options.i18n['Login'] %}</button></p>
			<p class="text-center"><a href="#"
									  data-href="/parts/lost-password.html?{%= o.htmlWebpackPlugin.options.data.timestamp %}"
									  data-show="modal" data-target="#modalWindow">{%= o.htmlWebpackPlugin.options.i18n['Lost password?'] %}</a></p>
		</form>
	</div>
</div>