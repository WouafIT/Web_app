function textimage(image, label, view) {
	var font = require('ui/components/font');
	
	//View
	view = view || {};
	var viewConf = {
		top: '5dp',
		height: Ti.UI.SIZE,
		width: Ti.UI.FILL,
		layout: 'composite',
		left: '10dp',
        right: '10dp'
	};
	for (var i in view) {
		viewConf[i] = view[i];
	}
	var self = Ti.UI.createView(viewConf);
	
	//image
	var imageConf = {
		backgroundImage: '/images/where.png',
		top: '2dp',
		left: '4dp',
		width: '18dp',
		height: '18dp',
		touchEnabled: false
	};
	for (var i in image) {
		imageConf[i] = image[i];
	}
	var imageView = Ti.UI.createView(imageConf);
	self.add(imageView);
	self.image = imageView;
	
	//label
	var labelConf = {
		color: font.white,
		font: font.arial22normal,
		left: '26dp',
		right: 0,
		top: 0,
		height: Ti.UI.SIZE
	};
	for (var i in label) {
		labelConf[i] = label[i];
	}
	var labelView = Ti.UI.createLabel(labelConf);
	
	self.add(labelView);
	self.label = labelView;
	
	return self;
};

module.exports = textimage;