<div data-ui="calendar">
	<div class="modal-header">
		<h4 class="modal-title"><%= htmlWebpackPlugin.options.i18n['Add to your calendar'] %></h4>
		<button type="button" class="close" data-dismiss="modal" aria-label="<%= htmlWebpackPlugin.options.i18n['Close'] %>">
			<span aria-hidden="true">&times;</span>
		</button>
	</div>
	<div class="modal-body">
		<p class="import-wouaf-details"></p>
		<h4><i class="fa fa-google"></i> <%= htmlWebpackPlugin.options.i18n['Google Calendar'] %></h4>
		<p class="text-center"><button type="button" class="btn btn-primary btn-google"><i class="fa fa-google"></i> <%= htmlWebpackPlugin.options.i18n['Add to your calendar'] %></button></p>
		<hr />

		<h4><i class="fa fa-yahoo"></i> <%= htmlWebpackPlugin.options.i18n['Yahoo Calendar'] %></h4>
		<p class="text-center"><button type="button" class="btn btn-primary btn-yahoo"><i class="fa fa-yahoo"></i> <%= htmlWebpackPlugin.options.i18n['Add to your calendar'] %></button></p>
		<hr />

		<% /* %>
		<h4><i class="fa fa-windows"></i> Outlook.com</h4>
		<p class="text-center"><button type="button" class="btn btn-primary btn-outlook"><i class="fa fa-windows"></i> <%= htmlWebpackPlugin.options.i18n['Add to your calendar'] %></button></p>
		<hr />
		<% */ %>

		<h4><i class="fa fa-windows"></i> Windows / Outlook</h4>
		<p class="text-center"><a href="" download="calendar.ics" role="button" class="btn btn-primary btn-windows"><i class="fa fa-windows"></i> <%= htmlWebpackPlugin.options.i18n['Add to your calendar'] %></a></p>
		<hr />

		<h4><i class="fa fa-apple"></i> Apple</h4>
		<p class="text-center"><a href="" download="calendar.ics" role="button" class="btn btn-primary btn-apple"><i class="fa fa-apple"></i> <%= htmlWebpackPlugin.options.i18n['Add to your calendar'] %></a></p>
	</div>
	<div class="modal-footer">
		<button type="button" class="btn btn-secondary" data-dismiss="modal"><%= htmlWebpackPlugin.options.i18n['Cancel'] %></button>
	</div>
</div>