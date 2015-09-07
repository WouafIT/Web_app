var welcome = function () {
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
    self.add(new header(L('wouaf_it_welcome'), close));
    
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
		text: utils.formatText(L('wouaf_it_welcome_msg'))
	});
	mainView.add(label);
	
	//Buttons
	var buttonsView = new buttons({
		title: L('create_my_account')
	}, function() {
		var loginWindow = require('ui/login');
		var login = new loginWindow();
		login.open();
		login.addEventListener('close', close);
	},{
        title: L('try_it')
    }, close,
    {
        top: '20dp'
    });
	
	mainView.add(buttonsView);
	
	self.add(mainView);
	self.addEventListener('android:back', close);
	
	return self;
}
module.exports = welcome;