var data 			= require('../resource/data.js');
var i18n 			= require('../resource/i18n.js');
var tab 			= require('../ui/tab.js');
var map 			= require('../resource/map.js');
var slidebars 		= require('../resource/slidebars.js');
var query 			= require('../resource/query.js');
var toast 			= require('../resource/toast.js');
var windows 		= require('../resource/windows.js');
var wouafs 			= require('../resource/wouafs.js');
var utils 			= require('../utils.js');
var wouaf 			= require('../ui/wouaf.js');
var users 			= require('../resource/users.js');
var search 			= require('../ui/search.js');
var categories 		= require('../resource/categories.js');

module.exports = (function() {
	var $window			= $(window);
	var $document 		= $(document);
	var $slidebar 		= $('.sb-slidebar');
	var $tabsContent 	= $slidebar.find('.tab-content');
	var $tabs 			= $slidebar.find('.nav-tabs');
	var $dropdown 		= $tabs.find('.dropdown-menu');
	var $tabHead 		= $tabs.find('a.dropdown-toggle');
	var tabsData 		= {};

	$document.on('show.bs.collapse', '.w-collapse', function (e) {
		var $target = $(e.target);
		if (!$target.length) {
			return;
		}
		var id = $target.data('tab');
		$target.html(search.getSearchForm(id));

		var $panel = $target.parents('.tab-pane');
		var $panelContent = $panel.find('.w-tab-content');
		var els = $panelContent.find('.w-container').map(function() {
			return wouafs.getLocal($(this).data('id'));
		});
		//extract relevant data from elements
		var cats = {}, tags = {};
		for(var i = 0, li = els.length; i < li; i++) {
			var el = els[i];
			if (!cats[el.cat]) {
				cats[el.cat] = 0;
			}
			cats[el.cat]++;
			for(var j = 0, lj = el.tags.length; j < lj; j++) {
				if (!tags[el.tags[j]]) {
					tags[el.tags[j]] = 0;
				}
				tags[el.tags[j]]++;
			}
		}
		//populate search form with data
		var $categories = $target.find('#what'+ id);
		var categoriesHtml = '';
		Object.keys(cats)
			.sort()
			.forEach(function(k, i) {
				categoriesHtml += '<option value="'+ k +'">'+ categories.getLabel(k) +' ('+ cats[k] +')</option>';
			});
		$categories.html(categoriesHtml);

		var $tags = $target.find('#tags'+ id);
		var tagsHtml = '';
		Object.keys(tags)
			.sort()
			.forEach(function(k, i) {
				tagsHtml += '<option value="'+ k +'">'+ utils.ucfirst(k) +' ('+ tags[k] +')</option>';
			});
		$tags.html(tagsHtml);


		//var els = {};
		//$elements

		//getLocal
		//get tab wouafs
		//584ff5b17169cf20e754d408


		console.info(cats, tags);



	});


	$document.on('tabs.user-wouafs', function(e, eventData) {
		if (!eventData || !eventData.user) {
			return;
		}
		$.when(users.get(eventData.user)).done(function(user) {
			var uid = user.uid;
			var username = utils.getUsername(user);
			query.userPosts(uid, function (result) {
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
	});

	//switch tab (fix active indicator)
	$document.on('shown.bs.tab', 'a[data-toggle="tab"]', function(e) {
		if (e.relatedTarget) {
			var $previousTab = $(e.relatedTarget);
			var $activeTab = $(e.target);
			$previousTab.removeClass('active');
			if ($activeTab.hasClass('dropdown-item')) {
				$tabHead.html($activeTab.html());
				$tabHead.data('id', $activeTab.attr('id'));
			}
			$document.triggerHandler('tabs.shown', $activeTab.attr('id'));
		}
	});

	//add a new tab
	$document.on('tabs.add', function(e, data) {
		if (!data || !data.id || !data.name) {
			return;
		}
		var active 		= data.active || false;
		var openActive 	= true;
		if ($('#'+ data.id).length) {
			if ($('#'+ data.id).hasClass('active')) {
				active 		= true;
				openActive 	= false;
			}
			$document.triggerHandler('tabs.remove', data.id);
		}
		var tabHead = '<a class="dropdown-item" id="tab-'+ data.id +'" href="#'+ data.id +'" role="tab" data-toggle="tab">'+ data.name;
		if (data.removable) {
			tabHead += ' <button type="button" class="close" aria-label="'+ i18n.t('Close') +'"><span aria-hidden="true">&times;</span></button>';
		}
		tabHead += '</a>';
		$dropdown.append(tabHead);
		var content ='';
		if (data.html) {
			content = data.html;
		} else {
			content = tab.getContent(data.data, data.title, data.id);
		}
		$tabsContent.append('<div role="tabpanel" class="tab-pane" id="' + data.id + '">' + content + '</div>');
		$document.triggerHandler('tabs.resize');
		if (active) {
			$document.triggerHandler('tabs.show', data.id);
			if (openActive) {
				$document.triggerHandler('slide.open');
			}
		}
	});

	//resize tab content (for scrollbars)
	$document.on('tabs.resize', function() {
		var $container 		= $slidebar.find('>div.container');
		var containerHeight = $container.outerHeight();
		var tabsHeight 		= $container.find('>.row').outerHeight();
		$container.find('.tab-pane').each(function () {
			var $panel 		= $(this);
			var $tabHead 	= $panel.find('.w-tab-head');
			var $tabContent = $panel.find('.w-tab-content');
			if ($tabContent.length) {
				//console.info($tabHead.text(), $tabHead.outerHeight(), $tabHead.height());
				$tabContent.height(containerHeight - tabsHeight - ($tabHead.length ? 36 : 0));
			} else {
				$panel.addClass('scrollable');
				$panel.height(containerHeight - tabsHeight);
			}
		});
	});

	//show tab (show search tab if no name provided)
	$document.on('tabs.show', function(e, name) {
		$tabs.find('a').removeClass('active');
		$tabsContent.find('div.tab-pane').removeClass('active');
		if (name) {
			$('#'+ name).addClass('active');
			var $activeTab = $('#tab-'+ name);
			$activeTab.addClass('active');
			if ($activeTab.hasClass('dropdown-item')) {
				$tabHead.addClass('active');
				$tabHead.html($activeTab.html());
				$tabHead.data('id', $activeTab.attr('id'));
			}
			$document.triggerHandler('tabs.shown', $activeTab.attr('id'));
		} else {
			$('#search').addClass('active');
			$('#tab-search').addClass('active');
			$document.triggerHandler('tabs.shown', 'search');
		}
	});

	//remove tab
	$document.on('tabs.remove', function(e, name) {
		$dropdown.find('#tab-'+name).remove();
		var $tab = $tabsContent.find('#'+name);
		if ($tab.hasClass('active')) {
			$document.triggerHandler('tabs.show', $dropdown.find('a:first-child').attr('id').substr(4));
		}
		$tab.remove();
		if ($tabHead.data('id') === 'tab-'+ name) {
			var $activeTab = $dropdown.find('a:first-child');
			$tabHead.html($activeTab.html());
			$tabHead.data('id', $activeTab.attr('id'));
		}
	});

	var loadUserWouafs = function (force) {
		if ((tabsData['wouafs'] && !force) || !data.getString('uid')) {
			return;
		}
		//load user tabs data
		query.userPosts(data.getString('uid'), function (data) {
			var content = tab.getContent({type: 'list', data: data}, false);
			tabsData['wouafs'] = true;
			var $tabPanel = $('#wouafs .results');
			$tabPanel.html(content);
			//sort by date
			$document.triggerHandler('tabs.sort', {id: 'wouafs', action: 'date-desc'});
			//resize tabs
			$document.triggerHandler('tabs.resize');
		}, function (msg) {
			toast.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), 5000);
		});
	};

	var loadUserFavorites = function (force) {
		if ((tabsData['favorites'] && !force) || !data.getString('uid')) {
			return;
		}
		//load user tabs data
		query.userFavorites(function (data) {
			var content = tab.getContent({type: 'list', data: data}, false);
			tabsData['favorites'] = true;
			var $tabPanel = $('#favorites .results');
			$tabPanel.html(content);
			//sort by date
			$document.triggerHandler('tabs.sort', {id: 'favorites', action: 'date-desc'});
			//resize tabs
			$document.triggerHandler('tabs.resize');
		}, function (msg) {
			toast.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), 5000);
		});
	};

	var loadUserFollowing = function (force) {
		if ((tabsData['following'] && !force) || !data.getString('uid')) {
			return;
		}
		query.userFollowing(data.getString('uid'), function (data) {
			var title = i18n.t('You are following {{count}} Wouaffer', {count: data.results.length});
			var content = tab.getContent({type: 'user', data: data}, title);
			tabsData['following'] = true;
			var $tabPanel = $('#following .results');
			$tabPanel.html(content);
			//resize tabs
			$document.triggerHandler('tabs.resize');
		}, function (msg) {
			toast.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), 5000);
		});
	};

	//a tab is shown
	//load personal tab content if needed
	$document.on('tabs.shown', function(e, name) {
		if (name === 'tab-wouafs') {
			loadUserWouafs();
		} else if (name === 'tab-favorites') {
			loadUserFavorites();
		} else if (name === 'tab-following') {
			loadUserFollowing();
		}
	});
	//clean personal tabs on logout
	$document.on('app.logout', function (e, state) {
		$('#wouafs .results').html('');
		$('#favorites .results').html('');
		$('#following .results').html('');
		tabsData['wouafs'] = null;
		delete tabsData['wouafs'];
		tabsData['favorites'] = null;
		delete tabsData['favorites'];
		tabsData['following'] = null;
		delete tabsData['following'];
	});
	//load personal tabs on login
	$document.on('app.logged', function (e, state) {
		if ($('#wouafs').hasClass('active')) {
			loadUserWouafs();
		} else if ($('#favorites').hasClass('active')) {
			loadUserFavorites();
		} else if ($('#following').hasClass('active')) {
			loadUserFollowing();
		}
	});
	//update comment count
	$document.on('wouaf.update-comment', function(e, wouaf) {
		$tabsContent.find('.w-container[data-id="'+ wouaf.id +'"] .w-comments').html(
			'<i class="fa fa-comment"></i> '+ wouaf.com
		);
	});
	//delete wouaf
	$document.on('app.deleted-wouaf', function(e, wouaf) {
		$tabsContent.find('.w-container[data-id="'+ wouaf.id +'"]').remove();
	});

	//show wouaf infowindow on click
	$document.on('click', 'div.w-title', function(e) {
		var $tab = $(e.target).parents('.tab-pane');
		if ($tab.length) {
			e.stopPropagation();
			var $parent = $(e.target).parents('.w-container');
			var wouafId = $parent.data('id');
			if (wouafId) {
				$document.triggerHandler('navigation.disable-state');
				map.hideResult();
				map.showResult(wouafId);
				if (!slidebars.isDualView()) {
					$document.triggerHandler('slide.close');
				}
			} else if ($parent.data('user')) {
				var username = $parent.data('user');
				if (utils.isValidUsername(username)) {
					windows.show({
						href: 'user',
						navigationOpen: {name: 'user', value: username},
						navigationClose: {name: 'user', value: null}
					});
				}
			}
		}
	});
	//shake wouaf pin/cluster on hover
	if (slidebars.isDualView()) {
		$document.on('mouseenter', '.tab-pane .w-container[data-id]', function (e) {
			var wouafId = $(this).data('id');
			if (wouafId) {
				wouaf.shake(wouafId);
			}
		});
	}
	//(un)select wouaf in list on navigation change
	$document.on('navigation.set-state', function (e, state) {
		if (state && state.name === 'wouaf') {
			$tabsContent.find('div.w-title.selected').removeClass('selected');
			if (state.value) {
				var $el = $tabsContent.find('div.w-container[data-id="'+ state.value +'"]');
				if ($el.length) {
					$el.find('.w-title').addClass('selected');
					var offsetTop = $el.offset().top;
					if (offsetTop < 0 || offsetTop > $window.innerHeight()) {
						$slidebar.animate({
							scrollTop: offsetTop + $slidebar.scrollTop()
						}, 300);
					}
				}
			}
		}
	});

	//click on close tab buttons
	$document.on('click', 'button.close', function(e) {
		if ($(e.target).parents('.nav-tabs').length) {
			e.stopPropagation();
			e.preventDefault();
			var $parent = $(e.target).parents('a');
			var id = $parent.attr('id') || $parent.data('id');
			if (id && id.substr(0, 4) === 'tab-') {
				$document.triggerHandler('tabs.remove', id.substr(4));
			}
		}
	});

	//tab filter inactive wouaf
	$document.on('tabs.filter', function(e, data) {
		var $tabPanel = $('#'+ data.id);
		if (!$tabPanel.length) {
			return;
		}
		if (!data.action) {
			$tabPanel.find('.w-container').show();
		} else {
			$tabPanel.find('.w-container .w-past').parent().hide();
		}
		$tabPanel.find('button.w-menu').data('filter', data.action ? 'yes' : 'no');
	});

	//tab sort wouaf
	$document.on('tabs.sort', function(e, data) {
		var $tabPanel = $('#'+ data.id);
		if (!$tabPanel.length) {
			return;
		}
		var $wouafList = $tabPanel.find(".w-container");
		var dir = 'asc';
		if (data.action === 'comments'
			|| data.action === 'fav'
			|| data.action === 'interest'
			|| data.action === 'date-desc') {
			dir = 'desc';
		}
		$tabPanel.find('button.w-menu').data('sort', data.action);
		if (data.action === 'date-desc' || data.action === 'date-asc') {
			data.action = 'date';
		}
		$wouafList.sort(function(a, b) {
			return (dir === 'asc') ? $(a).data(data.action) - $(b).data(data.action) : $(b).data(data.action) - $(a).data(data.action);
		});
		$tabPanel.find('.w-tab-content').html($wouafList);
	});

	$document.on('app.added-favorite app.deleted-favorite', function (e, obj) {
		//TODO, add or remove obj from list instead of reloading all the list from the server
		loadUserFavorites(true);
	});
	$document.on('app.follow-user app.unfollow-user', function (e, obj) {
		//TODO, add or remove obj from list instead of reloading all the list from the server
		loadUserFollowing(true);
	});
	$document.on('app.deleted-wouaf app.added-wouaf', function (e, obj) {
		//TODO, add or remove obj from list instead of reloading all the list from the server
		loadUserWouafs(true);
	});
}());