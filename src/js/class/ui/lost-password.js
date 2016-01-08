module.exports = (function() {
	var data = require('../singleton/data.js');
	var windows = require('../singleton/windows.js');
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
				$field.removeClass('form-control-error form-control-success');
				$fieldset.removeClass('has-error has-success');
				return;
			}
			switch($field.attr('name')) {
				case 'email':
					ok = emailRe.test($field.val());
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
			var i18n = require('../singleton/i18n.js');
			var alert = require('../singleton/alert.js');
			$form.find('.alert').hide("fast", function() {
				$(this).remove();
			});
			if ($form.find('.has-error').length) {
				alert.show(i18n.t('There are errors in your form'), $form);
				return false;
			}
			if (!$email.val()) {
				alert.show(i18n.t('Your form is incomplete, thank you to fill all fields'), $form);
				return false;
			}

			//Query
			var query = require('../singleton/query.js');
			query.resetPassword($email.val(), function (datas) {
				if (datas.result == 1) {
					windows.close();
					var toast = require('../singleton/toast.js');
					toast.show(i18n.t('A reset email has been sent.'));
				} else {
					alert.show(i18n.t('An error has occurred. Check entering your email address.'), $form);
				}
			});
		});
	};
	return self;
})();