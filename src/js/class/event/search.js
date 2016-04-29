module.exports = (function() {
	var $document = $(document);
	var data = require('../resource/data.js');
	var map = require('../resource/map.js');
	var query = require('../resource/query.js');
	var toast = require('../resource/toast.js');
	var i18n = require('../resource/i18n.js');
	var mlRadius = {10: 5, 20: 10, 30: 15, 50: 30, 70: 45, 100: 60, 150: 90, 200: 120, 300: 180};

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
		delete params.from;
		query.posts(params, function(result) {
			map.setResults(result);

			//show results number
			var notificationLabel 	= i18n.t('{{count}} Wouaf', { count: result.count });
			var unit 				= data.getString('unit');
			var radius 				= unit == 'km' ? data.getInt('radius') : mlRadius[data.getInt('radius')];
			if (result.count == 500) {
				toast.show(i18n.t('{{max}} displayed within {{radius}}{{unit}} (maximum reached)', {max: notificationLabel, radius: radius, unit: i18n.t(unit) }), 4000);
			} else if (result.count) {
				toast.show(i18n.t('{{wouaf}} displayed within {{radius}}{{unit}}', { count: result.count, wouaf: notificationLabel, radius: radius, unit: i18n.t(unit) }), 4000);
			} else {
				toast.show(i18n.t('At the moment there are no Wouaf within {{radius}}{{unit}}', { radius: radius, unit: i18n.t(unit) }), 6000);
			}

			$document.triggerHandler('tabs.add', {
				id: 'search-results',
				name: '<i class="fa fa-search-plus"></i> '+ i18n.t('{{count}} result', {count: result.count}),
				data: {type: 'result', data: result},
				removable: false
			});
		}, function(msg) {
			toast.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), 5000);
		});
	});
})();