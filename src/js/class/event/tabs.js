module.exports = (function() {
	var data = require('../resource/data.js');
	var i18n = require('../resource/i18n.js');
	var tab = require('../ui/tab.js');
	var map = require('../resource/map.js');
	var $document = $(document);
	var $tabs = $('.sb-slidebar .nav-tabs');
	var $tabsContent = $('.sb-slidebar .tab-content');
	var $dropdown = $tabs.find('.dropdown-menu');
	var $tabHead = $tabs.find('a.dropdown-toggle');

	$document.on('shown.bs.tab', 'a[data-toggle="tab"]', function(e) {
		if (e.relatedTarget) {
			var $previousTab = $(e.relatedTarget);
			var $activeTab = $(e.target);
			$previousTab.removeClass('active');
			if ($activeTab.hasClass('dropdown-item')) {
				$tabHead.html($activeTab.html());
				$tabHead.data('id', $activeTab.attr('id'));
			}
		}
	});

	$document.on('tabs.add', function(e, data) {
		if (!data || !data.id || !data.name) {
			return;
		}
		if ($('#'+ data.id).length) {
			$document.triggerHandler('tabs.remove', data.id);
		}
		var tabHead = '<a class="dropdown-item" id="tab-'+data.id+'" href="#'+ data.id +'" role="tab" data-toggle="tab">'+ data.name;
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
		}
		$tabsContent.append('<div role="tabpanel" class="tab-pane" id="' + data.id + '">' + content + '</div>');
	});

	$document.on('click', 'div.w-title', function(e) {
		if ($(e.target).parents('.tab-pane').length) {
			e.stopPropagation();
			var wouafId = $(e.target).parents('.w-container').data('id');
			map.showResult(wouafId);
		}
	});

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
		} else {
			$('#search').addClass('active');
			$('#tab-search').addClass('active');
		}
	});

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

	/*$document.triggerHandler('tabs.add', {
		id: 'test',
		name: '<i class="fa fa-list"></i> Coucou',
		data: {somedata: true},
		html: 'html de <strong>test</strong>',
		removable: true
	});*/
})();