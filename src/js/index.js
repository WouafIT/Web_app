(function($) {
	//Slidebars
	var slidebars = require('./class/singleton/slidebars.js');
	//Load CSS
	require("../less/index.less");
	//i18n
	var i18n = require('./class/singleton/i18n.js');
	//Map
	var map = require('./class/singleton/map.js');
	//User
	var user = require('./class/singleton/user.js');
	//user.set('uid', 'toto');
	//user.set('token', 'test');
	//Query
	var query = require('./class/query.js')();

	$(document).ready(function() {
		//Init Slidebars
		slidebars.init();
		//Init Map
		map.init();
		//Translate HTML
		//i18n.init(); //nothing to translate currently
		//Init server Query
		query.init(console.info);

		if (__DEV__) {
			console.info('all done (dev mode)');
		}
	});
}) (jQuery);