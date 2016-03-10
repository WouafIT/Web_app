module.exports = (function() {
	var self = {};
	var data = require('../resource/data.js');
	var utils = require('../utils.js');
	var windows = require('../resource/windows.js');
	var i18n = require('../resource/i18n.js');
	var toast = require('../resource/toast.js');
	var query = require('../resource/query.js');
	var $modalWindow = $('#modalWindow');

	self.show = function () {
		var states = data.getObject('navigation');
		if (!states || !states.user) { //no user, close windows
			windows.close();
		}
		//get user infos
		query.getUser(states.user, function(result) {
			console.info(result);
		}, function() {
			var username = states.user;
			windows.close();
			var toast = require('../resource/toast.js');
			toast.show(i18n.t('An error has occurred, unknown user {{username}}', {username: username}), 5000);
		});
	};
	return self;
})();