module.exports = (function() {
	var $document = $(document);
	var windows = require('../singleton/windows.js');

	$(window).on('popstate', function(event) {
		var state = event.originalEvent.state;
		//TODO : handle hash like #wouafs or #search
		if (!state || state.windows === false) {
			windows.close();
		} else if (state.windows === true) {
			if (state.href) {
				windows.show({href: state.href});
			}
		}
	});

	$document.on('app.load-state', function(event, callback) {
		var pathname = window.location.pathname;
		if (pathname === '/') {
			//Nothing to do
		} else if(pathname.substr(0,8) === '/wouaf/') {
			//TODO : load wouafs URL
			return;
		} else if(pathname.substr(0,6) === '/user/') {
			//TODO : load users URL
			return;
		} else if(pathname.substr(0,9) === '/cluster/') {
			//TODO : load cluster URL
			return;
		} else {
			//load queried windows
			var part = '/parts/'+pathname.substr(1, (pathname.length - 2))+'.html';
			windows.show({href: part});
		}
		//load default map position and search
		callback();
	});


})();