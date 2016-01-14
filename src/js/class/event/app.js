module.exports = (function() {
	var slidebars = require('../resource/slidebars.js');
	var data = require('../resource/data.js');
	var map = require('../resource/map.js');
	var query = require('../resource/query.js');
	var windows = require('../resource/windows.js');
	var add = require('../resource/add.js');
	var i18n = require('../resource/i18n.js');
	var dtp = require('../resource/datetimepicker.js');
	var $document = $(document);
	$document.on('app.start', function() {
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
			//update categories
			if (infos.categories) {
				data.setObject('categories', infos.categories);
			}
			//init slidebars
			slidebars.init();
			//init add button
			add.init();
			//init date time picker
			dtp.init();
			//show server message
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