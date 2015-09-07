function textarea(label, text, view) {
	var font = require('ui/components/font');
	
	//View
	view = view || {};
	var viewConf = {
		top: '15dp',
		height: Ti.UI.SIZE,
		width: Ti.UI.FILL,
		layout: 'vertical'
	};
	for (var i in view) {
		viewConf[i] = view[i];
	}
	var self = Ti.UI.createView(viewConf);
	
	//label
	var labelConf = {
		color: font.white,
		font: font.arial22normal,
		left: '10dp',
		right: '10dp',
		height: 'auto'
	};
	for (var i in label) {
		labelConf[i] = label[i];
	}
	var labelView = Ti.UI.createLabel(labelConf);
	self.add(labelView);
	self.label = labelView;
	
	//textArea
	var textAreaConf = {
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		backgroundColor: font.white,
		color: font.black,
		font: font.arial20normal,
		left: '10dp',
		right: '10dp',
		height: 'auto',
		top: '5dp'
	}
	for (var i in text) {
		textAreaConf[i] = text[i];
	}
	var textArea = Ti.UI.createTextArea(textAreaConf);
	self.add(textArea);
	textArea.blur();
	self.textArea = textArea;
	
	return self;
};

module.exports = textarea;