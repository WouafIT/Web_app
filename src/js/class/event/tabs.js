module.exports = (function() {
	//var $document = $(document);
	var data = require('../resource/data.js');
	var $tabs = $('.sb-slidebar .nav-tabs a[data-toggle="tab"]');

	$tabs.on('shown.bs.tab', function (e) {
		if (e.relatedTarget) {
			$(e.relatedTarget).removeClass('active');
		}
		console.info('active tab', e.target); // newly activated tab
		console.info('previous tab', e.relatedTarget); // previous active tab


	});
})();