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

	<p>Wouaf IT wants to highlight public events that are rare or hard to find around you. These events have little or
		no marketing budget and are rarely known outside the inner circle of the organizer.
		If the public knows there is something around him, he can also enjoy it!</p>

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

	<p class="text-xs-center"><img src="https://img.wouaf.it/outside.jpg" class="rounded img-fluid" /></p>

	<h5>Who are we ?</h5>

	<p>Wouaf IT is the initiative of a family man helped by close friends.
		We want to provide a new quality Internet service that will identify all events nearby.
		We are based in the technology park of Sophia Antipolis, near Nice - France.</p>

	<p>The use and publication on Wouaf IT are free of charge. Its source code is released under the Apache license and is
		available on <i class="fa fa-github"></i> <a href="https://github.com/WouafIT" target="_blank">Github</a>.</p>

	<p>Follow Wouaf IT on <i class="fa fa-twitter"></i> <a href="https://twitter.com/Wouaf_IT" target="_blank">Twitter</a> and
		<i class="fa fa-facebook-official"></i> <a href="https://www.facebook.com/wouafit/" target="_blank">Facebook</a> to get more informations!</p>
	<div class="text-xs-right">
		<div class="fb-like" data-href="https://www.facebook.com/wouafit/" data-layout="button_count" data-action="like"
			 data-size="small" data-show-faces="true" data-share="true"></div>
	</div>
	<hr />
	<p>Wouaf IT © <%= htmlWebpackPlugin.options.data.year %>.</p>
</div>
<div class="modal-footer">
	<button type="button" class="btn btn-secondary" data-dismiss="modal"><%= htmlWebpackPlugin.options.i18n['Close'] %></button>
</div>