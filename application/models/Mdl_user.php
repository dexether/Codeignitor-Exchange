<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Mdl_user extends CI_Model
{
  public function __construct()
  {
    parent::__construct();
    $this->load->database();
  }
  
  public function is_user($email = null)
  {   
    if(!is_null($email))
    {
      $this->db->where('email',$email);      
      $query = $this->db->get('users');	 	     
      if($query->num_rows()>=1)  
      {           
        return true; 
      }      
      else
      {
        return false;  
      }
    }
  }

  function get_userstatus($user_id)
  {
    $this->db->where('id',$user_id);  
    $query=$this->db->get('users'); 
    if($query->num_rows() == 1)
    {                
      $row = $query->row();      
      return $row->randcode;
    }   
    else
    {      
      return false;   
    }
  }

  function get_username($user_id)
  {
    $this->db->where('user_id',$user_id);
    $query = $this->db->get('userdetails');
    if($query->num_rows())
    {
      $row = $query->row();
      return $row->username;
    }
    else
    {
      return false;
    }
  }
  
  function check_login()
  {
   $res_loguser = $this->db->query("SELECT id, firstname, randcode, status, password FROM `users` where email=?", array($this->input->post('email',true)));
   if($res_loguser->num_rows()==1) 
   { 
    $row = $res_loguser->row();

    if($row->status==='deactive')
    {
      return 'deactive';
    }
    if(password_verify($this->input->post('password'), $row->password) === true)
    {
      if($row->randcode !=="disable")
      {
        return 'enable';
      }
      else
      {
        $sessiondata = array(
          'user_id'  => $row->id,
          'firstname' => $row->firstname,
          'tfa' =>$row->randcode,
          'status'=>$row->status
          );

        $this->session->set_userdata($sessiondata); 
        return 'success';
      }
    }
    else
    {
      return 'invalid'; 
    }
  }
  else
  { 	
    return "invalid";
  }
}

public function add_user()    
{    
	$dateofreg	=	date('Y-m-d');
	$user_ip	=	$this->input->ip_address();    
	$this->load->library('user_agent');
	$user_browser	=	$this->agent->browser(); 
  $data	=	array(                  
    'firstname'		=>	$this->input->post('firstname', true),
    'lastname'		=>	$this->input->post('lastname', true),
    'email'		=>	$this->input->post('email', true),   
    'password'		=>	password_hash($this->input->post('password1', true),PASSWORD_DEFAULT),
    'salt'                  =>      md5(random_string()),
    'dateofreg'		=>	$dateofreg,  
    'userip'		=>	$user_ip,					
    'userbrowser'	=>	$user_browser,
    'status'		=>	'deactive',
    'randcode'		=>	'disable',
    'recaptcha'             => $this->input->post('recaptcha', true),
    'verfiyStatus'	=>	'unverified'
    );
  $this->db->insert('users',$data);    
  $last_userinsid = $this->db->insert_id();   
  if($last_userinsid!="")
  { 
   $verifydata = array('user_id'=>$last_userinsid,'verification_status'=>'unverified','verifier'=> random_string(25, false));
   $this->db->insert('user_verification',$verifydata);
   $email		=	$this->input->post('email', true);   
   $dis_get_email_info = 
   $email_subject1	=	'Please confirm your registration';
   $email_content1	=	$this->load->view('template/emails/v_registration_success',null,true); 
   $link =base_url().'user/user_verification/'.$verifydata['verifier']; 
   $a	=	array('##USERNAME##'=>$this->input->post('firstname', true),'##USERID##'=>base64_encode($last_userinsid),'##CLIENTID##'=>$email,'##PASSWORD##'=>$this->input->post('password1'),'##FROM_EMAIL##'=>'exchange@guldentrader.com','##COMPANYNAME##'=>'exchange.guldentrader.com','##EMAIL##'=>$email,'##SITEURL##'=>base_url(),'##ADMIN_EMAIL##'=>'exchange@guldentrader.com','##LINK##'=>$link);
   $email_content	=	strtr($email_content1,$a);
   $this->common_mail($email,$email_subject1,$email_content);
   return true;
 }
}

function common_mail($tomail=null,$email_subject=null,$email_content=null)
{	 
  $this->load->library('email');
  $config['protocol'] = "smtp";
  $config['smtp_host'] = "mail.guldentrader.com";
  $config['smtp_port'] = "587";
  $config['smtp_user'] = 'exchange@guldentrader.com';
  $config['smtp_pass'] = '3PrVPkeB';
  $config['charset'] = "utf-8";
  $config['mailtype'] = "html";
  $config['newline'] = "\r\n";
  $this->email->initialize($config);
  $this->email->from('exchange@guldentrader.com', 'exchange.guldentrader.com');
  $this->email->to($tomail);
  $this->email->reply_to('exchange@guldentrader.com', 'exchange.guldentrader.com');
  $this->email->subject($email_subject);
  $this->email->message($email_content);
  $send=$this->email->send();
  if($send)
  {
    return true; 
  }
  else{	
    show_error($this->email->print_debugger());
  }
}

function verification($verifier)
{
	
	$where = array('verifier'=> xss_clean($verifier),'verification_status'=>"unverified");
	$this->db->where($where);	  	
	$query = $this->db->get('user_verification');
	if($query->num_rows() == 1)
	{       
    $cur_date	= date('Y-m-d');
    $row = $query->row();
                //update user
    $data = array('status'=>"active",'verfiyStatus'=>"verified",'activated_date'=>$cur_date);	
    $this->db->where('id',$row->user_id);            	
    $this->db->update('users',$data);

                //update 
    $this->db->update('user_verification',array('verification_status'=>'verified'));
    return "ok";			 
  }   
  else
  {
    return "nok";
  }       
} 

function profile_update($data,$id)
{
  $this->db->where('id',$id);
  $res=$this->db->update('users',$data);
  if($res)
  {
    echo "Your Personal Information Successfully updated";
  }
  else
  {
    echo "Error in Updation";
  }
}

public function profile_details()
{
  $id=$this->session->user_id;
  $this->db->where('id',$id);
  $query=$this->db->get('users');
  if($query->num_rows()==1)
  {
    return $query->row();
  }
}

function enable_tfa()
{
  require_once 'GoogleAuthenticator.php';
  $ga = new PHPGangsta_GoogleAuthenticator();
  $customer_user_id   = $this->session->userdata('customer_user_id');
  $onecode = $this->input->post("one_code");
  $secret_code = $this->input->post("secret_code");
  //$onecode = "867345";
  //$secret_code = "XW7GPIMHICSKWL2P";$discrepancy = 1
  $code = $ga->verifyCode($secret_code,$onecode,$discrepancy = 1);
  $user_details = $this->get_userstatus($customer_user_id);
  if($user_details != "enable")
  {
    if($code==1)
    {
      $this->db->where('user_id',$customer_user_id);
      $data=array(
        'secret'  => $secret_code,
        'onecode' => $onecode,
          //'url'     => $url,
        'randcode'  => "enable"
        );
      $this->db->update('userdetails',$data);
      
      $userdetails = $this->get_userdetails($customer_user_id);
      if($userdetails)
      {
        $username = $userdetails->username;
        $secret = $userdetails->secret;
        $email = $userdetails->emailid;
        $status = 'Enable';
      }
      else
      {
        $username = "";
        $secret = "";
        $status = '';
        $email = '';
      }
      /*    Get Admin Details Start    */ 
      $this->db->where('id',1);   
      $query = $this->db->get('site_config');
      if($query->num_rows() == 1)
      {
        $row      =   $query->row();
        $admin_email  = $row->email_id;                    
        $companyname  = $row->company_name; 
        $siteurl    = $row->siteurl;        
      }
      /*  GET EMAIL TEMPLATE  START */
      $this->db->where('id',8);   
      $dis_get_email_info = $this->db->get('email_templates')->row();
      $email_from1  = $dis_get_email_info->from_id;
      $email_subject1 = $dis_get_email_info->subject;
      $email_content1 = $dis_get_email_info->message;
      $a  = array('##USERNAME##'=>$username,'##STATUS##'=>$status,'##SECRET##'=>$secret,'##FROM_EMAIL##'=>$admin_email,'##COMPANYNAME##'=>$companyname,'##SITEURL##'=>$siteurl,'##ADMIN_EMAIL##'=>$admin_email);
      $email_from = strtr($email_from1,$a); 
      $email_content  = strtr($email_content1,$a);
      /*  GET EMAIL TEMPLATE  END */ 
      $this->common_mail($admin_email,$companyname,$email,$email_subject1,$email_content); 
      echo "Enable";
    }
    else
    {
      return 0;
    }
  }
  else
  {
    if($code==1)
    {
      $this->db->where('user_id',$customer_user_id);
      $data=array(
        'secret'  => $secret_code,
        'onecode' => $onecode,
          //'url'     => $url,
        'randcode'  => "disable"
        );
      $this->db->update('userdetails',$data);
      $userdetails = $this->get_userdetails($customer_user_id);
      if($userdetails)
      {
        $username = $userdetails->username;
        $secret = $userdetails->secret;
        $email = $userdetails->emailid;
        $status = 'Disable';
      }
      else
      {
        $username = "";
        $secret = "";
        $status = '';
        $email = '';
      }
      /*    Get Admin Details Start    */ 
      $this->db->where('id',1);   
      $query = $this->db->get('site_config');
      if($query->num_rows() == 1)
      {
        $row      =   $query->row();
        $admin_email  = $row->email_id;                    
        $companyname  = $row->company_name; 
        $siteurl    = $row->siteurl;        
      }
      /*  GET EMAIL TEMPLATE  START */
      $this->db->where('id',10);    
      $dis_get_email_info = $this->db->get('email_templates')->row();
      $email_from1  = $dis_get_email_info->from_id;
      $email_subject1 = $dis_get_email_info->subject;
      $email_content1 = $dis_get_email_info->message;
      $a  = array('##USERNAME##'=>$username,'##STATUS##'=>$status,'##SECRET##'=>$secret,'##FROM_EMAIL##'=>$admin_email,'##COMPANYNAME##'=>$companyname,'##SITEURL##'=>$siteurl,'##ADMIN_EMAIL##'=>$admin_email);
      $email_from = strtr($email_from1,$a); 
      $email_content  = strtr($email_content1,$a);
      /*  GET EMAIL TEMPLATE  END */ 
      $this->common_mail($admin_email,$companyname,$email,$email_subject1,$email_content); 
      return "disable";
    }
    else
    {
      return "0";
    }
  }
}

function get_tfacode()
{
 require_once APPPATH.'libraries/google/GoogleAuthenticator.php';
 $ga = new PHPGangsta_GoogleAuthenticator();
 $data['secret'] = $ga->createSecret();
 $data['qrCodeUrl'] = $ga->getQRCodeGoogleUrl('gulden', $data['secret']);
 $data['oneCode'] = $ga->getCode($data['secret']);
 return $data;
}

function disable_tfa()
{
  $customer_user_id = $this->session->userdata('user_id'); 
  $data = array('randcode'=>'disable'); 
  $this->db->where('id',$customer_user_id);              
  $this->db->update('users',$data); 
  return true; 
}

  function user_check_tfa()
  {
      $customer_user_id   = $this->session->userdata('user_id');
      $this->db->where('id',$customer_user_id);
      $query = $this->db->get('users');
      if($query->num_rows() >= 1)
      {                   
         $row = $query->row();      
         return $row->randcode;      
      }else{     
        return false;   
      }
  }

  function get_secret($clientid)
  {
    $this->db->where('id',$clientid);
    $query = $this->db->get('users');
    if($query->num_rows() == 1)
    {
      $row = $query->row();
      return $row->secret;
    }
  }

}