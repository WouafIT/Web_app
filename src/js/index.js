/*!
 * Wouaf IT Web App
 *
 * Copyright 2016, Sébastien PAUCHET
 * contact@wouaf.it
 * Licensed under the Apache-2.0 license.
 *
 */
if (typeof jQuery === 'undefined' || typeof 'google' === 'undefined') {
	alert('Initialization error, please reload the page.');
}
(function($) {
	//Load styles
	require("../libs/slidebars/0.10.3/dist/slidebars.min.css");
	require('../libs/DateTimePicker/dist/DateTimePicker.min.css');
	require("../less/index.less");

	//Block IE before version 11
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf('MSIE ');
	if (msie > 0) {
		if (parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10) < 11) {
			//show message page
			window.$buoop = {vs:{i:9,f:-8,o:-8,s:8,c:-8},unsupported:false,mobile:false,api:4};
			var e = document.createElement("script");
			e.src = "//browser-update.org/update.min.js";
			document.body.appendChild(e);
		}
	}

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