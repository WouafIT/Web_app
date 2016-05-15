module.exports = (function() {
	if (!window.localStorage || !window.sessionStorage) {
		console.error('window.localStorage or window.sessionStorage does not exists');
	}
	/**
	 * Cross domain storage.
	 * Based on: http://www.nczonline.net/blog/2010/09/07/learning-from-xauth-cross-domain-localstorage/
	 * @author Juan Ramón González Hidalgo
	 *
	 * @param opts JSON object with the attribute names:
	 *      - origin Iframe URL
	 *      - path Path to iframe html file in origin
	 */
	function crossDomainStorage(opts){
		var _origin = opts.origin || '',
			_path = opts.path || '',
			cdstorage = {},
			_iframe = null,
			_iframeReady = false,
			_queue = [],
			_requests = {},
			_id = 0;
		var supported = (function(){
			try{
				return window.postMessage && window.JSON && 'localStorage' in window && window['localStorage'] !== null;
			}catch(e){
				return false;
			}
		})();

		//private methods
		var _request = function (data) {
			if (supported) {
				data.deferred = $.Deferred();
				if (_iframeReady) {
					_sendRequest(data);
				} else {
					_queue.push(data);
				}
				return data.deferred.promise();
			}
		};
		var _sendRequest = function(data){
			if (_iframe) {
				_requests[data.request.id] = data;
				_iframe.contentWindow.postMessage(JSON.stringify(data.request), _origin);
			}
		};
		var _iframeLoaded = function(){
			_iframeReady = true;
			if (_queue.length) {
				for (var i=0, len=_queue.length; i < len; i++){
					_sendRequest(_queue[i]);
				}
				_queue = [];
			}
		};
		var _handleMessage = function(event){
			if (event.origin === _origin) {
				var data = JSON.parse(event.data);
				if (typeof _requests[data.id] != 'undefined') {
					if (typeof _requests[data.id].deferred !== 'undefined') {
						_requests[data.id].deferred.resolve(data.value);
					}
					if (typeof _requests[data.id].callback === 'function') {
						if (!data.key) {
							_requests[data.id].callback(data.value);
						} else {
							_requests[data.id].callback(data.key, data.value);
						}
					}
					delete _requests[data.id];
				}
			}
		};

		//Public methods
		cdstorage.getItem = function(key, callback){
			return _request({
				request: {
					id: ++_id,
					type: 'get',
					key: key
				},
				callback: callback
			});
		};
		cdstorage.getAll = function(callback){
			return _request({
				request: {
					id: ++_id,
					type: 'getAll'
				},
				callback: callback
			});
		};
		cdstorage.setItem = function(key, value){
			return _request({
				request: {
					id: ++_id,
					type: 'set',
					key: key,
					value: value
				}
			});
		};

		//Init
		if (!_iframe && supported) {
			_iframe = document.createElement("iframe");
			_iframe.style.cssText = "position:absolute;width:1px;height:1px;left:-9999px;";
			document.body.appendChild(_iframe);
			_iframe.addEventListener("load", function(){ _iframeLoaded(); }, false);
			window.addEventListener("message", function(event){ _handleMessage(event) }, false);
			_iframe.src = _origin + _path;
		}

		return cdstorage;
	}
	//Init cross domain storage
	var cdPath = __DEV__ ? DEV_URL : PROD_URL;
	var crossDomainLocalStorage = crossDomainStorage({
		origin: cdPath,
		path: '/crossd_iframe.html?v='+ BUILD_VERSION
	});

	var self = {};
	// Public methods
	self.init = function() {
		var deferred = $.Deferred();
		$.when(crossDomainLocalStorage.getAll()).done(function(values) {
			if (values) {
				for (var i in values) {
					if (values.hasOwnProperty(i)) {
						sessionStorage.setItem(i, values[i]);
					}
				}
			}
			deferred.resolve();
		});
		return deferred.promise();
	};
	self.set = function (key, value, type, session) {
		session = session || false;
		if (value === null) {
			//localStorage.removeItem(key);
			sessionStorage.removeItem(key);
			crossDomainLocalStorage.setItem(key, null);
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
			case 'array':
				value = JSON.stringify(value);
				break;
		}
		if (session) {
			sessionStorage.setItem(key, value);
			crossDomainLocalStorage.setItem(key, null);
		} else {
			sessionStorage.setItem(key, value);
			crossDomainLocalStorage.setItem(key, value);
		}
	};
	self.get = function (key, type) {
		type = type || 'string';
		var value = sessionStorage.getItem(key) || null;
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
			case 'array':
				value = value ? JSON.parse(value) : [];
				break;
		}
		return value;
	};
	self.setObject = function (key, value, session) {
		self.set(key, value, 'object', session);
	};
	self.getObject = function (key) {
		return self.get(key, 'object');
	};
	self.setArray = function (key, value, session) {
		self.set(key, value, 'array', session);
	};
	self.getArray = function (key) {
		return self.get(key, 'array');
	};
	self.setString = function (key, value, session) {
		self.set(key, value, 'string', session);
	};
	self.getString = function (key) {
		return self.get(key, 'string');
	};
	self.setInt = function (key, value, session) {
		self.set(key, value, 'int', session);
	};
	self.getInt = function (key) {
		return self.get(key, 'int');
	};
	self.setFloat = function (key, value, session) {
		self.set(key, value, 'number', session);
	};
	self.getFloat = function (key) {
		return self.get(key, 'number');
	};
	self.setBool = function (key, value, session) {
		self.set(key, value, 'bool', session);
	};
	self.getBool = function (key) {
		return self.get(key, 'bool');
	};
	return self;
})();