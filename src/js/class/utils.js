module.exports = (function() {
	var twitterText = require('twitter-text');

	var self = {};
	//htmlspecialchars
	self.escapeHtml = function (text) {
		var map = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#039;'
		};
		return text.replace(/[&<>"']/g, function(m) { return map[m]; });
	};

	//Binary safe string comparison
	//from http://phpjs.org/functions/strcmp/
	var strcmp = function (str1, str2) {
		return ((str1 == str2) ? 0 : ((str1 > str2) ? 1 : -1));
	};

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
				} else if ((text === false) && (chr == '.') && (i < (f_string.length - 1)) && (f_string.substring(i + 1, i + 2).match(/\d/))) {
					result[result.length] = buffer;
					buffer = '';
				} else {
					if (text === false) {
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
	};

	//natsort from : http://phpjs.org/functions/natsort/
	self.natsort = function (inputArr) {
		var valArr = [],
			k, i,
			populateArr = {};

		// Get key and value arrays
		for (k in inputArr) {
			if (inputArr.hasOwnProperty(k)) {
				valArr.push([k, inputArr[k]]);
			}
		}
		valArr.sort(function (a, b) {
			return strnatcmp(a[1], b[1]);
		});

		// Repopulate the old array
		for (i = 0; i < valArr.length; i++) {
			populateArr[valArr[i][0]] = valArr[i][1];
		}

		return populateArr;
	};

	//Strip tags from : http://phpjs.org/functions/strip_tags/
	self.strip_tags = function (input, allowed) {
	  allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
	  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
		commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
	  return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
		return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
	  });
	};

	self.indexOf = function(r, elt /*, from*/) {
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

	//MD5 function from WebToolkit.
	self.md5=function(s){function L(k,d){return(k<<d)|(k>>>(32-d))}function K(G,k){var I,d,F,H,x;F=(G&2147483648);H=(k&2147483648);I=(G&1073741824);d=(k&1073741824);x=(G&1073741823)+(k&1073741823);if(I&d){return(x^2147483648^F^H)}if(I|d){if(x&1073741824){return(x^3221225472^F^H)}else{return(x^1073741824^F^H)}}else{return(x^F^H)}}function r(d,F,k){return(d&F)|((~d)&k)}function q(d,F,k){return(d&k)|(F&(~k))}function p(d,F,k){return(d^F^k)}function n(d,F,k){return(F^(d|(~k)))}function u(G,F,aa,Z,k,H,I){G=K(G,K(K(r(F,aa,Z),k),I));return K(L(G,H),F)}function f(G,F,aa,Z,k,H,I){G=K(G,K(K(q(F,aa,Z),k),I));return K(L(G,H),F)}function D(G,F,aa,Z,k,H,I){G=K(G,K(K(p(F,aa,Z),k),I));return K(L(G,H),F)}function t(G,F,aa,Z,k,H,I){G=K(G,K(K(n(F,aa,Z),k),I));return K(L(G,H),F)}function e(G){var Z;var F=G.length;var x=F+8;var k=(x-(x%64))/64;var I=(k+1)*16;var aa=Array(I-1);var d=0;var H=0;while(H<F){Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=(aa[Z]|(G.charCodeAt(H)<<d));H++}Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=aa[Z]|(128<<d);aa[I-2]=F<<3;aa[I-1]=F>>>29;return aa}function B(x){var k="",F="",G,d;for(d=0;d<=3;d++){G=(x>>>(d*8))&255;F="0"+G.toString(16);k=k+F.substr(F.length-2,2)}return k}function J(k){k=k.replace(/rn/g,"n");var d="";for(var F=0;F<k.length;F++){var x=k.charCodeAt(F);if(x<128){d+=String.fromCharCode(x)}else{if((x>127)&&(x<2048)){d+=String.fromCharCode((x>>6)|192);d+=String.fromCharCode((x&63)|128)}else{d+=String.fromCharCode((x>>12)|224);d+=String.fromCharCode(((x>>6)&63)|128);d+=String.fromCharCode((x&63)|128)}}}return d}var C=Array();var P,h,E,v,g,Y,X,W,V;var S=7,Q=12,N=17,M=22;var A=5,z=9,y=14,w=20;var o=4,m=11,l=16,j=23;var U=6,T=10,R=15,O=21;s=J(s);C=e(s);Y=1732584193;X=4023233417;W=2562383102;V=271733878;for(P=0;P<C.length;P+=16){h=Y;E=X;v=W;g=V;Y=u(Y,X,W,V,C[P+0],S,3614090360);V=u(V,Y,X,W,C[P+1],Q,3905402710);W=u(W,V,Y,X,C[P+2],N,606105819);X=u(X,W,V,Y,C[P+3],M,3250441966);Y=u(Y,X,W,V,C[P+4],S,4118548399);V=u(V,Y,X,W,C[P+5],Q,1200080426);W=u(W,V,Y,X,C[P+6],N,2821735955);X=u(X,W,V,Y,C[P+7],M,4249261313);Y=u(Y,X,W,V,C[P+8],S,1770035416);V=u(V,Y,X,W,C[P+9],Q,2336552879);W=u(W,V,Y,X,C[P+10],N,4294925233);X=u(X,W,V,Y,C[P+11],M,2304563134);Y=u(Y,X,W,V,C[P+12],S,1804603682);V=u(V,Y,X,W,C[P+13],Q,4254626195);W=u(W,V,Y,X,C[P+14],N,2792965006);X=u(X,W,V,Y,C[P+15],M,1236535329);Y=f(Y,X,W,V,C[P+1],A,4129170786);V=f(V,Y,X,W,C[P+6],z,3225465664);W=f(W,V,Y,X,C[P+11],y,643717713);X=f(X,W,V,Y,C[P+0],w,3921069994);Y=f(Y,X,W,V,C[P+5],A,3593408605);V=f(V,Y,X,W,C[P+10],z,38016083);W=f(W,V,Y,X,C[P+15],y,3634488961);X=f(X,W,V,Y,C[P+4],w,3889429448);Y=f(Y,X,W,V,C[P+9],A,568446438);V=f(V,Y,X,W,C[P+14],z,3275163606);W=f(W,V,Y,X,C[P+3],y,4107603335);X=f(X,W,V,Y,C[P+8],w,1163531501);Y=f(Y,X,W,V,C[P+13],A,2850285829);V=f(V,Y,X,W,C[P+2],z,4243563512);W=f(W,V,Y,X,C[P+7],y,1735328473);X=f(X,W,V,Y,C[P+12],w,2368359562);Y=D(Y,X,W,V,C[P+5],o,4294588738);V=D(V,Y,X,W,C[P+8],m,2272392833);W=D(W,V,Y,X,C[P+11],l,1839030562);X=D(X,W,V,Y,C[P+14],j,4259657740);Y=D(Y,X,W,V,C[P+1],o,2763975236);V=D(V,Y,X,W,C[P+4],m,1272893353);W=D(W,V,Y,X,C[P+7],l,4139469664);X=D(X,W,V,Y,C[P+10],j,3200236656);Y=D(Y,X,W,V,C[P+13],o,681279174);V=D(V,Y,X,W,C[P+0],m,3936430074);W=D(W,V,Y,X,C[P+3],l,3572445317);X=D(X,W,V,Y,C[P+6],j,76029189);Y=D(Y,X,W,V,C[P+9],o,3654602809);V=D(V,Y,X,W,C[P+12],m,3873151461);W=D(W,V,Y,X,C[P+15],l,530742520);X=D(X,W,V,Y,C[P+2],j,3299628645);Y=t(Y,X,W,V,C[P+0],U,4096336452);V=t(V,Y,X,W,C[P+7],T,1126891415);W=t(W,V,Y,X,C[P+14],R,2878612391);X=t(X,W,V,Y,C[P+5],O,4237533241);Y=t(Y,X,W,V,C[P+12],U,1700485571);V=t(V,Y,X,W,C[P+3],T,2399980690);W=t(W,V,Y,X,C[P+10],R,4293915773);X=t(X,W,V,Y,C[P+1],O,2240044497);Y=t(Y,X,W,V,C[P+8],U,1873313359);V=t(V,Y,X,W,C[P+15],T,4264355552);W=t(W,V,Y,X,C[P+6],R,2734768916);X=t(X,W,V,Y,C[P+13],O,1309151649);Y=t(Y,X,W,V,C[P+4],U,4149444226);V=t(V,Y,X,W,C[P+11],T,3174756917);W=t(W,V,Y,X,C[P+2],R,718787259);X=t(X,W,V,Y,C[P+9],O,3951481745);Y=K(Y,h);X=K(X,E);W=K(W,v);V=K(V,g)}var i=B(Y)+B(X)+B(W)+B(V);return i.toLowerCase()};

	self.isValidUsername = function (text) {
		return twitterText.isValidUsername('@'+text);
	};
	self.isValidWouafId = function (text) {
		return /^[a-f0-9]+$/.test(text);
	};
	self.isValidPageName = function (text) {
		return /^[a-z-]+$/.test(text) && text !== 'wouaf';
	};
	self.isValidEmail = function (email) {
		//email validation. validate mostly RF2822
		var emailRe = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
		return emailRe.test(email);
	};

	self.textToHTML = function(text) {
		var url = require('./resource/url.js');
		//remove HTML
		text = self.escapeHtml(text);
		//create HTML text content
		//grab links and tags positions
		var entities = twitterText.extractUrlsWithIndices(text)
				.concat(twitterText.extractMentionsOrListsWithIndices(text))
		/*.concat(twitterText.extractHashtagsWithIndices(text, {checkUrlOverlap: false}))*/;
		if (entities.length) {
			twitterText.removeOverlappingEntities(entities);
		}

		var pos = 0;
		var formattedText = '';
		for (var i = 0, l = entities.length; i < l; i++) {
			//var hash = entities[i].hashtag;
			var screenName = entities[i].screenName;
			var entityUrl = entities[i].url;
			var indices = entities[i].indices;
			//text before entity
			formattedText += text.substr(pos, indices[0] - pos);
			//entity
			if (screenName) {
				formattedText += '<a href="'+ url.getCurrentPathForState({name: 'user', value: screenName}) +'" data-user="'+ screenName +'">@' + screenName + '</a>';
			/*} else if (hash) { //hash
			 	formattedText += '<a href="'+ path +'hash/'+ hash +'/" data-hash="'+ hash +'">#' + hash + '</a>';*/
			} else if (entityUrl) { //link
				formattedText += '<a href="'+ (entityUrl.substr(0, 4) != 'http' ? 'http://' : '') + entityUrl +'" target="_blank">' + entityUrl + '</a>';
			}
			pos = indices[1];
		}
		if (pos != text.length) {
			//text after entities
			formattedText += text.substr(pos, text.length - pos);
		}
		return formattedText.replace(/\r?\n/g, "<br />");
	};

	self.isValidUserKey = function(text) {
		return /^([0-9A-Za-z-]{40})$/.test(text)
	};

	self.getQueryStringParams = function(hashBased) {
		var query;
		if(hashBased) {
			var pos = location.href.indexOf("?");
			if(pos==-1) return [];
			query = location.href.substr(pos+1);
		} else {
			query = location.search.substr(1);
		}
		var result = {};
		query.split("&").forEach(function(part) {
			if(!part) return;
			part = part.split("+").join(" "); // replace every + with space, regexp-free version
			var eq = part.indexOf("=");
			var key = eq>-1 ? part.substr(0,eq) : part;
			var val = eq>-1 ? decodeURIComponent(part.substr(eq+1)) : "";
			var from = key.indexOf("[");
			if(from==-1) result[decodeURIComponent(key)] = val;
			else {
				var to = key.indexOf("]");
				var index = decodeURIComponent(key.substring(from+1,to));
				key = decodeURIComponent(key.substring(0,from));
				if(!result[key]) result[key] = [];
				if(!index) result[key].push(val);
				else result[key][index] = val;
			}
		});
		return result;
	};

	self.ucfirst = function(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};

	return self;
})();