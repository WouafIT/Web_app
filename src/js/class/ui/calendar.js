var data = require('../resource/data.js');
var utils = require('../utils.js');
var i18n = require('../resource/i18n.js');
var windows = require('../resource/windows.js');
var wouafs = require('../resource/wouafs.js');
var toast = require('../resource/toast.js');
var url = require('../resource/url.js');

module.exports = (function() {
	var self = {};
	var $modalWindow = windows.getWindows();
	var $document = $(document);

	self.show = function () {
		var wouafId;
		var states = data.getObject('navigation');
		if (!states.wouaf || !utils.isId(states.wouaf)) {
			var options = windows.getOptions();
			if (options.data && options.data.wouafId && utils.isId(options.data.wouafId)) {
				wouafId = options.data.wouafId;
			} else {
				windows.close();
				return;
			}
		} else {
			wouafId = states.wouaf;
		}
		//calendar for selected wouaf
		$.when(wouafs.get(wouafId))
			.done(function(obj) {
				if (!obj) {
					windows.close();
					return;
				}
				var $calendarDetails = $modalWindow.find('.import-wouaf-details');
				var $btnGoogle = $modalWindow.find('.btn-google');
				var $btnYahoo = $modalWindow.find('.btn-yahoo');
				//var $btnOutlook = $modalWindow.find('.btn-outlook');
				var $btnWindows = $modalWindow.find('.btn-windows');
				var $btnApple = $modalWindow.find('.btn-apple');

				var title = utils.getWouafTitle(obj);
				var wouafUrl = url.getAbsoluteURLForStates([{name: 'wouaf', value: obj.id}], true);
				var start = new Date(obj.date[0]);
				var end = new Date(obj.date[1]);
				var location = 'https://maps.google.com/?q='+ obj.loc[0] +','+ obj.loc[1];
				$calendarDetails.html(i18n.t('Choose your type of calendar below to insert the Wouaf {{title}}', {title: title}));

				$btnGoogle.on('click', function () {
					window.open('https://calendar.google.com/calendar/render?action=TEMPLATE'+
								'&text='+ encodeURIComponent(title) +
								'&dates='+ start.toISOString().replace('.000Z', 'Z').replace(/[:.-]+/g, '') +
									'/'+ end.toISOString().replace('.000Z', 'Z').replace(/[:.-]+/g, '') +
								'&details='+ encodeURIComponent(i18n.t('More details here'))+ wouafUrl +
								'&location='+ location +
								'&sf=true'+
								'&output=xml#eventpage_6');
				});
				$btnYahoo.on('click', function () {
					window.open('https://calendar.yahoo.com/?v=60&view=d&type=20'+
								'&title='+ encodeURIComponent(title) +
								'&st='+ start.toISOString().replace('.000Z', 'Z').replace(/[:.-]+/g, '') +
								'&et='+ end.toISOString().replace('.000Z', 'Z').replace(/[:.-]+/g, '') +
								'&desc='+ encodeURIComponent(i18n.t('More details here'))+ wouafUrl +
								'&in_loc='+ location);
				});
				/*$btnOutlook.on('click', function () {
					window.open('https://outlook.live.com/owa/'+
								'?startdt='+ encodeURIComponent(start.toISOString().replace('.000Z', 'Z').replace(/[.-]+/g, '')) +
								'&enddt='+ encodeURIComponent(end.toISOString().replace('.000Z', 'Z').replace(/[.-]+/g, '')) +
								'&subject='+ encodeURIComponent(title) +
								'&body='+ encodeURIComponent(i18n.t('More details here')) + wouafUrl +
								'&allday=false'+
								'&path=/calendar/view/Month');
				});*/
				var now = new Date();
				var ics = 'BEGIN:VCALENDAR\n'+
				'VERSION:2.0\n'+
				'BEGIN:VEVENT\n'+
				'DTSTAMP:'+ now.toISOString().replace('.000Z', 'Z').replace(/[:.-]+/g, '') +'\n'+
				'STATUS:CONFIRMED\n'+
				'DTSTART:'+ start.toISOString().replace('.000Z', 'Z').replace(/[:.-]+/g, '') +'\n'+
				'DTEND:'+ end.toISOString().replace('.000Z', 'Z').replace(/[:.-]+/g, '') +'\n'+
				'SUMMARY:'+ title +'\n'+
				'DESCRIPTION:'+ obj.text.replace(/[\n\r]/g, '\\n') +'\\n'+ i18n.t('More details here')+ wouafUrl +'\n'+
				'LOCATION:'+ location +'\n'+
				'TRANSP:OPAQUE\n'+
				'END:VEVENT\n'+
				'END:VCALENDAR';
				$btnWindows.attr('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(ics));
				$btnApple.attr('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(ics));
			}).fail(function() {
				windows.close();
			}
		);
	};
	return self;
}());