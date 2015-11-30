module.exports = (function() {
    var clustermap = 	require('../clustermap');
    //Query
    var query = require('../query.js')();
    var map;
    var browserSupportLocation = new Boolean();
    var initialLocation;

    var updatePins = function(json) {
        console.info(json);



    }

    var getPosts = function(params) {
        var now = new Date();
        params.searchId = now.getTime();
        query.posts(params, updatePins);
    }


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

        var marker = new google.maps.Marker({
            map: map,
            title: 'Hello World!'
        });

		// Try W3C Geolocation (Preferred)
		if(navigator.geolocation) {
            browserSupportLocation = true;
			navigator.geolocation.getCurrentPosition(function(position) {
				initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
				map.setCenter(initialLocation);
				myloc.setPosition(initialLocation);

                getPosts({'loc': initialLocation});
			}, function() {
				handleNoGeolocation(browserSupportLocation);
			});
		}
		// Browser doesn't support Geolocation
		else {
            browserSupportLocation = false;
			handleNoGeolocation(browserSupportLocation);
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
		init:       init,
        getPosts:   getPosts
	}
})();