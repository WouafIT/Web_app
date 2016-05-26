<div data-ui="comments">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="<%= htmlWebpackPlugin.options.i18n['Close'] %>">
            <span aria-hidden="true">&times;</span>
            <span class="sr-only"><%= htmlWebpackPlugin.options.i18n['Close'] %></span>
        </button>
        <h4 class="modal-title"></h4>
    </div>
    <div class="modal-body">
		<form hidden>
			<fieldset class="form-group">
				<textarea class="form-control" rows="8" name="content" id="content" placeholder="<%= htmlWebpackPlugin.options.i18n['Enter your comment (1000 char. max)'] %>"></textarea>
				<div class="text-xs-right"><small class="text-muted remaining"></small></div>
			</fieldset>
			<div class="checkbox">
				<div class="input-group">
					<label>
						<input type="checkbox" name="notif"> <%= htmlWebpackPlugin.options.i18n['Receive an email every new comment'] %>
					</label>
				</div>
			</div>
			<p class="text-xs-right"><button type="submit" class="btn btn-primary"><i class="fa fa-check"></i> <%= htmlWebpackPlugin.options.i18n['Save your comment'] %></button></p>
			<hr />
		</form>
		<div class="modal-comments"></div>
	</div>
	<div class="modal-footer">
		<button type="button" class="btn btn-secondary" data-dismiss="modal"><%= htmlWebpackPlugin.options.i18n['Close'] %></button>
	</div>
</div>