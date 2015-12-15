module.exports = (function () {
	var self = {};
	i18next.init(config = {
		debug: (__DEV__ ? true : false),
		lng: LANGUAGE,
		lowerCaseLng: true
	});
	i18next.addResources(LANGUAGE, "translation", require("../../../../languages/" + LANGUAGE + ".json"));
	i18next.on('missingKey', function(lngs, namespace, key, res) {
		if (__DEV__) {
			console.info('Missing i18n key', key, arguments);
		}
	})
	self.t = function () {
		return i18next.t.apply(i18next, arguments).replace(/(\r\n|\n|\r)/g, '<br />');
	}
	return self;
})();