var query = require('./query.js');

module.exports = (function() {
	var wouafs = {};
	var self = {};
	self.set = function (id, data) {
		wouafs[id] = data;
	};
	self.sets = function (data) {
		for (var i = 0, l = data.length; i < l; i++) {
			var obj = data[i];
			self.set(obj.id, obj);
		}
	};
	self.getLocal = function (id) {
		return wouafs[id] || null;
	};
	self.get = function (id) {
		var deferred = $.Deferred();
		if (wouafs[id]) {
			deferred.resolve(wouafs[id]);
		} else {
			query.post(id, function (result) {
				self.set(result.wouaf.id, result.wouaf);
				deferred.resolve(result.wouaf);
			}, function (msg) {
				deferred.reject(msg);
			});
		}
		return deferred.promise();
	};
	self.exists = function (id) {
		return !!wouafs[id];
	};
	self.remove = function (id) {
		if (wouafs[id]) {
			delete wouafs[id];
		}
	};
	return self;
})();