<?php defined('BASEPATH') OR exit('No direct script access allowed');

class User extends MY_Controller {
    var $data;
    public function __construct() 
    {
        parent::__construct();
        $this->data['menu'] = $this->load->view('markets/v_menu', array('uri'=>$this->uri->segment(2)), true);
    }
    
    function index()  
    {  
        redirect('/');
    }
    
    function registration()  
    {            
        $email = $this->input->post('email', true);
        $this->load->model('mdl_user');

        $exist  =  $this->mdl_user->is_user($email);
        if($exist === true)
        {
            echo "email";
        }
        else
        {
            $captcha_code   =   isset($_SESSION['6_letters_code'])?$_SESSION['6_letters_code']:'';
            $recaptcha      =   $this->input->post('recaptcha', true);
            if($captcha_code!=$recaptcha)
            {
                echo "recaptcha";       
            }
            else
            {
                $this->mdl_user->add_user();                   
                echo "success";
            }
        }
    }
    
    function login()  
    { 
        $this->load->model('mdl_user');
        echo $this->mdl_user->check_login();

    }

    public function user_verification($verifier=null)
    {
        $data = array();
        if(!is_null($verifier))
        {
            $this->load->model('mdl_user');
            $data['status'] = $this->mdl_user->verification($verifier); 
            $this->data['content'] = $this->load->view('site/v_verified', $data, true);
        
            view($this->data,'site');
        }
    }
    
    public function profile()
    {
        if(!$this->session->user_id > 0)
        {
            redirect('/');
        }
        
        $data = array();
        
        view($this->data);
    }
    
    
    public function logout()
    {
        $this->session->sess_destroy();
        redirect('/');
    }
}
