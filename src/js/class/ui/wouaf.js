var i18n = require('../resource/i18n.js');
var utils = require('../utils');
var categories = require('../resource/categories.js');
var url = require('../resource/url.js');
var dtp = require('../resource/datetimepicker.js');
var user = require('./user.js');

module.exports = (function() {
	var self = {};
	self.getDatesListing = function (obj) {
		var content = [], timeStart, timeEnd;
		for(var i = 0, l = obj.dates.length; i < l; i++) {
			timeStart 	= obj.dates[i].start * 1000;
			timeEnd 	= obj.dates[i].end * 1000;
			content.push(self.getDateLabel(obj, timeStart, timeEnd, false));
		}
		return content;
	};
	self.getDateLabel = function (obj, timeStart, timeEnd, moreDate) {
		var storeResult = !timeStart || !timeEnd;
		moreDate = (typeof moreDate === 'undefined' || !!moreDate);
		if (storeResult && obj.dateLabel) {
			return obj.dateLabel;
		}
		//state
		var time = new Date();
		var timestamp = time.getTime();
		var datesLength = obj.dates.length;
		if (!timeStart || !timeEnd) {
			timeStart 	= obj.dates[0].start * 1000;
			timeEnd 	= obj.dates[0].end * 1000;
			if (datesLength > 1) {
				var s, e, i, l = obj.dates.length;
				//get the closest period
				for(i = 0; i < l; i++) {
					s = obj.dates[i].start * 1000;
					e = obj.dates[i].end * 1000;
					if (s < timestamp && e > timestamp) {
						timeStart 	= s;
						timeEnd 	= e;
						break;
					} else if (Math.abs(timestamp - s) < Math.abs(timestamp - timeStart) || (s > timestamp && timeStart < timestamp)) {
						timeStart 	= s;
						timeEnd 	= e;
					}
				}
			}
		}
		//state
		var state = timeStart > timestamp ? 'w-post' : (timeEnd < timestamp ? 'w-past' : 'w-current');
		//timezone offset
		var offsetLabel = '';
		if (obj.tz && parseInt(obj.tz, 10) !== (-1 * time.getTimezoneOffset())) {
			obj.tz = parseInt(obj.tz, 10);
			var offset = obj.tz + time.getTimezoneOffset();
			timeStart = timeStart + (offset * 60 * 1000);
			timeEnd = timeEnd + (offset * 60 * 1000);
			offsetLabel = '(UTC'+ (obj.tz > 0 ? '+' : '')+ utils.zeroPad(obj.tz / 60, 2) +')';
		}
		//length
		var start 	= new Date(timeStart);
		var end 	= new Date(timeEnd);
		var length 	= Math.round((timeEnd - timeStart) / 1000);
		var endMinusOneSec = new Date(timeEnd - 1000);
		var dateLabel;
		var getStartingDate = function() {
			var date = dtp.formatDate(start, 'long');
			if (date === dtp.formatDate(time, 'long')) {
				return i18n.t('Today');
			} else if (date === dtp.formatDate((new Date(timestamp + 86400000)), 'long')) {
				return i18n.t('Tomorrow');
			} else {
				return i18n.t('On {{on}}', {on: date})
			}
		};
		if (dtp.formatDate(start) === dtp.formatDate(end)) { //same day event
			dateLabel = i18n.t('On {{on}} from {{from}} to {{to}}', {
				on: 	getStartingDate(),
				from: 	dtp.formatTime(start),
				to: 	dtp.formatTime(end)
			});
		} else if (dtp.formatDate(start) === dtp.formatDate(endMinusOneSec)) { //same day event
			timeStart = dtp.formatTime(start);
			if (timeStart !== '00:00') {
				dateLabel = i18n.t('On {{on}} from {{from}}', {
					on: getStartingDate(), from: timeStart
				});
			} else {
				dateLabel = getStartingDate();
			}
		} else {
			var oneDay = 86400;
			var oneWeek = 604800;
			var oneHour = 3600;
			if (length >= oneWeek && length % oneWeek === 0) {
				dateLabel = i18n.t('{{count}} week', {count: length / oneWeek});
			} else if (length >= oneDay && length % oneDay === 0 && length <= (oneWeek * 2)) {
				dateLabel = i18n.t('{{count}} day', {count: length / oneDay});
			} else if (length % oneHour === 0 && length <= oneDay) {
				dateLabel = i18n.t('{{count}} hour', {count: length / oneHour});
			}
			if (!dateLabel) {
				timeStart = dtp.formatTime(start);
				timeEnd = dtp.formatTime(end);
				dateLabel = i18n.t('From {{from}} to {{to}}', {
					from: 	dtp.formatDate(start, 'long') + (timeStart !== '00:00' ? ' ' + i18n.t('at {{at}}', {at: timeStart}) : ''),
					to: 	dtp.formatDate(end, 'long') + (timeEnd !== '00:00' ? ' ' + i18n.t('at {{at}}', {at: timeEnd}) : '')
				});
			} else {
				timeStart = dtp.formatTime(start);
				dateLabel = i18n.t('On {{on}} for {{for}}', {
					on: 	getStartingDate() + (timeStart !== '00:00' ? ' ' + i18n.t('at {{at}}', {at: timeStart}) : ''),
					for: 	dateLabel
				});
			}
		}
		if (offsetLabel) {
			dateLabel += ' '+offsetLabel;
		}
		switch (state) {
			case 'w-post':
				dateLabel = '<i class="fa fa-fast-forward w-yellow" title="'+ i18n.t('Upcoming') +'"></i> '+ dateLabel;
				break;
			case 'w-past':
				dateLabel = '<i class="fa fa-step-backward w-red" title="'+ i18n.t('Gone') +'"></i> '+ dateLabel;
				break;
			case 'w-current':
				dateLabel = '<i class="fa fa-play w-green" title="'+ i18n.t('Currently') +'"></i> '+ dateLabel;
				break;
		}
		if (moreDate && datesLength > 1) {
			dateLabel += '<br /><i class="fa fa-calendar-plus-o" aria-hidden="true"></i> <a href="" data-action="date-list" data-id="'+ obj.id +'">'+ i18n.t('{{count}} more date', {count: (datesLength - 1)}) +'</a>';
		}
		if (storeResult) {
			obj.state 		= state;
			obj.dateLabel 	= dateLabel;
		}
		return dateLabel;
	};


	self.getHeader = function (obj, collapse) {
		collapse = collapse || false;
		var title 		= utils.getWouafTitle(obj);
		var dateLabel 	= self.getDateLabel(obj);
		var locale 		= ' lang="'+ (obj.lang ? obj.lang.substr(0, 2) : i18n.t('languageShort')) +'"';
		if (obj.rtl) {
			locale += ' dir="rtl"';
		}
		return [
			'<div',
				(collapse
					? ' data-toggle="collapse" data-parent=".w-accordion" data-target="#collapse-'+ obj.id +'" class="panel-title collapsed w-title '+ obj.state +'"'
					: ' class="w-title '+ obj.state +'"'),
				' style="border-color:', categories.getColor(obj.cat) ,';">',
				'<div class="w-cat w-cat'+ categories.getRootId(obj.cat) +'"', locale ,'>',
					utils.escapeHtml(title),
				'</div>',
				'<div class="w-details">',
					dateLabel ,
					'<div class="w-meta">', self.getMeta(obj) ,'</div>',
					'<br /><span style="color:', categories.getDarkColor(obj.cat) ,'">' , categories.getLabel(obj.cat, true) , '</span>',
				'</div>',
			'</div>'
		].join('');
	};
	self.getMeta = function (obj){
		return (obj.children ? '<i class="fa fa-child" title="'+ i18n.t('For Children') +'"></i> ' : '')+
			(obj.pics && obj.pics.length ? '<i class="fa fa-picture-o" title="'+ i18n.t('Pictures') +'"></i> ' : '')+
			(obj.com ? '<a href="'+ url.getAbsoluteURLForStates([{name: 'wouaf', value: obj.id}, {name: 'windows', value: 'comments'}])+
					   '" data-action="comments" data-menu="wouaf"><i class="fa fa-comment"></i> '+ utils.round(obj.com) +'</a>' : '')
	};

	self.getWouaf = function (obj, collapse) {
		collapse = collapse || false;
		var text = utils.textToHTML(obj.text);
		var authorAvatar = user.getAvatar(obj.author, 16);
		var authorUrl = url.getAbsoluteURLForStates([{name: 'user', value: obj.author[1]}]);
		var author = i18n.t('By {{author}}', {
			author: '<a href="'+ authorUrl +'" data-user="'+ utils.escapeHtml(obj.author[1]) +'">'+
					utils.escapeHtml(obj.author[2] || obj.author[1]) +' '+ authorAvatar +'</a>',
			interpolation: {escapeValue: false}
		});
		var locale = ' lang="'+ (obj.lang ? obj.lang.substr(0, 2) : i18n.t('languageShort')) +'"';
		if (obj.rtl) {
			locale += ' dir="rtl"';
		}
		var content = ['<div data-id="'+ obj.id +'"',
			 	(collapse ? ' class="panel panel-default w-container">' : ' class="w-container">'),
			self.getHeader(obj, collapse),
			'<div',
				(collapse ? ' id="collapse-'+ obj.id +'" class="panel-collapse collapse w-content">' : ' class="w-content">'),
				'<button class="w-menu" data-id="'+ obj.id +'" type="button" data-menu="wouaf">',
					'<i class="fa fa-bars"></i> '+ i18n.t('Menu'),
				'</button>',
				'<div class="w-subTitle">', author ,'</div>',
					'<p class="w-text"', locale ,'>', text ,'</p>'];
		if (obj.url) {
			content.push('<p class="w-link"><a href="'+ obj.url +'" target="_blank"><i class="fa fa-external-link"></i> '+ i18n.t('More info') +'</a></p>');
		}
		if (obj.pics && obj.pics.length) {
			content.push('<div class="w-pics">');
			var pic;
			for(var i = 0, l = obj.pics.length; i < l; i++) {
				pic = obj.pics[i];
				if (pic.full && pic.full.substr(0, 4) === 'http') {
					content.push('<a rel="gallery-'+ obj.id +'" href="'+ pic.full +'" class="swipebox"><img src="'+ (pic.thumb ? pic.thumb : pic.full) +'" height="90" width="90" /></a>');
				}
			}
			content.push('</div>');
		}
		content = content.concat(['<a href="'+ url.getAbsoluteURLForStates([{name: 'wouaf', value: obj.id}, {name: 'windows', value: 'comments'}]) +'" class="w-comments" data-action="comments" data-menu="wouaf"><i class="fa fa-comment"></i> '+
							(obj.com ? i18n.t('{{count}} comment', {count: obj.com}) : i18n.t('Add a comment', {count: obj.com})) +'</a>',
				'</div>',
			'</div>']);
		return content.join('');
	};
	self.getClusterList = function(list, zoom) {
		var content = ['<div class="w-accordion">'];
		var l = list.length;
		var max = zoom !== 21 ? 50 : l;
		for(var i = 0; i < l && i < max ; i++) {
			content.push(self.getWouaf(list[i], true));
		}
		content.push('</div>');
		if (l > max) {
			content.push('<div class="w-more"><p class="text-muted text-center">'+ i18n.t('{{count}} more. Zoom in to see all of them', {count: l - max}) +'</p></div>');
		}
		return content.join('');
	};
	var $pin, props;
	self.shake = function(id, o) {
		if ($pin && $pin.length) {
			$pin.stop(true, true);
			$pin.css(props);
		}
		var $map = $('#map');
		$pin = $map.find('.baseMarker[data-id="'+ id +'"]');
		if (!$pin.length) {
			$pin = $map.find('.baseMarker[data-id*="'+ id +'"]');
		}
		if (!$pin.length) {
			return;
		}
		o = $.extend({
			direction: "left",
			distance: 3,
			times: 3,
			speed: 100,
			easing: "swing"
		}, o);
		// Create element
		props = {
			position: $pin.css("position"),
			top: $pin.css("top"),
			bottom: $pin.css("bottom"),
			left: $pin.css("left"),
			right: $pin.css("right")
		};
		// Adjust
		var ref = (o.direction === "up" || o.direction === "down") ? "top" : "left";
		var motion = (o.direction === "up" || o.direction === "left") ? "pos" : "neg";
		// Animation
		var animation = {}, animation1 = {}, animation2 = {};
		animation[ref] = (motion === "pos" ? "-=" : "+=")  + o.distance;
		animation1[ref] = (motion === "pos" ? "+=" : "-=")  + o.distance * 2;
		animation2[ref] = (motion === "pos" ? "-=" : "+=")  + o.distance * 2;
		// Animate
		$pin.animate(animation, o.speed, o.easing);
		for (var i = 1, l = o.times; i < l; i++) { // Shakes
			$pin.animate(animation1, o.speed, o.easing).animate(animation2, o.speed, o.easing);
		}
		$pin.animate(animation1, o.speed, o.easing).
		animate(animation, o.speed / 2, o.easing, function(){ // Last shake
			$pin.css(props); // Restore
		});
	};

	return self;
}());