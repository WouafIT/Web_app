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
		var interests;
		var id, obj;
		event.stopPropagation();
		event.preventDefault();
		if (__DEV__) {
			console.info('Handle data-action: '+ $this.data('action'));
		}
		switch ($this.data('action')) {
			case 'facebook-share':
				if (window.FB) {
					window.FB.ui({
						method: 'share',
						mobile_iframe: true,
						href: decodeURIComponent($this.data('href')),
						hashtag: '#wouafit',
						quote: i18n.t('{{user}} is on @WouafIT', {'user': decodeURIComponent($this.data('username')), interpolation: {escapeValue: false}})+' - '+i18n.t('Wouaf_IT_description')
					}, function(response){});
				}
				break;
			case 'search':
				//show results tabs
				$document.triggerHandler('tabs.show', 'search');
				//open sidebar
				$document.triggerHandler('slide.open');
				break;
			case 'add':
				add.addWouaf();
				break;
			case 'user-wouaf':
				uid = $this.data('uid');
				if (!uid) {
					return;
				}
				windows.close();
				$document.triggerHandler('tabs.user-wouafs', {user: uid});
				break;
			case 'interested':
				uid = data.getString('uid');
				if (!uid) { //user is not logged, show login window
					windows.login(i18n.t('Login to show your interest for a wouaf'));
					return;
				}
				id = $this.parents('.w-container').data('id');
				obj = wouafs.getLocal(id);
				if (!obj) {
					return;
				}
				interests 	= data.getArray('interests');
				if (utils.indexOf(interests, obj.id) === -1) {
					query.addInterest(obj.id, function() {
						obj.interest++;
						toast.show(i18n.t('Your interest for this Wouaf is saved'));
						$document.triggerHandler('app.added-interest', obj);
					}, function (msg) {
						toast.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), 5000);
					});
					interests.push(obj.id);
					data.setArray('interests', interests);
				}
				break;
			case 'notinterested':
				uid = data.getString('uid');
				if (!uid) { //user is not logged, return
					return;
				}
				id = $this.parents('.w-container').data('id');
				obj = wouafs.getLocal(id);
				if (!obj) {
					return;
				}
				interests 	= data.getArray('interests');
				if (utils.indexOf(interests, obj.id) !== -1) {
					query.removeInterest(obj.id, function() {
						obj.interest--;
						toast.show(i18n.t('Your disinterest for this Wouaf is saved'));
						$document.triggerHandler('app.deleted-interest', obj);
					}, function (msg) {
						toast.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), 5000);
					});
					delete interests[utils.indexOf(interests, obj.id)];
					data.setArray('interests', interests);
				}
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
			default:
				if (__DEV__) {
					console.info('No data-action: '+ $this.data('action'));
				}
				break;
		}
	});
}());