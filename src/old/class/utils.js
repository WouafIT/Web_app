//This file store common static functions or vars
exports.WOUAF_API_URL = 'https://api.wouaf.it';
exports.WOUAF_SHORT_URL = 'http://w.wouaf.it';
/*exports.EVENTFUL_API_URL = 'http://api.evdb.com/json';*/
exports.WOUAF_LOGO_URL = 'http://wouaf.it/img/logo-75.png';

var density =   (Ti.Platform.displayCaps.dpi <= 160) ? 'low' : 
				(Ti.Platform.displayCaps.dpi == 213) ? 'high' : //TV needs bigger icons
				(Ti.Platform.displayCaps.dpi > 160 && Ti.Platform.displayCaps.dpi < 240) ? 'medium' : 
				(Ti.Platform.displayCaps.dpi >= 240 && Ti.Platform.displayCaps.dpi < 320) ? 'high' : 
				'xhigh'; 
exports.img = (Ti.Platform.osname === 'iphone' || (Ti.Platform.osname === 'ipad') )? '/images' : '/images/'+density;

exports.nl = Ti.Platform.osname != 'mobileweb' ? '\n' : '<br />';

//Alert dialog with optional title
var alert = function (msg, title) {
    var title = title || L('alert');
    var dialog = Ti.UI.createAlertDialog({
        message: msg,
        ok: L('ok'),
        title: title
    }).show();
}

exports.alert = alert;

var getUserLocation = function(callback) {
	if (Ti.Geolocation.locationServicesEnabled) {
	    //Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_LOW;
	    Ti.Geolocation.purpose = 'Search Wouaf arround you';
	    Ti.Geolocation.getCurrentPosition(callback);
	    
	    if (Titanium.Platform.name != 'android') {
            var authorization = Titanium.Geolocation.locationServicesAuthorization;
            if (authorization == Titanium.Geolocation.AUTHORIZATION_DENIED) {
                //alert(L('you_have_disallowed_wouaf_it_from_running_geolocation_services'));
            } else if (authorization == Titanium.Geolocation.AUTHORIZATION_RESTRICTED) {
                alert(L('your_system_has_disallowed_wouaf_it_from_running_geolocation_services'));
            }
        }
	} else if(!Ti.App.Properties.getBool('gpsAlert')) {
	    Ti.App.Properties.setBool('gpsAlert', true);
	    alert(L('please_enable_location_services'));
	}
}
exports.LATITUDE_BASE = 0;
exports.LONGITUDE_BASE = 0;

//Set first user location
getUserLocation(function(e) {
	if (e.success && e.coords) {
		exports.LATITUDE_BASE = e.coords.latitude;
		exports.LONGITUDE_BASE = e.coords.longitude;
	} else {
		 exports.LATITUDE_BASE = 0;
		 exports.LONGITUDE_BASE = 0;
	}
});

exports.getUserLocation = getUserLocation;

//LatLng object
var LatLng = function (lat, lng) {
	this.lat = parseFloat(lat);
	this.lng = parseFloat(lng);
}
exports.LatLng = LatLng;

//Point object
var Point = function (x, y) {
	this.x = x;
	this.y = y;
}
exports.Point = Point;

//LatLngBounds object
var LatLngBounds = function (sw, ne) {
	this._sw = sw;
	this._ne = ne;
}
LatLngBounds.prototype.extend = function(point) {
	if (point.lat < this._sw.lat && point.lng < this._sw.lng) {
		this._sw = point;
	} else if (point.lat < this._sw.lat) {
		this._sw = new LatLng(point.lat, this._sw.lng);
	} else if (point.lng < this._sw.lng) {
		this._sw = new LatLng(this._sw.lat, point.lng);
	}
	if (point.lat > this._ne.lat && point.lng > this._ne.lng) {
		this._ne = point;
	} else if (point.lat > this._ne.lat) {
		this._ne = new LatLng(point.lat, this._ne.lng);
	} else if (point.lng > this._ne.lng) {
		this._ne = new LatLng(this._ne.lat, point.lng);
	}
	return this;
};
LatLngBounds.prototype.getNorthEast = function() {
	return this._ne;
}
LatLngBounds.prototype.getSouthWest = function() {
	return this._sw;
}
LatLngBounds.prototype.contains = function(point) {
	if (point.lat > this._sw.lat && point.lat < this._ne.lat && point.lng > this._sw.lng && point.lng < this._ne.lng) {
		return true;
	}
	return false;
}
exports.LatLngBounds = LatLngBounds;

//Binary safe string comparison
//from http://phpjs.org/functions/strcmp/
var strcmp = function (str1, str2) {
    return ((str1 == str2) ? 0 : ((str1 > str2) ? 1 : -1));
}

//Returns the result of string comparison using 'natural' algorithm
//from http://phpjs.org/functions/strnatcmp/
var strnatcmp = function (f_string1, f_string2, f_version) {
    var i = 0;
 
    if (f_version == undefined) {
        f_version = false;
    }
 
    var __strnatcmp_split = function (f_string) {
        var result = [];
        var buffer = '';
        var chr = '';
        var i = 0,
            f_stringl = 0;
 
        var text = true;
 
        f_stringl = f_string.length;
        for (i = 0; i < f_stringl; i++) {
            chr = f_string.substring(i, i + 1);
            if (chr.match(/\d/)) {
                if (text) {
                    if (buffer.length > 0) {
                        result[result.length] = buffer;
                        buffer = '';
                    }
 
                    text = false;
                }
                buffer += chr;
            } else if ((text == false) && (chr == '.') && (i < (f_string.length - 1)) && (f_string.substring(i + 1, i + 2).match(/\d/))) {
                result[result.length] = buffer;
                buffer = '';
            } else {
                if (text == false) {
                    if (buffer.length > 0) {
                        result[result.length] = parseInt(buffer, 10);
                        buffer = '';
                    }
                    text = true;
                }
                buffer += chr;
            }
        }
 
        if (buffer.length > 0) {
            if (text) {
                result[result.length] = buffer;
            } else {
                result[result.length] = parseInt(buffer, 10);
            }
        }
 
        return result;
    };
 
    var array1 = __strnatcmp_split(f_string1 + '');
    var array2 = __strnatcmp_split(f_string2 + '');
 
    var len = array1.length;
    var text = true;
 
    var result = -1;
    var r = 0;
 
    if (len > array2.length) {
        len = array2.length;
        result = 1;
    }
 
    for (i = 0; i < len; i++) {
        if (isNaN(array1[i])) {
            if (isNaN(array2[i])) {
                text = true;
 
                if ((r = strcmp(array1[i], array2[i])) != 0) {
                    return r;
                }
            } else if (text) {
                return 1;
            } else {
                return -1;
            }
        } else if (isNaN(array2[i])) {
            if (text) {
                return -1;
            } else {
                return 1;
            }
        } else {
            if (text || f_version) {
                if ((r = (array1[i] - array2[i])) != 0) {
                    return r;
                }
            } else {
                if ((r = strcmp(array1[i].toString(), array2[i].toString())) != 0) {
                    return r;
                }
            }
 
            text = false;
        }
    }
 
    return result;
}

//natsort from : http://phpjs.org/functions/natsort/
var natsort = function (inputArr) {
    var valArr = [],
        k, i, ret, that = this,
        strictForIn = false,
        populateArr = {};
 
    // BEGIN REDUNDANT
    this.php_js = this.php_js || {};
    this.php_js.ini = this.php_js.ini || {};
    // END REDUNDANT
    strictForIn = this.php_js.ini['phpjs.strictForIn'] && this.php_js.ini['phpjs.strictForIn'].local_value && this.php_js.ini['phpjs.strictForIn'].local_value !== 'off';
    populateArr = strictForIn ? inputArr : populateArr;
 
    // Get key and value arrays
    for (k in inputArr) {
        if (inputArr.hasOwnProperty(k)) {
            valArr.push([k, inputArr[k]]);
            if (strictForIn) {
                delete inputArr[k];
            }
        }
    }
    valArr.sort(function (a, b) {
        return strnatcmp(a[1], b[1]);
    });
 
    // Repopulate the old array
    for (i = 0; i < valArr.length; i++) {
        populateArr[valArr[i][0]] = valArr[i][1];
    }
 
    return strictForIn || populateArr;
}

exports.natsort = natsort;

var compare = function (fromArray, testArr) {
    if (fromArray.length != testArr.length) return false;
    for (var i = 0, l = testArr.length; i < l; i++) {
        if (typeof(fromArray[i]) == 'object' && (fromArray[i] instanceof Array)) { 
            if (!utils.compare(fromArray[i], testArr[i])) return false;
        }
        if (fromArray[i] !== testArr[i]) return false;
    }
    return true;
}
exports.compare = compare;

//Strip tags from : http://phpjs.org/functions/strip_tags/
var strip_tags = function (input, allowed) {
  allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
    commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
    return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
  });
}
exports.strip_tags = strip_tags;

//translation with autoconversion from string to id 
var _L = function (str) {
	if (!str) {
		return '';
	}
	var s = str.toLowerCase();
	s = s.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); //trim
	s = s.replace(/\s/g, '_'); //convert white spaces to underscore
	s = s.replace(/[^a-z0-9_]+/g, ''); //remove non alpha caracters
	return L(s, str);
}

exports._L = _L;

var indexOf = function(r, elt /*, from*/) {
    r = r || [];
    var len = r.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++) {
      if (from in r &&
          r[from] === elt)
        return from;
    }
    return -1;
};
exports.indexOf = indexOf;

//Mobile web formating functions
var formatDate = function(date, format) {
    format = format || 'short';
    if (Ti.Platform.osname != 'mobileweb') {
        return String.formatDate(date, format);
    } else {
        var locale = Ti.Platform.getLocale().getCurrentLocale().substr(0, 2).toLowerCase();
        if (format == 'short') {
            if (locale == 'fr') {
                return (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +'/'+ ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) +'/'+ date.getFullYear();
            } else {
                return ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) +'/'+ (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +'/'+ date.getFullYear();
            }
        } else {
            var months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
            if (locale == 'fr') {
                return date.getDate() +' '+ L(months[date.getMonth()]) +' '+ date.getFullYear();
            } else {
                return L(months[date.getMonth()]) +' '+ date.getDate() +', '+ date.getFullYear();
            }
        }
    }
};
var formatTime = function(date, format) {
    format = format || 'short';
    if (Ti.Platform.osname != 'mobileweb') {
        return String.formatTime(date, format);
    } else {
        var locale = Ti.Platform.getLocale().getCurrentLocale().substr(0, 2).toLowerCase();
        if (locale == 'fr') {
            return  (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +':'+ (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
        } else {
            var hours = date.getHours();
            if (hours > 12) {
                return  ((hours - 12) < 10 ? '0' + (hours - 12) : (hours - 12)) +':'+ (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +' PM';
            } else {
                return  (hours < 10 ? '0' + hours : hours) +':'+ (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +' AM';
            }
        }
    }
};
//format text for mobile web
var formatText = function (text) {
    if (Ti.Platform.osname != 'mobileweb') {
        return text;
    }
    //replace \n by <br />
    text = text.replace(/\n*/g, '').replace(/\\n/g, '<br />');
    //convert links
    var twitter = require('lib/twitter-text');
    var entities = twitter.extractUrlsWithIndices(text);
    var pos = 0;
    var textContent = '';
    for (var i = 0, l = entities.length; i < l; i++) {
        var url = entities[i].url;
        var indices = entities[i].indices;
        //text before entity
        textContent += text.substr(pos, indices[0] - pos);
        //entity
        textContent += '<a href="'+ url +'" target="_blank" style="color:#2B9D48;">' + url + '</a>';
        pos = indices[1];
    }
    if (pos != text.length) {
        //text after entities
        textContent += text.substr(pos, text.length - pos);
    }
    return textContent;
}
exports.formatTime = formatTime;
exports.formatDate = formatDate;
exports.formatText = formatText;