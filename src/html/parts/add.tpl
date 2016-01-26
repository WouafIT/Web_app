<div data-ui="add">
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
			<div class="text-xs-right"><small class="text-muted help"><i class="fa fa-question-circle"></i> {%= o.htmlWebpackPlugin.options.i18n['Need help'] %}</small></div>
			<fieldset class="form-group">
				<input type="text" class="form-control" placeholder="{%= o.htmlWebpackPlugin.options.i18n['Enter your title (50 char. max)'] %}" name="title" maxlength="50" />
			</fieldset>

			<fieldset class="form-group">
				<textarea class="form-control" rows="5" name="content" id="content" placeholder="{%= o.htmlWebpackPlugin.options.i18n['Enter your content (300 char. max)'] %}"></textarea>
				<div class="text-xs-right"><small class="text-muted remaining"></small></div>
			</fieldset>

			<div class="dropzone"></div>

			<fieldset class="form-group">
				<label for="date-start">{%= o.htmlWebpackPlugin.options.i18n['Starting'] %}</label>
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-calendar-o"></i></div>
					<input type="text" class="form-control" name="date-start" id="date-start"
						   placeholder="{%= o.htmlWebpackPlugin.options.i18n['Now'] %}"
						   data-field="datetime" />
				</div>
			</fieldset>

			<fieldset class="form-group">
				<label for="duration">{%= o.htmlWebpackPlugin.options.i18n['Duration'] %}</label>
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-calendar-o"></i></div>
					<select id="duration" name="duration" class="form-control"></select>
				</div>
			</fieldset>

			<fieldset class="form-group">
				<label for="category">{%= o.htmlWebpackPlugin.options.i18n['Category'] %}</label>
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
							   placeholder="{%= o.htmlWebpackPlugin.options.i18n['Latitude'] %}" />
					</div>
				</div>
				<div class="col-lg-6">
					<label>Longitude</label>
					<div class="input-group">
						<div class="input-group-addon"><i class="fa fa-crosshairs"></i></div>
						<input type="text" class="form-control" name="longitude"
							   placeholder="{%= o.htmlWebpackPlugin.options.i18n['Longitude'] %}" />
					</div>
				</div>
			</div>
			<br />

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