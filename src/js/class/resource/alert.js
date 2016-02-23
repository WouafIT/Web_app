module.exports = (function() {
	var i18n = require('./i18n.js');

	var self = {};
	self.show = function(text, $parent, type) {
		type = type || 'warning';
		var $alert = $('<div class="alert alert-'+ type +' alert-dismissible fade in" role="alert">'+
					   '<button type="button" class="close" data-dismiss="alert" aria-label="'+ i18n.t('Close') +'">'+
					   '<span aria-hidden="true">&times;</span>'+
					   '<span class="sr-only">'+ i18n.t('Close') +'</span>'+
					   '</button>'+
					   '<p>'+ text +'</p>'+
					   '</div>');
		$parent.prepend($alert);
		$('#modalWindow').animate({
			scrollTop: 0
		}, 500);
		return $alert;
	};
	return self;
})();