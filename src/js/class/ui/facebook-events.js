var windows = require('../resource/windows.js');
var user 	= require('../resource/user.js');

module.exports = (function() {
	var self = {};
	var $modalWindow = windows.getWindows();

	self.show = function (e) {
		console.info('facebook-events OK');
		//Check facebook permissions
		var fid = user.get('fid');
		if (fid) {
			FB.getLoginStatus(function (response) {
				if (response.status === 'connected' && response.authResponse.userID == fid) {
					FB.api('/me/permissions', function (response) {
						var events = false;
						var pages = false;
						if (response.data) {
							for (var i = 0, l = response.data.length; i < l; i++) {
								var permission = response.data[i];
								if (permission.permission === 'user_events' && permission.status === 'granted') {
									events = true;
								} else if (permission.permission === 'manage_pages' && permission.status === 'granted') {
									pages = true;
								}
							}
						}
						if (!events) {
							//block import for events
							console.info('events are disabled');
						}
						if (!pages) {
							//block import for pages
							console.info('pages are disabled');
						}
					});
				}
				if (__DEV__) {
					console.log('Facebook status:', response);
				}
			});
		} else {
			windows.close();
			return;
		}
	};
	return self;
}());