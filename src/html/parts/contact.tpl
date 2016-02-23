<div data-ui="contact">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="{%= o.htmlWebpackPlugin.options.i18n['Close'] %}">
            <span aria-hidden="true">&times;</span>
            <span class="sr-only">{%= o.htmlWebpackPlugin.options.i18n['Close'] %}</span>
        </button>
        <h4 class="modal-title"></h4>
    </div>
    <div class="modal-body">
		<div class="alert alert-warning alert-dismissible fade in" role="alert" hidden>
			<button type="button" class="close" data-dismiss="alert" aria-label="{%= o.htmlWebpackPlugin.options.i18n['Close'] %}">
				<span aria-hidden="true">&times;</span>
				<span class="sr-only">{%= o.htmlWebpackPlugin.options.i18n['Close'] %}</span>
			</button>
		</div>
		<form>
			<p class="contact-details"></p>
			<fieldset class="form-group" hidden>
				<div class="input-group">
					<div class="input-group-addon"><i class="fa fa-at"></i></div>
					<input type="email" class="form-control" name="email"
						   placeholder="{%= o.htmlWebpackPlugin.options.i18n['Your email address'] %}" />
				</div>
			</fieldset>
			<fieldset class="form-group">
				<textarea class="form-control" rows="8" name="content" id="content" placeholder="{%= o.htmlWebpackPlugin.options.i18n['Enter your message (1000 char. max)'] %}"></textarea>
				<div class="text-xs-right"><small class="text-muted remaining"></small></div>
			</fieldset>
			<p class="text-xs-right"><button type="submit" class="btn btn-primary">{%= o.htmlWebpackPlugin.options.i18n['Send your message'] %}</button></p>
		</form>
	</div>
	<div class="modal-footer">
		<button type="button" class="btn btn-secondary" data-dismiss="modal">{%= o.htmlWebpackPlugin.options.i18n['Cancel'] %}</button>
	</div>
</div>