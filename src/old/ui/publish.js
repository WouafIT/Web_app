var publish = function () {
	var textfield = require('ui/components/textfield');
	var textarea = require('ui/components/textarea');
	var picker = require('ui/components/picker');
	var switchBt = require('ui/components/switch');
	var buttons = require('ui/components/buttons');
	var header = require('ui/components/header');
    var notification = require('ui/components/notification');
	var activity = require('ui/components/activityIndicator');
	var font = require('ui/components/font');
	var query = require('class/query');
	var utils = require('class/utils');
	
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
	
	/*************************************************/
    /*                  TERMS OF USE                 */
    /*************************************************/
    var termsOfUseView = Ti.UI.createScrollView({
        contentHeight: 'auto',
        layout: 'vertical',
        top: 0,
        visible: false
    });
    
    var postRulesTitle = Ti.UI.createLabel({
        top: '10dp',
        bottom: '10dp',
        left: '5dp',
        right: '5dp',
        height: Ti.UI.SIZE,
        width: Ti.UI.FILL,
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        font: font.arial24bold,
        color: font.green,
        text: L('terms_of_use')
    });
    termsOfUseView.add(postRulesTitle);
    
    var termsOfUseLabel = Ti.UI.createLabel({
        color: font.white,
        font: font.arial22normal,
        left: '10dp',
        top: '10dp',
        bottom: '20dp',
        height: 'auto',
        right: '10dp',
        autoLink: Ti.Platform.osname === 'android' ? Ti.UI.Android.LINKIFY_WEB_URLS : null,
		text: utils.formatText(L('wouaf_it_rules'))
    });
    termsOfUseView.add(termsOfUseLabel);
    
    //Buttons
    var rulesButtonsView = new buttons({
        title: L('i_understand_i_ll_be_careful'),
        width: '70%',
        left: '15%'
    }, function() {
        Ti.App.Properties.setBool('rules', true);
        self.refresh();
    });
    termsOfUseView.add(rulesButtonsView);
    
    self.add(termsOfUseView);
	
	/*************************************************/
    /*                      LOGIN                    */
    /*************************************************/
    var loginView = Ti.UI.createScrollView({
        contentHeight: 'auto',
        layout: 'vertical',
        top: 0,
        visible: false
    });
	
	var loginLabel = Ti.UI.createLabel({
        color: font.white,
        font: font.arial22normal,
        left: '10dp',
        top: '10dp',
        bottom: '10dp',
        height: 'auto',
        right: '10dp',
        text: L('to_publish_you_must_login_first')
    });
    loginView.add(loginLabel);
    
    //Buttons
    var loginButtonsView = new buttons({
        title: L('login')
    }, function() {
        var loginWindow = require('ui/login');
        var login = new loginWindow();
        login.open();
        login.addEventListener('close', self.refresh);
    });
    loginView.add(loginButtonsView);
    
    self.add(loginView);
    
    
    /*************************************************/
    /*               POST FORM FIELDS                */
    /*************************************************/
        
    //handle back button
    var back = function(){
        if (dateFieldView && dateFieldView.getVisible()) {
            hideDatePicker();
        } else if (mapFieldView && mapFieldView.getVisible()) {
            hideMapPicker();
        } else if (fbAlbumView && fbAlbumView.getVisible()){
            hideFbAlbumPicker();
        } else {
            self.removeEventListener('android:back', back);
        }
    }
    
    var postView = Ti.UI.createScrollView({
        contentHeight: 'auto',
        layout: 'vertical',
        top: 0,
        visible: false
    });
    
    var titleView = Ti.UI.createView({
        layout: 'composite',
        top: '10dp',
        left: '5dp',
        right: '5dp',
        height: Ti.UI.SIZE,
        width: Ti.UI.FILL
    });
    
    var postTitle = Ti.UI.createLabel({
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        font: font.arial24bold,
        left: 0,
        color: font.green,
        text: L('create_your_wouaf')
    });
    titleView.add(postTitle);
    
    //Help button
    var helpBt = Ti.UI.createButton({
        backgroundImage: '/images/help.png',
        height: '25dp',
        width: '25dp',
        right: 0
    });
    helpBt.addEventListener('click', function() {
        //show help page
        var helpWindow = require('ui/help');
        new helpWindow().open();
    });
    
    titleView.add(helpBt);
    postView.add(titleView);
    
    var wouafCount = Ti.UI.createLabel({
        color: font.white,
		font: font.arial22normal,
		left: '10dp',
		top: '10dp',
		height: 'auto',
		right: '10dp',
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
        text: '',
        visible: false
    });
    postView.add(wouafCount);
    
    //textarea (+tags / tinyurl)
    var textView = new textarea({
        text: '* '+ String.format(L('text_still'), 300)
    }, {
        fieldId: 'text',
        hintText: L('enter_your_text'),
        height: '120dp',
        font: font.arial24normal,
        value: ''
    }, {'top': '5dp'});
    postView.add(textView);
    
    var countLabel = Ti.UI.createLabel({
        color: font.white,
        font: font.arial18normal,
        left: '10dp',
        top: '1dp',
        height: 'auto',
        right: '10dp',
        textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
        text: String.format(L('still'), 300)
    });
    postView.add(countLabel);
    
    var ldf = Ti.Platform.osname === 'mobileweb' ? 1 : Ti.Platform.displayCaps.getLogicalDensityFactor();
    var firstAlert = false;
    var countText = function () {
        var t = textView.textArea;
        var l = t.value.length;
        //trim at 300 chars if needed
        if (300 - l < 0) {
            t.value = t.value.substr(0, 300);
            l = t.value.length;
            //alert user
            if (!firstAlert) {
                firstAlert = true;
                utils.alert(L('max_length_reached'));
            } else {
                new notification(L('max_length_reached'));
            }
        }
        //auto height
        if (l > 0) {
            var linecount = 0;
            var splitresult = t.value.split("\n");
            for (var i = 0, ll = splitresult.length; i < ll; i++) {
                var charCount = splitresult[i].length;
                linecount += charCount ? Math.ceil( charCount / ((t.getRect().width - (20 * ldf)) / (8 * ldf)) ) : 1;  
            }
            var h = (linecount + 1) * 25;
            t.height = h > 120 ? (h * ldf) : '120dp';
        } else {
            t.height = '120dp';
        }
        //display chars left
        textView.label.text = '* '+ String.format(L('text_still'), (300 - l));
        countLabel.text = String.format(L('still'), (300 - l));
        
        return false;
    }
    textView.textArea.addEventListener('change', countText);
    
    /*************************************************/
    /*                   DATE & TIME                 */
    /*************************************************/
    var date = new Date();
    //date view
    var dateView = new textfield({
        text: L('starting')
    },{
        editable: false,
        hintText: L('now'),
        value: ''
    }, {
        top: 0
    });
    postView.add(dateView);
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
    //time picker
    var timePicker = Ti.UI.createPicker({
        type: Ti.UI.PICKER_TYPE_TIME,
        format24: true,
        selectionIndicator: true,
        value: date
    });
    dateContainerView.add(timePicker);
    
    //callbacks
    var updateDateField = function() {
        dateView.textField.setValue(utils.formatDate(datePicker.getValue(), 'long') +' '+ utils.formatTime(timePicker.getValue()));
        date = datePicker.getValue();
        date.setHours(timePicker.getValue().getHours());
        date.setMinutes(timePicker.getValue().getMinutes());
    }
    var showDatePicker = function() {
        self.addEventListener('android:back', back);
        dateFieldMask.show();
        dateFieldView.show();
        //hide keyboard on android
        if (Ti.Platform.name === 'android') {
            Ti.UI.Android.hideSoftKeyboard();
        }
    }
    var hideDatePicker = function() {
        dateFieldView.hide();
        dateFieldMask.hide();
        self.removeEventListener('android:back', back);
    }
    
    //buttons
    var dateButtonsView = new buttons({
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
    dateFieldView.add(dateButtonsView);
    
    //events
    dateView.textField.addEventListener('singletap', showDatePicker);
    dateFieldMask.addEventListener('click', hideDatePicker);
    
    self.add(dateFieldMask);
    self.add(dateFieldView);
    
    //duration
    var durationView = new picker({
        text: L('duration')
    },{});
    var durationsLabels = ['1 '+L('hour'), '2 '+L('hours'), '4 '+L('hours'), '6 '+L('hours'), '12 '+L('hours'), '18 '+L('hours'), '1 '+L('day'), '2 '+L('days'), '3 '+L('days'), '4 '+L('days'), '5 '+L('days'), '6 '+L('days'), '1 '+L('week'), '2 '+L('weeks')];
    var durations = [3600, 7200, 14400, 21600, 43200, 64800, 86400, 172800, 259200, 345600, 432000, 518400, 604800, 1209600];
    var datas = [];
    var selectedIndex = durations.length - 2;
    for (var i = 0, l = durations.length; i < l; i++) {
        datas[i]=Ti.UI.createPickerRow({title: durationsLabels[i], value: durations[i]});
    }
    durationView.pickerField.add(datas);
    postView.add(durationView);
    durationView.pickerField.setSelectedRow(0, selectedIndex);
    
    //category
    var catView = new picker({
        text: '* '+ L('category')
    },{});
    var cats = Ti.App.Properties.getList('categories') || [];
    var datas = [Ti.UI.createPickerRow({title:L('choose'), value: -1})];
    for(var i = 0, l = cats.length; i < l; i++) {
        datas.push(Ti.UI.createPickerRow({title:utils._L(cats[i]['label']), value: cats[i]['id']}));
    }
    catView.pickerField.add(datas);
    postView.add(catView);
    catView.pickerField.setSelectedRow(0, 0);
    
    /*************************************************/
    /*                   POSITION                    */
    /*************************************************/
    var positionView = new textfield({
        text: L('location')
    },{
        editable: false,
        hintText: L('your_current_position'),
        value: ''
    });
    postView.add(positionView);
    //mapFieldView
    var mapFieldView = Ti.UI.createView({
        layout: 'composite',
        backgroundColor: font.black,
        height: '95%',
        width: '95%',
        zIndex: 10,
        borderWidth: 2,
        borderColor: font.grey,
        visible: false
    });
    //mapFieldMask
    var mapFieldMask = Ti.UI.createView({
        backgroundColor: font.black,
        height: Ti.UI.FILL,
        width: Ti.UI.FILL,
        zIndex: 9,
        opacity: 0.9,
        borderColor: font.grey,
        visible: false
    });
    
    //mapFieldView
    var mapContainerView = Ti.UI.createView({
        layout: 'composite',
        bottom: '56dp',
        top: '40dp',
        left: 2,
        right: 2
    });
    mapFieldView.add(mapContainerView);
    
    //Locate me button
    var locateMeBt = Ti.UI.createButton({
        backgroundImage: '/images/locate.png',
        height: '30dp',
        width: '30dp',
        zIndex: 100
    });
    mapContainerView.add(locateMeBt);
    
    var mapView;
	var regionDefined = {
        latitude: utils.LATITUDE_BASE, 
        longitude: utils.LONGITUDE_BASE,
        latitudeDelta: 0.2, 
        longitudeDelta: 0.2
   };
   utils.getUserLocation(function(e) {
		if (e.error) {
            utils.alert(L('geolocation_error'));
            return;
        } else if (e.success && e.coords) {
    		regionDefined = {
	            latitude: e.coords.latitude, 
		    	longitude: e.coords.longitude, 
		    	latitudeDelta: 0.2, 
		    	longitudeDelta: 0.2
	        };
	    }
	});
    var showMapPicker = function() {
        self.addEventListener('android:back', back);
        mapFieldMask.show();
        mapFieldView.show();
        //hide keyboard on android
        if (Ti.Platform.name === 'android') {
            Ti.UI.Android.hideSoftKeyboard();
        }
        //delete other map in map tab (needed because Android only allow one map at a time)
        Ti.App.fireEvent('map.remove');
        //show map view
        mapView = Ti.Map.createView({
            mapType: Ti.Map.STANDARD_TYPE,
            region: regionDefined,
            animate:false,
            regionFit:true,
            userLocation:true,
            bottom: 0,
            top: 0,
            left: 0,
            right: 0
        });
        mapView.addEventListener('regionChanged', function(e) {
            mapView.mapRegion = e;
        });
        mapContainerView.add(mapView);
    }
    var hideMapPicker = function() {
        mapContainerView.remove(mapView);
        mapView = null;
        mapFieldView.hide();
        mapFieldMask.hide();
        self.removeEventListener('android:back', back);
    }
    //callbacks
    var updateMapField = function(confirm) {
        var region = mapView.mapRegion;
        if (region.longitudeDelta > 0.06 && confirm !== true) {
            var dialog = Ti.UI.createAlertDialog({
                cancel: 1,
                buttonNames: [L('no'), L('ok')],
                title: L('warning_lack_of_precision'),
                message: L('the_defined_position_lacks_of_precision_are_you_sure_you_did_not_want_to_zoom_in_a_bit')
            });
            dialog.addEventListener('click', function(e){
                if (e.index === e.source.cancel){
                    return;
                }
                updateMapField(true);
            });
            dialog.show();
            return;
        }
        positionView.textField.setValue(L('specific_position'));
        regionDefined = {
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: region.latitudeDelta,
            longitudeDelta: region.longitudeDelta
        };
        hideMapPicker();
    }
    
    //Search location
    var mapSearchView = Ti.UI.createView({
        height: '40dp',
        top: 0,
        backgroundColor: font.black,
        width: '100%'
    });
    var mapSearchField = Ti.UI.createTextField({
        height: '40dp',
        top: '0dp',
        left: '0dp',
        right: '40dp',
        hintText: L('search_an_address'),
        backgroundColor: font.white,
        paddingLeft: '3dp'
    });
    var mapSearchBt = Ti.UI.createButton({
        backgroundImage: '/images/validate.png',
        top: '4dp',
        height: '32dp',
        width: '32dp',
        right: '4dp'
    });
    // Execute forward geocode on button click
    mapSearchBt.addEventListener('click', function() {  
        if (mapSearchField.value) {
            query.geocode(mapSearchField.value, function(latLng, latitudeDelta, longitudeDelta) {
                if (latLng === false) {
                    utils.alert(L('unable_to_locate_this_address_please_retry'));
                    return;
                }
                mapView.setLocation({
                    latitude: latLng.lat, 
                    longitude: latLng.lng,
                    latitudeDelta: latitudeDelta,
                    longitudeDelta: longitudeDelta,
                    animate: true,
                    regionFit: true
                });
                mapSearchField.value = '';
            });
        }
    });
    mapSearchView.add(mapSearchField);
    mapSearchView.add(mapSearchBt);
    mapFieldView.add(mapSearchView);
    
    //buttons
    var mapButtonsView = new buttons({
        title: L('cancel'),
        image: utils.img + '/buttons/cancel.png'
    }, hideMapPicker, {
        title: L('define'),
        image: utils.img + '/buttons/validate.png'
    }, updateMapField, {
        top: null,
        bottom: '3dp',
        left: 0,
        right: 0,
        width: '100%'
    });
    mapFieldView.add(mapButtonsView);
    
    //events
    positionView.textField.addEventListener('singletap', showMapPicker);
    mapFieldMask.addEventListener('click', hideMapPicker);
    
    self.add(mapFieldMask);
    self.add(mapFieldView);
    
    /*************************************************/
    /*                     PHOTOS                    */
    /*************************************************/
    
    var photosLabel = Ti.UI.createLabel({
        color: font.white,
        font: font.arial22normal,
        top: '15dp',
        left: '10dp',
        right: '10dp',
        height: 'auto',
        text: L('photos')
    });
    postView.add(photosLabel);
    
    var photosView = Ti.UI.createView({
        layout: 'horizontal',
        backgroundColor: font.grey,
        borderColor: font.grey,
        borderWidth: 0,
        top: '5dp',
        left: '10dp',
        right: '10dp',
        height: Ti.UI.SIZE,
        width: '50dp'
    });
    var photosViewButton = Ti.UI.createButton({
        backgroundImage: '/images/img.png',
        top: '10dp',
        left: '10dp',
        right: '10dp',
        bottom: '10dp',
        height: '30dp',
        width: '30dp'
    });
    photosView.add(photosViewButton);
    
    postView.add(photosView);
    
    //fb indicator
    var fbIndicator = new activity({
      message: L('querying_facebook_in_progress')
    });
    var selectedPhotos = {};
    var fbAlbums = [];
    var getFbAlbums = function () {
        fbIndicator.show();
        //get albums
        Ti.Facebook.requestWithGraphPath('me/albums', {fields: 'privacy,name,cover_photo,count,photos.fields(picture,source)'}, 'GET', function(e) {
            fbIndicator.hide();
            if (!e.success) {
                query.connectionError();
            } else {
                var result = JSON.parse(e.result);
                //get all public albums and create selector
                var albums = result.data;
                for (var i = 0, l = albums.length; i < l; i++) {
                    if (albums[i].privacy == 'everyone' && albums[i].photos && albums[i].photos.data.length) {
                        fbAlbums.push(albums[i]);
                    }
                }
                if (!fbAlbums.length) {
                    utils.alert(L('you_have_no_public_album_to_your_facebook_account_only_public_albums_can_be_used'));
                    return;
                }
                showFbAlbumPicker();
            }
        });
    };
    
    //facebook albums view
    var fbAlbumView = Ti.UI.createView({
        layout: 'composite',
        backgroundColor: font.black,
        height: '95%',
        width: '95%',
        zIndex: 10,
        borderWidth: 2,
        borderColor: font.grey,
        visible: false
    });
    //header
	var fbAlbumViewHead = new header(L('choose_your_photos'), back, {}, {right: '30dp'});
	//Refresh button
	var refreshView = Ti.UI.createView({
        top: '5dp',
        right: '5dp',
        height: '24dp',
        width: '24dp',
        borderWidth: 1,
        borderColor: font.grey,
        backgroundColor: font.white,
        opacity: 0.7,
        zIndex: 2
    });
	var refreshBt = Ti.UI.createButton({
		backgroundImage: '/images/refresh.png',
		top: '2dp',
		left: '2dp',
		height: '20dp',
		width: '20dp'
	});
	refreshBt.addEventListener('click', function() {
		fbAlbums = []; //reset albums
		hideFbAlbumPicker(); // hide picker
		photosView.fireEvent('click'); //show picker
	});
	refreshView.add(refreshBt);
	fbAlbumViewHead.add(refreshView);
	fbAlbumView.add(fbAlbumViewHead);
    
    var fbAlbumMask = Ti.UI.createView({
        backgroundColor: font.black,
        height: Ti.UI.FILL,
        width: Ti.UI.FILL,
        zIndex: 9,
        opacity: 0.9,
        visible: false
    });
    var albumsTableView, albumImgView;
    var showFbAlbumPicker = function() {
        self.addEventListener('android:back', back);
        if (!albumsTableView) {
            var data = [];
            for (var i = 0, li = fbAlbums.length; i < li; i++) {
                var album = fbAlbums[i];
                if (album.cover_photo) {
                    for (var j = 0, lj = album.photos.data.length; j < lj; j++) {
                        if (album.photos.data[j].id == album.cover_photo) {
                            var image = album.photos.data[j].picture;
                        }
                    }
                } else {
                    var image = null;
                }
                data.push({title: album.name, leftImage: image, dataImg: album.photos.data});
            }
            albumsTableView = Ti.UI.createTableView({
                left: 0,
                top: '50dp',
                width: '50%',
                bottom: '56dp',
                data:data
            });
            // create table view event listener
            albumsTableView.addEventListener('click', function(e) {
                var images = e.rowData.dataImg;
                if (albumImgView) {
                    fbAlbumView.remove(albumImgView);
                    albumImgView = null;
                }
                albumImgView = Ti.UI.createScrollView({
                    layout: 'horizontal',
                    contentHeight: 'auto',
                    backgroundColor: font.black,
                    height: Ti.UI.FILL,
                    right: 2,
                    top: '50dp',
                    bottom: '56dp',
                    width: '50%'
                });
                var width = Ti.Platform.displayCaps.platformWidth;
                var size = Math.floor(100 / Math.ceil((0.425 * width) / 130)) + '%';
                
                for (var i = 0, l = images.length; i < l; i++) {
                    var img = Ti.UI.createImageView({
                        imgData: images[i],
                        image: images[i].picture,
                        backgroundColor: font.black,
                        width: size,
                        height: Ti.UI.SIZE,
                        borderWidth: (selectedPhotos[images[i].id] ? 2 : 0),
                        borderColor: (selectedPhotos[images[i].id] ? font.lightgreen : font.black)
                    });
                    img.addEventListener('click', function(e) {
                        if (e.source.getBorderColor() == font.lightgreen) {
                            //unselect
                            e.source.setBorderColor(font.black);
                            e.source.setBorderWidth(0);
                            delete selectedPhotos[e.source.imgData.id];
                        } else {
                            //select
                            var count = 0;
                            for (var i in selectedPhotos) {
                                if (selectedPhotos[i]) {
                                    count++;
                                }
                            }
                            if (count == 5) {
                                utils.alert(L('sorry_maximum_5_pictures_per_wouaf_you_have_reached_the_limit'));
                                return;
                            }
                            e.source.setBorderColor(font.lightgreen);
                            e.source.setBorderWidth(2);
                            var imgData = e.source.imgData;
                            selectedPhotos[imgData.id] = imgData;
                        }
                    });
                    albumImgView.add(img);
                }
                fbAlbumView.add(albumImgView);
            });
            fbAlbumView.add(albumsTableView);
        }
        //hide keyboard on android
        if (Ti.Platform.name === 'android') {
            Ti.UI.Android.hideSoftKeyboard();
        }
        fbAlbumMask.show();
        fbAlbumView.show();
    }
    var hideFbAlbumPicker = function() {
        fbAlbumView.hide();
        fbAlbumMask.hide();
        self.removeEventListener('android:back', back);
    }
    var updatePhotosView = function() {
        var count = 0;
        for (var i in selectedPhotos) {
            if (selectedPhotos[i]) {
                count++;
            }
        }
        var children = photosView.children;
        for (var i = 0, l = children.length; i < l; i++) {
            if (children[i]) {
                photosView.remove(children[i]);
            }
        }
        if (count) {
            photosView.setWidth(Ti.UI.FILL);
            photosView.setBackgroundColor(font.black);
            photosView.setBorderWidth(1);
            var left = Math.floor((100 - (count * 19.5)) / (count + 1)) + '%';
            for (var i in selectedPhotos) {
                photosView.add(Ti.UI.createImageView({
                    image: selectedPhotos[i].picture,
                    backgroundColor: font.black,
                    left: left,
                    width: '19.5%',
                    height: Ti.UI.SIZE,
                }));
            }
        } else {
            photosView.setWidth('50dp');
            photosView.setBackgroundColor(font.grey);
            photosView.setBorderWidth(0);
            photosView.add(photosViewButton);
        }
        hideFbAlbumPicker();
    }
    
    //buttons
    var fbButtonsView = new buttons({
        title: L('cancel'),
        image: utils.img + '/buttons/cancel.png'
    }, hideFbAlbumPicker, {
        title: L('define'),
        image: utils.img + '/buttons/validate.png'
    }, updatePhotosView, {
        top: null,
        bottom: '3dp',
        left: 0,
        right: 0,
        width: '100%'
    });
    fbAlbumView.add(fbButtonsView);
    
    //events
    photosView.addEventListener('click', function() {
        if (!Ti.Facebook.loggedIn) {
            utils.alert(L('you_must_be_logged_in_with_a_facebook_account_to_be_able_to_add_photos_from_your_facebook_album'));
            return;
        }
        if (fbAlbums.length) {
            showFbAlbumPicker();
        } else {
            getFbAlbums();
        }
    });
    fbAlbumMask.addEventListener('click', hideFbAlbumPicker);
    
    self.add(fbAlbumMask);
    self.add(fbAlbumView);
    
    //publish on facebook
    var facebookPost = new switchBt({
        title: L('post_this_wouaf_on_my_facebook_wall'),
        value: (Ti.Facebook.loggedIn && !!Ti.App.Properties.getBool('fbPost')),
        top: '15dp',
        bottom: '5dp',
        enabled: Ti.Facebook.loggedIn
    });
    postView.add(facebookPost);
    
    //allow contact
    var allowContact = new switchBt({
        title: L('allow_other_wouaffers_to_contact_me'),
        value: !!Ti.App.Properties.getBool('allowContact'),
        top: '15dp',
        bottom: '5dp'
    });
    postView.add(allowContact);
    
    //comments alerts
    var postNotifications = new switchBt({
        title: L('get_notified_by_email_for_each_comment'),
        value: !!Ti.App.Properties.getBool('postNotif'),
        top: '15dp',
        bottom: '5dp'
    });
    postView.add(postNotifications);
    
    //reset all form fields
    var reset = function() {
        textView.textArea.value = '';
        countText();
        date = new Date();
        dateView.textField.value = '';
        durationView.pickerField.setSelectedRow(0, (durations.length - 1));
        catView.pickerField.setSelectedRow(0, 0);
        positionView.textField.value = '';
        utils.getUserLocation(function(e) {
			if (e.error) {
	            utils.alert(L('geolocation_error'));
	            return;
	        } else {
	    		regionDefined = {
		            latitude: e.coords.latitude, 
			    	longitude: e.coords.longitude, 
			    	latitudeDelta: 0.2, 
			    	longitudeDelta: 0.2
		        };
		    }
		});
		if (fbAlbumView && albumImgView) {
            fbAlbumView.remove(albumImgView);
            albumImgView = null;
        }
        selectedPhotos = {};
        updatePhotosView();
        facebookPost.setValue(Ti.Facebook.loggedIn && !!Ti.App.Properties.getBool('fbPost'));
        allowContact.setValue(!!Ti.App.Properties.getBool('allowContact'));
        postNotifications.setValue(!!Ti.App.Properties.getBool('postNotif'));
    }
    
    //buttons
    var buttonsView = new buttons({
        title: L('reset'),
        top: '10dp',
        image: utils.img + '/buttons/cancel.png'
    }, function () {
        var dialog = Ti.UI.createAlertDialog({
            cancel: 0,
            buttonNames: [L('cancel'), L('confirm')],
            message: L('do_you_confirm_the_form_reset'),
            title: L('reset')
        });
        dialog.addEventListener('click', function(e){
            if (e.index === e.source.cancel){
                return;
            }
            reset();
        });
        dialog.show();
    },{
        title: L('post'),
        top: '10dp',
        image: utils.img + '/buttons/validate.png'
    }, function () {
        //check mandatory
		if (!textView.textArea.getValue()
			 || catView.pickerField.getSelectedRow(0).value === -1) {
			utils.alert(L('please_enter_all_required_fields'));
			return;
		}
		if (textView.textArea.getValue().length > 300 ) {
			utils.alert(L('your_text_is_too_long'));
			return;
		}
		var dialog = Ti.UI.createAlertDialog({
            cancel: 0,
            buttonNames: [L('cancel'), L('confirm')],
            message: L('do_you_confirm_the_publication_of_this_wouaf'),
            title: L('attention')
        });
        dialog.addEventListener('click', function(e){
            if (e.index === e.source.cancel){
                return;
            }
            var publishIndicator = new activity({
				message: L('publish_in_progress')
			});
			publishIndicator.show();
			
			var pics = [];
			if (selectedPhotos) {
			    for (var i in selectedPhotos) {
			        pics.push({
			            t: selectedPhotos[i].picture, //thumbnail
	                    p: selectedPhotos[i].source, //pic
	                    fid: i //facebook id
			        });
			    }
			}
			
			query.createPost({
				loc: 		(regionDefined.latitude +','+ regionDefined.longitude),
				cat: 		catView.pickerField.getSelectedRow(0).value,
				text: 		textView.textArea.getValue(),
				date: 		Math.round(date.getTime() / 1000),
				duration: 	durationView.pickerField.getSelectedRow(0).value,
				fbpost: 	(Ti.Facebook.loggedIn && facebookPost.value ? 1 : 0),
				contact: 	(allowContact.value ? 1 : 0),
				notif:	 	(postNotifications.value ? 1 : 0),
				pics: 	    JSON.stringify(pics)
			}, function(datas) {
				publishIndicator.hide();
				
				if (datas.result && datas.result == 1) {
					if (datas.today_publications) {
						Ti.App.Properties.setInt('today_publications', datas.today_publications);
						//todays publications messages
						if (Ti.App.Properties.getInt('today_publications') != 0) {
					    	wouafCount.show();
					    	if (Ti.App.Properties.getInt('today_publications') >= 10) {
							    wouafCount.text = L('you_have_reached_the_limit_of_10_wouaf_per_days_you_can_not_publish_anymore_today');
								wouafCount.backgroundColor = font.lightorange;
								wouafCount.color = font.orange;
								if (buttonsView) {
									buttonsView.hide();
								}
						    } else {
						    	if ((10 - Ti.App.Properties.getInt('today_publications')) > 1) {
									wouafCount.text = String.format(L('you_can_still_publish__wouafs_today'), (10 - Ti.App.Properties.getInt('today_publications')));
								} else {
									wouafCount.text = String.format(L('you_can_still_publish__wouaf_today'), (10 - Ti.App.Properties.getInt('today_publications')));
								}
						    }
					    }
					}
					//post on facebook
					if (Ti.Facebook.loggedIn && facebookPost.value) {
						var fbPublishIndicator = new activity({
							message: L('publish_on_facebook_in_progress')
						});
						fbPublishIndicator.show();
						
						var fbfields = {
							'message': 		catView.pickerField.getSelectedRow(0).title + ' : ' + textView.textArea.getValue()+'\n'+ String.format(L('on_for'), utils.formatDate(date, 'long') +' '+ utils.formatTime(date), durationView.pickerField.getSelectedRow(0).title),
							'name': 		L('learn_more_about_this_event'),
							'description': 	L('join_me_on_wouaf_it_the_first_micro_events_network'),
							'link':			utils.WOUAF_SHORT_URL + '/' + datas.id,
							'picture': 		utils.WOUAF_LOGO_URL
						}
						Ti.Facebook.requestWithGraphPath('me/feed/', fbfields, 'POST', function(e) {
				            fbPublishIndicator.hide();
				            reset();
							if (!e.success) {
				                utils.alert(L('your_wouaf_is_successfully_published_but_facebook_publication_failed') + (Ti.App.Properties.getInt('today_publications') >= 10 ? utils.nl + utils.nl + L('you_have_reached_the_limit_of_10_wouaf_per_days_you_can_not_publish_anymore_today') : ''));
				            } else {
				                utils.alert(L('your_wouaf_is_successfully_published') + (Ti.App.Properties.getInt('today_publications') >= 10 ? utils.nl + utils.nl + L('you_have_reached_the_limit_of_10_wouaf_per_days_you_can_not_publish_anymore_today') : ''));
				            }
				        });
					} else {
						reset();
						utils.alert(L('your_wouaf_is_successfully_published') + (Ti.App.Properties.getInt('today_publications') >= 10 ? utils.nl + utils.nl + L('you_have_reached_the_limit_of_10_wouaf_per_days_you_can_not_publish_anymore_today') : ''));
					}
				} else if (datas.msg && datas.msg.length) {
					utils.alert(utils._L(datas.msg[0]));
				} else {
					query.connectionError();
				}
			});
        });
        dialog.show();
    });
    postView.add(buttonsView);
    
    self.add(postView);

    //used to refresh window content on tab change
    self.refresh = function () {
        var logged = !!Ti.App.Properties.getString('uid');
        if (logged) {
           if (!Ti.App.Properties.getBool('rules')) {
                postView.hide();
                loginView.hide();
                //show terms of use
                termsOfUseView.show();
            } else {
                termsOfUseView.hide();
                loginView.hide();
                facebookPost.setEnabled(Ti.Facebook.loggedIn);
                facebookPost.setValue(Ti.Facebook.loggedIn && !!Ti.App.Properties.getBool('fbPost'));
                allowContact.setValue(!!Ti.App.Properties.getBool('allowContact'));
        		postNotifications.setValue(!!Ti.App.Properties.getBool('postNotif'));
                //show post form
                postView.show();
            }
            //todays publications messages
			if (Ti.App.Properties.getInt('today_publications') != 0) {
		    	wouafCount.show();
		    	if (Ti.App.Properties.getInt('today_publications') >= 10) {
				    wouafCount.text = L('you_have_reached_the_limit_of_10_wouaf_per_days_you_can_not_publish_anymore_today');
					wouafCount.backgroundColor = font.lightorange;
					wouafCount.color = font.orange;
					if (buttonsView) {
						buttonsView.hide();
					}
			    } else {
			    	if ((10 - Ti.App.Properties.getInt('today_publications')) > 1) {
						wouafCount.text = String.format(L('you_can_still_publish__wouafs_today'), (10 - Ti.App.Properties.getInt('today_publications')));
					} else {
						wouafCount.text = String.format(L('you_can_still_publish__wouaf_today'), (10 - Ti.App.Properties.getInt('today_publications')));
					}
			    }
		    }
        } else {
            postView.hide();
            termsOfUseView.hide();
            //not loggued : propose it
            loginView.show();
        }
    }
    //used to end window content on tab change
    self.end = function () {
        if (mapFieldView && mapFieldView.getVisible()) {
            hideMapPicker();
        }
    }
    //init on first display
    self.refresh();
    
	return self;
}
module.exports = publish;