var search = function (mapview, cats, searchParams) {
	var textfield = require('ui/components/textfield');
	var picker = require('ui/components/picker');
	var buttons = require('ui/components/buttons');
    var header = require('ui/components/header');
    var font = require('ui/components/font');
	var activity = require('ui/components/activityIndicator');
	var notification = require('ui/components/notification');
	var utils = require('class/utils');
	var query = require('class/query');
	var twitter = require('lib/twitter-text');
	
	//instanciate query object
	var query = new query();
	
	var self = Ti.UI.createWindow({
		backgroundColor: font.black,
		exitOnClose: false,
		modal: true,
        navBarHidden: true,
        tabBarHidden: true,
		zIndex: 50
	});
	if (Ti.UI.Android){
		self.windowSoftInputMode = Ti.UI.Android.SOFT_INPUT_ADJUST_PAN;
	}
	var back = function(){
		if (dateFieldView.getVisible()) {
			hideDatePicker();
		} else {
			close();
		}
	}
	
	var close = function() {
		self.removeEventListener('android:back', back);
		self.close();
	}
	
	//header
    self.add(new header(L('wouaf_it_search'), close));
	
	//scrollview
	var mainView = Ti.UI.createScrollView({
		contentHeight: 'auto',
		layout: 'vertical',
		top: '50dp'
	});
	//cats
	var catView = new picker({
		text: L('category')
	},{});
	var datas = [];
	for (var i = 0, l = cats.length; i < l; i++) {
		datas[i]=Ti.UI.createPickerRow({title:cats[i]});
	}
	catView.pickerField.add(datas);
	catView.pickerField.addEventListener('change', function(e){
		searchParams.cat = e.rowIndex;
	});
	mainView.add(catView);
	catView.pickerField.setSelectedRow(0, searchParams.cat);
	
	//tags
	var tagView = new textfield({
		text: 'Tag'
	},{
		hintText: L('enter_a_tag_to_search'),
		value: searchParams.tag[1]
	});
	mainView.add(tagView);
	tagView.textField.addEventListener('change', function(e){
		var tagValue = twitter.extractHashtags('#' + e.value)[0];
		searchParams.tag = [999999, tagValue];
	});
	
	//position (defaut : ma position)
	var posView = new textfield({
		text: L('address')
	},{
		hintText: L('current_center_of_the_map'),
		value: ''
	});
	mainView.add(posView);
	var newLocation = '';
	posView.textField.addEventListener('change', function(e){
		newLocation = e.value;
	});
	
	/*************************************************/
	/*                 DATE & DURATION               */
	/*************************************************/
	//vars
	if (!searchParams.date) {
		var date = new Date();
		var hint = L('today');
	} else {
		var date = searchParams.date;
		var hint = utils.formatDate(searchParams.date, 'long');
	}
	//date view
	var dateView = new textfield({
		text: L('date')
	},{
		editable: false,
		hintText: hint,
		value: ''
	});
	mainView.add(dateView);
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
		bottom: '56dp',
	    top: 2
	});
	dateFieldView.add(dateContainerView);
	
	//date picker
	var datePicker = Ti.UI.createPicker({
		type: Ti.UI.PICKER_TYPE_DATE,
		locale: Ti.Locale.currentLocale,
		selectionIndicator: true,
		value:date
	});
	dateContainerView.add(datePicker);
	
	//callbacks
	var updateDateField = function() {
		dateView.textField.setValue(utils.formatDate(datePicker.getValue(), 'long'));
		date = datePicker.getValue();
		searchParams.date = date;
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
    var buttonsView = new buttons({
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
        bottom: '3dp',
        left: 0,
        right: 0,
        width: '100%'
    });
    dateFieldView.add(buttonsView);
    
    //events
    dateView.textField.addEventListener('singletap', showDatePicker);
    dateFieldMask.addEventListener('click', hideDatePicker);
    
    self.add(dateFieldMask);
    self.add(dateFieldView);
	
	//duration
    var durationView = new picker({
        text: L('duration')
    },{});
    var daysLabel = L('days');
    var weeksLabel = L('weeks');
    var days = {
        86400: '1 '+ L('day'), 
        172800: '2 '+ daysLabel, 
        259200: '3 '+ daysLabel, 
        345600: '4 '+ daysLabel, 
        432000: '5 '+ daysLabel, 
        604800: '1 '+ L('week'), 
        1209600: '2 '+ weeksLabel, 
        1814400: '3 '+ weeksLabel, 
        2419200: '4 '+ weeksLabel
    };
    var datas = [];
    var selectedIndex = 0;
    var count = 0;
    for (var i in days) {
        datas.push(Ti.UI.createPickerRow({title:days[i]}));
        if (i == searchParams.duration) {
            selectedIndex = count;
        }
        count++;
    }
    durationView.pickerField.add(datas);
    durationView.pickerField.addEventListener('change', function(e){
        var count = 0;
        for (var i in days) {
            if (count == e.rowIndex) {
                searchParams.duration = i;
            }
            count++;
        }
    });
    mainView.add(durationView);
	durationView.pickerField.setSelectedRow(0, selectedIndex);
    
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
		if (parseInt(radius[i], 10) == searchParams.radius) {
			selectedIndex = i;
		}
	}
	radiusView.pickerField.add(datas);
	radiusView.pickerField.addEventListener('change', function(e){
		searchParams.radius = parseInt(radius[e.rowIndex], 10);
	});
	mainView.add(radiusView);
	radiusView.pickerField.setSelectedRow(0, selectedIndex);
	
	/*************************************************/
	/*                   Validation                  */
	/*************************************************/
	
	//Buttons
	var buttonsView = new buttons({
		title: L('cancel'),
		image: utils.img + '/buttons/cancel.png'
	}, close, {
		title: L('searching'),
		image: utils.img + '/buttons/search.png'
	}, function(){
		if (newLocation) {
			var activityIndicator = new activity({
			  message: L('geolocation_in_progress')
			});
			activityIndicator.show();
			
			query.geocode(newLocation, function(latLng, latitudeDelta, longitudeDelta) {
				activityIndicator.hide();
				if (latLng === false) {
					utils.alert(L('unable_to_locate_this_address_please_retry'));
					return;
		    	}
		    	mapview.setLocation({
			    	latitude: latLng.lat, 
			    	longitude: latLng.lng,
			        latitudeDelta: latitudeDelta,
			        longitudeDelta: longitudeDelta,
			        animate: true,
			        regionFit: true
			    });
			    searchParams['loc'] = (latLng.lat+','+latLng.lng);
				
				Ti.App.fireEvent('search.posts', searchParams);
				close();
			});
		} else {
			Ti.App.fireEvent('search.posts', searchParams);
			close();
		}
	});
	
	mainView.add(buttonsView);
	
	self.add(mainView);
	self.addEventListener('android:back', back);
	
	return self;
}
module.exports = search;