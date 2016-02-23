module.exports = (function() {
	var data = require('../resource/data.js');
	var windows = require('../resource/windows.js');
	var dtp = require('../resource/datetimepicker.js');
	var $document = $(document);
	var $modalWindow = $('#modalWindow');
	var i18n = require('../resource/i18n.js');
	var twitterText = require('twitter-text');
	var self = {};
	self.show = function (e) {
		if (!data.getString('uid')) { //user is not logged, close window
			windows.close();
		}
		var user = require('../resource/user.js');
		var $form = $modalWindow.find('form');
		var $username = $form.find('input[name=username]');
		var $description = $form.find('textarea[name=description]');
		var $remaining = $form.find('.remaining');
		var $type = $form.find('select[name=type]');
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
		$description.val(user.get('description'));
		$type.val(user.get('type'));
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

		//description count remaining chars
		$description.on('change keyup paste', function() {
			var count = 300 - twitterText.getUnicodeTextLength($description.val());
			if (count < 0) {
				count = 0;
				$description.val($description.val().substr(0, 300));
			}
			$remaining.html(i18n.t('{{count}} character left', {count: count}));
		});

		//form field validation and submition
		var formUtils = require('./form-utils.js');
		formUtils.init($form, function ($field) {
			//fields validation
			switch($field.attr('name')) {
				case 'email':
					return utils.isValidEmail($field.val());
					break;
				case 'firstname':
				case 'lastname':
					var r = $field.val().length <= 100;
					$signwname.attr('disabled', !$firstname.val() && !$lastname.val());
					if ($signwname.prop('disabled')) {
						$signwname.attr('checked', false);
					}
					return r;
					break;
				case 'pass':
					return !$field.val() || ($field.val().length >= 6 && $field.val().length <= 100);
					break;
				case 'passConfirm':
					return $pass.val() == $field.val();
					break;
				case 'birthdate':
					var date = dtp.getInputDate($birthdate);
					return !date || date.getTime() < (new Date().getTime());
					break;
			}
			return true;
		}, function () {
			//form submition
			var alert = require('../resource/alert.js');
			if (!$email.val() || !$language.val()) {
				alert.show(i18n.t('Your form is incomplete, thank you to fill all fields'), $form);
				return;
			}

			//Query
			var query = require('../resource/query.js');
			query.updateUser({
				pass: 			$pass.val(),
				email: 			$email.val(),
				lang: 			$language.val(),
				description:	$description.val(),
				type:			$type.val(),
				firstname: 		$firstname.val(),
				lastname: 		$lastname.val(),
				gender: 		$gender.val(),
				birthdate: 		dtp.getInputServerDate($birthdate),
				signwname:		($signwname.prop("checked") ? 1 : 0)

			}, function(result) { //success
				user.set('firstname', $firstname.val());
				user.set('lastname', $lastname.val());
				user.set('gender', $gender.val());
				user.set('lang', $language.val());
				user.set('email', $email.val());
				user.set('description', $description.val());
				user.set('type', $type.val());
				user.set('signwname', $signwname.prop("checked") ? 1 : 0);

				var birthdate = dtp.getInputDate($birthdate);
				user.set('birthdate', birthdate ? {'sec': Math.round(birthdate.getTime() / 1000)} : null);

				//login
				$document.triggerHandler('app.login');

				windows.close();

				var toast = require('../resource/toast.js');
				toast.show(i18n.t('Profile saved!'));
			}, function(msg) { //error
				alert.show(i18n.t('An error has occurred, please try again later {{error}}', {error: i18n.t(msg[0])}), $form, 'danger');
			});
		});
	};
	return self;
})();