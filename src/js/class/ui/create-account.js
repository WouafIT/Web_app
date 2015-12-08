module.exports = (function() {
	var $modalWindow = $('#modalWindow');
	//email validation. validate mostly RF2822
	var emailRe = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
	var self = {};
	self.show = function (e) {
		var $form = $modalWindow.find('form');
		var $username = $form.find('input[name=username]');
		var $pass = $form.find('input[name=pass]');
		var $passConfirm = $form.find('input[name=passConfirm]');
		var $email = $form.find('input[name=email]');
		var $language = $form.find('select[name=language]');
		//set current language
		if (window.location.hostname.substr(0, 5) !== 'fr-fr') {
			$language.val('en_US');
		}
		$form.find('input').on('change', function(e) {
			var $field = $(e.target);
			var $fieldset = $field.parents('fieldset');
			var ok = true;
			if (!$field.val()) {
				$field.removeClass('form-control-error form-control-success');
				$fieldset.removeClass('has-error has-success');
				return;
			}
			switch($field.attr('name')) {
				case 'username':
					ok = $field.val().length >= 3 && $field.val().length <= 100;
					break
				case 'pass':
					ok = $field.val().length >= 6 && $field.val().length <= 100;
					break
				case 'passConfirm':
					ok = $pass.val() == $field.val();
					break
				case 'email':
					ok = emailRe.test($field.val());
					break
			}
			if (ok) {
				$field.removeClass('form-control-error').addClass('form-control-success');
				$fieldset.removeClass('has-error').addClass('has-success');
			} else {
				$field.removeClass('form-control-success').addClass('form-control-error');
				$fieldset.removeClass('has-success').addClass('has-error');
			}
		});
		$form.on('submit', function () {
			var i18n = require('../singleton/i18n.js');
			var alert = require('../singleton/alert.js');
			if ($form.find('.has-error').length) {
				alert.show(i18n.t('There are errors in your form'), $form);
				return false;
			}
			if (!$username.val() || !$pass.val()
				|| !$email.val() || !$language.val() || !$passConfirm.val()) {
				alert.show(i18n.t('Your form is incomplete, thank you to fill all fields'), $form);
				return false;
			}

			//Query
			var query = require('../query.js')();
			query.createUser({
				username: 		$username.val(),
				pass: 			$pass.val(),
				email: 			$email.val(),
				lang: 			$language.val()
			}, function(data) { //success
				console.info(data);

				if (data.result && data.result == 1) {
					var data = require('../singleton/data.js');
					//store uid
					data.setString('uid', datas.uid);
					var window = require('../singleton/window.js');
					window.show({
						title: i18n.t('Welcome'),
						'text': i18n.t('welcome_to_wouaf_it')
					});
				} else if (data.msg) {
					alert.show(i18n.t(data.msg[0]), $form, 'danger');
				} else {
					query.connectionError();
				}
			}, function(data) { //error
				if (data.msg) {
					alert.show(i18n.t(data.msg[0]), $form, 'danger');
				} else {
					query.connectionError();
				}
			});
			return false;
		});
	}
	return self;
})();