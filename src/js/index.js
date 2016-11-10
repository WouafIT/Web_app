/*!
 * Wouaf IT Web App
 *
 * Copyright 2016, Sébastien PAUCHET
 * contact@wouaf.it
 * Licensed under the Apache-2.0 license.
 *
 */
if (typeof jQuery === 'undefined') {
	alert('Initialization error, please reload the page.');
}
(function($) {
	//Load styles
	require("../libs/slidebars/0.10.3/dist/slidebars.min.css");
	require('../libs/DateTimePicker/dist/DateTimePicker.min.css');
	require("../less/index.less");
	if (!window.wouafit) {
		window.wouafit = {};
	}
	var data = require('./class/resource/data.js');
	var $document = $(document);

	$document.ready(function() {
		//Load index and init data store
		$.when($.get('/parts/index.html', {v: BUILD_VERSION}), data.init())
			.done(function(html) {
				//set body content
				$('body').prepend(html[0]);
				//load app module
				require('./class/event/app.js');
				//launch app
				$document.triggerHandler('app.start');
			}).fail(function() {
				console.error(arguments);
			}
		);
	});
}(jQuery));