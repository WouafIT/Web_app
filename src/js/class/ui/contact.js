module.exports = (function() {
	var self = {};
	var data = require('../resource/data.js');
	var utils = require('../utils.js');
	var windows = require('../resource/windows.js');
	var i18n = require('../resource/i18n.js');
	var toast = require('../resource/toast.js');
	var twitterText = require('twitter-text');
	var query = require('../resource/query.js');
	var $modalWindow = $('#modalWindow');

	self.show = function () {
		var states = data.getObject('navigation');
		var $form = $modalWindow.find('form');
		var $email = $form.find('input[name=email]');
		$email.parents('.form-group').hide().removeAttr('hidden');
		if (states.wouaf && utils.isValidWouafId(states.wouaf)) {
			//contact wouaf author
			if (!data.getString('uid')) { //user is not logged, close window
				windows.login(i18n.t('Login to contact a user'));
				return;
			}
			query.post(states.wouaf, function (result) {
				var title = result.wouaf.title || result.wouaf.text.substr(0, 49) +'…';
				$modalWindow.find('h4').html(i18n.t('Contact an author'));
				$modalWindow.find('.contact-details').html(i18n.t('Use the form below to contact {{author}}, author of Wouaf {{title}}', {title: title, author: result.wouaf.author[2] || result.wouaf.author[1]}));
				handleForm(result.wouaf.author[0], result.wouaf.id);
			}, function () {
				windows.close();
				var toast = require('../resource/toast.js');
				toast.show(i18n.t('An error has occurred, you can not contact the author of this Wouaf'));
			});
		} else if (states.user && utils.isValidUsername(states.user)) {
			//TODO ? contact user
			windows.close();
			//contact user
			/*if (!data.getString('uid')) { //user is not logged, close window
				windows.login(i18n.t('Login to contact a user'));
				return;
			}
			query.user(states.user, function (result) {
				$modalWindow.find('h4').html(i18n.t('Contact a user'));
				$modalWindow.find('.contact-details').html(i18n.t('Use the form below to contact {{user}}', {user: user}));
				handleForm(result.user.uid);
			}, function () {
				windows.close();
				var toast = require('../resource/toast.js');
				toast.show(i18n.t('An error has occurred, you can not contact this user'));
			});*/
		} else {
			//contact Wouaf IT
			$modalWindow.find('h4').html(i18n.t('Contact Wouaf IT'));
			$modalWindow.find('.contact-details').html(i18n.t('Use the form below to contact us. All fields are mandatory'));
			if (!data.getString('uid')) {
				$email.parents('.form-group').show();
			}
			handleForm();
		}
	};
	var handleForm = function (recipientId, wouafId) {
		var $form = $modalWindow.find('form');
		var $remaining = $form.find('.remaining');
		var $content = $form.find('textarea[name=content]');
		var $email = $form.find('input[name=email]');

		//content count remaining chars
		$content.on('change keyup paste', function() {
			var count = 1000 - twitterText.getUnicodeTextLength($content.val());
			if (count < 0) {
				count = 0;
				$content.val($content.val().substr(0, 1000));
			}
			$remaining.html(i18n.t('{{count}} character left', {count: count}));
		});

		//form field validation and submition
		var formUtils = require('./form-utils.js');
		formUtils.init($form, function ($field) {
			//fields validation
			switch($field.attr('name')) {
				case 'email':
					return utils.isValidEmail($field.val());
					break;
			}
			return true;
		}, function () {
			//form submition
			var alert = require('../resource/alert.js');
			var emailMandatory = (!recipientId && !wouafId && !data.getString('uid'));
			if (!$content.val() || (emailMandatory && !$email.val())) {
				alert.show(i18n.t('Your form is incomplete, thank you to fill all the fields'), $form);
				return;
			}
			if (recipientId && wouafId) { //contact wouaf author
				query.contactUser({
					text:       $content.val(),
					contact:    recipientId,
					id:         wouafId
				}, function() {
					windows.close();
					var toast = require('../resource/toast.js');
					toast.show(i18n.t('Your message is sent to the author of this Wouaf'));
				}, function(msg) { //error
					alert.show(i18n.t('An error has occurred, please try again later {{error}}', {error: i18n.t(msg[0])}), $form, 'danger');
				});
			} else {
				query.contact({ //contact wouaf it
					text:       $content.val(),
					email:    	$email.val()
				}, function() {
					windows.close();
					var toast = require('../resource/toast.js');
					toast.show(i18n.t('Your message is sent, we will come back to you as soon as possible'));
				}, function(msg) { //error
					alert.show(i18n.t('An error has occurred, please try again later {{error}}', {error: i18n.t(msg[0])}), $form, 'danger');
				});
			}
		});
	};
	return self;
})();