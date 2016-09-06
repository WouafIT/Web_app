var windows = require('../resource/windows.js');
var user 	= require('../resource/user.js');
var toast 	= require('../resource/toast.js');
var i18n 	= require('../resource/i18n.js');


module.exports = (function() {
	var self = {};
	var $document = $(document);
	var $modalWindow = windows.getWindows();

	self.show = function () {
		var $eventsImport = $modalWindow.find('.events-import');
		var $pagesImport = $modalWindow.find('.pages-import');
		var $eventsDisabled = $modalWindow.find('.events-disabled');
		var $pagesDisabled = $modalWindow.find('.pages-disabled');
		var $eventsRerequest = $modalWindow.find('.events-rerequest');
		var $pagessRerequest = $modalWindow.find('.pages-rerequest');

		$eventsDisabled.hide().removeAttr('hidden');
		$pagesDisabled.hide().removeAttr('hidden');

		//add buttons events
		var rerequestPermissions = function () {
			FB.login(function(response) {
				if (response.authResponse) {
					windows.refresh();
				} else {
					$document.triggerHandler('app.logout');
					toast.show(i18n.t('Error during Facebook login. Please retry'), 5000);
				}
			}, {
				scope: 'public_profile,email,user_friends,manage_pages,user_events',
				enable_profile_selector: true,
				auth_type: 'rerequest'
			});
		};
		$eventsRerequest.on('click', rerequestPermissions);
		$pagessRerequest.on('click', rerequestPermissions);

		//Check facebook permissions
		var fid = user.get('fid');
		if (fid) {
			FB.getLoginStatus(function (response) {
				if (response.status === 'connected' && response.authResponse.userID == fid) {
					FB.api('/'+ response.authResponse.userID +'/permissions', function (response) {
						if (__DEV__) {
							console.info('Facebook permissions:', response);
						}
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