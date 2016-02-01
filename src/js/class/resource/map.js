module.exports = (function () {
	var clustermap = require('../../../libs/clustermap/clustermap.js');
	var categories = require('./categories.js');
	var i18n = require('./i18n.js');
	var data = require('./data.js');
	var toast = require('./toast.js');
	var self = {};
	var $document = $(document);
	var map, infowindow; //GMap elements
	var userLocation;
	var hcmap;
	var userMarker;
	var $body = $('body');
	self.jsonResults = {};
	//set map pins on search response
	var setPins = function (json) {
		if (__DEV__) {
			console.info('Search results', json);
		}
		var addResults = false;
		var resultsType = json.resultsType ? json.resultsType : 'unknown';
		var elements = [];
		if (!json.results) {
			json.results = [];
			json.count = 0;
		} else {
			//if search Id match, add results
			if (self.jsonResults && self.jsonResults.searchId && json.searchId && self.jsonResults.searchId == json.searchId) {
				addResults = json.count;
				json.count += self.jsonResults.count;
				json.results = json.results.concat(self.jsonResults.results);
			} else {
				if (self.jsonResults && self.jsonResults.searchId && json.searchId && self.jsonResults.searchId > json.searchId) {
					//drop old results
					return;
				}
			}
		}
		//remove all previous pins if any and close infowindow
		if (hcmap) {
			hcmap.reset();
			infowindow.close();
			$document.triggerHandler('navigation.set-state', {state: 'wouaf', value: null});
		}
		//save result
		self.jsonResults = json;
		//create pins data
		for (var i = 0, l = json.results.length; i < l; i++) {
			var post = json.results[i];
			var element = {
				'label': post.id,
				'description': post.text,
				'cat': post.cat,
				'coordinates': {'lat': parseFloat(post.loc[0]), 'lng': parseFloat(post.loc[1])},
				'color': categories.getColor(post.cat)
			};
			elements.push(element);
		}
		// Add all pins
		hcmap = new clustermap.HCMap({'map': map, 'elements': elements, 'infowindow': infowindow});

		//show results number
		var countResults = addResults ? addResults : json.count;
		var notificationLabel = '';
		if (resultsType == 'wouafit') {
			notificationLabel = i18n.t('{{count}} Wouaf', { count: countResults });
		}
		if (countResults == 500) {
			toast.show(i18n.t('{{max}} displayed (maximum reached)', {max: notificationLabel }));
		} else {
			toast.show(i18n.t('{{wouaf}} displayed', { count: countResults, wouaf: notificationLabel }));
		}
	};

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
	};
	//no geolocation
	var handleNoGeolocation = function (error) {
		if (error.code == 3 && userMarker) {
			//Timeout on high accuracy => skip
			return;
		}
		if (__DEV__) {
			console.info('No geolocation available, code '+ error.code +': '+ error.message);
		}
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
	};
	//ask user for his location
	var askForGeolocation = function () {
		//show message page
		var windows = require('./windows.js');
		windows.show({
			title: i18n.t('Location request'),
			text: i18n.t('Location_request_details'),
			close: function () {
				navigator.geolocation.getCurrentPosition(setUserLocation, handleNoGeolocation);
			}
		});
	};
	//show map on user location, remove splash, launch search
	var showMap = function (location) {
		data.setObject('position', location.toJSON());

		//Init app state
		$document.triggerHandler('navigation.load-state', function(mapState) {
			if (!mapState) {
				//set map center
				map.setCenter(location);
			}
			//search posts from current location
			$document.triggerHandler('app.search');
		});
		//hide splash
		$('#splash').fadeOut('fast');
	};
	var updateMapPosition = function() {
		//put a class on body when zoom is too wide
		var zoom = map.getZoom();
		$body.toggleClass('too-wide', map.getZoom() < 13);
		//update search if needed
		var center = map.getCenter();
		data.setObject('position', center.toJSON());
		//Precision : ~1.1m
		$document.triggerHandler('navigation.set-state', {state: 'map', value: {'center': center.toUrlValue(5), 'zoom': zoom}});

		//check distance between current center and last search
		if (self.jsonResults.query) {
			var distance = Math.round(google.maps.geometry.spherical.computeDistanceBetween(center,
																							new google.maps.LatLng(self.jsonResults.query.loc.$near[0], self.jsonResults.query.loc.$near[1])));
			if (distance >= self.jsonResults.query.loc.$maxDistance * 72600) {//72600 => 110 * 1000 * 0.66
				//distance is more than 66% of search radius => update search
				$document.triggerHandler('app.search');
			}
		}
	};
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
		//add map events
		map.addListener('dragend', updateMapPosition);
		map.addListener('zoom_changed', updateMapPosition);
		$body.addClass('too-wide');

		//customize infowindow
		infowindow = new google.maps.InfoWindow({
			maxHeight: 350
		});
		google.maps.event.addListener(infowindow, 'domready', function() {
			// Reference to the DIV that wraps the bottom of infowindow
			var $iwOuter = $('.gm-style-iw');
			var $iwOuterParent = $iwOuter.parent();
			var $iwBackground = $iwOuter.prev();
			// Removes background shadow DIV
			$iwBackground.children(':nth-child(2)').css({'display' : 'none'});
			// Removes white background DIV
			$iwBackground.children(':nth-child(4)').css({'display' : 'none'});
			// Changes the desired tail shadow color.
			$iwBackground.children(':nth-child(3)').find('div').children().addClass('iw-tail');
			//add missing classes
			$iwBackground.addClass('gm-iw-bg');
			$iwOuter.next().addClass('gm-iw-close-btn');
			$iwOuterParent.addClass('gm-iw-parent');
			$iwOuterParent.parent().addClass('gm-iw-gparent');
		});
		// Event that closes the Info Window with a click on the map
		google.maps.event.addListener(map, 'click', function() {
			infowindow.close();
			$document.triggerHandler('navigation.set-state', {state: 'wouaf', value: null});
		});
		google.maps.event.addListener(infowindow,'closeclick',function(){
			$document.triggerHandler('navigation.set-state', {state: 'wouaf', value: null});
		});

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
	};

	return {
		init: init,
		setPins: setPins,
		getResults: function() {
			return self.jsonResults;
		},
		getMap: function() {
			return map;
		}
	}
})();