<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Site extends MY_Controller {
    var $data = array();
    
    public function __construct() 
    {
        parent::__construct();
    }
    
    function index()  
    {  
        //$this->l_asset->add('js/login.js', 'js');
        $data = array();
        //$this->load->view('site/v_front', $data, true);
        //$data['login'] = $this->load->view('login/v_login', $data, true);
        //$data['register'] = $this->load->view('login/v_register', $data, true);
        $data['chart'] = $this->load->view('charts/v_chart_nlg', $data, true);
        $data['trade_history'] = $this->load->view('blocks/v_trade_history', $data, true);
        $this->data['content'] = $this->load->view('site/v_front', $data, true);
        
        view($this->data, 'site');
    }
    function captcha()
    {
        //Settings: You can customize the captcha here
        $image_width = 120;
        $image_height = 40;
        $characters_on_image = 6;
        $font = FCPATH.'./fonts/monofont.ttf';
        //The characters that can be used in the CAPTCHA code.
        //avoid confusing characters (l 1 and i for example)
        $possible_letters = 'hjkmnp23456789bcdfgqrstvwxyz';
        $random_dots = 30;
        $random_lines = 0;
        $captcha_text_color="#EEEEEE";
        $captcha_noice_color = "#cc0000";
        $code = '';
        $i = 0;
        while ($i < $characters_on_image) { 
        $code .= substr($possible_letters, mt_rand(0, strlen($possible_letters)-1), 1);
        $i++;
        }
        $font_size = $image_height * 0.75;
        $image = @imagecreate($image_width, $image_height);
        /* setting the background, text and noise colours here */
        $background_color = imagecolorallocate($image, 100, 100,100);
        $arr_text_color = hexrgb($captcha_text_color);
        $text_color = imagecolorallocate($image, $arr_text_color['red'], 
                        $arr_text_color['green'], $arr_text_color['blue']);
        $arr_noice_color = hexrgb($captcha_noice_color);
        $image_noise_color = imagecolorallocate($image, $arr_noice_color['red'], 
                        $arr_noice_color['green'], $arr_noice_color['blue']);
        /* generating the dots randomly in background */
        for( $i=0; $i<$random_dots; $i++ ) {
        imagefilledellipse($image, mt_rand(0,$image_width),
         mt_rand(0,$image_height), 2, 3, $image_noise_color);
        }
        /* generating lines randomly in background of image */
        for( $i=0; $i<$random_lines; $i++ ) {
        imageline($image, mt_rand(0,$image_width), mt_rand(0,$image_height),
         mt_rand(0,$image_width), mt_rand(0,$image_height), $image_noise_color);
        }
        /* create a text box and add 6 letters code in it */
        $textbox = imagettfbbox($font_size, 0, $font, $code); 
        $x = ($image_width - $textbox[4])/2;
        $y = ($image_height - $textbox[5])/2;
        imagettftext($image, $font_size, 0, $x, $y, $text_color, $font , $code);
        /* Show captcha image in the page html page */
        header('Content-Type: image/jpeg');// defining the image type to be shown in browser widow
        imagejpeg($image);//showing the image
        imagedestroy($image);//destroying the image instance
        //$this->session->set_userdata('6_letters_code',$code);
        $_SESSION['6_letters_code'] = $code;
//        function hexrgb ($hexstr)
//        {
//          $int = hexdec($hexstr);
//          return array("red" => 0xFF & ($int >> 0x10),
//                       "green" => 0xFF & ($int >> 0x8),
//                       "blue" => 0xFF & $int);
//        }
    }
}
