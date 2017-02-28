<?php
define('__DEV__', '<%= htmlWebpackPlugin.options.data.isDev %>' === 'true');
$buildTime = (int)'<%= htmlWebpackPlugin.options.data.timestamp %>';

$requestURI = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
//remove query string
if (strpos($requestURI, '?') !== false) {
	$requestURI = substr($requestURI, 0, strpos($requestURI, '?'));
}

//404 on missing parts files
if (preg_match('#\/parts\/.*#', $requestURI, $matches)) {
	header("HTTP/1.1 404 Not Found");
	header("Cache-Control: max-age=1800, must-revalidate");
	echo file_get_contents(__DIR__.'/../404.html');
	exit;
}

//grab vars in URL
$wouafId = $userId = null;
if (preg_match('#\/wouaf\/([0-9a-f]{24})\/.*#', $requestURI, $matches)) {
	$wouafId = $matches[1];
}
if (preg_match('#\/user\/([^/]*)\/.*#', $requestURI, $matches)) {
	$userId = $matches[1];
}
//Generate file Last-modified header
//if no wouaf or user is queried
//=> Last-modified is last build time
//else
//=> Last-modified should be checked from api server

if ($wouafId || $userId) {
	header("Cache-Control: public, max-age=120, s-maxage=1800, must-revalidate");
	header("Last-Modified: ".gmdate("D, d M Y H:i:s", time())." GMT"); //TODO => remove time() and use Last modified data from API
} else {
	header("Cache-Control: public, max-age=1800, s-maxage=86400, must-revalidate");
	header("Last-Modified: ".gmdate("D, d M Y H:i:s", $buildTime)." GMT");
}
if (isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) &&
	@strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE']) == $buildTime
) {
	header("HTTP/1.1 304 Not Modified");
	exit;
}
//microformat
$microformat = array(
	array(
		"@context"    => "http://schema.org",
		"@type"       => "Organization",
		"name"        => 'Wouaf IT',
		"logo"        => "https://img.wouaf.it/icon-512.png",
		"description" => "<%= htmlWebpackPlugin.options.i18n['Wouaf_IT_description'] %>",
		"url"         => 'https://wouaf.it/',
		"SameAs"      => array(
			"https://www.facebook.com/wouafit/",
			"https://twitter.com/Wouaf_IT",
		),
	), array(
		"@context" => "http://schema.org",
		"@type"    => "WebSite",
		"name"     => 'Wouaf IT',
		"url"      => 'https://wouaf.it/',
	),
);
$data        = array(
	'content'   => '<script type="application/ld+json">'.json_encode($microformat).'</script>',
	'canonical' => 'https://'.$_SERVER['HTTP_HOST'].$requestURI,
	'head'      => (getDefaultMeta().PHP_EOL.
					'<link rel="alternate" hreflang="fr" href="https://fr-fr.<%= htmlWebpackPlugin.options.data.domain %>'.$requestURI.'" />'.PHP_EOL.
					'<link rel="alternate" hreflang="en" href="https://en-us.<%= htmlWebpackPlugin.options.data.domain %>'.$requestURI.'" />')
);
if (!$requestURI || $requestURI === '/') {
	return $data;
}
$staticPages = array(
	'tos', 'about', 'faq', 'login', 'contact'
);
foreach ($staticPages as $staticPage) {
	if (strpos($requestURI, '/'.$staticPage.'/') !== false) {
		$data['content'] .= file_get_contents(__DIR__.'/../parts/'.$staticPage.'.html');
		break;
	}
}
define('API_KEY', '<%= htmlWebpackPlugin.options.data.apiKey %>');
if ($wouafId || $userId) {
	$data['content'] .= '<script>window.wouafit = {};</script>';
}
$locale = "<%= htmlWebpackPlugin.options.i18n['languageLong'] %>";
if ($wouafId) {
	try {
		//Get wouaf data from API
		$wouafData = curlGet(
			'https://<%= htmlWebpackPlugin.options.data.apiDomain %>/wouafs/'.$wouafId,
			array(
				'html' 		=> 1,
				'version'	=> 1,
				'key'		=> API_KEY
			)
		);
		if ($wouafData) {
			$wouafData = json_decode($wouafData, true);
			if ($wouafData['code'] === 200) {
				$data['canonical'] = 'https://'.$_SERVER['HTTP_HOST'].'/wouaf/'.$wouafId.'/';
				$data['content'] .= '<script>window.wouafit.wouaf = '.json_encode($wouafData['wouaf']).';</script>'.PHP_EOL.
									getWouafHTML($wouafData['wouaf']);
				$data['head'] = getWouafMeta($wouafData['wouaf']).PHP_EOL.
								'<link rel="alternate" hreflang="fr" href="https://fr-fr.<%= htmlWebpackPlugin.options.data.domain %>/wouaf/'.$wouafId.'/" />'.PHP_EOL.
								'<link rel="alternate" hreflang="en" href="https://en-us.<%= htmlWebpackPlugin.options.data.domain %>/wouaf/'.$wouafId.'/" />';
			} elseif ($wouafData['code'] === 404) {
				header("HTTP/1.1 404 Not Found");
				$data['head'] = getDefaultMeta();
				$data['content'] .= '<h1>404 not Found</h1>';
			} else {
				if (__DEV__) {
					var_dump($wouafData);
					exit;
				}
			}
		}
	} catch (Exception $e) {
		if (__DEV__) {
			var_dump($e);
			exit;
		}
	}
} else if ($userId) {
	try {
		//Get user data from API
		$userData = curlGet(
			'https://<%= htmlWebpackPlugin.options.data.apiDomain %>/users/'.$userId,
			array(
				'html' 		=> 1,
				'version'	=> 1,
				'key'		=> API_KEY
			)
		);
		if ($userData) {
			$userData = json_decode($userData, true);
			if ($userData['code'] === 200) {
				$data['canonical'] = 'https://'.$_SERVER['HTTP_HOST'].'/user/'.$userId.'/';
				$data['content'] .= '<script>window.wouafit.user = '.json_encode($userData['user']).';</script>'.PHP_EOL.
									getUserHTML($userData['user']);
				$data['head'] = getUserMeta($userData['user']).PHP_EOL.
								'<link rel="alternate" hreflang="fr" href="https://fr-fr.<%= htmlWebpackPlugin.options.data.domain %>/user/'.$userId.'/" />'.PHP_EOL.
								'<link rel="alternate" hreflang="en" href="https://en-us.<%= htmlWebpackPlugin.options.data.domain %>/user/'.$userId.'/" />';
			} elseif ($userData['code'] === 404) {
				header("HTTP/1.1 404 Not Found");
				$data['head'] = getDefaultMeta();
				$data['content'] .= '<h1>404 not Found</h1>';
			} else {
				if (__DEV__) {
					var_dump($userData);
					exit;
				}
			}
		}
	} catch (Exception $e) {
		if (__DEV__) {
			var_dump($e);
			exit;
		}
	}
}

return $data;

/**
 * Generate default OpenGraph meta tags
 *
 * @return string
 */
function getDefaultMeta() {
	global $requestURI;
	return "<title><%= htmlWebpackPlugin.options.i18n['Wouaf IT'] %><%= htmlWebpackPlugin.options.data.devTitle %> - <%= htmlWebpackPlugin.options.i18n['Your social network for your local events'] %></title>".PHP_EOL.
		   "<meta name=\"description\" content=\"<%= htmlWebpackPlugin.options.i18n['Wouaf_IT_description'] %>\" />".PHP_EOL.
		   "<meta property=\"og:title\" content=\"<%= htmlWebpackPlugin.options.i18n['Wouaf IT'] %> - <%= htmlWebpackPlugin.options.i18n['Your social network for your local events'] %>\" />".PHP_EOL.
		   "<meta property=\"og:description\" content=\"<%= htmlWebpackPlugin.options.i18n['Wouaf_IT_description'] %>\" />".PHP_EOL.
		   '<meta property="og:type" content="website" />'.PHP_EOL.
		   '<meta property="og:url" content="https://'.$_SERVER['HTTP_HOST'].$requestURI.'" />'.PHP_EOL.
		   '<meta property="fb:app_id" content="<%= htmlWebpackPlugin.options.data.facebookAppId %>" />'.PHP_EOL.
		   '<meta property="og:image" content="https://<%= htmlWebpackPlugin.options.data.imgDomain %>/1200-630.png" />'.PHP_EOL.
		   '<meta property="og:image:width" content="1200" />'.PHP_EOL.
		   '<meta property="og:image:height" content="630" />'.PHP_EOL.
		   '<meta name="twitter:card" content="summary" />'.PHP_EOL.
		   '<meta name="twitter:site" content="@Wouaf_IT" />'.PHP_EOL.
		   "<meta name=\"twitter:title\" content=\"<%= htmlWebpackPlugin.options.i18n['Wouaf IT'] %>\" />".PHP_EOL.
		   "<meta name=\"twitter:description\" content=\"<%= htmlWebpackPlugin.options.i18n['Wouaf_IT_description'] %>\" />".PHP_EOL.
		   '<meta name="twitter:image" content="https://<%= htmlWebpackPlugin.options.data.imgDomain %>/icon.png" />'.PHP_EOL;
}

/**
 * Generate OpenGraph meta tags for a given Wouaf
 *
 * @param array $data wouaf data
 * @return string
 */
function getWouafMeta($data) {
	global $locale;

	$description      = strip_tags($data['text']);
	$safe_description = htmlspecialchars(str_replace(PHP_EOL, ' ', mb_substr($description, 0, 299).(mb_strlen($description) > 299 ? '…' : '')));
	$lastDate         = count($data['dates']) - 1;
	$start            = new DateTime();
	$end              = new DateTime();
	$start->setTimestamp(intval($data['dates'][0]['start']));
	$end->setTimestamp(intval($data['dates'][$lastDate]['end']));
	if (!empty($data['tz'])) {
		$timeZone = new DateTimeZone(timezone_name_from_abbr("", $data['tz'] * 60, 0));
		$start->setTimezone($timeZone);
		$end->setTimezone($timeZone);
	}
	$safe_title = htmlspecialchars(getWouafTitle($data));
	$return     = "<title>".$safe_title." - <%= htmlWebpackPlugin.options.i18n['Wouaf IT'] %><%= htmlWebpackPlugin.options.data.devTitle %></title>".PHP_EOL.
				  '<meta name="description" content="'.$safe_description.'" />'.PHP_EOL.
				  "<meta property=\"og:title\" content=\"".$safe_title." - <%= htmlWebpackPlugin.options.i18n['Wouaf IT'] %>\" />".PHP_EOL.
				  '<meta property="fb:app_id" content="<%= htmlWebpackPlugin.options.data.facebookAppId %>" />'.PHP_EOL.
				  '<meta property="og:type" content="article" />'.PHP_EOL.

				  '<meta property="article:published_time" content="'.$start->format('c').'" />'.PHP_EOL.
				  '<meta property="article:expiration_time" content="'.$end->format('c').'" />'.PHP_EOL.
				  '<meta property="article:author" content="https://'.$_SERVER['HTTP_HOST'].'/user/'.htmlspecialchars($data['author'][1]).'/" />'.PHP_EOL.

				  '<meta property="og:url" content="https://'.$_SERVER['HTTP_HOST'].'/wouaf/'.$data['id'].'/" />'.PHP_EOL.
				  '<meta property="og:site_name" content="Wouaf IT" />'.PHP_EOL.
				  '<meta property="og:locale" content="'.(isset($data['locale']) ? $data['locale'] : $locale).'" />'.PHP_EOL.
				  '<meta property="og:description" content="'.$safe_description.'" />'.PHP_EOL.
				  '<meta name="twitter:card" content="summary" />'.PHP_EOL.
				  '<meta name="twitter:site" content="@Wouaf_IT" />'.PHP_EOL.
				  "<meta name=\"twitter:title\" content=\"".$safe_title." - <%= htmlWebpackPlugin.options.i18n['Wouaf IT'] %>\" />".PHP_EOL.
				  '<meta name="twitter:description" content="'.$safe_description.'" />'.PHP_EOL;

	if (!empty($data['pics']) && is_array($data['pics'])) {
		foreach ($data['pics'] as $k => $pic) {
			$return .= '<meta property="og:image" content="'.htmlspecialchars($pic['full']).'" />'.PHP_EOL;
			if (!$k) {
				$return .= '<meta name="twitter:image" content="'.htmlspecialchars($pic['full']).'" />'.PHP_EOL;
			}
		}
	} else {
		$return .= '<meta property="og:image" content="https://<%= htmlWebpackPlugin.options.data.imgDomain %>/1200-630.png" />'.PHP_EOL.
				   '<meta property="og:image:width" content="1200" />'.PHP_EOL.
				   '<meta property="og:image:height" content="630" />'.PHP_EOL.
				   '<meta name="twitter:image" content="https://<%= htmlWebpackPlugin.options.data.imgDomain %>/icon.png" />'.PHP_EOL;
	}
	if (!empty($data['tags']) && is_array($data['tags'])) {
		foreach ($data['tags'] as $tag) {
			$return .= '<meta property="article:tag" content="'.htmlspecialchars($tag).'" />'.PHP_EOL;
		}
	}
	return $return;
}

/**
 * Generate title for a given Wouaf
 *
 * @param array $data wouaf data
 * @return string
 */
function getWouafTitle($data) {
	if (!empty($data['title'])) {
		$title = $data['title'];
	} else {
		$title = strip_tags($data['text']);
		$title = mb_substr($title, 0, 79).(mb_strlen($title) > 79 ? '…' : '');
	}
	return $title;
}

/**
 * Generate ISO_8601 duration
 *
 * @param int $seconds
 * @return string
 */
function iso8601_duration($seconds) {
	$days    = floor($seconds / 86400);
	$seconds = $seconds % 86400;

	$hours   = floor($seconds / 3600);
	$seconds = $seconds % 3600;

	$minutes = floor($seconds / 60);
	$seconds = $seconds % 60;

	return sprintf('P%dDT%dH%dM%dS', $days, $hours, $minutes, $seconds);
}

/**
 * Generate html tags for a given Wouaf
 *
 * @param array $data wouaf data
 * @return string
 */
function getWouafHTML($data) {
	global $locale;
	setlocale(LC_TIME, $locale.'.utf8');
	$t        = array(
		'By'   => "<%= htmlWebpackPlugin.options.i18n['By'] %>",
		'From' => "<%= htmlWebpackPlugin.options.i18n['From'] %>",
		'to'   => "<%= htmlWebpackPlugin.options.i18n['to'] %>",
		'at'   => "<%= htmlWebpackPlugin.options.i18n['at'] %>",
	);
	$lastDate = count($data['dates']) - 1;
	$start    = new DateTime();
	$start->setTimestamp(intval($data['dates'][0]['start']));
	$end = new DateTime();
	$end->setTimestamp(intval($data['dates'][$lastDate]['end']));
	if (!empty($data['tz'])) {
		$timezoneName = timezone_name_from_abbr("", $data['tz'] * 60, 0);
		$timeZone     = new DateTimeZone($timezoneName);
		date_default_timezone_set($timezoneName);
		$start->setTimezone($timeZone);
		$end->setTimezone($timeZone);
	}
	$title      = getWouafTitle($data);
	$safe_title = htmlspecialchars($title);
	$return     = '<div class="h-event">'.PHP_EOL.
				  '<h1><a href="https://<%= htmlWebpackPlugin.options.data.domain %>/wouaf/'.$data['id'].'/" class="u-url p-name">'.
				  $safe_title.'</a></h1>'.PHP_EOL.
				  '<p>'.$t['By'].' '.PHP_EOL.
				  '	<a class="p-author h-card" href="https://<%= htmlWebpackPlugin.options.data.domain %>/user/'.htmlspecialchars($data['author'][1]).'/">'.PHP_EOL.
				  '	'.htmlspecialchars(!empty($data['author'][2]) ? $data['author'][2] : $data['author'][1]).PHP_EOL.
				  ' </a>'.PHP_EOL.
				  '</p>'.PHP_EOL.
				  '<p>'.$t['From'].' <time class="dt-start" datetime="'.$start->format('c').'">'.
				  strftime('%c', intval($data['dates'][0]['start'])).'</time>'.PHP_EOL.
				  '	'.$t['to'].' <time class="dt-end" datetime="'.$end->format('c').'">'.
				  strftime('%c', intval($data['dates'][$lastDate]['end'])).'</time>'.PHP_EOL.
				  '	'.$t['at'].' <span class="p-location h-geo">'.PHP_EOL.
				  '		<span class="p-latitude">'.$data['geo'][0].'</span>, '.PHP_EOL.
				  '		<span class="p-longitude">'.$data['geo'][1].'</span>'.PHP_EOL.
				  '	</span></p>'.PHP_EOL.
				  '<p class="p-description">'.$data['html'].'</p>'.PHP_EOL;
	if (!empty($data['tags']) && is_array($data['tags'])) {
		$return .= '<p>';
		foreach ($data['tags'] as $tag) {
			$return .= '<a href="https://<%= htmlWebpackPlugin.options.data.domain %>/tag/'.htmlspecialchars($tag).'/" class="p-category">'.
					   htmlspecialchars($tag).'</a>, '.PHP_EOL;
		}
		$return .= '</p>';
	}
	if (!empty($data['pics']) && is_array($data['pics'])) {
		$return .= '<p>';
		foreach ($data['pics'] as $pic) {
			$return .= '<img src="'.htmlspecialchars($pic['full']).'" class="u-photo" alt="'.$safe_title.'" /> '.PHP_EOL;
		}
		$return .= '</p>';
	}
	$return .= '</div>';
	if (!empty($data['location'])) {
		//microformat
		$microformat = array(
			"@context"    => "http://schema.org",
			"@type"       => "Event",
			"name"        => $title,
			"description" => $data['text'],
			"url"         => 'https://<%= htmlWebpackPlugin.options.data.domain %>/wouaf/'.$data['id'].'/',
			"startDate"   => $start->format('c'),
			"endDate"     => $end->format('c'),
			"duration"    => iso8601_duration($end->getTimestamp() - $start->getTimestamp()),
			"location"    => array(
				"@type"   => "Place",
				"name"    => $data['location']['name'],
				"address" => ($data['location']['address'].', '.
							  $data['location']['zip'].' '.
							  $data['location']['city'].', '.
							  $data['location']['country']),
				"geo"     => [
					"@type"     => "GeoCoordinates",
					"latitude"  => $data['geo'][0],
					"longitude" => $data['geo'][1]
				]
			),
		);

		if (!empty($data['pics']) && is_array($data['pics'])) {
			$microformat['image'] = $data['pics'][0]['full'];
		}
		if (!empty($data['url'])) {
			$microformat['sameAs'] = $data['url'];
		}
		$return .= '<script type="application/ld+json">'.json_encode($microformat).'</script>';
	}
	return $return;
}

/**
 * Generate OpenGraph meta tags for a given User
 *
 * @param array $data user data
 * @return string
 */
function getUserMeta($data) {
	$t                = array(
		'{{user}} is on Wouaf IT' => "<%= htmlWebpackPlugin.options.i18n['{{user}} is on Wouaf IT'] %>",
	);
	$safe_title       = htmlspecialchars(str_replace('{{user}}', getUserDisplayName($data), $t['{{user}} is on Wouaf IT']));
	$safe_description = htmlspecialchars(str_replace(PHP_EOL, ' ', mb_substr(strip_tags($data['description']), 0, 300)));
	$return           = "<title><%= htmlWebpackPlugin.options.i18n['Wouaf IT'] %><%= htmlWebpackPlugin.options.data.devTitle %> - ".$safe_title."</title>".PHP_EOL.
						'<meta name="description" content="'.$safe_description.'" />'.PHP_EOL.
						'<meta property="fb:app_id" content="<%= htmlWebpackPlugin.options.data.facebookAppId %>" />'.PHP_EOL.
						'<meta property="og:title" content="'.$safe_title.'" />'.PHP_EOL.
						'<meta property="og:type" content="profile" />'.PHP_EOL.
						'<meta property="og:url" content="https://'.$_SERVER['HTTP_HOST'].'/user/'.$data['username'].'/" />'.PHP_EOL.
						'<meta property="og:site_name" content="Wouaf IT" />'.PHP_EOL.
						'<meta property="og:locale" content="'.$data['locale'].'" />'.PHP_EOL;
	if (!empty($data['fid'])) {
		$return .= '<meta property="fb:profile_id" content="'.htmlspecialchars($data['fid']).'" />'.PHP_EOL;
	}
	if (!empty($data['username'])) {
		$return .= '<meta property="og:username" content="'.htmlspecialchars($data['username']).'" />'.PHP_EOL;
	}
	if (!empty($data['description'])) {
		$return .= "<meta property=\"og:description\" content=\"".$safe_description." - <%= htmlWebpackPlugin.options.i18n['Wouaf_IT_description'] %>\" />".PHP_EOL;
	} else {
		$return .= "<meta property=\"og:description\" content=\"<%= htmlWebpackPlugin.options.i18n['Wouaf_IT_description'] %>\" />".PHP_EOL;
	}
	if (!empty($data['gender'])) {
		$return .= '<meta property="profile:gender" content="'.htmlspecialchars($data['gender']).'" />'.PHP_EOL;
	}
	$return .=
		'<meta name="twitter:card" content="summary" />'.PHP_EOL.
		'<meta name="twitter:site" content="@Wouaf_IT" />'.PHP_EOL.
		'<meta name="twitter:title" content="'.$safe_title.'" />'.PHP_EOL;
	if (!empty($data['description'])) {
		$return .= '<meta name="twitter:description" content="'.$safe_description.'" />'.PHP_EOL;
	} else {
		$return .= "<meta name=\"twitter:description\" content=\"<%= htmlWebpackPlugin.options.i18n['Wouaf_IT_description'] %>\" />".PHP_EOL;
	}
	if (!empty($data['avatar'])) {
		$return .= '<meta property="og:image" content="'.htmlspecialchars($data['avatar']).'" />'.PHP_EOL.
				   '<meta name="twitter:image" content="'.htmlspecialchars($data['avatar']).'" />'.PHP_EOL;
	} else {
		$return .= '<meta property="og:image" content="https://<%= htmlWebpackPlugin.options.data.imgDomain %>/1200-630.png" />'.PHP_EOL.
				   '<meta property="og:image:width" content="1200" />'.PHP_EOL.
				   '<meta property="og:image:height" content="630" />'.PHP_EOL.
				   '<meta name="twitter:image" content="https://<%= htmlWebpackPlugin.options.data.imgDomain %>/icon.png" />'.PHP_EOL;
	}
	return $return;
}

/**
 * Generate OpenGraph meta tags for a given User
 *
 * @param array $data user data
 * @return string
 */
function getUserHTML($data) {
	$name   = getUserDisplayName($data);
	$return = '<div class="h-card">'.PHP_EOL.
			  '<h1><a class="p-name u-url" href="https://<%= htmlWebpackPlugin.options.data.domain %>/user/'.$data['username'].'/">'.htmlspecialchars($name).'</a></h1>'.PHP_EOL;
	if (!empty($data['html'])) {
		$return .= '<p class="p-note">'.$data['html'].'</p>'.PHP_EOL;
	}
	if (!empty($data['displayname'])) {
		$return .= '<p class="p-given-name">'.$data['displayname'].'</p>'.PHP_EOL;
	}
	$return .= '<p class="p-nickname">'.$data['username'].'</p>'.PHP_EOL.
			   '</div>';
	$type = empty($data['type']) || $data['type'] === 'individual' ? 'Person' : 'Organization';
	//microformat
	$microformat = array(
		"@context"    => "http://schema.org",
		"@type"       => $type,
		"name"        => $name,
		"description" => $data['description'],
		"url"         => 'https://<%= htmlWebpackPlugin.options.data.domain %>/user/'.$data['username'].'/',
	);
	if (!empty($data['avatar'])) {
		$microformat['image'] = $data['avatar'];
	}
	if (!empty($data['url'])) {
		$microformat['sameAs'] = $data['url'];
	}
	$return .= '<script type="application/ld+json">'.json_encode($microformat).'</script>';

	return $return;
}

/**
 * @param array $data
 * @return string
 */
function getUserDisplayName($data) {
	return !empty($data['displayname']) ? trim($data['displayname']) : (isset($data['username']) ? trim($data['username']) : '');
}

/**
 * Send a GET request using cURL
 *
 * @param string $url     to request
 * @param array  $get     values to send
 * @param array  $options for cURL
 * @return string
 * @throws Exception
 */
function curlGet($url, array $get = null, array $options = array()) {
	$defaults = array(
		CURLOPT_HEADER         => 0,
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_TIMEOUT        => 10,
		CURLOPT_URL            => $url,
		CURLOPT_HTTPHEADER     => array(
			'Origin: https://'.$_SERVER['HTTP_HOST'],
		),
	);
	if ($get) {
		$defaults[CURLOPT_URL] .= (strpos($url, '?') === false ? '?' : '').http_build_query($get);
	}

	$ch = curl_init();
	curl_setopt_array($ch, ($options + $defaults));
	if (!$result = curl_exec($ch)) {
		throw new Exception('CURL error: '.curl_error($ch));
	}
	curl_close($ch);
	return $result;
}