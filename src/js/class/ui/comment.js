module.exports = (function() {
	var i18n = require('../resource/i18n.js');
	var utils = require('../utils');

	var self = {};
	self.getComment = function (obj) {

		return '<div class="comment"><p>'+ utils.textToHTML(obj.text) +'</p></div>';
	};

	return self;
})();