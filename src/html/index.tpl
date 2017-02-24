<?php $data = include(__DIR__.'/php/index.php'); ?>
<!DOCTYPE html>
<html lang="<%= htmlWebpackPlugin.options.i18n.languageShort %>">
<head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# article: http://ogp.me/ns/article# profile: http://ogp.me/ns/profile#">
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

	<meta name="robots" content="index,follow" />
	<link rel="canonical" href="<?php echo $data['canonical']; ?>" />

	<?php echo $data['head']; ?>

	<link rel="preconnect" href="//wouaf.it" pr="1.0" />
	<link rel="preconnect" href="//api.wouaf.it" pr="1.0" />
	<link rel="preconnect" href="//cdn.jsdelivr.net" pr="1.0" />
	<link rel="preconnect" href="//cdnjs.cloudflare.com" pr="1.0" />
	<link rel="preconnect" href="//maps.googleapis.com" pr="1.0" />
	<link rel="preconnect" href="//platform.twitter.com" pr="1.0" />
	<link rel="preconnect" href="//connect.facebook.net" pr="1.0" />
	<link rel="preconnect" href="//www.google-analytics.com" pr="1.0" />
	<link rel="preconnect" href="//maps.gstatic.com" pr="1.0" />
	<link rel="preconnect" href="//fonts.gstatic.com" pr="1.0" />
	<link rel="preconnect" href="//fonts.googleapis.com" pr="1.0" />
	<link rel="preconnect" href="//csi.gstatic.com" pr="0.8" />
	<style>#splash {position: absolute;top: 0;left: 0;height: 100%;width: 100%;background: #2B9D48;z-index: 100;}
		#slogo{margin: auto;display: block;top: 50%;transform: translateY(-60%);position: relative;width:20%;height: auto;}
		#noscript{position: absolute;z-index: 101;color: white;padding: 5px;}</style>
	<link rel="stylesheet" href="//cdn.jsdelivr.net/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" />
	<link rel="stylesheet" href="//cdn.jsdelivr.net/fontawesome/4.7.0/css/font-awesome.min.css" />
	<link rel="stylesheet" href="//cdn.jsdelivr.net/dropzone/4.3.0/dropzone.min.css" />
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/jquery.swipebox/1.4.4/css/swipebox.min.css" />
</head>
<body>
<div id="splash">
	<svg id="slogo" width="75" height="95" viewBox="0 0 267 335" version="1.0"><g transform="translate(-241.54429,-364.93483)"><path d="m425 463c2-3 9-13 9-15 8-22 44-43 59-35 13 7 19 36 13 59-1 3-2 8-3 12-1 4-3 11-5 15-3 6-3 8-3 12 0 4 0 5-2 6-1 1-1 4-1 4 0 3 1 4 1 9 0 2 0 5 1 6 1 3 0 6-4 10-2 2-3 4-4 5-1 1-2 5-3 10-2 9-3 8 1 24 1 5-1 25-4 30-2 4-2 4 0 10 0 9 3 17-8 33-3 1-4 2-6 5-1 2-3 4-4 5-3 1-9 15-7 17 2 2 2 5 0 9-1 2-1 3-1 6-67 0-178 0-195 0 3-6 3-11 1-16-1-2-1-4 0-5 0-1 1-4 2-7 1-3 2-9 3-13 2-6 2-8 1-10-1-1-1-4-1-5 0-2-2-6-4-9-4-6-4-6-3-11 1-4 1-5-1-7-2-3-2-9 1-11 1-1 1-2 1-3 0-1 1-2 3-2 2 0 3-1 4-1 2-1 2-6 1-10-1-3-1-4 2-6 6-5 6-28 0-42-2-5-4-10-4-11 0-2-2-5-4-6-2-2-3-4-3-5 0-4-7-16-11-18-7-4-8-23-2-32 1-2 2-6 2-19 1-78 28-105 62-63 2 2 6 7 9 11 6 7 12 18 16 31 2 5 5 12 6 14 4 6 11 13 11 14 0 2 7 6 18 12 13 3 15 1 27 5 8 4 12 3 14 2 5-2 8-5 15-11z" fill="#000"/><g transform="matrix(0.01408981,0,0,-0.01408981,361.80753,435.6378)" fill="#fff"><path d="M1300 5006C594 4918 43 4265 7 3566-29 3181 104 2804 300 2477 645 1856 1059 1261 1251 569 1307 384 1346 194 1386 5c142-14 303-24 272 180 138 743 519 1406 909 2043 214 387 455 795 432 1254-7 689-503 1371-1196 1500C1638 5017 1467 5029 1300 5006Zm370-290C2287 4636 2736 4023 2710 3417 2701 2979 2444 2603 2236 2235 1952 1775 1693 1296 1513 784 1421 884 1353 1207 1245 1382 977 1952 586 2457 352 3043 168 3604 401 4279 920 4575 1144 4707 1414 4755 1670 4716ZM1379 3846c-106-41-194-117-237-207-95-196-11-434 188-532 60-30 72-32 170-32 98 0 110 2 170 32 198 98 283 335 189 531-35 72-119 155-192 188-52 24-77 29-157 31-61 2-108-2-131-11z" fill="#fff"/></g><path d="m382 422c-4-10-10-19-15-29-2-4-2-8-1-12 2-7 9-13 17-13 7 0 13 5 15 11 2 5 2 11-1 16-4 9-10 17-13 26-1 1-1 6-2 2l0 0 0 0 0 0zm3-30c3-1 5-6 2-9-2-2-4-2-6-1-2 1-4 4-3 6 1 3 3 5 6 4 1 0 1 0 2 0z" fill="#000"/></g></svg>
</div>
<div id="page-content"><?php echo $data['content']; ?></div>
<noscript><div id="noscript"><%= htmlWebpackPlugin.options.i18n['No script warning'] %></div></noscript>
<script>
	window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
	ga('create', '<%= htmlWebpackPlugin.options.data.googleAnalytics %>', {
		'cookieDomain': '<%= htmlWebpackPlugin.options.data.cookieDomain %>'
	});
</script>
<script src="//maps.googleapis.com/maps/api/js?key=<%= htmlWebpackPlugin.options.data.googleApi %>&libraries=geometry,places"></script>
<script src="//cdn.jsdelivr.net/g/jquery@3.1.1,tether@1.4.0,dropzone@4.3.0,i18next@7.0.1,bootstrap@4.0.0-alpha.6"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery.swipebox/1.4.4/js/jquery.swipebox.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/zxcvbn/4.4.1/zxcvbn.js"></script>
<script src="//connect.facebook.net/<%= htmlWebpackPlugin.options.i18n['languageLong'] %>/sdk.js"></script>
<script src="//platform.twitter.com/widgets.js"></script>
<script src="//www.google-analytics.com/analytics.js"></script>
<script src="/js/build.js?v=<%= htmlWebpackPlugin.options.data.timestamp %>" charset="utf-8"></script>
</body>
</html>