<!DOCTYPE html>
<html lang="<%= htmlWebpackPlugin.options.i18n.languageShort %>">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />

	<meta name="theme-color" content="#2B9D48" />

	<meta name="msapplication-navbutton-color" content="#2B9D48" />
	<meta name="msapplication-TileImage" content="apple-touch-icon-144x144-precomposed.png" />
	<meta name="msapplication-TileColor" content="#2B9D48" />

	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="#2B9D48" />
	<link rel="apple-touch-icon-precomposed" href="apple-touch-icon.png" />

	<meta name="robots" content="noindex,nofollow" />
	<title><%= htmlWebpackPlugin.options.i18n['Wouaf IT'] %><%= htmlWebpackPlugin.options.data.devTitle %> -
		<%= htmlWebpackPlugin.options.i18n['Your social network for your local events'] %></title>
	<meta name="description" content="<%= htmlWebpackPlugin.options.i18n['Wouaf IT'] %> -
		<%= htmlWebpackPlugin.options.i18n['Wouaf_IT_description'] %>" />
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha.5/css/bootstrap.min.css" />
	<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css" />
	<link rel="apple-touch-icon-precomposed" href="apple-touch-icon.png" />
	<style>body{background: #2B9D48 url(https://<%= htmlWebpackPlugin.options.data.imgDomain %>/logo.png) 20% 0 no-repeat;color: #FFF;}
		.container{margin-top: 20vh;} a, a:hover{color: #FFF;}
		.mask{background-color: rgba(43, 157, 72, 0.5);padding:5px;}
		#webserver {position: absolute; bottom: 0; width: 100%; text-align: center;}</style>
	<script>
		window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
		ga('create', '<%= htmlWebpackPlugin.options.data.googleAnalytics %>', {
			'cookieDomain': '<%= htmlWebpackPlugin.options.data.cookieDomain %>'
		});
		ga('send', 'pageview');
	</script>
</head>
<body>
<div class="container">
	<div class="row">
		<div class="col-md-6 col-md-offset-3">
			<div class="mask">
				<h1 class="display-3"><i class="fa fa-ban"></i> 404 Non trouvé</h1>
				<p class="lead">Désolé, la page demandée n'a pas été trouvée.</p>
				<p>Soit cette url a été mal saisie, soit ce contenu a été supprimé.</p>
				<p><a href="/">» Retour à la page d'accueil</a></p>
			</div>
		</div>
	</div>
</div>
<div id="webserver" class="font-italic"></div>
<script data-cfasync="true" src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script data-cfasync="true" src="//www.google-analytics.com/analytics.js"></script>
<script type="text/javascript">
	var tl=new Array("The requested document is totally fake.","No such file here.","Even tried multi.","Nothing helped.","I'm really depressed about this.","You see, I'm just a web server...","-- here I am, brain the size of the universe,","trying to serve you a simple web page,","and then it doesn't even exist!","Where does that leave me?!","I mean, I don't even know you.","How should I know what you wanted from me?","You honestly think I can *guess*","what someone I don't even *know*","wants to find here?","*sigh*","Man, I'm so depressed I could just cry.","And then where would we be, I ask you?","It's not pretty when a web server cries.","And where do you get off telling me what to show anyway?","Just because I'm a web server,","and possibly a manic depressive one at that?","Why does that give you the right to tell me what to do?","Huh?","I'm so depressed...","I think I'll crawl off into the trash can and decompose.","I mean, I'm gonna be obsolete in what, two weeks anyway?","What kind of a life is that?","Two effing weeks,","and then I'll be replaced by a .01 release,","that thinks it's God's gift to web servers,","just because it doesn't have some tiddly little","security hole with its HTTP POST implementation,","or something.","I'm really sorry to burden you with all this,","I mean, it's not your job to listen to my problems,","and I guess it is my job to go and fetch web pages for you.","But I couldn't get this one.","I'm so sorry.","Believe me!","Maybe I could interest you in another page?","There are a lot out there that are pretty neat, they say,","although none of them were put on *my* server, of course.","Figures, huh?","That makes me depressed too, since I have to serve them,","all day and all night long.","Two weeks of information overload,","and then *pffftt*, consigned to the trash.","What kind of a life is that?","Now, please let me sulk alone.","I'm so depressed. =:-(");var speed=50;var index=0;text_pos=0;var str_length=tl[0].length;var row;function type_text(){row=Math.max(0,index-7);document.getElementById('webserver').innerHTML=tl[index].substring(0,text_pos)+"_";if(text_pos++==str_length){text_pos=0;index++;if(index!=tl.length){str_length=tl[index].length;setTimeout("type_text()",1500)}}else{setTimeout("type_text()",speed)}}
	$(document).ready(type_text);
</script>
</body>
</html>