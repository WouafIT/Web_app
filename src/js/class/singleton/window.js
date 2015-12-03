module.exports = (function() {
	var $ = require('jquery');
	var i18n = require('./i18n.js');
	var $modal = $('#modalWindow');
	var $modalContent = $modal.find('.modal-content');
	var self = {};
	var shown = false;
	$modal.on('hidden.bs.modal', function (event) {
		$modalContent.html('');
		shown = false;
	});
	$modal.on('show.bs.modal', function (event) {
		console.info('show', event);
		shown = true;
		var $source = $(event.relatedTarget);
		if ($source.length && $source.data('href')) {
			$modalContent.load($source.data('href'));
		}
	});
	self.show = function(options) {
		if (shown) {
			$modal.modal('hide');
		}
		options = $.extend({
			title:		'',
			text:		'',
			footer:		'',
			open:		null,
			close:		null
		}, options);
		console.info(options);
		var content =
			'<div class="modal-header">'+
			'	<button type="button" class="close" data-dismiss="modal" aria-label="'+ i18n.t('Close') +'">'+
			'		<span aria-hidden="true">&times;</span>'+
			'		<span class="sr-only">'+ i18n.t('Close') +'</span>'+
			'	</button>'+
			'	<h4 class="modal-title" id="myModalLabel">'+ options.title +'</h4>'+
			' </div>'+
			'<div class="modal-body">'+
				options.text+
			'</div>'+
			'<div class="modal-footer">';
		if (options.footer) {
			content += options.footer;
		} else {
			content += '<button type="button" class="btn btn-secondary" data-dismiss="modal">'+ i18n.t('Close') +'</button>';
		}
		content += '</div>';
		if (options.open) {
			$modal.on('show.bs.modal', function(event) {
				options.open(event);
				$(this).off(event);
			});
		}
		if (options.close) {
			$modal.on('hidden.bs.modal', function(event) {
				console.info(options);
				options.close(event);
				$(this).off(event);
			});
		}
		$modalContent.html(content);
		$modal.modal('show');
	}

	return self;
})();