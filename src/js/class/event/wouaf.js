var i18n = require('../resource/i18n.js');

module.exports = (function() {
	var $document = $(document);
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
			//scroll parent
			var $parent = $target.parents('.w-accordion');
			var offsetTop = $target.parents('.w-container').offset().top - $parent.offset().top;
			$parent.animate({scrollTop: offsetTop + $parent.scrollTop()}, 300);
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
}());
