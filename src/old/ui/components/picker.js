function picker(label, picker) {
	var font = require('ui/components/font');
	
	//View
	var self = Ti.UI.createView({
		top: '15dp',
		height: Ti.UI.SIZE,
		width: Ti.UI.FILL,
		layout: 'vertical',
	});
	
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
	
	//picker
	var pickerConf = {
		color: font.white,
        left: '10dp',
		right: '10dp',
		height: 'auto',
		top: '5dp',
		selectionIndicator: true
	}
	for (var i in picker) {
		pickerConf[i] = picker[i];
	}
	var pickerField = Ti.UI.createPicker(pickerConf);
	self.add(pickerField);
	self.pickerField = pickerField;
	
	return self;
};

module.exports = picker;