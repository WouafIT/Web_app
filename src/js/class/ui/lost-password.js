module.exports = (function() {
	var data = require('../resource/data.js');
	var windows = require('../resource/windows.js');
	var $modalWindow = $('#modalWindow');
	//email validation. validate mostly RF2822
	var emailRe = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
	var self = {};
	self.show = function () {
		if (data.getString('uid')) { //user already logged, close window
			windows.close();
		}
		var $form = $modalWindow.find('form');
		var $email = $form.find('input[name=email]');

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
				return false;
			}
			if (!$email.val()) {
				alert.show(i18n.t('Your form is incomplete, thank you to fill all fields'), $form);
				return false;
			}

			//Query
			var query = require('../resource/query.js');
			query.resetPassword($email.val(), function (result) {
				windows.close();
				var toast = require('../resource/toast.js');
				toast.show(i18n.t('A reset email has been sent.'));
			}, function (msg) {
				alert.show(i18n.t('An error has occurred. Check entering your email address.'), $form);
			});
		});
	};
	return self;
})();