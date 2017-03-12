<?php defined('BASEPATH') OR exit('No direct script access allowed');

class User extends MY_Controller {
    public $data;
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
        $this->load->model('balance_model', 'balance');
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

        $this->l_asset->add('js/user/profile.js', 'js');
        
        $this->load->model('gulden_model', 'gulden_model');
        $this->load->model('balance_model', 'balance');
        $data['country_detail'] =   $this->gulden_model->fetchcountry();    
        $this->data['content'] = $this->load->view('user/v_profile',$data,true);

        view($this->data);
    }
    
    function bank_info()
    {
        $this->load->model('balance_model', 'balance');

        $customer_email_id      =   $this->session->userdata('customer_email_id'); 
        $customer_user_id       =   $this->session->user_id; 
        if(($customer_email_id=="") && ($customer_user_id=="") )
        {   
            redirect('user/login','refresh');      
        }
        else
        {
            $this->l_asset->add('js/user/'.__FUNCTION__.'.js','js');
            $this->load->model('gulden_model');
            $vars['bank'] = $this->gulden_model->acccount_details();  
            $this->data['content'] = $this->load->view('user/v_bank_info',$vars,true);
            view($this->data);
        }
    }

    function bankdetails_update()
    {
        $this->load->model('gulden_model');
        $this->load->model('balance_model', 'balance');
        $customer_email_id= $this->session->userdata('customer_email_id'); 
        $id=$this->session->user_id;
        $data= [
        'bank_name' => $this->input->post('bankname') , 
        'bank_account' => $this->input->post('accounttype'),
        'inter_banking_code' => $this->input->post('iban'),
        'verification_code' => $this->input->post('verification_code'),
        'routing_number' => $this->input->post('routing_number')
        ];
        $this->gulden_model->bankdetailsupdate($data,$id);
    }

    function change_password()
    {
        $this->load->database();
        $this->load->model('gulden_model');
        $this->load->model('balance_model', 'balance');
        $this->l_asset->add('js/user/change_password.js','js');
        $customer_email_id      =   $this->session->userdata('customer_email_id'); 
        $customer_user_id       =   $this->session->user_id; 
        if(($customer_email_id=="") && ($customer_user_id=="") )
        {   
            redirect('user/login','refresh');      
        }
        else
        { 
            $this->data['content'] = $this->load->view('user/v_change_password',[],true);
            view($this->data);
        }
    }

    function trade_verification()
    {

        $customer_email_id      =   $this->session->userdata('customer_email_id'); 
        $customer_user_id       =   $this->session->user_id; 
        if(($customer_email_id=="") && ($customer_user_id=="") )
        {   
            redirect('/','refresh');      
        }
        else
        {
            $this->load->model('gulden_model');
            $this->load->model('User_verification_model','user_verification');
            $this->load->model('balance_model', 'balance');

            if(isset($_POST['submit'])){

             if($_FILES['passport']['name']){
                 $this->user_verification->upload('passport');
             }

             if($_FILES['selfie']['name']){
                 $this->user_verification->upload('selfie');
             }

             if($_FILES['backcard']['name']){
                 $this->user_verification->upload('backcard');
             }

             redirect('gulden/trade_verification','refresh');
         }

         $vars['bank'] = $this->user_verification->get($customer_user_id);

         $this->data['content'] = $this->load->view('user/v_'.__FUNCTION__.'.php',$vars,true);
         view($this->data);
     }
 }


 public function logout()
 {
    $this->session->sess_destroy();
    redirect('/');
}
}
