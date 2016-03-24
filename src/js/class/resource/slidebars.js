module.exports = (function() {
	//Load Slidebars
	require("../../../libs/slidebars/0.10.3/dist/slidebars.js");
	var i18n = require('./i18n.js');
	var categories = require('./categories.js');
	var $document = $(document);

	// private functions
	function init () {
		var $search = $('#search');
		var $form = $search.find('form');
		var $category = $('#what');
		var $when = $('#when');
		var $categoriesHelp = $form.find('.categories-help');

		$.slidebars();
		//Dom Events
		$when.on({
			'change': showHideCustomDates
		});
		showHideCustomDates();
		//populate categories list
		$category.append('<option value="">'+ i18n.t('All events') +'</option>');
		$category.append(categories.getHtmlOptions());
		$categoriesHelp.html(categories.getDetails($category.val()));
		$category.on('change', function() {
			$categoriesHelp.html(categories.getDetails($category.val()));
		});

		$form.on({
			'submit': function() {
				if(__DEV__) {
					console.info('search');
				}
			}
		});

		//add wouaf and favorites tabs
		var tabContent = [
			'<div class="jumbotron anonymous">',
				'<h1>', i18n.t('Connect!'), '</h1>',
				'<p class="lead">', i18n.t('create_wouaf_it_account'), '</p>',
				'<hr class="m-y-md">',
				'<p>', i18n.t('use_wouaf_it_account'), '</p>',
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
			id: 'favorites',
			name: '<i class="fa fa-star"></i> '+ i18n.t('Your Favorites'),
			html: tabContent
		});
	}

	//HTML Dom
	function showHideCustomDates() {
		if ($('#when').val() === 'custom') {
			$('#search .specific-date').show('fast');
		} else {
			$('#search .specific-date').hide('fast');
		}
	}

	// API/data for end-user
	return {
		init: init
	}
})();