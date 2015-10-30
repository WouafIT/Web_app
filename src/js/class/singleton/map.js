module.exports = (function() {
	var init = function () {
		var initialLocation;
		var siberia = new google.maps.LatLng(60, 105);
		var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
		var browserSupportFlag = new Boolean();
		var map = new google.maps.Map(document.getElementById('map'), {
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
		var myloc = new google.maps.Marker({
			clickable: false,
			icon: new google.maps.MarkerImage('//maps.gstatic.com/mapfiles/mobile/mobileimgs2.png',
											 new google.maps.Size(22,22),
											 new google.maps.Point(0,18),
											 new google.maps.Point(11,11)),
			shadow: null,
			zIndex: 999,
			map: map
		});

		// Try W3C Geolocation (Preferred)
		if(navigator.geolocation) {
			browserSupportFlag = true;
			navigator.geolocation.getCurrentPosition(function(position) {
				initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
				map.setCenter(initialLocation);
				myloc.setPosition(initialLocation);
			}, function() {
				handleNoGeolocation(browserSupportFlag);
			});
		}
		// Browser doesn't support Geolocation
		else {
			browserSupportFlag = false;
			handleNoGeolocation(browserSupportFlag);
		}
	}

	function handleNoGeolocation(errorFlag) {
		//TODO: get the last position chosen by cookie or user account
		// 		or ask user for position
		//		or do a geo detection by IP (country / city / ...) => http://dev.maxmind.com/geoip/geoip2/geolite2/
		if (errorFlag === true) {
			alert("Geolocation service failed.");
			initialLocation = newyork;
		} else {
			alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
			initialLocation = siberia;
		}
		map.setCenter(initialLocation);
		myloc.setPosition(initialLocation);
	}

	// API/data for end-user
	return {
		init: init
	}
})();