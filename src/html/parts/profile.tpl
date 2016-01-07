<div class="modal-content" data-ui="profile">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-label="{%= o.htmlWebpackPlugin.options.i18n['Close'] %}">
			<span aria-hidden="true">&times;</span>
			<span class="sr-only">{%= o.htmlWebpackPlugin.options.i18n['Close'] %}</span>
		</button>
		<h4 class="modal-title">{%= o.htmlWebpackPlugin.options.i18n['Edit your profile'] %}</h4>
	</div>
	<div class="modal-body">
		<h4>{%= o.htmlWebpackPlugin.options.i18n['Edit your profile information below:'] %}</h4>
		<div class="alert alert-warning alert-dismissible fade in" role="alert" hidden>
			<button type="button" class="close" data-dismiss="alert" aria-label="{%= o.htmlWebpackPlugin.options.i18n['Close'] %}">
				<span aria-hidden="true">&times;</span>
				<span class="sr-only">{%= o.htmlWebpackPlugin.options.i18n['Close'] %}</span>
			</button>
			<div class="alert-content"></div>
		</div>
		<form>
			<fieldset class="form-group">
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-user"></i></div>
					<input type="text" class="form-control" name="username"
						   placeholder="{%= o.htmlWebpackPlugin.options.i18n['ID / Nickname'] %}" />
				</div>
			</fieldset>
			<fieldset class="form-group">
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-at"></i></div>
					<input type="email" class="form-control" name="email"
						   placeholder="{%= o.htmlWebpackPlugin.options.i18n['Email'] %}" />
				</div>
				<small class="text-muted">{%= o.htmlWebpackPlugin.options.i18n['We\'ll never share your email with anyone else.'] %}</small>
			</fieldset>


			<fieldset class="form-group">
				<label for="password">{%= o.htmlWebpackPlugin.options.i18n['Enter a new password if you want to change it'] %}</label>
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-key"></i></div>
					<input id="password" type="password" class="form-control" name="pass"
						   placeholder="{%= o.htmlWebpackPlugin.options.i18n['Password'] %}" />
				</div>
			</fieldset>
			<fieldset class="form-group">
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-key"></i></div>
					<input type="password" class="form-control" name="passConfirm"
						   placeholder="{%= o.htmlWebpackPlugin.options.i18n['Confirm password'] %}" />
				</div>
			</fieldset>

			<fieldset class="form-group">
				<label for="language">{%= o.htmlWebpackPlugin.options.i18n['Language'] %}</label>
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-globe"></i></div>
					<select id="language" name="language" class="form-control">
						<option value="fr_FR">{%= o.htmlWebpackPlugin.options.i18n['French'] %}</option>
						<option value="en_US">{%= o.htmlWebpackPlugin.options.i18n['English'] %}</option>
					</select>
				</div>
			</fieldset>

			<h4>{%= o.htmlWebpackPlugin.options.i18n['Personal data'] %}</h4>
			<p>{%= o.htmlWebpackPlugin.options.i18n['Personal_data_details'] %}</p>

			<fieldset class="form-group">
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-user"></i></div>
					<input type="text" class="form-control" name="firstname"
						   placeholder="{%= o.htmlWebpackPlugin.options.i18n['Firstname'] %}" />
				</div>
			</fieldset>
			<fieldset class="form-group">
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-user"></i></div>
					<input type="text" class="form-control" name="lastname"
						   placeholder="{%= o.htmlWebpackPlugin.options.i18n['Lastname'] %}" />
				</div>
			</fieldset>
			<div class="checkbox">
				<div class="input-group">
					<label>
						<input type="checkbox" name="signwname"> {%= o.htmlWebpackPlugin.options.i18n['Sign with your name'] %}
					</label>
				</div>
				<small class="text-muted">{%= o.htmlWebpackPlugin.options.i18n['Sign_with_your_name_details'] %}</small>
			</div>
			<fieldset class="form-group">
				<label for="gender">{%= o.htmlWebpackPlugin.options.i18n['Gender'] %}</label>
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-venus-mars"></i></div>
					<select name="gender" id="gender" class="form-control">
						<option value="">{%= o.htmlWebpackPlugin.options.i18n['Choose your gender'] %}</option>
						<option value="male">{%= o.htmlWebpackPlugin.options.i18n['Male'] %}</option>
						<option value="female">{%= o.htmlWebpackPlugin.options.i18n['Female'] %}</option>
					</select>
				</div>
			</fieldset>
			<fieldset class="form-group">
				<label for="birthdate">{%= o.htmlWebpackPlugin.options.i18n['Birthdate'] %}</label>
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-birthday-cake"></i></div>
					<input type="date" class="form-control" name="birthdate" id="birthdate"
						   placeholder="{%= o.htmlWebpackPlugin.options.i18n['Birthdate'] %}" />
				</div>
			</fieldset>

			<p class="text-xs-right"><button type="submit" class="btn btn-primary">{%= o.htmlWebpackPlugin.options.i18n['Save your profile'] %}</button></p>
		</form>
	</div>
	<div class="modal-footer">
		<button type="button" class="btn btn-secondary" data-dismiss="modal">{%= o.htmlWebpackPlugin.options.i18n['Cancel'] %}</button>
	</div>
</div>