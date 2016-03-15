module.exports = (function() {
	var self = {};
	var data = require('../resource/data.js');
	var utils = require('../utils.js');
	var windows = require('../resource/windows.js');
	var i18n = require('../resource/i18n.js');
	var query = require('../resource/query.js');
	var dtp = require('../resource/datetimepicker.js');
	var $modalWindow = windows.getWindows();

	self.show = function () {
		var states = data.getObject('navigation');
		if (!states || !states.user) { //no user, close windows
			windows.close();
			return;
		}
		//get user infos
		query.getUser(states.user, function(result) {
			var user = result.user;
			var username = user.firstname || user.lastname ? user.firstname +' '+ user.lastname : user.username;
			$modalWindow.find('.modal-title').html(i18n.t('User profile {{username}}', {username: username.trim()}));
			var content = '<div class="modal-user">';
			if (user.description) {
				content += '<blockquote class="blockquote">'+ utils.textToHTML(user.description) +'</blockquote>';
			}
			content += '<div class="user-infos">';
			if (user.firstname || user.lastname) {
				content += '<p><i class="fa fa-at"></i>'+ user.username +'</p>'
			}
			if (user.posts) {
				content += '<p><i class="fa fa-hashtag"></i> '+ i18n.t('{{count}} publication', {count: user.posts}) +'<p>';
			} else {
				content += '<p><i class="fa fa-hashtag"></i> '+ i18n.t('No publications yet') +'<p>';
			}
			if (user.registration) {
				var registration = new Date();
				registration.setTime(user.registration.sec * 1000);
				content += '<p><i class="fa fa-calendar-o"></i> '+ i18n.t('Registered since {{date}}', {date: dtp.formatDate(registration, 'long')}) +'<p>';
			}
			if (user.type) {
				content += '<p><i class="fa fa-briefcase"></i> '+ i18n.t(utils.ucfirst(user.type)) +'<p>';
			}
			if (user.gender) {
				content += '<p><i class="fa fa-venus-mars"></i> '+ i18n.t(utils.ucfirst(user.gender)) +'<p>';
			}
			if (user.birthdate) {
				var birthdate = new Date();
				birthdate.setTime(user.birthdate.sec * 1000);
				content += '<p><i class="fa fa-birthday-cake"></i> '+ i18n.t('Born {{date}}', {date: dtp.formatDate(birthdate, 'long')}) +'<p>';
			}
			content += '</div></div>';
			$modalWindow.find('.modal-body').html(content);
		}, function() {
			var username = states.user || '';
			windows.close();
			var toast = require('../resource/toast.js');
			toast.show(i18n.t('An error has occurred, unknown user {{username}}', {username: username}), 5000);
		});
	};
	return self;
})();