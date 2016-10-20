var data = require('../resource/data.js');
var map = require('../resource/map.js');
var query = require('../resource/query.js');
var toast = require('../resource/toast.js');
var i18n = require('../resource/i18n.js');
var slidebars = require('../resource/slidebars.js');
var utils = require('../utils.js');

module.exports = (function() {
	var $document = $(document);
	var previousSearchParams = {};
	var previousSearchCount = 0;
	//Event to launch a new search
	$document.on('app.search', function (event, params) {
		params = params || {};
		//reset search if more than 2000 results are displayed
		if (previousSearchCount >= 2000) {
			params.refresh = false;
		}
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
			params.radius = data.getInt('radius') || 70;
		}
		if (!params.limit) {
			params.limit = data.getInt('limit') || 500;
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
			//keep last coordinates from results
			var searchResultsCount = results.results.length;
			if (searchResultsCount === results.params.limit) {
				var furtherLoc = results.results.slice(-1)[0].loc;
				results.params.radius = utils.distance(results.params.loc.lat(), results.params.loc.lng(), furtherLoc[0], furtherLoc[1]);
			} else {
				results.params.radius = data.getInt('radius') || 70;
			}
			if (!params.refresh) {
				map.resetCircles();
			}
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
			var unit 	= data.getString('unit');
			var radius 	= unit === 'km' ? results.params.radius : utils.kmToMiles(results.params.radius);
			radius 		= radius > 10 ? Math.round(radius) : (Math.round(radius * 10) / 10);
			if (count) {
				toast.show(i18n.t('{{wouaf}} within {{radius}}{{unit}}', { count: count, wouaf: notificationLabel, radius: radius, unit: i18n.t(unit) }), 4000);
			} else {
				toast.show(i18n.t('At the moment there are no Wouaf within {{radius}}{{unit}}', { radius: radius, unit: i18n.t(unit) }), 6000, null, true);
			}
			map.drawCircle(radius);

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
}());