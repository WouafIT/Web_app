module.exports = (function() {
	var data 			= require('../resource/data.js');
	var i18n 			= require('../resource/i18n.js');
	var tab 			= require('../ui/tab.js');
	var map 			= require('../resource/map.js');
	var slidebars 		= require('../resource/slidebars.js');
	var query 			= require('../resource/query.js');
	var $window			= $(window);
	var $document 		= $(document);
	var $slidebar 		= $('.sb-slidebar');
	var $tabsContent 	= $slidebar.find('.tab-content');
	var $tabs 			= $slidebar.find('.nav-tabs');
	var $dropdown 		= $tabs.find('.dropdown-menu');
	var $tabHead 		= $tabs.find('a.dropdown-toggle');
	var tabsData 		= {};

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
		var active = data.active || false;
		if ($('#'+ data.id).length) {
			if ($('#'+ data.id).hasClass('active')) {
				active = true;
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
			content = tab.getContent(data.data);
			tabsData[data.id] = data.data.data;
		}
		$tabsContent.append('<div role="tabpanel" class="tab-pane" id="' + data.id + '">' + content + '</div>');
		if (active) {
			$document.triggerHandler('tabs.show', data.id);
		}
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
		if (tabsData[name]) {
			tabsData[name] = null;
			delete tabsData[name];
		}
		if ($tabHead.data('id') === 'tab-'+ name) {
			var $activeTab = $dropdown.find('a:first-child');
			$tabHead.html($activeTab.html());
			$tabHead.data('id', $activeTab.attr('id'));
		}
	});

	//a tab is shown
	//load personal tab content if needed
	$document.on('tabs.shown', function(e, name) {
		if (name == 'tab-wouafs' && !tabsData['wouafs']) {
			var loadUserWouafs = function () {
				//load user tabs data
				query.userPosts(data.getString('uid'), function (data) {
					var content = tab.getContent({type: 'list', data: data}, false);
					tabsData['wouafs'] = data;
					var $tabPanel = $('#wouafs .results');
					$tabPanel.html(content);
				}, function (msg) {
					toast.show(i18n.t('An error has occurred: {{error}}', {error: i18n.t(msg[0])}), 5000);
				});
			};
			if (data.getString('uid')) {
				loadUserWouafs();
			} else {
				$document.one('app.logged', loadUserWouafs);
			}
		}
	});
	//clean personal tabs on logout
	$document.on('app.logout', function (e, state) {
		$('#wouafs .results').html('');
		$('#favorites .results').html('');
		tabsData['wouafs'] = null;
		delete tabsData['wouafs'];
		tabsData['favorites'] = null;
		delete tabsData['favorites'];
	});

	//show wouaf infowindow on click
	$document.on('click', 'div.w-title', function(e) {
		var $tab = $(e.target).parents('.tab-pane');
		if ($tab.length) {
			e.stopPropagation();
			var tabId = $tab.attr('id');
			var wouafId = $(e.target).parents('.w-container').data('id');
			//grab wouaf data from tab data
			if (tabsData[tabId]) {
				var obj;
				for(var i = 0, l = tabsData[tabId].results.length; i < l; i++) {
					obj = tabsData[tabId].results[i];
					if (obj.id == wouafId) {
						map.showResult(wouafId, obj);
						break;
					}
				}
			} else {
				map.showResult(wouafId);
			}
			if (!slidebars.isDualView()) {
				$document.triggerHandler('slide.close');
			}
		}
	});

	//(un)select wouaf in list on navigation change
	$document.on('navigation.set-state', function (e, state) {
		if (state && state.name == 'wouaf') {
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
		if (data.action == 'comments' || data.action == 'date-desc') {
			dir = 'desc';
		}
		$tabPanel.find('button.w-menu').data('sort', data.action);
		if (data.action == 'date-desc' || data.action == 'date-asc') {
			data.action = 'date';
		}
		$wouafList.sort(function(a, b) {
			return (dir == 'asc') ? $(a).data(data.action) - $(b).data(data.action) : $(b).data(data.action) - $(a).data(data.action);
		});
		$tabPanel.find('.row').html($wouafList);
	});
})();