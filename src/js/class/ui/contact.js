module.exports = (function() {
	var self = {};
	var data = require('../resource/data.js');
	self.show = function (e) {
		console.info(data.getObject('navigation'));
	};


	return self;
})();