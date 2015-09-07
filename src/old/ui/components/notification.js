var notification = function(msg, title) {
    if (Ti.Platform.osname === 'android') {
        var self = Ti.UI.createNotification({message: msg});
        self.show();
        return self;
    } else {
        //TODO
    }
}
module.exports = notification;