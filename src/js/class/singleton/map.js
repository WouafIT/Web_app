module.exports = (function() {
    var clustermap = 	require('../../../libs/clustermap/clustermap.js');
	//i18n
	var i18n = require('./i18n.js');
	//Query
    var query = require('../query.js')();
	//Data
	var data = require('./data.js');
	var map;
    var browserSupportLocation = false;
    var initialLocation;
	var hcmap;
	var jsonResults;

    var updatePins = function(json) {
        console.info(json);


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
		console.info(categories);
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
		for(var i = 0, l = json.results.length; i < l; i++) {
			var post = json.results[i];
			var element = {
				'label': post.id,
				'description': post.text,
				'cat': post.cat,
				'coordinates': {'lat': parseFloat (post.loc[0]), 'lng': parseFloat (post.loc[1])},
				'color': colors[post.cat]
			};
			elements.push(element);
		}
		// Add all pins
		hcmap = new clustermap.HCMap ({'map': map , 'elements': elements}) ;

		var toast = require('./toast.js');
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