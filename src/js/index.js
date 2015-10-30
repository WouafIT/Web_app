(function($) {
	//Slidebars
	var slidebars = require('./class/singleton/slidebars.js');
	//Load CSS
	require("../less/index.less");
	//i18n
	var i18n = require('./class/singleton/i18n.js');
	console.info(i18n);
	//Map
	var map = require('./class/singleton/map.js');
	//User
	var user = require('./class/singleton/user.js');
	//user.set('uid', 'toto');
	//user.set('token', 'test');
	//Data
	var data = require('./class/singleton/data.js');
	console.info('data', data);
	//data.set('foo', 'bar');
	//Query
	var query = require('./class/query.js')();
	var $document = $(document);
	$document.ready(function() {
		//logout event : reset all user infos
		$document.on('app.logout', function() {
			user.set('uid', null);
			user.set('token', null);
			user.set('favorites', null);
			user.set('today_publications', 0);
			/*if (Ti.Facebook.loggedIn) {
				//disconnect facebook login in case of error
				Ti.Facebook.logout();
			}*/
		});

		$document.on('app.start', function() {
			//Init Map
			map.init();
			/*var activityIndicator = new activity({
				message: L('initializing')
			});
			activityIndicator.show();*/

			//init with server infos
			query.init(function (infos) {
				//update token and favorites if any
				if (infos.token) {
					user.set('token', infos.token);
					user.set('today_publications', infos.today_publications);
					if (infos.favorites) {
						user.set('favorites', infos.favorites);
					}
				} else {
					//logout
					$document.triggerHandler('app.logout');
				}
				//update categories
				if (infos.categories) {
					data.set('categories', infos.categories);
				}
				//hide loader
				//activityIndicator.hide();

				//show server message
				/*if (infos.message) {
					//show message page
					var messageWindow = require('ui/message');
					var message = new messageWindow(infos.message);
					message.addEventListener('close', slidebars.init);
					message.open();
				} else {*/
					slidebars.init()
				//}
			});

			if (__DEV__) {
				console.info('all done (dev mode)');
			}
		});


		//launch count
		if (!data.get('launchCount')) {
			data.set('launchCount', 1);
		} else {
			data.set('launchCount', data.get('launchCount') + 1);
		}

		//Orientation events
		/*Ti.Gesture.addEventListener('orientationchange', function(e) {
			Ti.App.fireEvent('app.orientation', e);
		});*/
		data.set('connectionAlert', 0);
		//show welcome page on first launch
		if (data.get('launchCount') == 1) {
			//init default app vars
			data.set('rules', false);
			data.set('fbPost', true);
			data.set('allowContact', true);
			data.set('postNotif', true);
			data.set('commentNotif', true);
			//Ti.App.Properties.setBool('eventfulSearch', true);
			data.set('unit', 'km');
			data.set('radius', 150);
			data.set('categories', []);

			/*//show welcome page
			var welcomeWindow = require('ui/welcome');
			var welcome = new welcomeWindow();
			welcome.addEventListener('close', function () {
				//launch app
				$document.triggerHandler('app.start');
			});
			welcome.open();*/
		} else {
			//launch app
			//$document.triggerHandler('app.start');
		}

		//launch app
		$document.triggerHandler('app.start');
	});
}) (jQuery);