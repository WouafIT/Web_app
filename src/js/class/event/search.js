module.exports = (function() {
	var $document = $(document);
	var data = require('../resource/data.js');
	var map = require('../resource/map.js');
	var query = require('../resource/query.js');
	var toast = require('../resource/toast.js');
	var i18n = require('../resource/i18n.js');

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
		query.posts(params, function(data) {
			map.setResults(data, true);
			$document.triggerHandler('tabs.add', {
				id: 'search-results',
				name: '<i class="fa fa-search-plus"></i> '+ i18n.t('{{count}} result', {count: data.count}),
				data: {type: 'result', data: data},
				removable: false
			});
		}, function(msg) {
			toast.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), 5000);
		});
	});
})();