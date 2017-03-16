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

        $this->load->model('mdl_balance', 'balance');

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
        
        $this->data['content'] = $this->get_balance();

        $this->load->model('mdl_user');
        $this->load->model('mdl_country');
        $vars['country_detail'] =   $this->mdl_country->get_all(); 
        $vars['profile'] = $this->mdl_user->profile_details();   
        $this->data['content'] = $this->load->view('user/v_profile',$vars,true);

        view($this->data);
    }
    
    private function get_balance()
    {
        $data = array();
        $this->load->model('mdl_balance');
        $data['EUR'] = $this->mdl_balance->fetch_user_balance_by_id($this->session->user_id,'EUR');
        $data['NLG'] = $this->mdl_balance->fetch_user_balance_by_id($this->session->user_id,'NLG');
        $data['GTS'] = $this->mdl_balance->fetch_user_balance_by_id($this->session->user_id,'GTS');
        
        return $this->load->view('user/v_balance',$data,true);
    }
    
    
    function bank_info()
    {
        if(!$this->session->user_id > 0)
        {
            redirect('/');
        }
        
        $this->data['content'] = $this->get_balance();

        $customer_email_id      =   $this->session->userdata('customer_email_id'); 
        $customer_user_id       =   $this->session->user_id; 
        if(($customer_email_id=="") && ($customer_user_id=="") )
        {   
            redirect('user/login','refresh');      
        }
        else
        {
            $this->l_asset->add('js/user/'.__FUNCTION__.'.js','js');
            $this->load->model('mdl_user_bank_details');
            $vars['bank'] = $this->mdl_user_bank_details->acccount_details();  
            $this->data['content'] .= $this->load->view('user/v_bank_info',$vars,true);
            view($this->data);
        }
    }

    function bank_details_update()
    {
        $this->load->model('mdl_user_bank_details');
        $customer_email_id= $this->session->userdata('customer_email_id'); 
        $id=$this->session->user_id;
        $data= [
        'bank_name' => $this->input->post('bankname') , 
        'bank_account' => $this->input->post('accounttype'),
        'inter_banking_code' => $this->input->post('iban'),
        'verification_code' => $this->input->post('verification_code'),
        'routing_number' => $this->input->post('routing_number')
        ];
        $this->mdl_user_bank_details->bank_details_update($data,$id);
    }

    function change_password()
    {
        $this->data['content'] = $this->get_balance();
        
        $this->load->model('mdl_balance', 'balance');
        $this->l_asset->add('js/user/change_password.js','js');
        $customer_email_id      =   $this->session->userdata('customer_email_id'); 
        $customer_user_id       =   $this->session->user_id; 
        if(($customer_email_id=="") && ($customer_user_id=="") )
        {   
            redirect('user/login','refresh');      
        }
        else
        { 
            $this->data['content'] .= $this->load->view('user/v_change_password',[],true);
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
            $this->load->model('mdl_user_verification','user_verification');
            $this->load->model('mdl_balance', 'balance');

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

               redirect('user/trade_verification','refresh');
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

function profile_update()
{
    $this->load->model('mdl_user');
    $id=$this->session->user_id;
    $data=array('username'=>$this->input->post('username'),'firstname'=>$this->input->post('firstname'),'lastname'=>$this->input->post('lastname'),'identity_no'=>$this->input->post('id_no'),'cellno'=>$this->input->post('cellno'),'alt_cellno'=>$this->input->post('alt_cellno'),'street1'=>$this->input->post('street1'),'street2'=>$this->input->post('street2'),'city'=>$this->input->post('city'),'state1'=>$this->input->post('state'),'country1'=>$this->input->post('country'),'zipcode'=>$this->input->post('code'),'postal_line1'=>$this->input->post('line1'),'postal_line2'=>$this->input->post('line2'),'postal_city'=>$this->input->post('postal_city'),'postal_state'=>$this->input->post('postal_state'),'postal_country'=>$this->input->post('postal_country'),'postal_code'=>$this->input->post('postal_code'));
    $this->mdl_user->profile_update($data,$id); 
}

function two_factor()
{
    $this->load->model('mdl_user','user');
    $this->load->model('mdl_balance','balance');
    $this->l_asset->add('js/user/two_factor.js','js');
    $customer_email_id = $this->session->userdata('customer_email_id'); 
    $customer_user_id = $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect('/','refresh');      
    }
    else
    { 
       $user_result = $this->user->user_check_tfa();
       $user_secret = $this->user->get_secret($customer_user_id);
       if($user_result=="enable" || $user_secret!="")
       {
        $secret_code = $this->user->get_secret($customer_user_id); 
        $data['secret_code'] = $secret_code;
        require_once APPPATH.'libraries/google/GoogleAuthenticator.php';
        $ga = new PHPGangsta_GoogleAuthenticator();
        $data['url'] = $ga->getQRCodeGoogleUrl('gulden', $secret_code);
    }else{

       $result =   $this->user->get_tfacode(); 
       if($result)
       {
        $data['secret_code']    =   $result['secret'];
        $data['onecode']        =   $result['oneCode'];
        $data['url']            =   $result['qrCodeUrl'];
    }else{
        $data['secret_code']    =   "";
        $data['onecode']        =   "";
        $data['url']            =   "";
    }
}

$data['user_details'] = $this->user->get_userstatus($this->session->user_id);
$this->data['content']  = $this->get_balance(); // load view
$this->data['content'] .= $this->load->view('user/v_two_factor', $data, TRUE); // append view
view($this->data);
}
}

function enable_tfa()
{
    $this->load->model('mdl_user');
    echo $result = $this->mdl_user->enable_tfa();
}

function disable_tfa()
{
    $this->load->model('mdl_user');
    echo $result = $this->mdl_user->disable_tfa();
}

}
