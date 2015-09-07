function mapWindow() {
	//require
	var utils = 		require('class/utils');
	var query = 		require('class/query');
	var clustermap = 	require('class/clustermap');
	var map = 			require('ui/components/map');
	var loader = 		require('ui/components/load');
    var notification = 	require('ui/components/notification');
    var bottomButton = 	require('ui/components/bottomButton');
	var font = 			require('ui/components/font');
	var activity = 		require('ui/components/activityIndicator');
	var postsList = 	require('ui/postsList');
	var searchWindow = 	require('ui/search');
	var post = 			require('ui/post');
	
	//instanciate query object
	var query = new query();
	//instanciate loader object
	var loader = new loader();
	
	//create object instance
	var self = Ti.UI.createWindow({
		backgroundColor: font.black,
		navBarHidden: true,
        tabBarHidden: true,
		modal: true,
		fullscreen: false,
		exitOnClose: true
	});
    
	//Search params
	var searchParams = {
		cat: 0,
		tag: [0, ''], //[index, value]
		date: '', //now
		duration: 86400, //24 hours
		radius: Ti.App.Properties.getInt('radius') //km
	};
	
	//set categories values (name/colors)
	var serverCategories = Ti.App.Properties.getList('categories');
	var cats = [L('all')]; // default : all
	if (serverCategories) {
		for(var i = 0, l = serverCategories.length; i < l; i++) {
			cats.push(utils._L(serverCategories[i]['label']));
		}
	}
	var tags = [L('every')];
	//back button
	var animate = false;
	var back = function(e){
		if (animate) {
			return;
		}
		if (timeView.getVisible()) {
            timeView.fireEvent('hide');
            return;
        }
        if (searchView.getVisible()) {
            searchView.fireEvent('hide');
            return;
        }
		if (self.currentPost) {
			Ti.App.fireEvent('map.post.close');
			return;
		} else if (self.currentList) {
			Ti.App.fireEvent('map.list.close');
			return;
		}
		self.removeEventListener('android:back', back);
	}
	/*************************************************/
	/*                MAP & MAP EVENTS               */
	/*************************************************/
	
	//create map view
	var mapview;
	var hcmap;
    var jsonResults;
    
	var createMap = function () {
		// Make sure we only add the map once
		if (mapview !== undefined && mapview !== null) {
			return;	
		}
		mapview = new map();
		mapview.updatePins = function (json) {
			if (!mapview) {
			    return;
			}
			var addResults = false;
            var resultsType = json.resultsType ? json.resultsType : 'unknown';
            if (!json.results) {
			    json.results = [];
                json.count = 0;
			} else {
				//if search Id match, add results
				if (jsonResults && jsonResults.searchId && json.searchId && jsonResults.searchId == json.searchId) {
					addResults = json.count;
					json.count += jsonResults.count;
					json.results = json.results.concat(jsonResults.results);
				} else if (jsonResults && jsonResults.searchId && json.searchId && jsonResults.searchId > json.searchId) {
					//drop old results
					return;
				}
			}
			mapview.startLayout();
			//remove all previous pins if any
			if (hcmap) {
				hcmap.reset();
			}
			//close annotations & post
			Ti.App.fireEvent('map.list.close', {});
			//Ti.App.fireEvent('map.post.close', {});               
			
			//save result
			jsonResults = json;
			// Add all pins
			hcmap = new clustermap.HCMap ({'map': mapview , 'elements': json.results}) ;
			
			//get new tags
			tags = hcmap.getTags();
			if (searchParams.tag[0] != 0) {
				//update selected tag index
				for (var i = 0, l = tags.length; i < l; i++) {
					if (tags[i].substr(1, tags[i].length) == searchParams.tag[1]) {
						searchParams.tag = [i, tags[i].substr(1, tags[i].length)];
						break;
					}	
				}
			}
			//show tag button if tags are returned, else hide it
			if (tags.length > 1) {
                bottomViewContainer.startLayout();
                tagBBt.show();
                locateBBt.resize(4);
                timeBBt.resize(4);
                catBBt.resize(4);
                bottomViewContainer.finishLayout();
			} else {
			    bottomViewContainer.startLayout();
                tagBBt.hide();
                locateBBt.resize(3);
                timeBBt.resize(3);
                catBBt.resize(3);
                bottomViewContainer.finishLayout();
			}
			//show results number
			var countResults = addResults ? addResults : json.count;
			var notificationLabel = '';
            if (resultsType == 'wouafit') {
			    if (countResults == 500) {
                    notificationLabel = String.format(L('_wouaf_maximum_reached'), countResults);
                } else {
                    if (countResults > 1) {
						notificationLabel = String.format(L('_wouafs'), countResults);
					} else {
						notificationLabel = String.format(L('_wouaf'), countResults);
					}
                }
			} else {
			    //notificationLabel = String.format(L('_events_from_eventful'), countResults);
			}
			if (countResults <= 1) {
                new notification(String.format(L('_displayed'), notificationLabel));
			} else  {
			    new notification(String.format(L('_displayeds'), notificationLabel));
			}
			mapview.finishLayout();
		}
		// Handle all map annotation clicks
		mapview.addEventListener('click', function(e) {
			//remove back button handler
			self.removeEventListener('android:back', back);
			if (e.annotation) {
				if (e.clicksource == 'pin' && self.currentList == e.annotation) {
					Ti.App.fireEvent('map.list.close', e);
				} else {
					mapview.deselectAnnotation(e.annotation);
					if (e.annotation.elements.length == 1) {
                        Ti.App.fireEvent('map.post.show', hcmap._elements[e.annotation.elements[0]]);
					} else {
					    Ti.App.fireEvent('map.list.show', e);
					}
				}
			}
		});
		self.add(mapview);
		
		//check for user intent
        var firstQueryLaunched = false;
        if (Ti.Platform.osname === 'android') {
			var intent = Ti.Android.currentActivity.getIntent();
			//check if launch came from a link
			if (intent.action == "android.intent.action.VIEW" && intent.data && /\/[0-9a-f]{24}/.test(intent.data)) {
				var id = intent.data.match(/\/([0-9a-f]{24})/)[1];
				//query server to get wouaf infos from url in intent.data
				//then center map on it and show it 
				//and then launch first query to get other wouaf arround it
				if (id) {
					var wouafLoadIndicator = new activity({
		                message: L('loading')
		            });
		            wouafLoadIndicator.show();
					query.post(id, function (datas) {
						wouafLoadIndicator.hide();
						if (datas.wouaf && datas.wouaf.id) {
                            //set map location
                            mapview.setLocation({
						    	latitude: datas.wouaf.loc[0], 
						    	longitude: datas.wouaf.loc[1], 
						    	animate:true,
						    	latitudeDelta:0.04, 
						    	longitudeDelta:0.04
						    });
						    //open wouaf
                            Ti.App.fireEvent('map.post.show', datas.wouaf);
                            self.addEventListener('android:back', back);
                            //launch search on location
	                        searchParams['loc'] = ((Math.round(parseFloat(datas.wouaf.loc[0]) * 10000) / 10000)+','+(Math.round(parseFloat(datas.wouaf.loc[1]) * 10000) / 10000));
							Ti.App.fireEvent('search.posts', searchParams);
							firstQueryLaunched = true;
                        } else if (datas.msg && datas.msg.length) {
                            utils.alert(utils._L(datas.msg[0]));
                        } else if (datas.code && datas.code == 200) {
                        	utils.alert(L('sorry_this_wouaf_does_not_exists'));
                        } else {
                            query.connectionError();
                        }
					});
				}
			}
		}
		//utils.alert(Ti.Platform.displayCaps.platformWidth+'px / '+Ti.Platform.displayCaps.platformHeight+'px - '+Ti.Platform.displayCaps.getDpi()+' - '+Ti.Platform.displayCaps.getDensity());
		if (!firstQueryLaunched) {
			//launch first query on current position
			refreshBt.fireEvent('click', {});
		}
	}
	
	var listView;
	var listHalfScreen = Ti.App.Properties.getDouble('screenSize') > 5 ? true : false;
	//show map annotation from button
	Ti.App.addEventListener('map.list.show', function(e) {
		self.currentList = e.annotation;
		var showListPosts = function (elements, hcmap) {
			if (listView.left !== 0 ) {
	        	animate = true;
	        	listView.animate({
	                left: 0,
	                duration: 500,
	            }, function() {
	                animate = false;
	                Ti.App.fireEvent('map.resize');
	                listView.showPosts(elements, hcmap._elements);
	            });
			} else {
				listView.showPosts(elements, hcmap._elements);
			}
        }
        if (!listView) {
			listView = new postsList({
				width: (listHalfScreen ? '50%' : '100%'),
				height : Ti.UI.FILL,
				top: 0,
				left: (listHalfScreen ? '-50%' : '-100%'),
				bottom: '0dp',
				zIndex: 30
			},{
				closeList: 'map.list.close',
				closePost: 	'map.post.close',
				showPost: 	'map.post.show',
				removePost: 'map.post.remove'
			});
			self.add(listView);
			
			listView.addEventListener('postlayout', function() {
	            if (!listView.animated) {
	                showListPosts(e.annotation.elements, hcmap);
	            }
	            listView.animated = true;
	        });
		} else {
			showListPosts(e.annotation.elements, hcmap);
		}
		self.addEventListener('android:back', back);
	});
	
	//close map annotation from button
	Ti.App.addEventListener('map.list.close', function() {
		//remove back button handler
		self.removeEventListener('android:back', back);
		if (self.currentList) {
			mapview.deselectAnnotation(self.currentList);
			self.currentList = null;
			
			Ti.App.fireEvent('map.resize');
			animate = true;
			listView.animate({
                left: (listHalfScreen ? '-50%' : '-100%'),
                duration: 500,
            }, function() {
                animate = false;
                listView.clean();
            });
		}
	});
	
	var postView;
	//show post detailled view
	Ti.App.addEventListener('map.post.show', function(datas) {
		self.currentPost = datas;
		var showPostView = function (datas) {
			if (postView.right !== 0 ) {
	        	animate = true;
	        	postView.animate({
	                right: 0,
	                duration: 500,
	            }, function() {
	                animate = false;
	                Ti.App.fireEvent('map.resize');
	                postView.show(datas);
	            });
			} else {
				postView.show(datas);
			}
        }
        if (!postView) {
			postView = new post({
				width: (listHalfScreen ? '50%' : '100%'),
				height : Ti.UI.FILL,
				top: 0,
				right: (listHalfScreen ? '-50%' : '-100%'),
				bottom: '0dp',
				zIndex: 31
			},{
				closeList: 'map.list.close',
				closePost: 	'map.post.close',
				showPost: 	'map.post.show',
				removePost: 'map.post.remove'
			});
			self.add(postView);
			
			postView.addEventListener('postlayout', function() {
	            if (!postView.animated) {
	                showPostView(datas);
	            }
	            postView.animated = true;
	        });
		} else {
			showPostView(datas);
		}
		self.addEventListener('android:back', back);
	});
	//close post detailled view
	Ti.App.addEventListener('map.post.close', function() {
		//remove back button handler
		self.removeEventListener('android:back', back);
		if (self.currentPost) {
			self.currentPost = null;
			
			Ti.App.fireEvent('map.resize');
            animate = true;
			postView.animate({
                right: (listHalfScreen ? '-50%' : '-100%'),
                duration: 500,
            }, function() {
                animate = false;
                postView.clean();
            });
		}
		//hide keyboard on android
        if (Ti.Platform.name === 'android') {
            Ti.UI.Android.hideSoftKeyboard();
        }
	});
	
	//resize map to cover visible space
	Ti.App.addEventListener('map.resize', function() {
		if (listHalfScreen) {
            mapview.startLayout();
            bottomView.startLayout();
            if (self.currentPost && self.currentList) {
            	//nothing ...
            } else if (self.currentList) {
            	mapview.setLeft('50%');
                mapview.setWidth('50%');
                bottomView.setLeft('50%');
                bottomView.setWidth('50%');
                refreshView.setLeft(Math.round((Ti.Platform.displayCaps.platformWidth / 2) + (5 * Ti.Platform.displayCaps.logicalDensityFactor)));
                locateMeView.setRight('5dp');
                searchView.setLeft('50%');
                searchView.setWidth('50%');
                timeView.setLeft('50%');
                timeView.setWidth('50%');
            } else if (self.currentPost) {
            	mapview.setLeft(0);
	            mapview.setWidth('50%');
	            bottomView.setLeft(0);
                bottomView.setWidth('50%');
	            refreshView.setLeft('5dp');
	            locateMeView.setRight(Math.round((Ti.Platform.displayCaps.platformWidth / 2) + (5 * Ti.Platform.displayCaps.logicalDensityFactor)));
	            searchView.setLeft(0);
                searchView.setWidth('50%');
                timeView.setLeft(0);
                timeView.setWidth('50%');
	        } else {
            	mapview.setLeft(0);
	            mapview.setWidth('100%');
	            bottomView.setLeft(0);
                bottomView.setWidth('100%');
	            refreshView.setLeft('5dp');
	            locateMeView.setRight('5dp');
	            searchView.setLeft(0);
                searchView.setWidth('100%');
                timeView.setLeft(0);
                timeView.setWidth('100%');
	        }
	        mapview.finishLayout();
            bottomView.finishLayout();
        }
	});
	
	//Launch search to update map
	Ti.App.addEventListener('search.posts', function(e) {
		//update global search params
		if (!e.appendParams) {
			searchParams = e;
		} else {
			for (var i in e) {
				if (i != 'appendParams') {
				    searchParams[i] = e[i];
				}
			}
			e = searchParams;
		}
		//update tag button
		if (searchParams.tag[1] != '') {
			tagBBt.setTitle('#'+ searchParams.tag[1]);
		} else {
			tagBBt.setTitle(L('tags'));
		}
		//update cat button
		if (searchParams.cat) {
			catBBt.setImage(utils.img + '/maps/cat/'+ searchParams.cat +'.png');
		} else {
			catBBt.setImage(utils.img + '/bottomButton/what.png');
		}
		//update when button
		if (searchParams.date && Math.abs(searchParams.date.getTime() - (new Date()).getTime()) > 1800000) {
            if (Ti.Platform.osname != 'mobileweb') {
				timeBBt.setFont(font.arial16normal);
			}
            timeBBt.setTitle(utils.formatDate(searchParams.date, 'short'));
		} else {
		    if (Ti.Platform.osname != 'mobileweb') {
				timeBBt.setFont(font.arial18normal);
			}
		    timeBBt.setTitle(L('today'));
		}
		var now = new Date();
		e.searchId = now.getTime();
		query.posts(e, mapview.updatePins);
	});
	Ti.App.addEventListener('map.post.remove', function(e) {
	    if (!e.post || !jsonResults || !jsonResults.results) {
	        return;
	    }
	    var found = false;
	    for (var i = 0, l = jsonResults.results.length; (i < l && !found); i++) {
	        if (jsonResults.results[i].id == e.post) {
	            jsonResults.results.splice(i, 1);
	            jsonResults.count--;
	            found = true;
	        }
	    }
	    var now = new Date();
		jsonResults.searchId = now.getTime();
		mapview.updatePins(jsonResults);
    });
	
	//Add event to allow map remove
	Ti.App.addEventListener('map.remove', function() {
		if (mapview) {
			self.remove(mapview);
			mapview = null;
		}
	});
	
	// add map after window opens
	self.addEventListener('open', createMap);
	
	//on window refresh, check if mapview still exists
	var helpShown = false;
	self.refresh = function () {
		createMap();
		//update radius in case default change
		searchParams.radius = Ti.App.Properties.getInt('radius');
		
        //show help page on first launch
        if (!helpShown && Ti.App.Properties.getInt('launchCount') == 1) {
            helpShown = true;
            //show help page
            var helpWindow = require('ui/help-search');
            new helpWindow(true).open();
        }
	}
	
	/*************************************************/
	/*              INTERFACE CONTROLS               */
	/*************************************************/
	
	//Locate me button
	var locateMeView = Ti.UI.createView({
        top: '5dp',
        right: '5dp',
        height: (listHalfScreen ? '36dp' : '24dp'),
        width: (listHalfScreen ? '36dp' : '24dp'),
        borderWidth: 1,
        borderColor: font.grey,
        backgroundColor: font.white,
        opacity: 0.7,
        zIndex: 2
    });
    var locateMeBt = Ti.UI.createButton({
		backgroundImage: '/images/locate.png',
		top: '2dp',
		left: '2dp',
		height: (listHalfScreen ? '30dp' : '20dp'),
		width: (listHalfScreen ? '30dp' : '20dp')
	});
	locateMeBt.addEventListener('click', function() {	
		//center map on user
		new notification(L('center_map'));
        utils.getUserLocation(function(e) {
			if (e.error) {
	            utils.alert(L('geolocation_error'));
	        } else {
	    		mapview.setLocation({
			    	latitude: e.coords.latitude, 
			    	longitude: e.coords.longitude, 
			    	animate:true,
			    	latitudeDelta:0.04, 
			    	longitudeDelta:0.04
			    });
		    }
		});
	});
	locateMeView.add(locateMeBt);
	self.add(locateMeView);
	
	//Refresh button
	var refreshView = Ti.UI.createView({
        top: (Ti.Platform.osname != 'mobileweb' ? '5dp' : '230dp'),
        left: '5dp',
        height: (listHalfScreen ? '36dp' : '24dp'),
        width: (listHalfScreen ? '36dp' : '24dp'),
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
		height: (listHalfScreen ? '30dp' : '20dp'),
		width: (listHalfScreen ? '30dp' : '20dp')
	});
	refreshBt.addEventListener('click', function() {	
		//center map on user
		if (Ti.App.Properties.getString('unit') == 'km') {
			new notification(String.format(L('wouaf_update_arround__km'), (searchParams['radius'] ? searchParams['radius'] : Ti.App.Properties.getInt('radius'))));
		} else {
			var km2Miles = {10: 5, 20 : 10, 30 : 15, 50 : 30, 70 : 45, 100 : 60, 150 : 90, 200 : 120, 300 : 180};
			new notification(String.format(L('wouaf_update_arround__miles'), (searchParams['radius'] ? km2Miles[searchParams['radius']] : km2Miles[Ti.App.Properties.getInt('radius')])));
		}
		if (!mapview.mapRegion || !mapview.mapRegion.latitude) {
			mapview.mapRegion = mapview.getRegion();
		}
		latLng = new utils.LatLng(mapview.mapRegion.latitude, mapview.mapRegion.longitude);
		searchParams['loc'] = (latLng.lat+','+latLng.lng);
		
		Ti.App.fireEvent('search.posts', searchParams);
	});
	refreshView.add(refreshBt);
	self.add(refreshView);
	
	//Search location
	var searchView = Ti.UI.createView({
		height: '40dp',
		bottom: '50dp',
		backgroundColor: font.black,
		width: '100%',
		visible: false,
		opacity: 0.9,
        zIndex: 20
	});
	searchView.addEventListener('show', function() {
    	if (!searchView.getVisible()) {
            locateBBt.setActive(true);
			searchView.show();
			searchField.focus();
            //handle back button
            self.addEventListener('android:back', back);
        }
    });
    searchView.addEventListener('hide', function() {
    	if (searchView.getVisible()) {
            searchField.blur();
			searchView.hide();
			locateBBt.setActive(false);
            //remove back button event
            self.removeEventListener('android:back', back);
        }
    });
	var searchField = Ti.UI.createTextField({
		height: '40dp',
		top: '0dp',
		left: '0dp',
		right: '40dp',
		hintText: L('enter_an_address'),
		backgroundColor: font.white,
		paddingLeft: '3dp'
	});
	var searchBt = Ti.UI.createButton({
		backgroundImage: '/images/validate.png',
		top: '4dp',
		height: '32dp',
        width: '32dp',
        right: '4dp'
	});
	// Execute forward geocode on button click
	searchBt.addEventListener('click', function() {	
		searchView.fireEvent('hide');
		if (searchField.value) {
			query.geocode(searchField.value, function(latLng, latitudeDelta, longitudeDelta) {
				if (latLng === false) {
					utils.alert(L('unable_to_locate_this_address_please_retry'));
					searchView.fireEvent('show');
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
			});
		}
	});
	searchView.add(searchField);
	searchView.add(searchBt);
	self.add(searchView);
	
    // time slider view
    var timeView = Ti.UI.createView({
        height: '140dp',
        bottom: '50dp',
        backgroundColor: font.black,
        width: '100%',
        visible: false,
        opacity: 0.9,
        zIndex: 20
    });
    timeView.addEventListener('show', function() {
    	if (!timeView.getVisible()) {
            timeBBt.setActive(true);
            timeView.show();
            //handle back button
            self.addEventListener('android:back', back);
        }
    });
    timeView.addEventListener('hide', function() {
    	if (timeView.getVisible()) {
            timeView.hide();
            timeBBt.setActive(false);
            //remove back button event
            self.removeEventListener('android:back', back);
        }
    });
    var timeLabel = Ti.UI.createLabel({
        top: '0dp',
        color: font.white,
        font: font.arial22normal,
        left: '10dp',
        height: 'auto',
        text: L('starting_today')
    });
    var timeSlider = Ti.UI.createSlider({
        bottom: '80dp',
        min: 0,
        max: 30,
        left: '10dp',
        right: '45dp',
        value: 0
    });
    var searchDate = new Date();
    var now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    timeSlider.addEventListener('change', function(e) {
        var value = Math.floor(e.value);
        if (value) {
            searchDate.setTime(now.getTime() + (value * 86400000));
            timeLabel.text = String.format(L('starting_'), L(days[searchDate.getDay()])+' '+utils.formatDate(searchDate, 'long'));
        } else {
            searchDate = new Date();
            timeLabel.text = L('starting_today');
        }
    });
    var timeBt = Ti.UI.createButton({
        backgroundImage: '/images/validate.png',
        top: '30dp',
        height: '32dp',
        width: '32dp',
        right: '4dp'
    });
    var durationLabel = Ti.UI.createLabel({
        top: '70dp',
        color: font.white,
        font: font.arial22normal,
        left: '10dp',
        height: 'auto',
        text: String.format(L('during_'), '1 '+ L('day'))
    });
    var durationSlider = Ti.UI.createSlider({
        bottom: '10dp',
        min: 0,
        max: 9,
        left: '10dp',
        right: '45dp',
        value: 0
    });
    var searchDuration = 86400;
    var daysLabel = L('days');
    var weeksLabel = L('weeks');
    var daysDurations = {
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
    durationSlider.addEventListener('change', function(e) {
        var value = Math.floor(e.value);
        if (value) {
            var c = 0;
            for (var i in daysDurations) {
                if (c == value) {
                    searchDuration = i;
                    durationLabel.text = String.format(L('during_'), daysDurations[i]);
                }
                c++;
            }
        } else {
            searchDuration = 86400;
            durationLabel.text = String.format(L('during_'), '1 '+ L('day'));
        }
    });
    // Execute search on queried date
    timeBt.addEventListener('click', function() {   
        timeView.fireEvent('hide');
        searchParams['date'] = searchDate;
        searchParams['duration'] = searchDuration;
        Ti.App.fireEvent('search.posts', searchParams);
    });
    timeView.add(timeLabel);
    timeView.add(timeSlider);
    timeView.add(timeBt);
    timeView.add(durationLabel);
    timeView.add(durationSlider);
    
    self.add(timeView);
    
	//Bottom buttons bar
	var bottomView = Ti.UI.createView({
		height: '50dp',
		bottom: 0,
		layout: 'composite'
	});
	//Bottom buttons bar
	var bottomViewContainer = Ti.UI.createView({
		height: '50dp',
		left: 0,
		right: '50dp',
		layout: 'horizontal'
	});
	//locate button (show/hide location search view)
	var locateBBt = new bottomButton('where', function(e) {
		timeView.fireEvent('hide');
        if (searchView.getVisible()) {
			searchView.fireEvent('hide');
		} else {
			searchView.fireEvent('show');
		}
	}, 3);
	bottomViewContainer.add(locateBBt);
	//time button (show/hide time slider)
    var timeBBt = new bottomButton('when', function(e) {
        searchView.fireEvent('hide');
        if (timeView.getVisible()) {
            timeView.fireEvent('hide');
        } else {
            timeView.fireEvent('show');
        }
    }, 3);
    timeBBt.setTitle(L('today'));
    bottomViewContainer.add(timeBBt);
    
	//Select category
	var catBBt = new bottomButton('what', function(e){
		var opts = {
		  options: cats,
		  selectedIndex: searchParams.cat,
		  destructive: searchParams.cat,
		  title: L('categories')
		};
		var dialog = Ti.UI.createOptionDialog(opts);
		dialog.addEventListener('click', function(e) {
			if (e.index >= 0 && searchParams.cat != e.index) {
				searchParams.cat = e.index;
				//reset tag
				searchParams.tag = [0, '']; 
				//launch search
				Ti.App.fireEvent('search.posts', searchParams);
			}
		});
		dialog.show();
	}, 3);
	bottomViewContainer.add(catBBt)
	//Select tag
	var tagBBt = new bottomButton('tags', function(e){
		var opts = {
		  options: tags,
		  selectedIndex: searchParams.tag[0],
		  destructive: searchParams.tag[0],
		  title: L('tags')
		};
		var dialog = Ti.UI.createOptionDialog(opts);
		dialog.addEventListener('click', function(e) {
			if (e.index >= 0) {
				var _tag;
				if (e.index > 0) {
					_tag = opts.options[e.index];
					_tag = [e.index, _tag.substr(1, _tag.length)];
				} else {
					_tag = [0, ''];
				}
				if (_tag != searchParams.tag) {
					searchParams.tag = _tag;
					//reset cat
					searchParams.cat = 0;
					//launch search
					Ti.App.fireEvent('search.posts', searchParams);
				}
			}
		});
		dialog.show();
	}, 4);
	tagBBt.hide();
	bottomViewContainer.add(tagBBt);
	bottomView.add(bottomViewContainer);
	
	//Search
	var searchBBt = Ti.UI.createButton({
        height: '50dp',
        width: '50dp',
        right: 0,
        borderRadius: 0,
        backgroundImage: '/images/bottomSearch.png',
        backgroundSelectedImage: '/images/bottomSearch-on.png'
    });
    searchBBt.addEventListener('click', function(e) {
		var search = new searchWindow(mapview, cats, searchParams);
		search.open();
	});
    
	bottomView.add(searchBBt);
	//add bottom view
	self.add(bottomView);
	//add loader
	self.add(loader.getView());
	//show/hide loader on queries
	Ti.App.addEventListener('query.start', function() {
	   loader.show();
	});
	Ti.App.addEventListener('query.stop', function() {
	   loader.hide();
	});
	
	//used to end window content on tab change
    self.end = function () {
        //Ti.App.fireEvent('map.post.close');
    }
    
	return self;
};

module.exports = mapWindow;
