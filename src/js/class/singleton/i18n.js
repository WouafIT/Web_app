//i18next
var i18n = require("../../../libs/i18next/1.10.1/i18next-1.10.1.js");
var $ 	 = require('jquery');

module.exports = (function() {
	var init = function () {
		//Init plugin with current language
		i18n.init({ resStore: {dev: {translation: require("../../../../languages/" + LANGUAGE + ".json")} } });
		//Translate base HTML
		$("body").i18n();
	}

	// API/data for end-user
	return {
		init: init
	}
})();
