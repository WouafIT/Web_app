var data = require('../resource/data.js');
var windows = require('../resource/windows.js');
var i18n = require('../resource/i18n.js');
var query = require('../resource/query.js');
var toast = require('../resource/toast.js');
var twitterText = require('twitter-text');
var url = require('../resource/url.js');
var user = require('../resource/user.js');
var users = require('../resource/users.js');
var formUtils = require('./form-utils.js');
var alert = require('../resource/alert.js');
var utils = require('../utils.js');
var password = require('../resource/password.js');

module.exports = (function() {
	var $modalWindow = windows.getWindows();
	var $document = $(document);
	var self = {};
	self.show = function () {
		if (!data.getString('uid')) { //user is not logged, close window
			windows.close();
			return;
		}
		var $form = $modalWindow.find('form');
		var $username = $form.find('input[name=username]');
		var $description = $form.find('textarea[name=description]');
		var $remaining = $form.find('.remaining');
		var $type = $form.find('select[name=type]');
		var $displayname = $form.find('input[name=displayname]');
		var $pass = $form.find('input[name=pass]');
		var $email = $form.find('input[name=email]');
		var $language = $form.find('select[name=language]');
		var $gender = $form.find('select[name=gender]');
		var $url = $form.find('input[name=url]');
		var $delete = $form.find('button.profile-delete');
		var $progress = $form.find('.progress-bar');

		//set current values
		$username.val(user.get('username'));
		$description.val(user.get('description'));
		$type.val(user.get('type'));
		$displayname.val(user.get('displayname'));
		$email.val(user.get('email'));
		$language.val(user.get('lang'));
		$gender.val(user.get('gender'));
		$url.val(user.get('url'));

		$pass.on('change keyup paste', function () {
			password.score($pass, $progress, [$username.val(), $displayname.val()]);
		});

		//description count remaining chars
		$description.on('change keyup paste', function() {
			var count = 300 - twitterText.getUnicodeTextLength($description.val());
			if (count < 0) {
				count = 0;
				$description.val($description.val().substr(0, 300));
			}
			$remaining.html(i18n.t('{{count}} character left', {count: count}));
		});

		//delete profile
		$delete.on('click', function () {
			//show confirm page
			windows.show({
				title: i18n.t('Delete your profile'),
				text: i18n.t('delete_profile_details'),
				confirm: function() {
					windows.close();
					query.deleteUser(
						function() { //success
							users.remove(data.getString('uid'));
							$document.triggerHandler('app.deleted-profile', user.get('lang'));

							$document.triggerHandler('app.logout');
							toast.show(i18n.t('Your profile is deleted'));
						}, function (msg) { //error
							toast.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), 5000);
						}
					);
				}
			});
		});

		//form field validation and submition
		formUtils.init($form, function ($field) {
			//fields validation
			switch($field.attr('name')) {
				case 'url':
					return !$field.val().length || utils.isValidUrl($field.val());
				case 'email':
					return utils.isValidEmail($field.val());
				case 'displayname':
					return $field.val().length <= 100;
				case 'pass':
					return !$field.val() || ($field.val().length >= 6 && $field.val().length <= 100);
				case 'passConfirm':
					return $pass.val() === $field.val();
			}
			return true;
		}, function () {
			//form submition
			if (!$email.val()) {
				alert.show(i18n.t('Your form is incomplete, thank you to fill your email'), $form);
				return;
			}
			if (!$language.val()) {
				alert.show(i18n.t('Your form is incomplete, thank you to fill your language'), $form);
				return;
			}

			//Query
			query.updateUser({
				pass: 			$pass.val(),
				email: 			$email.val(),
				lang: 			$language.val(),
				description:	$description.val(),
				type:			$type.val(),
				displayname: 	$displayname.val(),
				gender: 		$gender.val(),
				url:			$url.val()
			}, function(result) { //success
				var originalLanguage = user.get('lang');
				user.set('displayname', $displayname.val());
				user.set('gender', $gender.val());
				user.set('lang', $language.val());
				if (!result.activation) {
					user.set('email', $email.val());
				}
				user.set('description', $description.val());
				user.set('type', $type.val());
				user.set('url', $url.val());

				//login
				$document.triggerHandler('app.login');

				windows.close();
				users.remove(data.getString('uid'));
				var profileSaved = function () {
					toast.show(i18n.t('Profile saved!'), null, function () {
						if (originalLanguage !== user.get('lang')) {
							var lang = user.get('lang').toLowerCase().replace('_', '-');
							var newHostname = lang + window.location.hostname.substr(5);
							if (newHostname !== window.location.hostname) {
								window.location = window.location.protocol +'//'+ newHostname + url.getCurrentPath();
							}
						}
					});
					$document.triggerHandler('app.edit-profile', $language.val());
				};
				if (result.activation) {
					windows.show({
						title: i18n.t('Email updated'),
						text: i18n.t('email_activation_details'),
						close: profileSaved
					});
				} else {
					profileSaved();
				}
			}, function(msg) { //error
				alert.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), $form, 'danger');
			});
		});
	};
	return self;
}());