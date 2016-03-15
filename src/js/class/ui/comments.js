module.exports = (function() {
	var self = {};
	var map = require('../resource/map.js');
	var data = require('../resource/data.js');
	var utils = require('../utils.js');
	var i18n = require('../resource/i18n.js');
	var windows = require('../resource/windows.js');
	var query = require('../resource/query.js');
	var twitterText = require('twitter-text');
	var alert = require('../resource/alert.js');
	var comment = require('./comment.js');
	var $modalWindow = windows.getWindows();
	var $document = $(document);

	self.show = function () {
		var states = data.getObject('navigation');
		if (states.wouaf && utils.isValidWouafId(states.wouaf)) {
			//comment wouaf
			$.when(map.getResult(states.wouaf))
				.done(function(obj) {
					if (!obj) {
						windows.close();
						return;
					}
					var title = obj.title || obj.text.substr(0, 49) +'…';
					if (obj.com) {
						$modalWindow.find('.modal-title').html(i18n.t('{{count}} comment for {{title}}', {
							count: obj.com,
							title: title
						}));
					} else {
						$modalWindow.find('.modal-title').html(i18n.t('Add a comment for {{title}}', {
							title: title
						}));
					}
					var $modalBody = $modalWindow.find('.modal-body');
					var $form = $modalWindow.find('form');
					$form.hide().removeAttr('hidden');
					if (!data.getString('uid')) { //user is not logged, show an alert
						alert.show(i18n.t('Login to add a comment'), $modalBody);
					} else {
						$form.show();
						handleForm(obj);
					}
					//load comments
					query.getComments(obj.id, function(result) {
						var $modalComments = $modalWindow.find('.modal-comments');
						var l = result.comments.length;
						if (l) {
							$modalComments.data('id', obj.id);
							var comment = require('./comment.js');
							var content = ['<p>'+ i18n.t('{{count}} comment', {count: result.count}) +'</p>'];
							for (var i = l - 1; i >= 0; i--) {
								content.push(comment.getComment(result.comments[i], obj));
							}
							$modalComments.html(content.join(''));
						} else {
							$modalComments.html('<p class="text-muted">'+ i18n.t('No comment yet') +'</p>');
						}
					},function(msg) {
						windows.close();
						var toast = require('../resource/toast.js');
						toast.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), 5000);
					});
				}).fail(function() {
					windows.close();
				}
			);
		} else {
			windows.close();
		}
		function handleForm(obj) {
			var $form = $modalWindow.find('form');
			var $remaining = $form.find('.remaining');
			var $content = $form.find('textarea[name=content]');
			var $notif = $form.find('input[name=notif]');

			//content count remaining chars
			$content.on('change keyup paste', function() {
				var count = 1000 - twitterText.getUnicodeTextLength($content.val());
				if (count < 0) {
					count = 0;
					$content.val($content.val().substr(0, 1000));
				}
				$remaining.html(i18n.t('{{count}} character left', {count: count}));
			});
			$notif.attr("checked", data.getBool('commentNotif'));

			//form field validation and submition
			var formUtils = require('./form-utils.js');
			formUtils.init($form, function () {
				//fields validation
				return true;
			}, function () {
				//form submition
				if (!$content.val()) {
					alert.show(i18n.t('Your form is incomplete, thank you to fill all the fields'), $form);
					return;
				}
				query.createComment({ //comment wouaf
					id:      	obj.id,
					text:       $content.val(),
					notif:    	$notif.val()
				}, function() {
					obj.com++;
					$document.triggerHandler('wouaf.update-comment', obj);
					windows.refresh();
					var toast = require('../resource/toast.js');
					toast.show(i18n.t('Your comment is published'));
				}, function(msg) { //error
					alert.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), $form, 'danger');
				});
			});
		}
	};
	return self;
})();