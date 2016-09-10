var i18n = require('./i18n.js');
var utils = require('../utils.js');
require('../../../libs/DateTimePicker/dist/DateTimePicker.min.js');
require('../../../libs/DateTimePicker/dist/i18n/DateTimePicker-i18n-'+ LANGUAGE +'.js');

module.exports = (function() {
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
				return utils.zeroPad(date.getDate(), 2) +'/'+ utils.zeroPad(date.getMonth() + 1, 2) +'/'+ date.getFullYear();
			} else {
				return utils.zeroPad(date.getMonth() + 1, 2) +'/'+ utils.zeroPad(date.getDate(), 2) +'/'+ date.getFullYear();
			}
		} else {
			if (languageShort == 'fr') {
				return date.getDate() +' '+ locales.shortMonthNames[date.getMonth()] +'. '+ date.getFullYear();
			} else {
				return locales.shortMonthNames[date.getMonth()] +'. '+ date.getDate() +', '+ date.getFullYear();
			}
		}
	};
	self.formatTime = function(date, round) {
		round = round !== false;
		var format = function(hours, minutes, h12) {
			if (round) {
				minutes = Math.round(minutes / minuteInterval) * minuteInterval;
				if (minutes == 60) {
					minutes = 0;
					hours++;
				}
				if (hours == 24) { //do not round time if it goes to the next day
					minutes = date.getMinutes();
					hours = date.getHours();
				}
			}
			minutes = utils.zeroPad(minutes, 2);
			if (h12) {
				if (hours > 12) {
					hours = hours - 12;
					hours = utils.zeroPad(hours, 2) +' PM';
				} else {
					hours = utils.zeroPad(hours, 2) +' AM';
				}
			} else {
				hours = utils.zeroPad(hours, 2);
			}
			return hours +':'+ minutes;
		};
		if (languageShort == 'fr') {
			return  format(date.getHours(), date.getMinutes(), false);
		} else {
			return  format(date.getHours(), date.getMinutes(), true);
		}
	};
	return self;
}());