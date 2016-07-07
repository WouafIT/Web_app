module.exports = (function() {
	var windows = require('../resource/windows.js');
	var i18n = require('../resource/i18n.js');
	var query = require('../resource/query.js');
	var data = require('../resource/data.js');
	var toast = require('../resource/toast.js');
	var $modalWindow = windows.getWindows();
	var self = {};

	var kmLabel = i18n.t('km');
	var radius = ['10 '+ kmLabel, '20 '+ kmLabel, '30 '+ kmLabel, '50 '+ kmLabel, '70 '+ kmLabel, '100 '+ kmLabel,
		'150 '+ kmLabel, '200 '+ kmLabel, '300 '+ kmLabel];
	var milesLabel = i18n.t('miles');
	var mlRadius = ['5 '+ milesLabel, '10 '+ milesLabel, '15 '+ milesLabel, '30 '+ milesLabel, '45 '+ milesLabel,
		'60 '+ milesLabel, '90 '+ milesLabel, '120 '+ milesLabel, '180 '+ milesLabel];


	self.show = function () {
		var $form = $modalWindow.find('form');
		var $radius = $form.find('select[name=radius]');
		var $unit = $form.find('select[name=unit]');
		var $mapFollow = $form.find('input[name=map-follow]');
		var $followingNotifications = $form.find('input[name=following-notifications]');
		var $followerNotification = $form.find('input[name=follower-notifications]');
		//set current values
		$unit.val(data.getString('unit'));
		$mapFollow.attr("checked", data.getBool('mapFollow'));
		
		var notifications = data.getObject('notifications');
		$followingNotifications.attr("checked", notifications.following);
		$followerNotification.attr("checked", notifications.follower);

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
			$followingNotifications.attr('disabled', true);
			$followerNotification.attr('disabled', true);
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
				notifications.following = !!$followingNotifications.prop("checked");
				notifications.follower = !!$followerNotification.prop("checked");
				
				data.setObject('notifications', notifications);
				//Query
				query.updateUser({
					notifications: notifications
				}, function(result) { //success
					//nothing
				}, function(msg) { //error
					toast.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), 5000);
				});
			}

			windows.close();
			toast.show(i18n.t('Settings saved!'));
		});
	};
	return self;
})();