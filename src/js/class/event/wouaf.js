var i18n = require('../resource/i18n.js');
var wouaf = require('../ui/wouaf.js');
var data = require('../resource/data.js');
var utils = require('../utils.js');

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
		if ($target.hasClass('show')) {
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
	//update comments count
	$document.on('wouaf.update-comment', function(e, obj) {
		var $wouaf = $('#map').find('.w-container[data-id="'+ obj.id +'"]');
		$wouaf.find('.w-content a[data-action=comments]').html(
			'<i class="fa fa-comment"></i> '+
			(obj.com ? i18n.t('{{count}} comment', {count: obj.com}) : i18n.t('Add a comment', {count: obj.com}))
		);
		$wouaf.find('.w-meta').html(wouaf.getMeta(obj));
	});
	//update interest count
	$document.on('app.added-interest app.deleted-interest', function(e, obj) {
		var $wouaf = $('#map').find('.w-container[data-id="'+ obj.id +'"]');
		var content = '';
		if (obj.interest) {
			var interests = data.getArray('interests');
			if (utils.indexOf(interests, obj.id) !== -1) {
				content = ['<a class="w-fav" href="#" data-action="notinterested" title="', i18n.t('Click to remove your interest') ,'">',
										  '<i class="fa fa-heart w-red"></i> ', utils.round(obj.interest) ,'</a>'].join('');
			} else {
				content = ['<a class="w-fav" href="#" data-action="interested" title="', i18n.t('Click to add your interest') ,'">',
										  '<i class="fa fa-heart-o"></i> ', utils.round(obj.interest) ,'</a>'].join('');
			}
		}
		$wouaf.find('.w-bottom .w-fav').remove();
		if (content) {
			$wouaf.find('.w-bottom').prepend(content);
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
}());
