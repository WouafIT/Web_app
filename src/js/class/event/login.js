module.exports = (function() {
	var data = require('../singleton/data.js');
	var window = require('../singleton/window.js');
	var i18n = require('../singleton/i18n.js');
	var $document = $(document);

	//logout event : reset all user infos
	$document.on('app.logout', function() {
		data.setString('uid', null);
		data.setString('token', null);
		data.setObject('favorites', null);
		data.setObject('user', null);
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
		window.show({
			title: i18n.t('Logout'),
			text: i18n.t('Logout_details')
		});

		$document.triggerHandler('app.logout');
	});

	//login event : set interface for user login
	$document.on('app.login', function(event, params) {
		data.setString('uid', params.uid);
		data.setString('token', params.token);
		data.setObject('user', params.user);
		data.setInt('today_publications', params.today_publications);
		if (params.favorites) {
			data.setObject('favorites', params.favorites);
		}
		$('.anonymous').attr('hidden', true);
		$('.logged').removeAttr('hidden');

		var user = require('../singleton/user.js');
		//get gravatar
		var gravatar = user.gravatar(20);
		var username = user.get('username');
		$('.account-name').html('<img src="'+ gravatar +'" /> '+ username).attr('title', i18n.t('Welcome __username__', { 'username': username }));
	});

})();