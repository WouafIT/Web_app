var windows = require('../resource/windows.js');
var user 	= require('../resource/user.js');

module.exports = (function() {
	var self = {};
	var $modalWindow = windows.getWindows();
	var $eventsImport = $modalWindow.find('.events-import');
	var $pagesImport = $modalWindow.find('.pages-import');
	var $eventsDisabled = $modalWindow.find('.events-disabled');
	var $pagesDisabled = $modalWindow.find('.pages-disabled');

	$eventsDisabled.hide().removeAttr('hidden');
	$pagesDisabled.hide().removeAttr('hidden');

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
							$eventsDisabled.show();
							$eventsImport.prop("disabled", true );
						} else {
							$eventsDisabled.hide();
							$eventsImport.removeAttr('disabled');
						}
						if (!pages) {
							//block import for pages
							$pagesDisabled.show();
							$pagesImport.prop("disabled", true );
						} else {
							$pagesDisabled.hide();
							$pagesImport.removeAttr('disabled');
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