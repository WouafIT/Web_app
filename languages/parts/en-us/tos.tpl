<div class="modal-header">
	<button type="button" class="close" data-dismiss="modal" aria-label="<%= htmlWebpackPlugin.options.i18n['Close'] %>">
		<span aria-hidden="true">&times;</span>
		<span class="sr-only"><%= htmlWebpackPlugin.options.i18n['Close'] %></span>
	</button>
	<h4 class="modal-title">Terms of Service</h4>
</div>
<div class="modal-body">
	<h5>Terms of Service:</h5>
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

	<p>Follow Wouaf IT on <i class="fa fa-twitter"></i> <a href="https://twitter.com/Wouaf_IT" target="_blank">Twitter</a> and
		<i class="fa fa-facebook-official"></i> <a href="https://www.facebook.com/wouafit/" target="_blank">Facebook</a> to get more informations!</p>
	<hr />
	<p>Wouaf IT © <%= htmlWebpackPlugin.options.data.year %>.</p>
</div>
<div class="modal-footer">
	<button type="button" class="btn btn-secondary" data-dismiss="modal"><%= htmlWebpackPlugin.options.i18n['Close'] %></button>
</div>