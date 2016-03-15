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
		require('./login.js');
		require('./navigation.js');
		require('./wouaf.js');
		require('./search.js');
		require('./menu.js');

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
			//update token and favorites if any
			if (infos.token) {
				//login
				$document.triggerHandler('app.login', infos);
			} else {
				//logout
				$document.triggerHandler('app.logout');
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
			//init sharethis
			stLight.options({
				publisher: "2322e10f-9a09-414a-a500-a512981e393c",
				lang: i18n.t('languageShort'),
				onhover: false,
				doNotHash: true,
				doNotCopy: true,
				hashAddressBar: false,
				shorten:false
			});

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
		map.init();
		if (__DEV__) {
			console.info('all done (dev mode)');
			console.info('launch count: '+data.getInt('launchCount'));
		}
	});
})();