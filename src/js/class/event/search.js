module.exports = (function() {
	var $document = $(document);
	var data = require('../singleton/data.js');
	var map = require('../singleton/map.js');
	var query = require('../singleton/query.js');

	//Event to launch a new search
	$document.on('app.search', function (event, params) {
		params = params || {};
		params.searchId = (new Date()).getTime();
		if (!params.loc) {
			params.loc = map.getMap().getCenter();
		}
		if (!params.radius) {
			params.radius = data.getInt('radius');
		}
		if (__DEV__) {
			console.info('Search params', params);
		}
		query.posts(params, map.setPins);
	});
})();