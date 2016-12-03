//Load Slidebars
require("../../../libs/slidebars/0.10.3/dist/slidebars.js");
var i18n = require('./i18n.js');
var categories = require('./categories.js');
var map = require('./map.js');
var dtp = require('./datetimepicker.js');
var utils = require('../utils.js');

module.exports = (function() {
	var $document = $(document);
	var $window = $(window);
	var $loader = $('#loader');
	var $body = $('body');
	var $site = $('#sb-site');
	var $category = $('#what');
	var $when = $('#when');
	var $where = $('#where');
	var $whereLoc = $('#where-loc');
	var $hashtag = $('#hashtag');
	var $start = $('#start');
	var $end = $('#end');
	var $emptyHashtag = $('#hashtag-empty');
	$emptyHashtag.hide().removeAttr('hidden');
	var $emptyWhere = $('#where-empty');
	$emptyWhere.hide().removeAttr('hidden');
	var width;
	var oSlidebar;

	var isDualView = function() {
		if (!width) {
			width = $window.width();
			$body.toggleClass('dualview', width >= 768);
		}
		return width >= 768;
	};

	$window.on('resize', function() {
		width = null;
		isDualView();
		$document.triggerHandler('tabs.resize');
	});

	var showHideCustomDates = function() {
		if ($when.val() === 'custom') {
			$('#search .specific-date').show('fast');
		} else {
			$('#search .specific-date').hide('fast');
		}
	};

	// private functions
	var init = function () {
		var $search = $('#search');
		var $form = $search.find('form');
		var $categoriesHelp = $form.find('.categories-help');

		oSlidebar = new $.slidebars({
			siteClose: function () {
				return !isDualView();
			}
		});
		//Events
		$document.on('slide.open', function() {
			oSlidebar.slidebars.open('left');
		});
		$document.on('slide.close', function() {
			oSlidebar.slidebars.close();
		});
		$document.on('slidebars.opened', function(e, data) {
			if (isDualView()) {
				$site.width('calc(100% - '+ data.amount +')');
				var center = map.getMap().getCenter();
				map.resize();
				map.setCenter(center, false);
				//center loader on map
				$loader.css({'left': 'calc(50% - 6.25rem + '+ (Math.round(parseInt(data.amount, 10) / 2)) +'px)'})
			}
		});
		$document.on('slidebars.close', function() {
			if (isDualView()) {
				$site.width('100%');
				var center = map.getMap().getCenter();
				map.resize();
				map.setCenter(center, false);
				//center loader on map
				$loader.css({'left': 'calc(50% - 6.25rem)'})
			}
		});

		//Dom Events
		$when.on({
			'change': showHideCustomDates
		});
		showHideCustomDates();
		$hashtag.on({
			'change, keyup': function() {
				$emptyHashtag.toggle(!!$hashtag.val());
			}
		});
		$emptyHashtag.find('button').click(function() {
			$hashtag.val('');
			$emptyHashtag.hide();
		});
		$where.on({
			'change, keyup': function() {
				$emptyWhere.toggle(!!$where.val());
			}
		});
		$emptyWhere.find('button').click(function() {
			$where.val('');
			$whereLoc.val('');
			$emptyWhere.hide();
		});

		//populate categories list
		$category.append('<option value="">'+ i18n.t('All events') +'</option>');
		$category.append(categories.getHtmlOptions());
		$categoriesHelp.html(categories.getDetails($category.val()));
		$category.on('change', function() {
			$categoriesHelp.html(categories.getDetails($category.val()));
		});

		$form.on({
			'submit': function(event) {
				event.preventDefault();
				//cleanup
				if ($where.val() && !$whereLoc.val()) {
					$where.val('');
					$whereLoc.val('');
				}
				if ($hashtag.val()) {
					if ($hashtag.val().substr(0,1) === '#') {
						$hashtag.val($hashtag.val().substr(1));
					}
					if (!utils.isValidHashtag($hashtag.val())) {
						$hashtag.val('');
					}
				}
				if ($when.val() === 'custom') {
					var start = dtp.getInputDate($start);
					var end = dtp.getInputDate($end);
					if (!end) {
						end = new Date();
					}
					if (!start || !start.getTime() || !end.getTime()) {
						$when.val('week');
						showHideCustomDates();
					}
				}
				$document.one('map.results-chown', function() {
					//show results tabs
					$document.triggerHandler('tabs.show', 'search-results');
				});
				$document.triggerHandler('app.search', {refresh: false});
				if (!isDualView()) {
					$document.triggerHandler('slide.close');
				}
			}
		});

		//Places autocomplete
		var autocomplete = new google.maps.places.Autocomplete(
			$where.get(0),
			{types: ['geocode']}
		);

		// When the user selects an address from the dropdown, populate the address
		autocomplete.addListener('place_changed', function() {
			// Get the place details from the autocomplete object.
			var place = autocomplete.getPlace();
			if (place.geometry) {
				$whereLoc.val(JSON.stringify(place.geometry.location.toJSON()));
			}
		});
		$where.on('change', function() {
			$whereLoc.val('');
		});

		//add wouaf and favorites tabs
		var tabContent = [
			'<div class="jumbotron anonymous">',
				'<h1>', i18n.t('Connect!'), '</h1>',
				'<p class="lead">', i18n.t('create_wouaf_it_profile'), '</p>',
				'<hr class="m-y-md">',
				'<p>', i18n.t('use_wouaf_it_profile'), '</p>',
				'<p class="lead text-xs-right">',
				'<a class="btn btn-primary btn-lg" href="/login/" role="button"',
				'	data-href="login"',
				'	data-toggle="modal" data-target="#modalWindow">', i18n.t('Login'), '</a>',
				'</p>',
			'</div>',
			'<div class="logged">',
			'	<div class="results"></div>',
			'</div>'].join('');

		$document.triggerHandler('tabs.add', {
			id: 'wouafs',
			name: '<i class="fa fa-list"></i> '+ i18n.t('Your Wouafs'),
			html: tabContent
		});
		$document.triggerHandler('tabs.add', {
			id: 'following',
			name: '<i class="fa fa-users"></i> '+ i18n.t('Following'),
			html: tabContent
		});
		$document.triggerHandler('tabs.add', {
			id: 'favorites',
			name: '<i class="fa fa-star"></i> '+ i18n.t('Your Favorites'),
			html: tabContent
		});
	};

	// API/data for end-user
	return {
		init: init,
		isDualView: isDualView,
		getSearchParams: function () {
			var loc = $whereLoc.val() || null;
			if (loc) {
				var position = JSON.parse(loc);
				loc = new google.maps.LatLng(position.lat, position.lng);
			}
			var date = null, duration = null;
			var today = new Date();
			today.setHours(4); //offset 4 hours to avoid events starting days before and finishing during the night
			today.setMinutes(0);
			today.setSeconds(0);
			today.setMilliseconds(0);
			switch ($when.val()) {
				case 'today':
					date = Math.round(today.getTime() / 1000);
					duration = 86400 - 14400; //1day - 4h
					break;
				case 'tomorrow':
					date = Math.round(today.getTime() / 1000) + 86400;
					duration = 86400 - 14400; //1day - 4h
					break;
				case 'weekend':
					var day = today.getDay();
					var offset = 0;
					if (day === 0) {//0: sunday
						offset = - (14400 + 86400 + 21600); //remove 4h + 1day + 6h
					} else if (day <= 5) {
						offset = ((5 - day) * 86400) + 50400; //14h
					} else if (day === 6) {//6: saturday
						offset = - (14400 + 21600); //remove 4h + 6h
					}
					date = Math.round(today.getTime() / 1000) + offset;
					duration = (86400 * 2) + 21600; //2 days + 6h
					break;
				case 'week':
					date = Math.round(today.getTime() / 1000);
					duration = (86400 * 7) - 14400; //7days - 4h
					break;
				case 'month':
					date = Math.round(today.getTime() / 1000);
					duration = (86400 * 30) - 14400; //30days - 4h
					break;
				case 'custom':
					var start = dtp.getInputDate($start);
					var end = dtp.getInputDate($end);
					if (!end) {
						end = new Date();
					}
					if (start && start.getTime() && end.getTime()) {
						date = Math.round(start.getTime() / 1000);
						duration = Math.round(end.getTime() / 1000) - Math.round(start.getTime() / 1000);
					}
					if (!date || !duration || duration < 0) {
						date = Math.round(today.getTime() / 1000);
						duration = (86400 * 7) - 14400; //7days - 4h
						$when.val('week');
						showHideCustomDates();
					}
					break;
			}
			return {
				cat: $category.val() || null,
				tag: $hashtag.val() || null,
				loc: loc,
				date: date,
				duration: duration
			}
		}
	}
}());