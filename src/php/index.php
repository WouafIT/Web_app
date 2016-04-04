<?php
$requestURI = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
$content = '';
if (!$requestURI || $requestURI === '/') {
    return $content;
}

//grab vars in URL
$wouafId = $userId = null;
if (preg_match('#\/wouaf\/([0-9a-f]{24})\/.*#' , $requestURI, $matches)) {
    $wouafId = $matches[1];
}
if (preg_match('#\/user\/([^/]*)\/.*#' , $requestURI, $matches)) {
    $userId = $matches[1];
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