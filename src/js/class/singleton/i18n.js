module.exports = (function () {
	var self = {};
	//i18next
	var i18next = require("../../../libs/i18next/1.10.1/i18next-1.10.1.js");
	//Init plugin with current language
	i18next.init({
					 debug: (__DEV__ ? true : false),
					 lng: LANGUAGE,
					 resStore: {dev: {translation: require("../../../../languages/" + LANGUAGE + ".json")} }
				 });

	self.t = function() {
		var r = i18next.t.apply(this, arguments);
		return r.replace(/(\r\n|\n|\r)/g, '<br />');
	}
	return self;
})();