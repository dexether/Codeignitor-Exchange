<?php defined('BASEPATH') OR exit('No direct script access allowed');

class User extends MY_Controller {
    
    public function __construct() 
    {
        parent::__construct();
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
        $ret   =   $this->mdl_user->check_login();

        if(is_array($ret) && $ret!="invalid")
        {
            //$res_login  =   $this->mdl_user->check_logindetails();  
            //check fot tfa
            if($ret['randcode']=="active")
            {
                echo "enable";
            }
            else
            {
                echo $ret['status']; 
            }
        }
        else
        {
            echo 'invalid';
        }
    }
    public function user_verification($verifier=null)
    {
        if(!is_null($verifier))
        {
            $this->load->model('mdl_user');
            $result =$this->gulden_model->activated_verifiedlink($user); 
            if($result=='ok')
            {   
                $data['value'] = "Success: Thanks for your registration, your account is now activated.";
                //$this->session->set_userdata('activesuccess',"successoutput");  
                //redirect('gulden/index','refresh');
            }
            else
            {   
                $data['value'] = "Warning: Application has already been activated or cancelled earlier";
                //$this->session->set_userdata('activesuccess',"successerror");
               // redirect('gulden/index','refresh'); 

            }
            $this->load->view('front/status',$data);
        }
    }

}
