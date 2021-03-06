var utils = require('../utils.js');
var windows = require('../resource/windows.js');
var i18n = require('../resource/i18n.js');
var query = require('../resource/query.js');
var formUtils = require('./form-utils.js');
var alert = require('../resource/alert.js');
var toast = require('../resource/toast.js');
var password = require('../resource/password.js');

module.exports = (function() {
	var self = {};
	var $modalWindow = windows.getWindows();

	self.show = function () {
		var $form = $modalWindow.find('form');
		var $key = $form.find('input[name=reset-password]');
		var $pass = $form.find('input[name=pass]');
		var $progress = $form.find('.progress-bar');

		$pass.on('change keyup paste', function () {
			password.score($pass, $progress, []);
		});

		//form field validation and submition
		formUtils.init($form, function ($field) {
			//fields validation
			switch($field.attr('name')) {
				case 'pass':
					return !$field.val() || ($field.val().length >= 6 && $field.val().length <= 100);
				case 'passConfirm':
					return $pass.val() === $field.val();
			}
			return true;
		}, function () {
			//form submition
			if (!$key.val()) {
				alert.show(i18n.t('Your form is incomplete, thank you to fill all fields'), $form);
				return;
			}
			//Query
			query.resetPassword({
				pass: 		 $pass.val(),
				'reset-key': $key.val()
			}, function() { //success
				windows.close();

				toast.show(i18n.t('Password updated'));
			}, function(msg) { //error
				alert.show(i18n.t('Heads up {{error}}', {error: i18n.t(msg[0]), interpolation: {escapeValue: false}}), $form, 'warning');
			});
		});

		//set current values
		if (window.location.search.indexOf('key=') !== -1) {
			$key.val(utils.getQueryStringParams()['key']);
		}
		if (!$key.val()) {
			windows.close();
		}
	};
	return self;
}());