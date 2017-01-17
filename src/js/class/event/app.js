var slidebars = require('../resource/slidebars.js');
var data = require('../resource/data.js');
var map = require('../resource/map.js');
var query = require('../resource/query.js');
var windows = require('../resource/windows.js');
var add = require('../resource/add.js');
var i18n = require('../resource/i18n.js');
var dtp = require('../resource/datetimepicker.js');
var categories = require('../resource/categories.js');

module.exports = (function() {
	var $document = $(document);
	$document.on('app.start', function() {
		//load events modules
		require('./analytics.js');
		require('./action.js');
		require('./login.js');
		require('./navigation.js');
		require('./wouaf.js');
		require('./search.js');
		require('./menu.js');
		require('./tabs.js');

		//Block IE before version 11
		var ua = window.navigator.userAgent;
		var msie = ua.indexOf('MSIE ');
		if (msie > 0) {
			if (parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10) < 11) {
				//show message page
				windows.show({
					title:	i18n.t('Incompatible browser'),
					text:	i18n.t('Incompatible browser_details')
				});
				return;
			}
		}

		//launch count
		var launchCount = data.getInt('launchCount');
		data.setInt('launchCount', !launchCount ? 1 : launchCount + 1);
		data.setInt('connectionAlert', 0);
		//set default vars on first launch
		if (data.getInt('launchCount') === 1) {
			//init default app vars
			data.setBool('showPopover', true);
			data.setBool('mapFollow', true);
			data.setBool('saveSearch', true);
			data.setString('unit', 'km');
			data.setInt('radius', 70);
			data.setInt('limit', 500);
			data.setBool('geolocation', false)
		}
		//create missing app vars
		if (data.getBool('saveSearch') === null) {
			data.setBool('saveSearch', true);
		}

		//init with server infos
		query.init(function (infos, status, msg) {
			if (!infos || status === 'error') {
				//show error page
				msg = msg || (infos && infos.statusText ? infos.statusText : '');
				windows.show({
					title: i18n.t('Error_'),
					text: i18n.t('Error_details {{status}} {{error}}', { 'status': infos ? infos.status : 'Status: Server error', 'error': msg })
				});
				return;
			}
			//init Facebook
			window.fbAsyncInit = function() {
				window.FB.init({
					appId: FACEBOOK_APP_KEY,
					version: 'v2.8',
					xfbml: false
				});
			};
			if (window.FB) {
				window.fbAsyncInit();
			}
			//init position
			if (infos.geolocation && !data.getBool('geolocation')) {
				var location = data.getObject('position');
				if (!location || isNaN(location.lat) || isNaN(location.lng)) {
					var parts = infos.geolocation.split(',');
					data.setObject('position', {
						lat: parts[0],
						lng: parts[1]
					});
				}
			}
			//init categories
			if (infos.categories) {
				categories.init(infos.categories);
			}
			//init slidebars
			slidebars.init();
			//init add button
			add.init();
			//init date time picker
			dtp.init();

			//update token and favorites if any
			if (infos.token) {
				//login
				$document.triggerHandler('app.login', infos);
			} else {
				//logout
				$document.triggerHandler('app.logout');
			}
			//show server message if any
			if (infos.message) {
				//show message page
				windows.show({
					title: 	infos.message.title,
					text: 	infos.message.msg,
					navigationClose: false,
					close: function () {
						$document.triggerHandler('app.start-end');
					}
				});
			} else if (data.getInt('launchCount') === 1) {
				//show message page
				windows.show({
					title: i18n.t('Welcome to Wouaf IT'),
					text: i18n.t('welcome_details'),
					closeLabel: i18n.t('I understand'),
					navigationClose: false,
					close: function () {
						$document.triggerHandler('app.start-end');
					}
				});
			} else {
				$document.triggerHandler('app.start-end');
			}
		});
	});

	$document.on('app.start-end', function() {
		//Init Map
		$.when(map.init()).done(function() {
			//get window hash
			var hash = window.location.hash;
			//Init navigation state
			$document.triggerHandler('navigation.load-state', function () {
				//then set map center to final position
				var position = data.getObject('position');
				if (!position && __DEV__) {
					console.error('No map position setted.')
				}
				map.setCenter(new google.maps.LatLng(position.lat, position.lng), false);

				//search posts from current position
				$document.triggerHandler('app.search', {refresh: false});

				//add wouaf if any
				$document.one('map.results-chown', function() {
					var states = data.getObject('navigation');
					if (states.wouaf) {
						map.showResult(states.wouaf);
					}
					if (hash === '#events' && states.user) {
						//show user events for hash #events
						$document.triggerHandler('tabs.user-wouafs', {user: states.user});
					} else {
						//show results tabs
						$document.triggerHandler('tabs.show', 'search-results');
					}
					if (slidebars.isDualView()) {
						//open sidebar (if dualmode is active)
						$document.triggerHandler('slide.open');
					}
				});

				//hide splash
				$('#splash').fadeOut('fast');

				if (__DEV__) {
					console.info('all done (dev mode)');
					console.info('launch count: '+ data.getInt('launchCount'));
				}

				$document.triggerHandler('app.started');
			});
		});
	});

	//Service Worker installation
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('/service-worker.js')
			.then(function (r) {
				if (__DEV__) {
					console.log('Registered service worker');
				}
			})
			.catch(function (whut) {
				if (__DEV__) {
					console.error('Error on service worker registration');
					console.error(whut);
				}
			});
	}
	//Generic JS error
	window.onerror = function (msg, url, lineNo, columnNo, error) {
		if (__DEV__) {
			console.info('Javascript error', arguments);
		} else if ((msg === 'Script error.' && lineNo === 0 && columnNo === 0 && !url)
					|| msg.indexOf('is transitioning') !== -1
				) {
			return;
		}
		query.logJsError({
			msg: msg,
			url: url,
			lineNo: lineNo,
			columnNo: columnNo,
			error: error
		});
	}
}());