var activityIndicator = function(conf, win) {
	var activityIndicator;
	if (Ti.Platform.name === 'android') {
		activityIndicator = Ti.UI.Android.createProgressIndicator({
			message : conf.message,
			location : Ti.UI.Android.PROGRESS_INDICATOR_DIALOG,   // display in dialog 
			type : Ti.UI.Android.PROGRESS_INDICATOR_INDETERMINANT // display a spinner
		});
	} else {
		activityIndicator = Ti.UI.createActivityIndicator({
	  		message: conf.message,
			style: (Ti.Platform.name === 'iPhone OS' ? Ti.UI.iPhone.ActivityIndicatorStyle.DARK : Ti.UI.ActivityIndicatorStyle.DARK),
			top: 10,
			left: 10,
			height: 'auto',
			width: 'auto'
		});
	}
	if (win) {
		win.add(activityIndicator);
	}
	return activityIndicator;
};
module.exports = activityIndicator;