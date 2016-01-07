module.exports = (function() {
	var $document = $(document);
	var $modalWindow = $('#modalWindow');
	var toast = require('../singleton/toast.js');

	var self = {};
	self.show = function (e) {
		var data = require('../singleton/data.js');
		if (!data.getString('uid')) { //user is not logged, close window
			var windows = require('../singleton/windows.js');
			windows.close();
		}
		var $form = $modalWindow.find('form');
		var $content = $form.find('textarea[name=content]');
		var $dateStart = $form.find('input[name=date-start]');
		var $length = $form.find('select[name=length]');
		var $category = $form.find('select[name=category]');
		var $longitude = $form.find('select[name=longitude]');
		var $latitude = $form.find('select[name=latitude]');
		var $facebook = $form.find('input[name=facebook]');
		var $contact = $form.find('input[name=contact]');
		var $wouafNotifications = $form.find('input[name=wouaf-notifications]');


	};
	return self;
})();