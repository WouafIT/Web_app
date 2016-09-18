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
	<p>On Wouaf IT you can tell everyone, all that is happening around you.</p>
	<p>Follow Wouaf IT on <i class="fa fa-twitter"></i> <a href="https://twitter.com/Wouaf_IT" target=_blank">Twitter</a> and
		<i class="fa fa-facebook-official"></i> <a href="https://www.facebook.com/wouafit/" target=_blank">Facebook</a> to get more informations!</p>

	<h5>Terms of use:</h5>
	<p>You are responsible for your use of this service. Your publications are public and visible to all.</p>
	<p>Publish on Wouaf IT requires strict adherence of some simple rules:</p>
	<ul>
		<li>Do not post offensive content or which can harm others (incitement to hatred, xenophobic or homophobic statements,
			defamation, etc.).</li>
		<li>Do not impersonates any person or entity.</li>
		<li>Do not post anything false, deceptive or likely to mislead, deceive or annoy anyone.</li>
		<li>Do not offer any service in disagreement with the laws of your country of publication.</li>
	</ul>
	<p>Wouaf IT will remove any post not complying with these conditions as soon as they are known.</p>

	<h5>Protection of personal data:</h5>
	<p>Wouaf IT is and will be respectful of your personal data. They will not be sold or commercially exploited outside
		of the use required to operate the service.</p>
	<p>You can delete your profile at any time. Your data will be fully and immediately deleted as well. A few days are
		necessary for this deletion spreads to the backup service.</p>

	<p>The web application Wouaf IT is distributed under an open source Apache license. Source code is
		available on <i class="fa fa-github"></i> <a href="https://github.com/WouafIT">Github</a>.</p>
	<hr />
	<p>Wouaf IT © 2016-<%= htmlWebpackPlugin.options.data.year %>.</p>
</div>
<div class="modal-footer">
	<button type="button" class="btn btn-secondary" data-dismiss="modal"><%= htmlWebpackPlugin.options.i18n['Close'] %></button>
</div>