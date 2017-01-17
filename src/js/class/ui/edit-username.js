var utils = require('../utils.js');
var windows = require('../resource/windows.js');
var i18n = require('../resource/i18n.js');
var query = require('../resource/query.js');
var formUtils = require('./form-utils.js');
var alert = require('../resource/alert.js');
var toast = require('../resource/toast.js');
var data = require('../resource/data.js');
var user = require('../resource/user.js');

module.exports = (function() {
	var self = {};
	var $modalWindow = windows.getWindows();

	self.show = function () {
		if (!data.getString('uid')) { //user is not logged, close window
			windows.close();
			return;
		}
		var $form = $modalWindow.find('form');
		var $username = $form.find('input[name=username]');
		$username.val(user.get('username'));

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

		//form field validation and submition
		formUtils.init($form, function ($field) {
			//fields validation
			switch($field.attr('name')) {
				case 'username':
					return $field.val().length && $field.val().length <= 40
						   && utils.isValidUsername($field.val());
			}
			return true;
		}, function () {
			//form submition
			if (!$username.val()) {
				alert.show(i18n.t('Your form is incomplete, thank you to fill all fields'), $form);
				return;
			}
			//Query
			query.updateUsername({
									username: $username.val()
								}, function() { //success
				windows.close();

				toast.show(i18n.t('Username updated'));
				user.set('username', $username.val());
				user.set('login', $username.val().toLowerCase());

			}, function(msg) { //error
				alert.show(i18n.t('Heads up {{error}}', {error: i18n.t(msg[0]), interpolation: {escapeValue: false}}), $form, 'warning');
			});
		});
	};
	return self;
}());