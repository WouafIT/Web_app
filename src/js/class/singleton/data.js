module.exports = (function() {
	if (!window.localStorage) {
		console.error('window.localStorage does not exists');
	}
	//Cookie storage
	if (!window.cookieStorage) {
		Object.defineProperty(window, "cookieStorage", new (function () {
			var aKeys = [], oStorage = {};
			Object.defineProperty(oStorage, "getItem", {
				value: function (sKey) { return sKey ? this[sKey] : null; },
				writable: false,
				configurable: false,
				enumerable: false
			});
			Object.defineProperty(oStorage, "key", {
				value: function (nKeyId) { return aKeys[nKeyId]; },
				writable: false,
				configurable: false,
				enumerable: false
			});
			Object.defineProperty(oStorage, "setItem", {
				value: function (sKey, sValue) {
					if(!sKey) { return; }
					document.cookie = escape(sKey) + "=" + escape(sValue) + "; path=/";
				},
				writable: false,
				configurable: false,
				enumerable: false
			});
			Object.defineProperty(oStorage, "length", {
				get: function () { return aKeys.length; },
				configurable: false,
				enumerable: false
			});
			Object.defineProperty(oStorage, "removeItem", {
				value: function (sKey) {
					if(!sKey) { return; }
					document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
				},
				writable: false,
				configurable: false,
				enumerable: false
			});
			this.get = function () {
				var iThisIndx;
				for (var sKey in oStorage) {
					iThisIndx = aKeys.indexOf(sKey);
					if (iThisIndx === -1) { oStorage.setItem(sKey, oStorage[sKey]); }
					else { aKeys.splice(iThisIndx, 1); }
					delete oStorage[sKey];
				}
				for (aKeys; aKeys.length > 0; aKeys.splice(0, 1)) { oStorage.removeItem(aKeys[0]); }
				for (var aCouple, iKey, nIdx = 0, aCouples = document.cookie.split(/\s*;\s*/); nIdx < aCouples.length; nIdx++) {
					aCouple = aCouples[nIdx].split(/\s*=\s*/);
					if (aCouple.length > 1) {
						oStorage[iKey = unescape(aCouple[0])] = unescape(aCouple[1]);
						aKeys.push(iKey);
					}
				}
				return oStorage;
			};
			this.configurable = false;
			this.enumerable = true;
		})());
	}

	// Reference to "this" that won't get clobbered by some other "this"
	var self = {};
	// Public methods
	self.set = function (key, value, type, cookie) {
		cookie = cookie || false
		if (value === null) {
			localStorage.removeItem(key);
			cookieStorage.removeItem(key);
			return;
		}
		type = type || typeof value;
		switch (type) {
			case 'bool':
				value = value ? 'true' : 'false';
				break;
			case 'int':
			case 'number':
				value = value.toString();
				break;
			case 'object':
				value = JSON.stringify(value);
				break;
		}
		if (cookie) {
			localStorage.removeItem(key);
			cookieStorage.setItem(key, value);
		} else {
			cookieStorage.removeItem(key);
			localStorage.setItem(key, value);
		}
	};
	self.get = function (key, type) {
		type = type || 'string';
		var value = localStorage.getItem(key) || cookieStorage.getItem(key) || null;
		switch (type) {
			case 'bool':
				value = value === null ? null : (value === 'true');
				break;
			case 'int':
				value = value | 0;
				break;
			case 'number':
				value = +value;
				break;
			case 'object':
				value = value ? JSON.parse(value) : {};
				break;
		}
		return value;
	};
	self.setObject = function (key, value, cookie) {
		self.set(key, value, 'object', cookie);
	};
	self.getObject = function (key) {
		return self.get(key, 'object');
	};
	self.setString = function (key, value, cookie) {
		self.set(key, value, 'string', cookie);
	};
	self.getString = function (key) {
		return self.get(key, 'string');
	};
	self.setInt = function (key, value, cookie) {
		self.set(key, value, 'int', cookie);
	};
	self.getInt = function (key) {
		return self.get(key, 'int');
	};
	self.setFloat = function (key, value, cookie) {
		self.set(key, value, 'number', cookie);
	};
	self.getFloat = function (key) {
		return self.get(key, 'number');
	};
	self.setBool = function (key, value, cookie) {
		self.set(key, value, 'bool', cookie);
	};
	self.getBool = function (key) {
		return self.get(key, 'bool');
	};
	return self;
})();