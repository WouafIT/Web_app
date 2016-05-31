module.exports = (function() {
	var data = require('./data.js');
	var windows = require('./windows.js');
	var i18n = require('./i18n.js');
	var map = require('./map.js');
	var $mapArea = $('#sb-site');
	var $addZone = $('#add-zone');
	var $addBtn = $addZone.find('.add-btn');
	var $addOkBtn = $addZone.find('button.btn-primary');
	var $addCancelBtn = $addZone.find('button.btn-secondary');
	$addBtn.add($addOkBtn).hide();
	$addBtn.add($addCancelBtn).hide();
	$addZone.removeAttr('hidden');
	$addOkBtn.popover({
		title: i18n.t('Add a new Wouaf'),
		content: i18n.t('Add_wouaf_popover'),
		trigger: 'manual',
		placement: 'top',
		offset: '0 100',
		template: ['<div class="popover" role="tooltip">',
						'<div class="popover-arrow"></div>',
						'<button type="button" class="close" aria-label="'+ i18n.t('Close') +'">',
						'<span aria-hidden="true">&times;</span>',
						'</button>',
						'<h3 class="popover-title"></h3>',
						'<div class="popover-content"></div>',
					'</div>'].join('')
	});
	$addOkBtn.on('shown.bs.popover', function () {
		$('.popover').appendTo($mapArea);
		$('.popover .close').one('click', function () {
			data.setBool('showPopover', false);
			$addOkBtn.popover('hide');
		});
	});

	var showCrosshair = function () {
		$mapArea.append('<div class="ch" id="ch-t"></div><div class="ch" id="ch-l"></div><div class="ch" id="ch-r"></div><div class="ch" id="ch-b"></div>')
		$('#ch-t, #ch-b').animate({height: '50%'}, {
			duration: 400,
			queue: 'ch'
		});
		$('#ch-l, #ch-r').animate({width: '50%'}, {
			duration: 400,
			queue: 'ch'
		}).promise('ch').done(function() {
			$mapArea.append('<div class="ch" id="ch-c"></div>');
			$('#ch-c').animate({
				left: '-=22px',
				top:  '-=23px',
				width: '46px',
				height: '46px'
			}, {
				duration: 300
			});
		});
		$('#ch-t, #ch-b, #ch-l, #ch-r').dequeue("ch");
	};

	var hideCrosshair = function () {
		$('#ch-t, #ch-b').animate({height: '0%'}, {
			duration: 400,
			queue: 'ch'
		});
		$('#ch-l, #ch-r').animate({width: '0%'}, {
			duration: 400,
			queue: 'ch'
		}).promise('ch').done(function() {
			$mapArea.find('.ch').remove();
		});
		$('#ch-c').animate({
			left: '-=53px',
			top:  '-=52px',
			width: '150px',
			height: '150px',
			opacity: 0
		}, {
			duration: 300,
			queue: 'ch'
		});
		$mapArea.find('.ch').dequeue("ch");
	};

	var addWouaf = function() {
		if (!data.getString('uid')) { //user is not logged, show login window
			windows.login(i18n.t('Login to create a new wouaf'));
		} else {
			$addBtn.hide();
			$addOkBtn.show();
			$addCancelBtn.show();
			showCrosshair();
			if (data.getBool('showPopover') !== false) {
				$addOkBtn.popover('show');
			}
		}
	};

	var self = {};
	self.init = function() {
		$addBtn.show();
		$addBtn.on('click', addWouaf);
		$addOkBtn.on('click', function() {
			var zoom = map.getMap().getZoom();
			if (zoom < 13) {
				windows.show({
					title: i18n.t('Lack of precision'),
					text: i18n.t('lack_of_precision_details')
				});
			} else {
				$addOkBtn.hide();
				$addCancelBtn.hide();
				$addBtn.show();
				$addOkBtn.popover('hide');
				hideCrosshair();
				windows.show({href: 'add'});
			}
		});
		$addCancelBtn.on('click', function() {
			$addOkBtn.hide();
			$addCancelBtn.hide();
			$addBtn.show();
			$addOkBtn.popover('hide');
			hideCrosshair();
		});
	};
	self.addWouaf = addWouaf;
	return self;
})();