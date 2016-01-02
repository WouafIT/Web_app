module.exports = (function() {
	var $modalWindow = $('#modalWindow');
	var i18n = require('../singleton/i18n.js');
	var self = {};

	var kmLabel = i18n.t('km');
	var radius = ['10 '+ kmLabel, '20 '+ kmLabel, '30 '+ kmLabel, '50 '+ kmLabel, '70 '+ kmLabel, '100 '+ kmLabel,
		'150 '+ kmLabel, '200 '+ kmLabel, '300 '+ kmLabel];
	var milesLabel = i18n.t('miles');
	var mlRadius = ['5 '+ milesLabel, '10 '+ milesLabel, '15 '+ milesLabel, '30 '+ milesLabel, '45 '+ milesLabel,
		'60 '+ milesLabel, '90 '+ milesLabel, '120 '+ milesLabel, '180 '+ milesLabel];


	self.show = function (e) {
		var data = require('../singleton/data.js');

		var $form = $modalWindow.find('form');
		var $radius = $form.find('select[name=radius]');
		var $unit = $form.find('select[name=unit]');
		var $facebook = $form.find('input[name=facebook]');
		var $contact = $form.find('input[name=contact]');
		var $wouafNotifications = $form.find('input[name=wouaf-notifications]');
		var $commentsNotifications = $form.find('input[name=comments-notifications]');
		//set current values
		$unit.val(data.getString('unit'));
		$facebook.attr("checked", data.getBool('fbPost'));
		$contact.attr("checked", data.getBool('allowContact'));
		$wouafNotifications.attr("checked", data.getBool('postNotif'));
		$commentsNotifications.attr("checked", data.getBool('commentNotif'));

		//populate radius select
		var populateRadius = function() {
			var selectedRadius = $radius.val();
			//get option index
			var index = selectedRadius ? $radius.find('option').index($radius.find('option[value='+ selectedRadius +']')) : 0;
			var radiusValues = [];
			var v, i, l;
			if ($unit.val() == 'km') {
				for(i = 0, l = radius.length; i < l; i++) {
					v = parseInt(radius[i], 10);
					radiusValues.push('<option value="'+ v +'"'+ (i == index ? ' selected="selected"' : '') +'>'+ radius[i] +'</option>');
				}
			} else {
				for(i = 0, l = mlRadius.length; i < l; i++) {
					v = parseInt(mlRadius[i], 10);
					radiusValues.push('<option value="'+ v +'"'+ (i == index ? ' selected="selected"' : '') +'>'+ mlRadius[i] +'</option>');
				}
			}
			$radius.html(radiusValues.join(''));
		};
		populateRadius();
		$radius.val(data.getInt('radius'));
		$unit.on('change', populateRadius);

		if (!data.getString('uid')) {
			$facebook.attr('disabled', true);
			$contact.attr('disabled', true);
			$wouafNotifications.attr('disabled', true);
			$commentsNotifications.attr('disabled', true);
		}

		$form.on('submit', function (event) {
			event.preventDefault();

			data.setString('unit', $unit.val());
			data.setInt('radius', $radius.val());

			if (data.getString('uid')) {
				data.setBool('fbPost', $facebook.prop("checked"));
				data.setBool('allowContact', $contact.prop("checked"));
				data.setBool('postNotif', $wouafNotifications.prop("checked"));
				data.setBool('commentNotif', $commentsNotifications.prop("checked"));
			}

			var windows = require('../singleton/windows.js');
			windows.close();
			var toast = require('../singleton/toast.js');
			toast.show(i18n.t('Settings saved!'));
		});
	}
	return self;
})();