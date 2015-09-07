var appParams = function () {
	var textfield = require('ui/components/textfield');
	var picker = require('ui/components/picker');
    var switchBt = require('ui/components/switch');
    var buttons = require('ui/components/buttons');
	var header = require('ui/components/header');
	var font = require('ui/components/font');
	var utils = require('class/utils');
	
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
	var close = function() {
		self.removeEventListener('android:back', close);
		self.close();
	}
	
	//header
    self.add(new header(L('wouaf_it_params'), close));
	
	//scrollview
	var mainView = Ti.UI.createScrollView({
		contentHeight: 'auto',
		layout: 'vertical',
		top: '50dp'
	});
	
	//Search Options
	var searchParamsTitle = Ti.UI.createLabel({
        top: '20dp',
        bottom: '10dp',
        left: '5dp',
        right: '5dp',
        height: Ti.UI.SIZE,
        width: Ti.UI.FILL,
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        font: font.arial24bold,
        color: font.green,
        text: L('search_params')
    });
    mainView.add(searchParamsTitle);
    
    
    //zone (10 à 300km)
    var radiusView = new picker({
        text: L('search_radius')
    },{});
    var kmLabel = L('km');
    var radius = ['10 '+ kmLabel, '20 '+ kmLabel, '30 '+ kmLabel, '50 '+ kmLabel, '70 '+ kmLabel, '100 '+ kmLabel, '150 '+ kmLabel, '200 '+ kmLabel, '300 '+ kmLabel];
    var milesLabel = L('miles');
    var mlRadius = ['5 '+ milesLabel, '10 '+ milesLabel, '15 '+ milesLabel, '30 '+ milesLabel, '45 '+ milesLabel, '60 '+ milesLabel, '90 '+ milesLabel, '120 '+ milesLabel, '180 '+ milesLabel];
    var datas = [];
    var selectedIndex = 0;
    var unit = Ti.App.Properties.getString('unit');
    for (var i = 0, l = radius.length; i < l; i++) {
        if (unit == 'km' || !unit) {
            datas[i]=Ti.UI.createPickerRow({title:radius[i]});
        } else {
            datas[i]=Ti.UI.createPickerRow({title:mlRadius[i]});
        }
        if (parseInt(radius[i]) == Ti.App.Properties.getInt('radius')) {
            selectedIndex = i;
        }
    }
    radiusView.pickerField.add(datas);
    radiusView.pickerField.addEventListener('change', function(e){
        Ti.App.Properties.setInt('radius', parseInt(radius[e.rowIndex], 10));
    });
    mainView.add(radiusView);
    radiusView.pickerField.setSelectedRow(0, selectedIndex);
    
	//search radius unit
	var unitView = new picker({
		text: L('units_for_search_radius')
	},{});
	var datas = [
		Ti.UI.createPickerRow({title: L('kilometers'), value:'km'}), 
		Ti.UI.createPickerRow({title: L('miles'), value:'ml'})
	];
	unitView.pickerField.add(datas);
	mainView.add(unitView);
    var unit = Ti.App.Properties.getString('unit');
	if (unit == 'km' || !unit) {
		unitView.pickerField.setSelectedRow(0, 0);
	} else {
		unitView.pickerField.setSelectedRow(0, 1);
	}
	
	/*var eventfulSearch = Ti.UI.createSwitch({
        style: Ti.Platform.osname === 'android' ? Ti.UI.Android.SWITCH_STYLE_CHECKBOX : null,
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        title: L('search_also_on_eventful'),
        value: !!Ti.App.Properties.getBool('eventfulSearch'),
        height: Ti.UI.SIZE,
        width: Ti.UI.FILL,
        bottom: '10dp',
        left: '5dp',
        right: '5dp'
    });
    
    mainView.add(eventfulSearch);*/
    
	//Post Options
	var postParamsTitle = Ti.UI.createLabel({
        top: '20dp',
        bottom: '10dp',
        left: '5dp',
        right: '5dp',
        height: Ti.UI.SIZE,
        width: Ti.UI.FILL,
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        font: font.arial24bold,
        color: font.green,
        text: L('default_publish_params')
    });
    mainView.add(postParamsTitle);
    
    var facebookPost = new switchBt({
		title: L('post_on_my_facebook_wall'),
		value: !!Ti.App.Properties.getBool('fbPost'),
		enabled: Ti.Facebook.loggedIn
    });
	mainView.add(facebookPost);
	
	var allowContact = new switchBt({
        title: L('allow_other_wouaffers_to_contact_me'),
        value: !!Ti.App.Properties.getBool('allowContact')
    });
    mainView.add(allowContact);
    
	var postNotification = new switchBt({
        title: L('be_notified_by_email_of_comments_on_your_wouaf'),
        value: !!Ti.App.Properties.getBool('postNotif')
    });
    mainView.add(postNotification);
    
    var commentsNotification = new switchBt({
        title: L('be_notified_by_email_of_comments_on_your_comment'),
        value: !!Ti.App.Properties.getBool('commentNotif')
    });
    mainView.add(commentsNotification);
    
	/*************************************************/
	/*                   Validation                  */
	/*************************************************/
	
	//Buttons
	var buttonsView = new buttons({
		title: L('cancel'),
		image: utils.img + '/buttons/cancel.png'
	}, close, {
		title: L('validate'),
		image: utils.img + '/buttons/validate.png'
	}, function(){
		Ti.App.Properties.setString('unit', unitView.pickerField.getSelectedRow(0).value);
		Ti.App.Properties.setBool('fbPost', facebookPost.value );
		Ti.App.Properties.setBool('allowContact', allowContact.value );
		Ti.App.Properties.setBool('postNotif', postNotification.value );
        Ti.App.Properties.setBool('commentNotif', commentsNotification.value );
        //Ti.App.Properties.setBool('eventfulSearch', eventfulSearch.value );
        
		close();
	});
	
	mainView.add(buttonsView);
	
	self.add(mainView);
	self.addEventListener('android:back', close);
	
	return self;
}
module.exports = appParams;