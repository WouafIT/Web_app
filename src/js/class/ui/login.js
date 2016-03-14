module.exports = (function() {
	var data = require('../resource/data.js');
	var windows = require('../resource/windows.js');
	var i18n = require('../resource/i18n.js');
	var toast = require('../resource/toast.js');
	var $document = $(document);
	var $modalWindow = windows.getWindows();
	var self = {};
	self.show = function (e) {
		if (data.getString('uid')) { //user already logged, close window
			windows.close();
			return;
		}
		var $form = $modalWindow.find('form');
		var $username = $form.find('input[name=username]');
		var $pass = $form.find('input[name=password]');
		var $remember = $form.find('input[name=remember]');

		//form field validation and submition
		var formUtils = require('./form-utils.js');
		formUtils.init($form, function ($field) {
			//fields validation
			switch($field.attr('name')) {
				case 'username':
					return $field.val().length >= 3 && $field.val().length <= 100;
					break;
				case 'password':
					return $field.val().length >= 6 && $field.val().length <= 100;
					break;
			}
			return true;
		}, function () {
			//form submition
			var alert = require('../resource/alert.js');
			if (!$username.val() || !$pass.val()) {
				alert.show(i18n.t('Your form is incomplete, thank you to fill all fields'), $form);
				return;
			}

			//Query
			var query = require('../resource/query.js');
			query.login({
				login: $username.val(),
				pass: $pass.val()
			}, function(result) {
				if (result.user.firstname && result.user.lastname) {
					toast.show(i18n.t('Welcome {{username}}', { 'username': result.user.firstname +' '+ result.user.lastname }));
				} else {
					toast.show(i18n.t('Welcome {{username}}', { 'username': result.user.username }));
				}
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
})();