module.exports = (function() {
	//Load Slidebars
	require("../../../libs/slidebars/0.10.3/dist/slidebars.js");
	var i18n = require('./i18n.js');
	var categories = require('./categories.js');

	// private functions
	function init () {
		$.slidebars();
		//Dom Events
		$('#when').on({
			'change': showHideCustomDates
		});
		showHideCustomDates();
		//populate categories list
		var $what = $('#what');
		$what.append('<option value="">'+ i18n.t('All events') +'</option>');
		$what.append(categories.getHtmlOptions());
		$('#search form').on({
			'submit': function() {
				if(__DEV__) {
					console.info('search');
				}
			}
		});
	}

	//HTML Dom
	function showHideCustomDates() {
		if ($('#when').val() === 'custom') {
			$('#search .specific-date').show('fast');
		} else {
			$('#search .specific-date').hide('fast');
		}
	}

	// API/data for end-user
	return {
		init: init
	}
})();