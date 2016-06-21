module.exports = (function() {
	var query = require('./query.js');
	var utils = require('../utils.js');
	var users = {};
	var usernames = {};
	var self = {};
	self.set = function (uid, data) {
		users[uid] = data;
		usernames[data.username] = uid;
	};
	self.sets = function (data) {
		for (var i = 0, l = data.length; i < l; i++) {
			var obj = data[i];
			self.set(obj.uid, obj);
		}
	};
	self.getLocal = function (uid) {
		return users[uid] || null;
	};
	self.get = function (value) {
		var deferred = $.Deferred();
		var uid;
		if (utils.isId(value)) {
			uid = value;
		} else if (utils.isValidUsername(value)) {
			uid = usernames[value] || null;
		} else {
			deferred.reject('Invalid username');
			return deferred.promise();
		}
		if (uid && users[uid]) {
			deferred.resolve(users[uid]);
		} else {
			query.getUser(value, function (result) {
				self.set(result.user.uid, result.user);
				deferred.resolve(result.user);
			}, function (msg) {
				deferred.reject(msg);
			});
		}
		return deferred.promise();
	};
	self.exists = function (uid) {
		return !!users[uid];
	};
	self.remove = function (uid) {
		if (users[uid]) {
			delete users[uid];
		}
	};
	self.gravatar = function (hash, size) {
		if (!hash) {
			return '';
		}
		size = size || 80;
		return '<img src="//www.gravatar.com/avatar/'+ hash +'.jpg?d=blank&s='+ size +'" width="'+ size +'" height="'+ size +'" class="gravatar" />';
	};
	return self;
})();