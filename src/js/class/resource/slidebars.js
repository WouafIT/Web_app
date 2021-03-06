//Load Slidebars
require("../../../libs/slidebars/0.10.3/dist/slidebars.js");
var i18n = require('./i18n.js');
var categories = require('./categories.js');
var map = require('./map.js');
var dtp = require('./datetimepicker.js');
var utils = require('../utils.js');
var windows = require('./windows.js');
var data = require('./data.js');
var alert = require('./alert.js');

module.exports = (function() {
	var $document = $(document);
	var $window = $(window);
	var $loader = $('#loader');
	var $body = $('body');
	var $search = $('#search');
	var $form = $search.find('form');
	var $children = $form.find('input[name=children]');
	var $site = $('#sb-site');
	var $category = $('#what');
	var $when = $('#when');
	var $where = $('#where');
	var $whereLoc = $('#where-loc');
	var $hashtag = $('#hashtag');
	var $textContent = $('#text-content');
	var $start = $('#start');
	var $end = $('#end');
	$search.find('.sub-what').hide().removeAttr('hidden');
	var $emptyHashtag = $('#hashtag-empty');
	$emptyHashtag.hide().removeAttr('hidden');
	var $emptyWhere = $('#where-empty');
	$emptyWhere.hide().removeAttr('hidden');
	var $emptyTextContent = $('#text-content-empty');
	$emptyTextContent.hide().removeAttr('hidden');
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
			$search.find('.specific-date').show('fast');
		} else {
			$search.find('.specific-date').hide('fast');
		}
	};

	// private functions
	var init = function () {
		var $categorySelector = $form.find('.what .custom-select');

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
			'change keyup keydown keypress paste': function(e) {
				var invalidChars = /[^0-9a-z]/gi;
				if (e.type === 'keypress') {
					var char = String.fromCharCode(e.keyCode || e.which);
					if (char && invalidChars.test(char)) {
						e.preventDefault();
					}
				}
				var value = $hashtag.val();
				if(value && invalidChars.test(value)) {
					$hashtag.val(value.replace(invalidChars, ''));
				}
				$emptyHashtag.toggle(!!$hashtag.val());

				$hashtag.removeClass('form-control-warning');
				$hashtag.parents('fieldset').removeClass('has-warning');
			}
		});
		$emptyHashtag.find('button').click(function() {
			$hashtag.val('');
			$emptyHashtag.hide();
		});
		$textContent.on({
			'change, keyup': function() {
				$emptyTextContent.toggle(!!$textContent.val());
				$textContent.removeClass('form-control-warning');
				$textContent.parents('fieldset').removeClass('has-warning');
			}
		});
		$emptyTextContent.find('button').click(function() {
			$textContent.val('');
			$emptyTextContent.hide();
			$textContent.removeClass('form-control-warning');
			$textContent.parents('fieldset').removeClass('has-warning');
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
			$where.removeClass('form-control-warning');
			$where.parents('fieldset').removeClass('has-warning');
		});

		var showSelectedTypesLabel = function () {
			//set field value
			if (!$category.val()) {
				$categorySelector.html(i18n.t('All events'));
			} else {
				var values = $category.val().split(',');
				if (values.length <= 2) {
					var content = '';
					for(var i = 0, l = values.length; i < l; i++) {
						if (i) {
							content += ', ';
						}
						content += categories.getLabel(values[i]);
					}
					$categorySelector.html(content);
				} else {
					$categorySelector.html(i18n.t('{{count}} event type', {count: values.length}));
				}
			}
		};

		$categorySelector.on('click', function () {
			//show message page
			windows.show({
				title: i18n.t('Select your types'),
				text: '<div class="multi-select">'+ categories.getMultiSelect($category.val()) +'</div>',
				closeLabel: i18n.t('OK'),
				navigationClose: false,
				open: function () {
					var $multiSelect = $('#modalWindow .multi-select');
					var $allCheckboxes = $multiSelect.find('input[type=checkbox]');
					var $allEventsCheckbox = $multiSelect.find('input[type=checkbox][value=all]');
					//grab all checkboxes and add click events
					$allCheckboxes.on('change', function (e) {
						var $target 	= $(e.target);
						var $fieldset 	= $target.parents('fieldset');
						var $checkboxes = $fieldset.find('.content input[type=checkbox]');
						var checked = !!$target.prop("checked");
						if ($target.parents('.legend').length) { //if target is a parent category
							if ($target.val() === 'all') {
								if (checked) {
									$allCheckboxes.prop('indeterminate', false).prop("checked", false);
								}
							} else {
								$checkboxes.prop("checked", checked);
								if (checked) {
									$allEventsCheckbox.prop("checked", false);
								}
							}
						} else { //if target is a subcategory
							if (checked) {
								$allEventsCheckbox.prop("checked", false);
							}
							var $parent = $fieldset.find('.legend input[type=checkbox]');
							var hasChecked = false, hasUnchecked = false;
							//get all checkboxes status and set parent category accordingly
							$checkboxes.each(function () {
								if (!!$(this).prop("checked")) {
									hasChecked = true;
								} else {
									hasUnchecked = true;
								}
							});
							if (hasChecked && !hasUnchecked) {
								$parent.prop('indeterminate', false).prop("checked", true);
							} else if (!hasChecked && hasUnchecked) {
								$parent.prop('indeterminate', false).prop("checked", false);
							} else {
								$parent.prop('indeterminate', true).prop("checked", false);
							}
						}
						//get all selected categories
						var $allSelectedCheckboxes = $multiSelect.find('input[type=checkbox]:checked');
						if (!$allSelectedCheckboxes.length || $allSelectedCheckboxes.length === ($allCheckboxes.length - 1)) {
							$category.val('');
							$allCheckboxes.prop('indeterminate', false).prop("checked", false);
							$allEventsCheckbox.prop("checked", true);
						} else {
							$allEventsCheckbox.prop("checked", false);
							var values = [];
							$allSelectedCheckboxes.each(function() {
								var val = $(this).val();
								if (val !== 'all') {
									values.push(val);
								}
							});
							$category.val(values.join(','));
						}
					});
					//set indeterminate status on partially selected fieldsets
					$multiSelect.find('fieldset').each(function() {
						if ($(this).find('.content input[type=checkbox]:checked').length) {
							var $parent = $(this).find('.legend input[type=checkbox]');
							if (!$parent.prop('checked')) {
								$parent.prop('indeterminate', true);
							}
						}
					});
				},
				close: showSelectedTypesLabel
			});
		});

		//set selected values if any
		if (data.getBool('saveSearch') === true) {
			var savedSearch = data.getObject('savedSearch');
			if (savedSearch.cat) {
				$category.val(savedSearch.cat);
				showSelectedTypesLabel();
			}
			if (savedSearch.when && savedSearch.when !== 'custom') {
				$when.val(savedSearch.when);
			}
			if (savedSearch.children) {
				$children.prop('checked', true);
			}
		}

		$form.on({
			'submit': function(event) {
				event.preventDefault();
				//cleanup
				if ($where.val() && !$whereLoc.val()) {
					alert.show(i18n.t('Invalid location. Please select a proposal from the drop-down list'), $form);
					$where.addClass('form-control-warning');
					$where.parents('fieldset').addClass('has-warning');
					return;
				} else {
					$where.removeClass('form-control-warning');
					$where.parents('fieldset').removeClass('has-warning');
				}
				if ($hashtag.val()) {
					if ($hashtag.val().substr(0,1) === '#') {
						$hashtag.val($hashtag.val().substr(1));
					}
					if (!utils.isValidHashtag($hashtag.val())) {
						alert.show(i18n.t('Invalid Hashtag. Enter a single word consisting of letters and numbers only'), $form);
						$hashtag.addClass('form-control-warning');
						$hashtag.parents('fieldset').addClass('has-warning');
						return;
					}
				}
				if ($textContent.val() && $textContent.val().length < 3) {
					alert.show(i18n.t('Invalid Text content. Please enter minimum 3 characters'), $form);
					$textContent.addClass('form-control-warning');
					$textContent.parents('fieldset').addClass('has-warning');
					return;
				}
				$form.find('.alert').hide("fast", function() {
					$(this).remove();
				});
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
				$where.removeClass('form-control-warning');
				$where.parents('fieldset').removeClass('has-warning');
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
				'<p class="lead text-right">',
				'<a class="btn btn-primary btn-lg" href="/login/" role="button"',
				' data-href="login"',
				' data-toggle="modal" data-target="#modalWindow">', i18n.t('Login'), '</a>',
				'</p>',
			'</div>',
			'<div class="logged">',
				'<div class="results"></div>',
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
	var getSearchParams = function () {
		var geo = $whereLoc.val() || null;
		if (geo) {
			var position = JSON.parse(geo);
			geo = new google.maps.LatLng(position.lat, position.lng);
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

		if (data.getBool('saveSearch') === true) {
			data.setObject('savedSearch', {
				cat: $category.val() || null,
				when: $when.val() || null,
				children: $children.prop('checked')
			});
		}

		return {
			cat: $category.val() || null,
			tag: $hashtag.val() || null,
			text: $textContent.val() || null,
			language: $textContent.val() ? i18n.t('languageShort') : null,
			children: $children.prop('checked'),
			geo: geo,
			date: date,
			duration: duration
		}
	};

	// API/data for end-user
	return {
		init: init,
		isDualView: isDualView,
		getSearchParams: getSearchParams,
		getSearchDescription: function() {
			var params = getSearchParams();
			var description = '';
			switch ($when.val()) {
				case 'today':
					description += i18n.t('Today');
					break;
				case 'tomorrow':
					description += i18n.t('Tomorrow');
					break;
				case 'weekend':
					description += i18n.t('This week-end');
					break;
				case 'week':
					description += i18n.t('This week');
					break;
				case 'month':
					description += i18n.t('This month');
					break;
				case 'custom':
					var start = dtp.getInputDate($start);
					var end = dtp.getInputDate($end);
					if (!end) {
						end = new Date();
					}
					description += i18n.t('{{start}} - {{end}}', {'start': dtp.formatDate(start, 'shortest'), 'end': dtp.formatDate(end, 'shortest')});
					break;
			}
			if (params.cat) {
				description += ', '+ i18n.t('{{count}} type', {count: params.cat.split(',').length});
			}
			if (params.children) {
				description += ', '+ i18n.t('Children');
			}
			if (params.tag) {
				description += ', '+ utils.ucfirst(utils.escapeHtml(params.tag).toLowerCase());
			}
			if (params.text) {
				description += ' '+ i18n.t('and keywords');
			}
			return description;
		}
	}
}());