module.exports = (function() {
	var i18n = require('./i18n.js');
	var $document = $(document);
	var $modal = $('#modalWindow');
	var $modalContent = $modal.find('.modal-content');
	var self = {};
	var shown = false;
	var onRemoteModalLoad = function(html, status) {
		if (status == 'success') {
			var $html = $(html);
			if ($html.data('event')) {
				$document.triggerHandler($html.data('event'));
			}
			if ($html.data('ui')) {
				var ui = require('../ui/'+ $html.data('ui') +'.js');
				if (ui && ui.show) {
					ui.show();
				}
			}
		} else {
			console.error(arguments);
		}
	};

	//open a modal from another modal
	$document.on('click', '[data-show="modal"]', function (event) {
		var $source = $(event.target);
		if ($source.length && $source.data('href')) {
			$modal.one('show.bs.modal', function() {
				$modalContent.load($source.data('href'), onRemoteModalLoad);
			});
			if (shown) {
				$modal.one('hidden.bs.modal', function() {
					$modal.modal('show');
				});
				$modal.modal('hide');
			}
		}
	});
	$modal.on('hidden.bs.modal', function (event) {
		$modalContent.html('');
		shown = false;
	});
	$modal.on('show.bs.modal', function (event) {
		shown = true;
		var $source = $(event.relatedTarget);
		if ($source.length && $source.data('href')) {
			$modalContent.load($source.data('href'), onRemoteModalLoad);
		}
	});
	self.show = function(options) {
		options = $.extend({
			title:		'',
			text:		'',
			footer:		'',
			open:		null,
			close:		null
		}, options);
		var open = function (options) {
			var content =
				'<div class="modal-header">' +
				'	<button type="button" class="close" data-dismiss="modal" aria-label="' + i18n.t('Close') + '">' +
				'		<span aria-hidden="true">&times;</span>' +
				'		<span class="sr-only">' + i18n.t('Close') + '</span>' +
				'	</button>' +
				'	<h4 class="modal-title">' + options.title + '</h4>' +
				' </div>' +
				'<div class="modal-body">' +
				options.text +
				'</div>' +
				'<div class="modal-footer">';
			if (options.footer) {
				content += options.footer;
			} else {
				content += '<button type="button" class="btn btn-secondary" data-dismiss="modal">' + i18n.t('Close') + '</button>';
			}
			content += '</div>';
			if (options.open) {
				$modal.one('show.bs.modal', function (event) {
					options.open(event);
				});
			}
			if (options.close) {
				$modal.one('hidden.bs.modal', function (event) {
					options.close(event);
				});
			}
			$modalContent.html(content);
			$modal.modal('show');
		}
		if (shown) {
			$modal.one('hidden.bs.modal', function() {
				open(options);
			});
			$modal.modal('hide');
		} else {
			open(options);
		}
	};
	return self;
})();