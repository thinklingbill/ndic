<?php
/*
Plugin Name: NDIC Devotional Calendar Management
Plugin URI: 
Description: Plugin for managing the devotional calendar list
Version: 1.0
Author: Bill Roberts
Author URI: 
License: 
Text Domain: 
*/

require "ndicPage.php";

function my_admin_menu()
{
	add_menu_page(
		__('New Day in Christ Devotional Calendar', 'my-textdomain'),
		__('Devotional Calendars', 'my-textdomain'),
		'manage_options',
		'sample-page',
		'ndicPage',
		'dashicons-schedule',
		3
	);
}

// setup the administration menu
add_action('admin_menu', 'my_admin_menu');

// load the javascript with jquery support
wp_register_script(
	"js-mask",
	"/wp-content/plugins/ndic_devotional_calendar/js/jQuery-Mask-Plugin-master/src/jquery.mask.js",
	array('jquery')
);

wp_enqueue_script('ndic', "/wp-content/plugins/ndic_devotional_calendar/js/ndic.js", array('jquery', 'js-mask'), null, true);

wp_enqueue_style('ndic', "/wp-content/plugins/ndic_devotional_calendar/styles/ndic.css");

function wpse_enqueue_datepicker()
{
	// Load the datepicker script (pre-registered in WordPress).
	wp_enqueue_script('jquery-ui-datepicker');

	// You need styling for the datepicker. For simplicity I've linked to the jQuery UI CSS on a CDN.
	wp_register_style('jquery-ui', 'https://code.jquery.com/ui/1.12.1/themes/smoothness/jquery-ui.css');
	wp_enqueue_style('jquery-ui');
}

add_action('admin_enqueue_scripts', 'wpse_enqueue_datepicker');