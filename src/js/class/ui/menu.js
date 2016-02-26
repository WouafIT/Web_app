module.exports = (function() {
	var i18n = require('../resource/i18n.js');
	var map = require('../resource/map.js');
	var url = require('../resource/url.js');
	var utils = require('../utils');
	var data = require('../resource/data.js');
	var self = {};
	var $document = $(document);
	var $map = $('#map');
	var $menu = null;
	var shown = false;

	self.show = function($el) {
		if (!$el.length) {
			return;
		}
		var id = $el.data('id');
		if (!id) {
			return;
		}
		var obj = map.getResults([id])[0] || null;
		if (!obj) {
			return;
		}
		if (shown) {
			self.close();
		}
		var offset 		= $el.offset();
		var uid 		= data.getString('uid');
		var title 		= obj.title || obj.text.substr(0, 49) +'…';
		var text 		= utils.textToHTML(obj.text);
		var wouafUrl 	= url.getAbsoluteURLForState({name: 'wouaf', value: obj.id});
		var favs 		= data.getArray('favorites');
		var shareOptions = ' st_url="'+ wouafUrl +'" st_title="'+ utils.escapeHtml(utils.strip_tags(title)) +' - Wouaf IT" st_image="'+
						   url.getAbsoluteURLIcon() +'" st_summary="'+ utils.escapeHtml(utils.strip_tags(text)) +'"';
		var menu = ['<div class="w-menu-dropdown dropdown-menu" data-id="'+ obj.id +'" hidden>',
					'<div class="dropdown-item">',
					'<span class="st_sharethis_large" displayText="ShareThis"'+ shareOptions +'></span>',
					'<span class="st_facebook_large" displayText="Facebook"'+ shareOptions +'></span>',
					'<span class="st_twitter_large" displayText="Tweet"'+ shareOptions +'></span>',
					'<span class="st_reddit_large" displayText="Reddit"'+ shareOptions +'></span>',
					'<span class="st_email_large" displayText="Email"'+ shareOptions +'></span>',
					'<span class="st_print_large" displayText="Print"'+ shareOptions +'></span>',
					'</div>',
					(obj.author[0] === uid
						? '<a class="dropdown-item" href="#" data-action="delete"><i class="fa fa-trash"></i> '+ i18n.t('Delete') +'</a>'
						: '<a class="dropdown-item" href="'+ url.getCurrentPathForState({name: 'windows', value: 'contact'}) +'" data-action="contact">' +
						  '<i class="fa fa-envelope"></i> '+ i18n.t('Contact the author') +'</a>'),
					(uid && utils.indexOf(favs, obj.id) !== -1
						? '<a class="dropdown-item" href="#" data-action="unfavorite">' +
						  '<i class="fa fa-star"></i> '+ i18n.t('In your favorites ({{fav}})', {fav: obj.fav}) +'</a>'
						: '<a class="dropdown-item" href="#" data-action="favorite">' +
						  '<i class="fa fa-star-o"></i> '+ i18n.t('Add to your favorites ({{fav}})', {fav: obj.fav}) +'</a>'),
					'<a class="dropdown-item" href="'+ url.getCurrentPathForState({name: 'windows', value: 'comments'}) +'" data-action="comments">' +
					'	<i class="fa fa-comment"></i> '+ i18n.t('Add a comment ({{com}})', {com: obj.com}) +'</a>',
			/*'<a class="dropdown-item" href="#" data-action="like"><i class="fa fa-heart"></i> Voter pour ce Wouaf</a>',*/
					'<a class="dropdown-item" href="https://maps.google.com/?q='+ obj.loc[0] +','+ obj.loc[1] +'" target="_blank">',
					'<i class="fa fa-map"></i> '+ i18n.t('View on Google Map') +'</a>',
					'<a class="dropdown-item" href="https://www.google.com/maps/dir//'+ obj.loc[0] +','+ obj.loc[1] +'/" target="_blank">',
					'<i class="fa fa-location-arrow"></i> '+ i18n.t('Itinerary to this place') +'</a>',
					'<a class="dropdown-item" href="#" data-action="report"><i class="fa fa-ban"></i> '+ i18n.t('Report Abuse') +'</a>',
			/*TODO remove this line*/
					'<a class="dropdown-item" href="'+ url.getCurrentPathForState({name: 'windows', value: 'contact'}) +'" data-action="contact">' +
					'	<i class="fa fa-envelope"></i> '+ i18n.t('Contact the author') +'</a>',
					'</div>',
					'</div>'];
		$menu = $(menu.join(''));
		$menu.appendTo($map);
		$menu.hide().removeAttr('hidden');
		$menu.css({
			top: (offset.top + $el.height()),
			left: (offset.left - $menu.width())
		}).show();
		$('.w-accordion').on('scroll', function(e) {
			if (shown) {
				self.close();
				$('.w-accordion').off('scroll');
			}
		});

		//refresh sharethis content
		if (window.stButtons){
			stButtons.locateElements();
		}
		shown = true;
	};
	self.close = function() {
		if (shown && $menu) {
			$menu.remove();
			$menu = null;
			shown = false;
		}
	};
	$document.on('menu.close', self.close);

	self.shown = function () {
		return shown;
	};

	$document.on('click', function(e) {
		if (shown) {
			var $target = $(e.target);
			if (!$target.hasClass('w-menu') && !$target.parents('.w-menu-dropdown').length) {
				self.close();
			}
		}
	});
	return self;
})();