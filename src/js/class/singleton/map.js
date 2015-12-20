module.exports = (function () {
	var clustermap = require('../../../libs/clustermap/clustermap.js');
	var i18n = require('./i18n.js');
	var query = require('./query.js');
	var data = require('./data.js');
	var toast = require('./toast.js');
	var $document = $(document);
	var map, infowindow; //GMap elements
	var userLocation;
	var hcmap;
	var jsonResults;
	var userMarker;
	//set map pins on search response
	var setPins = function (json) {
		if (__DEV__) {
			console.info('Search results', json);
		}
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
	}
	//Event to launch a new search
	$document.on('app.search', function (event, params) {
		params = params || {};
		params.searchId = (new Date()).getTime();
		if (!params.loc) {
			params.loc = map.getCenter();
		}
		if (__DEV__) {
			console.info('Search params', params);
		}
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
	}
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
	}
	//show map on user location, remove splash, launch search
	var showMap = function (location) {
		data.setObject('position', location.toJSON());

		//Init app state
		$document.triggerHandler('app.load-state', function() {
			//set map center
			map.setCenter(location);
			//search posts from current location
			$document.triggerHandler('app.search');
		});
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

		//customize infowindow
		infowindow = new google.maps.InfoWindow({
			/*maxWidth: 350,*/
			maxHeight: 350
		});

		// Event that closes the Info Window with a click on the map
		/*google.maps.event.addListener(map, 'click', function() {
			infowindow.close();
		});*/

		// *
		// START INFOWINDOW CUSTOMIZE.
		// The google.maps.event.addListener() event expects
		// the creation of the infowindow HTML structure 'domready'
		// and before the opening of the infowindow, defined styles are applied.
		// *
		google.maps.event.addListener(infowindow, 'domready', function() {

			// Reference to the DIV that wraps the bottom of infowindow
			var iwOuter = $('.gm-style-iw');

			/* Since this div is in a position prior to .gm-div style-iw.
			 * We use jQuery and create a iwBackground variable,
			 * and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
			 */
			var iwBackground = iwOuter.prev();

			// Removes background shadow DIV
			iwBackground.children(':nth-child(2)').css({'display' : 'none'});

			// Removes white background DIV
			iwBackground.children(':nth-child(4)').css({'display' : 'none'});

			// Moves the infowindow 115px to the right.
			//iwOuter.parent().parent().css({left: '115px'});

			// Moves the shadow of the arrow 76px to the left margin.
			//iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 76px !important;'});

			// Moves the arrow 76px to the left margin.
			//iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 76px !important;'});

			// Changes the desired tail shadow color.
			iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index' : '1'});

			// Reference to the div that groups the close button elements.
			var iwCloseBtn = iwOuter.next();

			// Apply the desired effect to the close button
			//iwCloseBtn.css({opacity: '1', right: '38px', top: '3px', border: '7px solid #48b5e9', 'border-radius': '13px', 'box-shadow': '0 0 5px #3990B9'});

			// If the content of infowindow not exceed the set maximum height, then the gradient is removed.
			//if($('.iw-content').height() < 140){
			//	$('.iw-bottom-gradient').css({display: 'none'});
			//}
			console.info('ok2');
			// The API automatically applies 0.7 opacity to the button after the mouseout event. This function reverses this event to the desired value.
			//iwCloseBtn.mouseout(function(){
			//	$(this).css({opacity: '1'});
			//});
		});
	}

	// API/data for end-user
	return {
		init: init
	}
})();