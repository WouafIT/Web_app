<!DOCTYPE html>
<html lang="{%= o.htmlWebpackPlugin.options.i18n.languageShort %}">
<head>
	<meta charset="utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	<title>{%= o.htmlWebpackPlugin.options.i18n['Wouaf IT'] %}</title>
	<meta name="description" content="{%= o.htmlWebpackPlugin.options.i18n['Wouaf IT'] %} - {%= o.htmlWebpackPlugin.options.i18n['Your social network for your local events'] %}" />
	<!-- Bootstrap -->
	<link rel="stylesheet" href="https://cdn.rawgit.com/twbs/bootstrap/v4-dev/dist/css/bootstrap.css" />
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
	<script src="/js/libs/modernizr.js?1"></script>
	<style>
		#splash {
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;
			background: #2B9D48;
			z-index: 100;
		}
	</style>
</head>
<body>
<div id="sb-site">
	<div id="menu" title="{%= o.htmlWebpackPlugin.options.i18n['Menu'] %}" class="sb-toggle-left"><i class="fa fa-bars fa-lg"></i></div>
	<div id="map"></div>
</div>
<div class="sb-slidebar sb-width-wide sb-left">
	<header>
		<nav class="nav pull-right">
			<div class="anonymous" hidden>
				<i class="fa fa-sign-in"></i> <a href="#">{%= o.htmlWebpackPlugin.options.i18n['Login'] %}</a> |
				<i class="fa fa-user-plus"></i> <a href="#">{%= o.htmlWebpackPlugin.options.i18n['Create your account'] %}</a>
			</div>
			<div class="logged">
				<i class="fa fa-user"></i> <a href="#">{%= o.htmlWebpackPlugin.options.i18n['My account'] %}</a> |
				<i class="fa fa-cog"></i> <a href="#">{%= o.htmlWebpackPlugin.options.i18n['Parameters'] %}</a> |
				<button class="btn btn-link" title="{%= o.htmlWebpackPlugin.options.i18n['Logout'] %}"><i class="fa fa-power-off"></i></button>
			</div>
		</nav>
		<h1 class="logo">{%= o.htmlWebpackPlugin.options.i18n['Wouaf IT'] %}</h1>
		<h2 class="description">{%= o.htmlWebpackPlugin.options.i18n['Your social network for your local events'] %}</h2>
	</header>
	<div class="container">
		<div class="row">
			<ul class="nav nav-tabs">
				<li class="nav-item">
					<a href="#search" class="nav-link active" role="tab" data-toggle="tab"><i class="fa fa-search"></i> {%= o.htmlWebpackPlugin.options.i18n['Search'] %}</a>
				</li>
				<li class="nav-item">
					<a href="#wouafs" class="nav-link" role="tab" data-toggle="tab"><i class="fa fa-list"></i> {%= o.htmlWebpackPlugin.options.i18n['Your Wouafs'] %}</a>
				</li>
			</ul>
		</div>
		<!-- Tab panes -->
		<div class="tab-content">
			<div role="tabpanel" class="tab-pane active" id="search">
				<form>
					<fieldset class="form-group row">
						<label for="where">{%= o.htmlWebpackPlugin.options.i18n['Where?'] %}</label>
						<div class="input-group">
							<div class="input-group-addon"><i class="fa fa-crosshairs"></i></div>
							<input type="text" class="form-control" id="where" placeholder="{%= o.htmlWebpackPlugin.options.i18n['Look for a place'] %}" />
						</div>
					</fieldset>
					<fieldset class="form-group row">
						<label for="when">{%= o.htmlWebpackPlugin.options.i18n['When?'] %}</label>
						<div class="input-group">
							<div class="input-group-addon"><i class="fa fa-calendar-o"></i></div>
							<select class="form-control" id="when" placeholder="{%= o.htmlWebpackPlugin.options.i18n['Choose a period'] %}">
								<option value="today">{%= o.htmlWebpackPlugin.options.i18n['Today'] %}</option>
								<option value="tomorrow">{%= o.htmlWebpackPlugin.options.i18n['Tomorrow'] %}</option>
								<option value="week" selected="selected">{%= o.htmlWebpackPlugin.options.i18n['This week'] %}</option>
								<option value="month">{%= o.htmlWebpackPlugin.options.i18n['This month'] %}</option>
								<option value="custom">{%= o.htmlWebpackPlugin.options.i18n['Specific dates'] %}</option>
							</select>
						</div>
					</fieldset>
					<fieldset class="form-group row specific-date">
						<div class="col-lg-6">
							<label for="start">{%= o.htmlWebpackPlugin.options.i18n['From'] %}</label>
							<div class="input-group">
								<div class="input-group-addon"><i class="fa fa-calendar"></i></div>
								<input type="date" class="form-control" id="start" placeholder="{%= o.htmlWebpackPlugin.options.i18n['Start'] %}" />
							</div>
						</div>
						<div class="col-lg-6">
							<label for="end">{%= o.htmlWebpackPlugin.options.i18n['To'] %}</label>
							<div class="input-group">
								<div class="input-group-addon"><i class="fa fa-calendar"></i></div>
								<input type="date" class="form-control" id="end" placeholder="{%= o.htmlWebpackPlugin.options.i18n['End'] %}" />
							</div>
						</div>
					</fieldset>
					<fieldset class="form-group row">
						<label for="what">{%= o.htmlWebpackPlugin.options.i18n['What?'] %}</label>
						<div class="input-group">
							<div class="input-group-addon"><i class="fa fa-question-circle"></i></div>
							<select class="form-control" id="what" placeholder="{%= o.htmlWebpackPlugin.options.i18n['Choose a category'] %}"></select>
						</div>
					</fieldset>
					<fieldset class="form-group row">
						<label class="sr-only" for="hashtag">{%= o.htmlWebpackPlugin.options.i18n['Hashtag'] %}</label>
						<div class="input-group">
							<div class="input-group-addon"><i class="fa fa-tag"></i></div>
							<input type="text" class="form-control" id="hashtag" placeholder="{%= o.htmlWebpackPlugin.options.i18n['Specify a hashtag'] %}" />
						</div>
					</fieldset>
					<div class="row">
						<div class="col-xs-4 col-xs-offset-4">
							<button type="submit" class="btn btn-primary"><i class="fa fa-search"></i> {%= o.htmlWebpackPlugin.options.i18n['Search!'] %}</button>
						</div>
					</div>
				</form>

			</div>
			<div role="tabpanel" class="tab-pane" id="wouafs">Wouafs</div>
		</div>
	</div>
	<footer class="container">
		<nav class="nav text-center small">
			<i class="fa fa-info-circle"></i> <a href="#" data-href="/parts/about.html?{%= o.htmlWebpackPlugin.options.data.timestamp %}" data-toggle="modal" data-target="#modalWindow">{%= o.htmlWebpackPlugin.options.i18n.About %}</a> |
			<i class="fa fa-envelope"></i> <a href="#" data-href="/parts/contact.html?{%= o.htmlWebpackPlugin.options.data.timestamp %}" data-toggle="modal" data-target="#modalWindow">{%= o.htmlWebpackPlugin.options.i18n.Contact %}</a> |
			<i class="fa fa-twitter"></i> <a href="https://twitter.com/wouaf_it" target=_blank">{%= o.htmlWebpackPlugin.options.i18n.Twitter %}</a>
		</nav>
	</footer>
</div>
<div id="splash"></div>
<div id="toast"><div></div></div>
<!-- Modal -->
<div class="modal fade" id="modalWindow" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
		</div>
	</div>
</div>
<div id="loader" class="uil-ripple-css"><div></div><div></div></div>
<!-- jQuery -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<!-- Bootstrap -->
<script src="https://cdn.rawgit.com/twbs/bootstrap/v4-dev/dist/js/bootstrap.js"></script>
<!-- GMaps -->
<script src="https://maps.googleapis.com/maps/api/js?key={%= o.htmlWebpackPlugin.options.data.googleApi %}&libraries=geometry"></script>
<script type="text/javascript" src="js/build.js?{%= o.htmlWebpackPlugin.options.data.timestamp %}" charset="utf-8"></script>
</body>
</html>