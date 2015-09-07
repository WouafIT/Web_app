function textfield(label, text, view) {
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
	
	//textfield
	var textFieldConf = {
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_NONE,
		backgroundColor: font.white,
		color: font.black,
		left: '10dp',
		right: '10dp',
		height: 'auto',
		top: '5dp'
	}
	for (var i in text) {
		textFieldConf[i] = text[i];
	}
	var textField = Ti.UI.createTextField(textFieldConf);
	self.add(textField);
	textField.blur();
	self.textField = textField;
	
	return self;
};

module.exports = textfield;