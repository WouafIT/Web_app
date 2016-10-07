<div data-ui="facebook-events">
	<div class="modal-header">
		<button type="button" class="close" data-dismiss="modal" aria-label="<%= htmlWebpackPlugin.options.i18n['Close'] %>">
			<span aria-hidden="true">&times;</span>
			<span class="sr-only"><%= htmlWebpackPlugin.options.i18n['Close'] %></span>
		</button>
		<h4 class="modal-title"><%= htmlWebpackPlugin.options.i18n['Your Facebook events'] %></h4>
	</div>
	<div class="modal-body">
		<h3>Importing your Facebook events</h3>
		<p>Wouaf IT allows you with one click to import the <strong>public</strong> events that you have already created on Facebook.</p>
		<p>So you can share them with the Wouaf IT community and make them more visible thanks to the interactive map. Your events will retain a link to the original page on Facebook.</p>
		<p>You can always delete them from Wouaf IT if you like.</p>

		<h4>Import your personal public events</h4>
		<p>Only public events of which you are the author will be imported.</p>
		<p>If you have already imported events, they will not be re-imported, only the new ones will be added.</p>

		<div class="events-disabled alert alert-danger" role="alert" hidden>
			<strong>Oh snap!</strong> You have not allowed Wouaf IT to see your Facebook events. We therefore can not import your events...
			<div class="text-xs-center"><button type="button" class="btn btn-success btn-sm events-rerequest">Fix this?</button></div>
		</div>

		<div class="no-events alert alert-warning" role="alert" hidden>
			<strong>Oh snap!</strong> You have no public events to come. So we can not import anything...
		</div>

		<p class="text-xs-center"><button type="button" class="btn btn-secondary btn-facebook events-import" disabled><i class="fa fa-cloud-download"></i> <%= htmlWebpackPlugin.options.i18n['Import'] %></button></p>
		<hr />

		<h4>Import events from your pages</h4>
		<p>Only public events of the Facebook pages which you are an administrator will be imported.</p>
		<p>If you have already imported events, they will not be re-imported, only the new ones will be added.</p>
		<p>If there is any public events in your Facebook pages that already has been imported automatically, they will be attached to your Wouaf IT account, so you can manage them as you wish.</p>

		<div class="pages-disabled alert alert-danger" role="alert" hidden>
			<strong>Oh snap!</strong> You have not allowed Wouaf IT to see your Facebook pages. We therefore can not import your events...
			<div class="text-xs-center"><button type="button" class="btn btn-success btn-sm pages-rerequest">Fix this?</button></div>
		</div>

		<div class="no-pages-events alert alert-warning" role="alert" hidden>
			<strong>Oh snap!</strong> You have no Facebook page that you are an administrator. So we can not import anything ...
		</div>

		<p class="text-xs-center"><button type="button" class="btn btn-secondary btn-facebook pages-import" disabled><i class="fa fa-cloud-download"></i> <%= htmlWebpackPlugin.options.i18n['Import'] %></button></p>

	</div>
	<div class="modal-footer">
		<button type="button" class="btn btn-secondary" data-dismiss="modal"><%= htmlWebpackPlugin.options.i18n['Cancel'] %></button>
	</div>
</div>