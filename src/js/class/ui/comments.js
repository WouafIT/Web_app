var data = require('../resource/data.js');
var utils = require('../utils.js');
var i18n = require('../resource/i18n.js');
var windows = require('../resource/windows.js');
var query = require('../resource/query.js');
var wouafs = require('../resource/wouafs.js');
var twitterText = require('twitter-text');
var alert = require('../resource/alert.js');
var comment = require('./comment.js');
var toast = require('../resource/toast.js');
var formUtils = require('./form-utils.js');
var user = require('../resource/user.js');

module.exports = (function() {
	var self = {};
	var $modalWindow = windows.getWindows();
	var $document = $(document);

	self.show = function () {
		var wouafId;
		var states = data.getObject('navigation');
		if (!states.wouaf || !utils.isId(states.wouaf)) {
			var options = windows.getOptions();
			if (options.data && options.data.wouafId && utils.isId(options.data.wouafId)) {
				wouafId = options.data.wouafId;
			} else {
				windows.close();
				return;
			}
		} else {
			wouafId = states.wouaf;
		}
		//comment wouaf
		$.when(wouafs.get(wouafId))
			.done(function(obj) {
				if (!obj) {
					windows.close();
					return;
				}
				var title = utils.getWouafTitle(obj);
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
					var $subscribeZone = $modalWindow.find('.comment-subscribe');
					var $unsubscribeZone = $modalWindow.find('.comment-unsubscribe');
					$subscribeZone.hide().removeAttr('hidden');
					$unsubscribeZone.hide().removeAttr('hidden');
					if (result.subscribed) {
						$unsubscribeZone.show();
						$form.find('input[name=subscribe]').prop("checked", false);
						$unsubscribeZone.on('click', function () {
							$unsubscribeZone.hide();
							query.unsubscribeComments(obj.id, function() {
								toast.show(i18n.t('Unsubscribing is taken into account'));
								$subscribeZone.show();
							},function(msg) {
								$unsubscribeZone.show();
								toast.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), 5000);
							});
						});
					} else {
						$subscribeZone.show();
					}

					if (result.count) {
						var comments = result.comments;
						$modalComments.data('id', obj.id);
						$modalComments.html('<p>'+ i18n.t('{{count}} comment', {count: result.count}) +'</p>');
						//paginate display
						var addSomeComments = function (comments) {
							var max = 30;
							if (!comments.length) {
								return;
							}
							var content = [];
							for (var i = 0, l = comments.length; i < max && l > 0; i++) {
								content.push(comment.getComment(comments[l - 1], obj));
								comments = comments.slice(0, -1);
								l--;
							}
							$modalComments.append(content.join(''));
							if (l) {
								$link = $('<a href="#">'+ i18n.t('View the next {{count}} comment', {count: l}) +'</a>');
								$link.on('click', function (e) {
									e.preventDefault();
									$(e.target).remove();
									addSomeComments(comments);
								});
								$modalComments.append($link);
							}
						};
						addSomeComments(comments);
					} else {
						$modalComments.html('<p class="text-muted">'+ i18n.t('No comment yet') +'</p>');
					}
				},function(msg) {
					windows.close();
					toast.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), 5000);
				});
			}).fail(function() {
				windows.close();
			}
		);

		function handleForm(obj) {
			var $form = $modalWindow.find('form');
			var $remaining = $form.find('.remaining');
			var $content = $form.find('textarea[name=content]');
			var $subscribe = $form.find('input[name=subscribe]');

			//content count remaining chars
			$content.on('change keyup paste', function() {
				var count = 1000 - twitterText.getUnicodeTextLength($content.val());
				if (count < 0) {
					count = 0;
					$content.val($content.val().substr(0, 1000));
				}
				$remaining.html(i18n.t('{{count}} character left', {count: count}));
			});
			$subscribe.prop("checked", true);

			//form field validation and submition
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
					subscribe:  ($subscribe.prop("checked") ? 1 : 0)
				}, function() {
					//add a Wouaf to user count
					user.set('com', parseInt(user.get('com'), 10) + 1);
					//Add a comment to the Wouaf
					obj.com++;
					wouafs.set(obj.id, obj);
					$document.triggerHandler('wouaf.update-comment', obj);
					windows.refresh();
					toast.show(i18n.t('Your comment is published'));

					$document.triggerHandler('app.added-comment', obj);
				}, function(msg) { //error
					alert.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), $form, 'danger');
				});
			});
		}
	};
	return self;
}());