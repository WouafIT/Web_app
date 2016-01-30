module.exports = (function() {
	var data = require('./data.js');
	var i18n = require('./i18n.js');
	var self = {};
	var categoriesById = {};
	var categories = [];
	//TODO set those colors in the categories database
	var colors = {
		1: '#3030BB',
		2: '#A52C2C',
		3: '#12A7A7',
		4: '#7AEE41',
		5: '#BA1CB1',
		6: '#BF8622',
		7: '#CA3737',
		8: '#CAC537'
	};

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
	self.getColor = function(id) {
		return colors[id];
	};
	self.getAll = function() {
		return categories;
	};
	self.getHtmlOptions = function() {
		var options = [];
		for(var i = 0, l = categories.length; i < l; i++) {
			options.push('<option value="'+ categories[i]['id'] +'">'+ i18n.t(categories[i]['label']) +'</option>');
		}
		return options.join('');
	}
	return self;
})();