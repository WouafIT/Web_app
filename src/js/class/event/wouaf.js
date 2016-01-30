module.exports = (function() {
	var map = require('../resource/map.js');
	var wouaf = require('../ui/wouaf.js');
	var utils = require('../utils');
	var $document = $(document);

	$document.on('app.wouaf-show', function(e, data) {
		if (!data.ids) {
			return;
		}
		var mapResults = map.getResults();
		if (!mapResults.count || !mapResults.results) {
			return;
		}

		var ids = data.ids;
		if (ids.length === 1) {
			$document.triggerHandler('history.set-state', {state: 'wouaf', value: {'id': ids.join('')}});
		}
		console.info(mapResults);
		//grab results
		var results = [];
		for(var i = 0, l = mapResults.results.length; i < l; i++) {
			var result = mapResults.results[i];
			if (utils.indexOf(ids, result.id) !== -1) {
				results.push(result);
			}
		}
		var length = results.length;
		var content = '';
		if (!length) {
			$document.triggerHandler('history.set-state', {state: 'wouaf', value: null});
			return;
		} else if (results.length === 1) {
			$document.triggerHandler('history.set-state', {state: 'wouaf', value: {'id': results[0].id}});
			content = wouaf.getWouaf(results[0]);
		} else {
			content = wouaf.getList(results);
		}
		// Set infoWindow content
		data.iw.setContent(content);
		data.iw.open(data.map);
	});
})();
