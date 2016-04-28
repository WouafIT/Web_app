module.exports = (function() {
	var data = require('../resource/data.js');
	var categories = require('../resource/categories.js');
	var url = require('../resource/url.js');
	var $document = $(document);
	var ga = window.ga;
	if (!ga) {
		if (__DEV__)
			console.error('GA is not loaded');
		return;
	}
	//login
	$document.on('app.logged', function () {
		if (__DEV__)
			console.info('Analytics - set - userId - '+ data.getString('uid'));
		ga('set', 'userId', data.getString('uid'));
	});
	//logout
	$document.on('app.logout', function () {
		if (__DEV__)
			console.info('Analytics - set - userId - null');
		ga('set', 'userId', null);
	});
	//add wouaf
	$document.on('app.added-wouaf', function (event, wouaf) {
		ga('send', 'event', 'wouaf', 'add', categories.getLabel(wouaf.cat), wouaf.cat);
	});
	//delete wouaf
	$document.on('app.deleted-wouaf', function (event, wouaf) {
		ga('send', 'event', 'wouaf', 'delete', categories.getLabel(wouaf.cat), wouaf.cat);
	});
	//report wouaf
	$document.on('app.reported-wouaf', function (event, wouaf) {
		ga('send', 'event', 'wouaf', 'report', categories.getLabel(wouaf.cat), wouaf.cat);
	});
	//add comment
	$document.on('app.added-comment', function (event, wouaf) {
		ga('send', 'event', 'comment', 'add', categories.getLabel(wouaf.cat), wouaf.cat);
	});
	//delete comment
	$document.on('app.deleted-comment', function (event, wouaf) {
		ga('send', 'event', 'comment', 'delete', categories.getLabel(wouaf.cat), wouaf.cat);
	});
	//report comment
	$document.on('app.reported-comment', function (event, wouaf) {
		ga('send', 'event', 'comment', 'report', categories.getLabel(wouaf.cat), wouaf.cat);
	});
	//add favorite
	$document.on('app.added-favorite', function (event, wouaf) {
		ga('send', 'event', 'favorite', 'add', categories.getLabel(wouaf.cat), wouaf.cat);
	});
	//delete favorite
	$document.on('app.deleted-favorite', function (event, wouaf) {
		ga('send', 'event', 'favorite', 'delete', categories.getLabel(wouaf.cat), wouaf.cat);
	});
	//send contact (Wouaf)
	$document.on('app.wouaf-contact', function (event, wouaf) {
		ga('send', 'event', 'contact', 'wouaf', categories.getLabel(wouaf.cat), wouaf.cat);
	});
	//send contact (WouafIt)
	$document.on('app.wouafit-contact', function () {
		ga('send', 'event', 'contact', 'wouafit');
	});
	//create profile
	$document.on('app.created-profile', function (event, language) {
		ga('send', 'event', 'profile', 'create', language);
	});
	//delete profile
	$document.on('app.deleted-profile', function (event, language) {
		ga('send', 'event', 'profile', 'delete', language);
	});
	//edit profile
	$document.on('app.edit-profile', function (event, language) {
		ga('send', 'event', 'profile', 'edit', language);
	});
	//app init
	$document.on('app.started', function () {
		var lang = window.location.hostname.substr(0, 5);
		if (__DEV__)
			console.info('Analytics - Event - App - Start - '+ (data.getString('uid') ? 'Logged ' : 'Not logged ')+ lang);
		ga('set', 'language', lang);
		ga('send', 'event', 'app', 'start', (data.getString('uid') ? 'Logged ' : 'Not logged ')+ lang);
	});

	//navigation
	var logState = function(name) {
		var href = url.getAnalyticsPath(data.getObject('navigation'));
		if (__DEV__)
			console.info('Analytics - Pageview ' + name + ' - ' + href);
		ga('set', 'page', href);
		ga('send', 'pageview');
	};
	$document.on('app.loaded-state', function () {
		logState('load');
	});
	$document.on('app.pushed-state', function () {
		logState('push');
	});
	$document.on('app.poped-state', function () {
		logState('pop');
	});
})();