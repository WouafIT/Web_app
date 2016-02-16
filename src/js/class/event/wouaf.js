module.exports = (function() {
	var map = require('../resource/map.js');
	var windows = require('../resource/windows.js');
	var i18n = require('../resource/i18n.js');
	var query = require('../resource/query.js');
	var toast = require('../resource/toast.js');
	var wouaf = require('../ui/wouaf.js');
	var utils = require('../utils');
	var $document = $(document);

	var getResults = function(ids) {
		var mapResults = map.getResults();
		if (!mapResults.count || !mapResults.results) {
			return [];
		}
		//grab results
		var results = [];
		for(var i = 0, l = mapResults.results.length; i < l; i++) {
			var result = mapResults.results[i];
			if (utils.indexOf(ids, result.id) !== -1) {
				results.push(result);
				if (results.length == ids.length) {
					return results;
				}
			}
		}
		return results;
	};

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
			$document.triggerHandler('navigation.set-state', {state: 'wouaf', value: {'id': ids.join('')}});
		}
		//grab results
		var results = getResults(ids);
		var length = results.length;
		var content = '';
		if (!length) {
			$document.triggerHandler('navigation.set-state', {state: 'wouaf', value: null});
			return;
		} else if (results.length === 1) {
			$document.triggerHandler('navigation.set-state', {state: 'wouaf', value: {'id': results[0].id}});
			content = wouaf.getWouaf(results[0]);
		} else {
			content = wouaf.getList(results);
		}
		// Set infoWindow content
		data.iw.setContent(content);
		data.iw.open(data.map);
		//refresh sharethis content
		if (window.stButtons){stButtons.locateElements();}
	});

	//Swipebox
	$document.on('click', 'a.swipebox', function(e) {
		e.preventDefault();
		var $this = $(this);
		var galleryImg = [];
		var initialIndex = 0;
		$this.parent().find('a.swipebox').each(function(i) {
			var $that = $(this);
			if ($this.attr('href') === $that.attr('href')) {
				initialIndex = i;
			}
			galleryImg.push({href: $that.attr('href')});
		});
		$.swipebox(galleryImg, {hideBarsDelay: 0, loopAtEnd: true, initialIndexOnArray: initialIndex });
	});

	//Wouaf Actions
	$document.on('click', 'a.dropdown-item', function(e) {
		var $target = $(e.target);
		if (!$target.data('action')) {
			return;
		}
		e.preventDefault();
		var id = $target.parents('.w-menu').data('id');
		var obj = getResults([id])[0] || null;
		if (!obj) {
			return;
		}
		switch ($target.data('action')) {
			case 'delete':
				//show confirm page
				windows.show({
					title: i18n.t('Delete your Wouaf'),
					text: i18n.t('delete_details'),
					confirm: function() {
						query.deletePost(obj.id, function(result) {
							if (result && result.result && result.result == 1) {
								map.removePin(obj.id);
								toast.show(i18n.t('Your Wouaf is deleted'));
							} else if (result && result.msg) {
								toast.show(i18n.t(result.msg[0]));
							} else {
								query.connectionError();
							}
						});
					}
				});
				break;
			case 'favorite':

				break;
			case 'unfavorite':

				break;
			case 'contact':

				break;
			case 'comment':

				break;
			case 'like':

				break;
			case 'report':

				break;
		}
	});
})();
