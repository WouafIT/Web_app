<?php $pageContent = include(__DIR__.'/php/index.php'); ?>
<!DOCTYPE html>
<html lang="<%= htmlWebpackPlugin.options.i18n.languageShort %>">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="theme-color" content="#2B9D48" />
	<meta name="msapplication-navbutton-color" content="#2B9D48">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-status-bar-style" content="#2B9D48">
	<title><%= htmlWebpackPlugin.options.i18n['Wouaf IT'] %></title>
	<meta name="description" content="<%= htmlWebpackPlugin.options.i18n['Wouaf IT'] %> -
		<%= htmlWebpackPlugin.options.i18n['Your social network for your local events'] %>" />
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha.2/css/bootstrap.min.css" />
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css" />
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/dropzone/4.2.0/min/dropzone.min.css" />
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/jquery.swipebox/1.4.1/css/swipebox.min.css" />
	<link rel="apple-touch-icon-precomposed" href="apple-touch-icon.png" />
	<script src="/js/libs/modernizr.js?v=1"></script>
	<style>#splash {position: absolute;top: 0;left: 0;height: 100%;width: 100%;background: #2B9D48;z-index: 100;}</style>
</head>
<body>
<div id="splash"></div>
<div id="page-content"><?php echo $pageContent; ?></div>
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/tether/1.1.1/js/tether.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha.2/js/bootstrap.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/i18next/2.1.0/i18next.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/dropzone/4.2.0/min/dropzone.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery.swipebox/1.4.1/js/jquery.swipebox.min.js"></script>
<script src="//maps.googleapis.com/maps/api/js?key=<%= htmlWebpackPlugin.options.data.googleApi %>&libraries=geometry"></script>
<script src="//ws.sharethis.com/button/buttons.js"></script>
<script src="/js/build.js?v=<%= htmlWebpackPlugin.options.data.timestamp %>" charset="utf-8"></script>
<script>
	window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
	ga('create', '<%= htmlWebpackPlugin.options.data.googleAnalytics %>', {
	});
	ga('send', 'pageview');
</script>
<script async src='https://www.google-analytics.com/analytics.js'></script>
</body>
</html>