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
			var user = result.user;
			var username = user.firstname || user.lastname ? user.firstname +' '+ user.lastname : user.username;
			$modalWindow.find('.modal-title').html(i18n.t('User profile {{username}}', {username: username.trim()}));
			var content = '';
			if (user.description) {
				content += '<p>'+ utils.textToHTML(user.description); +'</p><hr />';
			}


			$modalWindow.find('.modal-body').html(content);
		}, function() {
			var username = states.user;
			windows.close();
			var toast = require('../resource/toast.js');
			toast.show(i18n.t('An error has occurred, unknown user {{username}}', {username: username}), 5000);
		});
	};
	return self;
})();