var data = require('../resource/data.js');
var categories = require('../resource/categories.js');
var url = require('../resource/url.js');

module.exports = (function() {
	var $document = $(document);
	var ga = window.ga;
	var lastHrefLogged;
	var started = false;

	if (!ga) {
		if (__DEV__)
			console.error('GA is not loaded');
		return;
	}
	//login
	$document.on('app.logged', function () {
		if (__DEV__)
			console.info('Analytics - set - userId - '+ data.getString('uid'));
		ga('set', 'userId', data.getString('uid'));
	});
	//logout
	$document.on('app.logout', function () {
		if (__DEV__)
			console.info('Analytics - set - userId - null');
		ga('set', 'userId', null);
	});
	//add wouaf
	$document.on('app.added-wouaf', function (event, wouaf) {
		ga('send', 'event', 'wouaf', 'add', categories.getLabel(wouaf.cat), wouaf.cat);
	});
	//delete wouaf
	$document.on('app.deleted-wouaf', function (event, wouaf) {
		ga('send', 'event', 'wouaf', 'delete', categories.getLabel(wouaf.cat), wouaf.cat);
	});
	//report wouaf
	$document.on('app.reported-wouaf', function (event, wouaf) {
		ga('send', 'event', 'wouaf', 'report', categories.getLabel(wouaf.cat), wouaf.cat);
	});
	//add comment
	$document.on('app.added-comment', function (event, wouaf) {
		ga('send', 'event', 'comment', 'add', categories.getLabel(wouaf.cat), wouaf.cat);
	});
	//delete comment
	$document.on('app.deleted-comment', function (event, wouaf) {
		ga('send', 'event', 'comment', 'delete', categories.getLabel(wouaf.cat), wouaf.cat);
	});
	//report comment
	$document.on('app.reported-comment', function (event, wouaf) {
		ga('send', 'event', 'comment', 'report', categories.getLabel(wouaf.cat), wouaf.cat);
	});
	//add favorite
	$document.on('app.added-favorite', function (event, wouaf) {
		ga('send', 'event', 'favorite', 'add', categories.getLabel(wouaf.cat), wouaf.cat);
	});
	//delete favorite
	$document.on('app.deleted-favorite', function (event, wouaf) {
		ga('send', 'event', 'favorite', 'delete', categories.getLabel(wouaf.cat), wouaf.cat);
	});
	//add interest
	$document.on('app.added-interest', function (event, wouaf) {
		ga('send', 'event', 'interest', 'add', categories.getLabel(wouaf.cat), wouaf.cat);
	});
	//delete interest
	$document.on('app.deleted-interest', function (event, wouaf) {
		ga('send', 'event', 'interest', 'delete', categories.getLabel(wouaf.cat), wouaf.cat);
	});
	//send contact (Wouaf)
	$document.on('app.wouaf-contact', function (event, wouaf) {
		ga('send', 'event', 'contact', 'wouaf', categories.getLabel(wouaf.cat), wouaf.cat);
	});
	//send contact (WouafIt)
	$document.on('app.wouafit-contact', function () {
		ga('send', 'event', 'contact', 'wouafit');
	});
	//create profile
	$document.on('app.created-profile', function (event, language) {
		ga('send', 'event', 'profile', 'create', language);
	});
	//delete profile
	$document.on('app.deleted-profile', function (event, language) {
		ga('send', 'event', 'profile', 'delete', language);
	});
	//edit profile
	$document.on('app.edit-profile', function (event, language) {
		ga('send', 'event', 'profile', 'edit', language);
	});
	//query time
	$document.on('app.query', function (event, params) {
		var logEvent = function () {
			if (__DEV__)
				console.info('Analytics - Timing - Query - ' + params.caller + ': ' + params.time);
			ga('send', 'timing', 'Query', params.caller, params.time);
		};
		if (started) {
			logEvent();
		} else {
			$document.one('analytics.started', logEvent);
		}
	});
	//windows time
	$document.on('windows.opened', function (event, params) {
		if (__DEV__)
			console.info('Analytics - Timing - Windows - ' + params.href + ': ' + params.time);
		ga('send', 'timing', 'Windows', params.href, params.time);
	});
	//new search
	var searchCount = 0;
	$document.on('app.new-search', function (event, params) {
		if (__DEV__)
			console.info('Analytics - Event - Search - New'+(!searchCount ? ' - nonInteraction' : ''));

		if (searchCount) {
			ga('send', 'event', 'search', 'new');
		} else {
			ga('send', 'event', 'search', 'new', '', '', {
				nonInteraction: true
			});
		}
		searchCount++;
	});
	//refresh search
	$document.on('app.refresh-search', function (event, params) {
		if (__DEV__)
			console.info('Analytics - Event - Search - Refresh');
		ga('send', 'event', 'search', 'refresh');
	});

	//app init
	$document.on('app.started', function () {
		var language = window.location.hostname.substr(0, 5);
		ga('set', 'language', language);
		var logEvent = function () {
			if (__DEV__)
				console.info('Analytics - Event - App - Start - '+ (data.getString('uid') ? 'Logged ' : 'Not logged ')+ language);
			ga('send', 'event', 'app', 'start', (data.getString('uid') ? 'Logged ' : 'Not logged ') + language, '', {
				nonInteraction: true
			});
		};
		if (started) {
			logEvent();
		} else {
			$document.one('analytics.started', logEvent);
		}
	});

	//navigation
	var logState = function(name) {
		var navigation 	= data.getObject('navigation');
		var href 		= url.getAnalyticsPath(navigation);
		if (href !== '/@location/' && lastHrefLogged !== href) {
			if (__DEV__)
				console.info('Analytics - Pageview ' + name + ' - ' + href);
			ga('set', 'page', href);
			ga('send', 'pageview');
			if (!lastHrefLogged) {
				//first page loaded => analytics is now started and can log events
				started = true;
				if (window.performance && window.performance.now) {
					//log general application performance for stating
					var startTime = Math.round(window.performance.now());
					if (__DEV__)
						console.info('Analytics - App start time: ' + startTime);
					ga('send', 'timing', 'App', 'start', startTime);
				}
				$document.triggerHandler('analytics.started');
			}
			lastHrefLogged = href;
		}
	};
	$document.on('app.loaded-state', function () {
		logState('load');
	});
	$document.on('app.pushed-state', function () {
		logState('push');
	});
	$document.on('app.popped-state', function () {
		logState('pop');
	});

	//App Install: user choice
	window.addEventListener('beforeinstallprompt', function(e) {
		e.userChoice.then(function(choiceResult) {
			var logEvent = function () {
				if (__DEV__)
					console.info('Analytics - Event - App - Screen install - '+ (choiceResult.outcome === 'dismissed' ? 'Cancelled ' : 'Added '));
				ga('send', 'event', 'app', 'Screen install', (choiceResult.outcome === 'dismissed' ? 'Cancelled ' : 'Added '), '', {
					nonInteraction: true
				});
			};
			if (started) {
				logEvent();
			} else {
				$document.one('analytics.started', logEvent);
			}
		});
	});
}());