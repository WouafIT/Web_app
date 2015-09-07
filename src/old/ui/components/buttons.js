function buttons(left, leftCallback, right, rightCallback, view) {
	var font = require('ui/components/font');
	
	view = view || {};
	//Buttons view
	var viewConf = {
		top: '5dp',
		bottom: '5dp',
		height: Ti.UI.SIZE,
		width: Ti.UI.FILL
	};
	for (var i in view) {
		viewConf[i] = view[i];
	}
	var self = Ti.UI.createView(viewConf);
	//left button
	var leftConf = {
		height: '50dp',
		width: '35%',
		left: (right ? '10%' : '32.5%'),
		color: font.white,
		backgroundImage: '/images/buttons/button.png',
        backgroundSelectedImage: '/images/buttons/button-on.png',
        backgroundFocusedImage: '/images/buttons/button-on.png',
        backgroundDisabledImage: '/images/buttons/button-on.png'
	};
	for (var i in left) {
		leftConf[i] = left[i];
	}
	var leftButton = Ti.UI.createButton(leftConf);
	leftButton.addEventListener('click', leftCallback);
	self.add(leftButton);
	if (right) {
    	//right button
    	var rightConf = {
    		height: '50dp',
    		width: '35%',
    		right: '10%',
    		color: font.white,
            backgroundImage: '/images/buttons/button.png',
            backgroundSelectedImage: '/images/buttons/button-on.png',
            backgroundFocusedImage: '/images/buttons/button-on.png',
            backgroundDisabledImage: '/images/buttons/button-on.png'
    	};
    	for (var i in right) {
    		rightConf[i] = right[i];
    	}
    	var rightButton = Ti.UI.createButton(rightConf);
    	rightButton.addEventListener('click', rightCallback);
    	self.add(rightButton);
	}
	return self;
};
module.exports = buttons;