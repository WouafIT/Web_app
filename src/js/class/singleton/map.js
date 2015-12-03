module.exports = (function () {
	var clustermap = require('../../../libs/clustermap/clustermap.js');
	//i18n
	var i18n = require('./i18n.js');
	//Query
	var query = require('../query.js')();
	//Data
	var data = require('./data.js');
	var map;
	var userLocation;
	var hcmap;
	var jsonResults;
	var $document = $(document);
	var userMarker = null;

	var updatePins = function (json) {
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

		//remove all previous pins if any
		if (hcmap) {
			hcmap.reset();
		}

		//save result
		jsonResults = json;

		var elements = [];
		var categories = data.get('categories');
		//TODO set thoses colors in the categories database
		var colors = {
			1: '#3030BB',
			2: '#A52C2C',
			3: '#12A7A7',
			4: '#7AEE41',
			5: '#BA1CB1',
			6: '#BF8622',
			7: '#CA3737',
			8: '#CAC537'
		}
		for (var i = 0, l = json.results.length; i < l; i++) {
			var post = json.results[i];
			var element = {
				'label': post.id,
				'description': post.text,
				'cat': post.cat,
				'coordinates': {'lat': parseFloat(post.loc[0]), 'lng': parseFloat(post.loc[1])},
				'color': colors[post.cat]
			};
			elements.push(element);
		}
		// Add all pins
		hcmap = new clustermap.HCMap({'map': map, 'elements': elements});

		//show results number
		var toast = require('./toast.js');
		var countResults = addResults ? addResults : json.count;
		var notificationLabel = '';
		if (resultsType == 'wouafit') {
			notificationLabel = i18n.t('__count__ Wouaf', { count: countResults });
		}
		if (countResults == 500) {
			toast.show(i18n.t('__max__ displayed (maximum reached)', {max: notificationLabel }));
		} else {
			toast.show(i18n.t('__wouaf__ displayed', { count: countResults, wouaf: notificationLabel }));
		}
	}
	//add event to launch a new search
	$document.on('app.search', function (event, params) {
		params = params || {};
		params.searchId = (new Date()).getTime();
		if (!params.loc) {
			params.loc = map.getCenter();
		}
		console.info(params);
		query.posts(params, updatePins);
	});

	var init = function () {
		map = new google.maps.Map(document.getElementById('map'), {
			zoom: 9,
			panControl: false,
			streetViewControl: false,
			mapTypeControl: true,
			mapTypeControlOptions: {
				position: google.maps.ControlPosition.TOP_RIGHT
			},
			zoomControl: true,
			zoomControlOptions: {
				position: google.maps.ControlPosition.LEFT_BOTTOM
			},
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});

		//Custom marker for user position
		function locationMarker(latlng) {
			this.latlng = latlng;
			this.setMap(map);
		}

		locationMarker.prototype = new google.maps.OverlayView();
		locationMarker.prototype.draw = function (latlng) {
			if (latlng) {
				this.latlng = latlng
			}
			console.info(this);
			var div = this._div;
			if (!div) {
				var panes = this.getPanes();
				if (!panes) {
					return;
				}
				div = this._div = document.createElement('div');
				div.className = 'pulseMarker';
				panes.overlayImage.appendChild(div);
			}
			var point = this.getProjection().fromLatLngToDivPixel(this.latlng);
			if (point) {
				div.style.left = (point.x + 5) + 'px';
				div.style.top = (point.y - 17) + 'px';
			}
		};
		locationMarker.prototype.remove = function () {
			if (this._div) {
				this._div.parentNode.removeChild(this._div);
				this._div = null;
			}
		};
		var updateCurrentLocation = function (position) {
			userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			if (!userMarker) {
				map.setCenter(userLocation);
				//show user location
				userMarker = new locationMarker(userLocation);
				//search posts from current location
				$document.triggerHandler('app.search');
				//watch for location update
				navigator.geolocation.watchPosition(updateCurrentLocation, handleNoGeolocation, {
					enableHighAccuracy: true,
					maximumAge: 30000,
					timeout: 27000
				});
			} else {
				//update user location
				userMarker.draw(userLocation);
			}
		}
		var handleNoGeolocation = function (error) {
			if (error.code == 3 && userMarker) {
				//Timeout on high accuracy => skip
				return;
			}
			console.error('No geolocation available', error.code + ': ' + error.message, error);
			//TODO: get the last position chosen by cookie or user account
			// 		or ask user for position
			//		or do a geo detection by IP (country / city / ...) => http://dev.maxmind.com/geoip/geoip2/geolite2/
			/*
			 if (errorFlag === true) {
			 alert("Geolocation service failed.");
			 userLocation = newyork;
			 } else {
			 alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
			 userLocation = siberia;
			 }
			 map.setCenter(userLocation);*/
		}

		var askForGeolocation = function () {
			//show message page
			var messageWindow = require('./window.js');
			messageWindow.show({
				title: 	i18n.t('Location request'),
				text: 	i18n.t('Location request details'),
				close: function () {
					navigator.geolocation.getCurrentPosition(updateCurrentLocation, handleNoGeolocation);
				}
			});
		}

		if (navigator.permissions) {
			navigator.permissions.query({name: 'geolocation'}).then(function (permissionStatus) {
				console.log('geolocation permission status is ', permissionStatus.state);
				if (permissionStatus.state === 'granted') {
					//navigator.geolocation.getCurrentPosition(updateCurrentLocation, handleNoGeolocation);
					askForGeolocation();
				} else if (permissionStatus.state === 'prompt') {
					//show window to ask for permission
					askForGeolocation();
				} else {
					handleNoGeolocation({code: 999, message: 'Permission denied'});
				}
			});
		} else if (navigator.geolocation) {
			//TODO : check for geolocalisation cookie
			askForGeolocation();
		} else {
			handleNoGeolocation({code: 999, message: 'Browser does not handle geolocation'});
		}
	}


	// API/data for end-user
	return {
		init: init
	}
})();