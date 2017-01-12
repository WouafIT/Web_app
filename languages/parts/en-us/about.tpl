<div class="modal-header">
	<h4 class="modal-title">About Wouaf IT</h4>
	<button type="button" class="close" data-dismiss="modal" aria-label="<%= htmlWebpackPlugin.options.i18n['Close'] %>">
		<span aria-hidden="true">&times;</span>
	</button>
</div>
<div class="modal-body">

	<div id="accordionAbout" role="tablist" aria-multiselectable="true">
		<div class="card">
			<div class="card-header" role="tab" id="headingAboutOne">
				<h5>
					<a data-toggle="collapse" data-parent="#accordionAbout" href="#collapseAboutOne" aria-expanded="true"
					   aria-controls="collapseAboutOne">
						What is the purpose of Wouaf IT?
					</a>
				</h5>
			</div>
			<div id="collapseAboutOne" class="collapse show" role="tabpanel" aria-labelledby="headingAboutOne">
				<div class="card-block">
					<p>Imagine a location-based source of information where everyone can report local events.
						From the neighborhood protest to the sale of your sofa via the lost dog of your neighbor.</p>

					<p>Contributive sources of information have already shown their quality and completeness. Wikipedia,
						Twitter, Facebook, Reddit and others are irreplaceable to inform us.</p>

					<p>Wouaf IT wants to highlight public events that are rare or hard to find around you.
						All these events that are rarely known outside the inner circle of the organizer.
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

					<p class="text-center"><img src="https://img.wouaf.it/outside.jpg" class="rounded img-fluid" /></p>
				</div>
			</div>
		</div>
		<div class="card">
			<div class="card-header" role="tab" id="headingAboutTwo">
				<h5>
					<a data-toggle="collapse" data-parent="#accordionAbout" href="#collapseAboutTwo" aria-expanded="true"
					   aria-controls="collapseAboutTwo">
						Who are we ?
					</a>
				</h5>
			</div>
			<div id="collapseAboutTwo" class="collapse" role="tabpanel" aria-labelledby="headingAboutTwo">
				<div class="card-block">
					<p>Wouaf IT is the initiative of a family man helped by close friends.
						We want to provide a new quality Internet service that will identify all events nearby.</p>
					<p>We are based in the technology park of Sophia Antipolis, near Nice - France.</p>

					<p>The use and publication on Wouaf IT are free of charge. Its source code is released under the Apache license and is
						available on <i class="fa fa-github"></i> <a href="https://github.com/WouafIT" target="_blank">Github</a>.</p>
				</div>
			</div>
		</div>
		<div class="card">
			<div class="card-header" role="tab" id="headingAboutThree">
				<h5>
					<a data-toggle="collapse" data-parent="#accordionAbout" href="#collapseAboutThree"
					   aria-expanded="true" aria-controls="collapseAboutThree">
						Who are our content providers?
					</a>
				</h5>
			</div>
			<div id="collapseAboutThree" class="collapse" role="tabpanel" aria-labelledby="headingAboutThree">
				<div class="card-block">
					<p>
						Apart from the contributions of the Net surfers themselves, we import events directly from
						quality suppliers specializing in events or in a specific area that finds its place on Wouaf IT.
					</p>
					<p>Here is the list, thank you for their contribution!</p>
					<ul>
						<li>
							<i class="fa fa-facebook-official"></i> <a href="https://facebook.com" target="_blank">Facebook</a>
							thanks to its huge network of users has a very important event base. We import Facebook
							public events at least once a week.
						</li>
						<li>
							<a href="/user/Fnac_Spectacles/" data-user="Fnac_Spectacles">Fnac Spectacles</a>, provide more
							than 60,000 events per year in France, Switzerland and Belgium. All shows are on
							<a href="http://www.fnacspectacles.com" target="_blank">www.fnacspectacles.com</a>.
						</li>
						<li>
							<a href="/user/Open_Agenda/" data-user="Open_Agenda">Open Agenda</a>, offers open agendas for all
							on <a href="https://openagenda.com" target="_blank">openagenda.com</a>.
						</li>
						<li><a href="http://www.infolocale.fr" target="_blank">Infolocale.fr</a>, the free solution to advertise
							your events proposed by the <a href="http://www.ouest-france.fr/" target="_blank">
								Ouest-France Group</a>.<br />
							Find all the data on <a href="http://datainfolocale.opendatasoft.com"
																		  target="_blank">http://datainfolocale.opendatasoft.com</a>.
							The name <a href="http://www.infolocale.fr" target="_blank">"Infolocale.fr"</a> is a registered trademark
							of the Ouest-France Group.
						</li>
						<li><a href="/user/Chat_Perdu/" data-user="Chat_Perdu">Chat Perdu</a> and
							<a href="/user/Chien_Perdu/" data-user="Chien_Perdu">Chien Perdu</a> are the reference websites
							to publish notices of research about your lost pets.
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>

	<p>Follow Wouaf IT on <i class="fa fa-twitter"></i> <a href="https://twitter.com/Wouaf_IT" target="_blank">Twitter</a> and
		<i class="fa fa-facebook-official"></i> <a href="https://www.facebook.com/wouafit/" target="_blank">Facebook</a> to get more informations!</p>
	<div class="text-right">
		<div class="fb-like" data-href="https://www.facebook.com/wouafit/" data-layout="button_count" data-action="like"
			 data-size="small" data-show-faces="true" data-share="true"></div>
		<a href="https://twitter.com/Wouaf_IT" class="twitter-follow-button" data-show-count="false">Follow @Wouaf_IT</a>
	</div>
	<hr />
	<p>Wouaf IT © 2016-<%= htmlWebpackPlugin.options.data.year %>.</p>
</div>
<div class="modal-footer">
	<button type="button" class="btn btn-secondary" data-dismiss="modal"><%= htmlWebpackPlugin.options.i18n['Close'] %></button>
</div>