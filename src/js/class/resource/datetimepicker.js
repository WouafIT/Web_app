module.exports = (function() {
	require('../../../libs/DateTimePicker/dist/DateTimePicker.min.js');
	require('../../../libs/DateTimePicker/dist/i18n/DateTimePicker-i18n-'+ LANGUAGE +'.js');
	var i18n = require('./i18n.js');
	var oDTP;
	var self = {};
	self.init = function() {
		//init date picker
		$("#dtBox").DateTimePicker({
			init: function () {
				oDTP = this;
			},
			minuteInterval: 5,
			language: i18n.t('languageShort')
		});
	};
	self.getInputDate = function ($input) {
		if (!$input.val()) {
			return null;
		}
		return oDTP.getDateObjectForInputField($input);
	};
	self.getInputServerDate = function ($input) {
		var date = self.getInputDate($input);
		if (!date) {
			return '';
		}
		return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
	};
	self.setInputDate = function ($input, date) {
		oDTP.setDateTimeStringInInputField($input, date);
	};
	return self;
})();