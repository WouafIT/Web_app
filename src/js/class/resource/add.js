var data = require('./data.js');
var windows = require('./windows.js');
var i18n = require('./i18n.js');
var map = require('./map.js');
var slidebars = require('../resource/slidebars.js');

module.exports = (function() {
	var $document = $(document);
	var $mapArea = $('#sb-site');
	var $addZone = $('#add-zone');
	var $addBtn = $addZone.find('.add-btn');
	var $addOkBtn = $addZone.find('button.btn-primary.add');
	var $locationBtn = $addZone.find('button.btn-primary.location');
	var $addCancelBtn = $addZone.find('button.btn-secondary.cancel');
	$addOkBtn.hide();
	$locationBtn.hide();
	$addCancelBtn.hide();
	$addZone.removeAttr('hidden');
	$addOkBtn.popover({
		title: 		i18n.t('Add a new Wouaf'),
		content: 	i18n.t('Add_wouaf_popover_2', {interpolation: {escapeValue: false}}),
		html:		true,
		trigger: 	'manual',
		placement: 	'top',
		offset: 	'0 100',
		template: ['<div class="popover offset" role="tooltip">',
						'<button type="button" class="close" aria-label="'+ i18n.t('Close') +'">',
							'<span aria-hidden="true">&times;</span>',
						'</button>',
						'<h3 class="popover-title"></h3>',
						'<div class="popover-content"></div>',
					'</div>'].join('')
	});
	$addOkBtn.on('shown.bs.popover', function () {
		$('.popover .close').one('click', function () {
			data.setBool('showPopover', false);
			$addOkBtn.popover('hide');
		});
	});
	//recenter crosshair on slidebar open/close
	$document.on('slidebars.opened slidebars.close', function() {
		$('#ch-c').css({top:'calc(50% - 22px)', left:'calc(50% - 23px)'});
	});
	//show popover to explain how to create a wouaf after first login
	$document.on('app.logged', function () {
		if (data.getInt('loginCount') === 1) {
			$addBtn.popover({
				title: 		i18n.t('Add a new Wouaf'),
				content: 	i18n.t('Add_wouaf_popover_1', {interpolation: {escapeValue: false}}),
				html:		true,
				trigger: 	'manual',
				placement: 	'top',
				offset: 	'0 100',
				template: ['<div class="popover offset" role="tooltip">',
						   '<button type="button" class="close" aria-label="'+ i18n.t('Close') +'">',
						   		'<span aria-hidden="true">&times;</span>',
						   '</button>',
						   '<h3 class="popover-title"></h3>',
						   '<div class="popover-content"></div>',
						   '</div>'].join('')
			});
			$addBtn.on('shown.bs.popover', function () {
				$('.popover .close').one('click', function () {
					$addBtn.popover('hide');
				});
			});
			$addBtn.one('click', function () {
				$addBtn.popover('hide');
			});
			$addBtn.popover('show');
		}
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
			if (!slidebars.isDualView()) {
				$document.triggerHandler('slide.close');
			}
			$addOkBtn.show();
			if (data.getBool('userGeolocation')) {
				$locationBtn.show();
			}
			$addCancelBtn.show();
			showCrosshair();
			if (data.getBool('showPopover') !== false) {
				$addOkBtn.popover('show');
			}
		}
	};
	var cancelAdd = function() {
		$addOkBtn.hide();
		$locationBtn.hide();
		$addCancelBtn.hide();
		$addBtn.show();
		$addOkBtn.popover('hide');
		hideCrosshair();
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
				cancelAdd();
				windows.show({href: 'add'});
			}
		});
		$locationBtn.on('click', map.centerOnUser);
		$addCancelBtn.on('click', cancelAdd);
	};
	self.addWouaf = addWouaf;
	return self;
}());