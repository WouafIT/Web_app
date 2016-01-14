<!DOCTYPE html>
<html lang="{%= o.htmlWebpackPlugin.options.i18n.languageShort %}">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<title>{%= o.htmlWebpackPlugin.options.i18n['Wouaf IT'] %}</title>
	<meta name="description" content="{%= o.htmlWebpackPlugin.options.i18n['Wouaf IT'] %} -
	{%= o.htmlWebpackPlugin.options.i18n['Your social network for your local events'] %}" />
	<!-- Bootstrap -->
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha.2/css/bootstrap.min.css" />
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css">
	<link rel="apple-touch-icon-precomposed" href="apple-touch-icon.png" />
	<script src="/js/libs/modernizr.js?v=1"></script>
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
<div id="splash"></div>
<!-- jQuery -->
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<!-- Tether -->
<script src="//cdnjs.cloudflare.com/ajax/libs/tether/1.1.1/js/tether.js"></script>
<!-- Bootstrap -->
<script src="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha.2/js/bootstrap.min.js"></script>
<!-- i18next -->
<script src="//cdnjs.cloudflare.com/ajax/libs/i18next/2.0.16/i18next.min.js"></script>
<!-- GMaps -->
<script src="//maps.googleapis.com/maps/api/js?key={%= o.htmlWebpackPlugin.options.data.googleApi %}&libraries=geometry"></script>
<script type="text/javascript" src="/js/build.js?v={%= o.htmlWebpackPlugin.options.data.timestamp %}" charset="utf-8"></script>
</body>
</html>