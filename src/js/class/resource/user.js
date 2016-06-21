module.exports = (function() {
	var self = {};
	var data = require('./data.js');
	self.set = function (key, value) {
		var user = data.getObject('user') || {};
		user[key] = value;
		data.setObject('user', user);
	};
	self.get = function (key) {
		var user = data.getObject('user') || {};
		return user[key] || null;
	};
	return self;
})();