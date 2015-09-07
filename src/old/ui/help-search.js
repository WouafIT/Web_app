var helpSearch = function (closeButton) {
	var textfield = require('ui/components/textfield');
	var buttons = require('ui/components/buttons');
	var textimage = require('ui/components/textimage');
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
    self.add(new header(L('wouaf_it_help_search'), close));
    
    //scrollview
    var mainView = Ti.UI.createScrollView({
        contentHeight: 'auto',
        layout: 'vertical',
        top: '50dp'
    });
	
	mainView.add(Ti.UI.createLabel({
        color: font.white,
        font: font.arial22normal,
        left: '10dp',
        top: '10dp',
        height: 'auto',
        right: '10dp',
        autoLink: Ti.Platform.osname === 'android' ? Ti.UI.Android.LINKIFY_WEB_URLS : null,
        text: utils.formatText(L('wouaf_it_help_search_msg_start'))
    }));
    
    mainView.add(new textimage({backgroundImage: '/images/where.png'}, {text: L('wouaf_it_help_search_msg_img1')}));
    mainView.add(new textimage({backgroundImage: '/images/when.png'}, {text: L('wouaf_it_help_search_msg_img2')}));
    mainView.add(new textimage({backgroundImage: '/images/what.png'}, {text: L('wouaf_it_help_search_msg_img3')}));
    mainView.add(new textimage({backgroundImage: '/images/tags.png'}, {text: L('wouaf_it_help_search_msg_img4')}));
    mainView.add(new textimage({backgroundImage: '/images/search.png'}, {text: L('wouaf_it_help_search_msg_img5')}));
    
    mainView.add(Ti.UI.createLabel({
        color: font.white,
        font: font.arial22normal,
        left: '10dp',
        top: '10dp',
        height: 'auto',
        right: '10dp',
        autoLink: Ti.Platform.osname === 'android' ? Ti.UI.Android.LINKIFY_WEB_URLS : null,
        text: utils.formatText(L('wouaf_it_help_search_msg_middle'))
    }));
    
    mainView.add(new textimage({backgroundImage: '/images/refresh-help.png'}, {text: L('wouaf_it_help_search_msg_img6')}));
    mainView.add(new textimage({backgroundImage: '/images/locate-help.png'}, {text: L('wouaf_it_help_search_msg_img7')}));
    
    mainView.add(Ti.UI.createLabel({
        color: font.white,
        font: font.arial22normal,
        left: '10dp',
        top: '10dp',
        height: 'auto',
        right: '10dp',
        bottom: '20dp',
        autoLink: Ti.Platform.osname === 'android' ? Ti.UI.Android.LINKIFY_WEB_URLS : null,
        text: utils.formatText(L('wouaf_it_help_search_msg_end'))
    }));
    
    //Buttons
    if (closeButton === true) {
        var buttonsView = new buttons({
            title: L('ok')
        }, close);
    	
    	mainView.add(buttonsView);
	}
	self.add(mainView);
	self.addEventListener('android:back', close);
	
	return self;
}
module.exports = helpSearch;