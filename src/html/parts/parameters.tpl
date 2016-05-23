<div data-ui="parameters">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-label="<%= htmlWebpackPlugin.options.i18n['Close'] %>">
			<span aria-hidden="true">&times;</span>
			<span class="sr-only"><%= htmlWebpackPlugin.options.i18n['Close'] %></span>
		</button>
		<h4 class="modal-title"><%= htmlWebpackPlugin.options.i18n['Application settings'] %></h4>
	</div>
	<div class="modal-body">
		<h4><%= htmlWebpackPlugin.options.i18n['Search settings'] %></h4>
		<form>
			<fieldset class="form-group">
				<label for="radius"><%= htmlWebpackPlugin.options.i18n['Search radius'] %></label>
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-dot-circle-o"></i></div>
					<select id="radius" name="radius" class="form-control"></select>
				</div>
			</fieldset>
			<fieldset class="form-group">
				<label for="unit"><%= htmlWebpackPlugin.options.i18n['Unit search radius'] %></label>
				<select id="unit" name="unit" class="form-control">
					<option value="km"><%= htmlWebpackPlugin.options.i18n['Kilometers'] %></option>
					<option value="miles"><%= htmlWebpackPlugin.options.i18n['Miles'] %></option>
				</select>
			</fieldset>
			<div class="checkbox">
				<label><input type="checkbox" name="map-follow"> <%= htmlWebpackPlugin.options.i18n['Refresh search results by following the map position'] %></label>
			</div>
			<h4><%= htmlWebpackPlugin.options.i18n['Default publish settings'] %></h4>
			<% /* %>
			<div class="checkbox">
				<label><input type="checkbox" name="facebook"> <%= htmlWebpackPlugin.options.i18n['Publish my Wouafs on my Facebook wall'] %></label>
			</div>
			<% */ %>
			<div class="checkbox">
				<label><input type="checkbox" name="contact"> <%= htmlWebpackPlugin.options.i18n['Allow other Wouaffers to contact me'] %></label>
			</div>
			<div class="checkbox">
				<label><input type="checkbox" name="wouaf-notifications"> <%= htmlWebpackPlugin.options.i18n['Being notified by email for feedback on my Wouafs'] %></label>
			</div>
			<div class="checkbox">
				<label><input type="checkbox" name="comments-notifications"> <%= htmlWebpackPlugin.options.i18n['Being notified by email for feedback on my comments'] %></label>
			</div>

			<p class="text-xs-right"><button type="submit" class="btn btn-primary"><%= htmlWebpackPlugin.options.i18n['Save'] %></button></p>
		</form>
	</div>
	<div class="modal-footer">
		<button type="button" class="btn btn-secondary" data-dismiss="modal"><%= htmlWebpackPlugin.options.i18n['Cancel'] %></button>
	</div>
</div>