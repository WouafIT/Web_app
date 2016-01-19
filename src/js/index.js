/*!
 * Wouaf IT Web App
 *
 * Copyright 2016, Sébastien PAUCHET
 * contact@wouaf.it
 * Licensed under the Apache-2.0 license.
 *
 */
(function($) {
	//Load styles
	require("../libs/slidebars/0.10.3/dist/slidebars.css");
	require('../libs/DateTimePicker/dist/DateTimePicker.min.css');
	require("../less/index.less");
	var data = require('./class/resource/data.js');
	var $document = $(document);

	$document.ready(function() {
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
			data.setObject('categories', []);

			/*//show welcome page
			var welcomeWindow = require('ui/welcome');
			var welcome = new welcomeWindow();
			welcome.addEventListener('close', function () {
				//launch app
				$document.triggerHandler('app.start');
			});
			welcome.open();*/
		}

		//Load index
		$.get('/parts/index.html', {v: BUILD_VERSION})
		.done(function(html) {
			//set body content
			$('body').prepend(html);
			//load events modules
			require('./class/event/app.js');
			require('./class/event/login.js');
			require('./class/event/history.js');
			require('./class/event/wouaf.js');
			require('./class/event/search.js');
			//launch app
			$document.triggerHandler('app.start');
		}).fail(function() {
			console.error(arguments);
		});
	});
}) (jQuery);