var utils = require('../utils.js');
var windows = require('../resource/windows.js');
var i18n = require('../resource/i18n.js');
var query = require('../resource/query.js');
var formUtils = require('./form-utils.js');
var alert = require('../resource/alert.js');
var toast = require('../resource/toast.js');

module.exports = (function() {
	var self = {};
	var $modalWindow = windows.getWindows();

	self.show = function () {
		var $form = $modalWindow.find('form');
		var $key = $form.find('input[name=key]');
		//form field validation and submition
		formUtils.init($form, function ($field) {
			//fields validation
			switch($field.attr('name')) {
				case 'key':
					return utils.isValidUserKey($field.val());
					break;
			}
			return true;
		}, function () {
			//form submition
			if (!$key.val()) {
				alert.show(i18n.t('Your form is incomplete, thank you to fill all fields'), $form);
				return;
			}

			//Query
			query.activateUser({
				activation_key: 	$key.val()
			}, function(result) { //success
				windows.close();

				toast.show(i18n.t('Profile activated!'));
			}, function(msg) { //error
				alert.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), $form, 'danger');
			});
		});

		//set current values
		var validateForm = false;
		if (window.location.search.indexOf('key=') !== -1) {
			$key.val(utils.getQueryStringParams()['key']);
			validateForm = true;
		}

		if (validateForm) {
			$form.submit();
		}
	};
	return self;
}());