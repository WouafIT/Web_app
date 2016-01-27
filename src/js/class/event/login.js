module.exports = (function() {
	var data = require('../resource/data.js');
	var windows = require('../resource/windows.js');
	var i18n = require('../resource/i18n.js');
	var $document = $(document);

	//logout event : reset all user infos
	$document.on('app.logout', function() {
		data.setBool('permanent', null);
		data.setString('uid', null);
		data.setString('token', null);
		data.setObject('favorites', null);
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
		if(params) {
			var permanent = (params.permanent === true || data.getBool('permanent') === true);
			data.setBool('permanent', permanent);
			data.setString('uid', params.uid, !permanent);
			data.setString('token', params.token, !permanent);
			data.setObject('user', params.user, !permanent);
			data.setString('loginType', 'default', !permanent);
			data.setInt('today_publications', params.today_publications, !permanent);
			if (params.favorites) {
				data.setObject('favorites', params.favorites, !permanent);
			}
		}
		$('.anonymous').attr('hidden', true);
		$('.logged').removeAttr('hidden');

		var user = require('../resource/user.js');
		//TODO : get Facebook or G+ avatars instead of gravatar, if user login with oauth2

		//get gravatar
		var gravatar = user.gravatar(20);
		var username = user.get('username');
		var firstname = user.get('firstname');
		var lastname = user.get('lastname');

		if (firstname && lastname) {
			username = firstname +' '+ lastname;
		}
		$('.account-name').html('<img src="'+ gravatar +'" /> '+ username).attr('title', i18n.t('Welcome {{username}}', { 'username': username }));
	});
})();