var about = function (closeButton) {
	var textfield = require('ui/components/textfield');
	var buttons = require('ui/components/buttons');
	var header = require('ui/components/header');
    var font = require('ui/components/font');
    var utils = require('class/utils');
	
	//create window
	var self = Ti.UI.createWindow({
		backgroundColor: font.black,
		exitOnClose: false,
		modal: true,
		navBarHidden: true,
		tabBarHidden: true
	});
	if (Ti.UI.Android){
		self.windowSoftInputMode = Ti.UI.Android.SOFT_INPUT_ADJUST_PAN;
	}
	//close current window
	var close = function() {
		self.removeEventListener('android:back', close);
		self.close();
	}
	
    //header
    self.add(new header(L('wouaf_it_about'), close));
    
    //scrollview
    var mainView = Ti.UI.createScrollView({
        contentHeight: 'auto',
        layout: 'vertical',
        top: '50dp'
    });
	
	var label = Ti.UI.createLabel({
		color: font.white,
		font: font.arial22normal,
		left: '10dp',
		top: '10dp',
		height: 'auto',
		right: '10dp',
		bottom: '20dp',
        autoLink: Ti.Platform.osname === 'android' ? Ti.UI.Android.LINKIFY_WEB_URLS : null,
		text: utils.formatText(L('wouaf_it_welcome_msg') + utils.nl + utils.nl + String.format(L('wouaf_it_about_msg'), (new Date()).getFullYear()) + utils.nl + utils.nl + String.format(L('version_'), Ti.App.version))
	});
	mainView.add(label);
	
	//Buttons
	if (closeButton === true) {
    	var buttonsView = new buttons({
    		title: L('back')
    	}, close);
    	mainView.add(buttonsView);
	}
	
	self.add(mainView);
	self.addEventListener('android:back', close);
	
	return self;
}
module.exports = about;