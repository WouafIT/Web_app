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
	header("Cache-Control: private, max-age=3600");
	header("Last-Modified: ".gmdate("D, d M Y H:i:s", time())." GMT"); //TODO => remove time() and use Last modified data from API
} else {
	header("Cache-Control: max-age=1800, s-maxage=86400, must-revalidate");
	header("Last-Modified: ".gmdate("D, d M Y H:i:s", $buildTime)." GMT");
}
if (isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) &&
	@strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE']) == $buildTime
) {
	header("HTTP/1.1 304 Not Modified");
	exit;
}

$data = array(
	'content'   => '',
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
			array('html' => 1)
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
			array('html' => 1)
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
		   '<meta property="og:image" content="https://<%= htmlWebpackPlugin.options.data.imgDomain %>/600-315.png" />'.PHP_EOL.
		   '<meta property="og:image:width" content="600" />'.PHP_EOL.
		   '<meta property="og:image:height" content="315" />'.PHP_EOL.
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
	$description = strip_tags($data['text']);
	$description = mb_substr($description, 0, 299).(mb_strlen($description) > 299 ? '…' : '');
	$lastDate    = count($data['dates']) - 1;
	$start       = new DateTime();
	$start->setTimestamp(intval($data['dates'][0]['start']));
	$end = new DateTime();
	$end->setTimestamp(intval($data['dates'][$lastDate]['end']));
	if (!empty($data['tz'])) {
		$timeZone = new DateTimeZone(timezone_name_from_abbr("", $data['tz'] * 60, 0));
		$start->setTimezone($timeZone);
		$end->setTimezone($timeZone);
	}
	$title  = getWouafTitle($data);
	$return = "<title><%= htmlWebpackPlugin.options.i18n['Wouaf IT'] %><%= htmlWebpackPlugin.options.data.devTitle %> - ".htmlspecialchars($title)."</title>".PHP_EOL.
			  '<meta name="description" content="'.htmlspecialchars(str_replace(PHP_EOL, ' ', $description)).'" />'.PHP_EOL.
			  '<meta property="og:title" content="'.htmlspecialchars($title).'" />'.PHP_EOL.
			  '<meta property="fb:app_id" content="<%= htmlWebpackPlugin.options.data.facebookAppId %>" />'.PHP_EOL.
			  '<meta property="og:type" content="article" />'.PHP_EOL.

			  '<meta property="article:published_time" content="'.$start->format('c').'" />'.PHP_EOL.
			  '<meta property="article:expiration_time" content="'.$end->format('c').'" />'.PHP_EOL.
			  '<meta property="article:author" content="https://'.$_SERVER['HTTP_HOST'].'/user/'.htmlspecialchars($data['author'][1]).'/" />'.PHP_EOL.

			  '<meta property="og:url" content="https://'.$_SERVER['HTTP_HOST'].'/wouaf/'.$data['id'].'/" />'.PHP_EOL.
			  '<meta property="og:site_name" content="Wouaf IT" />'.PHP_EOL.
			  '<meta property="og:locale" content="'.(isset($data['lang']) ? $data['lang'] : $locale).'" />'.PHP_EOL.
			  '<meta property="og:description" content="'.htmlspecialchars($description).'" />'.PHP_EOL.
			  '<meta name="twitter:card" content="summary" />'.PHP_EOL.
			  '<meta name="twitter:site" content="@Wouaf_IT" />'.PHP_EOL.
			  '<meta name="twitter:title" content="'.htmlspecialchars($title).'" />'.PHP_EOL.
			  '<meta name="twitter:description" content="'.htmlspecialchars($description).'" />'.PHP_EOL;

	if (!empty($data['pics']) && is_array($data['pics'])) {
		foreach ($data['pics'] as $k => $pic) {
			$return .= '<meta property="og:image" content="'.htmlspecialchars($pic['full']).'" />'.PHP_EOL;
			if (!$k) {
				$return .= '<meta name="twitter:image" content="'.htmlspecialchars($pic['full']).'" />'.PHP_EOL;
			}
		}
	} else {
		$return .= '<meta property="og:image" content="https://<%= htmlWebpackPlugin.options.data.imgDomain %>/600-315.png" />'.PHP_EOL.
				   '<meta property="og:image:width" content="600" />'.PHP_EOL.
				   '<meta property="og:image:height" content="315" />'.PHP_EOL.
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
	$return = '<div class="h-event">'.PHP_EOL.
			  '<h1><a href="https://<%= htmlWebpackPlugin.options.data.domain %>/wouaf/'.$data['id'].'/" class="u-url p-name">'.
			  htmlspecialchars(getWouafTitle($data)).'</a></h1>'.PHP_EOL.
			  '<p>'.$t['By'].' '.PHP_EOL.
			  '	<a class="p-author h-card" href="https://<%= htmlWebpackPlugin.options.data.domain %>/user/'.htmlspecialchars($data['author'][1]).'/">'.PHP_EOL.
			  '	'.htmlspecialchars(!empty($data['author'][2]) ? $data['author'][2] : $data['author'][1]).PHP_EOL.
			  '   </a>'.PHP_EOL.
			  '</p>'.PHP_EOL.
			  '<p>'.$t['From'].' <time class="dt-start" datetime="'.$start->format('c').'">'.
			  strftime('%c', intval($data['dates'][0]['start'])).'</time>'.PHP_EOL.
			  '	'.$t['to'].' <time class="dt-end" datetime="'.$end->format('c').'">'.
			  strftime('%c', intval($data['dates'][$lastDate]['end'])).'</time>'.PHP_EOL.
			  '	'.$t['at'].' <span class="p-location h-geo">'.PHP_EOL.
			  '		<span class="p-latitude">'.$data['loc'][0].'</span>, '.PHP_EOL.
			  '		<span class="p-longitude">'.$data['loc'][1].'</span>'.PHP_EOL.
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
			$return .= '<img src="'.htmlspecialchars($pic['full']).'" class="u-photo" /> '.PHP_EOL;
		}
		$return .= '</p>';
	}
	$return .= '</div>';
	return $return;
}

/**
 * Generate OpenGraph meta tags for a given User
 *
 * @param array $data user data
 * @return string
 */
function getUserMeta($data) {
	$t           = array(
		'{{user}} is on Wouaf IT' => "<%= htmlWebpackPlugin.options.i18n['{{user}} is on Wouaf IT'] %>",
	);
	$title       = getUserDisplayName($data);
	$title       = str_replace('{{user}}', $title, $t['{{user}} is on Wouaf IT']);
	$description = mb_substr(strip_tags($data['description']), 0, 300);
	$return      = "<title><%= htmlWebpackPlugin.options.i18n['Wouaf IT'] %><%= htmlWebpackPlugin.options.data.devTitle %> - ".htmlspecialchars($title)."</title>".PHP_EOL.
				   '<meta name="description" content="'.htmlspecialchars(str_replace(PHP_EOL, ' ', $description)).'" />'.PHP_EOL.
				   '<meta property="fb:app_id" content="<%= htmlWebpackPlugin.options.data.facebookAppId %>" />'.PHP_EOL.
				   '<meta property="og:title" content="'.htmlspecialchars($title).'" />'.PHP_EOL.
				   '<meta property="og:type" content="profile" />'.PHP_EOL.
				   '<meta property="og:url" content="https://'.$_SERVER['HTTP_HOST'].'/user/'.$data['username'].'/" />'.PHP_EOL.
				   '<meta property="og:site_name" content="Wouaf IT" />'.PHP_EOL.
				   '<meta property="og:locale" content="'.$data['lang'].'" />'.PHP_EOL;
	if (!empty($data['fid'])) {
		$return .= '<meta property="fb:profile_id" content="'.htmlspecialchars($data['fid']).'" />'.PHP_EOL;
	}
	if (!empty($data['username'])) {
		$return .= '<meta property="og:username" content="'.htmlspecialchars($data['username']).'" />'.PHP_EOL;
	}
	if (!empty($data['description'])) {
		$return .= "<meta property=\"og:description\" content=\"".htmlspecialchars($description)." - <%= htmlWebpackPlugin.options.i18n['Wouaf_IT_description'] %>\" />".PHP_EOL;
	} else {
		$return .= "<meta property=\"og:description\" content=\"<%= htmlWebpackPlugin.options.i18n['Wouaf_IT_description'] %>\" />".PHP_EOL;
	}
	if (!empty($data['gender'])) {
		$return .= '<meta property="profile:gender" content="'.htmlspecialchars($data['gender']).'" />'.PHP_EOL;
	}
	$return .=
		'<meta name="twitter:card" content="summary" />'.PHP_EOL.
		'<meta name="twitter:site" content="@Wouaf_IT" />'.PHP_EOL.
		'<meta name="twitter:title" content="'.htmlspecialchars($title).'" />'.PHP_EOL;
	if (!empty($data['description'])) {
		$return .= '<meta name="twitter:description" content="'.htmlspecialchars($description).'" />'.PHP_EOL;
	} else {
		$return .= "<meta name=\"twitter:description\" content=\"<%= htmlWebpackPlugin.options.i18n['Wouaf_IT_description'] %>\" />".PHP_EOL;
	}
	if (!empty($data['url'])) {
		$return .= '<meta property="og:image" content="'.htmlspecialchars($data['url']).'" />'.PHP_EOL.
				   '<meta name="twitter:image" content="'.htmlspecialchars($data['url']).'" />'.PHP_EOL;
	} else {
		$return .= '<meta property="og:image" content="https://<%= htmlWebpackPlugin.options.data.imgDomain %>/600-315.png" />'.PHP_EOL.
				   '<meta property="og:image:width" content="600" />'.PHP_EOL.
				   '<meta property="og:image:height" content="315" />'.PHP_EOL.
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
	$return = '<div class="h-card">'.PHP_EOL.
			  '<h1><a class="p-name u-url" href="https://<%= htmlWebpackPlugin.options.data.domain %>/user/'.$data['username'].'/">'.htmlspecialchars(getUserDisplayName($data)).'</a></h1>'.PHP_EOL;
	if (!empty($data['html'])) {
		$return .= '<p class="p-note">'.$data['html'].'</p>'.PHP_EOL;
	}
	if (!empty($data['displayname'])) {
		$return .= '<p class="p-given-name">'.$data['displayname'].'</p>'.PHP_EOL;
	}
	$return .= '<p class="p-nickname">'.$data['username'].'</p>'.PHP_EOL.
			   '</div>';
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
		CURLOPT_TIMEOUT        => 4,
		CURLOPT_URL            => $url,
		CURLOPT_HTTPHEADER     => array(
			'Origin: https://'.$_SERVER['HTTP_HOST'],
			'Authorization: WouafIt version="1", key="'.API_KEY.'"'
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