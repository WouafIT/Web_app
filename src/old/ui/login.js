var login = function () {
	var utils = require('class/utils');
    var query = require('class/query');
	var textfield = require('ui/components/textfield');
	var buttons = require('ui/components/buttons');
	var header = require('ui/components/header');
    var notification = require('ui/components/notification');
	var font = require('ui/components/font');
	var activity = require('ui/components/activityIndicator');
	var accountWindow = require('ui/account');
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
		Ti.Facebook.removeEventListener('login', onFacebookLogin);
		self.close();
	}
	//login indicator
	var loginIndicator = new activity({
      message: L('identification_in_process')
    });
    
	//login success
	var loginSuccess = function(datas) {
        if (!datas || !datas.user) {
        	loginError({});
        	return;
        }
        loginIndicator.hide();
        if (datas.user.firstname && datas.user.lastname) {
            new notification(String.format(L('welcome_firstname_lastname'), datas.user.firstname, datas.user.lastname));
        } else {
            new notification(String.format(L('welcome_login'), datas.user.username));
        }
        //write datas
        Ti.App.Properties.setString('uid', datas.user.uid);
        Ti.App.Properties.setString('token', datas.token);
        Ti.App.Properties.setObject('user', datas.user);
        Ti.App.Properties.setInt('today_publications', datas.today_publications);
        if (datas.favorites) {
        	Ti.App.Properties.setList('favorites', datas.favorites);
        }
        close();
    }
    //login error
    var loginError = function(datas) {
        //logout
        Ti.App.fireEvent('app.logout');
        
        loginIndicator.hide();
        if (datas && datas.msg) {
        	utils.alert(utils._L(datas.msg[0]));
        } else {
        	query.connectionError();
        }
    }
    
	//header
    self.add(new header(L('wouaf_it_identification'), close));
    
    //scrollview
    var mainView = Ti.UI.createScrollView({
        contentHeight: 'auto',
        layout: 'vertical',
        top: '50dp'
    });
    
    //Facebook account title
    var fbLoginTitle = Ti.UI.createLabel({
        top: '20dp',
        bottom: '20dp',
        left: '5dp',
        right: '5dp',
        height: Ti.UI.SIZE,
        width: Ti.UI.FILL,
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        font: font.arial24normal,
        color: font.green,
        text: L('connect_with_facebook')
    });
    mainView.add(fbLoginTitle);
    
    var fblogin = Ti.Facebook.createLoginButton({
        top: '5dp',
        style: Ti.Facebook.BUTTON_STYLE_WIDE
    });
    //On facebook login, send user infos to server to create account if needed
    var onFacebookLogin = function(e) {
        if (e.success) {
            loginIndicator.show();
            //log user to wouaf it API using fb token
            query.fblogin({
                fid:        e.uid,
                fbtoken:    Ti.Facebook.getAccessToken()
            }, loginSuccess, loginError);
        }
    }
    Ti.Facebook.addEventListener('login', onFacebookLogin);
    
    mainView.add(fblogin);
    //Wouaf IT create account title
    var fbLoginSubTitle = Ti.UI.createLabel({
        top: '10dp',
        bottom: '20dp',
        left: '5dp',
        right: '5dp',
        height: Ti.UI.SIZE,
        width: Ti.UI.FILL,
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        font: font.arial18normal,
        color: font.white,
        text: utils.formatText(L('facebook_connection_details'))
    });
    mainView.add(fbLoginSubTitle);
    
    //Wouaf IT create account title
    var createAccountTitle = Ti.UI.createLabel({
        top: '20dp',
        bottom: '20dp',
        left: '5dp',
        right: '5dp',
        height: Ti.UI.SIZE,
        width: Ti.UI.FILL,
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        font: font.arial24normal,
        color: font.green,
        text: L('new_wouaffer')
    });
    mainView.add(createAccountTitle);
    
    //create account button
    var createAccountButtonView = new buttons({
        title: L('create_your_account'),
        width: '60%',
        left:  '20%'
    }, function(){
        var account = new accountWindow(true);
        account.open();
    });
    mainView.add(createAccountButtonView);
    
    //Wouaf IT account title
    var wouafitLoginTitle = Ti.UI.createLabel({
        top: '20dp',
        bottom: '20dp',
        left: '5dp',
        right: '5dp',
        height: Ti.UI.SIZE,
        width: Ti.UI.FILL,
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        font: font.arial24normal,
        color: font.green,
        text: L('connect_with_wouafit')
    });
    mainView.add(wouafitLoginTitle);
    
	//login
	var loginView = new textfield({
		text: L('username_email')
	}, {
		hintText: L('enter_your_username_or_email'),
		value: ''
	});
	mainView.add(loginView);
	
	//pass
	var passView = new textfield({
		text: L('password')
	}, {
		passwordMask: true,
		value: ''
	});
	mainView.add(passView);
	
	//forget password
    var forgotPassword = Ti.UI.createLabel({
        top: '20dp',
        bottom: '20dp',
        height: Ti.UI.SIZE,
        width: Ti.UI.FILL,
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        font: font.arial22normal,
        color: font.green,
        text: L('forgot_your_password')
    });
    //event listener
    forgotPassword.addEventListener('click', function(e) {
        //textfield
        var emailField = Ti.UI.createTextField({
            borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
            backgroundColor: font.white,
            color: font.black,
            height: 'auto',
            top: '5dp',
            hintText: L('enter_your_email'),
            keyboardType: Ti.UI.KEYBOARD_EMAIL
        });
        
        var dialog = Ti.UI.createAlertDialog({
            cancel: 0,
            buttonNames: [L('cancel'), L('confirm')],
            message: L('send_email_to_reset_your_password'),
            title: L('forgot_your_password'),
            androidView: emailField
        });
        dialog.addEventListener('click', function(e){
            if (e.index === e.source.cancel){
                return;
            }
            //email validation. validate mostly RF2822
            var emailRe = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            //get and check email
            if (!emailField.getValue() || !emailRe.test(emailField.getValue())) {
                utils.alert(L('your_email_is_invalid'));
                return;
            }
            var passLostIndicator = new activity({
              message: L('request_to_reset_your_password_in_progress')
            });
            passLostIndicator.show();
            var resetPassword = function (datas) {
                passLostIndicator.hide();
                if (datas.result == 1) {
                    new notification(L('email_to_reset_has_been_sent'));
                } else {
                    utils.alert(L('an_error_has_occurred_check_your_email_entry'));
                    return;
                }
            }
            query.resetPassword(emailField.getValue(), resetPassword);
        });
        dialog.show();
    });
    mainView.add(forgotPassword);
	
	//Buttons
	var buttonsView = new buttons({
		title:L('cancel'),
		image: utils.img + '/buttons/cancel.png'
	}, 
	close,
	{
		title: L('login'),
		image: utils.img + '/buttons/validate.png'
	}, function(){
		if (!loginView.textField.hasText() || !passView.textField.hasText()) {
			utils.alert(L('username_and_password_required'));
			return;
		}
		loginView.textField.blur();
		passView.textField.blur();
		loginIndicator.show();
		query.login({
			login: loginView.textField.getValue(),
			pass: passView.textField.getValue()
		}, loginSuccess, loginError);
	});
	
	mainView.add(buttonsView);
	
	
	self.add(mainView);
	self.addEventListener('android:back', close);
	
	return self;
}
module.exports = login;