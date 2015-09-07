// Main application file
(function() {
	var query = require('class/query');
	var utils = require('class/utils');
	var activity = require('ui/components/activityIndicator');
	
	//logout event : reset all user infos
	Ti.App.addEventListener('app.logout', function() {
		Ti.App.Properties.setString('uid', null);
        Ti.App.Properties.setString('token', null);
        Ti.App.Properties.setObject('user', null);
        Ti.App.Properties.setList('favorites', null);
        Ti.App.Properties.setInt('today_publications', 0);
        if (Ti.Facebook.loggedIn) {
            //disconnect facebook login in case of error
            Ti.Facebook.logout();
        }
	});
	
	Ti.App.addEventListener('app.start', function() {
		var q = new query();
		var activityIndicator = new activity({
		  message: L('initializing')
		});
		activityIndicator.show();
		//launch tabs & map window
		var launchTabs = function () {
		    var tabGroup = require('ui/tabGroup');
            new tabGroup().open();
        }
		//init with server infos
		q.init(function (datas) {
            //update token and favorites if any
            if (datas.token) {
                Ti.App.Properties.setString('token', datas.token);
                Ti.App.Properties.setInt('today_publications', datas.today_publications);
                if (datas.favorites) {
                	Ti.App.Properties.setList('favorites', datas.favorites);
                }
            } else {
            	//logout
                Ti.App.fireEvent('app.logout');
            }
            //update categories
            if (datas.categories) {
                Ti.App.Properties.setList('categories', datas.categories);
            }
            //hide loader
            activityIndicator.hide();
            
            //show server message
            if (datas.message) {
                //show message page
                var messageWindow = require('ui/message');
                var message = new messageWindow(datas.message);
                message.addEventListener('close', launchTabs);
                message.open();
            } else {
                launchTabs();
            }
        });
	});
	//Wouaf IT API key in Resources/api.key.txt
	var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "api.key.txt");
	if (!file.exists()) {
		utils.alert(L('error_file_api_key_is_missing'));
		return;
	} else {
		Ti.App.Properties.setString('apiKey', file.read().text);
	}
	
	//eventful API key in Resources/eventful.key.txt
	/*var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "eventful.key.txt");
	if (!file.exists()) {
		utils.alert(L('error_file_eventful_key_is_missing'));
		return;
	} else {
		Ti.App.Properties.setString('eventfulKey', file.read().text);
	}*/
	
	//facebook application key in Resources/facebook.key.txt
	var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "facebook.key.txt");
	if (!file.exists()) {
		utils.alert(L('error_file_fb_key_is_missing'));
		return;
	} else {
		Ti.Facebook.appid = file.read().text;
		Ti.Facebook.permissions = ['email', 'publish_actions', 'user_photos', 'user_birthday'];
	}
	//launch count
	if (!Ti.App.Properties.getInt('launchCount')) {
		Ti.App.Properties.setInt('launchCount', 1);
	} else {
		Ti.App.Properties.setInt('launchCount', Ti.App.Properties.getInt('launchCount') + 1);
	}
	//Geolocation configuration
	Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
	Titanium.Geolocation.distanceFilter = 200;
	//Android GPS configuration
	if (Ti.Platform.osname === 'android') {
		Ti.Geolocation.Android.manualMode = true;
		//location provider
		var gpsProvider = Ti.Geolocation.Android.createLocationProvider({
			name: Ti.Geolocation.PROVIDER_GPS,
			minUpdateTime: 120, 
			minUpdateDistance: 200
		});
		Ti.Geolocation.Android.addLocationProvider(gpsProvider);
		//Location rule
		var gpsRule = Ti.Geolocation.Android.createLocationRule({
		    provider: Ti.Geolocation.PROVIDER_GPS,
		    // Updates should be accurate to 200m
		    accuracy: 200,
		    // Updates should be no older than 10min
		    maxAge: 600000,
		    // But  no more frequent than once per 1min
		    minAge: 60000
		});
		Ti.Geolocation.Android.addLocationRule(gpsRule);
	}
	//Orientation events
	Ti.Gesture.addEventListener('orientationchange', function(e) {
	    Ti.App.fireEvent('app.orientation', e);
	});
	//set gps alert flag
	Ti.App.Properties.setBool('gpsAlert', false);
	Ti.App.Properties.setInt('connectionAlert', 0);
	//compute device screen size (inch)
    Ti.App.Properties.setDouble('screenSize', (Math.round((Math.sqrt(Math.pow(Ti.Platform.displayCaps.platformHeight, 2) + Math.pow(Ti.Platform.displayCaps.platformWidth, 2)) / Ti.Platform.displayCaps.dpi) * 10) / 10)); 
    //show welcome page on first launch
	if (Ti.App.Properties.getInt('launchCount') == 1) {
		//init default app vars
		Ti.App.Properties.setBool('rules', false);
		Ti.App.Properties.setBool('fbPost', true);
		Ti.App.Properties.setBool('allowContact', true);
		Ti.App.Properties.setBool('postNotif', true);
        Ti.App.Properties.setBool('commentNotif', true);
        //Ti.App.Properties.setBool('eventfulSearch', true);
        Ti.App.Properties.setString('unit', 'km');
        Ti.App.Properties.setInt('radius', 150);
        Ti.App.Properties.setList('categories', []);
		
		//show welcome page
		var welcomeWindow = require('ui/welcome');
		var welcome = new welcomeWindow();
		welcome.addEventListener('close', function () {
		    //launch app
            Ti.App.fireEvent('app.start');
		});
		welcome.open();
	} else {
		//launch app
		Ti.App.fireEvent('app.start');
	}
})();