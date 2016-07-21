var map = require('../resource/map.js');
var i18n = require('../resource/i18n.js');
var wouaf = require('../ui/wouaf.js');

module.exports = (function() {
	var $document = $(document);

	$document.on('app.wouaf-show', function(e, data) {
		if (!data.ids) {
			return;
		}
		var ids = data.ids;
		//grab results
		var results = map.getResults(ids);
		var length = results.length;
		var content = '';
		if (!length) {
			$document.triggerHandler('navigation.set-state', {name: 'wouaf', value: null});
			return;
		} else if (results.length === 1) {
			$document.triggerHandler('navigation.set-state', {name: 'wouaf', value: results[0].id});
			content = wouaf.getWouaf(results[0]);
		} else {
			$document.triggerHandler('navigation.set-state', {name: 'wouaf', value: null});
			content = wouaf.getClusterList(results, map.getMap().getZoom());
		}
		// Set infoWindow content
		data.iw.setContent(content);
		data.iw.open(data.map);
	});
	var expanding = false;
	$document.on('show.bs.collapse', '.w-accordion', function () {
		expanding = true;
	});
	$document.on('shown.bs.collapse', '.w-accordion', function (e) {
		expanding = false;
		var $target = $(e.target);
		if (!$target.length) {
			return;
		}
		var id = $target.parent().data('id');
		if (!id) {
			return;
		}
		if ($target.hasClass('in')) {
			$document.triggerHandler('navigation.set-state', {name: 'wouaf', value: id});
		} else {
			$document.triggerHandler('navigation.set-state', {name: 'wouaf', value: null});
		}
	});
	$document.on('hidden.bs.collapse', '.w-accordion', function () {
		if (!expanding) {
			$document.triggerHandler('navigation.set-state', {name: 'wouaf', value: null});
		}
	});
	//update comment count
	$document.on('wouaf.update-comment', function(e, wouaf) {
		$('#map').find('.w-container[data-id="'+ wouaf.id +'"] a[data-action=comments]').html(
			'<i class="fa fa-comment"></i> '+
			(wouaf.com ? i18n.t('{{count}} comment', {count: wouaf.com}) : i18n.t('Add a comment', {count: wouaf.com}))
		);
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
})();
