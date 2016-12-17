var i18n 			= require('../resource/i18n.js');

module.exports = (function() {
	var self = {};

	self.getSearchForm = function (id) {
		/*
		* '<p>Catégories (liste + nombre)</p>',
		 '<p>Tags (liste + nombre)</p>',
		 '<p>Masquer les Wouafs révolus (nombre) (case à cocher)</p>',
		 '<p>Afficher uniquement vos Wouafs (nombre) (case à cocher)</p>',
		 */
		var form = ['<fieldset class="form-group row">',
					'	<label for="what', id ,'">', i18n.t('What?') ,'</label>',
					'	<div class="input-group">',
					'		<div class="input-group-addon"><i class="fa fa-question-circle"></i></div>',
					'		<select class="form-control" id="what', id ,'" placeholder="', i18n.t('Choose a category') ,'"></select>',
					'	</div>',
					'	<small class="text-muted categories-help"></small>',
					'</fieldset>',
					'<fieldset class="form-group row">',
					'	<label for="tags', id ,'">', i18n.t('Hashtag?') ,'</label>',
					'	<div class="input-group">',
					'		<div class="input-group-addon"><i class="fa fa-hashtag"></i></div>',
					'		<select class="form-control" id="tags', id ,'" placeholder="', i18n.t('Keyword Theme') ,'"></select>',
					'	</div>',
					'</fieldset>',
					'<div class="form-check">',
					'	<label class="form-check-label">',
					'		<input type="checkbox" class="form-check-input" id="gone', id ,'">',
					'		', i18n.t('Hide Wouafs gone'),
					'	</label>',
					'</div>',
					'<div class="form-check">',
					'	<label class="form-check-label">',
					'		<input type="checkbox" class="form-check-input" id="mine', id ,'">',
					'		Uniquement mes Wouafs',
					'	</label>',
					'</div>'];
		return form.join('');
	};




	return self;
}());