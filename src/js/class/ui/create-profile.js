var data = require('../resource/data.js');
var windows = require('../resource/windows.js');
var utils = require('../utils.js');
var i18n = require('../resource/i18n.js');
var formUtils = require('./form-utils.js');
var alert = require('../resource/alert.js');
var query = require('../resource/query.js');
var password = require('../resource/password.js');

module.exports = (function() {
	var $document = $(document);
	var $modalWindow = windows.getWindows();
	var self = {};
	self.show = function () {
		if (data.getString('uid')) { //user already logged, close window
			windows.close();
			return;
		}
		var $form = $modalWindow.find('form');
		var $username = $form.find('input[name=username]');
		var $pass = $form.find('input[name=pass]');
		var $passConfirm = $form.find('input[name=passConfirm]');
		var $email = $form.find('input[name=email]');
		var $language = $form.find('select[name=language]');
		var $remember = $form.find('input[name=remember]');
		var $progress = $form.find('.progress-bar');
		//set current language
		if (window.location.hostname.substr(0, 5) !== 'fr-fr') {
			$language.val('en_US');
		}
		$username.on('change keyup keydown keypress paste', function (e) {
			var invalidChars = /[^0-9a-z_]/gi;
			if (e.type === 'keypress') {
				var char = String.fromCharCode(e.keyCode || e.which);
				if (char && invalidChars.test(char)) {
					e.preventDefault();
				}
			}
			var value = $username.val();
			if(value && invalidChars.test(value)) {
				$username.val(value.replace(invalidChars, ''));
			}
		});
		$pass.on('change keyup paste', function () {
			password.score($pass, $progress, [$username.val()]);
		});
		//form field validation and submition
		formUtils.init($form, function ($field) {
			//fields validation
			switch($field.attr('name')) {
				case 'username':
					return $field.val().length && $field.val().length <= 40
						&& utils.isValidUsername($field.val());
				case 'pass':
					return $field.val().length >= 6 && $field.val().length <= 100;
				case 'passConfirm':
					return $pass.val() === $field.val();
				case 'email':
					return utils.isValidEmail($field.val());
			}
			return true;
		}, function () {
			//form submition
			if (!$username.val() || !$pass.val()
				|| !$email.val() || !$language.val() || !$passConfirm.val()) {
				alert.show(i18n.t('Your form is incomplete, thank you to fill all fields'), $form);
				return;
			}

			//Query
			query.createUser({
				username: 		$username.val(),
				pass: 			$pass.val(),
				email: 			$email.val(),
				locale: 		$language.val()
			}, function() { //success
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
						alert.show(i18n.t('Heads up {{error}}', {error: i18n.t(msg[0]), interpolation: {escapeValue: false}}), $form, 'warning');
					} else {
						query.connectionError();
					}
				});

				windows.show({
					title: i18n.t('Welcome'),
					'text': i18n.t('welcome_to_wouaf_it')
				});

				$document.triggerHandler('app.created-profile', $language.val());
			}, function(msg) { //error
				alert.show(i18n.t('Heads up {{error}}', {error: i18n.t(msg[0]), interpolation: {escapeValue: false}}), $form, 'warning');
			});
		});
	};
	return self;
}());