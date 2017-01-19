var i18n = require('../resource/i18n.js');
var url = require('../resource/url.js');
var utils = require('../utils');
var data = require('../resource/data.js');
var windows = require('../resource/windows.js');
var wouafs = require('../resource/wouafs.js');

module.exports = (function() {
	var self = {};
	var $map = $('#map');
	var $modal = windows.getWindows();
	var $slidebar = $('.sb-slidebar');
	var $menu = null;
	var shown = false;

	var showWouafMenu = function($el) {
		var id = $el.data('id');
		if (!id) {
			return;
		}
		var obj = wouafs.getLocal(id);
		if (!obj) {
			return;
		}
		var offset 		= $el.offset();
		var uid 		= data.getString('uid');
		var title 		= utils.getWouafTitle(obj);
		var wouafUrl 	= url.getAbsoluteURLForStates([{name: 'wouaf', value: obj.id}]);
		var wouafLocaleUrl = url.getAbsoluteURLForStates([{name: 'wouaf', value: obj.id}], true);
		var favs 		= data.getArray('favorites');
		var interests 	= data.getArray('interests');

		var following 	= data.getArray('following');
		var menu = ['<div class="w-menu-dropdown dropdown-menu" data-id="'+ obj.id +'" data-menu="wouaf" hidden>',
			'<div class="dropdown-item sharing"><i class="fa fa-share-alt"></i> ', i18n.t('Share'),
				' <span class="share facebook"><a href="#" data-action="facebook-share" data-href="', encodeURIComponent(wouafLocaleUrl) ,'" title="'+ i18n.t('Share on Facebook') +'">',
					'<i class="fa fa-facebook-square"></i></a></span>',
				'<span class="share twitter"><a href="https://twitter.com/intent/tweet?text='+ encodeURIComponent(title) +'&url='+ encodeURIComponent(wouafLocaleUrl) +'&via=Wouaf_IT" target="_blank" title="'+ i18n.t('Share on Twitter') +'">',
					'<i class="fa fa-twitter-square"></i></a></span>',
				'<span class="share reddit"><a href="https://www.reddit.com/submit?url='+ encodeURIComponent(wouafLocaleUrl) +'&title='+ encodeURIComponent(title) +'" target="_blank" title="'+ i18n.t('Share on Reddit') +'">',
					'<i class="fa fa-reddit-square"></i></a></span>',
				'<span class="share email"><a href="mailto:?subject='+ i18n.t('Shared from Wouaf IT:') +' '+ encodeURIComponent(title) +'&body='+ encodeURIComponent(wouafLocaleUrl) +'" target="_blank" title="'+ i18n.t('Share by Email') +'">',
					'<i class="fa fa-envelope-o"></i></a></span>',
			'</div>',
			'<div class="dropdown-item"><i class="fa fa-link"></i> <input type="text" class="form-control link" value="'+ wouafUrl +'" /></div>'];
		if (utils.indexOf(interests, obj.id) !== -1) {
			menu = menu.concat(['<a class="dropdown-item" href="#" data-action="notinterested" title="'+ i18n.t('Click to remove your interest') +'">' +
								'<i class="fa fa-heart w-red"></i> '+ i18n.t('Im interested') + (obj.interest ? ' ('+ utils.round(obj.interest) +')' : '') +'</a>']);
		} else {
			menu = menu.concat(['<a class="dropdown-item" href="#" data-action="interested" title="'+ i18n.t('Click to add your interest') +'">' +
								'<i class="fa fa-heart-o"></i> '+ i18n.t('Interested') + (obj.interest ? ' ('+ utils.round(obj.interest) +')' : '') +'</a>']);
		}
		if (utils.indexOf(favs, obj.id) !== -1) {
			menu = menu.concat(['<a class="dropdown-item" href="#" data-action="unfavorite">' +
								'<i class="fa fa-star w-yellow"></i> '+ i18n.t('In your favorites') + (obj.fav ? ' ('+ utils.round(obj.fav) +')' : '') +'</a>']);
		} else {
			menu = menu.concat(['<a class="dropdown-item" href="#" data-action="favorite">' +
								'<i class="fa fa-star-o"></i> '+ i18n.t('Add to your favorites') + (obj.fav ? ' ('+ utils.round(obj.fav) +')' : '') +'</a>']);
		}
		menu = menu.concat(['<a class="dropdown-item" href="'+ url.getAbsoluteURLForStates([{name: 'wouaf', value: obj.id}, {name: 'windows', value: 'comments'}]) +'" data-action="comments">',
		'	<i class="fa fa-comment w-green"></i> '+ (obj.com ? i18n.t('View the {{count}} comment', {count: obj.com}) : i18n.t('Add a comment', {count: obj.com})) +'</a>']);
		if (obj.author[0] === uid) { //user is the Wouaf Author
			menu = menu.concat(['<a class="dropdown-item" href="#" data-action="delete"><i class="fa fa-trash"></i> '+ i18n.t('Delete') +'</a>']);
			if (obj.contact) {
				menu = menu.concat(['<a class="dropdown-item" href="#" data-action="disallow-contact">' +
									'<i class="fa fa-envelope"></i> '+ i18n.t('Disallow contact by email') +'</a>']);
			} else {
				menu = menu.concat(['<a class="dropdown-item" href="#" data-action="allow-contact">' +
									'<i class="fa fa-envelope"></i> '+ i18n.t('Allow contact by email') +'</a>']);
			}
		} else {
			if (obj.contact) {
				menu = menu.concat(['<a class="dropdown-item" href="'+
									url.getAbsoluteURLForStates([{name: 'wouaf', value: obj.id}, {name: 'windows', value: 'contact'}]) +'" data-action="contact">' +
									'<i class="fa fa-envelope"></i> '+ i18n.t('Contact the author') +'</a>']);
			}
			if (utils.indexOf(following, obj.author[0]) !== -1) {
				menu = menu.concat(['<a class="dropdown-item" href="#" data-action="unfollow" data-uid="' + obj.author[0] + '">' +
									'<i class="fa fa-angle-double-right"></i> ' + i18n.t('Unfollow the author') + '</a>']);
			} else {
				menu = menu.concat(['<a class="dropdown-item" href="#" data-action="follow" data-uid="' + obj.author[0] + '">' +
									'<i class="fa fa-angle-double-right"></i> ' + i18n.t('Follow the author') + '</a>']);
			}
			menu = menu.concat([]);
		}
		menu = menu.concat(['<a class="dropdown-item" href="#" data-action="calendar">',
			'	<i class="fa fa-calendar"></i> ' + i18n.t('Add to calendar') + '</a>',
			'<a class="dropdown-item" href="https://maps.google.com/?q='+ obj.loc[0] +','+ obj.loc[1] +'" target="_blank">',
			'	<i class="fa fa-map"></i> '+ i18n.t('View on Google Map') +'</a>',
			'<a class="dropdown-item" href="https://www.google.com/maps/dir//'+ obj.loc[0] +','+ obj.loc[1] +'/" target="_blank">',
			'	<i class="fa fa-location-arrow"></i> '+ i18n.t('Itinerary to this place') +'</a>',
			'<a class="dropdown-item" href="#" data-action="report"><i class="fa fa-ban"></i> '+ i18n.t('Report Abuse') +'</a>',
			'</div>']);
		$menu = $(menu.join(''));
		$menu.appendTo($map);
		$menu.hide().removeAttr('hidden');
		if ($('html').hasClass('sb-active')) {
			//compensate slidebar menu if opened
			offset.left -= $('.sb-left').outerWidth();
		}
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
	var showCommentMenu = function($el) {
		var id = $el.data('id');
		if (!id) {
			return;
		}
		var offset 		= $el.offset();
		var isAuthor 	= $el.parents('blockquote').hasClass('current-user');
		var wouafId 	= $el.parents('.modal-comments').data('id');
		var commentUrl 	= url.getAbsoluteURLForStates([{name: 'wouaf', value: wouafId}, {name: 'windows', value: 'comments'}]);
		var menu = ['<div class="w-menu-dropdown dropdown-menu" data-id="'+ id +'" data-wouaf="'+ wouafId +'" data-menu="comment" hidden>',
			'<div class="dropdown-item"><i class="fa fa-link"></i> <input type="text" class="form-control link" value="'+ commentUrl +'" /></div>',
			(isAuthor
				? '<a class="dropdown-item" href="#" data-action="delete"><i class="fa fa-trash"></i> '+ i18n.t('Delete') +'</a>'
				: ''),
			'<a class="dropdown-item" href="#" data-action="report"><i class="fa fa-ban"></i> '+ i18n.t('Report an inappropriate comment') +'</a>',
			'</div>'];
		$menu = $(menu.join(''));
		$menu.appendTo($modal);
		$menu.hide().removeAttr('hidden');
		$menu.css({
			top: (offset.top + $el.height()),
			left: (offset.left - $menu.width() + $el.width())
		}).show();
		shown = true;
	};

	var showListingMenu = function($el) {
		var id = $el.parents('.tab-pane').attr('id');
		var sort = $el.data('sort');
		var filter = $el.data('filter');
		var proximity = $el.data('proximity');
		if (!id) {
			return;
		}
		var offset = $el.offset();
		var menu = ['<div class="w-menu-dropdown dropdown-menu" data-id="'+ id +'" data-menu="listing" hidden>',
			'<a class="dropdown-item'+ (filter === 'yes' ? ' active' : '') +'" href="#" data-action="filter-active"><i class="fa fa-filter"></i> '+i18n.t('Hide Wouafs gone') + (filter === 'yes' ? ' <i class="fa fa-check"></i>' : '') +'</a>',
			(proximity === 'yes'
				? '<a class="dropdown-item'+ (sort === 'proximity' ? ' active' : '') +'" href="#" data-action="sort-proximity"><i class="fa fa-sort-amount-desc"></i> '+i18n.t('Sort by Proximity') + (sort === 'proximity' ? ' <i class="fa fa-check"></i>' : '') +'</a>'
				: ''),
			'<a class="dropdown-item'+ (sort === 'date-desc' ? ' active' : '') +'" href="#" data-action="sort-date-desc"><i class="fa fa-sort-numeric-desc"></i> '+i18n.t('Sort by Starting Date descending') + (sort === 'date-desc' ? ' <i class="fa fa-check"></i>' : '') +'</a>',
			'<a class="dropdown-item'+ (sort === 'date-asc' ? ' active' : '') +'" href="#" data-action="sort-date-asc"><i class="fa fa-sort-numeric-asc"></i> '+ i18n.t('Sort by Starting Date ascending') + (sort === 'date-asc' ? ' <i class="fa fa-check"></i>' : '') +'</a>',
			'<a class="dropdown-item'+ (sort === 'comments' ? ' active' : '') +'" href="#" data-action="sort-comments"><i class="fa fa-sort-amount-desc"></i> '+ i18n.t('Sort by Comments') + (sort === 'comments' ? ' <i class="fa fa-check"></i>' : '') +'</a>',
			'<a class="dropdown-item'+ (sort === 'fav' ? ' active' : '') +'" href="#" data-action="sort-fav"><i class="fa fa-sort-amount-desc"></i> '+ i18n.t('Sort by Favorites') + (sort === 'fav' ? ' <i class="fa fa-check"></i>' : '') +'</a>',
			'<a class="dropdown-item'+ (sort === 'interest' ? ' active' : '') +'" href="#" data-action="sort-interest"><i class="fa fa-sort-amount-desc"></i> '+ i18n.t('Sort by Interest') + (sort === 'interest' ? ' <i class="fa fa-check"></i>' : '') +'</a>',
			'<a class="dropdown-item'+ (sort === 'type' ? ' active' : '') +'" href="#" data-action="sort-type"><i class="fa fa-sort-alpha-asc"></i> '+ i18n.t('Sort by Category') + (sort === 'type' ? ' <i class="fa fa-check"></i>' : '') +'</a>',
		'</div>'];
		$menu = $(menu.join(''));
		$menu.appendTo($slidebar);
		$menu.hide().removeAttr('hidden');
		$menu.css({
			top: (offset.top + $el.height()),
			left: (offset.left - $menu.width() + $el.width())
		}).show();
		shown = true;
	};

	self.show = function($el) {
		if (!$el || !$el.length) {
			return;
		}
		if (shown) {
			self.close();
		}
		var type = $el.data('menu');
		if (type === 'wouaf') {
			showWouafMenu($el);
		} else if (type === 'comment') {
			showCommentMenu($el);
		} else if (type === 'listing') {
			showListingMenu($el);
		}
	};
	self.close = function() {
		if (shown && $menu) {
			$menu.remove();
			$menu = null;
			shown = false;
		}
	};
	self.shown = function () {
		return shown;
	};

	return self;
}());