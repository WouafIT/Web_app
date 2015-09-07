var map = function () {
	var utils = require('class/utils');
	
	var self = Ti.Map.createView({
	    mapType: Ti.Map.STANDARD_TYPE,
	    region: {
    		latitude: utils.LATITUDE_BASE, 
    		longitude: utils.LONGITUDE_BASE,
	        latitudeDelta: 0.1, 
	        longitudeDelta: 0.1
	    },
	    animate:false,
	    regionFit:true,
	    userLocation:true,
	    bottom: '50dp',
	    layout: 'absolute'
	});
	self.fromLatLngToPoint = function (latLng){
		var point = new utils.Point(0,0);
		var ref = new utils.Point(128,128);
		point.x = ref.x + latLng.lng * 0.7111111111111111;
		var e = this.between( Math.sin( this.deg2rad( latLng.lat ) ), -(1 - 1E-15), 1 - 1E-15);
		point.y = ref.y + 0.5 * Math.log( (1 + e) / (1 - e) ) * - 40.74366543152521;
		return point;
	}
	self.fromPointToLatLng = function (point){
		var ref = new utils.Point(128, 128);
		var lat = this.rad2deg(2 * Math.atan( Math.exp( (point.y - ref.y) / -40.74366543152521) ) - Math.PI / 2);
		var lon = (point.x - ref.x) / 0.7111111111111111;
		return new utils.LatLng(lat, lon);
	}
	self.between = function (a,b,c){
		b != null && (a = Math.max(a , b));
		c != null && (a = Math.min(a , c));
		return a;
	}
	self.deg2rad = function (a) {
		return a * (Math.PI / 180);
	}
	self.rad2deg = function (a) {
		return a / (Math.PI / 180);
	}
	self.getBounds = function () {
		var swLat 	= Math.round((this.mapRegion.latitude - (this.mapRegion.latitudeDelta / 2)) * 1000000) / 1000000;
		var swLon 	= Math.round((this.mapRegion.longitude - (this.mapRegion.longitudeDelta / 2)) * 1000000) / 1000000;
		var neLat 	= Math.round((this.mapRegion.latitude + (this.mapRegion.latitudeDelta / 2)) * 1000000) / 1000000;
		var neLon 	= Math.round((this.mapRegion.longitude + (this.mapRegion.longitudeDelta / 2)) * 1000000) / 1000000;
		var sw 		= new utils.LatLng(swLat, swLon);
		var ne 		= new utils.LatLng(neLat, neLon);
		var bound 	= new utils.LatLngBounds(sw, ne);
		return bound;
	}
	self.getZoom = function () {
		//zoom max : 0.000543,0.000642
		//zoom min: 160,675
		if (this.mapRegion.longitudeDelta <= 0.000642) {
			return 21;
		}
		for (var i = 1; i < 21; i++) {
			if ((Math.pow(2, i) * 0.000642) > this.mapRegion.longitudeDelta) {
				return 22 - i;
			}
		}
		return 1;
	}
	
	self.addEventListener('regionChanged', function(e) {
		self.mapRegion = e;
	});
	
	return self;
}
module.exports = map;