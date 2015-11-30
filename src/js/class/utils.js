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
module.exports.natsort = natsort;

//Strip tags from : http://phpjs.org/functions/strip_tags/
var strip_tags = function (input, allowed) {
  allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
    commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
    return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
  });
}
module.exports.strip_tags = strip_tags;

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
module.exports.indexOf = indexOf;

//Mobile web formating functions
var formatDate = function(date, format) {
    format = format || 'short';

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
};
var formatTime = function(date, format) {
    format = format || 'short';

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
};
//format text for mobile web
var formatText = function (text) {
    //replace \n by <br />
    text = text.replace(/\n*/g, '').replace(/\\n/g, '<br />');
    //convert links
    var twitter = require('../../libs/twitter-text');
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
module.exports.formatTime = formatTime;
module.exports.formatDate = formatDate;
module.exports.formatText = formatText;