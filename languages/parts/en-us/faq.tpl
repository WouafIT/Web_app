<div class="modal-header">
	<button type="button" class="close" data-dismiss="modal" aria-label="<%= htmlWebpackPlugin.options.i18n['Close'] %>">
		<span aria-hidden="true">&times;</span>
		<span class="sr-only"><%= htmlWebpackPlugin.options.i18n['Close'] %></span>
	</button>
	<h4 class="modal-title">Frenquently asked questions</h4>
</div>
<div class="modal-body">
	<p>On this page you will find answers to frequently asked questions. If you can not find your answer,
		if you have a problem or for any other reason, do not hesitate to
		<a href="/contact/" data-href="contact" data-show="modal" data-target="#modalWindow">contact us</a> !</p>

	<h5>What are the limits of contents of a Wouaf?</h5>
	<p>There are a few:</p>
	<ul>
		<li>The text can not exceed 300 characters.</li>
		<li>The title can not exceed 80 characters.</li>
		<li>No more than 3 images.</li>
		<li>The validity period should not exceed 4 weeks.</li>
		<li>... and obviously the contents of your Wouaf must respect the
			<a href="/tos/" data-href="tos" data-show="modal" data-target="#modalWindow">Terms of Use</a>.</li>
	</ul>

	<h5>How do I edit a Wouaf?</h5>
	<p>You can not. If you have made a mistake or you want to update a Wouaf, you must
		delete and recreate it.</p>

	<h5>Why these constraints?</h5>
	<p>A Wouaf must remain an event fast to consult and ephemeral. It is in this perspective that was thought
		Wouaf IT and constraints arise directly from these choices. If you wish, you can add a
		explanatory comment or a link "More" to your Wouaf.</p>

	<h5>How do I add an avatar to my profile?</h5>
	<p>Wouaf IT uses <a href="http://gravatar.com" target="_blank">Gravatar</a> to manage avatars of users.
		To add an avatar to your account, simply create a <a href="http://gravatar.com" target="_blank">Gravatar</a> account
		with the same email address you use on Wouaf IT.</p>

	<h5>Can I post for profit content on Wouaf IT?</h5>
	<p>Yes, as long as this content respect our
		<a href="/tos/" data-href="tos" data-show="modal" data-target="#modalWindow">Terms of Use</a>, you can publish it.</p>

	<h5>My Facebook events were imported, how can I manage them?</h5>
	<p>To start Wouaf IT, we imported a number of content sources available on the Internet
		including public events published on the pages of Facebook.
		<br />
		If you are the administrator of one of these pages, you can regain control of your events by following these steps:
	</p>
	<ol>
		<li>Log in to Wouaf IT using your Facebook account (button "Login with Facebook" on the
			<a href="/login/" data-href="login" data-show="modal" data-target="#modalWindow">login page</a>)</li>
		<li>Be careful to autorise Wouaf IT to access your Facebook pages and events during the first connection.</li>
		<li>Once logged in, go to your profile and click the button "Your Facebook events".</li>
		<li>On the page that opens, click "Import events from your pages".</li>
		<li>This will take a few minutes and once completed, you will receive an email.</li>
		<li>During this import operation, Wouaf IT also associate your Facebook events previously imported to your account,
			so you can easily manage them.</li>
	</ol>
	<p>Do not hesitate to <a href="/contact/" data-href="contact" data-show="modal" data-target="#modalWindow">contact us</a>
		in case of problems!</p>

	<h5>Will I be charged to use Wouaf IT?</h5>
	<p>No Wouaf IT is free to use and will remain free for individuals and small businesses!</p>

	<h5>Is Wouaf IT is internationnal?</h5>
	<p>Eventually yes, Wouaf IT aims to cover all countries, but we will slowly ramp up.
		You can already create Wouafs anywhere you want and we will add other sources of content little by little.</p>

	<h5>Is there mobile applications for Wouaf IT?</h5>
	<p>The website has been designed to be perfectly compatible with mobile. Furthermore, if you use Chrome on Android,
		it will offer to install Wouaf IT on your Home screen from the second launch in 24h interval.
		Finally, eventually, native applications are planned for Android and iOS, but there is no specific timetable for this.</p>

	<h5>What does Wouaf IT mean?</h5>
	<p>The idea behind Wouaf IT dates back to 2012, during a drive in the countryside with family.
		We crossed a stray dog on the road. It seemed visibly lost and ran away when we wanted to approach him.
		We thought that perhaps his owner was only a few minutes away looking for him but we had no easy way to warn him.
		<br />
		It is from this story that born the idea behind Wouaf IT: Providing a service that allows everyone
		to be able to tell people geographically close "Hey! Here there is something happening now".
		<br />
		This idea took time to mature to become the current site after several months of development.
		So we named "Wouaf" a publication on the site in reference to this dog, which hopefully, found his owner.
	</p>

	<h5>I have content I want to automatically import in Wouaf IT, how can I do it?</h5>
	<p>We can give you access to the Wouaf IT API. Depending on the nature of your content, such access may be not free.
		Currently Wouaf IT is a non-profit project. That said, it generates infrastructure costs.
		If you get profits from your content, it is normal to ask for a contribution in return.
		For more information, <a href="/contact/" data-href="contact" data-show="modal" data-target="#modalWindow">contact us</a>
		by describing what you want to import.</p>

	<h5>I want to help develop Wouaf IT, is it possible?</h5>
	<p>All good wishes are appreciated and there is plenty of work to do. You can check out the
		<i class="fa fa-github"></i> <a href="https://github.com/WouafIT" target="_blank">Github</a> project page,
		some additional infos are in it and you can always talk about Wouaf IT around you, word of mouth is the best of helpers!</p>

	<p>Follow Wouaf IT on <i class="fa fa-twitter"></i> <a href="https://twitter.com/Wouaf_IT" target="_blank">Twitter</a> and
		<i class="fa fa-facebook-official"></i> <a href="https://www.facebook.com/wouafit/" target="_blank">Facebook</a> to get more informations!</p>
	<hr />
	<p>Wouaf IT © <%= htmlWebpackPlugin.options.data.year %>.</p>
</div>
<div class="modal-footer">
	<button type="button" class="btn btn-secondary" data-dismiss="modal"><%= htmlWebpackPlugin.options.i18n['Close'] %></button>
</div>