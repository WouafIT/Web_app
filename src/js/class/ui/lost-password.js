var data = require('../resource/data.js');
var windows = require('../resource/windows.js');
var i18n = require('../resource/i18n.js');
var utils = require('../utils.js');
var formUtils = require('./form-utils.js');
var alert = require('../resource/alert.js');
var query = require('../resource/query.js');
var toast = require('../resource/toast.js');

module.exports = (function() {
	var $modalWindow = windows.getWindows();
	var self = {};
	self.show = function () {
		if (data.getString('uid')) { //user already logged, close window
			windows.close();
			return;
		}
		var $form = $modalWindow.find('form');
		var $email = $form.find('input[name=email]');

		//form field validation and submition
		formUtils.init($form, function ($field) {
			//fields validation
			switch($field.attr('name')) {
				case 'email':
					return utils.isValidEmail($field.val());
			}
			return true;
		}, function () {
			//form submition
			if (!$email.val()) {
				alert.show(i18n.t('Your form is incomplete, thank you to fill all fields'), $form);
				return;
			}
			//Query
			query.resetPassword($email.val(), function (result) {
				windows.close();
				toast.show(i18n.t('A reset email has been sent.'));
			}, function (msg) {
				alert.show(i18n.t('An error has occurred. Check entering your email address.'), $form);
			});
		});
	};
	return self;
}());