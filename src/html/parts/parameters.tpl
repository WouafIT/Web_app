<div class="modal-content" data-ui="parameters">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-label="{%= o.htmlWebpackPlugin.options.i18n['Close'] %}">
			<span aria-hidden="true">&times;</span>
			<span class="sr-only">{%= o.htmlWebpackPlugin.options.i18n['Close'] %}</span>
		</button>
		<h4 class="modal-title">{%= o.htmlWebpackPlugin.options.i18n['Application settings'] %}</h4>
	</div>
	<div class="modal-body">
		<h4>{%= o.htmlWebpackPlugin.options.i18n['Search settings'] %}</h4>
		<div class="alert alert-warning alert-dismissible fade in" role="alert" hidden>
			<button type="button" class="close" data-dismiss="alert" aria-label="{%= o.htmlWebpackPlugin.options.i18n['Close'] %}">
				<span aria-hidden="true">&times;</span>
				<span class="sr-only">{%= o.htmlWebpackPlugin.options.i18n['Close'] %}</span>
			</button>
			<div class="alert-content"></div>
		</div>
		<form>
			<fieldset class="form-group">
				<label for="radius">{%= o.htmlWebpackPlugin.options.i18n['Search radius'] %}</label>
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-dot-circle-o"></i></div>
					<select id="radius" name="radius" class="form-control"></select>
				</div>
			</fieldset>
			<fieldset class="form-group">
				<label for="unit">{%= o.htmlWebpackPlugin.options.i18n['Unit search radius'] %}</label>
				<select id="unit" name="unit" class="form-control">
					<option value="km">{%= o.htmlWebpackPlugin.options.i18n['Kilometers'] %}</option>
					<option value="miles">{%= o.htmlWebpackPlugin.options.i18n['Miles'] %}</option>
				</select>
			</fieldset>
			<h4>{%= o.htmlWebpackPlugin.options.i18n['Default publish settings'] %}</h4>
			<div class="checkbox">
				<label><input type="checkbox" name="facebook"> {%= o.htmlWebpackPlugin.options.i18n['Publish my Wouafs on my Facebook wall'] %}</label>
			</div>
			<div class="checkbox">
				<label><input type="checkbox" name="contact"> {%= o.htmlWebpackPlugin.options.i18n['Allow other Wouaffers to contact me'] %}</label>
			</div>
			<div class="checkbox">
				<label><input type="checkbox" name="wouaf-notifications"> {%= o.htmlWebpackPlugin.options.i18n['Being notified by email for feedback on my Wouafs'] %}</label>
			</div>
			<div class="checkbox">
				<label><input type="checkbox" name="comments-notifications"> {%= o.htmlWebpackPlugin.options.i18n['Being notified by email for feedback on my comments'] %}</label>
			</div>

			<p class="text-xs-right"><button type="submit" class="btn btn-primary">{%= o.htmlWebpackPlugin.options.i18n['Save'] %}</button></p>
		</form>
	</div>
	<div class="modal-footer">
		<button type="button" class="btn btn-secondary" data-dismiss="modal">{%= o.htmlWebpackPlugin.options.i18n['Cancel'] %}</button>
	</div>
</div>