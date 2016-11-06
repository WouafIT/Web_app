var windows = require('../resource/windows.js');
var toast = require('../resource/toast.js');
var i18n = require('../resource/i18n.js');
var query = require('../resource/query.js');
var users = require('../resource/users.js');
var data = require('../resource/data.js');
var utils = require('../utils.js');
var add = require('../resource/add.js');
var wouafs = require('../resource/wouafs.js');
var wouaf = require('../ui/wouaf.js');

module.exports = (function() {
	var $document = $(document);
	var $popover;

	//user / wouaf links
	$document.on('click', 'a, button', function(e) {
		var $source = $(e.target);
		if (!$source.length) {
			return;
		}
		var $parents = $source.parents('a, button');
		if ($parents.length) {
			$source = $parents;
		}
		if (!$source.data('user') && !$source.data('tag')
								&& !$source.data('wouaf') && !$source.data('show')) {
			return;
		}
		e.preventDefault();
		if ($source.data('user') && utils.isValidUsername($source.data('user'))) {
			windows.show({
				href: 'user',
				navigationOpen: {name: 'user', value: $source.data('user')},
				navigationClose: {name: 'user', value: null}
			});
		} else if ($source.data('tag') && utils.isValidHashtag($source.data('wouaf'))) {
			$('#hashtag').val($source.data('tag'));
			$document.triggerHandler('app.search', {refresh: false});
		} else if ($source.data('wouaf') && utils.isId($source.data('wouaf'))) {
			map.showResult($source.data('wouaf'));
		} else if ($source.data('show') === 'modal' && $source.data('href') && utils.isValidPageName($source.data('href'))) {
			windows.show({href: $source.data('href')});
		}
	});

	//action event
	$document.on('click', 'a[data-action], button[data-action]', function (event) {
		var $this = $(this);
		var uid;
		var following;
		event.stopPropagation();
		event.preventDefault();
		if (__DEV__) {
			console.info('Handle data-action: '+ $this.data('action'));
		}
		switch ($this.data('action')) {
			case 'add':
				add.addWouaf();
				break;
			case 'user-wouaf':
				uid = $this.data('uid');
				if (!uid) {
					return;
				}
				$.when(users.get(uid)).done(function(user) {
					var username = utils.getUsername(user);
					query.userPosts(uid, function (result) {
						windows.close();
						//load user tabs data
						$document.triggerHandler('tabs.add', {
							id: 'user-'+ uid,
							name: '<i class="fa fa-user"></i> '+ username,
							title: i18n.t('{{count}} Wouaf by {{username}}', {count: result.results.length, 'username': username}),
							active: true,
							removable: true,
							data: {type: 'list', data: result}
						});
					}, function (msg) {
						toast.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), 5000);
					});
				}).fail(function(msg) {
					toast.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), 5000);
				});
				break;
			case 'follow-user':
				uid = $this.data('uid');
				if (!uid) {
					return;
				}
				following = data.getArray('following');
				if (utils.indexOf(following, uid) === -1) {
					query.followUser(uid, function () {
						following.push(uid);
						data.setArray('following', following);

						$.when(users.get(uid)).done(function(user) {
							user.followers++;

							windows.refresh();
							$document.triggerHandler('app.follow-user', uid);
							toast.show(i18n.t('You follow this Wouaffer'), 5000);
						});
					}, function (msg) {
						toast.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), 5000);
					});
				}
				break;
			case 'unfollow-user':
				uid = $this.data('uid');
				if (!uid) {
					return;
				}
				following = data.getArray('following');
				if (utils.indexOf(following, uid) !== -1) {
					query.unfollowUser(uid, function () {
						delete following[utils.indexOf(following, uid)];
						data.setArray('following', following);
						$.when(users.get(uid)).done(function(user) {
							user.followers--;

							windows.refresh();
							$document.triggerHandler('app.unfollow-user', uid);
							toast.show(i18n.t('You are no longer following this Wouaffer'), 5000);
						});
					}, function (msg) {
						toast.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), 5000);
					});
				}
				break;
			case 'user-followers':
				uid = $this.data('uid');
				if (!uid) {
					return;
				}
				$.when(users.get(uid)).done(function(user) {
					var username = utils.getUsername(user);
					query.userFollowers(uid, function (result) {
						windows.close();
						//load user tabs data
						$document.triggerHandler('tabs.add', {
							id: 'user-followers-'+ uid,
							name: '<i class="fa fa-angle-double-right"></i> '+ username,
							title: i18n.t('{{count}} Wouaffer following {{username}}', {count: result.results.length, 'username': username}),
							active: true,
							removable: true,
							data: {type: 'user', data: result}
						});
					}, function (msg) {
						toast.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), 5000);
					});
				}).fail(function(msg) {
					toast.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), 5000);
				});
				break;
			case 'user-following':
				uid = $this.data('uid');
				if (!uid) {
					return;
				}
				$.when(users.get(uid)).done(function(user) {
					var username = utils.getUsername(user);
					query.userFollowing(uid, function (result) {
						windows.close();
						//load user tabs data
						$document.triggerHandler('tabs.add', {
							id: 'user-following-'+ uid,
							name: '<i class="fa fa-angle-double-left"></i> '+ username,
							title: i18n.t('{{count}} Wouaffer followed by {{username}}', {count: result.results.length, 'username': username}),
							active: true,
							removable: true,
							data: {type: 'user', data: result}
						});
					}, function (msg) {
						toast.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), 5000);
					});
				}).fail(function(msg) {
					toast.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), 5000);
				});
				break;
			case 'date-list':
				id = $this.data('id');
				if (!id) {
					return;
				}
				$.when(wouafs.get(id)).done(function(obj) {
					if ($popover) {
						$popover.popover('dispose');
					}
					var content = '<p>'+ wouaf.getDatesListing(obj).join('<br />') +'</p>';
					$popover = $this;
					$popover.popover({
						title: 		i18n.t('All dates'),
						content: 	content,
						html: 		true,
						trigger: 	'focus',
						placement: 	'top',
						offset: 	'0 -60',
						template: ['<div class="popover date-list" role="tooltip">',
							'<button type="button" class="close" aria-label="'+ i18n.t('Close') +'">',
							'<span aria-hidden="true">&times;</span>',
							'</button>',
							'<h3 class="popover-title"></h3>',
							'<div class="popover-content"></div>',
							'</div>'].join('')
					});
					$popover.on('shown.bs.popover', function () {
						$('.popover .close').one('click', function () {
							$popover.popover('dispose');
						});
						$popover.parents('.w-container').parent().one('scroll', function () {
							$popover.popover('dispose');
						});
						$document.one('slidebars.open', function () {
							$popover.popover('dispose');
						});
						$document.one('slidebars.close', function () {
							$popover.popover('dispose');
						});
					});
					$popover.popover('show');
				}).fail(function(msg) {
					toast.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), 5000);
				});
				break;
		}
	});
}());