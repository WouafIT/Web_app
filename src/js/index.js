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
		//Load index and init data store
		$.when($.get('/parts/index.html', {v: BUILD_VERSION}), data.init())
			.done(function(html) {
				//set body content
				$('body').prepend(html[0]);
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
			}
		);
	});
}) (jQuery);