<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Mdl_user extends CI_Model
{
    public $table = "users";
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
    
    function check_login()
    {
     $res_loguser = $this->db->query("SELECT id, firstname,role, randcode, status, password FROM `users` where email=?", array($this->input->post('email',true)));
     if($res_loguser->num_rows()==1) 
     { 
        $row = $res_loguser->row();

        if($row->status==='deactive')
        {
            return 'deactive';
        }
        if(password_verify($this->input->post('password',true), $row->password) === true)
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
                  'status'=>$row->status,
                  'role' => $row->role
                  );

                $this->session->set_userdata($sessiondata); 
                // send email
                $message = $this->load->view('template/emails/v_header', [], TRUE);
                $data  =['username'=>$row->firstname];
                $message .= $this->load->view('template/emails/v_success_login', $data, TRUE);
                $message .= $this->load->view('template/emails/v_footer', [], TRUE);
                $this->common_mail($this->input->post('email'),'Login success',$message);
                
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
	//$timeofreg	=	date("h:i:s");      
	//$login_date	=	date('Y-m-d');
	//$login_time	=	date("h:i:s"); 
	//$logouttime	=	""; 
	// $password	=	$this->generatepassword();
	//$ip=$_SERVER['REMOTE_ADDR'];
	$user_ip	=	$this->input->ip_address();    
	//$user_browser=$_SERVER['HTTP_USER_AGENT'];
	$this->load->library('user_agent');
	$user_browser	=	$this->agent->browser(); 
	//$clientid 		= $this->get_clientid();
	//$user_emailid	=	$this->input->post('email');  
	//$rest_already	=	$this->get_currentuserdetils(trim($user_emailid)); 
	//if($rest_already=="")
	//{

		//$firstname = $this->input->post('firstname');
		// $encrypted_pass = $this->simple_encrypt($password);
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
      'verfiyStatus'	=>	'unverified',
      'role' => 'member'
      );
  $this->db->insert('users',$data);    
  $last_userinsid = $this->db->insert_id();   
  if($last_userinsid!="")
  { 
   /* $this->db->insert('user_bankdetails',array('userId'=>$last_userinsid));*/
//			$notifydata = array(
//					'userId'=>$last_userinsid,
//					'newsletter_mail'=>"on",
//					'bitcoin_deposit'=>"on",
//					'bitcoin_withdraw'=>"on",
//					'litecoin_deposit'=>"on",
//					'litecoin_withdraw'=>"on",
//					'usd_deposit'=>"on",
//					'usd_withdraw'=>"on"
//				); 
//			$this->db->insert('userNotification',$notifydata); 
			// insert notification

//			$emaildata = array(
//					'user_id'=>$last_userinsid,
//					'bitcoin_email'=>"on",
//					'bank_email'=>"on",
//					'ripple_email'=>"on"
//					//'usd_deposit'=>"off"
//				); 
//			$this->db->insert('email_confirmation',$emaildata);
//			 
//			$balancedata = array('userId'=>$last_userinsid);
//			$this->db->insert('coin_userbalance',$balancedata);
//			
//			$addressdata = array('user_id'=>$last_userinsid);
//			$this->db->insert('coin_address',$addressdata);

   $verifydata = array('user_id'=>$last_userinsid,'verification_status'=>'unverified','verifier'=> random_string(25, false));

   $this->db->insert('user_verification',$verifydata);

			//$auto_verify = $this->admin_model->userverficationdetails($last_userinsid);

   $email		=	$this->input->post('email', true);   
   /*		Get Admin Details Start		 */ 
//		$this->db->where('id',1);  	
//		$query = $this->db->get('site_config');
//		if($query->num_rows() == 1)
//		{
//			$row 			= 	$query->row();
//			$admin_email	=	$row->email_id;			 							 
//			$companyname	=	$row->company_name;	
//			$siteurl		=	$row->siteurl;				
//		}

		/*	GET EMAIL TEMPLATE	START	*/
                 
		//$this->db->where('id',17);
		//$dis_get_email_info = $this->db->get('email_templates')->row();
                $dis_get_email_info = 
		//$email_from1	=	$dis_get_email_info->from_id;
		$email_subject1	=	'Please confirm your registration';
		$email_content1	=	$this->load->view('template/emails/v_registration_success',null,true); 
		$link =base_url().'user/user_verification/'.$verifydata['verifier']; 
		$a	=	array('##USERNAME##'=>$this->input->post('firstname', true),'##USERID##'=>base64_encode($last_userinsid),'##CLIENTID##'=>$email,'##PASSWORD##'=>$this->input->post('password1'),'##FROM_EMAIL##'=>'exchange@guldentrader.com','##COMPANYNAME##'=>'exchange.guldentrader.com','##EMAIL##'=>$email,'##SITEURL##'=>base_url(),'##ADMIN_EMAIL##'=>'exchange@guldentrader.com','##LINK##'=>$link);

		//$email_from	=	strtr($email_from1,$a);	
   $email_content	=	strtr($email_content1,$a);
   /*	GET EMAIL TEMPLATE	END	*/ 
   $this->common_mail($email,$email_subject1,$email_content);
   return true;
}
//	}   
//	else  
//	{ 
//		return "already";   
//	}   
}

function common_mail($tomail=null,$email_subject=null,$email_content=null)
{	 
    $this->load->library('email');
    $config['protocol'] = "smtp";
    $config['smtp_host'] = APP_SMTP_HOST;
    $config['smtp_port'] = APP_SMTP_PORT;
    $config['smtp_user'] = APP_SMTP_USER;
    $config['smtp_pass'] = APP_SMTP_PASS;
    $config['charset'] = APP_CHARSET;
    $config['mailtype'] = "html";
    $config['newline'] = "\r\n";
    $this->email->initialize($config);
    $this->email->from(APP_SMTP_USER, APP_SMTP_HOST);
    $this->email->to($tomail);
    $this->email->reply_to(APP_SMTP_USER, APP_SMTP_HOST);
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
        //$this->db->where('verfiyStatus','verified');
    $query=$this->db->get('users');
    if($query->num_rows()==1)
    {
        return $query->row();
    }
}

  /**
   *  @return one row if user_id eist else return all
   */
  public function get($user_id=0)   
  {
     $row = $this->db->get_where($this->table, ['id' => $user_id])->row();
     return $row;
  }

  public function delete($primary_key)
  {
    $this->db->delete($this->table, ['id' => $primary_key]);
    $this->db->delete('user_verification', ['user_id' => $primary_key]);
  }

}