module.exports = (function() {
	var data = require('../resource/data.js');
	var windows = require('../resource/windows.js');
	var dtp = require('../resource/datetimepicker.js');
	var $document = $(document);
	var $modalWindow = $('#modalWindow');
	//email validation. validate mostly RF2822
	var emailRe = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
	var self = {};
	self.show = function (e) {
		if (!data.getString('uid')) { //user is not logged, close window
			windows.close();
		}
		var user = require('../resource/user.js');
		var $form = $modalWindow.find('form');
		var $username = $form.find('input[name=username]');
		var $firstname = $form.find('input[name=firstname]');
		var $lastname = $form.find('input[name=lastname]');
		var $pass = $form.find('input[name=pass]');
		var $email = $form.find('input[name=email]');
		var $birthdate = $form.find('input[name=birthdate]');
		var $language = $form.find('select[name=language]');
		var $gender = $form.find('select[name=gender]');
		var $signwname = $form.find('input[name=signwname]');
		//set current values
		$username.val(user.get('username'));
		$firstname.val(user.get('firstname'));
		$lastname.val(user.get('lastname'));
		$email.val(user.get('email'));
		$language.val(user.get('lang'));
		$gender.val(user.get('gender'));
		$signwname.attr("checked", user.get('signwname'));
		$signwname.attr('disabled', !$firstname.val() && !$lastname.val());
		var birthdate = user.get('birthdate');
		if (birthdate && birthdate.sec) {
			dtp.setInputDate($birthdate, new Date(birthdate.sec * 1000));
		}

		$form.find('input').on('change', function(e) {
			var $field = $(e.target);
			var $fieldset = $field.parents('fieldset');
			var ok = true;
			if (!$field.val()) {
				$field.removeClass('form-control-error form-control-success');
				$fieldset.removeClass('has-error has-success');
			}
			switch($field.attr('name')) {
				case 'username':
					ok = $field.val().length >= 3 && $field.val().length <= 100;
					break;
				case 'email':
					ok = emailRe.test($field.val());
					break;
				case 'firstname':
				case 'lastname':
					ok = $field.val().length <= 100;
					$signwname.attr('disabled', !$firstname.val() && !$lastname.val());
					if ($signwname.prop('disabled')) {
						$signwname.attr('checked', false);
					}
					break;
				case 'pass':
					ok = !$field.val() || ($field.val().length >= 6 && $field.val().length <= 100);
					break;
				case 'passConfirm':
					ok = $pass.val() == $field.val();
					break;
				case 'birthdate':
					var date = dtp.getInputDate($birthdate);
					ok = !date || date.getTime() < (new Date().getTime());
					break;
			}
			if (ok) {
				$field.removeClass('form-control-error').addClass('form-control-success');
				$fieldset.removeClass('has-error').addClass('has-success');
			} else {
				$field.removeClass('form-control-success').addClass('form-control-error');
				$fieldset.removeClass('has-success').addClass('has-error');
			}
		});
		$form.on('submit', function (event) {
			event.preventDefault();
			var i18n = require('../resource/i18n.js');
			var alert = require('../resource/alert.js');
			$form.find('.alert').hide("fast", function() {
				$(this).remove();
			});
			if ($form.find('.has-error').length) {
				alert.show(i18n.t('There are errors in your form'), $form);
				return false;
			}
			if (!$username.val() || !$email.val() || !$language.val()) {
				alert.show(i18n.t('Your form is incomplete, thank you to fill all fields'), $form);
				return false;
			}

			//Query
			var query = require('../resource/query.js');
			query.updateUser({
				username: 		$username.val(),
				pass: 			$pass.val(),
				email: 			$email.val(),
				lang: 			$language.val(),
				firstname: 		$firstname.val(),
				lastname: 		$lastname.val(),
				gender: 		$gender.val(),
				birthdate: 		dtp.getInputServerDate($birthdate),
				signwname:		($signwname.prop("checked") ? 1 : 0)

			}, function(result) { //success
				if (result.result && result.result == 1) {
					user.set('username', $username.val());
					user.set('firstname', $firstname.val());
					user.set('lastname', $lastname.val());
					user.set('gender', $gender.val());
					user.set('lang', $language.val());
					user.set('email', $email.val());
					user.set('signwname', $signwname.prop("checked") ? 1 : 0);

					var birthdate = dtp.getInputDate($birthdate);
					user.set('birthdate', birthdate ? {'sec': parseInt(birthdate.getTime() / 1000)} : null);

					//login
					$document.triggerHandler('app.login');

					windows.close();

					var toast = require('../resource/toast.js');
					toast.show(i18n.t('Profile saved!'));
				} else if (result.msg) {
					alert.show(i18n.t(result.msg[0]), $form, 'danger');
				} else {
					query.connectionError();
				}
			}, function(result) { //error
				if (result.msg) {
					alert.show(i18n.t(result.msg[0]), $form, 'danger');
				} else {
					query.connectionError();
				}
			});
		});
	}
	return self;
})();