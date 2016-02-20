module.exports = (function() {
	var data = require('../resource/data.js');
	var windows = require('../resource/windows.js');
	var toast = require('../resource/toast.js');
	var $document = $(document);
	var $modalWindow = $('#modalWindow');
	var self = {};
	self.show = function (e) {
		if (data.getString('uid')) { //user already logged, close window
			windows.close();
		}
		var $form = $modalWindow.find('form');
		var $username = $form.find('input[name=username]');
		var $pass = $form.find('input[name=password]');
		var $remember = $form.find('input[name=remember]');

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
				case 'username':
					ok = $field.val().length >= 3 && $field.val().length <= 100;
					break;
				case 'password':
					ok = $field.val().length >= 6 && $field.val().length <= 100;
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
			event.preventDefault()
			var i18n = require('../resource/i18n.js');
			var alert = require('../resource/alert.js');
			$form.find('.alert').hide("fast", function() {
				$(this).remove();
			});
			if ($form.find('.has-warning').length) {
				alert.show(i18n.t('There are errors in your form'), $form);
				return false;
			}
			if (!$username.val() || !$pass.val()) {
				alert.show(i18n.t('Your form is incomplete, thank you to fill all fields'), $form);
				return false;
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
					alert.show(i18n.t('An error has occurred, please try again later {{error}}', {error: i18n.t(msg[0])}), $form, 'danger');
				} else {
					query.connectionError();
				}
			});


		});
	}
	return self;
})();