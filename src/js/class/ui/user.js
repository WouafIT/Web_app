module.exports = (function() {
	var self = {};
	var data = require('../resource/data.js');
	var utils = require('../utils.js');
	var windows = require('../resource/windows.js');
	var i18n = require('../resource/i18n.js');
	var dtp = require('../resource/datetimepicker.js');
	var url = require('../resource/url.js');
	var users = require('../resource/users.js');
	var $modalWindow = windows.getWindows();

	var getUsername = function (user) {
		return (user.firstname || user.lastname ? user.firstname +' '+ user.lastname : user.username).trim();
	};

	self.show = function () {
		var states = data.getObject('navigation');
		if (!states || !states.user) { //no user, close windows
			windows.close();
			return;
		}
		//get user infos
		$.when(users.get(states.user)).done(function(user) {
			var username = getUsername(user);
			$modalWindow.find('.modal-title').html(i18n.t('User profile {{username}}', {username: username}));
			var content = '<div class="modal-user">';
			if (user.hash) {
				content += users.gravatar(user.hash);
			}
			if (user.description) {
				content += '<blockquote class="blockquote">'+ utils.textToHTML(user.description) +'</blockquote>';
			}
			content += '<div class="user-infos">';
			content += '<p><i class="fa fa-link"></i> <a href="'+ url.getAbsoluteURLForStates([{name: 'user', value: user.username}]) +'" data-user="'+ utils.escapeHtml(user.username) +'"><i class="fa fa-at"></i>'+ utils.escapeHtml(user.username) +'</a></p>'
			if (user.posts) {
				content += '<p><i class="fa fa-hashtag"></i> <a href="#" data-action="user-wouaf" data-uid="'+ user.uid +'">'+ i18n.t('{{count}} Wouaf', {count: user.posts}) +'</a></p>';
				if (user.fav) {
					content += '<p><i class="fa fa-star"></i> '+ i18n.t('Saved as favorite {{count}} time', {count: user.fav}) +'</p>';
				}
			} else {
				content += '<p><i class="fa fa-hashtag"></i> '+ i18n.t('No Wouafs yet') +'</p>';
			}
			if (user.com) {
				content += '<p><i class="fa fa-comment"></i> '+ i18n.t('{{count}} comment', {count: user.com}) +'</p>';
			} else {
				content += '<p><i class="fa fa-comment"></i> '+ i18n.t('No comments yet') +'</p>';
			}
			if (user.following) {
				content += '<p><i class="fa fa-angle-double-left"></i> <a href="#" data-action="user-following" data-uid="'+ user.uid +'">'+ i18n.t('Is following {{count}} Wouaffer', {count: user.following}) +'</a></p>';
			} else {
				content += '<p><i class="fa fa-angle-double-left"></i> '+ i18n.t('Is not following anyone yet') +'</p>';
			}
			if (user.followers) {
				content += '<p><i class="fa fa-angle-double-right"></i> <a href="#" data-action="user-followers" data-uid="'+ user.uid +'">'+ i18n.t('Is followed by {{count}} Wouaffer', {count: user.followers}) +'</a></p>';
			} else {
				content += '<p><i class="fa fa-angle-double-right"></i> '+ i18n.t('Is not followed by anyone yet') +'</p>';
			}
			if (user.registration) {
				var registration = new Date();
				registration.setTime(user.registration.sec * 1000);
				content += '<p><i class="fa fa-calendar-o"></i> '+ i18n.t('Registered since {{date}}', {date: dtp.formatDate(registration, 'long')}) +'</p>';
			}
			if (user.type) {
				content += '<p><i class="fa fa-briefcase"></i> '+ i18n.t(utils.ucfirst(user.type)) +'</p>';
			}
			if (user.gender) {
				content += '<p><i class="fa fa-venus-mars"></i> '+ i18n.t(utils.ucfirst(user.gender)) +'</p>';
			}
			if (user.birthdate) {
				var birthdate = new Date();
				birthdate.setTime(user.birthdate.sec * 1000);
				content += '<p><i class="fa fa-birthday-cake"></i> '+ i18n.t('Born {{date}}', {date: dtp.formatDate(birthdate, 'long')}) +'</p>';
			}

			content += '</div></div>';
			var uid = data.getString('uid');
			if (uid) {
				if (user.uid !== uid) {
					var following = data.getArray('following');
					if (utils.indexOf(following, user.uid) === -1) {
						content += '<p class="text-xs-right"><button type="button" data-action="follow-user" data-uid="' + user.uid + '" class="btn btn-primary"><i class="fa fa-plus-circle"></i> ' + i18n.t('Follow this Wouaffer') + '</button></p>';
					} else {
						content += '<p class="text-xs-right"><button type="button" data-action="unfollow-user" data-uid="' + user.uid + '" class="btn btn-primary"><i class="fa fa-pause-circle"></i> ' + i18n.t('Unfollow this Wouaffer') + '</button></p>';
					}
				} else {
					content += '<p class="text-xs-right"><button type="button" data-href="profile" data-show="modal" data-target="#modalWindow" class="btn btn-primary"><i class="fa fa-pencil"></i> ' + i18n.t('Edit your profile') + '</button></p>';
				}
			}
			$modalWindow.find('.modal-body').html(content);
		}).fail(function() {
			var username = states.user || '';
			windows.close();
			var toast = require('../resource/toast.js');
			toast.show(i18n.t('An error has occurred, unknown user {{username}}', {username: username}), 5000);
		});
	};

	self.getHeader = function (user) {
		var username = getUsername(user);
		return [
			'<div class="w-title">',
				username, ' (<i class="fa fa-at"></i>', utils.escapeHtml(user.username) +')',
				'<div class="w-details">',
					'<i class="fa fa-hashtag"></i> ', i18n.t('{{count}} Wouaf', {count: user.posts}) ,' ',
					(user.followers
						? '<i class="fa fa-angle-double-right"></i> '+ i18n.t('Is followed by {{count}} Wouaffer', {count: user.followers})
						: '<i class="fa fa-angle-double-right"></i> '+ i18n.t('Is not followed by anyone yet')),
				'</div>',
			'</div>'
		].join('');
	};
	return self;
})();