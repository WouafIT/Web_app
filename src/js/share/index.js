/*!
 * Wouaf IT Web App
 *
 * Copyright 2016-2017, Sébastien PAUCHET
 * contact@wouaf.it
 * Licensed under the Apache-2.0 license.
 *
 */
if (typeof jQuery === 'undefined') {
	alert('Initialization error, please reload the page.');
}
(function($) {
	//Load styles
	require("../../less/pages/share.less");
	var i18n = require("../class/resource/i18n.js");
	var utils = require("../class/utils.js");
	var $document = $(document);

	$document.ready(function() {
		var params = utils.getQueryStringParams();
		var username = params.username || 'unknown';
		var displayname = params.displayname || params.username;
		var url = 'https://wouaf.it/user/'+ username +'/';
		$('svg').html(
			'<text font-weight="600" font-size="36px" y="60px" x="335px" fill="#ffffff" text-anchor="middle">'+
				i18n.t('{{user}} est sur', {user: displayname})+
			'</text>'+
			'<text font-weight="600" font-size="18px" y="240px" x="335px" fill="#ffffff" text-anchor="middle">'+
				i18n.t('Find all our events!')+
			'</text>'+
			'<text font-size="18px" y="275px" x="335px" fill="#ffffff" text-anchor="middle">'+ utils.escapeHtml(url) +'</text>'
		);
		$('.qrcode').qrcode({
			width: 160,
			height: 160,
			text: url
		});
		window.print();
	});
}(jQuery));