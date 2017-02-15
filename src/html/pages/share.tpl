<!DOCTYPE html>
<html lang="<%= htmlWebpackPlugin.options.i18n.languageShort %>">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />

	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />
	<link rel="icon" type="image/png" href="/favicon-194x194.png" sizes="194x194" />
	<link rel="icon" type="image/png" href="/android-chrome-192x192.png" sizes="192x192" />
	<link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16" />
	<link rel="manifest" href="/manifest.json" />
	<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#2b9d48" />
	<meta name="msapplication-TileColor" content="#2b9d48" />
	<meta name="msapplication-TileImage" content="/mstile-144x144.png" />
	<meta name="theme-color" content="#2b9d48" />

	<meta name="robots" content="noindex,nofollow" />
	<title><%= htmlWebpackPlugin.options.i18n['Wouaf IT'] %><%= htmlWebpackPlugin.options.data.devTitle %> -
		<%= htmlWebpackPlugin.options.i18n['Your social network for your local events'] %></title>
	<meta name="description" content="<%= htmlWebpackPlugin.options.i18n['Wouaf IT'] %> -
		<%= htmlWebpackPlugin.options.i18n['Wouaf_IT_description'] %>" />
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" />
	<script>
		window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
		ga('create', '<%= htmlWebpackPlugin.options.data.googleAnalytics %>', {
			'cookieDomain': '<%= htmlWebpackPlugin.options.data.cookieDomain %>'
		});
		ga('send', 'pageview');
	</script>
</head>
<body>
<div class="container" id="main">
	<div id="background"><img src="https://img.wouaf.it/1600-1600.png" width="512" height="512" /></div>
	<div class="row">
		<svg height="320" width="500"></svg>
	</div>
	<div class="row">
		<div class="qrcode"></div>
	</div>
</div>
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/i18next/4.2.0/i18next.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery.qrcode/1.0/jquery.qrcode.min.js"></script>
<script src="//www.google-analytics.com/analytics.js"></script>
<script src="/js/share/build.js?v=<%= htmlWebpackPlugin.options.data.timestamp %>" charset="utf-8"></script>
</body>
</html>