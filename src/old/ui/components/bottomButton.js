var bottomButton = function(title, cb, numbers) {
    numbers = numbers || 4;
    var font = require('ui/components/font');
	var utils = require('class/utils');
	var divisor = (Ti.Platform.displayCaps.dpi <= 160 && Ti.Platform.osname === 'android') ? 99.9 : 100;
	var bt = Ti.UI.createButton({
        title: L(title),
        height: '50dp',
        width: ((divisor / numbers) + '%'),
        borderRadius: 0,
        font: font.arial18normal,
        color: font.white,
        image: utils.img + '/bottomButton/'+ title +'.png',
        backgroundImage: '/images/bottomButton.png',
        backgroundSelectedImage: '/images/bottomButton-on.png'
    });
    bt.setActive = function (active) {
    	if (active) {
    		bt.setBackgroundImage('/images/bottomButton-on.png');
    	} else {
    		bt.setBackgroundImage('/images/bottomButton.png');
    	}
    }
    bt.isActive = function () {
        if (bt.getBackgroundImage() == '/images/bottomButton-on.png') {
            return true;
        } else {
            return false;
        }
    }
    bt.resize = function (numbers) {
        bt.setWidth((divisor / numbers) + '%');
        return true;
    }
    if (cb) {
        bt.addEventListener('click', cb);
    }
    return bt
}
module.exports = bottomButton;