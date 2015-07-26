<?php
    /*
    Plugin Name: Facebook Post Importer
    Description: Plugin for importing data from Facebook posts
    Author: Ashis Nayak
    Version: 1.0.0
    Author URI: https://github.com/nashis
    */

function fbpimporter_hook_social_assets() {
	wp_enqueue_script('fbpimporter-social-script', plugin_dir_url( __FILE__ ) . 'js/facebook-sdk.js');
}

function fbpimporter_hook_admin_assets() {
	wp_enqueue_style('fbpimporter-admin-style', plugin_dir_url( __FILE__ ) . 'css/fbpimporter-admin.css');
	wp_enqueue_script('fbpimporter-admin-script', plugin_dir_url( __FILE__ ) . 'js/fbpimporter-admin.js');
}

function fbpimporter_admin_actions() {
	add_options_page("Facebook Post Importer", "Facebook Post Importer", 1, "FacebookPost_Importer", "fbpimporter_admin");
}

function fbpimporter_admin() {
	include('fbpimporter-admin.php');
}

/**
 * Prepare markup to be included in Wordpress site
 * @returns {HTMLMarkup} Plugin View
 */
function fbpimporter_posts_handler() {
  $post_data = fbpimporter_getpost();
  return '<link rel="stylesheet" type="text/css" href="' . plugin_dir_url( __FILE__ ) . "css/fbpimporter-page.css" . '">' .
    '<div class="fbpimporter-plugin-container"></div>' .
    '<script type="text/javascript" src="' . plugin_dir_url( __FILE__ ) . "js/fbpimporter-page.js" . '"></script>' .
    '<script type="text/javascript">renderPosts(' . $post_data .')</script>';
}

/**
 * Fetch feed data for a given facebook URL and accesstoken
 * @param {String $url} Facebook feed URL, default empty ('') {String $token} Facebook access token, default empty ('')
 * @returns {Object} Post data converted to UI consumable format
 */
function fbpimporter_getpost($url='', $token='') {
    $fbpimorter_url = ($url !== '') ? $url : get_option('fbpimorter_url');
    $fbpimorter_accesstoken = ($token !== '') ? $token :get_option('fbpimorter_accesstoken');

    if (!$fbpimorter_url || !$fbpimorter_accesstoken) {
        error_log('Missing URL: ' . $fbpimorter_url . ' or Access token: ' . $fbpimorter_accesstoken);
        return json_encode(new stdClass());
    }

    $urlList = array($fbpimorter_url . '?access_token=' . $fbpimorter_accesstoken);
    $uiData = array();

	$resp = multiRequest($urlList);
	foreach ($resp as $key => $individualResp) {
		//error_log($individualResp);
		$parsedResp = json_decode($individualResp);

		if ($parsedResp->error) {
			error_log($parsedResp->error);
			error_log('Error url: ' . $urlList[$key]);
			error_log('Error msg: ' . $parsedResp->error->message);
			error_log('Error code: ' . $parsedResp->error->code);
			$uiData = array(
				'error' => array(
					'code' => $parsedResp->error->code,
					'subcode' => $parsedResp->error->error_subcode
				)
			);
		} else if ($parsedResp->data) {
	        foreach ($parsedResp->data as $entry) {
	            array_push($uiData, prepare_uidata($entry));
	        }
	    }
	}

	return json_encode($uiData);
}

/**
  * Prepare data for UI by adding only required datapoints
  * @source {third-party} http://www.phpied.com/simultaneuos-http-requests-in-php-with-curl/
  * @param {JSON $feedData} Individual feed object
  * @returns {Array} UI data for post
  */
function multiRequest($data, $options = array()) {

	// array of curl handles
	$curly = array();
	// data to be returned
	$result = array();

	// multi handle
	$mh = curl_multi_init();

	// loop through $data and create curl handles
	// then add them to the multi-handle
	foreach ($data as $id => $d) {

	$curly[$id] = curl_init();

	$url = (is_array($d) && !empty($d['url'])) ? $d['url'] : $d;
	curl_setopt($curly[$id], CURLOPT_URL,            $url);
	curl_setopt($curly[$id], CURLOPT_HEADER,         0);
	curl_setopt($curly[$id], CURLOPT_RETURNTRANSFER, 1);

	// post?
	if (is_array($d)) {
	  if (!empty($d['post'])) {
	    curl_setopt($curly[$id], CURLOPT_POST,       1);
	    curl_setopt($curly[$id], CURLOPT_POSTFIELDS, $d['post']);
	  }
	}

	// extra options?
	if (!empty($options)) {
	  curl_setopt_array($curly[$id], $options);
	}

	curl_multi_add_handle($mh, $curly[$id]);
  }

  // execute the handles
  $running = null;
  do {
    curl_multi_exec($mh, $running);
  } while($running > 0);


  // get content and remove handles
  foreach($curly as $id => $c) {
    $result[$id] = curl_multi_getcontent($c);
    curl_multi_remove_handle($mh, $c);
  }

  // all done
  curl_multi_close($mh);

  return $result;
}

/**
 * Prepare data for UI by adding only required datapoints
 * @param {JSON $feedData} Individual feed object
 * @returns {Array} UI data for post
 */
function prepare_uidata($feedData) {
    return array (
  		'title' => $feedData->name,
  		'slug' => $feedData->link,
  		'image' => $feedData->picture,
  		'description' => $feedData->message,
  		'social' => array (
            'comments' => count($feedData->comments->data),
            'likes' => count($feedData->likes->data),
            'shares'=> $feedData->shares->count
        )
  	);
}

add_action('wp_head', 'fbpimporter_hook_social_assets');

add_action('admin_init', 'fbpimporter_hook_admin_assets');
add_action('admin_menu', 'fbpimporter_admin_actions');

add_shortcode('fbpimporter_posts', 'fbpimporter_posts_handler');


