<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

// hard - cannot changed from code
// app constants 
defined('APP_BASE_URL')      OR define('APP_BASE_URL',base_url());
defined('APP_LOGO')          OR define('APP_LOGO', APP_BASE_URL.'images/logo.png');

defined('APP_ADMIN_EMAIL') 	 OR define('APP_ADMIN_EMAIL', 'exchange@guldentrader.com');

defined('APP_SMTP_HOST') 	 OR define('APP_SMTP_HOST', 'mail.guldentrader.com');
defined('APP_SMTP_USER') 	 OR define('APP_SMTP_USER', 'exchange@guldentrader.com');
defined('APP_SMTP_PASS') 	 OR define('APP_SMTP_PASS', '3PrVPkeB');
defined('APP_SMTP_PORT') 	 OR define('APP_SMTP_PORT', 587);
defined('APP_CHARSET') 		 OR define('APP_CHARSET', 'UTF-8');

// can change this values from code
// configuration array
$config = [];