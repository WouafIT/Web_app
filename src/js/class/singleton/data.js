module.exports = (function() {
	if (!window.localStorage) {
		console.error('window.localStorage does not exists');
	}
	// Reference to "this" that won't get clobbered by some other "this"
	var self = {};
	// Public methods
	self.set = function (key, value, type) {
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
		localStorage.setItem(key, value);
	};
	self.get = function (key, type) {
		type = type || 'string';
		var value = localStorage.getItem(key) || null;
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
	self.setObject = function (key, value) {
		self.set(key, value, 'object');
	};
	self.getObject = function (key) {
		return self.get(key, 'object');
	};
	self.setString = function (key, value) {
		self.set(key, value, 'string');
	};
	self.getString = function (key) {
		return self.get(key, 'string');
	};
	self.setInt = function (key, value) {
		self.set(key, value, 'int');
	};
	self.getInt = function (key) {
		return self.get(key, 'int');
	};
	self.setFloat = function (key, value) {
		self.set(key, value, 'number');
	};
	self.getFloat = function (key) {
		return self.get(key, 'number');
	};
	self.setBool = function (key, value) {
		self.set(key, value, 'bool');
	};
	self.getBool = function (key) {
		return self.get(key, 'bool');
	};
	return self;
})();