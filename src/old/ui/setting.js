function settingWindow() {
	//require
	var notification = require('ui/components/notification');
	var font = require('ui/components/font');
	var activity = require('ui/components/activityIndicator');
	var utils = require('class/utils');
	var query = require('class/query');
	
    //instanciate query object
	var query = new query();
    
	//create object instance
	var self = Ti.UI.createWindow({
		backgroundColor: font.black,
		navBarHidden: true,
        tabBarHidden: true,
        modal: true,
        fullscreen: false,
		exitOnClose: true
	});
	
	var tableview;
	//used to refresh window content on tab  change
	self.refresh = function () {
		if (tableview) {
    		self.remove(tableview);
    	}
		// create table view data object
		var data = [];
		
		var logged = !!Ti.App.Properties.getString('uid');
		if (logged) {
			data.push({title: L('your_profile'), file:'ui/account', dataId: 'profile', leftImage: utils.img + '/actions/account.png'});
			data.push({title: L('logout'), dataId: 'logout', leftImage: utils.img + '/actions/logout.png'});
		} else {
			data.push({title: L('login'), file:'ui/login', dataId: 'login', leftImage: utils.img + '/actions/logout.png'});
		}
		data.push({title: L('app_params'), file:'ui/params', leftImage: utils.img + '/actions/settings.png'});
        data.push({title: L('help_for_search'), file:'ui/help-search', leftImage: utils.img + '/actions/search.png'});
        data.push({title: L('help_for_publication'), file:'ui/help', leftImage: utils.img + '/actions/edit.png'});
        data.push({title: L('terms_of_use'), file:'ui/terms', leftImage: utils.img + '/actions/terms.png'});
		data.push({title: L('about'), file:'ui/about', leftImage: utils.img + '/actions/about.png'});
		
		for (var i = 0; i < data.length; i++ ) {
			data[i].font = font.arial24normal;
            data[i].color = font.white;
            data[i].height = '50dp';
		};
		
		tableview = Ti.UI.createTableView({
		    data:data
		});
		
		// create table view event listener
		tableview.addEventListener('click', function(e) {
			if (e.rowData.file) {
				var windowModule = require(e.rowData.file);
				var win = new windowModule();
				win.open();
			}
			if (e.rowData.dataId == 'login') {
				win.addEventListener('close', function() {
					if (Ti.App.Properties.getString('uid')) {
						logged = true;
						//remove login
						tableview.deleteRow(0);
						//add profile & logout
						tableview.insertRowBefore(0, {
							title: L('your_profile'), 
							file:'ui/account', 
							dataId: 'profile', 
							font: font.arial22normal,
							height: '50dp',
							leftImage: utils.img + '/actions/account.png'
						});
						tableview.insertRowBefore(1, {
							title: L('logout'), 
							dataId: 'logout', 
							font: font.arial22normal,
							height: '50dp',
							leftImage: utils.img + '/actions/logout.png'
						});
					}
				});
			} else if (e.rowData.dataId == 'logout') {
				var dialog = Ti.UI.createAlertDialog({
					cancel: 0,
					buttonNames: [L('cancel'), L('confirm')],
					message: L('are_you_sure_you_want_to_log_out'),
					title: L('logout')
				});
				dialog.addEventListener('click', function(e){
					if (e.index === e.source.cancel){
						return;
					}
					var activityIndicator = new activity({
					  message: L('disconnecting')
					});
					activityIndicator.show();
					
					var logout = function () {
						logged = false;
						
						//logout
        				Ti.App.fireEvent('app.logout');
						//logout on settings
                        Ti.App.fireEvent('settings.logout');
						
						activityIndicator.hide();
	                    new notification(L('you_are_disconnected'));
					}
					query.logout(logout);
				});
				dialog.show();
			}
		});
		
		// add table view to the window
		self.add(tableview);
	}
	
    //add event to refresh settings on logout
    Ti.App.addEventListener('settings.logout', function(e) {
       if (tableview) {
            //remove profile & logout
            tableview.deleteRow(1);
            tableview.deleteRow(0);
            //add profile & logout
            tableview.insertRowBefore(0, {
                title: L('login'), 
                file:'ui/login', 
                dataId: 'login', 
                font: font.arial22normal,
                height: '50dp',
                leftImage: utils.img + '/actions/logout.png'
            });
        } 
    });
	
	self.refresh();
	return self;
};

module.exports = settingWindow;