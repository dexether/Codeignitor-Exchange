<?php defined('BASEPATH') OR exit('No direct script access allowed');

function base_vars()
{
    $CI = get_instance();
    date_default_timezone_set('Europe/Amsterdam');
    $data['meta_description']  = null;
    $data['meta_keywords'] = null;
    $data['head_js'] = null;
    $data['head_css'] = null;
    $data['menu'] = null;
    $data['content'] = null;
    $data['user_id'] = $CI->session->userdata('id');
    $data['title'] = 'Roulette';

    return $data;
}

function view($data=array(), $template='main', $return = false)
{
    $CI = get_instance();

    if (defined('ENVIRONMENT'))
    {
        switch (ENVIRONMENT)
        {
            case 'development':
            $data['head_css'] .= $CI->l_asset->get_css('css');
            $data['head_js'] .= $CI->l_asset->get_js('js');
            break;

            case 'testing':
            $data['head_css'] .= $CI->l_asset->get_css('css');
            $data['head_js'] .= $CI->l_asset->get_js('js');
            break;

            case 'production':
            $data['head_css'] .= $CI->l_asset->get_min('css');
            $data['head_js'] .= $CI->l_asset->get_min('js');
                //$data['head_js'] .= $CI->l_asset->get_js('js');
            break;

            default:
            echo 'no nothing';
        }
    }
    else { 
        $data['head_css'] .= $CI->l_asset->get_css('css');
        $data['head_js'] .= $CI->l_asset->get_js('js');
    }

    if($return === true) return $CI->load->view('template/v_'.$template.'_template',$data, $return);
    else $CI->load->view('template/v_'.$template.'_template',$data);
}


function random_string($length = 8,  $specials=true, $numbers=true, $lower_case=true, $upper_case=true, $double=false) {

    $temp_array=array();
    // start with a blank password
    $password = null;

    // define possible characters
    $possible=null;
    if($upper_case===true) 	$possible.='ABCDEFGHJKLMOPQRSTUVWXYZ';
    if($lower_case===true) 	$possible.='abcdefghijklmnopqrstuvwxyz';
    if($numbers===true) 	$possible.='023456789';
    if($specials===true) 	$possible.=';:-_=+|?&.@$#*()%<>[]';

    //randomize possible characters
    $possible = str_split($possible);
    shuffle($possible);

    //Count the amount of characters
    $amount = count($possible)-1;

    //check length and possible
    if(count($possible) < count($length)) $length = count($possible);

    // set up a counter
    $i = -1;

    // add random characters to $password until $length is reached
    while (++$i < $length)
    {
            // pick a random character from the possible ones
        $random = mt_rand(0, $amount);
        if(!$double)
        {
                    //make sure a character does not exist twice
            while(array_key_exists($random,$temp_array))
            {
                $random = mt_rand(0, $amount);
            }
        }

        $temp_array[$random] = $possible[$random];
    }

    $password = implode('',$temp_array);

    // done!
    return $password;

}

function hexrgb ($hexstr)
{
    $int = hexdec($hexstr);
    return array("red" => 0xFF & ($int >> 0x10),
        "green" => 0xFF & ($int >> 0x8),
        "blue" => 0xFF & $int);
}

function auth(Array $roles = []){
    $CI =& get_instance();

    if(!$CI->session->user_id > 0)
    {
        redirect('/');
    }

    if(is_array($roles) && count($roles) > 0){
        if(! in_array($CI->session->userdata('role'), $roles)){
            redirect('/');
        }
    }

    return '1';
    
}

function is_admin(){
    $CI =& get_instance();
    $admin_roles = ['admin','superadmin'];
    if(in_array($CI->session->userdata('role'), $admin_roles)){
        return true;
    }else{
        return false;
    }
}