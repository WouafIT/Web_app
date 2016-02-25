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
			$document.triggerHandler('navigation.set-state', {name: 'wouaf', value: ids.join('')});
		}
		//grab results
		var results = getResults(ids);
		var length = results.length;
		var content = '';
		if (!length) {
			$document.triggerHandler('navigation.set-state', {name: 'wouaf', value: null});
			return;
		} else if (results.length === 1) {
			$document.triggerHandler('navigation.set-state', {name: 'wouaf', value: results[0].id});
			content = wouaf.getWouaf(results[0]);
		} else {
			content = wouaf.getList(results);
		}
		// Set infoWindow content
		data.iw.setContent(content);
		data.iw.open(data.map);
		//refresh sharethis content
		if (window.stButtons){
			stButtons.locateElements();
		}
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
	$document.on('click', 'a.dropdown-item, a.w-comments', function(e) {
		var data = require('../resource/data.js');
		var $target = $(e.target);
		if (!$target.data('action')) {
			return;
		}
		e.preventDefault();
		var id = $target.parents('.w-container').data('id');
		var obj = getResults([id])[0] || null;
		if (!obj) {
			return;
		}
		var uid = data.getString('uid');
		switch ($target.data('action')) {
			case 'delete':
				if (obj.author[0] !== uid) { //not user wouaf
					return;
				}
				//show confirm page
				windows.show({
					title: i18n.t('Delete your Wouaf'),
					text: i18n.t('delete_details'),
					confirm: function() {
						query.deletePost(obj.id,
							function(result) { //success
								map.removeResult(obj.id);
								toast.show(i18n.t('Your Wouaf is deleted'));
							}, function (msg) { //error
								toast.show(i18n.t('An error has occurred, please try again later {{error}}', {error: i18n.t(msg[0])}));
							}
						);
					}
				});
				break;
			case 'favorite':
				if (!uid) { //user is not logged, show login window
					windows.login(i18n.t('Login to favorite a wouaf'));
					return;
				}
				var favs = data.getArray('favorites');
				if (utils.indexOf(favs, obj.id) === -1) {
					obj.fav++;
					$target.replaceWith('<a class="dropdown-item" href="#" data-action="unfavorite"><i class="fa fa-star"></i> '+ i18n.t('In your favorites ({{fav}})', {fav: obj.fav}) +'</a>');
					query.addFavorite(obj.id, function() {
						toast.show(i18n.t('This Wouaf is added to your favorites'));
					}, function (msg) {
						toast.show(i18n.t('An error has occurred, please try again later {{error}}', {error: i18n.t(msg[0])}));
					});
					favs.push(obj.id);
					data.setArray('favorites', favs);
				}
				break;
			case 'unfavorite':
				if (!uid) { //user is not logged, return
					return;
				}
				var favs = data.getArray('favorites');
				if (utils.indexOf(favs, obj.id) !== -1) {
					obj.fav--;
					$target.replaceWith('<a class="dropdown-item" href="#" data-action="favorite"><i class="fa fa-star-o"></i> '+ i18n.t('Add to your favorites ({{fav}})', {fav: obj.fav}) +'</a>');
					query.removeFavorite(obj.id, function() {
						toast.show(i18n.t('This Wouaf is removed from your favorites'));
					}, function (msg) {
						toast.show(i18n.t('An error has occurred, please try again later {{error}}', {error: i18n.t(msg[0])}));
					});
					delete favs[utils.indexOf(favs, obj.id)];
					data.setArray('favorites', favs);
				}
				break;
			case 'contact':
				if (!uid) { //user is not logged, show login window
					windows.login(i18n.t('Login to contact author'));
					return;
				}
				//show contact page
				windows.show({
					href: 'contact'
				});
				break;
			case 'comments':
				if (!uid) { //user is not logged, show login window
					windows.login(i18n.t('Login to comment a wouaf'));
					return;
				}
				//show comments page
				windows.show({
					href: 'comments'
				});
				break;
			/*case 'like':
				if (!uid) { //user is not logged, show login window
					windows.login(i18n.t('Login to like a wouaf'));
					return;
				}
				break;*/
			case 'report':
				if (!uid) { //user is not logged, show login window
					windows.login(i18n.t('Login to report a wouaf'));
					return;
				}
				//show confirm page
				windows.show({
					title: i18n.t('Report this Wouaf'),
					text: i18n.t('report_details'),
					confirm: function() {
						query.reportPost(obj.id,
							function(result) {
								toast.show(i18n.t('This Wouaf has been reported'));
							}, function (msg) {
								toast.show(i18n.t('An error has occurred, please try again later {{error}}', {error: i18n.t(msg[0])}));
							}
						);
					}
				});
				break;
		}
	});
})();
