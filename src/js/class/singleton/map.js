module.exports = (function () {
	var clustermap = require('../../../libs/clustermap/clustermap.js');
	var i18n = require('./i18n.js');
	var query = require('../query.js')();
	var data = require('./data.js');
	var toast = require('./toast.js');
	var $document = $(document);
	var map;
	var userLocation;
	var hcmap;
	var jsonResults;
	var userMarker;
	//set map pins on search response
	var setPins = function (json) {
		console.info(json);
		var addResults = false;
		var resultsType = json.resultsType ? json.resultsType : 'unknown';
		var elements = [];
		var categories = data.getObject('categories');
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
		if (!json.results) {
			json.results = [];
			json.count = 0;
		} else {
			//if search Id match, add results
			if (jsonResults && jsonResults.searchId && json.searchId && jsonResults.searchId == json.searchId) {
				addResults = json.count;
				json.count += jsonResults.count;
				json.results = json.results.concat(jsonResults.results);
			} else {
				if (jsonResults && jsonResults.searchId && json.searchId && jsonResults.searchId > json.searchId) {
					//drop old results
					return;
				}
			}
		}
		//remove all previous pins if any
		if (hcmap) {
			hcmap.reset();
		}
		//save result
		jsonResults = json;
		//create pins data
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
	//Event to launch a new search
	$document.on('app.search', function (event, params) {
		params = params || {};
		params.searchId = (new Date()).getTime();
		if (!params.loc) {
			params.loc = map.getCenter();
		}
		console.info(params);
		query.posts(params, setPins);
	});
	//Custom marker for user location
	function locationMarker(latlng) {
		this.latlng = latlng;
		this.setMap(map);
	}
	locationMarker.prototype = new google.maps.OverlayView();
	locationMarker.prototype.draw = function (latlng) {
		if (latlng) {
			this.latlng = latlng
		}
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
	//set user current location
	var setUserLocation = function (position) {
		data.setBool('userGeolocation', true);
		userLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		if (!userMarker) {
			//show map
			showMap(userLocation);
			//show user location
			userMarker = new locationMarker(userLocation);
			//watch for location update
			navigator.geolocation.watchPosition(setUserLocation, handleNoGeolocation, {
				enableHighAccuracy: true,
				maximumAge: 30000,
				timeout: 27000
			});
		} else {
			//update user location
			userMarker.draw(userLocation);
		}
	}
	//no geolocation
	var handleNoGeolocation = function (error) {
		if (error.code == 3 && userMarker) {
			//Timeout on high accuracy => skip
			return;
		}
		console.info('No geolocation available, code '+ error.code +': '+ error.message);
		var lastLocation = data.getObject('position');
		if (lastLocation) {
			showMap(new google.maps.LatLng(lastLocation.lat, lastLocation.lng));
		}
		if (i18n.t('languageShort') == 'fr') {
			//center of france
			showMap(new google.maps.LatLng(46.427066, 2.430535));
			return;
		}
		//center of us
		showMap(new google.maps.LatLng(39.857973, -98.008955));
	}
	//ask user for his location
	var askForGeolocation = function () {
		//show message page
		var messageWindow = require('./window.js');
		messageWindow.show({
			title: i18n.t('Location request'),
			text: i18n.t('Location_request_details'),
			close: function () {
				navigator.geolocation.getCurrentPosition(setUserLocation, handleNoGeolocation);
			}
		});
	}
	//show map on user location, remove splash, launch search
	var showMap = function (location) {
		data.setObject('position', location.toJSON());
		//set map center
		map.setCenter(location);
		//search posts from current location
		$document.triggerHandler('app.search');
		//hide splash
		$('#splash').fadeOut('fast');
	}
	var updateMapPosition = function() {
		var center = map.getCenter();
		data.setObject('position', center.toJSON());
		//check distance between current center and last search
		if (jsonResults.query) {
			var distance = Math.round(google.maps.geometry.spherical.computeDistanceBetween(center,
																							new google.maps.LatLng(jsonResults.query.loc.$near[0], jsonResults.query.loc.$near[1])));
			if (distance >= jsonResults.query.loc.$maxDistance * 72600) {//72600 => 110 * 1000 * 0.66
				//distance is more than 66% of search radius => update search
				$document.triggerHandler('app.search');
			}
		}
	}
	//Init public method
	var init = function () {
		//create map
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

		map.addListener('dragend', updateMapPosition);
		map.addListener('zoom_changed', updateMapPosition);
		//check geolocation support and permissions
		if (navigator.permissions && navigator.geolocation) {
			navigator.permissions.query({name: 'geolocation'}).then(function (permissionStatus) {
				if (permissionStatus.state === 'granted') {
					navigator.geolocation.getCurrentPosition(setUserLocation, handleNoGeolocation);
				} else if (permissionStatus.state === 'prompt') {
					//show window to ask for permission
					askForGeolocation();
				} else {
					handleNoGeolocation({code: 999, message: 'Permission denied'});
				}
			});
		} else if (navigator.geolocation) {
			//Check for last known location if any
			var userGeolocation = data.getBool('userGeolocation');
			if (userGeolocation === null) {
				//no location, assume user has still not granted location right and ask for it
				askForGeolocation();
			} else if (userGeolocation === true) {
				//user previous location exists => use geolocation directly
				navigator.geolocation.getCurrentPosition(setUserLocation, handleNoGeolocation);
			} else {
				handleNoGeolocation({code: 999, message: 'Permission denied'});
			}
		} else {
			handleNoGeolocation({code: 999, message: 'Browser does not handle geolocation'});
		}
	}

	// API/data for end-user
	return {
		init: init
	}
})();