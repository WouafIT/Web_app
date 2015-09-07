var postListElement = function (datas, index) {
	var font = require('ui/components/font');
	var utils = require('class/utils');
	
	var row = Ti.UI.createTableViewRow({
		height: Ti.UI.SIZE,
		width: Ti.UI.FILL,
		/*className: 'r'+index,*/
		clickName: 'row',
		backgroundSelectedColor: font.black,
		elementIndex: index
	});
	
	var rowView = Ti.UI.createView({
		height: Ti.UI.SIZE,
		width: Ti.UI.FILL,
		touchEnabled: false
	});
	
	/*var isEventful = (datas.author[0] == 'eventful');*/
	
	//category img
	rowView.add(Ti.UI.createView({
		backgroundImage: /*(isEventful ? '/images/maps/cat/eventful.png' : */'/images/maps/cat/'+ datas.cat +'.png'/*)*/,
		top: '3dp',
		left: '1dp',
		width: '24dp',
		height: '31dp',
		touchEnabled: false
	}));

	//author
	rowView.add(Ti.UI.createLabel({
		color: font.grey,
		font: font.arial16bold,
		left: '28dp',
		top: 0,
		height: '16dp',
		width: '50%',
		touchEnabled: false,
		text: String.format(L('by_'), datas.author[1])
	}));

	//text
	rowView.add(Ti.UI.createLabel({
		color: font.white,
		font: font.arial18normal,
		left: '28dp',
		top: '14dp',
		height: 'auto',
		bottom: '21dp',
		right: '26dp',
		touchEnabled: false,
		text: datas.text
	}));
	
	//date
	var start = new Date();
	start.setTime(datas.date[0].sec * 1000);
	var length = datas.date[1].sec - datas.date[0].sec;
	var eventLength;
	var oneDay = 86400;
	var oneHour = 3600;
	if (length >= oneDay) {
		if (length % oneDay == 0 && (length / oneDay) < 10) {
			eventLength = length / oneDay;
			eventLength += eventLength > 1 ? ' ' + L('days') : ' ' + L('day');
		}
	} else  {
		if (length % oneHour == 0) {
			eventLength = length / oneHour;
			eventLength += eventLength > 1 ? ' ' + L('hours') : ' ' + L('hour');
		}
	}
	if (!eventLength) {
		var end = new Date();
		end.setTime(datas.date[1].sec * 1000);
		var timeStart = utils.formatTime(start);
        var timeEnd = utils.formatTime(end);
        eventLength = String.format(L('from_to'), utils.formatDate(start) + (timeStart != '00:00' ? ' '+ timeStart : ''), utils.formatDate(end) + (timeEnd != '00:00' ? ' '+ timeEnd : ''));
	} else {
		var timeStart = utils.formatTime(start);
		eventLength = String.format(L('on_for'), utils.formatDate(start) + (timeStart != '00:00' ? ' '+ timeStart : ''), eventLength);
	}
	var time = new Date();
	datas.status = (datas.date[0].sec * 1000) > time.getTime() ? 'post' : ((datas.date[1].sec * 1000) < time.getTime() ? 'past' : 'current');
    if (datas.status != 'current') {
    	//alert user than this post is not currently active
		eventLength += ' (' +(datas.status == 'post' ? L('not_yet_active') : L('finished')) + ')';
        rowView.add(Ti.UI.createLabel({
			color: font.orange,
			font: font.arial13normal,
			left: '28dp',
			bottom: '2dp',
			height: Ti.UI.SIZE,
			width: /*(!isEventful ? */'50%'/* : '100%')*/,
			touchEnabled: false,
			text: eventLength
		}));
	} else {
   		rowView.add(Ti.UI.createLabel({
			color: font.grey,
			font: font.arial13normal,
			left: '28dp',
			bottom: '2dp',
            height: Ti.UI.SIZE,
			width: /*(!isEventful ? */'50%'/* : '100%')*/,
			touchEnabled: false,
			text: eventLength
		}));
	}
	
	//pics
	if (datas.pics && datas.pics.length) {
		rowView.add(Ti.UI.createView({
			backgroundImage: '/images/img.png',
			top: '2dp',
			right: '4dp',
			width: '18dp',
			height: '18dp',
			touchEnabled: false
		}));
	}
	
	/*if (!isEventful) {
		//comments img
		rowView.add(Ti.UI.createView({
			backgroundImage: '/images/comments.png',
			bottom: '2dp',
			right: '4dp',
			width: '18dp',
			height: '18dp',
			touchEnabled: false
		}));
		//comments
		var commentsNb = parseInt(datas.com, 10);
		rowView.add(Ti.UI.createLabel({
			color: font.grey,
			font: font.arial13normal,
			right: '28dp',
			bottom: '2dp',
			height: '16dp',
			width: '40%',
			textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
			touchEnabled: false,
			text: commentsNb <= 1 ? ((commentsNb == 0 ? L('none') : '1') + ' ' + L('comment')) : commentsNb + ' ' + L('comments')
		}));
	}*/
	row.add(rowView);
	
	row.setSelected = function (selected) {
		if (selected) {
			rowView.setBackgroundColor(font.darkgreen);
		} else {
			rowView.setBackgroundColor(font.black);
		}
	}
	
	row.isSelected = function () {
		return rowView.getBackgroundColor() == font.darkgreen;
	}
	
	return row;
}
module.exports = postListElement;