module.exports = (function() {
	var $ = require('jquery');
	var i18n = require('./i18n.js');
	var $modal = $('#modalWindow');
	var $modalContent = $modal.find('.modal-content');
	var self = {};
	$modal.on('hidden.bs.modal', function (event) {
		$modalContent.html('');
	});
	$modal.on('show.bs.modal', function (event) {
		console.info('show', event);
		var $source = $(event.relatedTarget);
		if ($source.length && $source.data('href')) {
			$modalContent.load($source.data('href'));
		}
	});
	self.show = function(options) {
		option = $.extend({
			title:		'',
			text:		'',
			footer:		'',
			open:		null,
			close:		null
		}, options);
		var content =
			'<div class="modal-header">'+
			'	<button type="button" class="close" data-dismiss="modal" aria-label="'+ i18n.t('Close') +'">'+
			'		<span aria-hidden="true">&times;</span>'+
			'		<span class="sr-only">'+ i18n.t('Close') +'</span>'+
			'	</button>'+
			'	<h4 class="modal-title" id="myModalLabel">'+ option.title +'</h4>'+
			' </div>'+
			'<div class="modal-body">'+
				option.text+
			'</div>';
		if (option.footer) {
			content +=
			'<div class="modal-footer">'+
			option.footer+
			'</div>';
		}
		if (option.open) {
			$modal.on('show.bs.modal', function(event) {
				jQuery.proxy(option.open, this , event)();
				$(this).off(event);
			});
		}
		if (option.close) {
			$modal.on('hidden.bs.modal', function(event) {
				jQuery.proxy(option.close, this , event)();
				$(this).off(event);
			});
		}
		$modalContent.html(content);
		$modal.modal('show');
	}

	return self;
})();