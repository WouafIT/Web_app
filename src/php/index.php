<?php
define('__DEV__', '<%= htmlWebpackPlugin.options.data.isDev %>' === 'true');
$buildTime = (int) '<%= htmlWebpackPlugin.options.data.timestamp %>';

$requestURI = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';

//404 on missing parts files
if (preg_match('#\/parts\/.*#' , $requestURI, $matches)) {
    header("HTTP/1.1 404 Not Found");
    header("Cache-Control: max-age=1800, must-revalidate");
    echo file_get_contents(__DIR__.'/../404.html');
    exit;
}

//grab vars in URL
$wouafId = $userId = null;
if (preg_match('#\/wouaf\/([0-9a-f]{24})\/.*#' , $requestURI, $matches)) {
	$wouafId = $matches[1];
}
if (preg_match('#\/user\/([^/]*)\/.*#' , $requestURI, $matches)) {
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
	header("Cache-Control: max-age=1800, must-revalidate");
	header("Last-Modified: ".gmdate("D, d M Y H:i:s", $buildTime)." GMT");
}
if (isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) &&
	@strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE']) == $buildTime) {
	header("HTTP/1.1 304 Not Modified");
	exit;
}

$data = array(
    'content'   => '',
    'canonical' => 'https://'.$_SERVER['HTTP_HOST'].'/',
    'head'      => '',
);
if (!$requestURI || $requestURI === '/') {
    return $data;
}
if (strpos($requestURI, '/about/') !== false) {
    $data['content'] .= file_get_contents(__DIR__.'/../parts/about.html');
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
                $data['content'] .= '<script>window.wouafit.wouaf = '.json_encode($wouafData['wouaf']).';</script>'."\n".
									getWouafHTML($wouafData['wouaf']);
                $data['head'] = getWouafOpenGraph($wouafData['wouaf'])."\n".
								'<link rel="alternate" hreflang="fr" href="https://fr-fr.<%= htmlWebpackPlugin.options.data.domain %>/wouaf/'.$wouafId.'/" />'."\n".
								'<link rel="alternate" hreflang="en" href="https://en-us.<%= htmlWebpackPlugin.options.data.domain %>/wouaf/'.$wouafId.'/" />';
            } elseif ($wouafData['code'] === 404) {
                header("HTTP/1.1 404 Not Found");
				$data['head'] 	  = getDefaultOpenGraph();
				$data['content'] .= '<h1>404 not Found</h1>';
			} else {
				if (__DEV__) {
					var_dump($wouafData);exit;
				}
			}
        }
    } catch (Exception $e) {
		if (__DEV__) {
			var_dump($e);exit;
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
                $data['content'] .= '<script>window.wouafit.user = '.json_encode($userData['user']).';</script>'."\n".
									getUserHTML($userData['user']);
                $data['head'] = getUserOpenGraph($userData['user'])."\n".
								'<link rel="alternate" hreflang="fr" href="https://fr-fr.<%= htmlWebpackPlugin.options.data.domain %>/user/'.$userId.'/" />'."\n".
								'<link rel="alternate" hreflang="en" href="https://en-us.<%= htmlWebpackPlugin.options.data.domain %>/user/'.$userId.'/" />';
			} elseif ($userData['code'] === 404) {
                header("HTTP/1.1 404 Not Found");
				$data['head']     = getDefaultOpenGraph();
				$data['content'] .= '<h1>404 not Found</h1>';
			} else {
				if (__DEV__) {
					var_dump($userData);exit;
				}
			}
        }
    } catch (Exception $e) {
		if (__DEV__) {
			var_dump($e);exit;
		}
	}
} else {
	$data['head'] = getDefaultOpenGraph();
}

return $data;

/**
 * Generate default OpenGraph meta tags
 * @return string
 */
function getDefaultOpenGraph() {
	return "<meta property=\"og:title\" content=\"<%= htmlWebpackPlugin.options.i18n['Wouaf IT'] %>\" />\n".
		   "<meta property=\"og:description\" content=\"<%= htmlWebpackPlugin.options.i18n['Your social network for your local events'] %>\" />\n".
		   '<meta property="og:type" content="website" />'."\n".
		   '<meta property="og:url" content="https://'.$_SERVER['HTTP_HOST'].'/" />'."\n".
		   '<meta property="og:app_id" content="<%= htmlWebpackPlugin.options.data.facebookAppId %>" />'."\n".
		   '<meta property="og:image" content="https://<%= htmlWebpackPlugin.options.data.imgDomain %>/icon.png" />'."\n";
}

/**
 * Generate OpenGraph meta tags for a given Wouaf
 * @param array $data wouaf data
 * @return string
 */
function getWouafOpenGraph ($data) {
	global $locale;
	$description = strip_tags($data['text']);
    $description = mb_substr($description, 0, 299).(mb_strlen($description) > 299 ? '…' : '');
	$start = new DateTime();
	$start->setTimestamp(intval($data['date'][0] / 1000));
	$end = new DateTime();
	$end->setTimestamp(intval($data['date'][1] / 1000));
	if (!empty($data['tz'])) {
		$timeZone = new DateTimeZone(timezone_name_from_abbr("", $data['tz'] * 60, 0));
		$start->setTimezone($timeZone);
		$end->setTimezone($timeZone);
	}
	$return = '<meta property="og:title" content="'.htmlspecialchars(getWouafTitle($data)).'" />'."\n".
	'<meta property="og:app_id" content="<%= htmlWebpackPlugin.options.data.facebookAppId %>" />'."\n".
	'<meta property="og:type" content="article" />'."\n".

	'<meta property="og:article:published_time" content="'.$start->format('c').'" />'."\n".
    '<meta property="og:article:expiration_time" content="'.$end->format('c').'" />'."\n".
    '<meta property="og:article:author" content="https://<%= htmlWebpackPlugin.options.data.domain %>/user/'.htmlspecialchars($data['author'][1]).'/" />'."\n".

    '<meta property="og:url" content="https://<%= htmlWebpackPlugin.options.data.domain %>/wouaf/'.$data['id'].'/" />'."\n".
    '<meta property="og:site_name" content="Wouaf IT" />'."\n".
	'<meta property="og:locale" content="'.$locale.'" />'."\n".
	'<meta property="og:latitude" content="'.$data['loc'][0].'" />'."\n".
	'<meta property="og:longitude" content="'.$data['loc'][1].'" />'."\n".
	'<meta property="og:description" content="'.htmlspecialchars($description).'" />'."\n";

    if (!empty($data['pics']) && is_array($data['pics'])) {
        foreach ($data['pics'] as $pic) {
            $return .= '<meta property="og:image" content="'.htmlspecialchars($pic['full']).'" />'."\n";
        }
    } else {
        $return .= '<meta property="og:image" content="https://<%= htmlWebpackPlugin.options.data.imgDomain %>/icon.png" />'."\n";
    }
	if (!empty($data['tags']) && is_array($data['tags'])) {
		foreach ($data['tags'] as $tag) {
			$return .= '<meta property="article:tag" content="'.htmlspecialchars($tag).'" />'."\n";
		}
	}
    return $return;
}

/**
 * Generate title for a given Wouaf
 * @param array $data wouaf data
 * @return string
 */
function getWouafTitle($data) {
	if (!empty($data['title'])) {
		$title = $data['title'];
	} else {
		$title = strip_tags($data['text']);
		$title = mb_substr($title, 0, 79). (mb_strlen($title) > 79 ? '…' : '');
	}
	return $title;
}

/**
 * Generate html tags for a given Wouaf
 * @param array $data wouaf data
 * @return string
 */
function getWouafHTML ($data) {
	global $locale;
	setlocale(LC_TIME, $locale.'.utf8');
	$t = array(
		'By' 	=> "<%= htmlWebpackPlugin.options.i18n['By'] %>",
		'From' 	=> "<%= htmlWebpackPlugin.options.i18n['From'] %>",
		'to' 	=> "<%= htmlWebpackPlugin.options.i18n['to'] %>",
		'at' 	=> "<%= htmlWebpackPlugin.options.i18n['at'] %>",
	);
	$start = new DateTime();
	$start->setTimestamp(intval($data['date'][0] / 1000));
	$end = new DateTime();
	$end->setTimestamp(intval($data['date'][1] / 1000));
	if (!empty($data['tz'])) {
		$timezoneName = timezone_name_from_abbr("", $data['tz'] * 60, 0);
		$timeZone = new DateTimeZone($timezoneName);
		date_default_timezone_set($timezoneName);
		$start->setTimezone($timeZone);
		$end->setTimezone($timeZone);
	}
	$return = '<div class="h-event">'."\n".
	'<h1><a href="https://<%= htmlWebpackPlugin.options.data.domain %>/wouaf/'.$data['id'].'/" class="u-url p-name">'.
		htmlspecialchars(getWouafTitle($data)).'</a></h1>'."\n".
	'<p>'.$t['By'].' '."\n".
	'	<a class="p-author h-card" href="https://<%= htmlWebpackPlugin.options.data.domain %>/user/'.htmlspecialchars($data['author'][1]).'/">'."\n".
	'	'.htmlspecialchars(!empty($data['author'][2]) ? $data['author'][2] : $data['author'][1])."\n".
	'   </a>'."\n".
	'</p>'."\n".
	'<p>'.$t['From'].' <time class="dt-start" datetime="'.$start->format('c').'">'.
			  strftime('%c', intval($data['date'][0] / 1000)).'</time>'."\n".
	'	'.$t['to'].' <time class="dt-end" datetime="'.$end->format('c').'">'.
			  strftime('%c', intval($data['date'][1] / 1000)).'</time>'."\n".
	'	'.$t['at'].' <span class="p-location h-geo">'."\n".
	'		<span class="p-latitude">'.$data['loc'][0].'</span>, '."\n".
	'		<span class="p-longitude">'.$data['loc'][1].'</span>'."\n".
	'	</span></p>'."\n".
	'<p class="p-description">'.$data['html'].'</p>'."\n";
	if (!empty($data['tags']) && is_array($data['tags'])) {
		$return .= '<p>';
		foreach ($data['tags'] as $tag) {
			$return .= '<a href="https://<%= htmlWebpackPlugin.options.data.domain %>/tag/'.htmlspecialchars($tag).'/" class="p-category">'.
							htmlspecialchars($tag).'</a>, '."\n";
		}
		$return .= '</p>';
	}
	if (!empty($data['pics']) && is_array($data['pics'])) {
		$return .= '<p>';
		foreach ($data['pics'] as $pic) {
			$return .= '<img src="'.htmlspecialchars($pic['full']).'" class="u-photo" /> '."\n";
		}
		$return .= '</p>';
	}
	$return .= '</div>';
	return $return;
}

/**
 * Generate OpenGraph meta tags for a given User
 * @param array $data user data
 * @return string
 */
function getUserOpenGraph ($data) {
    $title = trim(!empty($data['firstname']) && !empty($data['lastname']) ? $data['firstname'] .' '. $data['lastname'] : $data['username']);
    $return = '<meta property="og:title" content="'.htmlspecialchars($title).'" />'."\n".
              '<meta property="og:type" content="profile" />'."\n".
              '<meta property="og:url" content="https://<%= htmlWebpackPlugin.options.data.domain %>/user/'.$data['username'].'/" />'."\n".
              '<meta property="og:site_name" content="Wouaf IT" />'."\n".
              '<meta property="og:locale" content="'.$data['lang'].'" />'."\n".
              '<meta property="og:image" content="https://<%= htmlWebpackPlugin.options.data.imgDomain %>/icon.png" />'."\n";
    if (!empty($data['description'])) {
        $return .= '<meta property="og:description" content="'.htmlspecialchars(mb_substr(strip_tags($data['description']), 0, 300)).'" />'."\n";
    }
    if (!empty($data['gender'])) {
        $return .= '<meta property="og:profile:gender" content="'.htmlspecialchars($data['gender']).'" />'."\n";
    }
    if (!empty($data['lastname'])) {
        $return .= '<meta property="og:profile:last_name" content="'.htmlspecialchars($data['lastname']).'" />'."\n";
    }
    if (!empty($data['firstname'])) {
        $return .= '<meta property="og:profile:first_name" content="'.htmlspecialchars($data['firstname']).'" />'."\n";
    }
    return $return;
}

/**
 * Generate OpenGraph meta tags for a given User
 * @param array $data user data
 * @return string
 */
function getUserHTML ($data) {
	$title = trim(!empty($data['firstname']) && !empty($data['lastname']) ? $data['firstname'] .' '. $data['lastname'] : $data['username']);
	$return = '<div class="h-card">'."\n".
	'<h1><a class="p-name u-url" href="https://<%= htmlWebpackPlugin.options.data.domain %>/user/'.$data['username'].'/">'.htmlspecialchars($title).'</a></h1>'."\n";
	if (!empty($data['html'])) {
		$return .= '<p class="p-note">'.$data['html'].'</p>'."\n";
	}
	if (!empty($data['lastname'])) {
		$return .= '<p class="p-family-name">'.$data['lastname'].'</p>'."\n";
	}
	if (!empty($data['firstname'])) {
		$return .= '<p class="p-given-name">'.$data['firstname'].'</p>'."\n";
	}
	$return .= '<p class="p-nickname">'.$data['username'].'</p>'."\n".
			   '</div>';
	return $return;
}

/**
 * Send a GET request using cURL
 * @param string $url to request
 * @param array $get values to send
 * @param array $options for cURL
 * @return string
 * @throws Exception
 */
function curlGet($url, array $get = null, array $options = array()) {
	$defaults = array(
		CURLOPT_HEADER => 0,
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_TIMEOUT => 4,
		CURLOPT_URL => $url,
		CURLOPT_HTTPHEADER => array(
			'Origin: https://'.$_SERVER['HTTP_HOST'],
			'Authorization: WouafIt version="1", key="'.API_KEY.'"'
		),
	);
	if ($get) {
		$defaults[CURLOPT_URL] .= (strpos($url, '?') === false ? '?' : ''). http_build_query($get);
	}

	$ch = curl_init();
	curl_setopt_array($ch, ($options + $defaults));
	if( ! $result = curl_exec($ch))  {
		throw new Exception('CURL error: '.curl_error($ch));
	}
	curl_close($ch);
	return $result;
}