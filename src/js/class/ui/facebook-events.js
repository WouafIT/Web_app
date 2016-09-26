var windows = require('../resource/windows.js');
var user 	= require('../resource/user.js');
var toast 	= require('../resource/toast.js');
var i18n 	= require('../resource/i18n.js');
var query 	= require('../resource/query.js');
var data 	= require('../resource/data.js');
var utils 	= require('../utils.js');

module.exports = (function() {
	var self = {};
	var $document = $(document);
	var $modalWindow = windows.getWindows();

	self.show = function () {
		var fid = user.get('fid');
		if (!window.FB || !fid || !data.getString('uid')) { //user is not logged, close window
			windows.close();
			return;
		}

		var $eventsImport = $modalWindow.find('.events-import');
		var $pagesImport = $modalWindow.find('.pages-import');
		var $eventsDisabled = $modalWindow.find('.events-disabled');
		var $pagesDisabled = $modalWindow.find('.pages-disabled');
		var $noEvents = $modalWindow.find('.no-events');
		var $noPagesEvents = $modalWindow.find('.no-pages-events');
		var $eventsRerequest = $modalWindow.find('.events-rerequest');
		var $pagessRerequest = $modalWindow.find('.pages-rerequest');

		$eventsDisabled.hide().removeAttr('hidden');
		$pagesDisabled.hide().removeAttr('hidden');
		$noEvents.hide().removeAttr('hidden');
		$noPagesEvents.hide().removeAttr('hidden');

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
				scope: 'public_profile,email,user_friends,pages_show_list,user_events',
				enable_profile_selector: true,
				auth_type: 'rerequest'
			});
		};
		$eventsRerequest.on('click', rerequestPermissions);
		$pagessRerequest.on('click', rerequestPermissions);
		//Imports events
		$eventsImport.on('click', function () {
			FB.getLoginStatus(function (response) {
				if (response.status === 'connected' && parseInt(response.authResponse.userID, 10) === fid) {
					var importData = {
						fid: 	 fid,
						fbtoken: response.authResponse.accessToken
					};
					query.requestFbImport(importData , function() { //success
						windows.close();
						windows.show({
							title: i18n.t('Your Facebook events'),
							text: i18n.t('facebook_import_details')
						});
					}, function(msg) { //error
						toast.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), 5000);
					});
				}
				if (__DEV__) {
					console.log('Facebook status:',response);
				}
			});
		});
		//Import pages events
		$pagesImport.on('click', function () {
			FB.getLoginStatus(function (response) {
				if (response.status === 'connected' && parseInt(response.authResponse.userID, 10) === fid) {
					var importData = {
						fid: 	 fid,
						fbtoken: response.authResponse.accessToken
					};
					query.requestFbPagesImport(importData , function() { //success
						windows.close();
						windows.show({
							title: i18n.t('Your Facebook events'),
							text: i18n.t('facebook_import_details')
						});
					}, function(msg) { //error
						toast.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), 5000);
					});
				}
				if (__DEV__) {
					console.log('Facebook status:',response);
				}
			});
		});

		//Check Facebook permissions
		FB.getLoginStatus(function (response) {
			if (response.status === 'connected' && parseInt(response.authResponse.userID, 10) === fid) {
				FB.api('/'+ response.authResponse.userID +'/permissions', function (response) {
					if (__DEV__) {
						console.info('Facebook permissions:', response);
					}
					var i, l;
					var events = false;
					var pages = false;
					var count = 0;
					if (response.data) {
						for (i = 0, l = response.data.length; i < l; i++) {
							var permission = response.data[i];
							if (permission.permission === 'user_events' && permission.status === 'granted') {
								events = true;
							} else if (permission.permission === 'pages_show_list' && permission.status === 'granted') {
								pages = true;
							}
						}
					}
					$noEvents.hide();
					$eventsDisabled.hide();
					$eventsImport.prop("disabled", true );
					if (!events) {
						//block import for events
						$eventsDisabled.show();
					} else {
						//check if user has public events
						var date = new Date();
						var today = date.getUTCFullYear() +'-'+ utils.zeroPad(date.getUTCMonth() + 1, 2) +'-'+ utils.zeroPad(date.getUTCDate(), 2);
						count = 0;
						FB.api('/'+ fid +'?fields=events.since('+ today +')'+
								'.type(created){id,type}',
							function (response) {
								if (response && !response.error) {
									if (response.events && response.events.data) {
										for(i = 0,l = response.events.data.length; i < l; i++) {
											if (response.events.data[i].type === 'public') {
												count++;
											}
										}
									}
									//todo: remove this line !
									count = 1;
									if (count) {
										$eventsImport.removeAttr('disabled');
									} else {
										$noEvents.show();
									}
								}
							}
						);
					}
					$noPagesEvents.hide();
					$pagesDisabled.hide();
					$pagesImport.prop("disabled", true );
					if (!pages) {
						//block import for pages
						$pagesDisabled.show();
					} else {
						count = 0;
						FB.api('/'+ fid +'?fields=accounts{id}',
							function (response) {
								if (response && !response.error) {
									if (response.accounts && response.accounts.data) {
										count = response.accounts.data.length;
									}
									if (count) {
										$pagesImport.removeAttr('disabled');
									} else {
										$noPagesEvents.show();
									}
								}
							}
						);
					}
				});
			}
			if (__DEV__) {
				console.log('Facebook status:', response);
			}
		});
	};
	return self;
}());