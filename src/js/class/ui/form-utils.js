var i18n = require('../resource/i18n.js');
var alert = require('../resource/alert.js');

module.exports = (function() {
	var self = {};
	self.init = function($form, fieldsValidation, formSubmit) {
		$form.find('input, select').on('change', function(e) {
			var $field = $(e.target);
			var $fieldset = $field.parents('fieldset');
			if (!$field.val()) {
				$field.removeClass('form-control-warning form-control-success');
				$fieldset.removeClass('has-warning has-success');
				return;
			}
			if (fieldsValidation($field)) {
				$field.removeClass('form-control-warning').addClass('form-control-success');
				$fieldset.removeClass('has-warning').addClass('has-success');
			} else {
				$field.removeClass('form-control-success').addClass('form-control-warning');
				$fieldset.removeClass('has-success').addClass('has-warning');
			}
		});
		$form.on('submit', function (event) {
			event.preventDefault();
			$form.find('.alert').hide("fast", function() {
				$(this).remove();
			});
			if ($form.find('.has-warning').length) {
				alert.show(i18n.t('There are errors in your form'), $form);
				return false;
			}
			formSubmit();
		});
	};
	return self;
}());