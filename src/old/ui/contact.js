var contact = function (datas) {
	var utils = require('class/utils');
	var textarea = require('ui/components/textarea');
	var buttons = require('ui/components/buttons');
	var header = require('ui/components/header');
    var font = require('ui/components/font');
	var activity = require('ui/components/activityIndicator');
	var query = require('class/query');
    //instanciate query object
    var query = new query();
    
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
    self.add(new header(L('wouaf_it_contact_author'), close));
    
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
        text: L('contact_details')
    });
    mainView.add(label);
	
	//textarea
    var textView = new textarea({
        text: L('your_message')
    }, {
        fieldId: 'text',
        hintText: L('enter_your_text'),
        height: '250dp',
        value: ''
    }, {
        top: '5dp'
    });
    mainView.add(textView);
	
	//Buttons
	var buttonsView = new buttons({
        title: L('cancel')
    }, close, {
        title: L('send')
    }, function() {
        if (!textView.textArea.getValue()) {
            utils.alert(L('please_enter_the_message'));
            return;
        }
        var sendMessageIndicator = new activity({
            message: L('sending_in_progress')
        });
        sendMessageIndicator.show();
        
        query.contact({
            text:       textView.textArea.getValue(),
            contact:    datas.author[0],
            id:         datas.id
        }, function(returnDatas) {
            sendMessageIndicator.hide();
            if (returnDatas.result && returnDatas.result == 1) {
                utils.alert(L('your_message_has_been_sent'));
                close();
            } else if (returnDatas.msg && returnDatas.msg.length) {
                utils.alert(utils._L(returnDatas.msg[0]));
            } else {
                query.connectionError();
            }
        });
    },{
        top: '20dp'
    });
	
	mainView.add(buttonsView);
	
	self.add(mainView);
	self.addEventListener('android:back', close);
	
	return self;
}
module.exports = contact;