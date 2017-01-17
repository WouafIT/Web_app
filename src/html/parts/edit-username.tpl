<div data-ui="edit-username">
    <div class="modal-header">
		<h4 class="modal-title"><%= htmlWebpackPlugin.options.i18n['Edit your username'] %></h4>
		<button type="button" class="close" data-dismiss="modal" aria-label="<%= htmlWebpackPlugin.options.i18n['Close'] %>">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <div class="modal-body">
		<p><%= htmlWebpackPlugin.options.i18n['Edit your username_details'] %></p>
		<form>
			<fieldset class="form-group">
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-user"></i></div>
					<input type="text" class="form-control" name="username" maxlength="40" autocomplete="off"
						   placeholder="<%= htmlWebpackPlugin.options.i18n['Username'] %>" />
				</div>
			</fieldset>

			<p class="text-right"><button type="submit" class="btn btn-primary"><i class="fa fa-check"></i> <%= htmlWebpackPlugin.options.i18n['Validate your username'] %></button></p>
		</form>
	</div>
    <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal"><%= htmlWebpackPlugin.options.i18n['Cancel'] %></button>
    </div>
</div>