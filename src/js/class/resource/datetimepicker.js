module.exports = (function() {
	require('../../../libs/DateTimePicker/dist/DateTimePicker.min.js');
	require('../../../libs/DateTimePicker/dist/i18n/DateTimePicker-i18n-'+ LANGUAGE +'.js');
	var i18n = require('./i18n.js');
	var languageShort = i18n.t('languageShort');
	var locales = $.DateTimePicker.i18n[languageShort];
	var oDTP;
	var minuteInterval = 10;
	var self = {};
	self.init = function() {
		//init date picker
		$("#dtBox").DateTimePicker({
			init: function () {
				oDTP = this;
			},
			minuteInterval: 10,
			language: languageShort
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
	//Dates formating functions
	self.formatDate = function(date, format) {
		format = format || 'short';
		if (format == 'short') {
			if (languageShort == 'fr') {
				return (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +'/'+ ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) +'/'+ date.getFullYear();
			} else {
				return ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) +'/'+ (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +'/'+ date.getFullYear();
			}
		} else {
			if (languageShort == 'fr') {
				return date.getDate() +' '+ locales.shortMonthNames[date.getMonth()] +'. '+ date.getFullYear();
			} else {
				return locales.shortMonthNames[date.getMonth()] +'. '+ date.getDate() +', '+ date.getFullYear();
			}
		}
	};
	self.formatTime = function(date) {
		var roundMinutes = function(minutes) {
			minutes = Math.round(minutes / minuteInterval) * minuteInterval;
			if (minutes < 10) {
				return '0' + minutes;
			}
			return '' + minutes;
		};
		if (languageShort == 'fr') {
			return  (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +':'+ roundMinutes(date.getMinutes());
		} else {
			var hours = date.getHours();
			if (hours > 12) {
				return  ((hours - 12) < 10 ? '0' + (hours - 12) : (hours - 12)) +':'+ roundMinutes(date.getMinutes()) +' PM';
			} else {
				return  (hours < 10 ? '0' + hours : hours) +':'+ roundMinutes(date.getMinutes()) +' AM';
			}
		}
	};
	return self;
})();