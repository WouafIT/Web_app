module.exports = (function () {
	var clustermap = require('./clustermap.js');
	var categories = require('./categories.js');
	var i18n = require('./i18n.js');
	var data = require('./data.js');
	var utils = require('../utils.js');
	var $document = $(document);
	var map, infowindow; //GMap elements
	var userLocation;
	var hcmap;
	var userMarker;
	var initialized = false;
	var $body = $('body');
	var $map = $('#map');
	var self = {
		jsonResults: {}
	};
	//set map pins on search response
	var setPins = function (json) {
		if (__DEV__) {
			console.info('Search results', json);
		}
		var elements = [], i, li, j, lj;
		if (!json.results) {
			json.results = [];
			json.count = 0;
		} else {
			//if search Id match, add results
			if (self.jsonResults && self.jsonResults.searchId && json.searchId && self.jsonResults.searchId == json.searchId) {
				//deduplicate results
				loopI: for(i = 0, li = json.results.length; i < li; i++) {
					for(j = 0, lj = self.jsonResults.results.length; j < lj; j++) {
						if (self.jsonResults.results[j] && json.results[i].id === self.jsonResults.results[j].id) {
							self.jsonResults.results.splice(j, 1); //remove old result
							lj--;
							continue loopI;
						}
					}
				}
				json.results = json.results.concat(self.jsonResults.results);
				json.count   = json.results.length;
			} else if (self.jsonResults && self.jsonResults.searchId && json.searchId && self.jsonResults.searchId > json.searchId) {
				//drop older results
				return;
			}
		}
		//remove all previous pins if any and close infowindow
		if (hcmap) {
			hcmap.reset();
			infowindow.close();
			$document.triggerHandler('navigation.set-state', {name: 'wouaf', value: null});
		}
		//save result
		self.jsonResults = json;
		//create pins data
		for (i = 0, li = json.results.length; i < li; i++) {
			var post = json.results[i];
			var element = {
				'id': 			post.id,
				'description': 	post.text,
				'cat': 			post.cat,
				'coordinates': 	{'lat': parseFloat(post.loc[0]), 'lng': parseFloat(post.loc[1])},
				'color': 		categories.getColor(post.cat)
			};
			elements.push(element);
		}
		setTimeout(function () {
			//console.info('setPins1 (map.results-chown)');
			$document.triggerHandler('map.results-chown');
		}, 400);

		// Add all pins
		hcmap = new clustermap.HCMap({'map': map, 'elements': elements, 'infowindow': infowindow});

		initialized = true;
	};
	var removePin = function(id) {
		if (!id || !self.jsonResults || !self.jsonResults.results) {
			return;
		}
		var found = false;
		for (var i = 0, l = self.jsonResults.results.length; (i < l && !found); i++) {
			if (self.jsonResults.results[i].id == id) {
				self.jsonResults.results.splice(i, 1);
				self.jsonResults.count--;
				found = true;
			}
		}
		if (found) {
			//clone json result
			var json = $.extend(true, {}, self.jsonResults);
			var now = new Date();
			json.searchId = now.getTime();
			setPins(json);
		}
	};
	//append a given result to map
	var appendPin = function(obj) {
		var deferred = $.Deferred();
		if (getResults([obj.id]).length) {
			//console.info('appendPin1');
			deferred.resolve();
		} else {
			var results = jQuery.extend(true, {}, self.jsonResults);
			//add post to map results and display it
			results.results.push(obj);
			results.count = results.results.length;
			var now = new Date();
			results.searchId = now.getTime();
			$document.one('map.results-chown', function () {
				//console.info('appendPin2');
				deferred.resolve();
			});
			//console.info('appendPin3');
			setPins(results);
		}
		return deferred.promise();
	};

	var showPin = function (id, obj) {
		if (!id || !utils.isValidWouafId(id)) {
			return;
		}
		if (obj) {
			//console.info('showPin1');
			openPin(obj);
			return;
		}
		//get wouaf data then open it
		$.when(getResult(id)).done(function(obj) {
			//console.info('showPin2');
			openPin(obj);
		}).fail(function(msg) {
			var windows = require('./windows.js');
			windows.show({
				title: i18n.t('Error_'),
				text: i18n.t('Error, unknown url {{error}}', {error: msg[0]})
			});
		});
	};

	var openPin = function (obj) {
		$document.triggerHandler('navigation.disable-state');
		var count = 0;
		var showIW = function() {
			count++;
			var zoom = map.getZoom();
			var $pin = $map.find('.baseMarker[data-id="'+ obj.id +'"]');
			if ($pin.length) {
				google.maps.event.trigger($pin.get(0), 'click');
				$document.triggerHandler('navigation.enable-state');
			} else if (zoom < 21) {
				var pinZoom = clustermap.getLeafZoom(hcmap, obj.id, 10, 21);
				if (pinZoom != zoom) {
					//console.info('showIW1', pinZoom, zoom);
					google.maps.event.addListenerOnce(map, 'idle', showIW);
					map.setZoom(pinZoom);
				} else {
					if (count > 2) { //avoid bug after setCenter : sometimes pins are not refreshed.
						count = 0;
						google.maps.event.trigger(map, 'dragend');
					}
					//console.info('showIW2');
					setTimeout(showIW, 400);
				}
			} else if (zoom == 21) {
				$pin = $map.find('.baseMarker[data-id*="'+ obj.id +'"]');
				if ($pin.length) {
					//console.info('showIW3');
					google.maps.event.trigger($pin.get(0), 'click');
				} else {
					//console.info('showIW4 - no pin found for id '+ obj.id);
					//avoid bug after setCenter : sometimes pins are not refreshed.
					google.maps.event.trigger(map, 'dragend');
					setTimeout(showIW, 400);
				}
				$document.triggerHandler('navigation.enable-state');
			}
		};
		setTimeout(function () {
			var mapCenter = map.getCenter().toUrlValue(5);
			var objCenter = new google.maps.LatLng(obj.loc[0], obj.loc[1]).toUrlValue(5);
			if (mapCenter == objCenter) {
				//console.info('openPin1');
				$.when(appendPin(obj)).done(showIW);
			} else {
				var center = new google.maps.LatLng(obj.loc[0], obj.loc[1]);
				if (isSearchRefreshNeeded(center)) {
					//console.info('openPin2');
					$document.one('map.results-chown', function () {
						//console.info('openPin2"');
						$.when(appendPin(obj)).done(showIW);
					});
					map.setCenter(center);
				} else {
					$.when(appendPin(obj)).done(function () {
						//console.info('openPin3');
						//google.maps.event.addListenerOnce(map, 'idle', showIW);
						$document.one('map.updated-position', function () {
							//console.info('openPin4');
							showIW();
						});
						map.setCenter(center);
					});
				}
			}
		}, 200);
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
			//store map position
			data.setObject('position', userLocation.toJSON());
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
		$document.triggerHandler('map.geolocation-done');
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
		var location = data.getObject('position');
		if (!location) {
			if (i18n.t('languageShort') == 'fr') {
				//store map position: center of France
				location = new google.maps.LatLng(46.427066, 2.430535).toJSON();
			} else {
				//store map position: center of US
				location = new google.maps.LatLng(39.857973, -98.008955).toJSON();
			}
		}
		data.setObject('position', new google.maps.LatLng(location.lat, location.lng).toJSON());
		$document.triggerHandler('map.geolocation-done');
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
	var updateMapPosition = function() {
		//put a class on body when zoom is too wide
		var zoom = map.getZoom();
		$body.toggleClass('too-wide', map.getZoom() < 13);
		//update search if needed
		var center = map.getCenter();
		data.setObject('position', center.toJSON());
		//Precision : ~1.1m
		$document.triggerHandler('navigation.set-state', {name: 'map', value: {'center': center.toUrlValue(5), 'zoom': zoom}});

		//check distance between current center and last search
		if (isSearchRefreshNeeded(center)) {
			//distance is more than 85% of search radius => update search
			$document.triggerHandler('app.search', {refresh: true});
		}
		//console.info('map.updated-position');
		$document.triggerHandler('map.updated-position');
	};
	var isSearchRefreshNeeded = function (point) {
		//check distance between current center and last search
		if (!data.getBool('mapFollow') || !self.jsonResults.params) {
			return false;
		}
		var distance = Math.round(google.maps.geometry.spherical.computeDistanceBetween(
			point,
			self.jsonResults.params.loc
		));
		//distance is in meters and radius in km, refresh is distance is above 85% of queried radius
		return (distance >= self.jsonResults.params.radius * 850);//850 => 1000 (m => km) * 0.85 (%)
	};
	//Init public method
	var init = function () {
		var deferred = $.Deferred();
		//create map
		map = new google.maps.Map($map.get(0), {
			zoom: 9,
			panControl: false,
			streetViewControl: false,
			mapTypeControl: true,
			//TODO: Check for implementation of this issue https://code.google.com/p/gmaps-api-issues/issues/detail?id=3866
			styles: [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }]}],
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
		//map.addListener('dragend', updateMapPosition);
		map.addListener('zoom_changed', updateMapPosition);
		//need to debounce center_changed event
		var mapUpdater;
		var mapSettleTime = function () {
			clearTimeout(mapUpdater);
			mapUpdater=setTimeout(updateMapPosition, 200);
		};
		map.addListener('center_changed', mapSettleTime);

		$body.addClass('too-wide');

		//customize infowindow
		infowindow = new google.maps.InfoWindow();
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
		/*
		 google.maps.event.addDomListener($map.get(0), 'click', function(e) {
			if ((e.target && $(e.target).parents('.w-menu-dropdown, .gm-iw-parent').length) || $('.sb-active').length) {
				return;
			}
			e.stopPropagation();
			$document.triggerHandler('menu.close');
			infowindow.close();
			$document.triggerHandler('navigation.set-state', {name: 'wouaf', value: null});

		});*/
		google.maps.event.addListener(infowindow, 'closeclick', function(){
			$document.triggerHandler('menu.close');
			$document.triggerHandler('navigation.set-state', {name: 'wouaf', value: null});
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
		$document.one('map.geolocation-done', function() {
			deferred.resolve();
		});

		return deferred.promise();
	};

	var getResults = function(ids) {
		ids = ids || [];
		if (!self.jsonResults.count || !self.jsonResults.results) {
			return [];
		}
		if (!ids || !ids.length) {
			//return all results
			return self.jsonResults;
		}
		//grab results
		var results = [];
		for(var i = 0, l = self.jsonResults.results.length; i < l; i++) {
			var result = self.jsonResults.results[i];
			if (utils.indexOf(ids, result.id) !== -1) {
				results.push(result);
				if (results.length == ids.length) {
					return results;
				}
			}
		}
		return results;
	};

	var getResult = function(id, obj) {
		var deferred = $.Deferred();
		//check if wouaf exists in current search results
		obj = obj || getResults([id])[0] || null;
		//else check if wouaf data exists in html
		if (!obj && window.wouafit.wouaf && window.wouafit.wouaf.id == id) {
			obj = window.wouafit.wouaf;
		}
		if (obj) {
			deferred.resolve(obj);
		} else {
			var getResultFromServer = function(id) {
				var query = require('./query.js');
				query.post(id, function (result) {
					deferred.resolve(result.wouaf);
				}, function (msg) {
					deferred.reject(msg);
				});
			};
			if (initialized) { //if map is already initialized and has search results
				//no result, grab it from server
				getResultFromServer(id);
			} else {
				//wait for map initialization
				$document.one('map.results-chown', function() {
					//check if wouaf exists in current search results
					var obj = getResults([id])[0] || null;
					if (obj) {
						deferred.resolve(obj);
					} else {
						//no result, grab it from server
						getResultFromServer(id);
					}
				});
			}
		}
		return deferred.promise();
	};

	return {
		init: init,
		removeResult: removePin,
		showResult: showPin,
		hideResult: function () {
			infowindow.close();
			$document.triggerHandler('navigation.set-state', {name: 'wouaf', value: null});
		},
		setResults: setPins,
		getResults: getResults,
		getResult: getResult,
		getMap: function() {
			return map;
		},
		resize: function() {
			google.maps.event.trigger(map, "resize");
		}
	}
})();