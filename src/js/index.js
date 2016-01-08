(function($) {
	//Load styles
	require("../libs/slidebars/0.10.3/dist/slidebars.css");
	require("../less/index.less");
	var data = require('./class/singleton/data.js');
	var $document = $(document);

	$document.ready(function() {
		//load events modules
		require('./class/event/app.js');
		require('./class/event/login.js');
		require('./class/event/history.js');
		require('./class/event/wouaf.js');
		require('./class/event/search.js');

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
			data.setBool('showPopover', true);
			data.setString('unit', 'km');
			data.setInt('radius', 300);
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