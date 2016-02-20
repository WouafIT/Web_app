module.exports = (function() {
	var data = require('../resource/data.js');
	var windows = require('../resource/windows.js');
	var utils = require('../utils.js');
	var $document = $(document);
	var $modalWindow = $('#modalWindow');
	//email validation. validate mostly RF2822
	var emailRe = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
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
		$form.find('input').on('change', function(e) {
			var $field = $(e.target);
			var $fieldset = $field.parents('fieldset');
			var ok = true;
			if (!$field.val()) {
				$field.removeClass('form-control-warning form-control-success');
				$fieldset.removeClass('has-warning has-success');
				return;
			}
			switch($field.attr('name')) {
				case 'username':
					ok = $field.val().length >= 3 && $field.val().length <= 100
						&& utils.isValidUsername($field.val());
					break;
				case 'pass':
					ok = $field.val().length >= 6 && $field.val().length <= 100;
					break;
				case 'passConfirm':
					ok = $pass.val() == $field.val();
					break;
				case 'email':
					ok = emailRe.test($field.val());
					break;
			}
			if (ok) {
				$field.removeClass('form-control-warning').addClass('form-control-success');
				$fieldset.removeClass('has-warning').addClass('has-success');
			} else {
				$field.removeClass('form-control-success').addClass('form-control-warning');
				$fieldset.removeClass('has-success').addClass('has-warning');
			}
		});
		$form.on('submit', function (event) {
			event.preventDefault();
			var i18n = require('../resource/i18n.js');
			var alert = require('../resource/alert.js');
			$form.find('.alert').hide("fast", function() {
				$(this).remove();
			});
			if ($form.find('.has-warning').length) {
				alert.show(i18n.t('There are errors in your form'), $form);
				return;
			}
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
						alert.show(i18n.t('An error has occurred, please try again later {{error}}', {error: i18n.t(msg[0])}), $form, 'danger');
					} else {
						query.connectionError();
					}
				});

				windows.show({
					title: i18n.t('Welcome'),
					'text': i18n.t('welcome_to_wouaf_it')
				});
			}, function(msg) { //error
				alert.show(i18n.t('An error has occurred, please try again later {{error}}', {error: i18n.t(msg[0])}), $form, 'danger');
			});
		});
	}
	return self;
})();