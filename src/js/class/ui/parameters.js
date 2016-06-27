module.exports = (function() {
	var windows = require('../resource/windows.js');
	var i18n = require('../resource/i18n.js');
	var query = require('../resource/query.js');
	var data = require('../resource/data.js');
	var $modalWindow = windows.getWindows();
	var self = {};

	var kmLabel = i18n.t('km');
	var radius = ['10 '+ kmLabel, '20 '+ kmLabel, '30 '+ kmLabel, '50 '+ kmLabel, '70 '+ kmLabel, '100 '+ kmLabel,
		'150 '+ kmLabel, '200 '+ kmLabel, '300 '+ kmLabel];
	var milesLabel = i18n.t('miles');
	var mlRadius = ['5 '+ milesLabel, '10 '+ milesLabel, '15 '+ milesLabel, '30 '+ milesLabel, '45 '+ milesLabel,
		'60 '+ milesLabel, '90 '+ milesLabel, '120 '+ milesLabel, '180 '+ milesLabel];


	self.show = function (e) {
		var $form = $modalWindow.find('form');
		var $radius = $form.find('select[name=radius]');
		var $unit = $form.find('select[name=unit]');
		var $mapFollow = $form.find('input[name=map-follow]');
		//var $facebook = $form.find('input[name=facebook]');
		var $contact = $form.find('input[name=contact]');
		var $followingNotifications = $form.find('input[name=following-notifications]');
		var $wouafNotifications = $form.find('input[name=wouaf-notifications]');
		var $commentsNotifications = $form.find('input[name=comments-notifications]');
		//set current values
		$unit.val(data.getString('unit'));
		$mapFollow.attr("checked", data.getBool('mapFollow'));
		//$facebook.attr("checked", data.getBool('fbPost'));
		//$facebook.attr('disabled', data.getString('loginType') !== 'facebook');

		$contact.attr("checked", data.getBool('allowContact'));
		$followingNotifications.attr("checked", data.getBool('followingNotif'));
		$wouafNotifications.attr("checked", data.getBool('postNotif'));
		$commentsNotifications.attr("checked", data.getBool('commentNotif'));

		//populate radius select
		var populateRadius = function() {
			var selectedRadius = $radius.val();
			var radiusValues = [];
			var v, i, l, label;
			for(i = 0, l = radius.length; i < l; i++) {
				v = parseInt(radius[i], 10);
				label = $unit.val() == 'km' ? radius[i] : mlRadius[i];
				radiusValues.push('<option value="'+ v +'"'+ (v == selectedRadius ? ' selected="selected"' : '') +'>'+ label +'</option>');
			}
			$radius.html(radiusValues.join(''));
		};
		populateRadius();
		$radius.val(data.getInt('radius'));
		$unit.on('change', populateRadius);

		if (!data.getString('uid')) {
			//$facebook.attr('disabled', true);
			$contact.attr('disabled', true);
			$followingNotifications.attr('disabled', true);
			$wouafNotifications.attr('disabled', true);
			$commentsNotifications.attr('disabled', true);
		}

		//form field validation and submition
		var formUtils = require('./form-utils.js');
		formUtils.init($form, function ($field) {
			//fields validation
			return true;
		}, function () {
			//form submition
			data.setString('unit', $unit.val());
			data.setInt('radius', $radius.val());
			data.setBool('mapFollow', $mapFollow.prop("checked"));

			if (data.getString('uid')) {
				//data.setBool('fbPost', $facebook.prop("checked"));
				data.setBool('allowContact', $contact.prop("checked"));
				data.setBool('followingNotif', $followingNotifications.prop("checked"));
				data.setBool('postNotif', $wouafNotifications.prop("checked"));
				data.setBool('commentNotif', $commentsNotifications.prop("checked"));

				//Query
				query.updateUser({
					notifications: {
						allowContact: 	data.getBool('allowContact'),
						followingNotif: data.getBool('followingNotif'),
						postNotif: 		data.getBool('postNotif'),
						commentNotif: 	data.getBool('commentNotif')
					}
				}, function(result) { //success
					//nothing
				}, function(msg) { //error
					alert.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), $form, 'danger');
				});
			}

			windows.close();
			var toast = require('../resource/toast.js');
			toast.show(i18n.t('Settings saved!'));
		});
	};
	return self;
})();