var i18n = require('../resource/i18n.js');
var dtp = require('../resource/datetimepicker.js');
var url = require('../resource/url.js');
var utils = require('../utils');
var data = require('../resource/data.js');
var user = require('./user.js');

module.exports = (function() {
	var self = {};
	self.getComment = function (obj, wouaf) {
		var date = new Date();
		date.setTime(obj.ts * 1000);
		var time = dtp.formatTime(date, false);
		var authorAvatar = user.getAvatar(obj.author, 16);
		var authorUrl = url.getAbsoluteURLForStates([{name: 'user', value: obj.author[1]}]);
		var author = i18n.t('By {{author}} on {{date}}', {
			author: '<a href="'+ authorUrl +'" data-user="'+ utils.escapeHtml(obj.author[1]) +'">'+
				utils.escapeHtml(obj.author[2] || obj.author[1]) +' '+ authorAvatar +'</a>',
			date: (dtp.formatDate(date, 'long') + (time !== '00:00' ? ' '+ i18n.t('at {{at}}', {at: time}) : '')),
			interpolation: {escape: false}
		});
		var className = data.getString('uid') === obj.author[0] ? ' current-user' : '';
		className += wouaf.author[0] === obj.author[0] ? ' wouaf-author' : '';
		return ['<blockquote class="blockquote', className ,'">',
			'<button class="w-menu" data-id="'+ obj.id +'" data-menu="comment" type="button">',
				'<i class="fa fa-bars"></i>',
			'</button>',
			'<p class="m-b-0">', utils.textToHTML(obj.text) ,'</p>',
			'<footer class="blockquote-footer"> ', author ,'</footer>',
		'</blockquote>'].join('');
	};

	return self;
}());