module.exports = (function() {
	var self = {};
	var data = require('../resource/data.js');
	var utils = require('../utils.js');
	var windows = require('../resource/windows.js');
	var i18n = require('../resource/i18n.js');
	var toast = require('../resource/toast.js');
	var twitterText = require('twitter-text');
	var query = require('../resource/query.js');
	var $document = $(document);
	var $modalWindow = $('#modalWindow');

	self.show = function () {
		var states = data.getObject('navigation');
		if (states.wouaf && utils.isValidWouafId(states.wouaf)) {
			//contact wouaf author
			if (!data.getString('uid')) { //user is not logged, close window
				windows.login(i18n.t('Login to contact a user'));
				return;
			}
			query.post(states.wouaf, function (result) {
				var title = result.wouaf.title || result.wouaf.text.substr(0, 49) +'…';
				$modalWindow.find('h4').html(i18n.t('Contacter un auteur'));
				$modalWindow.find('.contact-details').html(i18n.t('Utilisez le formulaire ci-dessous pour contacter {{author}}, auteur du Wouaf "{{title}}"', {title: title, author: result.wouaf.author[2] || result.wouaf.author[1]}));
				handleForm(result.wouaf.author[0], result.wouaf.id);
			}, function () {
				windows.close();
				var toast = require('../resource/toast.js');
				toast.show(i18n.t('Une erreur est survenue, impossible de contacter l\'auteur de ce Wouaf ...'));
			});
		} else if (states.user && utils.isValidUsername(states.user)) {
			//contact user
			if (!data.getString('uid')) { //user is not logged, close window
				windows.login(i18n.t('Login to contact a user'));
				return;
			}
			query.user(states.user, function (result) {
				$modalWindow.find('h4').html(i18n.t('Contacter un utilisateur'));
				$modalWindow.find('.contact-details').html(i18n.t('Utilisez le formulaire ci-dessous pour contacter {{user}}', {user: user}));
				handleForm(result.wouaf.author[0], result.wouaf.id);
			}, function () {
				windows.close();
				var toast = require('../resource/toast.js');
				toast.show(i18n.t('Une erreur est survenue, impossible de contacter cet utilisateur ...'));
			});
		} else {
			//contact Wouaf IT
			$modalWindow.find('h4').html(i18n.t('Contacter Wouaf IT'));
			$modalWindow.find('.contact-details').html(i18n.t('Utilisez le formulaire ci-dessous pour nous contacter. Tous les champs sont obligatoires.'));
			handleForm();
		}
	};
	var handleForm = function (recipientId, wouafId) {
		var $form = $modalWindow.find('form');
		var $remaining = $form.find('.remaining');
		var $content = $form.find('textarea[name=content]');

		//content count remaining chars
		$content.on('change keyup paste', function() {
			var count = 300 - twitterText.getUnicodeTextLength($content.val());
			if (count < 0) {
				count = 0;
				$content.val($content.val().substr(0, 2000));
			}
			$remaining.html(i18n.t('{{count}} character left', {count: count}));
		});

	};


	return self;
})();