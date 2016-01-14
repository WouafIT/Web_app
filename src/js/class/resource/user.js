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
	self.gravatar = function (size) {
		var utils = require('../utils.js');
		size = size || 80;
		var email = self.get('email');
		return email ? '//www.gravatar.com/avatar/' + utils.md5(email.toLowerCase()) + '.jpg?d=identicon&s=' + size : '';
	};
	return self;
})();