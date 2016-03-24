module.exports = (function() {
	var data = require('../resource/data.js');
	var i18n = require('../resource/i18n.js');
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
			}
		}
	});

	$document.on('tabs.add', function(e, data) {
		if (!data || !data.id || !data.name) {
			return;
		}
		if ($('#'+ data.id).length) {
			console.error('Error, tab with ID '+ data.id +' already exists');
			return;
		}
		var tab = '<a class="dropdown-item" id="tab-'+data.id+'" href="#'+ data.id +'" role="tab" data-toggle="tab">'+ data.name;
		if (data.removable) {
			tab += ' <button type="button" class="close" aria-label="'+ i18n.t('Close') +'"><span aria-hidden="true">&times;</span></button>';
		}
		tab += '</a>';
		$dropdown.append(tab);
		$tabsContent.append('<div role="tabpanel" class="tab-pane" id="'+ data.id +'">'+ data.html +'</div>');
	});

	$document.triggerHandler('tabs.add', {
		id: 'test',
		name: '<i class="fa fa-list"></i> Coucou',
		data: {somedata: true},
		html: 'html de <strong>test</strong>',
		removable: true
	});
})();