module.exports = (function() {
	var data = require('../resource/data.js');
	var windows = require('../resource/windows.js');
	var utils = require('../utils.js');
	var i18n = require('../resource/i18n.js');
	var $document = $(document);
	var $modalWindow = $('#modalWindow');
	var self = {};
	self.show = function () {
		if (data.getString('uid')) { //user already logged, close window
			windows.close();
		}
		var $form = $modalWindow.find('form');
		var $username = $form.find('input[name=username]');
		var $pass = $form.find('input[name=pass]');
		var $passConfirm = $form.find('input[name=passConfirm]');
		var $email = $form.find('input[name=email]');
		var $language = $form.find('select[name=language]');
		var $remember = $form.find('input[name=remember]');
		//set current language
		if (window.location.hostname.substr(0, 5) !== 'fr-fr') {
			$language.val('en_US');
		}
		//form field validation and submition
		var formUtils = require('./form-utils.js');
		formUtils.init($form, function ($field) {
			//fields validation
			switch($field.attr('name')) {
				case 'username':
					return $field.val().length >= 3 && $field.val().length <= 100
						&& utils.isValidUsername($field.val());
					break;
				case 'pass':
					return $field.val().length >= 6 && $field.val().length <= 100;
					break;
				case 'passConfirm':
					return $pass.val() == $field.val();
					break;
				case 'email':
					return utils.isValidEmail($field.val());
					break;
			}
			return true;
		}, function () {
			//form submition
			var alert = require('../resource/alert.js');
			if (!$username.val() || !$pass.val()
				|| !$email.val() || !$language.val() || !$passConfirm.val()) {
				alert.show(i18n.t('Your form is incomplete, thank you to fill all fields'), $form);
				return;
			}

			//Query
			var query = require('../resource/query.js');
			query.createUser({
				username: 		$username.val(),
				pass: 			$pass.val(),
				email: 			$email.val(),
				lang: 			$language.val()
			}, function(result) { //success
				//call login
				query.login({
					login: $username.val(),
					pass: $pass.val()
				}, function(result) {
					//permanent login ?
					result.permanent = $remember.prop("checked");
					//login
					$document.triggerHandler('app.login', result);
				}, function(msg) {
					//logout
					$document.triggerHandler('app.logout');
					if (msg) {
						alert.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), $form, 'danger');
					} else {
						query.connectionError();
					}
				});

				windows.show({
					title: i18n.t('Welcome'),
					'text': i18n.t('welcome_to_wouaf_it')
				});
			}, function(msg) { //error
				alert.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), $form, 'danger');
			});
		});
	};
	return self;
})();