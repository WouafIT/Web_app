<div class="modal-header">
	<button type="button" class="close" data-dismiss="modal" aria-label="<%= htmlWebpackPlugin.options.i18n['Close'] %>">
		<span aria-hidden="true">&times;</span>
		<span class="sr-only"><%= htmlWebpackPlugin.options.i18n['Close'] %></span>
	</button>
	<h4 class="modal-title">About Wouaf IT</h4>
</div>
<div class="modal-body">
	<p>Imagine a location-based source of information where everyone can report local events. From the neighborhood protest
		to the sale of your sofa via the lost dog of your neighbor.</p>
	
	<p>Contributive sources of information have already shown their quality and completeness. Wikipedia, Twitter, Facebook,
		Reddit and others are irreplaceable to inform us.</p>

	<p>Wouaf IT wants to highlight public events that are rare and hard to find around you. These events have little or
		no marketing budget and are rarely known outside the inner circle of the organizer. If the public knows there
		is something he will enjoy it every day.</p>

	<p>Some examples of what you can find and publish on Wouaf IT:</p>
	<ul>
		<li>Communicate on a theme party.</li>
		<li>Sell a good.</li>
		<li>Find a fourth card player.</li>
		<li>Looking for someone to bring your children to school.</li>
		<li>Communicating on promotions and unsold.</li>
		<li>Offer home services (childcare, housework, gardening, ...).</li>
		<li>Seek out partners for nightlife.</li>
		<li>Find an animal or a lost object and warn for an animal or a found object.</li>
		<li>Start an alert (accident, flood, ...).</li>
		<li>Give or trade items.</li>
		<li>and so much more...</li>
	</ul>

	<p>On Wouaf IT you can tell everybody, everything that is happening around you.</p>

	<p>Follow Wouaf IT on <i class="fa fa-twitter"></i> <a href="https://twitter.com/Wouaf_IT" target=_blank">Twitter</a> and
		<i class="fa fa-facebook-official"></i> <a href="https://www.facebook.com/wouafit/" target=_blank">Facebook</a> to get more informations!</p>

	<p>The use of Wouaf IT is free. Its source code is released under the Apache license and is
		available on <i class="fa fa-github"></i> <a href="https://github.com/WouafIT">Github</a>.</p>
	<hr />
	<p>Wouaf IT © <%= htmlWebpackPlugin.options.data.year %>.</p>
</div>
<div class="modal-footer">
	<button type="button" class="btn btn-secondary" data-dismiss="modal"><%= htmlWebpackPlugin.options.i18n['Close'] %></button>
</div>