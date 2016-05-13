module.exports = (function() {
	var slidebars = require('../resource/slidebars.js');
	var data = require('../resource/data.js');
	var map = require('../resource/map.js');
	var query = require('../resource/query.js');
	var windows = require('../resource/windows.js');
	var add = require('../resource/add.js');
	var i18n = require('../resource/i18n.js');
	var dtp = require('../resource/datetimepicker.js');
	var categories = require('../resource/categories.js');
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

		//launch count
		var launchCount = data.getInt('launchCount');
		data.setInt('launchCount', !launchCount ? 1 : launchCount + 1);
		data.setInt('connectionAlert', 0);
		//set default vars on first launch
		if (data.getInt('launchCount') == 1) {
			//init default app vars
			data.setBool('rules', false);
			data.setBool('fbPost', true);
			data.setBool('allowContact', true);
			data.setBool('postNotif', true);
			data.setBool('commentNotif', true);
			data.setBool('showPopover', true);
			data.setBool('mapFollow', true);
			data.setString('unit', 'km');
			data.setInt('radius', 300);
			data.setString('loginType', 'default');
			/*//show welcome page
			 var welcomeWindow = require('ui/welcome');
			 var welcome = new welcomeWindow();
			 welcome.addEventListener('close', function () {
			 //launch app
			 $document.triggerHandler('app.start');
			 });
			 welcome.open();*/
		}

		//init with server infos
		query.init(function (infos, status, msg) {
			if (status == 'error') {
				//show error page
				windows.show({
					title: i18n.t('Error_'),
					text: i18n.t('Error_details {{status}} {{error}}', { 'status': infos.status, 'error': msg })
				});
				return;
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
})();