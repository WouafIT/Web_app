<div class="modal-content" data-ui="add">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-label="{%= o.htmlWebpackPlugin.options.i18n['Close'] %}">
			<span aria-hidden="true">&times;</span>
			<span class="sr-only">{%= o.htmlWebpackPlugin.options.i18n['Close'] %}</span>
		</button>
		<h4 class="modal-title">{%= o.htmlWebpackPlugin.options.i18n['Add a new Wouaf'] %}</h4>
	</div>
	<div class="modal-body">
		<h4>{%= o.htmlWebpackPlugin.options.i18n['Fill in the form below:'] %}</h4>
		<div class="alert alert-warning alert-dismissible fade in" role="alert" hidden>
			<button type="button" class="close" data-dismiss="alert" aria-label="{%= o.htmlWebpackPlugin.options.i18n['Close'] %}">
				<span aria-hidden="true">&times;</span>
				<span class="sr-only">{%= o.htmlWebpackPlugin.options.i18n['Close'] %}</span>
			</button>
			<div class="alert-content"></div>
		</div>
		<form>
			<fieldset class="form-group">
				<textarea class="form-control" rows="5" name="content" id="content" placeholder="test de placeholder"></textarea>
			</fieldset>

			<fieldset class="form-group">
				<label for="date-start">A partir de</label>
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-calendar-o"></i></div>
					<input type="text" class="form-control" name="date-start" id="date-start"
						   placeholder="Maintenant"
						   data-field="datetime" />
				</div>
			</fieldset>

			<fieldset class="form-group">
				<label for="length">Durée</label>
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-calendar-o"></i></div>
					<select id="length" name="length" class="form-control"></select>
				</div>
			</fieldset>

			<fieldset class="form-group">
				<label for="category">Catégorie</label>
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-question-circle"></i></div>
					<select id="category" name="category" class="form-control"></select>
				</div>
			</fieldset>

			<div class="row">
				<div class="col-lg-6">
					<label>Latitude</label>
					<div class="input-group">
						<div class="input-group-addon"><i class="fa fa-crosshairs"></i></div>
						<input type="text" class="form-control" name="latitude"
							   placeholder="Latitude" />
					</div>
				</div>
				<div class="col-lg-6">
					<label>Longitude</label>
					<div class="input-group">
						<div class="input-group-addon"><i class="fa fa-crosshairs"></i></div>
						<input type="text" class="form-control" name="longitude"
							   placeholder="Longitude" />
					</div>
				</div>
			</div>
			<br />
			<!--TODO Photos -->

			<div class="checkbox">
				<label><input type="checkbox" name="facebook"> {%= o.htmlWebpackPlugin.options.i18n['Publish this Wouaf on my Facebook wall'] %}</label>
			</div>
			<div class="checkbox">
				<label><input type="checkbox" name="contact"> {%= o.htmlWebpackPlugin.options.i18n['Allow other Wouaffers to contact me'] %}</label>
			</div>
			<div class="checkbox">
				<label><input type="checkbox" name="wouaf-notifications"> {%= o.htmlWebpackPlugin.options.i18n['Being notified by email for feedback on this Wouaf'] %}</label>
			</div>

			<p class="text-xs-right"><button type="submit" class="btn btn-primary">{%= o.htmlWebpackPlugin.options.i18n['Save your Wouaf'] %}</button></p>
		</form>
	</div>
	<div class="modal-footer">
		<button type="button" class="btn btn-secondary" data-dismiss="modal">{%= o.htmlWebpackPlugin.options.i18n['Cancel'] %}</button>
	</div>
</div>