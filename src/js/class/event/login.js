module.exports = (function() {
	var data 	= require('../resource/data.js');
	var windows = require('../resource/windows.js');
	var i18n 	= require('../resource/i18n.js');
	var url 	= require('../resource/url.js');
	var user 	= require('../resource/user.js');
	var users 	= require('../resource/users.js');
	var utils 	= require('../utils.js');
	var $document = $(document);

	//logout event : reset all user infos
	$document.on('app.logout', function() {
		data.setBool('permanent', null);
		data.setString('uid', null);
		data.setString('token', null);
		data.setArray('favorites', null);
		data.setArray('following', null);
		data.setObject('user', null);
		data.setString('loginType', 'default');
		data.setInt('today_publications', 0);
		/*if (Ti.Facebook.loggedIn) {
		 //disconnect facebook login in case of error
		 Ti.Facebook.logout();
		 }*/
		$('.logged').attr('hidden', true);
		$('.anonymous').removeAttr('hidden');
	});

	$('.btn-logout').on('click', function() {
		//show logout page
		windows.show({
			title: i18n.t('Logout'),
			text: i18n.t('Logout_details')
		});

		$document.triggerHandler('app.logout');
	});

	//login event : set interface for user login
	$document.on('app.login', function(event, params) {
		var permanent = (params && params.permanent === true) || data.getBool('permanent') === true;
		if(params) {
			data.setBool('permanent', permanent);
			data.setString('uid', params.uid, !permanent);
			data.setString('token', params.token, !permanent);
			data.setObject('user', params.user, !permanent);
			data.setString('loginType', 'default', !permanent);
			data.setInt('today_publications', params.today_publications, !permanent);
			if (params.favorites) {
				data.setArray('favorites', params.favorites, !permanent);
			}
			if (params.following) {
				data.setArray('following', params.following, !permanent);
			}
		}
		$('.anonymous').attr('hidden', true);
		$('.logged').removeAttr('hidden');

		//check for language
		var userLanguage = user.get('lang');
		var currentLanguage = window.location.hostname.substr(0, 5);
		if (permanent && userLanguage && currentLanguage != userLanguage) {
			var lang = userLanguage.toLowerCase().replace('_', '-');
			var newHostname = lang + window.location.hostname.substr(5);
			if (newHostname != window.location.hostname) {
				window.location = window.location.protocol +'//'+ newHostname + window.location.pathname;
			}
		}

		//TODO : get Facebook or G+ avatars instead of gravatar, if user login with oauth2

		//get gravatar
		var gravatar = users.gravatar(user.get('hash'), 20);
		var username = user.get('username');
		var firstname = user.get('firstname');
		var lastname = user.get('lastname');

		var $userProfile = $('.user-profile');
		$userProfile.attr('href', url.getAbsoluteURLForStates([{name: 'user', value: username}]));
		$userProfile.attr('data-user', username);

		if (firstname && lastname) {
			username = (firstname +' '+ lastname).trim();
		}
		$userProfile.html(gravatar +' '+ utils.escapeHtml(username)).attr('title', i18n.t('Welcome {{username}}', {'username': username}));

		$document.triggerHandler('app.logged');
	});
})();