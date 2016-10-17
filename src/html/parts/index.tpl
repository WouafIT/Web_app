<div id="sb-site">
	<div id="menu" title="<%= htmlWebpackPlugin.options.i18n['Menu'] %>" class="sb-toggle-left"><i class="fa fa-bars fa-lg"></i></div>
	<div id="add-zone" hidden>
		<div class="add-btn" title="<%= htmlWebpackPlugin.options.i18n['Add a Wouaf'] %>"><i class="fa fa-plus-circle" aria-hidden="true"></i></div>
		<button class="btn btn-lg btn-secondary cancel"><%= htmlWebpackPlugin.options.i18n['Cancel'] %></button>
		<button class="btn btn-lg btn-primary location" title="<%= htmlWebpackPlugin.options.i18n['Center on your position'] %>"><i class="fa fa-crosshairs"></i></button>
		<button class="btn btn-lg btn-primary add"><%= htmlWebpackPlugin.options.i18n['OK'] %></button>
	</div>
	<div id="search-zone" hidden>
		<div class="search-btn" title="<%= htmlWebpackPlugin.options.i18n['Update your search'] %>"><i class="fa fa-search" aria-hidden="true"></i></div>
	</div>
	<div id="map"></div>
	<div id="crosshairs" hidden><i class="fa fa-crosshairs" aria-hidden="true"></i></div>
</div>
<div class="sb-slidebar sb-width-wide sb-left">
	<header>
		<nav class="nav pull-right">
			<div class="anonymous">
				<i class="fa fa-sign-in"></i> <a href="/login/"
												 data-href="login"
												 data-toggle="modal" data-target="#modalWindow"><%= htmlWebpackPlugin.options.i18n['Login'] %></a> |
				<i class="fa fa-cog"></i> <a href="/parameters/"
											 data-href="parameters"
											 data-toggle="modal" data-target="#modalWindow"><%= htmlWebpackPlugin.options.i18n['Parameters'] %></a>
			</div>
			<div class="logged" hidden>
				<a href="#" class="user-profile"><%= htmlWebpackPlugin.options.i18n['My profile'] %></a> |
				<i class="fa fa-cog"></i> <a href="/parameters/"
											 data-href="parameters"
											 data-toggle="modal" data-target="#modalWindow"><%= htmlWebpackPlugin.options.i18n['Parameters'] %></a> |
				<button class="btn btn-link btn-logout" title="<%= htmlWebpackPlugin.options.i18n['Logout'] %>"><i class="fa fa-power-off"></i></button>
			</div>
		</nav>
		<h1 class="logo"><%= htmlWebpackPlugin.options.i18n['Wouaf IT'] %></h1>
		<h2 class="description"><%= htmlWebpackPlugin.options.i18n['Your social network for your local events'] %></h2>
	</header>
	<div class="container">
		<div class="row">
			<ul class="nav nav-tabs" role="tablist">
				<li class="nav-item">
					<a href="#search" class="nav-link active" id="tab-search" role="tab" data-toggle="tab">
						<i class="fa fa-search"></i> <%= htmlWebpackPlugin.options.i18n['Search'] %>
					</a>
				</li>
				<li class="nav-item dropdown">
					<a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
						<i class="fa fa-list"></i> <%= htmlWebpackPlugin.options.i18n['Your Wouafs'] %>
					</a>
					<div class="dropdown-menu"></div>
				</li>
				</li>
			</ul>
		</div>
		<!-- Tab panes -->
		<div class="tab-content">
			<div role="tabpanel" class="tab-pane active" id="search">
				<form>
					<fieldset class="form-group row">
						<label for="what"><%= htmlWebpackPlugin.options.i18n['What?'] %></label>
						<div class="input-group">
							<div class="input-group-addon"><i class="fa fa-question-circle"></i></div>
							<select class="form-control" id="what" placeholder="<%= htmlWebpackPlugin.options.i18n['Choose a category'] %>"></select>
						</div>
						<small class="text-muted categories-help"></small>
					</fieldset>
					<fieldset class="form-group row">
						<label for="where"><%= htmlWebpackPlugin.options.i18n['Where?'] %></label>
						<div class="input-group">
							<div class="input-group-addon"><i class="fa fa-crosshairs"></i></div>
							<input type="text" class="form-control" id="where"
								   placeholder="<%= htmlWebpackPlugin.options.i18n['Map center'] %>" />
							<div id="where-empty" class="input-group-addon" hidden>
								<button type="button" class="close" data-dismiss="modal">&times;</button>
							</div>
						</div>
						<input type="hidden" id="where-loc" />
					</fieldset>
					<fieldset class="form-group row">
						<label for="when"><%= htmlWebpackPlugin.options.i18n['When?'] %></label>
						<div class="input-group">
							<div class="input-group-addon"><i class="fa fa-calendar-o"></i></div>
							<select class="form-control" id="when" placeholder="<%= htmlWebpackPlugin.options.i18n['Choose a period'] %>">
								<option value="today"><%= htmlWebpackPlugin.options.i18n['Today'] %></option>
								<option value="tomorrow"><%= htmlWebpackPlugin.options.i18n['Tomorrow'] %></option>
								<option value="weekend"><%= htmlWebpackPlugin.options.i18n['This week-end'] %></option>
								<option value="week" selected="selected"><%= htmlWebpackPlugin.options.i18n['The next 7 days'] %></option>
								<option value="month"><%= htmlWebpackPlugin.options.i18n['The next 30 days'] %></option>
								<option value="custom"><%= htmlWebpackPlugin.options.i18n['Specific dates'] %></option>
							</select>
						</div>
					</fieldset>
					<fieldset class="form-group row specific-date">
						<div class="col-lg-6">
							<label for="start"><%= htmlWebpackPlugin.options.i18n['From'] %></label>
							<div class="input-group">
								<div class="input-group-addon"><i class="fa fa-calendar"></i></div>
								<input type="text" data-field="date" data-startend="start" class="form-control date-period"
									   data-startendelem=".date-period" id="start" placeholder="<%= htmlWebpackPlugin.options.i18n['Start'] %>" />
							</div>
						</div>
						<div class="col-lg-6">
							<label for="end"><%= htmlWebpackPlugin.options.i18n['To'] %></label>
							<div class="input-group">
								<div class="input-group-addon"><i class="fa fa-calendar"></i></div>
								<input type="text" data-field="date" data-startend="end" class="form-control date-period"
									   data-startendelem=".date-period" id="end" placeholder="<%= htmlWebpackPlugin.options.i18n['End'] %>" />
							</div>
						</div>
					</fieldset>
					<fieldset class="form-group row">
						<label for="where"><%= htmlWebpackPlugin.options.i18n['Hashtag?'] %></label>
						<div class="input-group">
							<div class="input-group-addon"><i class="fa fa-hashtag"></i></div>
							<input type="text" class="form-control" id="hashtag"
								   placeholder="<%= htmlWebpackPlugin.options.i18n['Keyword Theme'] %>" />
							<div id="hashtag-empty" class="input-group-addon" hidden>
								<button type="button" class="close" data-dismiss="modal">&times;</button>
							</div>
						</div>
					</fieldset>
					<div class="row">
						<p class="text-xs-center">
							<button type="submit" class="btn btn-primary">
								<i class="fa fa-search"></i> <%= htmlWebpackPlugin.options.i18n['Search!'] %></button>
						</p>
					</div>
				</form>
			</div>
		</div>
	</div>
	<footer class="container">
		<nav class="nav text-xs-center">
			<span class="line">
				<i class="fa fa-info-circle"></i>&nbsp;<a href="/about/" data-href="about"
													 data-toggle="modal" data-target="#modalWindow"><%= htmlWebpackPlugin.options.i18n.About %></a> |
				<i class="fa fa-question-circle"></i>&nbsp;<a href="/faq/" data-href="faq"
															  data-toggle="modal" data-target="#modalWindow"><%= htmlWebpackPlugin.options.i18n.Faq %></a> |
				<i class="fa fa-exclamation-circle"></i>&nbsp;<a href="/tos/" data-href="tos"
															  data-toggle="modal" data-target="#modalWindow"><%= htmlWebpackPlugin.options.i18n.Tos %></a> |
				<i class="fa fa-envelope"></i>&nbsp;<a href="/contact/" data-href="contact"
												  data-toggle="modal" data-target="#modalWindow"><%= htmlWebpackPlugin.options.i18n.Contact %></a> |
			</span>
			<span class="line">
				<i class="fa fa-twitter"></i>&nbsp;<a href="//twitter.com/wouaf_it" target=_blank"><%= htmlWebpackPlugin.options.i18n.Twitter %></a> |
				<i class="fa fa-facebook-official"></i>&nbsp;<a href="https://www.facebook.com/wouafit/" target=_blank">Facebook</a>
			</span>
		</nav>
	</footer>
</div>
<div id="toast" hidden><div></div></div>
<!-- Modals -->
<div class="modal fade" id="modalWindow" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
		</div>
	</div>
</div>
<div id="loader" class="uil-ripple-css" hidden title="<%= htmlWebpackPlugin.options.i18n.Loading %>"><div></div><div></div></div>
<div id="dtBox"></div>