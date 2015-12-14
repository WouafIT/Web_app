module.exports = (function() {
	var $document = $(document);
	var $modalWindow = $('#modalWindow');
	//email validation. validate mostly RF2822
	var self = {};
	self.show = function (e) {
		var $form = $modalWindow.find('form');
		var $username = $form.find('input[name=username]');
		var $pass = $form.find('input[name=password]');

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
				case 'username':
					ok = $field.val().length >= 3 && $field.val().length <= 100;
					break;
				case 'password':
					ok = $field.val().length >= 6 && $field.val().length <= 100;
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
			event.preventDefault()
			var i18n = require('../singleton/i18n.js');
			var alert = require('../singleton/alert.js');
			if ($form.find('.has-error').length) {
				alert.show(i18n.t('There are errors in your form'), $form);
				return false;
			}
			if (!$username.val() || !$pass.val()) {
				alert.show(i18n.t('Your form is incomplete, thank you to fill all fields'), $form);
				return false;
			}

			var loginSuccess = function(datas) {
				if (!datas || !datas.user) {
					loginError({});
					return;
				}
				//TODO
				/*if (datas.user.firstname && datas.user.lastname) {
					new notification(String.format(L('welcome_firstname_lastname'), datas.user.firstname, datas.user.lastname));
				} else {
					new notification(String.format(L('welcome_login'), datas.user.username));
				}*/
				//login
				$document.triggerHandler('app.login', datas);
				var window = require('../singleton/window.js');
				window.close();
			};
			var loginError = function(datas) {
				//logout
				$document.triggerHandler('app.logout');

				if (datas && datas.msg) {
					alert.show(i18n.t(result.msg[0]), $form, 'danger');
				} else {
					query.connectionError();
				}
			};

			//Query
			var query = require('../query.js')();
			query.login({
				login: 			$username.val(),
				pass: 			$pass.val()
			}, loginSuccess, loginError);
		});
	}
	return self;
})();