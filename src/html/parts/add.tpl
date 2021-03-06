<div data-ui="add">
	<div class="modal-header">
		<h4 class="modal-title"><%= htmlWebpackPlugin.options.i18n['Add a new Wouaf'] %></h4>
		<button type="button" class="close" data-dismiss="modal" aria-label="<%= htmlWebpackPlugin.options.i18n['Close'] %>">
			<span aria-hidden="true">&times;</span>
		</button>
	</div>
	<div class="modal-body">
		<h4><%= htmlWebpackPlugin.options.i18n['Fill in the form below:'] %></h4>
		<form>
			<div class="text-right"><small class="help"><i class="fa fa-question-circle"></i> <%= htmlWebpackPlugin.options.i18n['Need help'] %></small></div>

			<fieldset class="form-group">
				<label for="category"><%= htmlWebpackPlugin.options.i18n['Category'] %></label>
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-question-circle"></i></div>
					<select id="category" name="category" class="form-control"></select>
				</div>
				<small class="text-muted categories-help"></small>
			</fieldset>

			<fieldset class="form-group">
				<input type="text" class="form-control" placeholder="<%= htmlWebpackPlugin.options.i18n['Enter your title (80 char. max)'] %>" name="title" maxlength="80" />
			</fieldset>

			<fieldset class="form-group">
				<textarea class="form-control" rows="5" name="content" id="content" placeholder="<%= htmlWebpackPlugin.options.i18n['Enter your content (300 char. max)'] %>"></textarea>
				<div class="text-right"><small class="text-muted remaining"></small></div>
			</fieldset>

			<div class="dropzone"></div>

			<fieldset class="form-group">
				<label for="date-start"><%= htmlWebpackPlugin.options.i18n['Starting'] %></label>
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-calendar-o"></i></div>
					<input type="text" name="date-start" id="date-start"
						   data-field="datetime" data-startend="start" class="form-control add-period"
						   data-startendelem=".add-period" readonly
						   placeholder="<%= htmlWebpackPlugin.options.i18n['Now'] %>" />
				</div>
			</fieldset>
			<fieldset class="form-group specific-end" hidden>
				<label for="date-end"><%= htmlWebpackPlugin.options.i18n['Until'] %></label>
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-calendar-o"></i></div>
					<input type="text" name="date-end" id="date-end"
						   data-field="datetime" data-startend="end" class="form-control add-period"
						   data-startendelem=".add-period" readonly
						   placeholder="<%= htmlWebpackPlugin.options.i18n['End'] %>" />
				</div>
				<small class="text-muted"><%= htmlWebpackPlugin.options.i18n['Maximum 4 weeks'] %></small>
			</fieldset>

			<fieldset class="form-group">
				<label for="duration"><%= htmlWebpackPlugin.options.i18n['Duration'] %></label>
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-calendar-o"></i></div>
					<select id="duration" name="duration" class="form-control"></select>
				</div>
			</fieldset>

			<div class="checkbox">
				<label><input type="checkbox" name="children"> <i class="fa fa-child"></i> <%= htmlWebpackPlugin.options.i18n['Children welcome'] %></label>
			</div>

			<fieldset class="form-group">
				<label><%= htmlWebpackPlugin.options.i18n['More info link'] %></label>
				<input type="url" class="form-control" placeholder="http://..." name="url" />
			</fieldset>

			<div class="row">
				<div class="col-lg-6">
					<label>Latitude</label>
					<div class="input-group">
						<div class="input-group-addon"><i class="fa fa-crosshairs"></i></div>
						<input type="text" class="form-control" name="latitude" readonly
							   placeholder="<%= htmlWebpackPlugin.options.i18n['Latitude'] %>" />
					</div>
				</div>
				<div class="col-lg-6">
					<label>Longitude</label>
					<div class="input-group">
						<div class="input-group-addon"><i class="fa fa-crosshairs"></i></div>
						<input type="text" class="form-control" name="longitude" readonly
							   placeholder="<%= htmlWebpackPlugin.options.i18n['Longitude'] %>" />
					</div>
				</div>
			</div>
			<br />
			<div class="checkbox">
				<label><input type="checkbox" name="contact-notifications"> <%= htmlWebpackPlugin.options.i18n['Allow other Wouaffers to contact me'] %></label>
			</div>
			<div class="checkbox">
				<label><input type="checkbox" name="post-notifications"> <%= htmlWebpackPlugin.options.i18n['Be notified by email for feedback on this Wouaf'] %></label>
			</div>

			<p class="text-right"><button type="submit" class="btn btn-primary"><i class="fa fa-check"></i> <%= htmlWebpackPlugin.options.i18n['Save your Wouaf'] %></button></p>
		</form>
	</div>
	<div class="modal-footer">
		<button type="button" class="btn btn-secondary" data-dismiss="modal"><%= htmlWebpackPlugin.options.i18n['Cancel'] %></button>
	</div>
</div>