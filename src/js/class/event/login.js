module.exports = (function() {
	var data = require('../singleton/data.js');
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
	//login event : set interface for user login
	$document.on('app.login', function(event, params) {
		console.info(params);
		data.setString('uid', params.uid);
		data.setString('token', params.token);
		data.setObject('user', params.user);
		data.setInt('today_publications', params.today_publications);
		if (params.favorites) {
			data.setObject('favorites', params.favorites);
		}

		var user = require('../singleton/user.js');
		console.info(user.gravatar());

		$('.anonymous').attr('hidden', true);
		$('.logged').removeAttr('hidden');
	});

})();