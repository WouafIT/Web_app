module.exports = (function() {
	var self = {};
	//i18next
	var i18next = require("../../../libs/i18next/1.10.1/i18next-1.10.1.js");
	//Init plugin with current language
	i18next.init({ resStore: {dev: {translation: require("../../../../languages/" + LANGUAGE + ".json")} } });

	self.t = i18next.t;
	return self;
})();