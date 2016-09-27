var data = require('../resource/data.js');
var windows = require('../resource/windows.js');
var i18n = require('../resource/i18n.js');
var toast = require('../resource/toast.js');
var query = require('../resource/query.js');
var alert = require('../resource/alert.js');
var formUtils = require('./form-utils.js');
var utils = require('../utils.js');

module.exports = (function() {
	var $document = $(document);
	var $modalWindow = windows.getWindows();
	var self = {};
	self.show = function (e) {
		if (data.getString('uid')) { //user already logged, close window
			windows.close();
			return;
		}
		var $facebookLogin = $modalWindow.find('.btn-facebook');
		//Facebook login
		$facebookLogin.on('click', function() {
			FB.login(function(response) {
				if (response.authResponse) {
					//log user on application using accessToken
					query.fblogin({
						fid: 		parseInt(response.authResponse.userID, 10),
						fbtoken: 	response.authResponse.accessToken
					}, function(result) {
						toast.show(i18n.t('Welcome {{username}}', { 'username': utils.getUsername(result.user)}));
						result.permanent = true;
						//login
						$document.triggerHandler('app.login', result);
						windows.close();
					}, function(msg) {
						$document.triggerHandler('app.logout');
						if (msg) {
							alert.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), $modalWindow.find('.modal-body'), 'danger');
						} else {
							query.connectionError();
						}
					});
				} else {
					$document.triggerHandler('app.logout');
					alert.show(i18n.t('Error during Facebook login. Please retry'), $modalWindow.find('.modal-body'), 'danger');
				}
			}, {
				scope: 'public_profile,email,user_friends,pages_show_list,user_events',
				enable_profile_selector: true
			});
		});

		var $form = $modalWindow.find('form');
		var $username = $form.find('input[name=username]');
		var $pass = $form.find('input[name=password]');
		var $remember = $form.find('input[name=remember]');

		//form field validation and submition
		formUtils.init($form, function ($field) {
			//fields validation
			switch($field.attr('name')) {
				case 'username':
					return $field.val().length >= 3 && $field.val().length <= 100;
				case 'password':
					return $field.val().length >= 6 && $field.val().length <= 100;
			}
			return true;
		}, function () {
			//form submition
			if (!$username.val() || !$pass.val()) {
				alert.show(i18n.t('Your form is incomplete, thank you to fill all fields'), $form);
				return;
			}

			//Query
			query.login({
				login: $username.val(),
				pass: $pass.val()
			}, function(result) {
				toast.show(i18n.t('Welcome {{username}}', {'username': utils.getUsername(result.user)}));
				//permanent login ?
				result.permanent = $remember.prop("checked");
				//login
				$document.triggerHandler('app.login', result);
				windows.close();
			}, function(msg) {
				//logout
				$document.triggerHandler('app.logout');
				if (msg) {
					alert.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), $form, 'danger');
				} else {
					query.connectionError();
				}
			});
		});
	};
	return self;
}());