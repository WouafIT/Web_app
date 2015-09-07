var account = function (create) {
	var textfield = require('ui/components/textfield');
	var picker = require('ui/components/picker');
	var switchBt = require('ui/components/switch');
	var buttons = require('ui/components/buttons');
	var header = require('ui/components/header');
    var notification = require('ui/components/notification');
	var font = require('ui/components/font');
	var activity = require('ui/components/activityIndicator');
    var query = require('class/query');
	var utils = require('class/utils');
	//instanciate query object
	var query = new query();
	//email validation. validate mostly RF2822
	var emailRe = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
	
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
    self.add(new header(L('wouaf_it_profile'), close));
    
    //scrollview
    var mainView = Ti.UI.createScrollView({
        contentHeight: 'auto',
        layout: 'vertical',
        top: '50dp'
    });
	
	create = (create === true);
	
	if (create) {
		var desc = L('enter_the_following_infos');
	} else {
		var desc = L('view_and_edit_your_profile_infos_below');
	}
	//description
	var descLabel = Ti.UI.createLabel({
		color: font.white,
		font: font.arial22normal,
		left: '10dp',
		top: '10dp',
		height: 'auto',
		right: '10dp',
		text: desc
	});
	mainView.add(descLabel);
	var checkValue = function(e) {
		var field = e.source;
		var ok = true;
		if (!field.getValue()) {
			field.setBackgroundColor(font.white);
			signWithName.setEnabled(lastnameView.textField.getValue().length > 0 && firstnameView.textField.getValue().length > 0);
			return;
		}
		switch (field.fieldId) {
			case 'username':
				ok = field.getValue().length >= 3 && field.getValue().length <= 100;
			break
			case 'pass':
				ok = field.getValue().length >= 6 && field.getValue().length <= 100;
			break
			case 'passConfirm':
				ok = passView.textField.getValue() == field.getValue();
			break
			case 'email':
				ok = emailRe.test(field.getValue());
			break
			case 'firstname':
				ok = field.getValue().length <= 100;
				signWithName.setEnabled(field.getValue().length > 0 && lastnameView.textField.getValue().length > 0);
			break
			case 'lastname':
				ok = field.getValue().length <= 100;
				signWithName.setEnabled(field.getValue().length > 0 && firstnameView.textField.getValue().length > 0);
			break
		}
		if (ok) {
			field.setBackgroundColor(font.lightgreen);
		} else {
			field.setBackgroundColor(font.lightred);
		}
	}
	//username
	var usernameView = new textfield({
		text: '* '+L('username_alias')
	}, {
		fieldId: 'username',
		hintText: L('enter_your_username'),
		value: (create ? '' : Ti.App.Properties.getObject('user').username)
	});
	usernameView.textField.addEventListener('change', checkValue);
	mainView.add(usernameView);
	//pass
	var passView = new textfield({
		text: (create ? '* ' : '') + L('password')
	}, {
		fieldId: 'pass',
		passwordMask: true,
		value: ''
	});
	passView.textField.addEventListener('change', checkValue);
	mainView.add(passView);
	//pass confirm
	var passConfirmView = new textfield({
		text: (create ? '* ' : '') + L('confirm_password')
	}, {
		fieldId: 'passConfirm',
		passwordMask: true,
		value: ''
	});
	passConfirmView.textField.addEventListener('change', checkValue);
	mainView.add(passConfirmView);
	
	//email
	var emailView = new textfield({
		text: '* '+ L('email')
	}, {
		fieldId: 'email',
		hintText: L('enter_your_email'),
		keyboardType: Ti.UI.KEYBOARD_EMAIL,
		value: (create ? '' : Ti.App.Properties.getObject('user').email)
	});
	emailView.textField.addEventListener('change', checkValue);
	mainView.add(emailView);
	
	//firstname
	var firstnameView = new textfield({
		text: L('firstname')
	}, {
		fieldId: 'firstname',
		hintText: L('enter_your_firstname'),
		value: (create ? '' : (Ti.App.Properties.getObject('user').firstname ? Ti.App.Properties.getObject('user').firstname : ''))
	});
	firstnameView.textField.addEventListener('change', checkValue);
	mainView.add(firstnameView);
	
	//lastname
	var lastnameView = new textfield({
		text: L('lastname')
	}, {
		fieldId: 'lastname',
		hintText: L('enter_your_lastname'),
		value: (create ? '' : (Ti.App.Properties.getObject('user').lastname ? Ti.App.Properties.getObject('user').lastname : ''))
	});
	lastnameView.textField.addEventListener('change', checkValue);
	mainView.add(lastnameView);
	
	//language
	var languageView = new picker({
		text: '* '+ L('language')
	},{});
	var datas = [
		Ti.UI.createPickerRow({title: L('choose'), value: ''}), 
		Ti.UI.createPickerRow({title: L('french'), value: 'fr_FR'}), 
		Ti.UI.createPickerRow({title: L('english'), value: 'en_US'})
	];
	languageView.pickerField.add(datas);
	mainView.add(languageView);
	if (create) {
		if (Ti.Locale.currentLanguage.toLowerCase().substr(0, 2) == 'fr') {
			languageView.pickerField.setSelectedRow(0, 1);
		} else {
			languageView.pickerField.setSelectedRow(0, 2);
		}
	} else {
		var language = Ti.App.Properties.getObject('user').lang;
		if (language == 'fr_FR') {
			languageView.pickerField.setSelectedRow(0, 1);
		} else if (language == 'en_US') {
			languageView.pickerField.setSelectedRow(0, 2);
		} else {
			languageView.pickerField.setSelectedRow(0, 0);
		}
	}
	
	//gender
	var genderView = new picker({
		text: L('gender')
	},{});
	var datas = [
		Ti.UI.createPickerRow({title: L('choose'), value: ''}), 
		Ti.UI.createPickerRow({title: L('man'), value: 'male'}), 
		Ti.UI.createPickerRow({title: L('woman'), value: 'female'})
	];
	genderView.pickerField.add(datas);
	mainView.add(genderView);
	if (create) {
		genderView.pickerField.setSelectedRow(0, 0);
	} else {
		var gender = Ti.App.Properties.getObject('user').gender;
		if (gender == 'male') {
			genderView.pickerField.setSelectedRow(0, 1);
		} else if (gender == 'female') {
			genderView.pickerField.setSelectedRow(0, 2);
		} else {
			genderView.pickerField.setSelectedRow(0, 0);
		}
	}
	
	//birthdate
	var birthdate = new Date();
    if (!create && Ti.App.Properties.getObject('user').birthdate && Ti.App.Properties.getObject('user').birthdate.sec) {
        birthdate.setTime((Ti.App.Properties.getObject('user').birthdate.sec * 1000))
    }
    //date view
    var birthdateView = new textfield({
        text: L('birthdate')
    },{
        editable: false,
        hint: L('enter_your_birthdate'),
        value: (create || !Ti.App.Properties.getObject('user').birthdate || !Ti.App.Properties.getObject('user').birthdate.sec ? '' : utils.formatDate(birthdate, 'long'))
    });
    mainView.add(birthdateView);
    
    //dateFieldView
    var dateFieldView = Ti.UI.createView({
        layout: 'composite',
        backgroundColor: font.black,
        height: Ti.UI.SIZE,
        width: '80%',
        zIndex: 10,
        borderWidth: 2,
        borderColor: font.grey,
        visible: false
    });
    //dateFieldMask
    var dateFieldMask = Ti.UI.createView({
        backgroundColor: font.black,
        height: Ti.UI.FILL,
        width: Ti.UI.FILL,
        zIndex: 9,
        opacity: 0.9,
        borderColor: font.grey,
        visible: false
    });
    var dateContainerView = Ti.UI.createView({
        layout: 'horizontal',
        height: Ti.UI.FILL,
        width: Ti.UI.SIZE,
        horizontalWrap: true,
        bottom: '106dp',
        top: 2
    });
    dateFieldView.add(dateContainerView);
    
    //date picker
    var datePicker = Ti.UI.createPicker({
        type: Ti.UI.PICKER_TYPE_DATE,
        locale: Ti.Locale.currentLocale,
        selectionIndicator: true,
        value: birthdate
    });
    dateContainerView.add(datePicker);
    
    //callbacks
    var updateDateField = function() {
        birthdateView.textField.setValue(utils.formatDate(datePicker.getValue(), 'long'));
        birthdate = datePicker.getValue();
    }
    var showDatePicker = function() {
        dateFieldMask.setVisible(true);
        dateFieldView.setVisible(true);
        //hide keyboard on android
        if (Ti.Platform.name === 'android') {
            Ti.UI.Android.hideSoftKeyboard();
        }
    }
    var hideDatePicker = function() {
        dateFieldView.setVisible(false);
        dateFieldMask.setVisible(false);
    }
    
    //buttons
    dateFieldView.add(new buttons({
        title: L('cancel'),
        image: utils.img + '/buttons/cancel.png'
    }, hideDatePicker, {
        title: L('define'),
        image: utils.img + '/buttons/validate.png'
    }, function(){
        updateDateField();
        hideDatePicker();
    }, {    
        top: null,
        bottom: '53dp',
        left: 0,
        right: 0,
        width: '100%'
    }));
    dateFieldView.add(new buttons({
        title: L('reset'),
        image: utils.img + '/buttons/delete.png',
        width: '60%',
        left:  '20%'
    }, function() {
        birthdateView.textField.setValue('');
        birthdate = new Date();
        hideDatePicker();
    }, null, null, {    
        top: null,
        bottom: '3dp',
        left: 0,
        right: 0,
        width: '100%'
    }));
    
    //events
    birthdateView.textField.addEventListener('singletap', showDatePicker);
    dateFieldMask.addEventListener('click', hideDatePicker);
    
    self.add(dateFieldMask);
    self.add(dateFieldView);
	
	var signWithName = new switchBt({
        title: L('sign_my_publications_with_my_first_and_last_name'),
        value: (Ti.App.Properties.getObject('user') ? !!Ti.App.Properties.getObject('user').signwname : false),
        top: '15dp',
        bottom: '5dp',
        enabled: (lastnameView.textField.getValue().length > 0 && firstnameView.textField.getValue().length > 0)
    });
    mainView.add(signWithName);
	
	//Buttons
	var buttonsView = new buttons({
		title: L('cancel'),
		image: utils.img + '/buttons/cancel.png'
	}, 
	close,
	{
		title: (create ? L('create') : L('save')),
		image: utils.img + '/buttons/validate.png'
	}, function(){
		
		//check mandatory
		if (!usernameView.textField.getValue()
			 || !emailView.textField.getValue()
			 || !languageView.pickerField.getSelectedRow(0).value) {
			utils.alert(L('please_enter_all_required_fields'));
			return;
		} else if (create) {
			if (!passView.textField.getValue()
				 || !passConfirmView.textField.getValue()) {
				utils.alert(L('please_enter_all_required_fields'));
				return;
			}
		}
		//* username 3 -> 100
		if (usernameView.textField.getValue().length < 3 || usernameView.textField.getValue().length > 100 ) {
			utils.alert(L('your_username_is_invalid'));
			return;
		}
		if (create) {
			if (passView.textField.getValue().length < 6 || passView.textField.getValue().length > 100 ) {
				utils.alert(L('your_password_is_invalid'));
				return;
			}
			if (passConfirmView.textField.getValue() != passView.textField.getValue()) {
				utils.alert(L('your_password_confirmation_is_invalid'));
				return;
			}
		} else {
			if (passView.textField.getValue() && passView.textField.getValue().length < 6 || passView.textField.getValue().length > 100 ) {
				utils.alert(L('your_password_is_invalid'));
				return;
			}
			if (passConfirmView.textField.getValue() && passConfirmView.textField.getValue() != passView.textField.getValue()) {
				utils.alert(L('your_password_confirmation_is_invalid'));
				return;
			}
		}
		if (!emailRe.test(emailView.textField.getValue())) {
			utils.alert(L('your_email_is_invalid'));
			return;
		}
		if (firstnameView.textField.getValue().length > 100 ) {
			utils.alert(L('your_firstname_is_too_long'));
			return;
		}
		if (lastnameView.textField.getValue().length > 100 ) {
			utils.alert(L('your_lastname_is_too_long'));
			return;
		}
		if (birthdateView.textField.getValue().length && birthdate.getTime() >= (new Date().getTime())) {
			utils.alert(L('your_birthdate_is_invalid'));
			return;
		}
		
		if (birthdateView.textField.getValue().length) {
			var date = birthdate.getFullYear() + '-' + (birthdate.getMonth() + 1) + '-' + birthdate.getDate();
		} else {
			var date = '';
		}
		if (create) {
			var activityIndicator = new activity({
				message: L('creation_in_progress')
			});
		} else {
			var activityIndicator = new activity({
				message: L('update_in_progress')
			});
		}
		activityIndicator.show();
		
		var queryCall = create ? query.createUser : query.updateUser;
		queryCall({
			username: 		usernameView.textField.getValue(),
			pass: 			passView.textField.getValue(),
			email: 			emailView.textField.getValue(),
			firstname: 		firstnameView.textField.getValue(),
			lastname: 		lastnameView.textField.getValue(),
			gender: 		genderView.pickerField.getSelectedRow(0).value,
			birthdate: 		date,
			lang: 			languageView.pickerField.getSelectedRow(0).value,
			signwname:		(signWithName.value ? 1 : 0),
		}, function(datas) {
			activityIndicator.hide();
			if (datas.result && datas.result == 1) {
				if (create) {
					Ti.App.Properties.setString('uid', datas.uid);
					utils.alert(utils.formatText(L('welcome_to_wouaf_it_please_login')), L('welcome'));
				} else {
					//update internal datas
					var user = Ti.App.Properties.getObject('user');
					user.username = usernameView.textField.getValue();
					user.email = emailView.textField.getValue();
					user.firstname = firstnameView.textField.getValue();
					user.lastname = lastnameView.textField.getValue();
					user.gender = genderView.pickerField.getSelectedRow(0).value;
					user.birthdate.sec = (birthdate.getTime() / 1000);
					user.signwname = (signWithName.value ? 1 : 0);
					user.lang = languageView.pickerField.getSelectedRow(0).value;
					Ti.App.Properties.setObject('user', user);
					new notification(L('your_profile_is_updated'));
				}
				self.close();
			} else if (datas.msg) {
				utils.alert(utils._L(datas.msg[0]));
			} else {
				query.connectionError();
			}
		}, function(datas) {
			activityIndicator.hide();
			if (datas.msg) {
				utils.alert(utils._L(datas.msg[0]));
			} else {
				query.connectionError();
			}
		});
	}, {top: '20dp'});
	
	mainView.add(buttonsView);
	
	if (!create) {
        //Buttons
        var deleteButtonsView = new buttons({
            title: L('delete_your_profile'),
            image: utils.img + '/buttons/delete.png',
            width: '80%',
            left:  '10%',
        }, function() {
            var dialog = Ti.UI.createAlertDialog({
                cancel: 0,
                buttonNames: [L('cancel'), L('confirm')],
                message: utils.formatText(L('are_you_sure_you_want_to_permanently_delete_your_profile')),
                title: L('attention_deleting_your_profile')
            });
            dialog.addEventListener('click', function(e){
                if (e.index === e.source.cancel){
                    return;
                }
                var dialog = Ti.UI.createAlertDialog({
                    cancel: 0,
                    buttonNames: [L('cancel'), L('confirm')],
                    message: utils.formatText(L('really_you_can_not_go_back')),
                    title: L('attention_deleting_your_profile')
                });
                dialog.addEventListener('click', function(e){
                    if (e.index === e.source.cancel){
                        return;
                    }
                    var userDeletionIndicator = new activity({
                        message: L('deleting')
                    });
                    userDeletionIndicator.show();
                    query.deleteUser(function(datas) {
                        userDeletionIndicator.hide();
                        if (datas.result && datas.result == 1) {
                            //logout
                            Ti.App.fireEvent('app.logout');
                            //logout on settings
                            Ti.App.fireEvent('settings.logout');
                            //close window
                            close();
                            //display message
                            utils.alert(L('your_profile_is_deleted'));
                        } else if (datas.msg && datas.msg.length) {
                            utils.alert(utils._L(datas.msg[0]));
                        } else {
                            query.connectionError();
                        }
                    });
                });
                dialog.show();
            });
            dialog.show();
        }, null, null, {top: '20dp'});
        mainView.add(deleteButtonsView);
    }
    
	self.add(mainView);
	self.addEventListener('android:back', close);
	
	return self;
}
module.exports = account;