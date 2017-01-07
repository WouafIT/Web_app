var i18n = require('./i18n.js');
var utils = require('../utils.js');

module.exports = (function() {
	var self = {};
	var categoriesById = {};
	var categories = [];
	var darkColors = {};
	self.init = function(list) {
		categories = list;
		if (categories) {
			for(var i = 0, l = categories.length; i < l; i++) {
				categoriesById[categories[i].id] = categories[i];
			}
		}
	};
	self.get = function(id) {
		return categoriesById[id] || null;
	};
	self.getLabel = function(id, withParent) {
		var label = categoriesById[id] ? i18n.t(categoriesById[id].label) : '';
		if (!withParent || !categoriesById[id].parent) {
			return label;
		}
		return self.getLabel(categoriesById[id].parent)+ ' &raquo; ' + label;
	};
	self.getDetails = function(id) {
		if (!categoriesById[id]) {
			return '';
		}
		if (categoriesById[id].parent) {
			return self.getLabel(id, true);
		}
		if (categoriesById[id].label === 'Other type of event') {
			return i18n.t('Other_details');
		}
		var label = '';
		var children = self.getChildren(id);
		for(var i = 0, l = children.length; i < l; i++) {
			if (label) {
				label += ', ';
			}
			label += (children[i].label === 'Other' ? i18n.t('etc') : self.getLabel(children[i].id));
		}
		return label;
	};
	self.getRootId = function(id) {
		return categoriesById[id].parent ? categoriesById[id].parent : id;
	};
	self.getChildren = function(id) {
		var children = [];
		for(var i = 0, l = categories.length; i < l; i++) {
			if (categories[i].parent === id) {
				children.push(categories[i]);
			}
		}
		return children;
	};
	self.getColor = function(id) {
		id = categoriesById[id].parent ? categoriesById[id].parent : id;
		return categoriesById[id].color ? categoriesById[id].color : '#2B9D48';
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
	self.getHtmlOptions = function(parent) {
		parent = typeof parent === 'undefined' ? null : parent;
		var options = [];
		for(var i = 0, l = categories.length; i < l; i++) {
			if (parent === false || categories[i].parent === parent) {
				if (parent === false && !categories[i].parent) {
					if (options.length) {
						options.push('</optgroup>');
					}
					if (categories[i].child !== false) {
						options.push('<optgroup label="'+ utils.escapeHtml(i18n.t(categories[i].label)) +'">');
					} else {
						options.push('<option value="'+ categories[i].id +'">'+ i18n.t(categories[i].label) +'</option>');
					}
				} else {
					options.push('<option value="'+ categories[i].id +'">'+ i18n.t(categories[i].label) +'</option>');
				}
			}
		}
		return options.join('');
	};
	self.getMultiSelect = function(values) {
		var i, l;
		values = values ? values.split(',') : [];
		var html = [
			'<fieldset class="no-child">',
				'<div class="legend">',
					'<label class="custom-control custom-checkbox">',
						'<input type="checkbox" class="custom-control-input"', (!values.length ? ' checked="checked"' : '') ,' value="all" />',
						'<span class="custom-control-indicator"></span>',
						'<span class="custom-control-description">', i18n.t('All events') ,'</span>',
					'</label>',
				'</div>',
			'</fieldset>'
		];
		var selected;
		for(i = 0, l = categories.length; i < l; i++) {
			selected = (utils.indexOf(values, categories[i].id) !== -1);
			if (!categories[i].parent) {
				if (i) {
					html.push('</div></fieldset>');
				}
				html.push('<fieldset class="'+ (categories[i].child === false ? ' no-child' : '') +
						  '" style="border-left-color:', self.getColor(categories[i].id) ,';">'+
						  '<div class="legend w-cat w-cat'+ categories[i].id +'">')
			}
			html = html.concat(['<label class="custom-control custom-checkbox', (categories[i].parent ? ' form-check-inline' : '') ,'">',
				'<input type="checkbox" class="custom-control-input"', (selected ? ' checked="checked"' : '') ,' value="', categories[i].id ,'" />',
				'<span class="custom-control-indicator"></span>',
				'<span class="custom-control-description">', i18n.t(categories[i].label) ,'</span>',
			'</label>']);
			if (!categories[i].parent) {
				html.push('</div><div class="content">')
			}
		}
		html.push('</div></fieldset>');
		return html.join('');
	};
	return self;
}());