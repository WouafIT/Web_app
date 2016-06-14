module.exports = (function() {
	var windows = require('../resource/windows.js');
	var toast = require('../resource/toast.js');
	var i18n = require('../resource/i18n.js');
	var query = require('../resource/query.js');
	var users = require('../resource/users.js');
	var data = require('../resource/data.js');
	var utils = require('../utils.js');
	var $document = $(document);

	//user / wouaf links
	$document.on('click', 'a, button', function(e) {
		var $source = $(e.target);
		if (!$source.length || (!$source.data('user')/* && !$source.data('hash')*/
								&& !$source.data('wouaf') && !$source.data('show'))) {
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
		} else if ($source.data('wouaf') && utils.isId($source.data('wouaf'))) {
			map.showResult($source.data('wouaf'));
		} else if ($source.data('show') == 'modal' && $source.data('href') && utils.isValidPageName($source.data('href'))) {
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
				var add = require('../resource/add.js');
				add.addWouaf();
				break;
			case 'user-wouaf':
				uid = $this.data('uid');
				if (!uid) {
					return;
				}
				$.when(users.get(uid)).done(function(user) {
					var username = user.firstname || user.lastname ? user.firstname +' '+ user.lastname : user.username;
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
					var username = user.firstname || user.lastname ? user.firstname +' '+ user.lastname : user.username;
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
					var username = user.firstname || user.lastname ? user.firstname +' '+ user.lastname : user.username;
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
		}
	});
})();