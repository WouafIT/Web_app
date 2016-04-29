module.exports = (function() {
	var $document = $(document);

	//action event
	$document.on('click', 'a[data-action]', function (event) {
		var $this = $(this);
		event.stopPropagation();
		event.preventDefault();

		switch ($this.data('action')) {
			case 'add':
				var add = require('../resource/add.js');
				add.addWouaf();
				break;
		}
	});
})();