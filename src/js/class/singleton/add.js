module.exports = (function() {
	var data = require('./data.js');
	var windows = require('./windows.js');
	var i18n = require('./i18n.js');

	var $add = $('#add');
	var $body = $('body');
	$add.hide().removeAttr('hidden');

	var showCrosshair = function () {
		$body.append('<div class="ch" id="ch-t"></div><div class="ch" id="ch-l"></div><div class="ch" id="ch-r"></div><div class="ch" id="ch-b"></div><div class="ch" id="ch-c"></div>')
	};

	var hideCrosshair = function () {
		$body.find('.ch').hide("fast", function() {
			$(this).remove();
		});
	};

	var self = {};
	self.init = function() {
		$add.show();
		$add.on('click', function() {
			if (!data.getString('uid')) { //user is not logged, show login window
				windows.show({href: '/parts/login.html'});
			} else {
				windows.show({
					backdrop: false,
					title: 'Ajouter un nouveau Wouaf',
					text: 'Positionnez le centre de la carte ou vous souhaitez ajouter votre Wouaf et cliquez sur ... <button type="button" class="btn btn-primary" data-dismiss="modal">' + i18n.t('OK') + '</button>',
					footer: false,
					open: function () {
						$add.hide();
						showCrosshair();
						console.info('open !');
					},
					close: function () {
						$add.show();
						hideCrosshair();
						console.info('close: ', arguments);
					}
				});
			}
		});
	};
	return self;
})();