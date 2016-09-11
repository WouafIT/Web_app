var data = require('./data.js');
var users = require('./users.js');

module.exports = (function() {
	var self = {};
	self.set = function (key, value) {
		var user = data.getObject('user') || {};
		user[key] = value;
		data.setObject('user', user);
		users.set(user.uid, user);
	};
	self.get = function (key) {
		var user = data.getObject('user') || {};
		if (!key) {
			return user;
		}
		return user[key] || null;
	};
	return self;
}());