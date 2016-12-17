var i18n = require('./i18n.js');
var utils = require('../utils.js');

module.exports = (function() {
	var self = {};
	var categoriesById = {};
	var categories = [];
	//TODO set those colors in the categories database
	var colors = {
		1: '#3030BB',
		2: '#9103D4',
		3: '#12A7A7',
		4: '#68CC36',
		5: '#015706',
		6: '#AA771F',
		7: '#CA3737',
		8: '#CAC537'
	};
	var darkColors = {};
	self.init = function(list) {
		categories = list;
		if (categories) {
			for(var i = 0, l = categories.length; i < l; i++) {
				categoriesById[categories[i]['id']] = categories[i];
			}
		}
	};
	self.get = function(id) {
		return categoriesById[id] || null;
	};
	self.getLabel = function(id) {
		return categoriesById[id] ? i18n.t(categoriesById[id].label) : '';
	};
	self.getDetails = function(id) {
		return categoriesById[id] ? i18n.t(categoriesById[id].label+'_details') : '';
	};
	self.getColor = function(id) {
		return colors[id] ? colors[id] : '#2B9D48';
	};
	self.getDarkColor = function (id) {
		if (!darkColors[id]) {
			darkColors[id] = utils.lightenDarkenColor(self.getColor(id), -30);
		}
		return darkColors[id];
	};
	/*self.getTextColor = function(id) {
		var c = self.getColor(id);
		var rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(c);
		//http://www.w3.org/TR/AERT#color-contrast
		var o = Math.round(((parseInt(parseInt(rgb[1], 16)) * 299)
			+ (parseInt(parseInt(rgb[2], 16)) * 587)
			+ (parseInt(parseInt(rgb[3], 16)) * 114)) /1000);
		return (o > 125) ? '#373A3C' : '#FFF';
	};*/
	self.getAll = function() {
		return categories;
	};
	self.getHtmlOptions = function() {
		var options = [];
		for(var i = 0, l = categories.length; i < l; i++) {
			options.push('<option value="'+ categories[i]['id'] +'">'+ i18n.t(categories[i]['label']) +'</option>');
		}
		return options.join('');
	};
	return self;
}());