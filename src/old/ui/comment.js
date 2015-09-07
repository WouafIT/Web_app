var comment = function (datas, deletable, postAuthor) {
	var font = require('ui/components/font');
	var utils = require('class/utils');
	
	var row = Ti.UI.createTableViewRow({
		height: Ti.UI.SIZE,
		width: Ti.UI.FILL,
		className: 'commentrow' + (deletable ? '_deletable' : '') + (postAuthor ? '_author' : ''),
		clickName: 'row',
		backgroundSelectedColor: font.black,
		comDatas: datas
	});
	
	row.add(Ti.UI.createLabel({
        color: font.white,
        font: font.arial20normal,
        left: '5dp',
        right: (deletable ? '22dp' : '5dp'),
        top: '3dp',
        height: Ti.UI.SIZE,
        bottom: '24dp',
        text: datas.text,
        autoLink: Ti.UI.Android.LINKIFY_ALL
    }));
    if (deletable) {
        var closeBtn = Ti.UI.createView({
            backgroundImage: utils.img + '/actions/delete.png',
            top: '2dp',
            right: '2dp',
            width: '14dp',
            clickName: 'delete',
            height: '14dp'
        });
        closeBtn.addEventListener('click', function() {
        	row.deleteComment(datas.id);
        });
        row.add(closeBtn);
    }
    
	var date = new Date();
    date.setTime(datas.ts.sec * 1000);
	
	row.add(Ti.UI.createLabel({
		color: (postAuthor ? font.green : font.grey),
		font: font.arial16bold,
		right: '5dp',
        bottom: '5dp',
		height: Ti.UI.SIZE,
		textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
		touchEnabled: false,
		text:datas.author[1] + ' '+ L('on') +' ' + utils.formatDate(date) +' '+ L('at') +' '+ utils.formatTime(date)
	}));
	
	return row;
}
module.exports = comment;