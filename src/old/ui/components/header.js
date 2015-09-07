var header = function(title, back, view, label) {
    var font = require('ui/components/font');
	
    view = view || {};
    label = label || {};
    back = back || null;
    //Buttons view
    var viewConf = {
        top: 0,
        backgroundColor: font.green,
        height: Ti.UI.SIZE,
        width: Ti.UI.FILL
    };
    for (var i in view) {
        viewConf[i] = view[i];
    }
    var self = Ti.UI.createView(viewConf);
    //left image
    if (back) {
		var backBt = Ti.UI.createImageView({
			height: '50dp',
			width: '20dp',
			left: 0,
			top: 0,
			image:'/images/back.png'
		});
		backBt.addEventListener('click', back);
		self.add(backBt);
	}
	var imgConf = {
        height: '50dp',
        width: '50dp',
        left: (back ? '20dp' : 0),
        top: 0,
        image:'/images/logo.png'
    };
    var imageView = Ti.UI.createImageView(imgConf);
    if (back) {
        imageView.addEventListener('click', back);
    }
    self.add(imageView);
    
    //right label
    var labelConf = {
        color: font.white,
        font: font.harlequin26bold,
        text: title,
        left: (back ? '75dp' : '55dp'),
        right: '5dp',
        height: 'auto'
    };
	for (var i in label) {
        labelConf[i] = label[i];
    }
    var labelView = Ti.UI.createLabel(labelConf);
    self.add(labelView);
    
    return self;
}
module.exports = header;