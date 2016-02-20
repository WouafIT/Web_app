module.exports = (function() {
	var $document = $(document);
	var data = require('../resource/data.js');
	var map = require('../resource/map.js');
	var query = require('../resource/query.js');

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
		query.posts(params, map.setResults);
	});
})();