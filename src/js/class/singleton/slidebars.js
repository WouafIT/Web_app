var $ = require('jquery');
//Slidebars
require("../../../libs/slidebars/0.10.3/dist/slidebars.js");
require("../../../libs/slidebars/0.10.3/dist/slidebars.css");

module.exports = (function() {
	// private functions
	function init () {
		$.slidebars();
		//Dom Events
		$('#when').on({
			'change': showHideCustomDates
		});
		showHideCustomDates();

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