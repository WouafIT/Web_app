var $ = require('jquery');
//Slidebars
require("../../../libs/slidebars/0.10.3/dist/slidebars.js");
require("../../../libs/slidebars/0.10.3/dist/slidebars.css");

module.exports = (function() {
	// private functions
	function init () {
		//i18n
		var i18n = require('./i18n.js');

		$.slidebars();
		//Dom Events
		$('#when').on({
			'change': showHideCustomDates
		});
		showHideCustomDates();
		//populate categories list
		var data = require('./data.js');

		//set categories values
		var categories = data.get('categories');
		var $what = $('#what');
		$what.append('<option value="">'+ i18n.t('All events') +'</option>');
		if (categories) {
			for(var i = 0, l = categories.length; i < l; i++) {
				//console.info(categories[i]['label']);
				$what.append('<option value="'+ categories[i]['id'] +'">'+ i18n.t(categories[i]['label']) +'</option>');
			}
		}

		//$('#what')
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