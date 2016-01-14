module.exports = (function () {
	var self = {};
	i18next.init(config = {
		debug: (__DEV__ ? true : false),
		lng: LANGUAGE,
		lowerCaseLng: true,
		keySeparator: '::',
		nsSeparator: ':::'
	});
	i18next.addResources(LANGUAGE, "translation", require("../../../../languages/" + LANGUAGE + ".json"));
	self.t = function () {
		return i18next.t.apply(i18next, arguments).replace(/(\r\n|\n|\r)/g, '<br />');
	};
	return self;
})();