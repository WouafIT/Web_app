module.exports = (function() {
	var windows = require('../resource/windows.js');
	var toast = require('../resource/toast.js');
	var i18n = require('../resource/i18n.js');
	var query = require('../resource/query.js');
	var users = require('../resource/users.js');
	var $document = $(document);

	//action event
	$document.on('click', 'a[data-action], button[data-action]', function (event) {
		var $this = $(this);
		event.stopPropagation();
		event.preventDefault();

		switch ($this.data('action')) {
			case 'add':
				var add = require('../resource/add.js');
				add.addWouaf();
				break;
			case 'follow':

				break;
			case 'user-wouaf':
				var uid = $this.data('uid');
				if (!uid) {
					return;
				}
				$.when(users.get(uid)).done(function(user) {
					var username = user.firstname || user.lastname ? user.firstname +' '+ user.lastname : user.username;
					query.userPosts(uid, function (data) {
						windows.close();
						//load user tabs data
						$document.triggerHandler('tabs.add', {
							id: 'user-'+ uid,
							name: '<i class="fa fa-user"></i> '+ username,
							title: i18n.t('All Wouafs by {{username}}', {'username': username}),
							active: true,
							removable: true,
							data: {type: 'list', data: data}
						});
					}, function (msg) {
						toast.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), 5000);
					});
				}).fail(function(msg) {
					toast.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), 5000);
				});
				break;
			case 'user-followers':

				break;
			case 'user-following':

				break;
		}
	});
})();