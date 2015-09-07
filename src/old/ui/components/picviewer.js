var picviewer = function (pics, page) {
    var font = require('ui/components/font');
	//create window
	var self = Ti.UI.createWindow({
		backgroundColor: font.black,
		exitOnClose: false,
		modal: true,
		navBarHidden: true,
		tabBarHidden: true
	});
	//close current window
	var close = function() {
		self.removeEventListener('android:back', close);
		self.close();
	}
	
    var scrollableView = Ti.UI.createScrollableView({
        showPagingControl: true
    });
    var views = [];
    for (var i = 0, l = pics.length; i < l; i++) {
        var pic = pics[i];
        if (pic) {
            var imgView = Ti.UI.createImageView({
                image: pic.p, //thumbnail or full photo
                defaultImage: '/images/img.png',
                backgroundColor: font.black,
                top: 0,
                left: 0,
                width: Ti.UI.FILL,
                height: Ti.UI.SIZE,
                canScale: true
            });
            views.push(imgView);
        }
    }
    scrollableView.setViews(views);
    scrollableView.setCurrentPage(page);
    self.add(scrollableView);
    
    var closeBtn = Ti.UI.createView({
        backgroundImage:'/images/close.png',
        top: '10dp',
        right: '10dp',
        width: '20dp',
        clickName: 'close',
        height: '20dp',
        zIndex: 4
    });
    closeBtn.addEventListener('click', close);
    self.add(closeBtn);
    
    self.addEventListener('android:back', close);
	
	return self;
}
module.exports = picviewer;