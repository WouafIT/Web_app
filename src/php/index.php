<?php
$buildTime = (int) '<%= htmlWebpackPlugin.options.data.timestamp %>';

$requestURI = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
//grab vars in URL
$wouafId = $userId = null;
if (preg_match('#\/wouaf\/([0-9a-f]{24})\/.*#' , $requestURI, $matches)) {
	$wouafId = $matches[1];
}
if (preg_match('#\/user\/([^/]*)\/.*#' , $requestURI, $matches)) {
	$userId = $matches[1];
}
//Generate file Etag
//if no wouaf or user is queried
//=> etag is md5(url-buildTime)
//else
//=> etag should be checked from api server
$etag = null;
if (!$wouafId && !$userId) {
	$etag = 'W/"' . md5($requestURI . '-' . $buildTime) . '"';
} else {
	$etag = null; //TODO
}
if ($etag) {
	header("Last-Modified: " . gmdate("D, d M Y H:i:s", $buildTime) . " GMT");
	header('Etag: ' . $etag);

	if (@strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE']) == $buildTime ||
		trim($_SERVER['HTTP_IF_NONE_MATCH']) == $etag) {
		header("HTTP/1.1 304 Not Modified");
		exit;
	}
}
$content = '';
if (!$requestURI || $requestURI === '/') {
    return $content;
}
if (strpos($requestURI, '/about/') !== false) {
    $content .= file_get_contents(__DIR__.'/../parts/about.html');
}

define('API_KEY', '<%= htmlWebpackPlugin.options.data.API_KEY %>');
if ($wouafId || $userId) {
    $content .= '<script>window.wouafit = {};</script>';
}
if ($wouafId) {
    try {
        //Get wouaf data from API
        $data = curlGet(
            'https://api.wouaf.it/wouafs/'.$wouafId,
            null,
            array(
                CURLOPT_HTTPHEADER => array('x-wouafit-api-key: '.API_KEY)
            )
        );
        if ($data) {
            $data = json_decode($data, true);
            if ($data['code'] === 200) {
                $content .= '<script>window.wouafit.wouaf = '.json_encode($data['wouaf']).';</script>';
            }
        }
    } catch (Exception $e) {}

    /*Debugger : https://developers.facebook.com/tools/debug/
     * <meta property="og:title" content="The Rock"/>
<meta property="og:type" content="movie"/>
<meta property="og:url" content="http://www.imdb.com/title/tt0117500/"/>
<meta property="og:image" content="http://ia.media-imdb.com/rock.jpg"/>
<meta property="og:site_name" content="IMDb"/>
<meta property="fb:admins" content="USER_ID"/>
<meta property="og:description"
      content="A group of U.S. Marines, under command of
               a renegade general, take over Alcatraz and
               threaten San Francisco Bay with biological
               weapons."/>
     * */
}
if ($userId) {
    try {
        //Get user data from API
        $data = curlGet(
            'https://api.wouaf.it/users/'.$userId,
            null,
            array(
                CURLOPT_HTTPHEADER 	=> array('x-wouafit-api-key: ' . API_KEY)
            )
        );
        if ($data) {
            $data = json_decode($data, true);
            if ($data['code'] === 200) {
                $content .= '<script>window.wouafit.user = '.json_encode($data['user']).';</script>';
            }
        }
    } catch (Exception $e) {}
}

return $content;

/**
 * Send a GET requst using cURL
 * @param string $url to request
 * @param array $get values to send
 * @param array $options for cURL
 * @return string
 * @throws Exception
 */
function curlGet($url, array $get = NULL, array $options = array()) {
    $defaults = array(
        CURLOPT_URL => $url. (strpos($url, '?') === FALSE ? '?' : ''). http_build_query($get),
        CURLOPT_HEADER => 0,
        CURLOPT_RETURNTRANSFER => TRUE,
        CURLOPT_TIMEOUT => 4
    );

    $ch = curl_init();
    curl_setopt_array($ch, ($options + $defaults));
    if( ! $result = curl_exec($ch))  {
        throw new Exception('CURL error: '.curl_error($ch));
    }
    curl_close($ch);
    return $result;
}