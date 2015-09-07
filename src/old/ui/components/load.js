var loader = function () {
	// load images
	var createLoader = function () {
		var images = [];
		for (var i = 1; i < 24; i++) {
			images.push('/images/load/'+ i +'.png');
		}
		var loader = Ti.UI.createImageView({
			images:images,
			duration: 50, // frame duration
			repeatCount: 0,
			bottom: '51dp',
			right: '1dp',
			visible: false,
			zIndex: 15
		});
		return loader;
	}
	return {
		show: function() {
			this.loader.start();
			this.loader.show();
		},
		hide: function() {
			this.loader.hide();
			this.loader.stop();
		},
		getView: function() {
			if (!this.loader) {
				this.loader = createLoader();
			}
			return this.loader;
		}
	}	
}
module.exports = loader;