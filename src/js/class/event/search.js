module.exports = (function() {
	var $document = $(document);
	var data = require('../resource/data.js');
	var map = require('../resource/map.js');
	var query = require('../resource/query.js');
	var toast = require('../resource/toast.js');
	var i18n = require('../resource/i18n.js');
	var slidebars = require('../resource/slidebars.js');
	var mlRadius = {10: 5, 20: 10, 30: 15, 50: 30, 70: 45, 100: 60, 150: 90, 200: 120, 300: 180};
	var previousSearchParams = {};
	var previousSearchCount = 0;
	//Event to launch a new search
	$document.on('app.search', function (event, params) {
		params = params || {};
		if (!params.refresh) {
			params.searchId = (new Date()).getTime();
			params = $.extend(params, slidebars.getSearchParams());
		} else {
			params = $.extend(params, previousSearchParams);
		}
		if (!params.loc) {
			params.loc = map.getMap().getCenter();
		} else if (!params.refresh) {
			map.setCenter(params.loc, false);
		}
		if (!params.radius) {
			params.radius = data.getInt('radius');
		}
		if (__DEV__) {
			console.info('Search params'+ (params.refresh ? ' (refresh)' : '') +' '+ params.searchId, params);
		}
		query.posts(params, function(results, params) {
			//save previous search params
			previousSearchParams = $.extend({}, params);
			delete previousSearchParams.loc;
			delete previousSearchParams.refresh;
			//add query parameters to results for further reference
			results.params = params;
			map.setResults(results);
			var count = map.getResultsCount();
			//show results number
			var notificationLabel;
			if (params.refresh) {
				$document.triggerHandler('app.refresh-search', params);
				notificationLabel 	= i18n.t('Adding {{count}} Wouaf', { count: count - previousSearchCount });
			} else {
				$document.triggerHandler('app.new-search', params);
				notificationLabel 	= i18n.t('{{count}} Wouaf displayed', { count: count });
			}
			previousSearchCount = count;
			var unit 			= data.getString('unit');
			var radius 			= unit == 'km' ? data.getInt('radius') : mlRadius[data.getInt('radius')];
			if (count == 500) {
				toast.show(i18n.t('{{max}} within {{radius}}{{unit}} (maximum reached)', {max: notificationLabel, radius: radius, unit: i18n.t(unit) }), 4000);
			} else if (count) {
				toast.show(i18n.t('{{wouaf}} within {{radius}}{{unit}}', { count: count, wouaf: notificationLabel, radius: radius, unit: i18n.t(unit) }), 4000);
			} else {
				toast.show(i18n.t('At the moment there are no Wouaf within {{radius}}{{unit}}', { radius: radius, unit: i18n.t(unit) }), 6000);
			}

			$document.triggerHandler('navigation.set-state', {name: 'tag', value: (params.tag ? params.tag : null)});
			$document.triggerHandler('tabs.add', {
				id: 'search-results',
				name: '<i class="fa fa-search-plus"></i> '+ i18n.t('{{count}} result', {count: count}),
				data: {type: 'result', data: results},
				removable: false
			});
		}, function(msg) {
			toast.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), 5000);
		});
	});
})();