(function($) {
	var slidebars = require('./class/singleton/slidebars.js');
	require("../less/index.less");
	var i18n = require('./class/singleton/i18n.js');
	var map = require('./class/singleton/map.js');
	var user = require('./class/singleton/user.js');
	var data = require('./class/singleton/data.js');
	var toast = require('./class/singleton/toast.js');
	var window = require('./class/singleton/window.js');
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
					data.setObject('categories', infos.categories);
				}
				//hide loader
				//activityIndicator.hide();
				slidebars.init();

				//show server message
				if (infos.message) {
					//show message page
					window.show({
						title: 	infos.message.title,
						text: 	infos.message.msg,
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
			map.init();
			if (__DEV__) {
				console.info('all done (dev mode)');
				console.info('launch count: '+data.getInt('launchCount'));
			}
		});

		//launch count
		if (!data.getInt('launchCount')) {
			data.setInt('launchCount', 1);
		} else {
			data.setInt('launchCount', data.getInt('launchCount') + 1);
		}

		data.setInt('connectionAlert', 0);
		//show welcome page on first launch
		if (data.getInt('launchCount') == 1) {
			//init default app vars
			data.setBool('rules', false);
			data.setBool('fbPost', true);
			data.setBool('allowContact', true);
			data.setBool('postNotif', true);
			data.setBool('commentNotif', true);
			//Ti.App.Properties.setBool('eventfulSearch', true);
			data.setString('unit', 'km');
			data.setInt('radius', 150);
			data.setObject('categories', []);

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