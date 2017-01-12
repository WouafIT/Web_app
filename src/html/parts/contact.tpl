<div data-ui="contact">
    <div class="modal-header">
		<h4 class="modal-title"></h4>
		<button type="button" class="close" data-dismiss="modal" aria-label="<%= htmlWebpackPlugin.options.i18n['Close'] %>">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <div class="modal-body">
		<form>
			<p class="contact-details"></p>
			<fieldset class="form-group" hidden>
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-at"></i></div>
					<input type="email" class="form-control" name="email"
						   placeholder="<%= htmlWebpackPlugin.options.i18n['Your email address'] %>" />
				</div>
			</fieldset>
			<fieldset class="form-group">
				<textarea class="form-control" rows="8" name="content" id="content" placeholder="<%= htmlWebpackPlugin.options.i18n['Enter your message (5000 char. max)'] %>"></textarea>
				<div class="text-right"><small class="text-muted remaining"></small></div>
			</fieldset>
			<p class="text-right"><button type="submit" class="btn btn-primary"><i class="fa fa-check"></i> <%= htmlWebpackPlugin.options.i18n['Send your message'] %></button></p>
		</form>
	</div>
	<div class="modal-footer">
		<button type="button" class="btn btn-secondary" data-dismiss="modal"><%= htmlWebpackPlugin.options.i18n['Cancel'] %></button>
	</div>
</div>