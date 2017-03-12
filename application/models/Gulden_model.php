<?php defined('BASEPATH') OR exit('No direct script access allowed'); 
class Gulden_model extends CI_Model
{  
	public $getsmtp_hostname		="accport.com";   
	public $getsmtp_hostusername	="accportosiztechn";    
	public $getsmtp_hostpass		="q0q}d*35Nl7w";    
	function generall()
	{ 	
		$data['base']	= $this->config->item('base_url');
		$data['css']	= $this->config->item('css');  		
		$this->load->database();  
		return $data;
	}  
	function mailsettings()
	{ 	
	/*$this->load->library('email');
	// $config['wrapchars'] = 76; // Character count to wrap at.
	$config['mailtype'] = 'html'; // text or html Type of mail. If you send HTML email you must send it as a complete web page. Make sure you don't have any relative links or relative image paths otherwise they will not work.
    $config['priority'] = 1; // 1, 2, 3, 4, 5    Email Priority.html mail going to spam php  1 = highest. 5 = lowest. 3 = normal.
	$config['charset'] = 'utf-8'; // Character set (utf-8, iso-8859-1, etc.).
	$this->email->initialize($config);*/	
/*$this->load->library('email');
$this->email->clear();
$config = Array(
'protocol' => 'smtp',
'smtp_host' => 'ssl://smtp.googlemail.com',
'smtp_port' => 465,
'smtp_user' => "info@guldenltd.com",
'smtp_pass' => "gulden@123$",
'mailtype' => 'html',
'charset' => 'iso-8859-1'
);*/
$config = array(
	'protocol' => 'smtp',
	'smtp_host' => 'http://smtp.gmail.com',
	'smtp_port' => 465,
	'smtp_user' => 'info@guldenltd.com',
	'smtp_pass' => 'Trader@123',
	'mailtype' => 'html',
	'charset' => 'iso-8859-1',
	'wordwrap' => TRUE
	);
$config['priority'] = 1; // 1, 2, 3, 4, 5 Email Priority.html mail going to spam php 1 = highest. 5 = lowest. 3 = normal.
$this->email->initialize($config);
$this->email->set_newline("\r\n");
}

function common_mail($admin_email,$companyname,$tomail,$email_subject1,$email_content)
{	 
	$ci = get_instance();
	$ci->load->library('email');
	$config['protocol'] = "smtp";
//$config['smtp_host'] = "ssl://smtp.gmail.com";
	$config['smtp_host'] = "mail.guldentrader.com";
	$config['smtp_port'] = "25";
//$config['smtp_user'] = 'gulden@gmail.com';
//$config['smtp_pass'] = 'gulden123!@#';
	$config['smtp_user'] = 'exchange@guldentrader.com';
//$config['smtp_user'] = 'anuangusamy@gmail.com';
	$config['smtp_pass'] = '3PrVPkeB';
//$config['smtp_pass'] = 'akanu1304';
	$config['charset'] = "utf-8";
	$config['mailtype'] = "html";
	$config['newline'] = "\r\n";
	$ci->email->initialize($config);
	$ci->email->from($admin_email, $companyname);
	$ci->email->to($tomail);
	$this->email->reply_to($admin_email, $companyname);
	$ci->email->subject($email_subject1);
	$ci->email->message($email_content);
	$send=$ci->email->send();
	if($send)
	{
		return true; 
	}
	else{	
		show_error($ci->email->print_debugger());
	}

}



//encrypt the userid
function simple_encrypt($text)
{
	$salt ='whatever_you_want';
	return trim(base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_256, $salt, $text, MCRYPT_MODE_ECB, mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB), MCRYPT_RAND))));
}
//decrypt the userid
function simple_decrypt($text)
{
	$salt ='whatever_you_want';
	return trim(mcrypt_decrypt(MCRYPT_RIJNDAEL_256, $salt, base64_decode($text), MCRYPT_MODE_ECB, mcrypt_create_iv(mcrypt_get_iv_size(MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB), MCRYPT_RAND)));
}
function getrowsperpage()
{
	$this->db->where('id',1);
	$query=$this->db->get('admin');
	if($query->num_rows()==1)
	{   
		$row=$query->row();   
		$rowsperpage=$row->intRows;    
	}  
	return $rowsperpage;    
}
function nicetime($date)  
{
	if(empty($date)) {
		return "No date provided";
	}
	$periods= array("second", "minute", "hour", "day", "week", "month", "year", "decade");
	$lengths= array("60","60","24","7","4.35","12","10");
	$now= time();
	$unix_date= strtotime($date);
       // check validity of date
	if(empty($unix_date)) {   
		return "Bad date";
	}
    // is it future date or past date
	if($now > $unix_date) {   
		$difference     = $now - $unix_date;
		$tense         = "ago";
	} else {
		$difference     = $unix_date - $now;
		$tense         = "from now";
	}
	for($j = 0; $difference >= $lengths[$j] && $j < count($lengths)-1; $j++) {  
		$difference /= $lengths[$j];
	}
	$difference = round($difference);
	if($difference != 1) {
		$periods[$j].= "s";
	}
	return "$difference $periods[$j] {$tense}"; 
}
function get_alreadyuserdeatils($g_emailid)
{   
	$this->db->where('emailid',$g_emailid);      
	$query=$this->db->get('users');	 	     
	if($query->num_rows()>=1)  
	{           
		return "already"; 
	}      
	else
	{
		return "nothing";  
	}
}	
function remove_userticketdetails($id)
{
	$this->db->delete('support_detail',array('id' => $id));       
	return true;

}

function get_currentuserdetils($email_id=null) 
{
	$this->db->where('emailid',$email_id);   
	$get_qry=$this->db->get('users'); 
	if($get_qry->num_rows()>=1)
	{
		$row=$get_qry->row();  
		return $row;  
	}
	else
	{
		return false;   
	}
}  
function ajax_checkuserid_model($search_data)
{   
	$message="";
	$this->db->where('username',$search_data);      
	$query=$this->db->get('users');	 	     
	if($query->num_rows()>=1)  
	{           
		$result	=	$query->result();     
		$message	=	"username already";	 		    
		return $message;
	}      
	else
	{
		return false;
	}
}
function ajaxget_alreadyuserdeatils($g_emailid)
{   
	$email_err="";
	$this->db->where('emailid',$g_emailid);      
	$query=$this->db->get('users');	 	     
	if($query->num_rows()>=1)  
	{           
		$user_email=$query->result();     
		$email_err="email already";	 		    
		return $email_err;
	}      
	else
	{
		return false;
	}
}	
function add_userdetails()    
{    
	$accountno1=$this->generateaccountno();
	$name=$this->input->post('username');
	$accountno=$name.'-'.$accountno1;
	$dateofreg	=	date('Y-m-d');
	$timeofreg	=	date("h:i:s");      
	$login_date	=	date('Y-m-d');
	$login_time	=	date("h:i:s"); 
	$logouttime	=	""; 
	// $password	=	$this->generatepassword();
	//$ip=$_SERVER['REMOTE_ADDR'];
	$user_ip	=	$this->input->ip_address();    
	//$user_browser=$_SERVER['HTTP_USER_AGENT'];
	$this->load->library('user_agent');
	$user_browser	=	$this->agent->browser(); 
	$clientid 		=	$this->get_clientid();
	$user_emailid	=	$this->input->post('email');  
	$rest_already	=	$this->get_currentuserdetils(trim($user_emailid)); 
	if($rest_already=="")
	{
		
		$username = $this->input->post('username');
		// $encrypted_pass = $this->simple_encrypt($password);
		$data	=	array(                  
			'firstname'		=>	$this->input->post('username'),
			'account_no'    =>  $accountno,
			'lastname'		=>	$this->input->post('last_name'),
			'client_id'		=>	$clientid,
			'emailid'		=>	$this->input->post('email'),   
			'password'		=>	md5($this->input->post('password1')), 
		//'country'		=>	$this->input->post('country'), 
			'dateofreg'		=>	$dateofreg,  
			'userip'		=>	$user_ip,					
			'userbrowser'	=>	$user_browser,
			'username'		=>	$username,
			'status'		=>	'deactive',
			'randcode'		=>	'disable',
			'recaptcha'     => $this->input->post('recaptcha'),
			'verfiyStatus'	=>	'unverified'
			);
		$this->db->insert('users',$data);    
		$last_userinsid = $this->db->insert_id();   
		if($last_userinsid!="")
		{ 
			/* $this->db->insert('user_bankdetails',array('userId'=>$last_userinsid));*/
			$notifydata = array(
				'userId'=>$last_userinsid,
				'newsletter_mail'=>"on",
				'bitcoin_deposit'=>"on",
				'bitcoin_withdraw'=>"on",
				'litecoin_deposit'=>"on",
				'litecoin_withdraw'=>"on",
				'usd_deposit'=>"on",
				'usd_withdraw'=>"on"
				); 
			$this->db->insert('userNotification',$notifydata); 
			// insert notification
			
			$emaildata = array(
				'user_id'=>$last_userinsid,
				'bitcoin_email'=>"on",
				'bank_email'=>"on",
				'ripple_email'=>"on"
					//'usd_deposit'=>"off"
				); 
			$this->db->insert('email_confirmation',$emaildata);

			$balancedata = array('userId'=>$last_userinsid);
			$this->db->insert('balance',$balancedata);
			
			$addressdata = array('user_id'=>$last_userinsid);
			$this->db->insert('coin_address',$addressdata);

			$verifydata = array('user_id'=>$last_userinsid,'verification_status'=>'unverified');
			$this->db->insert('user_verification',$verifydata);

			$auto_verify = $this->admin_model->userverficationdetails($last_userinsid);

			$email		=	$this->input->post('email');   
			/*		Get Admin Details Start		 */ 
			$this->db->where('id',1);  	
			$query = $this->db->get('site_config');
			if($query->num_rows() == 1)
			{
				$row 			= 	$query->row();
				$admin_email	=	$row->email_id;			 							 
				$companyname	=	$row->company_name;	
				$siteurl		=	$row->siteurl;				
			}
			/*	GET EMAIL TEMPLATE	START	*/
			$this->db->where('id',17);  	
			$dis_get_email_info = $this->db->get('email_templates')->row();
			$email_from1	=	$dis_get_email_info->from_id;
			$email_subject1	=	$dis_get_email_info->subject;
			$email_content1	=	$dis_get_email_info->message; 
			$id = base64_encode($last_userinsid);
			$link ='https://exchange.guldentrader.com/gulden/user_verification?user='.$id; 
			$a	=	array('##USERNAME##'=>$username,'##USERID##'=>base64_encode($last_userinsid),'##CLIENTID##'=>$clientid,'##PASSWORD##'=>$this->input->post('password1'),'##FROM_EMAIL##'=>$admin_email,'##COMPANYNAME##'=>$companyname,'##EMAIL##'=>$email,'##SITEURL##'=>$siteurl,'##ADMIN_EMAIL##'=>$admin_email,'##LINK##'=>$link);
			$email_from	=	strtr($email_from1,$a);	
			$email_content	=	strtr($email_content1,$a);
			/*	GET EMAIL TEMPLATE	END	*/ 
			$this->common_mail($admin_email,$companyname,$email,$email_subject1,$email_content);

			return true;

		}

	}   
	else  
	{ 
		return "already";   
	}   
}
function get_clientid()
{
	$this->db->select('client_id')->order_by('client_id', 'desc')->limit(1);
	$query=$this->db->get('users');	 	     
	if($query->num_rows()>=1)  
	{           
		$result=$query->result();
		foreach($result as $list)
		{
			$id = $list->client_id;			
			return $id+1;
		}
	}   
	else 
	{
		return "10000";
	}
}	
function withdraw_req()
{
	$query = $this->db->get('site_config');
	if($query->num_rows() == 1)
	{
		return $row = $query->row();
		//return $row->withdraw_req;
	}
	else
	{
		return false;
	}
}
function activatedlink($id)
{
	$cur_date	= date('Y-m-d');
	$wheredata = array('user_id'=>$id,'status'=>"deactive");
	$this->db->where($wheredata);	  	
	$query = $this->db->get('users');	
	if($query->num_rows() >= 1)
	{       
		$data = array('status'=>"active",'activated_date'=>$cur_date);	
		$this->db->where('user_id',$id);            	
		$this->db->update('users',$data);
		return true;			 
	}   
	else
	{
		return false;
	}       
}   
function check_logindetails()
{
	$login_date	=	date('Y-m-d');
	$login_time	=	date("h:i:s"); 
	$datetime 	= 	$login_date." ".$login_time;
	$clientid	=	$this->input->post('clientid');   
	$password	=	$this->input->post('password');

	$encpassword = md5($password);
	/*// $encrypted_pass = $this->simple_encrypt($password);
	$this->db->where('client_id',$clientid);  
	//$this->db->or_where('username', $email_id); 
	$this->db->where('password',$encpassword);      
	//$this->db->where('status','active');      
	$res_loguser	=	$this->db->get('users');*/

	$res_loguser = $this->db->query("SELECT * FROM `users` where (client_id='$clientid' OR emailid='$clientid') AND password='$encpassword' ");


	$row		=	$res_loguser->row();  

	if($row) 
	{ 

		$db_user_id	=	$row->user_id;
		$db_email	=	$row->emailid;
		
		$db_client_id	=	$row->client_id;
		$firstname	=	$row->firstname;
		$lastname	=	$row->lastname;
		$db_name	=	$firstname." ".$lastname;
		$db_name1   =   $row->firstname;
		$username   =   $row->username;
		$db_status	=	$row->status;

		if($db_status=="active")
		{
			// set session       
			$sessiondata = array(
				'customer_email_id'  => $db_email,
				'customer_user_id' => $db_user_id,
				'customer_client_id' =>$db_client_id,
				'customer_name' => $db_name, 
				'user_name' => $db_name1
				);

			$this->session->set_userdata($sessiondata);   
			if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
				$ip = $_SERVER['HTTP_CLIENT_IP'];
			} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
				$ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
			} else {
				$ip = $_SERVER['REMOTE_ADDR'];
			} 

			$this->load->library('user_agent');
			$user_browser	=	$this->agent->browser(); 
			$historydata = array(
				'userId'=>$db_user_id,
				'ipAddress'=>$ip,
				'Browser'=>$user_browser,
				'Action'=>"Logged in",
				'datetime'=>$datetime
				);
			$this->db->insert('history',$historydata);
			$data['loginstatus']="1";
			$this->db->where('user_id',$db_user_id);
			$this->db->update('users',$data);

			$this->db->where('id',1);  	
			$query = $this->db->get('site_config');
			if($query->num_rows() == 1)
			{
				$row 			= 	$query->row();
				$admin_email	=	$row->email_id;			 							 
				$companyname	=	$row->company_name;	
				$siteurl		=	$row->siteurl;				
			}

			$this->db->where('userId',$db_user_id);  	
			$query = $this->db->get('history');
			if($query->num_rows() == 1)
			{
				$row 			= 	$query->row();
				$datetime	= strtotime('d-m-Y h:i:s',$row->datetime);			 							 

			}

			if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
				$ip = $_SERVER['HTTP_CLIENT_IP'];
			} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
				$ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
			} else {
				$ip = $_SERVER['REMOTE_ADDR'];
			} 


	       /* $dis_get_email_info	=	mysql_query("select * from email_templates where id='16'") or die(mysql_error());
			$get_email_info	=	mysql_fetch_array($dis_get_email_info);
			$email_from1	=	$get_email_info['from_id'];
			$email_subject1	=	$get_email_info['subject'];
			$email_content1	=	$get_email_info['message'];
			$a	=	array('##USERNAME##'=>$username,'##IP##'=>$ip,'##DATETIME##'=>$datetime,'##FROM_EMAIL##'=>$admin_email,'##COMPANYNAME##'=>$companyname,'##SITEURL##'=>$siteurl,'##ADMIN_EMAIL##'=>$admin_email);
			$email_from	=	strtr($email_from1,$a);	
			$email_content	=	strtr($email_content1,$a);
			 
 
			$this->common_mail($admin_email,$companyname,$db_email,$email_subject1,$email_content);*/


			return "active";
		}
		if($db_status=="deactive")
		{
			return "deactive";
		}
	}
	else
	{ 
		return "invalid";  
	}
}
function encryptIt( $q ) 
{
	$cryptKey  = 'qJB0rGtIn5UB1xG03efyCp';
	$qEncoded      = base64_encode( mcrypt_encrypt( MCRYPT_RIJNDAEL_256, md5( $cryptKey ), $q, MCRYPT_MODE_CBC, md5( md5( $cryptKey ) ) ) );
	return( $qEncoded );
}
function forgot_passmail()
{ 
	$email_id	=	$this->input->post('forgetemail');     
	$this->db->where('emailid',$email_id);   		
	$query_pass	=	$this->db->get('users');
	if($query_pass->num_rows()==1)  
	{   
		$row_pass	=	$query_pass->row();  
		$getuser_id	=	$row_pass->user_id;    
		$firstname	=	$row_pass->firstname;   
		$lastname	=	$row_pass->lastname;   
		$password	=	$this->generatepassword();
		$encpassword	=	md5($password);
		// $encrypted_pass = $this->simple_encrypt($password);
		$client_id	=	$row_pass->client_id;   
		$user_email	=	$row_pass->emailid;
		$username = $firstname." ".$lastname;

		$this->db->where('user_id',$getuser_id);
		$this->db->update('users',array('password'=>$encpassword));

		/*		Get Admin Details Start		 */
		$this->db->where('id',1);  	
		$query = $this->db->get('site_config');
		if($query->num_rows() == 1)
		{
			$row = $query->row();
			$admin_email	=	$row->email_id ;			 
			$siteurl		=	$row->siteurl;			 
			$companyname	=	$row->company_name;			 
		}
		/*		Get Admin Details End		 */
		/*		GET EMAIL TEMPLATE	START	*/
		$this->db->where('id',4);  	
		$dis_get_email_info = $this->db->get('email_templates')->row();
		$email_from1	=	$dis_get_email_info->from_id;
		$email_subject1	=	$dis_get_email_info->subject;
		$email_content1	=	$dis_get_email_info->message;

		$a	=	array('##USERNAME##'=>$username,'##CLIENTID##'=>$client_id,'##EMAILID##'=>$user_email,'##PASSWORD##'=>$password,'##FROM_EMAIL##'=>$admin_email,'##COMPANYNAME##'=>$companyname,'##SITEURL##'=>$siteurl,'##ADMIN_EMAIL##'=>$admin_email);
		$email_from			=	strtr($email_from1,$a);		
		$email_content		=	strtr($email_content1,$a);
		/*		GET EMAIL TEMPLATE	END	*/


		$this->common_mail($admin_email,$companyname,$user_email,$email_subject1,$email_content);

		
		return "success";	   	
	} 
	/*else   
	{ 
		return "failure"; 
	}*/
}
function reset_password_model()
{   
	$id			=	$this->input->post('id');
	$email		=	$this->input->post('emailid');
	$password	=	$this->input->post('newpassword');
	$this->db->where('user_id',$id);      
	$this->db->where('emailid',$email);    
	$data_update	=	array('password'=>$password);
	$result_tag	=	$this->db->update('users',$data_update);	 	     
	if($result_tag)
	{
		$taken_data	=	$this->get_userdetails($id);
		$username		=	$taken_data->username;			 
		$password	=	$taken_data->password;			 
		$email			=	$taken_data->emailid;
		/*		Get Admin Details Start		 */
		$this->db->where('id',1);  	
		$query = $this->db->get('site_config');
		if($query->num_rows() == 1)
		{
			$row = $query->row();
			$admin_email	=	$row->email_id ;			 
			$siteurl		=	$row->siteurl;			 
			$companyname	=	$row->company_name;			 
		}
		/*		Get Admin Details End		 */
		/*		GET EMAIL TEMPLATE	START	*/
		$this->db->where('id',3);  	
		$dis_get_email_info = $this->db->get('email_templates')->row();
		$email_from1	=	$dis_get_email_info->from_id;
		$email_subject1	=	$dis_get_email_info->subject;
		$email_content1	=	$dis_get_email_info->message;
		$a					=	array('##USERNAME##'=>$username,'##PASSWORD##'=>$password,'##EMAILID##'=>$email,'##FROM_EMAIL##'=>$admin_email,'##ADMIN_EMAIL##'=>$admin_email,'##COMPANYNAME##'=>$companyname,'##SITEURL##'=>$siteurl);
		$email_from			=	strtr($email_from1,$a);		
		$email_content		=	strtr($email_content1,$a);
		/*		GET EMAIL TEMPLATE	END	
		$view_smtp_hostname		=$this->getsmtp_hostname;    
		$view_smtp_hostusername	=$this->getsmtp_hostusername;  
		$view_smtp_hostpass		=$this->getsmtp_hostpass; 
		$config['protocol'] = 'smtp'; // mail, sendmail, or smtp    The mail sending protocol.
		$config['smtp_host'] =$view_smtp_hostname; // SMTP Server Address.
		$config['smtp_user'] =$view_smtp_hostusername; // SMTP Username.
		$config['smtp_pass'] =$view_smtp_hostpass; // SMTP Password.
		$config['smtp_port'] = '25'; // SMTP Port.
		$config['smtp_timeout'] = '5'; // SMTP Timeout (in seconds).
		$config['wordwrap'] = TRUE; // TRUE or FALSE (boolean)    Enable word-wrap.
		$config['wrapchars'] = 76; // Character count to wrap at.
		$config['mailtype'] = 'html'; // text or html Type of mail. If you send HTML email you must send it as a complete web page. Make sure you don't have any relative links or relative image              paths otherwise they will not work.
		$config['charset'] = 'utf-8'; // Character set (utf-8, iso-8859-1, etc.).
		$config['validate'] = FALSE; // TRUE or FALSE (boolean)    Whether to validate the email address.
		$config['priority'] = 3; // 1, 2, 3, 4, 5    Email Priority. 1 = highest. 5 = lowest. 3 = normal.
		$config['crlf'] = "\r\n"; // "\r\n" or "\n" or "\r" Newline character. (Use "\r\n" to comply with RFC 822).
		$config['newline'] = "\r\n"; // "\r\n" or "\n" or "\r"    Newline character. (Use "\r\n" to comply with RFC 822).  
		$config['bcc_batch_mode'] = FALSE; // TRUE or FALSE (boolean)    Enable BCC Batch Mode.
		$config['bcc_batch_size']=200; // Number of emails in each BCC batch.		
		$this->email->initialize($config); */

		$this->common_mail($admin_email,$companyname,$email,$email_subject1,$email_content);	
		return "success";
	}
	else
	{
		echo "failure";
	}
}
function fetchcountry()
{
	$this->load->database();
	$query	=	$this->db->get('country'); 
	if($query->num_rows() >= 1)
	{                
		return $query->result();			 
	}   
	else
	{      
		return false;		
	}
}
function fetchparticularcountry($id)
{
	$this->db->where('id',$id);
	$query	=	$this->db->get('country'); 
	if($query->num_rows() >= 1)
	{                
		$row	=	$query->row();			 
		return $row->country_name;
	}   
	else
	{      
		return false;		
	}
}
function fetchterms()
{
	$this->db->where('status','active');  
	$this->db->order_by('bid','desc'); 
	$query	=	$this->db->get('tbl_blog'); 
	if($query->num_rows() >= 1)
	{                
		return $query->result();			 
	}   
	else
	{      
		return false;		
	}
}
function fetchtotalnews()
{
	$this->db->where('status','active');  
	$this->db->order_by('bid','desc'); 
	$query	=	$this->db->get('tbl_blog'); 
	if($query->num_rows() >= 1)
	{                
		return $query->result();			 
	}   
	else
	{      
		return false;		
	}
}
function fetchtopnews()
{
	$this->db->where('status','active');  
	$this->db->order_by('bid','desc');  
	$this->db->limit(2);  
	$query	=	$this->db->get('tbl_blog'); 
	if($query->num_rows() >= 1)
	{                
		return $query->result();			 
	}   
	else
	{      
		return false;		
	}
}
function fetchnewscount($id)
{ 
	$this->db->where('bid',$id);  
	$query=$this->db->get('tbl_bloguser_comments'); 
	if($query->num_rows() >= 1)
	{                
		$cnt	=	$query->num_rows();			 
	}   
	else
	{      
		$cnt	=	0;	
	}
	return $cnt;
} 
function fetchparticularnews($id)
{ 
	$this->db->where('bid',$id); 
	$this->db->where('status','active');  	
	$query=$this->db->get('tbl_blog'); 
	if($query->num_rows() >= 1)
	{                
		return $query->row();			 
	}   
	else
	{      
		return false;		
	}
} 
function fetchparticularnewscomments($perpage,$urisegment,$id)
{ 
	$this->db->where('bid',$id);  
	$this->db->where('status','active');  
	$this->db->limit($perpage,$urisegment);
	$query=$this->db->get('tbl_bloguser_comments'); 
	if($query->num_rows() >= 1)
	{                
		return $query->result();			 
	}   
	else
	{      
		return false;		
	}
} 
function fetchparticularnewscommentscount($id)
{ 
	$this->db->where('bid',$id);  
	$this->db->where('status','active');  
	$query=$this->db->get('tbl_bloguser_comments'); 
	if($query->num_rows() >= 1)
	{                
		$cnt	=	$query->num_rows();			 
	}   
	else
	{      
		$cnt	=	0;	
	}
	return $cnt;
} 
function fetchtradehistory($perpage,$urisegment)
{
	$customer_user_id	=	$this->session->user_id; 
	//$accport_currency_session	=	$this->session->userdata('accport_currency');  
	$currency = $this->session->userdata('currency');
	if($currency=="")
	{
		$currency	=	"btc_usd";
	}
	$exp = explode('_',$currency);
	$firstCurrency  = $exp[0];
	$secondCurrency = $exp[1];
	$this->db->where('firstCurrency',$firstCurrency);  
	$this->db->where('secondCurrency',$secondCurrency);
/* 	$this->db->where('firstCurrency',$firstCurrency);  
$this->db->where('secondCurrency',$secondCurrency);  */
$this->db->where('userId',$customer_user_id);  
$this->db->where('status',"filled");  
	//$this->db->limit($perpage);
$this->db->order_by('tradetime','desc');
$this->db->limit($perpage,$urisegment);
$query=$this->db->get('coin_order'); 
if($query->num_rows() >= 1)
{                
	return $query->result();			 
}   
else
{      
	return false;		
}
}
function fetchtradehistorycount()
{ 
	$customer_user_id		=	$this->session->user_id;
	$accport_currency_session	=	$this->session->userdata('accport_currency');  
	if($accport_currency_session=="")
	{
		$accport_currency_session	=	"eur_nlg";
	}
	$exp = explode('_',$accport_currency_session);
	$firstCurrency  = $exp[0];
	$secondCurrency = $exp[1];
/* 	$this->db->where('firstCurrency',$firstCurrency);  
$this->db->where('secondCurrency',$secondCurrency);  */
$this->db->where('userId',$customer_user_id);  	
$this->db->where('status',"filled");  
$query=$this->db->get('coin_order'); 
if($query->num_rows() >= 1)
{                
	$cnt	=	$query->num_rows();			 
}   
else
{      
	$cnt	=	0;	
}
return $cnt;
} 
// transaction history
function fetchtransactionhistory1($firstcurrency,$secondcurrency)
{
	if($this->session->userdata('currencyPair'))
	{     
		$currency =  $this->session->userdata('currencyPair','EUR_NLG');

	}
	else
	{
		$currency =  $this->session->userdata('currencyPair');
	}

	$customer_user_id	=	$this->session->user_id; 
	$this->db->where('userId',$customer_user_id);  
	$this->db->where('type !=',"Cancel"); 
	$this->db->order_by('transactionId',"desc"); 
	//$this->db->limit($perpage,$urisegment);
	$this->db->where('currency',$firstcurrency);
	$this->db->where('secondcurrency',$secondcurrency);
	$query=$this->db->get('transaction_history'); 
	
	if($query->num_rows() >= 1)
	{                	
		return $query->result();			 
	}   
	else
	{      
		return false;		
	}
}

function fetchtransactionhistory($secondcurrency)
{
	//$customer_user_id	=	$this->session->user_id; 
	//$this->db->where('userId',$customer_user_id); 
	$currency = $this->session->userdata('currency');
	$currency1=$currency; 
	$pair=strtolower($currency1); 
	$currency = explode("_", $currency1);
	$firstcurrency=$currency[0];
	$secondcurrency=$currency[1];

	$names=array("filled","cancelled");
	$this->db->where_in('status',$names); 
	$this->db->order_by('tradetime',"desc"); 
	//$this->db->limit($perpage,$urisegment);
	$this->db->where('firstCurrency',$firstcurrency);
	$this->db->where('secondCurrency',$secondcurrency);
	$query=$this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{                	
		return $query->result();			 
	}   
	else
	{      
		return false;		
	}
}

function fetchtransactionhistory2($secondcurrency)
{
	//$customer_user_id	=	$this->session->user_id; 
	//$this->db->where('userId',$customer_user_id);  
	$names=array("filled","cancelled");
	$this->db->where_in('status',$names); 
	$this->db->order_by('tradetime',"desc"); 
	//$this->db->limit($perpage,$urisegment);
	$this->db->where('secondCurrency',$secondcurrency);
	$query=$this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{                	
		return $query->result();			 
	}   
	else
	{      
		return false;		
	}
}


function fetchtransactionhistorycount()
{ 
	$customer_user_id		=	$this->session->user_id;
	$this->db->where('userId',$customer_user_id);  	
	$this->db->where('status',"active");  
	$this->db->order_by('transactionId',"desc"); 
	$query=$this->db->get('transaction_history'); 
	if($query->num_rows() >= 1)
	{                
		$cnt	=	$query->num_rows();			 
	}   
	else
	{      
		$cnt	=	0;	
	}
	return $cnt;
} 
function fetchorderhistory($perpage,$urisegment)
{
	$customer_user_id		=	$this->session->user_id; 
	$names = array('active', 'partially');
	$this->db->where('userId',$customer_user_id);  
	$this->db->where_in('status', $names);
	$this->db->limit($perpage,$urisegment);
	$query=$this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{                
		return $query->result();			 
	}   
	else
	{      
		return false;		
	}
}
function fetchorderhistorycount()
{ 
	$customer_user_id		=	$this->session->user_id;
	$names = array('active', 'partially');
	$this->db->where('userId',$customer_user_id);  	
	$this->db->where_in('status', $names);
	$query=$this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{                
		$cnt	=	$query->num_rows();			 
	}   
	else
	{      
		$cnt	=	0;	
	}
	return $cnt;
}
function changepwd_statusdetails()
{
	$customer_user_id		=	$this->session->user_id; 
	$oldpassword		=	$this->input->post('oldpassword');  
	$retypepassword		=	$this->input->post('confirmpassword');  
	 // $encrypted_pass = $this->simple_encrypt($oldpassword);
	$this->db->where('user_id',$customer_user_id);      
	$this->db->where('password',$oldpassword);      
	$query	=	$this->db->get('users');
	if($query->num_rows()==1) 
	{ 
		// $encrypted_newpass = $this->simple_encrypt($retypepassword);
		$this->db->where('user_id',$customer_user_id);  
		$this->db->update('users',array('password'=>$retypepassword));
		return "success";
	}
	else
	{ 
		return false;  
	}
}
function get_userdetails($user_id)
{ 
	$this->db->where('user_id',$user_id);  
	$query=$this->db->get('users'); 
	if($query->num_rows() >= 1)
	{                
		return $query->row();			 
	}   
	else
	{      
		return false;		
	}
}
function get_userdetailsbyclientid($client_id)
{ 
	$this->db->where('client_id',$client_id);  
	$query=$this->db->get('users'); 
	if($query->num_rows() >= 1)
	{                
		return $query->row();			 
	}   
	else
	{      
		return false;		
	}
}   
function uploadprofilepicture($image)
{
	$customer_user_id		=	$this->session->user_id; 
	$this->db->where('user_id',$customer_user_id);  
	$this->db->update('users',array('profilepicture'=>$image)); 
	return true;
}
/* Message Section Starts Here */
// suggest users for autocomplete
function suggest_users_model($options = array())
{
	$cur_date	=	date('Y-m-d');  
	$search_data	=	$options['keyword'];
	$this->db->select('emailid');
	$this->db->like('emailid',$search_data);
	$query= $this->db->get('users');  	
	if($query->num_rows() >=1)
	{             		
		return $query->result();			
	}    
	else  
	{  
		return false;
	}
}
function ajaxcomposemodel()
{
	$pearlet_client_mailid		=	$this->session->userdata('pearlet_client_mailid');
	$c_date		=	date('Y-m-d h:i A');
	$curdate	=	date('Y-m-d');
	$to			=	$this->input->post('emailid');
	$message	=	$this->input->post('message');
	$data	=	array(
		"from"=>$pearlet_client_mailid,
		"to"=>$to,
		"message"=>$message,
		"type"=>"compose",
		"created_date"=>$curdate,
		"c_date"=>$c_date,
		"status"=>"unread"
		);
	$query	=	$this->db->insert('message',$data);
	if($query)
	{
		return "success";
	}
	else
	{
		return "failure";
	}
}
function deleteinboxmessagemodel($id)
{
	$this->db->where("message_id",$id);
	$this->db->update('message',array("inbox"=>'1'));
	return true;
}
function deleteoutboxmessagemodel($id)
{
	$this->db->where("message_id",$id);
	$this->db->update('message',array("outbox"=>'1'));
	return true;
}
function fetchinboxmessages($perpage,$urisegment)
{
	$pearlet_client_mailid		=	$this->session->userdata('pearlet_client_mailid'); 
	$this->db->where('to',$pearlet_client_mailid);  	
	$this->db->where('type',"compose");  	
	$this->db->where('inbox',0);  	
	$this->db->limit($perpage,$urisegment);
	$query	=	$this->db->get('message'); 
	if($query->num_rows() >= 1)
	{                
		return $query->result(); 
	}   
	else
	{      
		return false;
	}
}
function fetchinboxmessagescount()
{ 
	$pearlet_client_mailid		=	$this->session->userdata('pearlet_client_mailid'); 
	$this->db->where('to',$pearlet_client_mailid);  	
	$this->db->where('type',"compose");  
	$this->db->where('inbox',0);  		
	$query	=	$this->db->get('message'); 
	if($query->num_rows() >= 1)
	{                
		$cnt=$query->num_rows();			 
	}   
	else
	{      
		$cnt=0;	
	}
	return $cnt;
}
function pages_model($id)
{
	if($this->session->userdata('language')=='chinese_sim')
	{
		$this->db->where('pageid',$id);
		$query=$this->db->get('pages_chi_sim');
		return $query->result();
	}
	elseif($this->session->userdata('language')=='chinese_tra')
	{
		$this->db->where('pageid',$id);
		$query=$this->db->get('pages_chi_tra');
		return $query->result();
	}
	else
	{
		$this->db->where('pageid',$id);
		$query=$this->db->get('pages');
		return $query->result();
	}
}
function fetchoutboxmessages($perpage,$urisegment)
{
	$pearlet_client_mailid		=	$this->session->userdata('pearlet_client_mailid'); 
	$this->db->where('from',$pearlet_client_mailid);  	
	$this->db->where('type',"compose"); 
	$this->db->where('outbox',0);  	 	
	$this->db->limit($perpage,$urisegment);
	$query	=	$this->db->get('message'); 
	if($query->num_rows() >= 1)
	{                
		return $query->result(); 
	}   
	else
	{      
		return false;
	}
}
function fetchoutboxmessagescount()
{ 
	$pearlet_client_mailid		=	$this->session->userdata('pearlet_client_mailid'); 
	$this->db->where('from',$pearlet_client_mailid);  	
	$this->db->where('type',"compose");  
	$this->db->where('outbox',0);  		
	$query	=	$this->db->get('message'); 
	if($query->num_rows() >= 1)
	{                
		$cnt=$query->num_rows();			 
	}   
	else
	{      
		$cnt=0;	
	}
	return $cnt;
}
//for header
function fetchmsgcount()
{ 
	$pearlet_client_mailid		=	$this->session->userdata('pearlet_client_mailid'); 
	$this->db->where('to',$pearlet_client_mailid);  	
	$this->db->where('type',"compose");  	
	$this->db->where('status',"unread");  	
	$this->db->where('inbox',0);  
	$query	=	$this->db->get('message'); 
	if($query->num_rows() >= 1)
	{                
		$cnt	=	$query->num_rows();			 
	}   
	else
	{      
		$cnt=0;	
	}
	return $cnt;
}
function get_individual_message($id)
{
	$this->db->where('message_id',$id);  	
	$query = $this->db->get('message');
	if($query->num_rows() >= 1)
	{
		return $query->row();			
	}    
	else
	{
		return false;	
	}	
}
function assign_read_mail($id)
{
	$status	="read";
	$this->db->where('message_id',$id);        
	$this->db->update('message',array('status' => $status));
	return true;
}
/* Message Section Ends Here  */
function updatemarketprice()
{
	//BTC - USD
	$btc_usd_url	=	"https://btc-e.com/api/2/btc_usd/ticker";
	$btc_usd_file	=	file_get_contents($btc_usd_url);
	$btc_usd_response = json_decode($btc_usd_file);
	foreach($btc_usd_response as $one)
	{
		$last_one	= $one->last;  
	}   
	//BTC - RUR
	$btc_rur_url	=	"https://btc-e.com/api/2/btc_rur/ticker";
	$btc_rur_file	=	file_get_contents($btc_rur_url);
	$btc_rur_response = json_decode($btc_rur_file);
	foreach($btc_rur_response as $two)
	{
		$last_two	= $two->last;  
	}   
	//BTC - EUR
	$btc_eur_url	=	"https://btc-e.com/api/2/btc_eur/ticker";
	$btc_eur_file	=	file_get_contents($btc_eur_url);
	$btc_eur_response = json_decode($btc_eur_file);
	foreach($btc_eur_response as $three)
	{
		$last_three	= $three->last;  
	}   
	//LTC - BTC
	$ltc_btc_url	=	"https://btc-e.com/api/2/ltc_btc/ticker";
	$ltc_btc_file	=	file_get_contents($ltc_btc_url);
	$ltc_btc_response = json_decode($ltc_btc_file);
	foreach($ltc_btc_response as $four)
	{
		$last_four	= $four->last;  
	}   
	//LTC - USD
	$ltc_usd_url	=	"https://btc-e.com/api/2/ltc_usd/ticker";
	$ltc_usd_file	=	file_get_contents($ltc_usd_url);
	$ltc_usd_response = json_decode($ltc_usd_file);
	foreach($ltc_usd_response as $five)
	{
		$last_five	= $five->last;  
	}   
	//LTC - RUR
	$ltc_rur_url	=	"https://btc-e.com/api/2/ltc_rur/ticker";
	$ltc_rur_file	=	file_get_contents($ltc_rur_url);
	$ltc_rur_response = json_decode($ltc_rur_file);
	foreach($ltc_rur_response as $eighteen)
	{
		$last_eighteen	= $eighteen->last;  
	}   
	//LTC - EUR
	$ltc_eur_url	=	"https://btc-e.com/api/2/ltc_eur/ticker";
	$ltc_eur_file	=	file_get_contents($ltc_eur_url);
	$ltc_eur_response = json_decode($ltc_eur_file);
	foreach($ltc_eur_response as $six)
	{
		$last_six	= $six->last;  
	}   
	//NMC - BTC
	$nmc_btc_url	=	"https://btc-e.com/api/2/nmc_btc/ticker";
	$nmc_btc_file	=	file_get_contents($nmc_btc_url);
	$nmc_btc_response = json_decode($nmc_btc_file);
	foreach($nmc_btc_response as $seven)
	{
		$last_seven	= $seven->last;  
	}   
	//NMC - USD
	$nmc_usd_url	=	"https://btc-e.com/api/2/nmc_usd/ticker";
	$nmc_usd_file	=	file_get_contents($nmc_usd_url);
	$nmc_usd_response = json_decode($nmc_usd_file);
	foreach($nmc_usd_response as $eight)
	{
		$last_eight	= $eight->last;  
	}  
	//NVC - BTC
	$nvc_btc_url	=	"https://btc-e.com/api/2/nvc_btc/ticker";
	$nvc_btc_file	=	file_get_contents($nvc_btc_url);
	$nvc_btc_response = json_decode($nvc_btc_file);
	foreach($nvc_btc_response as $nine)
	{
		$last_nine	= $nine->last;  
	}  
	//NVC - USD
	$nvc_usd_url	=	"https://btc-e.com/api/2/nvc_usd/ticker";
	$nvc_usd_file	=	file_get_contents($nvc_usd_url);
	$nvc_usd_response = json_decode($nvc_usd_file);
	foreach($nvc_usd_response as $ten)
	{
		$last_ten	= $ten->last;  
	}   
	//USD - RUR
	$usd_rur_url	=	"https://btc-e.com/api/2/usd_rur/ticker";
	$usd_rur_file	=	file_get_contents($usd_rur_url);
	$usd_rur_response = json_decode($usd_rur_file);
	foreach($usd_rur_response as $eleven)
	{
		$last_eleven	= $eleven->last;  
	}  
	//EUR - USD
	$eur_usd_url	=	"https://btc-e.com/api/2/eur_usd/ticker";
	$eur_usd_file	=	file_get_contents($eur_usd_url);
	$eur_usd_response = json_decode($eur_usd_file);
	foreach($eur_usd_response as $twelve)
	{
		$last_twelve	= $twelve->last;  
	}  
	//TRC - BTC
	$trc_btc_url	=	"https://btc-e.com/api/2/trc_btc/ticker";
	$trc_btc_file	=	file_get_contents($trc_btc_url);
	$trc_btc_response = json_decode($trc_btc_file);
	foreach($trc_btc_response as $thirteen)
	{
		$last_thirteen	= $thirteen->last;  
	}   
	//PPC - BTC
	$ppc_btc_url	=	"https://btc-e.com/api/2/ppc_btc/ticker";
	$ppc_btc_file	=	file_get_contents($ppc_btc_url);
	$ppc_btc_response = json_decode($ppc_btc_file);
	foreach($ppc_btc_response as $fourteen)
	{
		$last_fourteen	= $fourteen->last;  
	}  
	//PPC - USD
	$ppc_usd_url	=	"https://btc-e.com/api/2/ppc_usd/ticker";
	$ppc_usd_file	=	file_get_contents($ppc_usd_url);
	$ppc_usd_response = json_decode($ppc_usd_file);
	foreach($ppc_usd_response as $fifteen)
	{
		$last_fifteen	= $fifteen->last;  
	}  
	//FTC - BTC
	$ftc_btc_url	=	"https://btc-e.com/api/2/ftc_btc/ticker";
	$ftc_btc_file	=	file_get_contents($ftc_btc_url);
	$ftc_btc_response = json_decode($ftc_btc_file);
	foreach($ftc_btc_response as $sixteen)
	{
		$last_sixteen	= $sixteen->last;  
	}  
	//XPM - BTC
	$xpm_btc_url	=	"https://btc-e.com/api/2/xpm_btc/ticker";
	$xpm_btc_file	=	file_get_contents($xpm_btc_url);
	$xpm_btc_response = json_decode($xpm_btc_file);
	foreach($xpm_btc_response as $seventeen)
	{
		$last_seventeen	= $seventeen->last;  
	}   
	$updatedata	=	array(
		"btc_usd"=>$last_one,
		"btc_rur"=>$last_two,
		"btc_eur"=>$last_three,
		"ltc_btc"=>$last_four,
		"ltc_usd"=>$last_five,
		"ltc_rur"=>$last_eighteen,
		"ltc_eur"=>$last_six,
		"nmc_btc"=>$last_seven,
		"nmc_usd"=>$last_eight,
		"nvc_btc"=>$last_nine,
		"nvc_usd"=>$last_ten,
		"usd_rur"=>$last_eleven,
		"eur_usd"=>$last_twelve,
		"trc_btc"=>$last_thirteen,
		"ppc_btc"=>$last_fourteen,
		"ppc_usd"=>$last_fifteen,
		"ftc_btc"=>$last_sixteen,
		"xpm_btc"=>$last_seventeen
		);
	$this->db->where('id','1');
	$this->db->update('marketprice',$updatedata);
	return true;
}
function fetchmarketprice()
{
	$this->db->where('id','1');  	
	$query = $this->db->get('marketprice');
	if($query->num_rows() >= 1)
	{
		return $query->row();			
	}    
	else
	{
		return false;	
	}	
}
function getCurrency($currency)
{
	if($currency=="USD")
	{
		$num =	$this->input->post('num');
		if($num=='1')
		{
			$paymentname	=	"Perfect Money";
		}
		else if($num=='2')
		{
			$paymentname	=	"LiqPAY";
		}
		else if($num=='3')
		{
			$paymentname	=	"Paypal";
		}
		else if($num=='4')
		{
			$paymentname	=	"BTC-E Code";
		}
		else if($num=='5')
		{
			$paymentname	=	"QIWI";
		}
		else if($num=='6')
		{
			$paymentname	=	"Epese.com";
		}
		else if($num=='7')
		{
			$paymentname	=	"Ecoin.cc";
		}
		else if($num=='8')
		{
			$paymentname	=	"OKpay";
		}
		else if($num=='9')
		{
			$paymentname	=	"Paxum.com";
		}
		else if($num=='10')
		{
			$paymentname	=	"Payeer.com";
		}
		else if($num=='11')
		{
			$paymentname	=	"Egopay.com";
		}
		else
		{
			$paymentname	=	"Payza.com";
		}
	}
	else if($currency=="EUR")
	{
		$num =	$this->input->post('num');
		if($num=='1')
		{
			$paymentname	=	"Perfect Money";
		}
		else if($num=='2')
		{
			$paymentname	=	"OKpay";
		}
		else if($num=='3')
		{
			$paymentname	=	"Payeer.com";
		}
		else
		{
			$paymentname	=	"BTC-E Code";
		}
	}
	else if($currency=="RUR")
	{
		$num =	$this->input->post('num');
		if($num=='1')
		{
			$paymentname	=	"Qiwi";
		}
		else if($num=='2')
		{
			$paymentname	=	"BTC-E Code";
		}
		else if($num=='3')
		{
			$paymentname	=	"OKpay";
		}
		else
		{
			$paymentname	=	"Payeer.com";
		}
	}
	return $paymentname;
}
/* Support Section Starts Here */
function getall_api_question()
{
	$this->db->where('ques_type_id',2);  	
	$query	=	$this->db->get('ticket_knowledge'); 
	if($query->num_rows() >= 1)
	{                
		return $query->result(); 		 
	}
}
function getall_general_question()
{
	$this->db->where('ques_type_id',1);  	
	$query	=	$this->db->get('ticket_knowledge'); 
	if($query->num_rows() >= 1)
	{                
		return $query->result(); 		 
	}
}
function getall_id_updates($id)
{
	$this->db->where('ticket_updates_id',$id);  	
	$query	=	$this->db->get('ticket_updates'); 
	if($query->num_rows() >= 1)
	{                
		return $query->result(); 		 
	}
}
function addsupport($file)
{
	$dateofreg=date('Y-m-d');
	$departments=$this->input->post('departments');
	$name=$this->input->post('name');
	$email=$this->input->post('email');
	$username=$this->input->post('username');
	$subject=$this->input->post('subject');
	$message=$this->input->post('message');
	$data=array('departments'=>$departments,'name'=>$name,'email'=>$email,'username'=>$username,'subject'=>$subject,'message'=>$message,'file'=>$file,'created_date'=>$dateofreg);
	$query=$this->db->insert('support_detail',$data);
	$msg="success";
	return $msg;
}
/* Support Section Ends Here */
/* Crypto Currency Section Starts Here */
function checkbitcoindepositAddress($currency)
{
	$customer_user_id	=	$this->session->user_id;
	$this->db->where('user_id',$customer_user_id);  
	$this->db->order_by('add_id','desc');
	$query=$this->db->get('bitcoin_address'); 
	if($query->num_rows() >= 1)
	{                
		$row = $query->row();	
		if($currency=="BTC")
		{ 
			$address = $row->address; 
		}
		
		return $address;
	}   
	else
	{      
		return false;		
	}
}

function checkdepositAddress($currency)
{	

	$customer_user_id	=	$this->session->user_id;
	$this->db->where('user_id',$customer_user_id);  
	$query=$this->db->get('coin_address'); 
	if($query->num_rows() >= 1)
	{                
		$row = $query->row();	
		if($currency=="NLG")
		{ 
			$address = $row->NLG; 
		}
		else if($currency=="EUR")
		{ 
			$address = $row->EUR; 
		}
		else if($currency=="GTS")
		{ 
			$address = $row->GTS; 
		}

		return $address;
	}   
	else
	{      
		return false;		
	}
}
function checkapideposit_add($id)
{
	$this->db->where('user_id',$id);  
	$query=$this->db->get('coin_address'); 
	if($query->num_rows() >= 1)
	{                
		$row = $query->row();	
		if($currency=="BTC")
		{ 
			$address = $row->BTC; 
		}
		else if($currency=="LTC")
		{ 
			$address = $row->LTC; 
		}
		return $address;
	}   
	else
	{      
		return false;		
	}
}
function get_useremailid($id)
{
	$this->db->where('user_id',$id);
	$query = $this->db->get('users');
	if($query->num_rows() == 1)
	{
		$row = $query->row();
		return $row->emailid;
	}
}
function checkAddress($currency)
{
	$customer_user_id	=	$this->session->user_id;
	$this->db->where('user_id',$customer_user_id);  
	if($currency=="BTC")
	{ 
		$this->db->where('btcstatus','unused');  
	}
	else if($currency=="LTC")
	{ 
		$this->db->where('ltcstatus','unused');  
	}
	
	$query	=	$this->db->get('coin_address'); 
	if($query->num_rows() >= 1)
	{                
		$row = $query->row();	
		if($currency=="BTC")
		{ 
			$address = $row->BTC; 
		}
		else if($currency=="LTC")
		{ 
			$address = $row->LTC; 
		}
		
		return $address;
	}   
	else
	{      
		return "used";		
	}
}
function updateAddress($content,$currency)
{
	$customer_user_id	=	$this->session->user_id; 
	$request_date	=	date('Y-m-d');
	$request_time	=	date("h:i:s");  
	
	$data	=	array(                  
		'BTC'=>$content,
		'count'=>"1",
		'request_date'=>$request_date,   
		'request_time'=>$request_time,   
		'btcstatus'=>'unused'
		);
	
	$this->db->where('user_id',$customer_user_id);  
	$this->db->update('coin_address',$data);   

	$datetime	=	date('Y-m-d h:i:s');
	if($content!="")
	{
		$this->db->insert('bitcoin_address',array('address'=>$content,'createddate'=>$datetime,'user_id'=>$customer_user_id)); 
		
	}
	return "success";
}
function fetchUsername()
{ 
	$pearlet_client_mailid = $this->session->userdata('pearlet_client_mailid');
	$this->db->where('emailid',$pearlet_client_mailid);  
	$query=$this->db->get('users'); 
	if($query->num_rows() >= 1)
	{                
		$row = $query->row();	
		return $row->username;
	}   
	else
	{      
		return false;		
	}
}
function fetchuserbalance()
{
	$customer_user_id	=	$this->session->user_id;
	$this->db->where('userId',$customer_user_id);  
	$query=$this->db->get('coin_userbalance'); 
	if($query->num_rows() >= 1)
	{                
		return $row = $query->row();	
	}   
	else
	{      
		return false;		
	}
}

function withdrawcoinrequestmodel()
{
	$curr = "bitcoin"; 
	
	$address 			= 	$this->input->post('btc_address');
	/* $namecoin_row = $this->fetchWallet($curr);    // fetch bitcoin wallet credentials
	$namecoin_username	=	$namecoin_row->username;
	$namecoin_password	=	$namecoin_row->password;
	$namecoin_portnumber = 	$namecoin_row->portnumber;
	$namecoin 	= new jsonRPCClient("http://$namecoin_username:$namecoin_password@127.0.0.1:$namecoin_portnumber/");
	$isvalid = $namecoin->validateaddress($address);
	if($isvalid['isvalid']==1)
	{ */
		$customer_user_id	=	$this->session->user_id;
		$request_date	=	date('Y-m-d');
		$request_time	=	date("h:i:s");  
		$currency		= 	'BTC';
		$final			= 	$this->input->post('final');
		$askamount		= 	$this->input->post('btc_amount');
		$purse 			= 	$this->input->post('btc_address');
		if($currency=='BTC')
		{
			$buy_rate = $this->lowestaskprice("BTC","USD"); 
			if($buy_rate=="")
			{
				$buy_rate="508.2";
			}
		}
		else
		{
			$buy_rate = $this->lowestaskprice("LTC","USD"); 
			if($buy_rate=="")
			{
				$buy_rate="7.57414";
			}
		}
		$amount = $askamount-$final;
			//$account = $this->checkdepositAddress($currency);
		$token = $this->generateRandomString();

		$usd_fee = $buy_rate*$final;
		$high_fee = $this->get_highest_fee();
		if($high_fee<$usd_fee)
		{
			$fee = $high_fee/$buy_rate;
			$amount = $askamount-$fee;
		}
		$data	=	array(                  
			'userId'		=>	$customer_user_id,
			'currency'		=>	$currency,
			'token'			=>	$token,
			'purse'			=>	$purse,
			'amount'		=>	$amount, 
			'payment'		=>	$curr, 
			'askamount'		=>	$askamount,   		
			'request_date'	=>	$request_date,   
			'request_time'	=>	$request_time,   
			'status'		=>	'processing'
			);
		$this->db->insert('coin_withdraw',$data); 
		$insid = $this->db->insert_id();
		if($insid)
		{
			$balance = $this->fetchuserbalancebyId($customer_user_id,'BTC');  // fetch first balance
			$updatefirstBalance = $balance-$askamount;
			
			$updatedata = array('BTC'=>$updatefirstBalance);
			
			$this->db->where('userId',$customer_user_id); 
			$this->db->update('coin_userbalance',$updatedata);
			$transdata	=	array(                  
				'userId'=>$customer_user_id,
				'type'=>"Withdraw",
				'currency'=>$currency,  
				'token'=>$token,  
				'amount'=>$amount,
				'askamount'=>$askamount,		
				'date'=>$request_date,   
				'time'=>$request_time,   
				'status'=>'active'
				);
			$this->db->insert('transaction_history',$transdata);
			/*		Get Admin Details Start		 */ 
			$this->db->where('id',1);  	
			$query = $this->db->get('site_config');
			if($query->num_rows() == 1)
			{
				$row 			= 	$query->row();
				$admin_email	=	$row->email_id;			 							 
				$companyname	=	$row->company_name;	
				$siteurl		=	$row->siteurl;				
			}
			$userResult = 	$this->get_userdetails($customer_user_id);
			$username 	= 	$userResult->username;
			$to 		= 	$userResult->emailid;
			$ip	=	$this->input->ip_address();    
			$confirm	=	$siteurl."/gulden/withdraw_confirm/".$token;	
			$cancel		=	$siteurl."/gulden/withdraw_cancel/".$token;
			/*	GET EMAIL TEMPLATE	START	*/
			$this->db->where('id',6);  	
			$dis_get_email_info = $this->db->get('email_templates')->row();
			$email_from1	=	$dis_get_email_info->from_id;
			$email_subject1	=	$dis_get_email_info->subject;
			$email_content1	=	$dis_get_email_info->message;
			$a	=	array('##USERNAME##'=>$username,'##IP##'=>$ip,'##FROM_EMAIL##'=>$admin_email,'##COMPANYNAME##'=>$companyname,'##AMOUNT##'=>$amount,'##PURSE##'=>$purse,'##CURRENCY##'=>$currency,'##SITEURL##'=>$siteurl,'##ADMIN_EMAIL##'=>$admin_email,'##CONFIRMLINK##'=>$confirm,'##CANCELLINK##'=>$cancel);
			$email_from	=	strtr($email_from1,$a);	
			$email_content	=	strtr($email_content1,$a);  
			$notification = $this->get_email_notification($currency);
			if($notification=='on')
			{
				/*	GET EMAIL TEMPLATE	END	*/ 
				$this->common_mail($admin_email,$companyname,$to,$email_subject1,$email_content);
			}
			else
			{
				return $token; 
			}
			return "success";
		}
		else	
		{
			return "failure";
		}
	/* }
	else
	{
		return "0";
	} */
}

function withdrawlcoinrequestmodel()
{
	$curr = "litecoin"; 
	
	$address 			= 	$this->input->post('ltc_address');
	/* $namecoin_row = $this->fetchWallet($curr);    // fetch bitcoin wallet credentials
	$namecoin_username	=	$namecoin_row->username;
	$namecoin_password	=	$namecoin_row->password;
	$namecoin_portnumber = 	$namecoin_row->portnumber;
	$namecoin 	= new jsonRPCClient("http://$namecoin_username:$namecoin_password@127.0.0.1:$namecoin_portnumber/");
	$isvalid = $namecoin->validateaddress($address);
	if($isvalid['isvalid']==1)
	{ */
		$customer_user_id	=	$this->session->user_id;
		$request_date	=	date('Y-m-d');
		$request_time	=	date("h:i:s");  
		$currency		= 	'LTC';
		$final			= 	$this->input->post('ltc_final');
		$askamount		= 	$this->input->post('ltc_amount');
		$purse 			= 	$this->input->post('ltc_address');
		if($currency=='LTC')
		{
			$buy_rate = $this->lowestaskprice("LTC","USD"); 
			if($buy_rate=="")
			{
				$buy_rate="508.2";
			}
		}

		$amount = $askamount-$final;
			//$account = $this->checkdepositAddress($currency);
		$token = $this->generateRandomString();

		$usd_fee = $buy_rate*$final;
		$high_fee = $this->get_highest_fee();
		if($high_fee<$usd_fee)
		{
			$fee = $high_fee/$buy_rate;
			$amount = $askamount-$fee;
		}
		$data	=	array(                  
			'userId'		=>	$customer_user_id,
			'currency'		=>	$currency,
			'token'			=>	$token,
			'purse'			=>	$purse,
			'amount'		=>	$amount, 
			'payment'		=>	$curr, 
			'askamount'		=>	$askamount,   		
			'request_date'	=>	$request_date,   
			'request_time'	=>	$request_time,   
			'status'		=>	'processing'
			);
		$this->db->insert('coin_withdraw',$data); 
		$insid = $this->db->insert_id();
		if($insid)
		{
			$balance = $this->fetchuserbalancebyId($customer_user_id,'LTC');  // fetch first balance
			$updatefirstBalance = $balance-$askamount;
			
			$updatedata = array('LTC'=>$updatefirstBalance);
			
			$this->db->where('userId',$customer_user_id); 
			$this->db->update('balance',$updatedata);
			$transdata	=	array(                  
				'userId'=>$customer_user_id,
				'type'=>"Withdraw",
				'currency'=>$currency,  
				'token'=>$token,  
				'amount'=>$amount,
				'askamount'=>$askamount,		
				'date'=>$request_date,   
				'time'=>$request_time,   
				'status'=>'active'
				);
			$this->db->insert('transaction_history',$transdata);
			/*		Get Admin Details Start		 */ 
			$this->db->where('id',1);  	
			$query = $this->db->get('site_config');
			if($query->num_rows() == 1)
			{
				$row 			= 	$query->row();
				$admin_email	=	$row->email_id;			 							 
				$companyname	=	$row->company_name;	
				$siteurl		=	$row->siteurl;				
			}
			$userResult = 	$this->get_userdetails($customer_user_id);
			$username 	= 	$userResult->username;
			$to 		= 	$userResult->emailid;
			$ip	=	$this->input->ip_address();    
			$confirm	=	$siteurl."/gulden/withdraw_confirm/".$token;	
			$cancel		=	$siteurl."/gulden/withdraw_cancel/".$token;
			/*	GET EMAIL TEMPLATE	START	*/
			$this->db->where('id',6);  	
			$dis_get_email_info = $this->db->get('email_templates')->row();
			$email_from1	=	$dis_get_email_info->from_id;
			$email_subject1	=	$dis_get_email_info->subject;
			$email_content1	=	$dis_get_email_info->message;
			$a	=	array('##USERNAME##'=>$username,'##IP##'=>$ip,'##FROM_EMAIL##'=>$admin_email,'##COMPANYNAME##'=>$companyname,'##AMOUNT##'=>$amount,'##PURSE##'=>$purse,'##CURRENCY##'=>$currency,'##SITEURL##'=>$siteurl,'##ADMIN_EMAIL##'=>$admin_email,'##CONFIRMLINK##'=>$confirm,'##CANCELLINK##'=>$cancel);
			$email_from	=	strtr($email_from1,$a);	
			$email_content	=	strtr($email_content1,$a);
			$notification = $this->get_email_notification($currency);
			if($notification=='on')
			{
				/*	GET EMAIL TEMPLATE	END	*/ 
				$this->common_mail($admin_email,$companyname,$to,$email_subject1,$email_content);

			}
			else
			{
				return $token; 
			}
			return "success";
		}
		else	
		{
			return "failure";
		}
	/* }
	else
	{
		return "0";
	} */
}


function withdrawlwcncoinrequestmodel()
{
	$curr = "wcn"; 
	
	$address 			= 	$this->input->post('wcn_address');
	/* $namecoin_row = $this->fetchWallet($curr);    // fetch bitcoin wallet credentials
	$namecoin_username	=	$namecoin_row->username;
	$namecoin_password	=	$namecoin_row->password;
	$namecoin_portnumber = 	$namecoin_row->portnumber;
	$namecoin 	= new jsonRPCClient("http://$namecoin_username:$namecoin_password@127.0.0.1:$namecoin_portnumber/");
	$isvalid = $namecoin->validateaddress($address);
	if($isvalid['isvalid']==1)
	{ */
		$customer_user_id	=	$this->session->user_id;
		$request_date	=	date('Y-m-d');
		$request_time	=	date("h:i:s");  
		$currency		= 	'WCN';
		$final			= 	$this->input->post('wcn_final');
		$askamount		= 	$this->input->post('wcn_amount');
		$purse 			= 	$this->input->post('wcn_address');
		if($currency=='WCN')
		{
			$buy_rate = $this->lowestaskprice("WCN","USD"); 
			if($buy_rate=="")
			{
				$buy_rate="508.2";
			}
		}

		$amount = $askamount-$final;
			//$account = $this->checkdepositAddress($currency);
		$token = $this->generateRandomString();

		$usd_fee = $buy_rate*$final;
		$high_fee = $this->get_highest_fee();
		if($high_fee<$usd_fee)
		{
			$fee = $high_fee/$buy_rate;
			$amount = $askamount-$fee;
		}
		$data	=	array(                  
			'userId'		=>	$customer_user_id,
			'currency'		=>	$currency,
			'token'			=>	$token,
			'purse'			=>	$purse,
			'amount'		=>	$amount, 
			'payment'		=>	$curr, 
			'askamount'		=>	$askamount,   		
			'request_date'	=>	$request_date,   
			'request_time'	=>	$request_time,   
			'status'		=>	'processing'
			);
		$this->db->insert('coin_withdraw',$data); 
		$insid = $this->db->insert_id();
		if($insid)
		{
			$balance = $this->fetchuserbalancebyId($customer_user_id,'WCN');  // fetch first balance
			$updatefirstBalance = $balance-$askamount;
			
			$updatedata = array('WCN'=>$updatefirstBalance);
			
			$this->db->where('userId',$customer_user_id); 
			$this->db->update('balance',$updatedata);
			$transdata	=	array(                  
				'userId'=>$customer_user_id,
				'type'=>"Withdraw",
				'currency'=>$currency,  
				'token'=>$token,  
				'amount'=>$amount,
				'askamount'=>$askamount,		
				'date'=>$request_date,   
				'time'=>$request_time,   
				'status'=>'active'
				);
			$this->db->insert('transaction_history',$transdata);
			/*		Get Admin Details Start		 */ 
			$this->db->where('id',1);  	
			$query = $this->db->get('site_config');
			if($query->num_rows() == 1)
			{
				$row 			= 	$query->row();
				$admin_email	=	$row->email_id;			 							 
				$companyname	=	$row->company_name;	
				$siteurl		=	$row->siteurl;				
			}
			$userResult = 	$this->get_userdetails($customer_user_id);
			$username 	= 	$userResult->username;
			$to 		= 	$userResult->emailid;
			$ip	=	$this->input->ip_address();    
			$confirm	=	$siteurl."/gulden/withdraw_confirm/".$token;	
			$cancel		=	$siteurl."/gulden/withdraw_cancel/".$token;
			/*	GET EMAIL TEMPLATE	START	*/
			$this->db->where('id',6);  	
			$dis_get_email_info = $this->db->get('email_templates')->row();
			$email_from1	=	$dis_get_email_info->from_id;
			$email_subject1	=	$dis_get_email_info->subject;
			$email_content1	=	$dis_get_email_info->message;
			$a	=	array('##USERNAME##'=>$username,'##IP##'=>$ip,'##FROM_EMAIL##'=>$admin_email,'##COMPANYNAME##'=>$companyname,'##AMOUNT##'=>$amount,'##PURSE##'=>$purse,'##CURRENCY##'=>$currency,'##SITEURL##'=>$siteurl,'##ADMIN_EMAIL##'=>$admin_email,'##CONFIRMLINK##'=>$confirm,'##CANCELLINK##'=>$cancel);
			$email_from	=	strtr($email_from1,$a);	
			$email_content	=	strtr($email_content1,$a);
			$notification = $this->get_email_notification($currency);
			if($notification=='on')
			{
				/*	GET EMAIL TEMPLATE	END	*/ 
				$this->common_mail($admin_email,$companyname,$to,$email_subject1,$email_content);

			}
			else
			{
				return $token; 
			}
			return "success";
		}
		else	
		{
			return "failure";
		}
	/* }
	else
	{
		return "0";
	} */
}
function withdrawlhitcoinrequestmodel()
{
	$curr = "hit"; 
	
	$address 			= 	$this->input->post('hit_address');

	$customer_user_id	=	$this->session->user_id;
	$request_date	=	date('Y-m-d');
	$request_time	=	date("h:i:s");  
	$currency		= 	'HIT';
	$final			= 	$this->input->post('hit_final');
	$askamount		= 	$this->input->post('hit_amount');
	$purse 			= 	$this->input->post('hit_address');
	if($currency=='HIT')
	{
		$buy_rate = $this->lowestaskprice("HIT","USD"); 
		if($buy_rate=="")
		{
			$buy_rate="508.2";
		}
	}

	$amount = $askamount-$final;
			//$account = $this->checkdepositAddress($currency);
	$token = $this->generateRandomString();

	$usd_fee = $buy_rate*$final;
	$high_fee = $this->get_highest_fee();
	if($high_fee<$usd_fee)
	{
		$fee = $high_fee/$buy_rate;
		$amount = $askamount-$fee;
	}
	$data	=	array(                  
		'userId'		=>	$customer_user_id,
		'currency'		=>	$currency,
		'token'			=>	$token,
		'purse'			=>	$purse,
		'amount'		=>	$amount, 
		'payment'		=>	$curr, 
		'askamount'		=>	$askamount,   		
		'request_date'	=>	$request_date,   
		'request_time'	=>	$request_time,   
		'status'		=>	'processing'
		);
	$this->db->insert('coin_withdraw',$data); 
	$insid = $this->db->insert_id();
	if($insid)
	{
			$balance = $this->fetchuserbalancebyId($customer_user_id,'HIT');  // fetch first balance
			$updatefirstBalance = $balance-$askamount;
			
			$updatedata = array('HIT'=>$updatefirstBalance);
			
			$this->db->where('userId',$customer_user_id); 
			$this->db->update('balance',$updatedata);
			$transdata	=	array(                  
				'userId'=>$customer_user_id,
				'type'=>"Withdraw",
				'currency'=>$currency,  
				'token'=>$token,  
				'amount'=>$amount,
				'askamount'=>$askamount,		
				'date'=>$request_date,   
				'time'=>$request_time,   
				'status'=>'active'
				);
			$this->db->insert('transaction_history',$transdata);
			/*		Get Admin Details Start		 */ 
			$this->db->where('id',1);  	
			$query = $this->db->get('site_config');
			if($query->num_rows() == 1)
			{
				$row 			= 	$query->row();
				$admin_email	=	$row->email_id;			 							 
				$companyname	=	$row->company_name;	
				$siteurl		=	$row->siteurl;				
			}
			$userResult = 	$this->get_userdetails($customer_user_id);
			$username 	= 	$userResult->username;
			$to 		= 	$userResult->emailid;
			$ip	=	$this->input->ip_address();    
			$confirm	=	$siteurl."/gulden/withdraw_confirm/".$token;	
			$cancel		=	$siteurl."/gulden/withdraw_cancel/".$token;
			/*	GET EMAIL TEMPLATE	START	*/
			$this->db->where('id',6);  	
			$dis_get_email_info = $this->db->get('email_templates')->row();
			$email_from1	=	$dis_get_email_info->from_id;
			$email_subject1	=	$dis_get_email_info->subject;
			$email_content1	=	$dis_get_email_info->message;
			$a	=	array('##USERNAME##'=>$username,'##IP##'=>$ip,'##FROM_EMAIL##'=>$admin_email,'##COMPANYNAME##'=>$companyname,'##AMOUNT##'=>$amount,'##PURSE##'=>$purse,'##CURRENCY##'=>$currency,'##SITEURL##'=>$siteurl,'##ADMIN_EMAIL##'=>$admin_email,'##CONFIRMLINK##'=>$confirm,'##CANCELLINK##'=>$cancel);
			$email_from	=	strtr($email_from1,$a);	
			$email_content	=	strtr($email_content1,$a);
			$notification = $this->get_email_notification($currency);
			if($notification=='on')
			{
				/*	GET EMAIL TEMPLATE	END	*/ 
				$this->common_mail($admin_email,$companyname,$to,$email_subject1,$email_content);

			}
			else
			{
				return $token; 
			}
			return "success";
		}
		else	
		{
			return "failure";
		}
	/* }
	else
	{
		return "0";
	} */
}
function withdrawecoinrequestmodel()
{
	$curr = "nlgcoin"; 
	
	$address 			= 	$this->input->post('nlg_address');
	/* $namecoin_row = $this->fetchWallet($curr);    // fetch bitcoin wallet credentials
	$namecoin_username	=	$namecoin_row->username;
	$namecoin_password	=	$namecoin_row->password;
	$namecoin_portnumber = 	$namecoin_row->portnumber;
	$namecoin 	= new jsonRPCClient("http://$namecoin_username:$namecoin_password@127.0.0.1:$namecoin_portnumber/");
	$isvalid = $namecoin->validateaddress($address);
	if($isvalid['isvalid']==1)
	{ */
		$customer_user_id	=	$this->session->user_id;
		$request_date	=	date('Y-m-d');
		$request_time	=	date("h:i:s");  
		$currency		= 	'NLG';
		$final			= 	$this->input->post('nlg_fin');
		$askamount		= 	$this->input->post('nlg_amount');
		$purse 			= 	$this->input->post('nlg_address');
		if($currency=='NLG')
		{	 
			$buy_rate = $this->lowestaskprice("EUR","NLG"); 
			if($buy_rate=="")
			{
				$buy_rate="100";
			}
		}

		$amount = $askamount-$final;
			//$account = $this->checkdepositAddress($currency);
		$token = $this->generateRandomString();

		$usd_fee = $buy_rate*$final;
		$high_fee = $this->get_highest_fee();
		if($high_fee<$usd_fee)
		{
			$fee = $high_fee/$buy_rate;
			$amount = $askamount-$fee;
		}
		$data	=	array(                  
			'userId'		=>	$customer_user_id,
			'currency'		=>	$currency,
			'token'			=>	$token,
			'purse'			=>	$purse,
			'amount'		=>	$amount, 
			'payment'		=>	$curr, 
			'askamount'		=>	$askamount,   		
			'request_date'	=>	$request_date,   
			'request_time'	=>	$request_time,   
			'status'		=>	'processing'
			);
		$this->db->insert('coin_withdraw',$data); 
		$insid = $this->db->insert_id();
		if($insid)
		{
			$balance = $this->fetchuserbalancebyId($customer_user_id,'NLG');  // fetch first balance
			$updatefirstBalance = $balance-$askamount;
			
			$updatedata = array('NLG'=>$updatefirstBalance);
			
			$this->db->where('userId',$customer_user_id); 
			$this->db->update('balance',$updatedata);
			$transdata	=	array(                  
				'userId'=>$customer_user_id,
				'type'=>"Withdraw",
				'currency'=>$currency,  
				'token'=>$token,  
				'amount'=>$amount,
				'askamount'=>$askamount,		
				'date'=>$request_date,   
				'time'=>$request_time,   
				'status'=>'active'
				);
			$this->db->insert('transaction_history',$transdata);
			/*		Get Admin Details Start		 */ 
			$this->db->where('id',1);  	
			$query = $this->db->get('site_config');
			if($query->num_rows() == 1)
			{
				$row 			= 	$query->row();
				$admin_email	=	$row->email_id;			 							 
				$companyname	=	$row->company_name;	
				$siteurl		=	$row->siteurl;				
			}
			$userResult = 	$this->get_userdetails($customer_user_id);
			$username 	= 	$userResult->username;
			$to 		= 	$userResult->emailid;
			$ip	=	$this->input->ip_address();    
			$confirm	=	$siteurl."/gulden/withdraw_confirm/".$token;	
			$cancel		=	$siteurl."/gulden/withdraw_cancel/".$token;
			/*	GET EMAIL TEMPLATE	START	*/
			$this->db->where('id',6);  	
			$dis_get_email_info = $this->db->get('email_templates')->row();
			$email_from1	=	$dis_get_email_info->from_id;
			$email_subject1	=	$dis_get_email_info->subject;
			$email_content1	=	$dis_get_email_info->message;
			$a	=	array('##USERNAME##'=>$username,'##IP##'=>$ip,'##FROM_EMAIL##'=>$admin_email,'##COMPANYNAME##'=>$companyname,'##AMOUNT##'=>$amount,'##PURSE##'=>$purse,'##CURRENCY##'=>$currency,'##SITEURL##'=>$siteurl,'##ADMIN_EMAIL##'=>$admin_email,'##CONFIRMLINK##'=>$confirm,'##CANCELLINK##'=>$cancel);
			$email_from	=	strtr($email_from1,$a);	
			$email_content	=	strtr($email_content1,$a);
			$notification = $this->get_email_notification($currency);
			if($notification=='on')
			{
				/*	GET EMAIL TEMPLATE	END	*/ 
				$this->common_mail($admin_email,$companyname,$to,$email_subject1,$email_content);

			}
			else
			{
				return $token; 
			}
			return "success";
		}
		else	
		{
			return "failure";
		}
	/* }
	else
	{
		return "0";
	} */
}

function get_email_notification($cur)
{
	$customer_user_id	=	$this->session->user_id;
	$this->db->where('user_id',$customer_user_id);
	$query = $this->db->get('email_confirmation');
	if($query->num_rows())
	{
		$row = $query->row();
		if($cur=='BTC')
		{
			return $row->bitcoin_email;
		}
		else if($cur=='USD')
		{
			
			return $row->bank_email;
		}
		else
		{
			return $row->ripple_email;
		}
	}
}
function updateEcancellation($token,$Userid,$currency,$askamount,$orderid,$payment)
{	
	$data = array('status'=>"cancelled");
	$this->db->where('token',$token);  
	$query	= $this->db->update('withdraw_request',$data); 
	
	$this->db->where('withdraw_id',$orderid);  
	$query	= $this->db->update('international_withdraw',$data); 

	if($query)
	{  
		$balance = $this->fetchuserbalancebyId($Userid,$currency);  // fetch first balance
		$updatefirstBalance = $balance+$askamount;
		if($currency==$currency)
		{
			$updatedata = array($currency=>$updatefirstBalance);
		}
		$this->db->where('userId',$Userid); 
		$this->db->update('balance',$updatedata);
		return true;	
	}   
	else
	{      
		return false;		
	}
}
function updateEconfirmation($token)
{	
	$data = array('status'=>"pending");
	$this->db->where('token',$token);  
	$query	= $this->db->update('withdraw_request',$data); 
	if($query)
	{   
		$data_ib = array('status'=>"pending");
		$this->db->where('token',$token);  
		$query = $this->db->get('withdraw_request');             
		if($query->num_rows())
		{
			$row = $query->row();
			$orderid = $row->orderid;
			$this->db->where('withdraw_id',$orderid);
			$this->db->update('international_withdraw',$data_ib);
		}
		return true;	
	}   
	else
	{      
		return false;		
	}
}
function checkEconfirmation($token)
{
	$this->db->where('token',$token);  
	$query	=	$this->db->get('withdraw_request'); 
	if($query->num_rows() >= 1)
	{                
		return $row = $query->row();	
	}   
	else
	{      
		return false;		
	}
}
function withdrawrequestmodel()
{
	$customer_user_id	=	$this->session->user_id; 
	$request_date=date('Y-m-d');
	$request_time=date("h:i:s");  
	$num 	= $this->input->post('num');
	if($num=='1')
	{
		$paymentname	=	"Paypal";
	}
	else
	{
		$paymentname	=	"Moneypolo";
	}
	$currency	= $this->input->post('currency');
	//$amount		= $this->input->post('final');
	$amount	= $this->input->post('sum');
	$purse 	= $this->input->post('paypal_account');
	//$Accountid 	= $this->input->post('Acc_id');
	//$card_num 	= $this->input->post('card_num');
	//$purse 	= $this->input->post('purse');
	$paypal_fee = $this->get_paypalwith_fee();
	$paypal_tot_fee = $amount*$paypal_fee/100;
	$highest_dep_fee = $this->higest_deposit_fee();
	if($highest_dep_fee >= $paypal_tot_fee  || $highest_dep_fee==0)
	{
		$updatebal = $amount-$paypal_tot_fee;
	}
	else
	{
		$updatebal = $amount-$highest_dep_fee;
	}


	$token = $this->generateRandomString();
	$data	=	array(                  
		'user_id'=>$customer_user_id,
		'payment'=>$paymentname,
		'currency'=>$currency,
		'token'=>$token,
		'purse'=>$purse,
		'amount'=>$updatebal,   
		'askamount'=>$amount,   
		'request_date'=>$request_date,   
		'request_time'=>$request_time,   
		'status'=>'processing'
		);
	$this->db->insert('withdraw_request',$data);
	$insid = $this->db->insert_id();    
	if($insid)
	{
		$balance = $this->fetchuserbalancebyId($customer_user_id,$currency);  // fetch first balance
		$updatefirstBalance = $balance-$amount;
		if($currency=="USD")
		{
			$updatedata = array('USD'=>$updatefirstBalance);
		}
		$this->db->where('userId',$customer_user_id); 
		$this->db->update('balance',$updatedata);
		$transdata	=	array(                  
			'userId'=>$customer_user_id,
			'type'=>"Withdraw",
			'currency'=>$currency,  
			'token'=>$token,  
			'amount'=>$amount,
		//'askamount'=>$askamount,
			'date'=>$request_date,   
			'time'=>$request_time,   
			'status'=>'active'
			);
		$this->db->insert('transaction_history',$transdata);
		$purse_detail = $purse." (".$paymentname.")";    // get payment name
		/*		Get Admin Details Start		 */ 
		$this->db->where('id',1);  	
		$query = $this->db->get('site_config');
		if($query->num_rows() == 1)
		{
			$row 			= 	$query->row();
			$admin_email	=	$row->email_id;			 							 
			$companyname	=	$row->company_name;	
			$siteurl		=	$row->siteurl;				
		}
		$userResult = 	$this->get_userdetails($customer_user_id);
		$username 	= 	$userResult->username;
		$to 		= 	$userResult->emailid;
	//$to 		= 	"avsarma91@gmail.com";
		$ip			=	$this->input->ip_address();    
		$confirm	=	$siteurl."/gulden/ewithdraw_confirm/".$token;
		$cancel		=	$siteurl."/gulden/ewithdraw_cancel/".$token;
		/*	GET EMAIL TEMPLATE	START	*/
		$this->db->where('id',6);  	
		$dis_get_email_info = $this->db->get('email_templates')->row();
		$email_from1	=	$dis_get_email_info->from_id;
		$email_subject1	=	$dis_get_email_info->subject;
		$email_content1	=	$dis_get_email_info->message;
		$a	=	array('##USERNAME##'=>$username,'##IP##'=>$ip,'##FROM_EMAIL##'=>$admin_email,'##COMPANYNAME##'=>$companyname,'##AMOUNT##'=>$amount,'##PURSE##'=>$purse_detail,'##CURRENCY##'=>$currency,'##SITEURL##'=>$siteurl,'##ADMIN_EMAIL##'=>$admin_email,'##CONFIRMLINK##'=>$confirm,'##CANCELLINK##'=>$cancel);
		$email_from	=	strtr($email_from1,$a);	
		$email_content	=	strtr($email_content1,$a);
		/*	GET EMAIL TEMPLATE	END	*/
		$this->common_mail($admin_email,$companyname,$to,$email_subject1,$email_content); 
		return "success";
	}
	else
	{
		return "failure";
	}
}

function generateaccountno($length = 12)
{

	$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$randomString = '';
	for ($i = 0; $i < $length; $i++)
	{
		$randomString .= $characters[rand(0, strlen($characters) - 1)];
	}
	return $randomString;
}

function generateRandomString($length = 50) {
	$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$randomString = '';
	for ($i = 0; $i < $length; $i++) {
		$randomString .= $characters[rand(0, strlen($characters) - 1)];
	}
	return $randomString;
}
function generateredeemString($length = 8) {
	$characters = '0123456789';
	$randomString = '';
	for ($i = 0; $i < $length; $i++) {
		$randomString .= $characters[rand(0, strlen($characters) - 1)];
	}
	return $randomString;
}
function generatepassword($length = 8) {
	$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$randomString = '';
	for ($i = 0; $i < $length; $i++) {
		$randomString .= $characters[rand(0, strlen($characters) - 1)];
	}
	return $randomString;
}
function generatepaypalString($length = 17) {
	$characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	$randomString = '';
	for ($i = 0; $i < $length; $i++) {
		$randomString .= $characters[rand(0, strlen($characters) - 1)];
	}
	return $randomString;
}
function generatesecretString($length = 64) {
	$characters = '0123456789abcdefghijklmnopqrstuvwxyz';
	$randomString = '';
	for ($i = 0; $i < $length; $i++) {
		$randomString .= $characters[rand(0, strlen($characters) - 1)];
	}
	return $randomString;
}
function redeemrequestmodel()
{
	$customer_user_id	=	$this->session->user_id;
	$request_date	=	date('Y-m-d');
	$request_time	=	date("h:i:s");  
	$currency		= 	$this->input->post('currency');
	$amount			= 	$this->input->post('final');
	$purse 			= 	$this->input->post('address');
	$account 		= $this->checkdepositAddress($currency);
	$token = $this->generateRandomString();
	$data	=	array(                  
		'userId'=>$customer_user_id,
		'account'=>$account,
		'currency'=>$currency,
		'purse'=>$purse,
		'amount'=>$amount,   
		'token'=>$token,   
		'request_date'=>$request_date,   
		'request_time'=>$request_time,   
		'status'=>'redeemcode'
		);
	$this->db->insert('coin_withdraw',$data); 
	$insid = $this->db->insert_id();
	if($insid)
	{
		$balance = $this->fetchuserbalancebyId($customer_user_id,$currency);  // fetch first balance
		$updatefirstBalance = $balance-$amount;
		if($currency=="BTC")
		{
			$updatedata = array('BTC'=>$updatefirstBalance);
		}
		else if($currency=="LTC")
		{
			$updatedata = array('LTC'=>$updatefirstBalance);
		}
		else if($currency=="NMC")
		{
			$updatedata = array('NMC'=>$updatefirstBalance);
		}
		else if($currency=="WDC")
		{
			$updatedata = array('WDC'=>$updatefirstBalance);
		}
		else
		{
			$updatedata = array('DOGE'=>$updatefirstBalance);
		}
		$this->db->where('userId',$customer_user_id); 
		$this->db->update('balance',$updatedata);
		$transdata	=	array(                  
			'userId'=>$customer_user_id,
			'type'=>"Redeem",
			'token'=>$token,   
			'date'=>$request_date,   
			'time'=>$request_time,   
			'redeemstatus'=>'redeemcode',
			'status'=>'active'
			);
		$this->db->insert('transaction_history',$transdata);
		/*		Get Admin Details Start		 */ 
		$this->db->where('id',1);  	
		$query = $this->db->get('site_config');
		if($query->num_rows() == 1)
		{
			$row 			= 	$query->row();
			$admin_email	=	$row->email_id;			 							 
			$companyname	=	$row->company_name;	
			$siteurl		=	$row->siteurl;				
		}
		$userResult = 	$this->get_userdetails($customer_user_id);
		$username 	= 	$userResult->username;
		$to 		= 	$userResult->emailid;
	//$to 		= 	"rameshnstr@gmail.com";
		$ip	=	$this->input->ip_address();    
		$confirm	=	"http://webuypearlet.osiztechnologies.com/redeem_confirm/".$token;
		$cancel		=	"http://webuypearlet.osiztechnologies.com/redeem_cancel/".$token;
		/*	GET EMAIL TEMPLATE	START	*/
		$this->db->where('id',7);  	
		$dis_get_email_info = $this->db->get('email_templates')->row();
		$email_from1	=	$dis_get_email_info->from_id;
		$email_subject1	=	$dis_get_email_info->subject;
		$email_content1	=	$dis_get_email_info->message;
		$a	=	array('##USERNAME##'=>$username,'##IP##'=>$ip,'##FROM_EMAIL##'=>$admin_email,'##COMPANYNAME##'=>$companyname,'##AMOUNT##'=>$amount,'##CURRENCY##'=>$currency,'##SITEURL##'=>$siteurl,'##ADMIN_EMAIL##'=>$admin_email,'##CONFIRMLINK##'=>$confirm,'##CANCELLINK##'=>$cancel);
		$email_from	=	strtr($email_from1,$a);	
		$email_content	=	strtr($email_content1,$a);
		/*	GET EMAIL TEMPLATE	END	*/
		$this->common_mail($admin_email,$companyname,$to,$email_subject1,$email_content);  
		return "success";
	}
	else
	{
		return "failure";
	}
}
function withdrawforbtkcode()      // Redeem for E-Currency 
{
	$customer_user_id	=	$this->session->user_id; 
	$request_date=date('Y-m-d');
	$request_time=date("h:i:s");  
	$num 	= $this->input->post('num');
	if($num=='1')
	{
		$paymentname	=	"Perfect Money";
	}
	else if($num=='2')
	{
		$paymentname	=	"Okpay";
	}
	else if($num=='3')
	{
		$paymentname	=	"Paypal";
	}
	else if($num=='4')
	{
		$paymentname	=	"BTK-E Code";
	}
	else
	{
		$paymentname	=	"Wire Transfer";
	}
	$currency	= $this->input->post('currency');
	$amount		= $this->input->post('final');
	$token	 	= $this->generateRandomString();
	$data		=	array(                  
		'userId'=>$customer_user_id,
		'paymentname'=>$paymentname,
		'currency'=>$currency,
		'token'=>$token,
		'amount'=>$amount,   
		'request_date'=>$request_date,   
		'request_time'=>$request_time,   
		'status'=>'redeemcode'
		);
	$this->db->insert('coin_withdraw',$data);   
	$insid = $this->db->insert_id();
	if($insid)
	{
		$balance = $this->fetchuserbalancebyId($customer_user_id,$currency);  // fetch first balance
		$updatefirstBalance = $balance-$amount;
		if($currency=="USD")
		{
			$updatedata = array('USD'=>$updatefirstBalance);
		}
		else if($currency=="EUR")
		{
			$updatedata = array('EUR'=>$updatefirstBalance);
		}
		else
		{
			$updatedata = array('RUR'=>$updatefirstBalance);
		}
		$this->db->where('userId',$customer_user_id); 
		$this->db->update('balance',$updatedata);
		$transdata	=	array(                  
			'userId'=>$customer_user_id,
			'type'=>"Redeem",
			'token'=>$token,   
			'date'=>$request_date,   
			'time'=>$request_time, 
			'redeemstatus'=>'redeemcode',
			'status'=>'active'
			);
		$this->db->insert('transaction_history',$transdata);
		/*		Get Admin Details Start		 */ 
		$this->db->where('id',1);  	
		$query = $this->db->get('site_config');
		if($query->num_rows() == 1)
		{
			$row 			= 	$query->row();
			$admin_email	=	$row->email_id;			 							 
			$companyname	=	$row->company_name;	
			$siteurl		=	$row->siteurl;				
		}
		$userResult = 	$this->get_userdetails($customer_user_id);
		$username 	= 	$userResult->username;
		$to 		= 	$userResult->emailid;
	//$to 		= 	"rameshnstr@gmail.com";
		$ip	=	$this->input->ip_address();    
		$confirm	=	"http://webuypearlet.osiztechnologies.com/redeem_confirm/".$token;
		$cancel		=	"http://webuypearlet.osiztechnologies.com/redeem_cancel/".$token;
		/*	GET EMAIL TEMPLATE	START	*/
		$this->db->where('id',7);  	
		$dis_get_email_info = $this->db->get('email_templates')->row();
		$email_from1	=	$dis_get_email_info->from_id;
		$email_subject1	=	$dis_get_email_info->subject;
		$email_content1	=	$dis_get_email_info->message;
		$a	=	array('##USERNAME##'=>$username,'##IP##'=>$ip,'##FROM_EMAIL##'=>$admin_email,'##COMPANYNAME##'=>$companyname,'##AMOUNT##'=>$amount,'##CURRENCY##'=>$currency,'##SITEURL##'=>$siteurl,'##ADMIN_EMAIL##'=>$admin_email,'##CONFIRMLINK##'=>$confirm,'##CANCELLINK##'=>$cancel);
		$email_from	=	strtr($email_from1,$a);	
		$email_content	=	strtr($email_content1,$a);
		/*	GET EMAIL TEMPLATE	END	*/
		$view_smtp_hostname	=$this->getsmtp_hostname;    
		$view_smtp_hostusername	=$this->getsmtp_hostusername;  
		$view_smtp_hostpass	=$this->getsmtp_hostpass; 
		$config['protocol'] = 'smtp'; // mail, sendmail, or smtp    The mail sending protocol.
		$config['smtp_host'] =$view_smtp_hostname; // SMTP Server Address.
		$config['smtp_user'] =$view_smtp_hostusername; // SMTP Username.
		$config['smtp_pass'] =$view_smtp_hostpass; // SMTP Password.
		$config['smtp_port'] = '25'; // SMTP Port.
		$config['smtp_timeout'] = '5'; // SMTP Timeout (in seconds).
		$config['wordwrap'] = TRUE; // TRUE or FALSE (boolean)    Enable word-wrap.
		$config['wrapchars'] = 76; // Character count to wrap at.
		$config['mailtype'] = 'html'; // text or html Type of mail. If you send HTML email you must send it as a complete web page. Make sure you don't have any relative links or relative image              paths otherwise they will not work.
		$config['charset'] = 'utf-8'; // Character set (utf-8, iso-8859-1, etc.).
		$config['validate'] = FALSE; // TRUE or FALSE (boolean)    Whether to validate the email address.
		$config['priority'] = 3; // 1, 2, 3, 4, 5    Email Priority. 1 = highest. 5 = lowest. 3 = normal.
		$config['crlf'] = "\r\n"; // "\r\n" or "\n" or "\r" Newline character. (Use "\r\n" to comply with RFC 822).
		$config['newline'] = "\r\n"; // "\r\n" or "\n" or "\r"    Newline character. (Use "\r\n" to comply with RFC 822).  
		$config['bcc_batch_mode'] = FALSE; // TRUE or FALSE (boolean)    Enable BCC Batch Mode.
		$config['bcc_batch_size']=200; // Number of emails in each BCC batch.	
		$this->email->initialize($config);
		$this->email->from($admin_email);
		$this->email->to($to);
		$this->email->subject($email_subject1);
		$this->email->message($email_content);
		$this->email->send();
		return "success";
	}
	else
	{
		return "failure";
	}
}
function cancelRedeem($token)
{
	$customer_user_id	=	$this->session->user_id;
	$this->db->where('token',$token);  
	$query	=	$this->db->update('coin_withdraw',array('status'=>'cancelled'));  // update status 
	if($query)
	{ 
		$this->db->where('token',$token);  
		$this->db->update('transaction_history',array('redeemstatus'=>'cancelled'));  // update status to TH
		$row = $this->checkredeemToken($token);
		$currency 	= $row->currency;		
		$amount 	= $row->amount;		
		$balance = $this->fetchuserbalancebyId($customer_user_id,$currency);  // fetch first balance
		$updatefirstBalance = $balance+$amount;
		if($currency=="BTC")
		{
			$updatedata = array('BTC'=>$updatefirstBalance);
		}
		else if($currency=="LTC")
		{
			$updatedata = array('LTC'=>$updatefirstBalance);
		}
		else if($currency=="NMC")
		{
			$updatedata = array('NMC'=>$updatefirstBalance);
		}
		else if($currency=="WDC")
		{
			$updatedata = array('WDC'=>$updatefirstBalance);
		}
		else if($currency=="DOGE")
		{
			$updatedata = array('DOGE'=>$updatefirstBalance);
		}
		$this->db->where('userId',$customer_user_id); 
		$this->db->update('balance',$updatedata);
		return true;
	}   
	else
	{      
		return false;		
	}
}
function resendRedeem($token)
{
	$customer_user_id	=	$this->session->user_id;
	$this->db->where('token',$token);  
	$query	=	$this->db->get('coin_withdraw'); 
	if($query->num_rows() >= 1)
	{                
		$taken = $query->row();
		$amount 	= $taken->amount;
		$currency 	= $taken->currency;
		/*		Get Admin Details Start		 */ 
		$this->db->where('id',1);  	
		$query = $this->db->get('site_config');
		if($query->num_rows() == 1)
		{
			$row 			= 	$query->row();
			$admin_email	=	$row->email_id;			 							 
			$companyname	=	$row->company_name;	
			$siteurl		=	$row->siteurl;				
		}
		$userResult = 	$this->get_userdetails($customer_user_id);
		$username 	= 	$userResult->username;
			//$to 		= 	$userResult->emailid;
		$ip	=	$this->input->ip_address();    
		$confirm	=	"http://webuypearlet.osiztechnologies.com/redeem_confirm/".$token;
		$cancel		=	"http://webuypearlet.osiztechnologies.com/redeem_cancel/".$token;
		/*	GET EMAIL TEMPLATE	START	*/
		$this->db->where('id',7);  	
		$dis_get_email_info = $this->db->get('email_templates')->row();
		$email_from1	=	$dis_get_email_info->from_id;
		$email_subject1	=	$dis_get_email_info->subject;
		$email_content1	=	$dis_get_email_info->message;
		$a	=	array('##USERNAME##'=>$username,'##IP##'=>$ip,'##FROM_EMAIL##'=>$admin_email,'##COMPANYNAME##'=>$companyname,'##AMOUNT##'=>$amount,'##CURRENCY##'=>$currency,'##SITEURL##'=>$siteurl,'##ADMIN_EMAIL##'=>$admin_email,'##CONFIRMLINK##'=>$confirm,'##CANCELLINK##'=>$cancel);
		$email_from	=	strtr($email_from1,$a);	
		$email_content	=	strtr($email_content1,$a);
				/*	GET EMAIL TEMPLATE	END	
				$view_smtp_hostname	=$this->getsmtp_hostname;    
				$view_smtp_hostusername	=$this->getsmtp_hostusername;  
				$view_smtp_hostpass	=$this->getsmtp_hostpass; 
				$config['protocol'] = 'smtp'; // mail, sendmail, or smtp    The mail sending protocol.
				$config['smtp_host'] =$view_smtp_hostname; // SMTP Server Address.
				$config['smtp_user'] =$view_smtp_hostusername; // SMTP Username.
				$config['smtp_pass'] =$view_smtp_hostpass; // SMTP Password.
				$config['smtp_port'] = '25'; // SMTP Port.
				$config['smtp_timeout'] = '5'; // SMTP Timeout (in seconds).
				$config['wordwrap'] = TRUE; // TRUE or FALSE (boolean)    Enable word-wrap.
				$config['wrapchars'] = 76; // Character count to wrap at.
				$config['mailtype'] = 'html'; // text or html Type of mail. If you send HTML email you must send it as a complete web page. Make sure you don't have any relative links or relative image              paths otherwise they will not work.
				$config['charset'] = 'utf-8'; // Character set (utf-8, iso-8859-1, etc.).
				$config['validate'] = FALSE; // TRUE or FALSE (boolean)    Whether to validate the email address.
				$config['priority'] = 3; // 1, 2, 3, 4, 5    Email Priority. 1 = highest. 5 = lowest. 3 = normal.
				$config['crlf'] = "\r\n"; // "\r\n" or "\n" or "\r" Newline character. (Use "\r\n" to comply with RFC 822).
				$config['newline'] = "\r\n"; // "\r\n" or "\n" or "\r"    Newline character. (Use "\r\n" to comply with RFC 822).  
				$config['bcc_batch_mode'] = FALSE; // TRUE or FALSE (boolean)    Enable BCC Batch Mode.
				$config['bcc_batch_size']=200; // Number of emails in each BCC batch.	
				$this->email->initialize($config);*/
				$this->common_mail($admin_email,$companyname,$to,$email_subject1,$email_content);  
				return "success";
			}   
			else
			{      
				return false;		
			}
		}
		function checkredeemToken($token)
		{
			$this->db->where('token',$token);  
			$query	=	$this->db->get('coin_withdraw'); 
			if($query->num_rows() >= 1)
			{                
				return $row = $query->row();
			}   
			else
			{      
				return false;		
			}
		}
		function checkredeemCode($code)
		{
			$this->db->where('code',$code);  
			$query	=	$this->db->get('coin_withdraw'); 
			if($query->num_rows() >= 1)
			{                
				return $row = $query->row();
			}   
			else
			{      
				return false;		
			}
		}
		function updateRedeemcode($code,$token)
		{
			$data = array(	'code'=>$code,
				'codestatus'=>'unused',
				'status'=>"sentcode");
			$this->db->where('token',$token);  
			$query	=	$this->db->update('coin_withdraw',$data); 
			if($query)
			{                
				$update = array('redeemcode'=>$code,
					'redeemstatus'=>"sentcode");
				$this->db->where('token',$token);  
				$this->db->update('transaction_history',$update); 
				return true;
			}   
			else
			{      
				return false;		
			}
		}
		function makeredeemfun($btkcode)
		{
			$request_date=date('Y-m-d');
			$request_time=date("h:i:s");	
			$customer_user_id	=	$this->session->user_id;
			$this->db->where('code',$btkcode); 
			$this->db->where('codestatus','unused');   
			$query	=	$this->db->get('coin_withdraw'); 
			if($query->num_rows() >= 1)
			{           
				$updata = array('status'=>"redeemed",
					'codestatus'=>"used");     
				$this->db->where('code',$btkcode);  
		$this->db->update('coin_withdraw',$updata); // update status
		$row = $this->checkredeemCode($btkcode);
		$currency 	= $row->currency;		
		$token 		= $row->token;		
		$amount 	= $row->amount;		
		$balance = $this->fetchuserbalancebyId($customer_user_id,$currency);  // fetch first balance
		$updatefirstBalance = $balance+$amount;
		if($currency=="BTC")
		{
			$updatedata = array('BTC'=>$updatefirstBalance);
		}
		else if($currency=="LTC")
		{
			$updatedata = array('LTC'=>$updatefirstBalance);
		}
		else if($currency=="NMC")
		{
			$updatedata = array('NMC'=>$updatefirstBalance);
		}
		else if($currency=="WDC")
		{
			$updatedata = array('WDC'=>$updatefirstBalance);
		}
		else if($currency=="DOGE")
		{
			$updatedata = array('DOGE'=>$updatefirstBalance);
		}
		$this->db->where('userId',$customer_user_id); 
		$this->db->update('balance',$updatedata);
		$transdata	=	array(                  
			'userId'=>$customer_user_id,
			'type'=>"Redeem",
			'token'=>$token,   
			'date'=>$request_date,   
			'time'=>$request_time, 
			'redeemstatus'=>"redeemed",	
			'status'=>'active'
			);
		$this->db->insert('transaction_history',$transdata);
		return "success";
	}   
	else
	{      
		return "failure";	
	}
}
function withdraw_confirmmodel($token)
{
	$this->db->where('token',$token);  
	$query	=	$this->db->get('coin_withdraw'); 
	if($query->num_rows() >= 1)
	{                
		return $row = $query->row();	
	}   
	else
	{      
		return false;		
	}
}
function checkconfirmation($token)
{
	$this->db->where('token',$token);  
	$query	=	$this->db->get('coin_withdraw'); 
	if($query->num_rows() >= 1)
	{                
		return $row = $query->row();	
	}   
	else
	{      
		return false;		
	}
}
function updateconfirmation($token)
{	
	$data = array('status'=>"finished");
	$this->db->where('token',$token);  
	$query	= $this->db->update('coin_withdraw',$data); 
	if($query)
	{                
		return true;	
	}   
	else
	{      
		return false;		
	}
}
function updatecancellation($token,$Userid,$currency,$askamount)
{	
	$data = array('status'=>"cancelled");
	$this->db->where('token',$token);  
	$query	= $this->db->update('coin_withdraw',$data); 
	if($query)
	{   
		$this->db->where('token',$token);  
		$queryy = $this->db->get('coin_withdraw');
		$row = $queryy->row();
		if($currency=='XRP')
		{
			if($row->paymentname=='USD')
			{
				$balance = $this->fetchuserbalancebyId($Userid,'USD');  // fetch first balance
			}
			else
			{
				$balance = $this->fetchuserbalancebyId($Userid,'BTC');  // fetch first balance

			}
			
		}
		else
		{
			$balance = $this->fetchuserbalancebyId($Userid,$currency);  // fetch first balance
		}
		$updatefirstBalance = $balance+$askamount;
		if($currency=="BTC")
		{
			$updatedata = array('BTC'=>$updatefirstBalance);
		}
		else if($currency=="XRP")
		{
			if($row->paymentname=='USD')
			{
				$updatedata = array('USD'=>$updatefirstBalance);
			}
			else
			{
				$updatedata = array('BTC'=>$updatefirstBalance);

			}
		}
		else if($currency=="USD")
		{
			$updatedata = array('USD'=>$updatefirstBalance);
		}
		else if($currency=="LTC")
		{
			$updatedata = array('LTC'=>$updatefirstBalance);
		}
		else if($currency=="ETH")
		{
			$updatedata = array('ETH'=>$updatefirstBalance);
		}
		$this->db->where('userId',$Userid); 
		$this->db->update('balance',$updatedata);
		return true;	
	}   
	else
	{      
		return false;		
	}
}
function updateTransaction($TXid,$token)
{	
	$this->db->where('token',$token);  
	$data = array('trans_id'=>$TXid);
	$query	= $this->db->update('coin_withdraw',$data);            
	return true;	
	
}
function updatecancelconfirmation($with_id)
{	
	$this->db->where('with_id',$with_id);  
	$data = array('status'=>"cancel");
	$query	= $this->db->udpate('coin_withdraw',$data); 
	if($query->num_rows() >= 1)
	{                
		return true;	
	}   
	else
	{      
		return false;		
	}
}
function getbalance($account,$currency)
{
	if($currency=="BTC")
	{
		$bitcoin 	= new jsonRPCClient('http://ramesh:Ramesh!@127.0.0.1:8332/');
		$isvalid = $bitcoin->getbalance($account);
	}
	else if($currency=="LTC")
	{
		$litecoin = new jsonRPCClient('http://litecoinrpc:2vNmtT4ovkcszfReGkLeXPUJdfunXWgBqNjQa9hubEPf@127.0.0.1:9332/');
		$isvalid = $litecoin->getbalance($account);
	}
	else if($currency=="NMC")
	{
		$namecoin = new jsonRPCClient('http://namecoinrpc:Ramesh@127.0.0.1:9345/');
		$isvalid = $namecoin->getbalance($account);
	}
	else if($currency=="NVC")
	{
		$novacoin = new jsonRPCClient('http://novacoinrpc:Ramesh@127.0.0.1:9355/');
		$isvalid = $novacoin->getbalance($account);
	}
	else if($currency=="PPC")
	{
		$peercoin = new jsonRPCClient('http://peercoinrpc:Ramesh@127.0.0.1:9340/');
		$isvalid = $peercoin->getbalance($account);
	}
	else if($currency=="FTC")
	{
	}
	return $isvalid;
}
function checkusername($username)
{   
	$this->db->where('username',$username);      
	$query=$this->db->get('users');	 	     
	if($query->num_rows()>=1)  
	{           
		return "already"; 
	}      
	else
	{
		return "nothing";  
	}
}
function getbalanceBTC()
{
	$logging_userid	=	$this->session->userdata('logging_userid');  
	$this->db->where('userId',$logging_userid);  
	$query	=	$this->db->get('coin_btcamount'); 
	if($query->num_rows() >= 1)
	{                
		$row = $query->row();	
		return $row->amount;
	}   
	else
	{      
		return false;		
	}
}
function getbalanceLTC()
{
	$logging_userid	=	$this->session->userdata('logging_userid');  
	$this->db->where('userId',$logging_userid);  
	$query	=	$this->db->get('coin_ltcamount'); 
	if($query->num_rows() >= 1)
	{                
		$row = $query->row();	
		return $row->amount;
	}   
	else
	{      
		return false;		
	}
}
function getbalanceNMC()
{
	$logging_userid	=	$this->session->userdata('logging_userid');  
	$this->db->where('userId',$logging_userid);  
	$query	=	$this->db->get('coin_nmcamount'); 
	if($query->num_rows() >= 1)
	{                
		$row = $query->row();	
		return $row->amount;
	}   
	else
	{      
		return false;		
	}
}
function getbalanceNVC()
{
	$logging_userid	=	$this->session->userdata('logging_userid');  
	$this->db->where('userId',$logging_userid);  
	$query	=	$this->db->get('coin_nvcamount'); 
	if($query->num_rows() >= 1)
	{                
		$row = $query->row();	
		return $row->amount;
	}   
	else
	{      
		return false;		
	}
}
function getbalancePPC()
{
	$logging_userid	=	$this->session->userdata('logging_userid');  
	$this->db->where('userId',$logging_userid);  
	$query	=	$this->db->get('coin_ppcamount'); 
	if($query->num_rows() >= 1)
	{                
		$row = $query->row();	
		return $row->amount;
	}   
	else
	{      
		return false;		
	}
}
function getbalanceXPM()
{
	$logging_userid	=	$this->session->userdata('logging_userid');  
	$this->db->where('userId',$logging_userid);  
	$query	=	$this->db->get('coin_xpmamount'); 
	if($query->num_rows() >= 1)
	{                
		$row = $query->row();	
		return $row->amount;
	}   
	else
	{      
		return false;		
	}
}
function checkReceivedamount($currency,$account,$userid)
{
	$this->db->where('userId',$userid);  
	$this->db->where('account',$account);  
	if($currency=="BTC")
	{
		$query	=	$this->db->get('coin_btcamount'); 
	}
	else if($currency=="LTC")
	{
		$query	=	$this->db->get('coin_ltcamount'); 
	}
	else if($currency=="NMC")
	{
		$query	=	$this->db->get('coin_nmcamount'); 
	}
	else if($currency=="NVC")
	{
		$query	=	$this->db->get('coin_nvcamount'); 
	}
	else if($currency=="PPC")
	{
		$query	=	$this->db->get('coin_ppcamount'); 
	}
	else if($currency=="FTC")
	{
		$query	=	$this->db->get('coin_ftcamount'); 
	}	
	if($query->num_rows() >= 1)
	{                
		$row = $query->row();	
		return "already";
	}   
	else
	{      
		return false;		
	}
}
function fetchUseridbyAddress($currency,$address)
{
	if($currency=="BTC")
	{
		$this->db->where('BTC',$address);  
	}
	else if($currency=="LTC")
	{
		$this->db->where('LTC',$address);
	}
	else if($currency=="NMC")
	{
		$this->db->where('NMC',$address);
	}
	else if($currency=="NVC")
	{
		$this->db->where('NVC',$address);
	}
	else if($currency=="PPC")
	{
		$this->db->where('PPC',$address);
	}
	else if($currency=="FTC")
	{
		$this->db->where('FTC',$address);
	}	
	$query	=	$this->db->get('coin_address'); 
	if($query->num_rows() >= 1)
	{                
		$row = $query->row();	
		return $userId = $row->user_id;
	}   
	else
	{      
		return false;		
	}
}
function fetchTransHistoryDetail($currency,$userId)
{
	$this->db->where('userId',$userId);  
	$this->db->where('type',"Deposit");  
	$this->db->where('currency',$currency);  
	$this->db->order_by('transactionId',"desc");  
	$this->db->limit(1,0);  
	$query	=	$this->db->get('transaction_history'); 
	if($query->num_rows() >= 1)
	{                
		$row = $query->row();	
		return $row->amount;
	}   
	else
	{      
		return false;		
	}
}
function updateReceivedamount()
{
	$cur_date	=	date('Y-m-d');	   	
	$cur_time	=	date('h:i:s');	 

	$checkAddress 	= $this->get_ripple_address();
	$ripple_address = $checkAddress->ripple_address;

	$url = 'https://api.ripple.com/v1/accounts/'.$ripple_address.'/payments?direction=incoming&exclude_failed=true'; 
	$header[] = "Accept: application/json";
	$header[] = "Accept-Encoding: gzip";
	$ch = curl_init();
	curl_setopt( $ch, CURLOPT_HTTPHEADER, $header );
	curl_setopt($ch,CURLOPT_ENCODING , "gzip");
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
	curl_setopt( $ch, CURLOPT_URL, $url );
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
	$response = json_decode(curl_exec($ch));
	$rt =  curl_getinfo($ch);
	echo "<pre>";
	print_r($response->payments); 
	$i=0;
	for($i=0;$i<count($response->payments);$i++)
	{
		"fsdfkjdshfdshfjh";
		$hash = $response->payments[$i]->hash;
		$deposit_already = $this->checkdepalready($hash);
		if($deposit_already)
		{
			$user_id = $this->get_user_id($hash); 
			$currency = $response->payments[$i]->payment->destination_amount->currency; 
			if($currency!='XRP')
			{
				$amount = $response->payments[$i]->payment->destination_amount->value;
				$balance = $this->fetchuserbalancebyId($user_id,$currency);

				$newbal = $amount+$balance;
				$this->db->where('userId',$user_id);
				$this->db->update('balance',array($currency=>$newbal));

					// Transaction History
				$transdata = array(
					"userId"	=>	$user_id,
					"type"		=>	"Deposit",
					"currency"	=>	$currency,
					"amount"	=>	$amount,
					"comment"	=>	"BTC payment",
					"date"		=>	$cur_date,
					"time"		=>	$cur_time,
					"status"	=>	"active"
					);
				$this->db->insert('transaction_history',$transdata);

						// insert the data for deposited already
				$userdata 	= array(
					'id' 		=> $dep_id,
					'tx_hash' 	=> $hash,
					);

				$this->db->insert('ripple_deposit_detail',$userdata);	

						// insert the data for deposit details
				$userdata = array(
					'user_id' 		=> $user_id,
					'currency' 		=> $currency,
					'type' 			=> "ripple".strtolower($currency),
					'request_time' 	=> $time,
					'amount' 		=> $amount,
						// 'askamount' 	=> $amount,
					'request_date' 	=> $date,
					'status' 		=> "finished"
					);

				$this->db->insert('deposit_payment',$userdata);
				return true;
			}
		}


	}
	
}
function get_user_id($hash)
{
	$checkAddress 	= $this->get_ripple_address();
	$ripple_address = $checkAddress->ripple_address;

	$url = 'https://api.ripple.com/v1/accounts/'.$ripple_address.'/payments/'.$hash;

	$header[] = "Accept: application/json";
	$header[] = "Accept-Encoding: gzip";
	$ch = curl_init();
	curl_setopt( $ch, CURLOPT_HTTPHEADER, $header );
	curl_setopt($ch,CURLOPT_ENCODING , "gzip");
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
	curl_setopt( $ch, CURLOPT_URL, $url );
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
	$response = json_decode(curl_exec($ch));
	$rt =  curl_getinfo($ch);
	if($response)
	{
		$destination_tag  = $response->payment->destination_tag; 
		if($destination_tag)
		{
			return $user_id = $this->get_useridbydt($destination_tag);
		}
		else
		{
			return false;
		}
	}
	else
	{
		
		return false;
	}
}
function get_useridbydt($tag)
{
	$this->db->where('destination_tag',$tag);
	$query = $this->db->get('users');
	if($query->num_rows())
	{
		$row = $query->row();
		return $row->user_id;
	}
	else
	{
		return false;
	}
}
function checkdepalready($hash)
{
	$this->db->where('tx_hash',$hash);
	$query = $this->db->get('ripple_deposit_detail');
	if($query->num_rows())
	{
		return false;
	}
	else
	{
		return true;
	}
}

function walletVolume($type)
{
	$this->db->where('type',$type);      
	$this->db->where('status','active');      
	$query=$this->db->get('wallet');	 	     
	if($query->num_rows()>=1)  
	{           
		$row = $query->row();
		return $row->volume;
	}      
	else
	{
		return false;
	}
}
function fetchuserIdforcron($email_id=null) 
{
	$this->db->where('emailid',$email_id);   
	$get_qry=$this->db->get('users'); 
	if($get_qry->num_rows()>=1)
	{
		$row	=	$get_qry->row();  
		return $row->user_id;  
	}
	else
	{
		return false;   
	}
}  
function testDepositaddr($addr)
{
	$this->db->where('depositaddress',$addr);  
	$query	=	$this->db->get('transaction_history'); 
	if($query->num_rows() >= 1)
	{                
		return true;
	}   
	else
	{      
		return false;		
	}
}
function getEcurrencybal($currency)    // Ecurrency Balance
{
	$customer_user_id	=	$this->session->user_id;  
	$this->db->where('userId',$customer_user_id);  
	$query	=	$this->db->get('balance'); 
	if($query->num_rows() >= 1)
	{                
		$row = $query->row();
		if($currency=="BTC")
		{
			return $row->BTC;
		}
		else if($currency=="LTC")
		{
			return $row->LTC;
		}
		else if($currency=="USD")
		{
			return $row->USD;
		}
		else if($currency=="ZAR")
		{
			return $row->ZAR;
		}
		else if($currency=="NGN")
		{
			return $row->NGN;
		}
		else if($currency=="ETH")
		{
			return $row->ETH;
		}
		else if($currency=="WCN")
		{
			return $row->WCN;
		}
		else if($currency=="EUR")
		{
			return $row->EUR;
		}
		else if($currency=="NLG")
		{
			return $row->NLG;
		}
		else if($currency=="GTS")
		{
			return $row->GTS;
		}
	}   
	else
	{      
		return false;		
	}
}
function get_userbalance($id,$currency)
{
	$this->db->where('userId',$id);  
	$query	=	$this->db->get('balance'); 
	if($query->num_rows() >= 1)
	{                
		$row = $query->row();
		if($currency=="BTC")
		{
			return $row->BTC;
		}
		else if($currency=="LTC")
		{
			return $row->LTC;
		}
		else if($currency=="USD")
		{
			return $row->USD;
		}
	}   
	else
	{      
		return false;		
	}
}
function createBuystopordermodel()
{
	$current_date		=	date('Y-m-d'); 
	$current_time		=	date('H:i A'); 
	$customer_user_id	=	$this->session->user_id; 
	$firstCurrency	 	= 	$this->input->post('firstCurrency');
	$secondCurrency 	= 	$this->input->post('secondCurrency');
	$buytrailing_stop 	= 	$this->input->post('buytrailing_stop');
	$currency_pair 		= 	$this->input->post('pair');
	$firstBalance 		= 	$this->fetchuserbalancebyId($customer_user_id,$firstCurrency);
	$secondBalance 		= 	$this->fetchuserbalancebyId($customer_user_id,$secondCurrency);
	$amount 			= 	$this->input->post('amount');
	$price 				= 	$this->input->post('price');
	$buyrate 				= 	$this->input->post('buyrate');
	
	$fee 				= $this->input->post('fee'); // first currency
	// $ordertype 		= $this->input->post('ordertype');	// second currency
	// $executeprice 		= $this->input->post('executeprice');	// second currency
	
	$updatefirstBalance 	= $secondBalance-$amount;
	$accport_currency_session	=	$this->session->userdata('accport_currency');
	
	$updatedata = array(
		$secondCurrency=>$updatefirstBalance
		);
	if($buytrailing_stop	==	"trailing_stop")
	{
		$trigger_price 	= $buyrate-$price;
		$status 		= "trailing_stop";
	}
	else
	{
		$status 		= "stoporder";
		$trigger_price 	= 0;
	}
	
	$this->db->where('userId',$customer_user_id);  
	$updatequery = $this->db->update('balance',$updatedata);
	if($updatequery)
	{
		$datetime	= date("Y-m-d H:i:s");
		$pair = $firstCurrency."_".$secondCurrency;
		
		$data	=	array(
			'userId'			=>	$customer_user_id,
			'Amount'			=>	$amount,
			'stoporderprice'	=>	$price,
							// 'Total'=>$total,
			'Fee'				=>	$fee,
			'firstCurrency'		=>	$firstCurrency,
			'secondCurrency'	=>	$secondCurrency,
							// 'Process'=>$process,
			'trigger_price'		=>	abs($trigger_price),
			'Type'				=>	"Buy",
			'orderDate'			=>	$current_date,
			'orderTime'			=>	$current_time,
			'datetime'			=>	$datetime,
			'pair'				=>	$pair,
			'status'			=>	$status
			);
		$this->db->insert('coin_order',$data);
		echo $insid = $this->db->insert_id();
	}
	else
	{
		return false;
	}

}
function createSellstopordermodel()
{
	$current_date		=	date('Y-m-d'); 
	$current_time		=	date('H:i A'); 
	$customer_user_id	=	$this->session->user_id; 
	$firstCurrency	 	= 	$this->input->post('firstCurrency');
	$secondCurrency 	= 	$this->input->post('secondCurrency');
	$currency_pair 		= 	$this->input->post('pair');
	$firstBalance 		= 	$this->fetchuserbalancebyId($customer_user_id,$firstCurrency);
	$secondBalance 		= 	$this->fetchuserbalancebyId($customer_user_id,$secondCurrency);
	$amount 			= 	$this->input->post('amount');
	$price 				= 	$this->input->post('price');
	$buyrate 				= 	$this->input->post('buyrate');
	$selltrailing_stop 				= 	$this->input->post('selltrailing_stop');
	
	$fee 				= $this->input->post('fee'); // first currency
	// $ordertype 		= $this->input->post('ordertype');	// second currency
	// $executeprice 		= $this->input->post('executeprice');	// second currency
	if($selltrailing_stop=="trailing_stop")
	{
		$trigger_price = $buyrate-$price;
		$status = "trailing_stop";
	}
	else
	{
		$status = "stoporder";
		$trigger_price = 0;
	}
	
	$updatesecondBalance 	= $firstBalance-$amount;
	$accport_currency_session	=	$this->session->userdata('accport_currency');
	
	$updatedata = array(
		$firstCurrency=>$updatesecondBalance
		);
	
	$this->db->where('userId',$customer_user_id);  
	$updatequery = $this->db->update('balance',$updatedata);
	if($updatequery)
	{
		$datetime	=date("Y-m-d H:i:s");
		$pair = $firstCurrency."_".$secondCurrency;
		
		$data	=	array(
			'userId'=>$customer_user_id,
			'Amount'=>$amount,
			'stoporderprice'=>$price,
			'trigger_price'=>abs($trigger_price),
			'Fee'=>$fee,
			'firstCurrency'=>$firstCurrency,
			'secondCurrency'=>$secondCurrency,
							// 'Process'=>$process,
			'Type'=>"Sell",
			'orderDate'=>$current_date,
			'orderTime'=>$current_time,
			'datetime'=>$datetime,
			'pair'=>$pair,
			'status'=>$status
			);
		$this->db->insert('coin_order',$data);
		echo $insid = $this->db->insert_id();
	}
	else
	{
		return false;
	}

}
/* Trading Functionality - Buy / Sell Order  */
function createBuyordermodel()
{
	$current_date	=	date('Y-m-d'); 
	$current_time	=	date('H:i A'); 
	$customer_user_id	=	$this->session->user_id; 
	$firstCurrency	 	= $this->input->post('firstCurrency');
	$secondCurrency 	= $this->input->post('secondCurrency'); 
	$currency_pair 	= $this->input->post('pair');
	$firstBalance 	= $this->fetchuserbalancebyId($customer_user_id,$firstCurrency);
	$secondBalance 	= $this->fetchuserbalancebyId($customer_user_id,$secondCurrency);  
	$amount 	= $this->input->post('amount');
	$price 		= $this->input->post('price');
	$total 		= $this->input->post('total'); // second currency
	$process 	= $this->input->post('process');
	$fee 		= $this->input->post('fee'); // first currency
	$ordertype 		= $this->input->post('ordertype');	// second currency
	$executeprice 		= $this->input->post('executeprice');	// second currency
	if($ordertype=="consecutive")
	{
		$con_order="yes";
		$status = "buyconsecutive";
	}
	else
	{
		$con_order="";
		$status = "active";
	}
	//BTC-USD	LTC-BTC   USD-RUR
	$updatefirstBalance	= $firstBalance-$total;  

	$accport_currency_session	=	$this->session->userdata('accport_currency');
	
	$updatedata = array(
		$firstCurrency =>$updatefirstBalance
		);
	
	$this->db->where('userId',$customer_user_id);  
	$updatequery = $this->db->update('balance',$updatedata);
	if($updatequery)
	{
		$datetime	=date("Y-m-d h:i:s");
		$pair = $firstCurrency."_".$secondCurrency;
		if($con_order!="")
		{
			$total = $executeprice*$amount;
			$data	=	array(
				'userId'=>$customer_user_id,
				'Amount'=>$amount,
				'Price'=>$executeprice,
				'Total'=>$total,
				'Fee'=>$fee,
				'firstCurrency'=>$firstCurrency,
				'secondCurrency'=>$secondCurrency,
				'Process'=>$process,
				'Type'=>"Sell",
				'orderDate'=>$current_date,
				'orderTime'=>$current_time,
				'datetime'=>$datetime,
				'pair'=>$pair,
				'status'=>"buyconsecutive"
				);
			$this->db->insert('coin_order',$data);
		}
		$data	=	array(
			'userId'=>$customer_user_id,
			'Amount'=>$amount,
			'Price'=>$price,
			'Total'=>$total,
			'Fee'=>$fee,
			'firstCurrency'=>$firstCurrency,
			'secondCurrency'=>$secondCurrency,
			'Process'=>$process,
			'Type'=>"Buy",
			'orderDate'=>$current_date,
			'orderTime'=>$current_time,
			'datetime'=>$datetime,
			'pair'=>$pair,
			'status'=>"active"
			);
		$this->db->insert('coin_order',$data);
		echo $insid = $this->db->insert_id();
	}
	else
	{
		return false;
	}
}
function createSellordermodel()
{
	$current_date		=	date('Y-m-d'); 
	$current_time		=	date('H:i A'); 
	$customer_user_id	=	$this->session->user_id; 
	$firstCurrency	 	= 	$this->input->post('firstCurrency');
	$secondCurrency 	= 	$this->input->post('secondCurrency');
	$firstBalance 		= 	$this->fetchuserbalancebyId($customer_user_id,$firstCurrency);
	$secondBalance 		= 	$this->fetchuserbalancebyId($customer_user_id,$secondCurrency);
	$currency_pair 		= 	$this->input->post('pair');
	$amount	 			= 	$this->input->post('amount');
	$price 				=	$this->input->post('price');
	$total 				= 	$this->input->post('total');	// second currency
	$process 			= 	$this->input->post('process');
	$fee 				= 	$this->input->post('fee');	// second currency
	$ordertype 			= 	$this->input->post('ordertype');	// second currency
	$executeprice 		= 	$this->input->post('executeprice');	// second currency
	if($ordertype=="consecutive")
	{
		$con_order="yes";
		$status = "buyconsecutive";
	}
	else
	{
		$con_order="";
		$status = "active";
	}
	//BTC-USD	LTC-BTC   USD-RUR
	$updatefirstBalance 	= $secondBalance-$amount;
	$accport_currency_session	=	$this->session->userdata('accport_currency');
	$currency                   = $this->session->userdata('currency');
	$updatedata = array(
		$secondCurrency=>$updatefirstBalance
		);
	
	$this->db->where('userId',$customer_user_id);  
	$updatequery = $this->db->update('balance',$updatedata);
	if($updatequery)
	{
		$datetime	=date("Y-m-d h:i:s");
		$pair = $firstCurrency."_".$secondCurrency;
		
		if($con_order!="")
		{
			$data	=	array(
				'userId'=>$customer_user_id,
				'Amount'=>$amount,
				'Price'=>$executeprice,
				'Total'=>$total,
				'Fee'=>$fee,
				'firstCurrency'=>$firstCurrency,
				'secondCurrency'=>$secondCurrency,
				'Process'=>$process,
				'Type'=>"Buy",
				'orderDate'=>$current_date,
				'orderTime'=>$current_time,
				'datetime'=>$datetime,
				'pair'=>$pair,
				'status'=>"sellconsecutive"
				);
			$this->db->insert('coin_order',$data);
		}
		
		$data	=	array(
			'userId'=>$customer_user_id,
			'Amount'=>$amount,
			'Price'=>$price,
			'Total'=>$total,
			'Fee'=>$fee,
			'firstCurrency'=>$firstCurrency,
			'secondCurrency'=>$secondCurrency,
			'Process'=>$process,
			'Type'=>"Sell",
			'orderDate'=>$current_date,
			'orderTime'=>$current_time,
			'datetime'=>$datetime,
			'pair'=>$pair,
			'status'=>"active"
			);
		$this->db->insert('coin_order',$data);
		echo $insid = $this->db->insert_id();
	}
}
function change_createBuyordermodel()
{
	$current_date	=	date('Y-m-d'); 
	$current_time	=	date('H:i A'); 
	$customer_user_id	=	$this->session->user_id; 
	$firstCurrency	 	= $this->input->post('firstCurrency');
	$secondCurrency 	= $this->input->post('secondCurrency');
	$firstBalance 	= $this->input->post('balance1');
	$secondBalance 	= $this->input->post('balance2');
	$amount 	= $this->input->post('amount');
	$price 		= $this->input->post('price');
	$total 		= $this->input->post('total'); // second currency
	$process 	= $this->input->post('process');
	$fee 		= $this->input->post('fee'); // first currency
	$trade_id 		= $this->input->post('trade_id'); // first currency
	//BTC-USD	LTC-BTC   USD-RUR
	$oldtotal = $this->get_oldtotal($trade_id);
	if($oldtotal > $total)
	{
		$tot = $oldtotal-$total;
		$updatesecondBalance 	= $secondBalance+$tot;
	}
	else if($oldtotal == $total)
	{
		$updatesecondBalance 	= $secondBalance;
	}
	else
	{
		$tot = $total-$oldtotal;
		$updatesecondBalance 	= $secondBalance-$tot;
	}
	

	
	$updatedata = array(
		$secondCurrency=>$updatesecondBalance
		);
	
	$this->db->where('userId',$customer_user_id);  
	$updatequery = $this->db->update('balance',$updatedata);
	if($updatequery)
	{
		$datetime	=date("Y-m-d H:i:s");
		$pair = $firstCurrency."_".$secondCurrency;
		$data	=	array(
			'userId'=>$customer_user_id,
			'Amount'=>$amount,
			'Price'=>$price,
			'Total'=>$total,
			'Fee'=>$fee,
			'firstCurrency'=>$firstCurrency,
			'secondCurrency'=>$secondCurrency,
			'Process'=>$process,
			'Type'=>"Buy",
			'orderDate'=>$current_date,
			'orderTime'=>$current_time,
			'datetime'=>$datetime,
			'pair'=>$pair,
			'status'=>"active"
			);
		$this->db->where('trade_id',$trade_id);
		$this->db->update('coin_order',$data);
		echo $trade_id; 
	}
	else
	{
		return false;
	}
}

function change_createSellordermodel()
{
	$current_date	=	date('Y-m-d'); 
	$current_time	=	date('H:i A'); 
	$customer_user_id	=	$this->session->user_id; 
	$firstCurrency	 	= 	$this->input->post('firstCurrency');
	$secondCurrency 	= 	$this->input->post('secondCurrency');
	$firstBalance 		= 	$this->input->post('balance1');
	$secondBalance 		= 	$this->input->post('balance2');
	$amount	 	= $this->input->post('amount');
	$price 		= $this->input->post('price');
	$total 		= $this->input->post('total');	// second currency
	$process 	= $this->input->post('process');
	$fee 		= $this->input->post('fee');	// second currency
	$trade_id 		= $this->input->post('trade_id');	// second currency
	//BTC-USD	LTC-BTC   USD-RUR
	$oldamount = $this->get_oldamount($trade_id);
	if($oldamount > $amount)
	{
		$tot = $oldamount-$amount;
		$updatefirstBalance 	= $firstBalance+$tot;
	}
	else if($oldamount == $amount)
	{
		$updatefirstBalance 	= $firstBalance;
	}
	else
	{
		$tot = $amount-$oldamount;
		$updatefirstBalance 	= $firstBalance-$tot;
	}
	if($firstCurrency=='BTC')
	{
		$accport_currency_session	=	'btc_usd';
	}
	else
	{
		$accport_currency_session	=	'ltc_usd';
	}
	if($accport_currency_session=="")
	{
		$accport_currency_session	=	"btc_usd";
	}
	if($accport_currency_session=="btc_usd")
	{
		$updatedata = array(
			'BTC'=>$updatefirstBalance
			);
	}
	else if($accport_currency_session=="ltc_usd")
	{
		$updatedata = array(
			'LTC'=>$updatefirstBalance
			);
	}
	$this->db->where('userId',$customer_user_id);  
	$updatequery = $this->db->update('balance',$updatedata);
	if($updatequery)
	{
		$datetime	=date("Y-m-d H:i:s");
		$pair = $firstCurrency."_".$secondCurrency;
		$data	=	array(
			'userId'=>$customer_user_id,
			'Amount'=>$amount,
			'Price'=>$price,
			'Total'=>$total,
			'Fee'=>$fee,
			'firstCurrency'=>$firstCurrency,
			'secondCurrency'=>$secondCurrency,
			'Process'=>$process,
			'Type'=>"Sell",
			'orderDate'=>$current_date,
			'orderTime'=>$current_time,
			'datetime'=>$datetime,
			'pair'=>$pair,
			'status'=>"active"
			);
		$this->db->where('trade_id',$trade_id);
		$this->db->update('coin_order',$data);
		echo $trade_id;
	}
}
function createconSellordermodel()
{
	$current_date	=	date('Y-m-d'); 
	$current_time	=	date('H:i A'); 
	$customer_user_id	=	$this->session->user_id; 
	$firstCurrency	 	= 	$this->input->post('firstCurrency');
	$secondCurrency 	= 	$this->input->post('secondCurrency');
	$firstBalance 		= 	$this->input->post('balance1');
	$secondBalance 		= 	$this->input->post('balance2');
	$amount	 	= $this->input->post('amount');
	$price 		= $this->input->post('price');
	$total 		= $this->input->post('total');	// second currency
	$process 	= $this->input->post('process');
	$fee 		= $this->input->post('fee');	// second currency
	//BTC-USD	LTC-BTC   USD-RUR
	$updatefirstBalance 	= $firstBalance-$amount;
	$accport_currency_session	=	$this->session->userdata('accport_currency');
	if($accport_currency_session=="")
	{
		$accport_currency_session	=	"btc_usd";
	}
	if($accport_currency_session=="btc_usd")
	{
		$updatedata = array(
			'BTC'=>$updatefirstBalance
			);
	}
	else if($accport_currency_session=="ltc_usd")
	{
		$updatedata = array(
			'LTC'=>$updatefirstBalance
			);
	}
	/* $this->db->where('userId',$customer_user_id);  
	$updatequery = $this->db->update('balance',$updatedata); */
	
	$datetime	=date("Y-m-d H:i:s");
	$pair = $firstCurrency."_".$secondCurrency;
	$data	=	array(
		'userId'=>$customer_user_id,
		'Amount'=>$amount,
		'Price'=>$price,
		'Total'=>$total,
		'Fee'=>$fee,
		'firstCurrency'=>$firstCurrency,
		'secondCurrency'=>$secondCurrency,
		'Process'=>$process,
		'Type'=>"Sell",
		'orderDate'=>$current_date,
		'orderTime'=>$current_time,
		'datetime'=>$datetime,
		'pair'=>$pair,
		'status'=>"consecutive"
		);
	$this->db->insert('coin_order',$data);
	echo $insid = $this->db->insert_id();
	
}
function insertTheftprice($theftprice,$buyuserId,$buysecondCurrency)
{
	$date	= date('Y-m-d');
	$time	= date("h:i:s");
	$data = array(
		'userId'=>$buyuserId,
		'theftAmount'=>$theftprice,
		'theftCurrency'=>$buysecondCurrency,
		'date'=>$date,
		'time'=>$time
		);
	$query	=	$this->db->insert('coin_theft',$data);
	if($query)
	{
		return true;
	}
	else
	{
		return false;
	}
}
function cronforOrdersmodel()
{
	$buyResult = $this->getBuyorders();
	if($buyResult)
	{
		foreach($buyResult as $buy)
		{
			$buyorderId  		= $buy->trade_id;
			$buyuserId  		= $buy->userId;
			$buyPrice  			= $buy->Price;
			$buyAmount 			= $buy->Amount;
			$buyfirstCurrency 	= $buy->firstCurrency;
			$buysecondCurrency 	= $buy->secondCurrency;
			$buySumamount = $this->checkbuyOrdertemp($buyorderId);
			if($buySumamount)
			{
				$buySumamount = $buyAmount-$buySumamount;
			}
			else
			{
				$buySumamount = $buyAmount;
			}
			// buy equal to sell
			$fetchsellRecords = $this->getParticularsellorders($buyPrice,$buyuserId,$buyfirstCurrency,$buysecondCurrency);
			if($fetchsellRecords)
			{
				foreach($fetchsellRecords as $sell)
				{
					$sellorderId  	= $sell->trade_id;
					$selluserId  	= $sell->userId;
					$sellPrice  	= $sell->Price;
					$sellAmount  	= $sell->Amount;
					$sellSumamount = $this->checkOrdertemp($sellorderId);
					if($sellSumamount)
					{
						$approxiAmount = $sellAmount-$sellSumamount;
					}
					else
					{
						$approxiAmount = $sellAmount;
					}
					if($approxiAmount>=$buySumamount)
					{
						$amount = $buySumamount;
					}
					else
					{
						$amount = $approxiAmount;
					}
					echo "<br>approxiAmount".$approxiAmount;						
					echo "<br>amount".$amount;						
					echo "<br>buySumamount".$buySumamount;
					$inserted = $this->insertOrdertemp($sellorderId,$selluserId,$sellAmount,$sellPrice,$amount,$buyorderId,$buyuserId,$buyfirstCurrency,$buysecondCurrency);
					if($inserted)	
					{
						//complete theft amount
						$testPrice = bccomp($buyPrice, $sellPrice);
						if($testPrice==1) // a>b
						{
							$theftprice	=	$buyPrice-$sellPrice;
							$this->insertTheftprice($theftprice,$buyuserId,$buysecondCurrency);
						}
						//complete buyer order
						if($approxiAmount==$amount)  // a=b
						{	
							echo "<br>fulfil seller order".$sellorderId;
							$this->removeOrder($sellorderId,"Sell",$inserted);
						}
						else
						{
							echo "<br>changeOrderstatussell";
							$this->changeOrderstatus($sellorderId);
						}
						//complete buyer order
						if($approxiAmount==$buySumamount)  // a>b
						{ 
							echo "<br>fulfil buyer orderONE".$buyorderId;
							$this->removeOrder($buyorderId,"Buy",$inserted);
						}
						else if($approxiAmount>$buySumamount) // a=b
						{ 
							echo "<br>fulfil buyer orderTWO".$buyorderId;
							$this->removeOrder($buyorderId,"Buy",$inserted);
						}
						else
						{
							echo "<br>changeOrderstatusbuy2";
							$this->changeOrderstatus($buyorderId);
						}
					}
				}
			}
		}
	}
	return true;
}
function testFunction($id)
{
	$this->db->where('status','filled');  
	$this->db->where('trade_id',$id);  
	$query	=	$this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{                
		$row = $query->row();
		return $row->Amount;	
	}   
	else
	{      
		return false;		
	}
}
function testFunction2($type,$id)
{
	$this->db->where('status','partially'); 
	$this->db->where('trade_id',$id);  
	$query	=	$this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{                
		if($type=="buy")
		{
			$this->db->where('buyorderId',$id);  
		}
		else
		{
			$this->db->where('sellorderId',$id);  
		}
		$queryonce	=	$this->db->get('ordertemp'); 
		if($queryonce->num_rows() >= 1)
		{                
			$row = $queryonce->row();
			return $row->filledAmount;	
		}   
		else
		{      
			return false;		
		}
	}   
	else
	{      
		return false;		
	}	
}
function testFunction3($id)
{
	$this->db->where('status','active');  
	$this->db->where('trade_id',$id);  
	$query	=	$this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{    
		$row = $query->row();
		$amount = $row->Amount;
		$Type = $row->Type;
		$Total = $row->Total;
		$Price = $row->Price;
		$firstCurrency = $row->firstCurrency;
		if($firstCurrency=='BTC')
		{
			/* //echo "testfunction 3 correct";
			if($Type=='Buy')
			{
				$price = $Price+2;
			}
			else
			{
				$price = $Price-2;
			}
			require_once 'guldenapi.php';
			$KEY = 'hGL8s1JxJ79ZLzltTwrCEiVb6OuCFcQE';
			$SECRET = 'HGhL3Ad2xl9wyoqRk0ALmXEYNX3vl0oV';
			$CLIENT_ID = '740293';
			$bapi 		= new guldenapi($KEY,$SECRET,$CLIENT_ID);
			if($Type=='Buy')
			{	
				$bal = $bapi->balance();
				$balance = $bal['usd_available'];
				$ball = (float)$balance;
				$tot = (float)$Total;
				echo $ball." >". $tot;
				if($ball > $tot)
				{
					$ticker 	= $bapi->buy($amount,$price);
				}
				else
				{
					$ticker 	= "";
				}
			}
			else
			{	$bal = $bapi->balance();
				if($bal['btc_available'] > $amount)
				{
					$ticker 	= $bapi->sell($amount,$price);
				}
				else
				{
					$ticker 	= "";
				}
			}
			if($ticker!="")
			{
				$orderid 	= $ticker['id'];
				$type 		= $ticker['type'];	
				$price 		= $ticker['price'];
				$amount 	= $ticker['amount'];
				$datetime 	= $ticker['datetime'];
				
				$this->db->where('trade_id',$id);
				$query = $this->db->update('coin_order',array('order_id'=>$orderid));
				
				$data = array(
						'order_id'=>$orderid,
						'type'=>$type,
						'amount'=>$amount,
						'datetime'=>$datetime,
						'price'=>$price
						);
						
				$this->db->insert('gulden_orders',$data);
			} */
			return true;	
		}
		else
		{
			return false;
		}
	}   
	else
	{      
		return false;		
	}
}
function check_stop_order($currency)
{
	$buy_rate = $this->lowestaskprice($currency,'USD');
	if($buy_rate=="")
	{
		$crbalance='';
		if($firstcurrency=='BTC'){
			$crbalance='btc'; 
		}else if($firstcurrency=='LTC'){
			$crbalance='ltc'; 
		}else{
			$crbalance='eth'; 
		}  
		$buy_rate = $this->gulden_model->coinbal($crbalance);
	}
	$stop_orders = $this->get_sell_stoporders($buy_rate);
	if($stop_orders)
	{
		foreach($stop_orders as $sell_row)
		{
			$status 		= $sell_row->status;
			$trade_id 		= $sell_row->trade_id;
			$trigger_price 	= $sell_row->trigger_price;
			$Fee 			= $sell_row->Fee;
			$amount 		= $sell_row->Amount;
			if($status=='trailing_stop')
			{
				$price = $buy_rate+$trigger_price;
				$total = ($amount*$price)-$Fee;

				$this->db->where('trade_id',$trade_id);
				$this->db->update('coin_order',array('Price'=>$price,'Total'=>$total,'status'=>'active'));

			}
			else
			{
				// $price = $buy_rate+$trigger_price;
				$total = ($amount*$buy_rate)-$Fee;

				$this->db->where('trade_id',$trade_id);
				$this->db->update('coin_order',array('Price'=>$buy_rate,'Total'=>$total,'status'=>'active'));
			}
		}
	}
	$buystop_orders = $this->get_buy_stoporders($buy_rate);
	if($buystop_orders)
	{
		foreach($buystop_orders as $buy_row)
		{
			$status 		= $buy_row->status;
			$trade_id 		= $buy_row->trade_id;
			$trigger_price 	= $buy_row->trigger_price;
			$Fee 			= $buy_row->Fee;
			$amount 		= $buy_row->Amount;
			if($status=='trailing_stop')
			{
				$price = $buy_rate-$trigger_price;
				$total = ($amount*$price)+$Fee;

				$this->db->where('trade_id',$trade_id);
				$this->db->update('coin_order',array('Price'=>$price,'Total'=>$total,'status'=>'active'));

			}
			else
			{
				// $price = $buy_rate+$trigger_price;
				$total = ($amount*$buy_rate)+$Fee;
				$this->db->where('trade_id',$trade_id);
				$this->db->update('coin_order',array('Price'=>$buy_rate,'Total'=>$total,'status'=>'active'));
			}
		}
	}
	return true;
}
function get_sell_stoporders($buy_rate)
{
	$this->db->where('stoporderprice >=',$buy_rate);
	$this->db->where('Type','Sell');
	$this->db->where_in('status',array('stoporder','trailing_stop'));
	$query = $this->db->get('coin_order');
	if($query->num_rows())
	{
		return $query->result();
	}
	else
	{
		return false;
	}
}
function get_buy_stoporders($buy_rate)
{
	$this->db->where('stoporderprice <=',$buy_rate);
	$this->db->where('Type','Buy');
	$this->db->where_in('status',array('stoporder','trailing_stop'));
	$query = $this->db->get('coin_order');
	if($query->num_rows())
	{
		return $query->result();
	}
	else
	{
		return false;
	}
}
function mapping($type)
{
	
	$currency = $this->input->post('firstCurrency');
	$result = $this->check_stop_order($currency);
	$final="";
	$freshorderid = $this->input->post('freshorderid');
	$buyResult = $this->getBuyorders();
	if($buyResult)
	{
		foreach($buyResult as $buy)
		{
			$buyorderId  		= $buy->trade_id; 
			$buyuserId  		= $buy->userId;
			$buyPrice  			= $buy->Price;
			$buyAmount 			= $buy->Amount;
			$buyfirstCurrency 	= $buy->firstCurrency;
			$buysecondCurrency 	= $buy->secondCurrency;
			$buySumamount 		= $this->checkbuyOrdertemp($buyorderId);
			if($buySumamount)
			{
				$buySumamount = $buyAmount-$buySumamount;
			}
			else
			{
				$buySumamount = $buyAmount;
			}

			// buy equal to sell
			$fetchsellRecords = $this->getParticularsellorders($buyPrice,$buyuserId,$buyfirstCurrency,$buysecondCurrency);
			if($fetchsellRecords)
			{
				$k=0;
				foreach($fetchsellRecords as $sell)
				{
					$k++;
					$sellorderId  	= $sell->trade_id;
					$selluserId  	= $sell->userId;
					$sellPrice  	= $sell->Price;
					$sellAmount  	= $sell->Amount;
					$sellfirstCurrency  	= $sell->firstCurrency;
					
					$sellSumamount = $this->checkOrdertemp($sellorderId);
					if($sellSumamount)
					{
						// echo "sarma";
						$approxiAmount = $sellAmount-$sellSumamount;
					}
					else
					{
						// echo "ramesh";
						$approxiAmount = $sellAmount;
					}
					
					if($approxiAmount >= $buySumamount)
					{
						// echo "equal".$buySumamount." ";
						$amount = $buySumamount;
					}
					else
					{
					//echo "suresh";
						$amount = $approxiAmount;
					}
					$buy_status = $this->get_buyorder_status($buyorderId);
					if($buy_status)
					{
						$inserted = $this->insertOrdertemp($sellorderId,$selluserId,$sellAmount,$sellPrice,$amount,$buyorderId,$buyuserId,$buyfirstCurrency,$buysecondCurrency);
						if($inserted)	
						{
							//complete theft amount
							//$testPrice = bccomp($buyPrice, $sellPrice);
							if($buyPrice>$sellPrice) // a>b
							{
								$theftprice	=	$buyPrice-$sellPrice;
								$this->insertTheftprice($theftprice,$buyuserId,$buysecondCurrency);			
							}
							//complete seller order
							// $approxiAmount = (float)$approxiAmount;
							// $amount = (float)$amount;
							// echo $approxiAmount."==".$amount;
							if(trim($approxiAmount)==trim($amount))  // a=b
							{
							// echo "sell fil";
								$this->removeOrder($sellorderId,"Sell",$inserted,$approxiAmount,$sellfirstCurrency);
								//if($type=="buy") {  } else { $final = "sell"; }
								//$final = $this->testFunction($sellorderId);
								$final = $amount; 
							}
							else
							{
							// echo "right";
								$this->changeOrderstatus($sellorderId);
								$final = $amount; 
							}
							//complete buyer order
							if($approxiAmount==$buySumamount)  // a>b
							{ 
							// echo "right1";
								$this->removeOrder($buyorderId,"Buy",$inserted,$buySumamount,$buyfirstCurrency);
								$final = $amount; 
							}
							else if($approxiAmount>$buySumamount) // a=b
							{ 
								//echo "right2";
								$this->removeOrder($buyorderId,"Buy",$inserted,$buySumamount,$buyfirstCurrency);
								$final = $amount; 
							}
							else
							{
								//echo "wrong";
								$this->changeOrderstatus($buyorderId);
								$buyfillamount	=	$this->get_buy_ordertemp($buyorderId);
								$buySumamount	=	$buyAmount-$buyfillamount;
								$final = $amount; 
							} 
						}
					}
				}
			}
		}
	}
	$filled_final = $this->testFunction($freshorderid);
	if($filled_final)
	{
		return $filled_final;
	}
	$partially_final = $this->testFunction2($type,$freshorderid);
	if($partially_final)
	{
		return $partially_final;
	}
	$active_final = $this->testFunction3($freshorderid);
	if($active_final)
	{
		return "empty";
	}  
}
function cancel_stop_order($id)
{
	$this->db->where('trade_id',$id);
	$query = $this->db->get('coin_order');
	if($query->num_rows())
	{
		$row = $query->row();
		$userId = $row->userId;
		$amount = $row->Amount;
		$type = $row->Type;
		$secondcurrency=$row->secondCurrency;
		$firstCurrency=$row->firstCurrency;
		if($type=='Buy')
		{
			$balance = $this->fetchuserbalancebyId($userId,$firstCurrency);
			$update_bal = $balance+$amount;

			$this->db->where('userId',$userId);
			$this->db->update('balance',array($firstCurrency=>$update_bal));

			$this->db->where('trade_id',$id);
			$this->db->update('coin_order',array('status'=>'cancel stop order'));
			return $firstCurrency;
			//return true;
		}
		else
		{
			$balance = $this->fetchuserbalancebyId($userId,$secondcurrency);
			$update_bal = $balance+$amount;

			$this->db->where('userId',$userId);
			$this->db->update('balance',array($secondcurrency=>$update_bal));

			$this->db->where('trade_id',$id);
			$this->db->update('coin_order',array('status'=>'cancel stop order'));
			return $secondcurrency;
			//return true;
		}

	}
}
function get_stop_orders()
{
	$names = array('trailing_stop', 'stoporder');
	$customer_user_id = $this->session->user_id; 
	$this->db->where('userId',$customer_user_id);
	$this->db->where_in('status',$names);
	$query = $this->db->get('coin_order');
	if($query->num_rows())
	{
		return $query->result();
	}
	else
	{
		return false;
	}
}
function get_buyorder_status($buyorderId)
{
	$this->db->where('trade_id',$buyorderId);
	$query = $this->db->get('coin_order');
	if($query->num_rows())
	{
		$row = $query->row();
		$status = $row->status;
		if($status=='partially' || $status=='active')
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	else
	{
		return false;
	}
}
function get_gulden_buyorders()
{
	$url="https://www.gulden.net/api/order_book/";
	$header[] = "Accept: application/json";
	$header[] = "Accept-Encoding: gzip";
	$ch = curl_init();
	curl_setopt( $ch, CURLOPT_HTTPHEADER, $header );
	curl_setopt($ch, CURLOPT_ENCODING , "gzip");
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
	curl_setopt( $ch, CURLOPT_URL, $url );
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
	$response = json_decode(curl_exec($ch));
	$rt =  curl_getinfo($ch);
	$res = $response->bids;
	$i=0;
	foreach($res as $val)
	{
		if($i==10)
		{
			break;
		}
		$price = $val[0];
		$price_num = (float)$price;
		$our_ddb[$i][0]=$price_num-2;
		$our_ddb[$i][1]=$val[1];
		$our_ddb[$i]['id']='gulden';
		$our_ddb[$i]['user_id']='gulden_id';
		$our_ddb[$i]['first_cur']='BTC';
		$our_ddb[$i]['second_cur']='USD';
		$i++;
	}
	return $our_ddb;
}
function get_buy_ordertemp($id)
{
	$this->db->select_sum('filledAmount','totalamount');
	$this->db->where('buyorderId',$id);  
	$query	=	$this->db->get('ordertemp'); 
	if($query->num_rows() >= 1)
	{
		$row = $query->row();
		return $row->totalamount;
	}
	else
	{
		return false;
	}
}
function get_partialbuy($buyorderId)
{
	$this->db->where('Type',"Buy");  
	$this->db->where('trade_id',$buyorderId);  
	$this->db->where_in('status', 'partially');
	$query	=	$this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{
		$row= $query->row();
		return $row->Amount;
	}
	else
	{
		return false;
	}
}
function mappingold($type)
{
	$final="";
	$buyResult = $this->getBuyorders();
	if($buyResult)
	{
		foreach($buyResult as $buy)
		{
			$buyorderId  		= $buy->trade_id;
			$buyuserId  		= $buy->userId;
			$buyPrice  			= $buy->Price;
			$buyAmount 			= $buy->Amount;
			$buyfirstCurrency 	= $buy->firstCurrency;
			$buysecondCurrency 	= $buy->secondCurrency;
			$buySumamount = $this->checkbuyOrdertemp($buyorderId);
			if($buySumamount)
			{
				$buySumamount = $buyAmount-$buySumamount;
			}
			else
			{
				$buySumamount = $buyAmount;
			}
			// buy equal to sell
			$fetchsellRecords = $this->getParticularsellorders($buyPrice,$buyuserId,$buyfirstCurrency,$buysecondCurrency);
			if($fetchsellRecords)
			{
				foreach($fetchsellRecords as $sell)
				{
					$sellorderId  	= $sell->trade_id;
					$selluserId  	= $sell->userId;
					$sellPrice  	= $sell->Price;
					$sellAmount  	= $sell->Amount;
					$sellSumamount = $this->checkOrdertemp($sellorderId);
					if($sellSumamount)
					{
						$approxiAmount = $sellAmount-$sellSumamount;
					}
					else
					{
						$approxiAmount = $sellAmount;
					}
					if($approxiAmount>=$buySumamount)
					{
						$amount = $buySumamount;
					}
					else
					{
						$amount = $approxiAmount;
					}
					$inserted = $this->insertOrdertemp($sellorderId,$selluserId,$sellAmount,$sellPrice,$amount,$buyorderId,$buyuserId,$buyfirstCurrency,$buysecondCurrency);
					if($inserted)	
					{
						//complete theft amount
						$testPrice = bccomp($buyPrice, $sellPrice);
						if($testPrice==1) // a>b
						{
							$theftprice	=	$buyPrice-$sellPrice;
							$this->insertTheftprice($theftprice,$buyuserId,$buysecondCurrency);
						}
						//complete buyer order
						if($approxiAmount==$amount)  // a=b
						{	
							$this->removeOrder($sellorderId,"Sell",$inserted);
							//if($type=="buy") {  } else { $final = "sell"; }
							$final = $amount; 
						}
						else
						{
							$this->changeOrderstatus($sellorderId);
							$final = $amount; 
						}
						//complete buyer order
						if($approxiAmount==$buySumamount)  // a>b
						{ 
							$this->removeOrder($buyorderId,"Buy",$inserted);
							$final = $amount; 
							//if($type=="sell") {  } else {  $final = "buy"; }
						}
						else if($approxiAmount>$buySumamount) // a=b
						{ 
							$this->removeOrder($buyorderId,"Buy",$inserted);
							$final = $amount;  
						}
						else
						{
							$this->changeOrderstatus($buyorderId);
							$final = $amount; 
						}
					}
				}
			}
		}
	}
	if($final!='')
	{
		return $final;
	}
	else
	{
		return "empty";
	}
}
function changeOrderstatus($id)
{
	$this->db->where('trade_id',$id);
	$result = $this->db->update('coin_order',array('status'=>'partially'));
	return true;
}
function insertOrdertemp($sellorderId,$selluserId,$sellAmount,$sellPrice,$amount,$buyorderId,$buyuserId,$buyfirstCurrency,$buysecondCurrency)
{
	$date	=date('Y-m-d');
	$time	=date("H:i:s");
	$datetime	=date("Y-m-d H:i:s");
	$pair = $buyfirstCurrency."_".$buysecondCurrency;
	$data 	= array(
		'sellorderId'=>$sellorderId,
		'sellerUserid'=>$selluserId,
		'askAmount'=>$sellAmount,
		'askPrice'=>$sellPrice,
		'firstCurrency'=>$buyfirstCurrency,
		'secondCurrency'=>$buysecondCurrency,
		'filledAmount'=>$amount,
		'buyorderId'=>$buyorderId,
		'buyerUserid'=>$buyuserId,
		'sellerStatus'=>"inactive",
		'buyerStatus'=>"inactive",
		"date"=>$date,
		"time"=>$time,
		"pair"=>$pair,
		"datetime"=>$datetime
		);
	$this->db->insert('ordertemp',$data);
	$insid =  $this->db->insert_id();
	
		//fetch buyer order details
	$buytrade = $this->getCoinorder($buyorderId);
	$tradetradeId 			= $buytrade->trade_id;
	$tradeuserId 			= $buytrade->userId;
	$tradePrice 			= $buytrade->Price;
	$tradeAmount 			= $buytrade->Amount;
	$tradeFee 				= $buytrade->Fee;
	$tradeType 				= $buytrade->Type;
	$tradeTotal 			= $buytrade->Total;
	$tradefirstCurrency 	= $buytrade->firstCurrency;
	$tradesecondCurrency 	= $buytrade->secondCurrency;

	$CalculatebuyTotal = $amount*$tradePrice;
			//-442.4 USD Buy 0.553 BTC (-0.2%) from order #140461841 by price 800 USD
	$buycomment = "Buy ".$amount." ".$tradefirstCurrency."  (-0.2%) from order #".$tradetradeId ."by price ".$tradePrice." ".$tradesecondCurrency;
	//insert for buyer
	$buyertransactiondata = array
	(
		"userId"=>$tradeuserId,
		"orderId"=>$tradetradeId,
		"type"=>"Buy",
		"currency"=>$tradefirstCurrency,
		"secondcurrency"=>$tradesecondCurrency,
		"amount"=>$amount,
		"price"=>$tradePrice,
		"total"=>$CalculatebuyTotal,
		"fee"=>$tradeFee,
		"comment"=>$buycomment,
		"date"=>$date,
		"time"=>$time,
		"status"=>"active"
		);
	$this->db->insert('transaction_history',$buyertransactiondata);
	
	//fetch seller order details
	$selltrade = $this->getCoinorder($sellorderId);
	$selltradeId 			= $selltrade->trade_id;
	$selluserId 			= $selltrade->userId;
	$sellPrice 				= $selltrade->Price;
	$sellAmount 			= $selltrade->Amount;
	$sellFee 				= $selltrade->Fee;
	$sellType 				= $selltrade->Type;
	$sellTotal 				= $selltrade->Total;
	$sellfirstCurrency 		= $selltrade->firstCurrency;
	$sellsecondCurrency 	= $selltrade->secondCurrency;

	$CalculatesellTotal = $amount*$sellPrice;
	//insert for seller
		//+90.74469149 USD Bought 0.11195534 BTC from your order #139453364 by price 812.168 USD total 90.92654457 USD (-0.2%)
	$sellcomment = "Bought ".$amount." ".$sellfirstCurrency." from order #".$selltradeId ."by price ".$sellPrice." ".$sellsecondCurrency." total ".$CalculatesellTotal." ".$sellsecondCurrency." (-0.2%)";
	$sellertransactiondata = array
	(
		"userId"=>$selluserId,
		"orderId"=>$selltradeId,
		"type"=>$sellType,
		"currency"=>$sellfirstCurrency,
		"secondcurrency"=>$sellsecondCurrency,
		"amount"=>$amount,
		"price"=>$sellPrice,
		"total"=>$CalculatesellTotal,
		"fee"=>$sellFee,
		"comment"=>$sellcomment,
		"date"=>$date,
		"time"=>$time,
		"status"=>"active"
		);
	$this->db->insert('transaction_history',$sellertransactiondata);
	return $insid;
}
function removeOrder($id,$status,$inserted)
{
	
	$request_time=date("Y-m-d h:i:s"); 
	$this->db->where('trade_id',$id);  
	$query	=	$this->db->update('coin_order',array('status'=>"filled",'tradetime'=>$request_time));  // update status "filled" into coin order
	if($query)
	{   
		$this->get_theft_fee($id);  //coin theft
		if($status=="Buy")
		{
			$data = array('buyerStatus'=>"active");
			$this->db->where('tempId',$inserted);  
			$this->db->where('buyorderId',$id);  
		}
		else
		{
			$data = array('sellerStatus'=>"active");
			$this->db->where('tempId',$inserted);  
			$this->db->where('sellorderId',$id);  
		}
		$this->db->update('ordertemp',$data);  // update status "active" into order temp
		
		$trade = $this->getCoinorder($id);
		$tradetradeId 			= $trade->trade_id;
		$tradeuserId 			= $trade->userId;
		$tradePrice 			= $trade->Price;
		$tradeAmount 			= $trade->Amount;
		$tradeFee 				= $trade->Fee;
		$tradeType 				= $trade->Type;
		$tradeTotal 			= $trade->Total;
		$tradefirstCurrency 	= $trade->firstCurrency;
		$tradesecondCurrency 	= $trade->secondCurrency;
		$orderDate 				= $trade->orderDate;
		$orderTime 				= $trade->orderTime;
		if($tradeType=="Buy")
		{
			$con_result = $this->conscutive_order($tradeAmount,$tradefirstCurrency,$tradesecondCurrency,$tradeuserId,$tradePrice);
				//  +  BTC  USD -
			$userbalance 		= $this->fetchuserbalancebyId($tradeuserId,$tradesecondCurrency);
				// $amountBalance 		= 	$tradeAmount-$tradeFee;
			$updatebuyBalance 		=	$userbalance+$tradeAmount;
			$this->db->where('userId',$tradeuserId); 
			if($tradesecondCurrency=="EUR")
			{
				$this->db->update('balance',array('EUR'=>$updatebuyBalance));
			}
			else if($tradesecondCurrency=="NLG")
			{
				$this->db->update('balance',array('NLG'=>$updatebuyBalance));
			}
			else if($tradesecondCurrency=="GTS")
			{
				$this->db->update('balance',array('GTS'=>$updatebuyBalance));
			} 

		}
		else
		{
				//   -  BTC  USD  +
			$userbalance = $this->fetchuserbalancebyId($tradeuserId,$tradefirstCurrency);
			$con_result = $this->conscutive_sellorder($tradeAmount,$tradefirstCurrency,$tradesecondCurrency,$tradeuserId,$tradePrice);
				// $amountBalance 		= $tradeTotal-$tradeFee;
			$updatesellBalance 	= $userbalance+$tradeTotal-$tradeFee;
			$this->db->where('userId',$tradeuserId); 
			if($tradefirstCurrency=="EUR")
			{
				$this->db->update('balance',array('EUR'=>$updatesellBalance));
			}else if($tradefirstCurrency=="NLG")
			{
				$this->db->update('balance',array('NLG'=>$updatesellBalance));
			} 
			else if($tradefirstCurrency=="GTS")
			{
				$this->db->update('balance',array('GTS'=>$updatesellBalance));
			} 

		}
		$notifydata = array(
			"userId"=>$tradeuserId,
			"type"=>$tradeType,
			"currency"=>$tradefirstCurrency,
			"orderId"=>$tradetradeId,
			"orderAmount"=>$tradeAmount,
			"orderPrice"=>$tradePrice,
			"date"=>$orderDate,
			"time"=>$orderTime,
			"status"=>"unread"
			);
		$this->db->insert('notification',$notifydata);
		return true;
	}
	else
	{
		return false;
	}
}
function conscutive_order($tradeAmount,$tradefirstCurrency,$tradesecondCurrency,$tradeuserId,$tradePrice)
{
	$this->db->where('Amount',$tradeAmount);
	$this->db->where('status',"buyconsecutive");
	$this->db->where('userId',$tradeuserId);
	//$this->db->where('Price',$tradePrice);
	$this->db->where('firstCurrency',$tradefirstCurrency);
	$this->db->where('secondCurrency',$tradesecondCurrency);
	$this->db->update('coin_order',array('status'=>'active'));
	return true;
}
function conscutive_sellorder($tradeAmount,$tradefirstCurrency,$tradesecondCurrency,$tradeuserId,$tradePrice)
{
	$this->db->where('Amount',$tradeAmount);
	$this->db->where('status',"sellconsecutive");
	$this->db->where('userId',$tradeuserId);
	//$this->db->where('Price',$tradePrice);
	$this->db->where('firstCurrency',$tradefirstCurrency);
	$this->db->where('secondCurrency',$tradesecondCurrency);
	$this->db->update('coin_order',array('status'=>'active'));
	return true;
}
function get_theft_fee($id)
{
	$date    = date('Y-m-d');
	$time    = date("h:i:s");
	$this->db->where('trade_id',$id);
	$query=$this->db->get('coin_order');
	if($query->num_rows() >= 1)
	{
		$row 	= 	$query->row();
		$fee	=	$row->Fee;
		$userId	=	$row->userId;
		$Type	=	$row->Type;
		if($Type == "Buy")
		{
			$theftCurrency	=	$row->secondCurrency;
		}
		else
		{
			$theftCurrency	=	$row->firstCurrency;
		}
		$data = array(
			'userId'=>$userId,
			'theftAmount'=>$fee,
			'theftCurrency'=>$theftCurrency,
			'date'=>$date,
			'time'=>$time
			);
		$this->db->insert('coin_theft',$data);
		return true;
	}
	else
	{
		return false;
	}
}
function checkbuyOrdertemp($id)
{
	$this->db->select_sum('filledAmount','totalamount');
	$this->db->where('buyorderId',$id);  
	$query	=	$this->db->get('ordertemp'); 
	if($query->num_rows() >= 1)
	{
		$row = $query->row();
		return $row->totalamount;
	}
	else
	{
		return false;
	}
}
function checkOrdertemp($id)
{
	$this->db->select_sum('filledAmount','totalamount');
	$this->db->where('sellorderId',$id);  
	$query	=	$this->db->get('ordertemp'); 
	if($query->num_rows() >= 1)
	{
		$row = $query->row();
		return $row->totalamount;
	}
	else
	{
		return false;
	}
}
function checkOrdertempprice($id)
{
	$this->db->select_sum('filledPrice','totalprice');
	$this->db->where('sellorderId',$id);  
	$query	=	$this->db->get('ordertemp'); 
	if($query->num_rows() >= 1)
	{
		$row = $query->row();
		return $row->totalprice;
	}
	else
	{
		return false;
	}
}
function getParticularsellorders($buyPrice,$buyuserId,$firstCurrency,$secondCurrency)
{
	$names = array('active', 'partially');
	$this->db->where('firstCurrency',$firstCurrency);  
	$this->db->where('secondCurrency',$secondCurrency);  
	$this->db->where('userId !=',$buyuserId);  
	$this->db->where('Price <=',$buyPrice);  
	$this->db->where('Type',"Sell"); 
	$this->db->order_by('Price','asc');  	
	$this->db->where_in('status', $names);
	$query	=	$this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{
		return $query->result();	
	}
	else
	{
		return false;
	}
}
function get_gulden_sellorders($buyprice)
{
	$url="https://www.gulden.net/api/order_book/";
	$header[] = "Accept: application/json";
	$header[] = "Accept-Encoding: gzip";
	$ch = curl_init();
	curl_setopt( $ch, CURLOPT_HTTPHEADER, $header );
	curl_setopt($ch, CURLOPT_ENCODING , "gzip");
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
	curl_setopt( $ch, CURLOPT_URL, $url );
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
	$response = json_decode(curl_exec($ch));
	$rt =  curl_getinfo($ch);
	$res = $response->asks;
	$i=0;
	$our_bitsel="";
	//print_r($res);
	foreach($res as $val)
	{
	//echo "i=".$i;
		if($i==10)
		{
			break;
		}
		$price = $val[0];
		$price_num = (float)$price;
		$price_con = $price_num+2;
		echo $price_con."<=".$buyprice;
		if($price_con<=$buyprice)
		{
			echo "jfhdsfkj";
			$our_bitsel[$i]['sell_price']=$val[0];
			$our_bitsel[$i]['sell_amount']=$val[1];
			$our_bitsel[$i]['sell_id']='gulden';
			$our_bitsel[$i]['sell_user_id']='gulden_id';
			$our_bitsel[$i]['sell_first_cur']='BTC';
			$our_bitsel[$i]['sell_second_cur']='USD';
		}
		$i++;
	}
	return $our_bitsel;
}
function getBuyorders()
{
	$names = array('active', 'partially');
	$this->db->where('Type',"Buy");  
	$this->db->order_by('Price','desc');  
	$this->db->where_in('status', $names);
	$query	=	$this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{
		return $query->result();	
	}
	else
	{
		return false;
	}
}
function getCoinorder($id)
{
	$this->db->where('trade_id',$id);  
	$query	=	$this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{                
		return $query->row();	
	}   
	else
	{      
		return false;		
	}
}
/* Trading Functionality - Buy / Sell Order  */
function fetchCoinorder($type,$one,$two)
{
	$names = array('active', 'partially');
	$this->db->select('*');
	$this->db->where('firstCurrency',$one);  
	$this->db->where('secondCurrency',$two);  
	$this->db->where('Type',$type);  
	if($type=="Sell")
	{
		$this->db->order_by('Price','asc');
	}
	else
	{
		$this->db->order_by('Price','desc');
	}
	$this->db->where_in('status', $names);
	$this->db->select_sum("Amount",'amount');
	// $this->db->limit(7);
	$this->db->from('coin_order');
	$this->db->group_by("Price");
	$query = $this->db->get('');
	//$query	=	$this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{                
		return  $query->result();	
	}   
	else
	{      
		return false;		
	}
}
function fetchCoinorder_limit_amnt($type,$one,$two,$Price)
{
	$names = array('active', 'partially');
	//$this->db->select('*');
	$this->db->where('firstCurrency',$one);  
	$this->db->where('secondCurrency',$two);  
	$this->db->where('Type',$type);  
	$this->db->where('Price',$Price);  
	if($type=="Sell")
	{
		$this->db->order_by('Price','asc');
	}
	else
	{
		$this->db->order_by('Price','desc');
	}
	$this->db->where_in('status', $names);
	$this->db->select_sum("Amount",'amount'); 
	$this->db->group_by("Price"); 
	$query = $this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{                
		return  $query->row();	
	}   
	else
	{      
		return false;		
	}
}
function fetchCoinorder_limit($type,$one,$two)
{
	$names = array('active', 'partially');
	//$this->db->select('*');
	$this->db->where('firstCurrency',$one);  
	$this->db->where('secondCurrency',$two);  
	$this->db->where('Type',$type);  
	if($type=="Sell")
	{
		$this->db->order_by('Price','asc');
	}
	else
	{
		$this->db->order_by('Price','desc');
	}
	$this->db->where_in('status', $names); 
	$this->db->group_by("Price"); 
	$query = $this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{                
		return  $query->result();	
	}   
	else
	{      
		return false;		
	}
}
function fetchCoinorder_book($type,$one,$two)
{
	$names = array('active', 'partially');
	$this->db->select('*');
	$this->db->where('firstCurrency',$one);  
	$this->db->where('secondCurrency',$two);  
	$this->db->where('Type',$type);  
	if($type=="sell")
	{
		$this->db->order_by('Price','asc');
	}
	else
	{
		$this->db->order_by('Price','desc');
	}
	$this->db->where_in('status', $names);
	$this->db->select_sum("Amount",'amount');
	//$this->db->limit(7);
	$this->db->from('coin_order');
	$this->db->group_by("Price");
	$query = $this->db->get('');
	//$query	=	$this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{                
		return  $query->result();	
	}   
	else
	{      
		return false;		
	}
}
function fetchHistory($one,$two)
{
	$names = array('filled', 'partially');
	$this->db->where('firstCurrency',$one);  
	$this->db->where('secondCurrency',$two);  
	$this->db->where_in('status', $names);
	$this->db->order_by('trade_id','desc');
	$query	=	$this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{                
		return $query->result();	
	}   
	else
	{      
		return false;		
	}
}
function fetchCurrencyBalance($currency)
{
	$accport_currency_session	=	$this->session->userdata('accport_currency');  
	$customer_user_id		=	$this->session->user_id;
	$this->db->where('userId',$customer_user_id);  
	$query=$this->db->get('balance'); 
	if($query->num_rows() >= 1)
	{                
		$row = $query->row();	
		if($currency=="BTC")
		{
			$value = $row->BTC;
		}
		else if($currency=="LTC")
		{
			$value = $row->LTC;
		}
		else if($currency=="USD")
		{
			$value = $row->USD;
		}
		else if($currency=="ZAR")
		{
			$value = $row->ZAR;
		}
		else if($currency=="ETH")
		{
			$value = $row->ETH;
		}
		else if($currency=="WCN")
		{
			$value = $row->WCN;
		}
		else if($currency=="EUR")
		{
			$value = $row->EUR;
		}
		else if($currency=="NLG")
		{
			$value = $row->NLG;
		}
		else if($currency=="GTS")
		{
			$value = $row->GTS;
		}
		if(isset($value))
		{
			return $value;
		}
		else
		{
			return false;
		}
	}   
	else
	{      
		return "0";		
	}
}
function postCommentmodel()
{
	$date	=date('Y-m-d');
	$time	=date("h:i:s");
	$datetime = $date." ".$time;
	$client_username	=	$this->session->userdata('pearlet_client_username');   
	$inputpost 	= trim($this->input->post('inputpost'));
	$userId		= $this->input->post('userId');
	$this->db->select('username');
	$this->db->where('client_id',$userId);
	$query=$this->db->get('users');
	if($query->num_rows() >= 1)
	{                

		$row = $query->row();	
		$username=$row->username;

	}

	$data = array(
		"message"=>$inputpost,
		"userId"=>$userId,
		"username"=>$username,
		"datetime"=>$datetime
		);
	$this->db->insert('chat',$data);
	return "success";
}
function refreshChatmodel()
{
	$sql = "SELECT * FROM (SELECT `chat_id`, `userId`, `username`, `message` FROM `chat` ORDER BY `chat_id` DESC LIMIT 30) tmp ORDER BY `chat_id` ASC";
	$query	=	$this->db->query($sql); 
	if($query->num_rows() >= 1)
	{                
		return $query->result();	
	}   
	else
	{      
		return false;		
	}
}
function insertPMdetails()
{
	$customer_user_id = $this->session->user_id;
	$dateofpayment	=date('Y-m-d');
	$timeofpayment	=date("h:i:s");
	$currency=$this->input->post('PAYMENT_UNITS');
	$method="PM";
	$amt=$this->input->post('PAYMENT_AMOUNT');
	$fee=$amt*0.5/100;
	$amount=$amt-$fee;
	$data	=	array(
		'user_id'=>$customer_user_id,
		'currency'=>$currency,
		'payment_method'=>$method,
		'amount'=>$amount,
		'payment_date'=>$dateofpayment,
		'payment_time'=>$timeofpayment,
		'status'=>"processing"
		);
	$query = $this->db->insert('payment_details',$data);
	if($query)
	{
		return "success"; 
	}
	else
	{
		return "failure";
	}
}
function usdpmSuccess()
{
	$customer_user_id = $this->session->user_id;
	$data = array('status'=>"success");
	$this->db->where('user_id',$customer_user_id);
	$query = $this->db->update('payment_details',$data);
	if($query)
	{
		return true;
	}
}
function fetch_notif()
{
	$customer_user_id        =        $this->session->user_id; 
	$this->db->where('userId',$customer_user_id);
	$res_notif        =        $this->db->get('notification');
	if($res_notif->num_rows() >= 1)
	{
		return $res_notif->result();
	}
	else
	{
		return false;
	}
}
function remove_notif_model($id)
{
	$this->db->where('notifyId',$id);
	$deleted = $this->db->delete('notification');
	if($deleted)
	{
		return true;
	}
	else
	{
		return false;
	}
}
function fetchnotifcount()
{ 
	$pearlet_client_mailid                =        $this->session->user_id;
	$this->db->where('userId',$pearlet_client_mailid);                  
	$this->db->where('status',"unread");
	$query        =        $this->db->get('notification'); 
	if($query->num_rows() >= 1)
	{                
		$cnt        =        $query->num_rows();                         
	}   
	else
	{      
		$cnt=0;        
	}
	return $cnt;
}
function get_active_order($first_currency,$second_currency)
{
	$names = array('active', 'partially');
	$customer_user_id   =    $this->session->user_id;
	$this->db->order_by('trade_id','desc');
	$this->db->where('userId',$customer_user_id);                  
	$this->db->where('firstCurrency',$first_currency);  
	$this->db->where('secondCurrency',$second_currency);              
	$this->db->where_in('status', $names);                  
	$query=$this->db->get('coin_order');
	if($query->num_rows() >= 1)
	{
		return $query->result();
	}
	else
	{
		return false;
	}
}
function remove_active_model($id)
{	
	$customer_user_id   =    $this->session->user_id;

	$order = $this->getCoinorder($id);
	if($order)
	{
		$userId 				= $order->userId;
		$Type 					= $order->Type;
		$activeAmount 			= $order->Amount;
		$activeTradeid 			= $order->trade_id;
		$Total 					= $order->Total;
		$activePrice 			= $order->Price;
		$fee                    = $order->Fee;
		$tradesecondCurrency 	= $order->secondCurrency;
		$tradefirstCurrency 	= $order->firstCurrency;
		if($Type=="Buy")
		{
			$activefilledAmount = $this->checkOrdertempdetails($activeTradeid,$Type);
			if($activefilledAmount)
			{
				$currentbtcbalance = $this->fetchCurrencyBalance($tradesecondCurrency);

				$updatebtcbalance = $currentbtcbalance+$activefilledAmount;

				$this->db->where('userId',$userId);
				$this->db->update('balance',array($tradesecondCurrency=>$updatebtcbalance));

				$activefilledAmount = $activeAmount-$activefilledAmount;
				$activeCalcTotal = $activefilledAmount*$activePrice+$fee;
			}
			else
			{
				$activefilledAmount = $activeAmount;
				$activeCalcTotal = $Total;
			}
			$activeCalcTotal = $activefilledAmount*$activePrice;		 
			$currentbalance = $this->fetchuserbalancebyId($customer_user_id,$tradefirstCurrency);
			$updatebalance = $currentbalance+$activeCalcTotal;
			$this->db->where('userId',$userId); 
			$this->db->update('balance',array($tradefirstCurrency=>$updatebalance)); 

		}
		else if($Type=="Sell")
		{
			$activefilledAmount = $this->checkOrdertempdetails($activeTradeid,$Type);
			if($activefilledAmount)
			{

				$currentusdbalance = $this->fetchCurrencyBalance($tradefirstCurrency);
				$activeCalcTotal = $activefilledAmount*$activePrice;
				$updateusdbalance = $currentusdbalance+$activeCalcTotal;

				$this->db->where('userId',$userId);
				$this->db->update('balance',array($tradefirstCurrency=>$updateusdbalance));

				$activefilledAmount = $activeAmount-$activefilledAmount;
			}
			else
			{
				$activefilledAmount = $activeAmount;

			}
			$tradesecondCurrency = $order->secondCurrency; 
			$currentbalance = $this->fetchCurrencyBalance($tradesecondCurrency); 
			$updatebalance = $currentbalance+$activefilledAmount;
			$this->db->where('userId',$userId); 
			$this->db->update('balance',array($tradesecondCurrency=>$updatebalance)); 
			
		}
	}
	$request_time=date("Y-m-d h:i:s"); 
	$this->db->where('trade_id',$id);                  
	$query	=	$this->db->update('coin_order',array('status'=>"cancelled",'tradetime'=>$request_time));
	if($query)
	{
		// fetch order details	
		$tradetradeId 			= $order->trade_id;
		$tradeuserId 			= $order->userId;
		$tradePrice 			= $order->Price;
		$tradeAmount 			= $order->Amount;
		$tradeFee 				= $order->Fee;
		$tradeType 				= $order->Type;
		$tradeTotal 			= $order->Total;
		$tradefirstCurrency 	= $order->firstCurrency;
		$tradesecondCurrency 	= $order->secondCurrency;
		$orderDate 				= $order->orderDate;
		$orderTime 				= $order->orderTime;
			//Cancel order #165409225
		$comment = "Cancel order #".$tradetradeId;
		$transactiondata = array
		(
			"userId"			=>	$tradeuserId,
			"orderId"			=>	$tradetradeId,
			"type"				=>	"Cancel",
			"currency"			=>	$tradefirstCurrency,
			"secondcurrency"	=>	$tradesecondCurrency,
			"amount"			=>	$tradeAmount,
			"price"				=>	$tradePrice,
			"total"				=>	$tradeTotal,
			"comment"			=>	$comment,
			"date"				=>	$orderDate,
			"time"				=>	$orderTime,
			"status"			=>	"active"
			);
		$this->db->insert('transaction_history',$transactiondata);
	}
	return true;
}

/*function remove_active_model($id)
{
	$order = $this->getCoinorder($id);
	if($order)
	{
		$userId 				= $order->userId;
		$Type 					= $order->Type; 
		$activeAmount 			= $order->Amount;
		$activeTradeid 			= $order->trade_id;
		$Total 					= $order->Total;
		$activePrice 			= $order->Price;
		$fee                    = $order->Fee;
		 $tradesecondCurrency 	= $order->secondCurrency;
		 $tradefirstCurrency 	= $order->firstCurrency;
		if($Type=="Buy")
		{
		    $activefilledAmount = $this->checkOrdertempdetails($activeTradeid,$Type); 
			if($activefilledAmount)
			{
				$currentbtcbalance = $this->fetchCurrencyBalance($tradefirstCurrency);

				$updatebtcbalance = $currentbtcbalance+$activefilledAmount;

				$this->db->where('userId',$userId);
				$this->db->update('balance',array($tradefirstCurrency=>$updatebtcbalance));

				$activefilledAmount = $activeAmount-$activefilledAmount;
				$activeCalcTotal = $activefilledAmount*$activePrice+$fee;
			}
			else
			{

				 $activefilledAmount = $activeAmount;
				 $activeCalcTotal = $Total;
			} 
		
			//$activeCalcTotal = $activefilledAmount*$activePrice;
			
			if($tradefirstCurrency=="BTC")
			{
				$currentbalance = $this->fetchCurrencyBalance($tradefirstCurrency);
			}
			elseif ($tradefirstCurrency=="LTC")
			{
                 $currentbalance = $this->fetchCurrencyBalance($tradefirstCurrency);
			}
			else if($tradefirstCurrency=="WCN")
			{
				$currentbalance = $this->getEcurrencybal($tradefirstCurrency);
			}else if($tradefirstCurrency=="EUR")
			{
				$currentbalance = $this->getEcurrencybal($tradefirstCurrency);
			}
			else if($tradefirstCurrency=="NLG")
			{
				$currentbalance = $this->getEcurrencybal($tradefirstCurrency);
			}
			else if($tradefirstCurrency=="GTS")
			{
				$currentbalance = $this->getEcurrencybal($tradefirstCurrency);
			}else
			{
				$currentbalance = $this->getEcurrencybal($tradefirstCurrency);
			}
		

			$updatebalance = $currentbalance+$activeCalcTotal;
			$this->db->where('userId',$userId);
			if($tradefirstCurrency=="BTC")
			{
				$this->db->update('balance',array('BTC'=>$updatebalance));
			}
			else if($tradefirstCurrency=="LTC")
			{
				$this->db->update('balance',array('LTC'=>$updatebalance));
			}
			else if($tradefirstCurrency=="USD")
			{
				$this->db->update('balance',array('USD'=>$updatebalance));
			}
			else if($tradefirstCurrency=="ZAR")
			{
				$this->db->update('balance',array('ZAR'=>$updatebalance));
			}
			else if($tradefirstCurrency=="ETH")
			{
				$this->db->update('balance',array('ETH'=>$updatebalance));
			}
			else if($tradefirstCurrency=="WCN")
			{
				$this->db->update('balance',array('WCN'=>$updatebalance));
			}else if($tradefirstCurrency=="EUR")
			{
				$this->db->update('balance',array('EUR'=>$updatebalance));
			}else if($tradefirstCurrency=="NLG")
			{
				$this->db->update('balance',array('NLG'=>$updatebalance));
			}else if($tradefirstCurrency=="GTS")
			{
				$this->db->update('balance',array('GTS'=>$updatebalance));
			}
		
		}
		else if($Type=="Sell")
		{
			$activefilledAmount = $this->checkOrdertempdetails($activeTradeid,$Type);
			if($activefilledAmount)
			{

			    $currentusdbalance = $this->fetchCurrencyBalance($tradesecondCurrency);
			
			    $activeCalcTotal = $activefilledAmount*$activePrice; 
			  
			    
			    $updateusdbalance = $currentusdbalance+$activeCalcTotal-$fee; 

				$this->db->where('userId',$userId);
				$this->db->update('balance',array($tradesecondCurrency=>$updateusdbalance));

				$activefilledAmount = $activeAmount-$activefilledAmount;
			}
			else
			{
				$activefilledAmount = $activeAmount;
				 $activeCalcTotal = $Total;
			}
			$tradesecondCurrency = $order->firstCurrency;
			
				if($tradesecondCurrency=="BTC")
			{
				$currentbalance = $this->fetchCurrencyBalance($tradesecondCurrency);
			}
			elseif ($tradesecondCurrency=="LTC")
			{
                 $currentbalance = $this->fetchCurrencyBalance($tradesecondCurrency);
			}
			else if($tradesecondCurrency=="WCN")
			{
				$currentbalance = $this->getEcurrencybal($tradesecondCurrency);
			}
			else if($tradesecondCurrency=="EUR")
			{
				$currentbalance = $this->getEcurrencybal($tradesecondCurrency);
			}
			else if($tradesecondCurrency=="NLG")
			{
				$currentbalance = $this->getEcurrencybal($tradesecondCurrency);
			}
			else if($tradesecondCurrency=="GTS")
			{
				$currentbalance = $this->getEcurrencybal($tradesecondCurrency);
			}
			else
			{
				$currentbalance = $this->getEcurrencybal($tradesecondCurrency);

			}
			
			$updatebalance = $currentbalance+$activeCalcTotal;
			$this->db->where('userId',$userId);
			if($tradesecondCurrency=="BTC")
			{
				$this->db->update('balance',array('BTC'=>$updatebalance));
			}
			else if($tradesecondCurrency=="LTC")
			{
				$this->db->update('balance',array('LTC'=>$updatebalance));
			}
			else if($tradesecondCurrency=="USD")
			{
				$this->db->update('balance',array('USD'=>$updatebalance));
			}
				else if($tradesecondCurrency=="ZAR")
			{
				$this->db->update('balance',array('ZAR'=>$updatebalance));
			}
			else if($tradesecondCurrency=="ETH")
			{
				$this->db->update('balance',array('ETH'=>$updatebalance));
			}
			else if($tradesecondCurrency=="WCN")
			{
				$this->db->update('balance',array('WCN'=>$updatebalance));
			}else if($tradesecondCurrency=="EUR")
			{
				$this->db->update('balance',array('EUR'=>$updatebalance));
			}else if($tradesecondCurrency=="NLG")
			{
				$this->db->update('balance',array('NLG'=>$updatebalance));
			}else if($tradesecondCurrency=="GTS")
			{
				$this->db->update('balance',array('GTS'=>$updatebalance));
			}
			
			
		}
	}
	$request_time=date("Y-m-d h:i:s"); 
	$this->db->where('trade_id',$id);                  
	$query	=	$this->db->update('coin_order',array('status'=>"cancelled",'tradetime'=>$request_time));
	if($query)
	{
		// fetch order details	
		$tradetradeId 			= $order->trade_id;
		$tradeuserId 			= $order->userId;
		$tradePrice 			= $order->Price;
		$tradeAmount 			= $order->Amount;
		$tradeFee 				= $order->Fee;
		$tradeType 				= $order->Type;
		$tradeTotal 			= $order->Total;
		$tradefirstCurrency 	= $order->firstCurrency;
		$tradesecondCurrency 	= $order->secondCurrency;
		$orderDate 				= $order->orderDate;
		$orderTime 				= $order->orderTime;
			//Cancel order #165409225
			$comment = "Cancel order #".$tradetradeId;
			$transactiondata = array
									(
										"userId"			=>	$tradeuserId,
										"orderId"			=>	$tradetradeId,
										"type"				=>	"Cancel",
										"currency"			=>	$tradefirstCurrency,
										"secondcurrency"	=>	$tradesecondCurrency,
										"amount"			=>	$tradeAmount,
										"price"				=>	$tradePrice,
										"total"				=>	$tradeTotal,
										"comment"			=>	$comment,
										"date"				=>	$orderDate,
										"time"				=>	$orderTime,
										"status"			=>	"active"
									);
			$this->db->insert('transaction_history',$transactiondata);
	}
	return true;
}*/
function update_noti()
{
	$customer_user_id	=	$this->session->user_id; 
	$this->db->where('userId',$customer_user_id);          
	$this->db->update('notification',array('status'=>'read'));        
}
function checkOrdertempdetails($id,$type)
{
	$this->db->select_sum('filledAmount','totalamount');
	if($type=="Buy")
	{
		$this->db->where('buyorderId',$id);  
	}
	else
	{
		$this->db->where('sellorderId',$id);  
	}
	$query	=	$this->db->get('ordertemp'); 
	if($query->num_rows() >= 1)
	{
		$row = $query->row();
		return $row->totalamount;
	}
	else
	{
		return false;
	}
}
function checkOrderbalance($currency)
{
	$customer_user_id   	=   $this->session->user_id;
	$names = array('active', 'partially');
	$this->db->where('userId',$customer_user_id);      
	if($currency=='USD')
	{
		$this->db->where('Type',"Buy");
		$this->db->select_sum('Total','totalamount');
		$this->db->where('secondCurrency',$currency);         		
	}
	else
	{
		$this->db->where('Type',"Sell"); 
		$this->db->where('firstCurrency',$currency);                  
		$this->db->select_sum('Amount','totalamount');
	}
	$this->db->where_in('status', $names);
	$this->db->select('trade_id');
	$this->db->select('Type');
	$this->db->from('coin_order');	
	$query	=	$this->db->get('');
	if($query->num_rows() >=1)
	{
		$result 		= $query->result();
		foreach($result as $trade)
		{
			$activeAmount 	= $trade->totalamount;
			if($activeAmount != null)
			{
				$trade_id 		= $trade->trade_id;
				$activeType 	= $trade->Type;
				$activefilledAmount = 	$this->forOnorders($trade_id,$activeType);
				if($activefilledAmount)
				{
					$activefilledAmount = $activeAmount-$activefilledAmount;
				}
				else
				{
					$activefilledAmount = $activeAmount;
				}
				return $activeAmount;
			}
			else
			{
				return false;
			}
		}
	}
	else
	{
		return false;
	}
}
function fetchchatlog()
{
	$query	=	$this->db->get('chat');
	if($query->num_rows() >= 1)
	{
		return $query->result();
	}
	else
	{
		return false;
	}
}
function checkapi($api_key,$secret)
{
	$this->db->where('apiKey',$api_key);
	$this->db->where('secretKey',$secret);
	$query	=	$this->db->get('userapikey');
	if($query->num_rows() >= 1)
	{
		return true;
	}
	else
	{
		return false;
	}
}
function checkapikey()
{
	$customer_user_id	=	$this->session->user_id; 
	$this->db->where('userId',$customer_user_id);
	$query	=	$this->db->get('userapikey');
	if($query->num_rows() >= 1)
	{
		return $row = $query->result();
	}
	else
	{
		return false;
	}
}
function updateApikey($api_key)
{
	$customer_user_id	=	$this->session->user_id; 
	$keyname = $this->input->post('keyname');
	if(!$keyname)
	{
		$keyname = "n/a";
	}
	$data = array(
		'apiKey'=>$api_key,
		'keyname'=>$keyname
		);
	$this->db->where('user_id',$customer_user_id);
	$query	=	$this->db->update('users',$data);
	if($query)
	{
		return true;
	}
	else
	{
		return false;
	}
}
function createApikey($api_key,$secret)
{
	$cur_date = date('Y-m-d');
	$cur_time = date('H:i:s');
	$customer_user_id	=	$this->session->user_id; 
	$keyname = $this->input->post('keyname');
	if(!$keyname)
	{
		$keyname = "n/a";
	}
	$data = array(
		'userId'=>$customer_user_id,
		'apiKey'=>$api_key,
		'secretKey'=>$secret,
		'date'=>$cur_date,
		'time'=>$cur_time,
		'keyname'=>$keyname,
		'status'=>'active'
		);
	$query	=	$this->db->insert('userapikey',$data);
	if($query)
	{
		return true;
	}
	else
	{
		return false;
	}
}
function enableApikey()
{
	$apiAccess = $this->input->post('apiAccess');
	$id = $this->input->post('id');
	$this->db->where('keyId',$id);
	$data = array('apiAccess'=>$apiAccess);
	$query	=	$this->db->update('userapikey',$data);
	if($query)
	{
		return true;
	}
	else
	{
		return false;
	}
}
function disableApikey($id)
{
	$this->db->delete('userapikey',array('keyId'=>$id));
	return true;
}
function getUserdetailbyapi($key)
{	
	$this->db->where('apiKey',$key);
	$query	=	$this->db->get('userapikey');
	if($query->num_rows() >= 1)
	{
		$row = $query->row();
		return $row->userId;
	}
	else
	{
		return false;
	}
}
function checkinfoMethod($api_key)
{
	$access = array('1', '3');
	$this->db->where_in('apiAccess',$access);
	$this->db->where('apiKey',$api_key);
	$query	=	$this->db->get('userapikey');
	if($query->num_rows() >= 1)
	{
		return true;
	}
	else
	{
		return false;
	}
}
function fetchapibalance($getUserid)
{
	$this->db->where('userId',$getUserid);
	$query	=	$this->db->get('balance');
	if($query->num_rows() >= 1)
	{
		return $row = $query->row();
	}
	else
	{
		return false;
	}
}
function getActiveorders($getUserid)
{
	$this->db->where('status','active');
	$this->db->where('userId',$getUserid);
	$query	=	$this->db->get('coin_order');
	if($query->num_rows() >= 1)
	{
		$cnt = $query->num_rows();
	}
	else
	{
		$cnt = 0;
	}
	return $cnt;
}
function checktradeMethod($api_key)
{
	$access = array('2', '3');
	$this->db->where_in('apiAccess',$access);
	$this->db->where('apiKey',$api_key);
	$query	=	$this->db->get('userapikey');
	if($query->num_rows() >= 1)
	{
		return true;
	}
	else
	{
		return false;
	}
}
function getTranshistorys($id)
{	
	$this->db->where('userId',$id);
	$query	=	$this->db->get('transaction_history');
	if($query->num_rows() >= 1)
	{
		return $query->result();
	}
	else
	{
		return false;
	}
}
function getTradehistory($id)
{	
	$this->db->where('userId',$id);  
	$this->db->where('status',"filled");  
	$query=$this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{
		return $query->result();
	}
	else
	{
		return false;
	}
}
function getCancelorders($id)
{	
	$this->db->where('userId',$id);  
	$this->db->where('status',"cancelled");  
	$query=$this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{
		return $query->result();
	}
	else
	{
		return false;
	}
}
function getOpenOrder($id)
{	
	$this->db->where('userId',$id);  
	$this->db->where('status',"active");  
	$query=$this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{
		return $query->result();
	}
	else
	{
		return false;
	}
}
function getOrderbook($id)
{	
	//$this->db->where('userId',$id);  
	$this->db->where('status',"active");  
	$query=$this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{
		return $query->result();
	}
	else
	{
		return false;
	}
}
function lowestaskprice($firstCurrency,$secondCurrency)
{
	$names = array('active', 'partially');
	$this->db->where('firstCurrency',$firstCurrency);  
	$this->db->where('secondCurrency',$secondCurrency); 
	$this->db->where('Type',"Buy"); 	
	$this->db->where_in('status',$names); 	
	//$this->db->order_by("orderDate","desc");  
	//$this->db->order_by("orderTime","desc");
	$this->db->order_by("Price","desc");  
	$this->db->limit(1);  
	$query=$this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{
		$row = $query->row();
		return $row->Price;
	}
	else
	{
		return false;
	}
}
function lowestaskpriceTop($firstCurrency,$secondCurrency)
{
	$names = array('active', 'partially');
	$this->db->where('firstCurrency',$firstCurrency);  
	$this->db->where('secondCurrency',$secondCurrency); 
	$this->db->where('Type',"Sell"); 	
	$this->db->where_in('status',$names); 	
	$this->db->order_by("Price","asc");  
	//$this->db->where_not_in("Price",0);  
	$this->db->limit(1);  
	$query=$this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{
		$row = $query->row();
		return $row->Price;
	}
	else
	{
		return false;
	}
}




function get_todays_open($firstCurrency,$secondCurrency)
{
	$orderDate = date('Y-m-d');
	$names = array('filled', 'partially');
	$this->db->where('orderDate',$orderDate);  
	$this->db->where('firstCurrency',$firstCurrency);  
	$this->db->where('secondCurrency',$secondCurrency); 
	$this->db->order_by("orderDate","asc"); 
	//$this->db->where('Type',"Sell"); 	
	$this->db->limit(1);
	$this->db->where_not_in('status',$names); 	
	$query = $this->db->get('coin_order');
	if($query->num_rows())
	{
		$row = $query->row();
		return $row->Price;
	}
	else
	{
		return false;
	}
}
function lowestprice($firstCurrency,$secondCurrency)
{
	$orderDate = date('Y-m-d');
	$this->db->where('orderDate',$orderDate);  
	$names = array('filled', 'partially');
	$this->db->where('firstCurrency',$firstCurrency);  
	$this->db->where('secondCurrency',$secondCurrency);  
	//$this->db->where('Type',"Buy");  
	$this->db->where_in('status',$names); 
	// $this->db->order_by("orderDate","asc"); 	
	$this->db->order_by('Price',"asc");  
	$this->db->limit(1);  
	$query = $this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{
		$row = $query->row();
		return $row->Price;
	}
	else
	{
		return false;
	}
}
function highestprice($firstCurrency,$secondCurrency)
{
	$orderDate = date('Y-m-d');
	$this->db->where('orderDate',$orderDate);  
	$names = array('filled', 'partially');
	$this->db->where('firstCurrency',$firstCurrency);  
	$this->db->where('secondCurrency',$secondCurrency);  
	//$this->db->where('Type',"Buy");  
	$this->db->where_in('status',$names); 
	// $this->db->order_by("orderDate","asc"); 	
	$this->db->order_by('Price',"desc");  
	$this->db->limit(1);  
	$query = $this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{
		$row = $query->row();
		return $row->Price;
	}
	else
	{
		return false;
	}
}
function highestbidprice($firstCurrency,$secondCurrency)
{
	$names = array('active', 'partially');
	$this->db->where('firstCurrency',$firstCurrency);  
	$this->db->where('secondCurrency',$secondCurrency);  
	$this->db->where('Type',"Buy");  
	$this->db->where_in('status',$names); 	
	$this->db->order_by('Price',"desc");  
	$this->db->limit(1);  
	$query=$this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{
		$row = $query->row();
		return $row->Price;
	}
	else
	{
		return false;
	}
}
// order history - sorting - pair
function ajaxpairforordermodel()
{
	//btc_usd
	$customer_user_id		=	$this->session->user_id; 
	$keyword	=	$this->input->post('keyword');
	$names = array('active', 'partially');
	if($keyword!='All')
	{
		$exp = explode('_',$keyword);
		$firstCurrency  = strtoupper($exp[0]);
		$secondCurrency = strtoupper($exp[1]);
		$this->db->where('firstCurrency',$firstCurrency);  
		$this->db->where('secondCurrency',$secondCurrency);  
	}	
	$this->db->where('userId',$customer_user_id);  
	$this->db->where_in('status', $names);
	$query	=	$this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{                
		return $query->result();			 
	}   
	else
	{      
		return false;		
	}
}
// order history - sorting - type
function ajaxtypeforordermodel()
{
	$customer_user_id		=	$this->session->user_id; 
	$keyword	=	$this->input->post('keyword');
	//$names = array('active', 'partially');
	if($keyword!='all')
	{
		//$this->db->where('description',$keyword);  
		$query = $this->db->query("SELECT with_id,payment,request_date,status,amount,currency FROM `coin_withdraw` where userId='$customer_user_id' and payment='$keyword' UNION SELECT req_id,payment,request_date,status,amount,currency FROM `withdraw_request` where user_id='$customer_user_id' and payment='$keyword'");	
	}	
	else
	{
		$query = $this->db->query("SELECT with_id,payment,request_date,status,amount,currency FROM `coin_withdraw` where userId='$customer_user_id'  UNION SELECT req_id,payment,request_date,status,amount,currency FROM `withdraw_request` where user_id='$customer_user_id'");
	}
	// $this->db->where_not_in('status','pending');
	// $this->db->where('userId',$customer_user_id);  
	//$query	=	$this->db->get('coin_withdraw'); 
	if($query->num_rows() >= 1)
	{                
		return $query->result();			 
	}   
	else
	{      
		return false;		
	}
}
function deposit_order()
{
	$customer_user_id		=	$this->session->user_id; 
	$keyword	=	$this->input->post('keyword');
	//$names = array('active', 'partially');
	if($keyword!='all')
	{
		$this->db->where('type',$keyword);  
	}	
	//$this->db->where_not_in('status','pending');
	$this->db->where('user_id',$customer_user_id);  
	$query	=	$this->db->get('deposit_payment'); 
	if($query->num_rows() >= 1)
	{                
		return $query->result();			 
	}   
	else
	{      
		return false;		
	}
}
//deposit status sorting
function deposit_orderstatus_model()
{
	$customer_user_id		=	$this->session->user_id; 
	$keyword	=	$this->input->post('keyword');
	if($keyword!='all')
	{
		$this->db->where('status',$keyword);  
	}
	//$this->db->where_not_in('status','pending');
	$this->db->where('user_id',$customer_user_id);  
	$query	=	$this->db->get('deposit_payment'); 
	if($query->num_rows() >= 1)
	{                
		return $query->result();			 
	}   
	else
	{      
		return false;		
	}
}
// order history - sorting - status
function ajaxstatusforordermodel()
{
	$customer_user_id		=	$this->session->user_id; 
	$keyword	=	$this->input->post('keyword');
	if($keyword!='all')
	{
		$this->db->where('status',$keyword);  
		$query = $this->db->query("SELECT with_id,payment,request_date,status,amount,currency FROM `coin_withdraw` where userId='$customer_user_id' and status='$keyword' UNION SELECT req_id,payment,request_date,status,amount,currency FROM `withdraw_request` where user_id='$customer_user_id' and status='$keyword'");
	}
	else
	{
		$query = $this->db->query("SELECT with_id,payment,request_date,status,amount,currency FROM `coin_withdraw` where userId='$customer_user_id' UNION SELECT req_id,payment,request_date,status,amount,currency FROM `withdraw_request` where user_id='$customer_user_id'");
	}
	// $this->db->where_not_in('status','pending');
	// $this->db->where('userId',$customer_user_id);  
	// $query	=	$this->db->get('coin_withdraw'); 

	if($query->num_rows() >= 1)
	{                
		return $query->result();			 
	}   
	else
	{      
		return false;		
	}
}
function gettimeago($hours, $minutes) 
{
	return time() - 60 * $minutes - 3600 * $hours;
}
function trading_start_date()
{
	$this->db->order_by('orderDate','asc');
	$this->db->limit(1);
	$query = $this->db->get('coin_order');
	if($query->num_rows())
	{
		$row = $query->row();
		return $row->orderDate;
	}
	else
	{
		return false;
	}
}
function forLowHigh_old()
{ 	
	//SELECT emp_name, dept_name FROM Employee e JOIN Register r ON e.emp_id=r.emp_id JOIN Department d ON r.dept_id=d.dept_id;
	$source			=	date('Y-m-d H:i:s', $this->gettimeago(25.5, 0));
	$desitnation	=	date('Y-m-d H:i:s', $this->gettimeago(1.5, 0));
	$names 	= array('filled', 'partially');
	$accport_currency_session	=	$this->session->userdata('accport_currency_session');  
	if($accport_currency_session=="")
	{
		$accport_currency_session	=	"btc_usd";
	}
	$exp = explode('_',$accport_currency_session);
	$firstCurrency  = strtoupper($exp[0]);
	$secondCurrency = strtoupper($exp[1]);
	$this->db->select_sum('a.Amount','volume');
	$this->db->select_min('a.Price', 'low');
	$this->db->select_max('a.Price', 'high');
	$this->db->select_min('b.askPrice', 'open');
	$this->db->select_max('b.askPrice', 'close');
	$this->db->select('a.orderTime', 'orderTime');
	$this->db->from('coin_order as a');          
	$this->db->join('ordertemp as b', 'a.pair  = b.pair');   
	$this->db->where('a.datetime BETWEEN "'. $source. '" and "'. $desitnation.'"');
	$this->db->where('b.datetime BETWEEN "'. $source. '" and "'. $desitnation.'"');
	$this->db->where_in('a.status', $names);
	/* $this->db->where('firstCurrency',$firstCurrency);  
	$this->db->where('secondCurrency',$secondCurrency);  */
	$query	=	$this->db->get(); 
	if($query->num_rows() >= 1)
	{                
		return $row = $query->result();			 
	}   
	else
	{      
		return false;		
	}
}
function sixmonth_chart_data($source)
{
	$cryptocoin_userid = $this->session->userdata('cryptocoin_userid');
	$dtime 			= strtotime($source);
	$source 		= date("Y-m-d", strtotime($source));
	$destination 	= date("Y-m-d", strtotime('+7 days', $dtime));
	
	$orderDate = date('Y-m-d');
	$names = array('filled', 'partially');
	$this->db->where("orderDate",$source);
	// $this->db->where("orderDate <= '$destination'");
	//$this->db->where('Type',"Sell"); 	
	
	$this->db->where_not_in('status',$names); 	
	$query = $this->db->get('coin_order');
	if($query->num_rows())
	{
		$row = $query->row();
		return $row->Price;
	}
	else
	{
		return false;
	}
}
function threemonth_chart_data($source)
{	
	$cryptocoin_userid = $this->session->userdata('cryptocoin_userid');
	$dtime 			= strtotime($source);
	$source 		= date("Y-m-d", strtotime($source));
	$destination 	= date("Y-m-d", strtotime('+7 days', $dtime));
	
	$orderDate = date('Y-m-d');
	$names = array('filled', 'partially');
	$this->db->where("orderDate",$source);
	// $this->db->where("orderDate <= '$destination'");
	//$this->db->where('Type',"Sell"); 	
	
	$this->db->where_not_in('status',$names); 	
	$query = $this->db->get('coin_order');
	if($query->num_rows())
	{
		$row = $query->row();
		return $row->Price;
	}
	else
	{
		return false;
	}
}
function chart_data($source)
{
	$cryptocoin_userid = $this->session->userdata('cryptocoin_userid');
	$dtime 			= strtotime($source);
	$source 		= date("Y-m-d", strtotime($source));
	$destination 	= date("Y-m-d H:i:s", strtotime('+1 day', $dtime));
	
	$orderDate = date('Y-m-d');
	$names = array('filled', 'partially');
	$this->db->where('orderDate',$source);  
	
	$this->db->order_by("orderDate","asc"); 
	//$this->db->where('Type',"Sell"); 	
	$this->db->limit(1);
	$this->db->where_not_in('status',$names); 	
	$query = $this->db->get('coin_order');
	if($query->num_rows())
	{
		$row = $query->row();
		return $row->Price;
	}
	else
	{
		return false;
	}
}
function forLowHighchart_zar($source,$interval,$type=NULL)
{  
//print_r($source); exit;
    // echo $source;
    //SELECT emp_name, dept_name FROM Employee e JOIN Register r ON e.emp_id=r.emp_id JOIN Department d ON r.dept_id=d.dept_id;
    //source is 2014-03-25 17:00
    //desitnation is 2014-03-25 17:30
        // $destination = date('Y-m-d H:i:s', strtotime($source . ' +1 day'));

	$exp         = explode(' ',$source);
	$curdate     = "";
	$time         = "";

    // $source = strtotime($source);
    // $destination = date("Y-m-d H:i:s", strtotime('+1 hour', $source));
	if($type=='day')
	{
		$destination = date('Y-m-d H:i:s', strtotime($source . ' +1 day'));
	}

    // $destination = $curdate." ".$destTime;

/*     $source            =    date('Y-m-d H:i:s', $this->gettimeago(25.5, 0));
$desitnation    =    date('Y-m-d H:i:s', $this->gettimeago(1.5, 0)); */
$names     = array('filled', 'partially');

$currency_session    =    "eur_nlg"; 
$exp = explode('_',$currency_session);
$firstCurrency  = strtoupper($exp[0]);
$secondCurrency = strtoupper($exp[1]); 
$this->db->select_min('Price', 'low');
$this->db->select_max('Price', 'high');
$this->db->select_min('Price', 'open');
$this->db->select_max('Price', 'close');
$this->db->select('orderTime', 'orderTime');
    //$this->db->from('coin_order');          
    // $this->db->join('ordertemp as b', 'a.pair  = b.pair');   
    // $this->db->where('a.datetime BETWEEN "'. $source. '" and "'. $destination.'"');
    // $this->db->where('b.datetime BETWEEN "'. $source. '" and "'. $destination.'"');

$this->db->where("datetime >= '".$source."'");
$this->db->where("datetime <= '".$destination."'");

    // $this->db->where("b.datetime >= '$source'");
    // $this->db->where("b.datetime <= '$destination'");

$this->db->where_in('status', $names);
$this->db->where(array('firstCurrency' =>$firstCurrency, 'secondCurrency' =>$secondCurrency)); 
$this->db->group_by("trade_id");
$query    =    $this->db->get('coin_order'); 
if($query->num_rows() >= 1)
{                
	return $row = $query->row();             
}   
else
{      
	return false;        
}
}
function coinbal($bal)
{
	if($bal==''){
		$bal='btc';
	}
	$this->db->where('status',1);   
	$query=$this->db->get('coin_balance'); 
	if($query->num_rows() >= 1)
	{
		$row = $query->row();
		return $row->$bal;
	}
	else
	{
		return false;
	}
}
function forLowHighchart_gts($source,$interval,$type=NULL)
{  
//print_r($source); exit;
    // echo $source;
    //SELECT emp_name, dept_name FROM Employee e JOIN Register r ON e.emp_id=r.emp_id JOIN Department d ON r.dept_id=d.dept_id;
    //source is 2014-03-25 17:00
    //desitnation is 2014-03-25 17:30
        // $destination = date('Y-m-d H:i:s', strtotime($source . ' +1 day'));

	$exp         = explode(' ',$source);
	$curdate     = "";
	$time         = "";

    // $source = strtotime($source);
    // $destination = date("Y-m-d H:i:s", strtotime('+1 hour', $source));
	if($type=='day')
	{
		$destination = date('Y-m-d H:i:s', strtotime($source . ' +1 day'));
	}

    // $destination = $curdate." ".$destTime;

/*     $source            =    date('Y-m-d H:i:s', $this->gettimeago(25.5, 0));
$desitnation    =    date('Y-m-d H:i:s', $this->gettimeago(1.5, 0)); */
$names     = array('filled', 'partially');

$currency_session    =    "gts_nlg"; 
$exp = explode('_',$currency_session);
$firstCurrency  = strtoupper($exp[0]);
$secondCurrency = strtoupper($exp[1]); 
$this->db->select_min('Price', 'low');
$this->db->select_max('Price', 'high');
$this->db->select_min('Price', 'open');
$this->db->select_max('Price', 'close');
$this->db->select('orderTime', 'orderTime');
    //$this->db->from('coin_order');          
    // $this->db->join('ordertemp as b', 'a.pair  = b.pair');   
    // $this->db->where('a.datetime BETWEEN "'. $source. '" and "'. $destination.'"');
    // $this->db->where('b.datetime BETWEEN "'. $source. '" and "'. $destination.'"');

$this->db->where("datetime >= '".$source."'");
$this->db->where("datetime <= '".$destination."'");

    // $this->db->where("b.datetime >= '$source'");
    // $this->db->where("b.datetime <= '$destination'");

$this->db->where_in('status', $names);
$this->db->where(array('firstCurrency' =>$firstCurrency, 'secondCurrency' =>$secondCurrency)); 
$this->db->group_by("trade_id");
$query    =    $this->db->get('coin_order'); 
if($query->num_rows() >= 1)
{                
	return $row = $query->row();             
}   
else
{      
	return false;        
}
}
function forLowHighchart_ltc($source,$interval,$type=NULL)
{  
//print_r($source); exit;
    // echo $source;
    //SELECT emp_name, dept_name FROM Employee e JOIN Register r ON e.emp_id=r.emp_id JOIN Department d ON r.dept_id=d.dept_id;
    //source is 2014-03-25 17:00
    //desitnation is 2014-03-25 17:30
        // $destination = date('Y-m-d H:i:s', strtotime($source . ' +1 day'));

	$exp         = explode(' ',$source);
	$curdate     = "";
	$time         = "";

    // $source = strtotime($source);
    // $destination = date("Y-m-d H:i:s", strtotime('+1 hour', $source));
	if($type=='day')
	{
		$destination = date('Y-m-d H:i:s', strtotime($source . ' +1 day'));
	}

    // $destination = $curdate." ".$destTime;

/*     $source            =    date('Y-m-d H:i:s', $this->gettimeago(25.5, 0));
$desitnation    =    date('Y-m-d H:i:s', $this->gettimeago(1.5, 0)); */
$names     = array('filled', 'partially');

$currency_session    =    "btc_ltc"; 
$exp = explode('_',$currency_session);
$firstCurrency  = strtoupper($exp[0]);
$secondCurrency = strtoupper($exp[1]); 
$this->db->select_min('Price', 'low');
$this->db->select_max('Price', 'high');
$this->db->select_min('Price', 'open');
$this->db->select_max('Price', 'close');
$this->db->select('orderTime', 'orderTime');
    //$this->db->from('coin_order');          
    // $this->db->join('ordertemp as b', 'a.pair  = b.pair');   
    // $this->db->where('a.datetime BETWEEN "'. $source. '" and "'. $destination.'"');
    // $this->db->where('b.datetime BETWEEN "'. $source. '" and "'. $destination.'"');

$this->db->where("datetime >= '".$source."'");
$this->db->where("datetime <= '".$destination."'");

    // $this->db->where("b.datetime >= '$source'");
    // $this->db->where("b.datetime <= '$destination'");

$this->db->where_in('status', $names);
$this->db->where(array('firstCurrency' =>$firstCurrency, 'secondCurrency' =>$secondCurrency)); 
$this->db->group_by("trade_id");
$query    =    $this->db->get('coin_order'); 
if($query->num_rows() >= 1)
{                
	return $row = $query->row();             
}   
else
{      
	return false;        
}
}
function forLowHighchart_eth($source,$interval,$type=NULL)
{  
//print_r($source); exit;
    // echo $source;
    //SELECT emp_name, dept_name FROM Employee e JOIN Register r ON e.emp_id=r.emp_id JOIN Department d ON r.dept_id=d.dept_id;
    //source is 2014-03-25 17:00
    //desitnation is 2014-03-25 17:30
        // $destination = date('Y-m-d H:i:s', strtotime($source . ' +1 day'));

	$exp         = explode(' ',$source);
	$curdate     = "";
	$time         = "";

    // $source = strtotime($source);
    // $destination = date("Y-m-d H:i:s", strtotime('+1 hour', $source));
	if($type=='day')
	{
		$destination = date('Y-m-d H:i:s', strtotime($source . ' +1 day'));
	}

    // $destination = $curdate." ".$destTime;

/*     $source            =    date('Y-m-d H:i:s', $this->gettimeago(25.5, 0));
$desitnation    =    date('Y-m-d H:i:s', $this->gettimeago(1.5, 0)); */
$names     = array('filled', 'partially');

$currency_session    =    "btc_eth"; 
$exp = explode('_',$currency_session);
$firstCurrency  = strtoupper($exp[0]);
$secondCurrency = strtoupper($exp[1]); 
$this->db->select_min('Price', 'low');
$this->db->select_max('Price', 'high');
$this->db->select_min('Price', 'open');
$this->db->select_max('Price', 'close');
$this->db->select('orderTime', 'orderTime');
    //$this->db->from('coin_order');          
    // $this->db->join('ordertemp as b', 'a.pair  = b.pair');   
    // $this->db->where('a.datetime BETWEEN "'. $source. '" and "'. $destination.'"');
    // $this->db->where('b.datetime BETWEEN "'. $source. '" and "'. $destination.'"');

$this->db->where("datetime >= '".$source."'");
$this->db->where("datetime <= '".$destination."'");

    // $this->db->where("b.datetime >= '$source'");
    // $this->db->where("b.datetime <= '$destination'");

$this->db->where_in('status', $names);
$this->db->where(array('firstCurrency' =>$firstCurrency, 'secondCurrency' =>$secondCurrency)); 
$this->db->group_by("trade_id");
$query    =    $this->db->get('coin_order'); 
if($query->num_rows() >= 1)
{                
	return $row = $query->row();             
}   
else
{      
	return false;        
}
}


function hoursRange($source, $upper = 23.5, $step = 0.5, $format = NULL) 
{
	$exp = explode(' ',$source);
	$curdate = $exp[0];
	$lower = $exp[1];
	$i = 0;
	if ($format === NULL) {
        $format = 'H:i'; // 9:30pm
    }
    $times = array();
    foreach(range($lower, $upper, $step) as $increment) 
    {
    	$i++;
    	$increment = number_format($increment, 2);
    	list($hour, $minutes) = explode('.', $increment);
    	$date = new DateTime($hour . ':' . $minutes * .6);
    	$times[$i] = $curdate." ".$date->format($format);
    }
    return $times;
}
function hoursRange2($lower = 0, $destination = 3, $step = 0.5, $last_testcount) 
{
	$exp = explode(' ',$destination);
	$curdate = $exp[0];
	$upperr = $exp[1];
	$format = NULL;
	if ($format === NULL) {
        $format = 'H:i'; // 9:30pm
    }
    $times = array();
    foreach(range($lower, $upperr, $step) as $increment) 
    {
    	$last_testcount++;
    	$increment = number_format($increment, 2);
    	list($hour, $minutes) = explode('.', $increment);
    	$date = new DateTime($hour . ':' . $minutes * .6);
    	$times[$last_testcount] = $curdate." ".$date->format($format);
    }
    return $times;
}
function orderDepth()
{
//SELECT emp_name, dept_name FROM Employee e JOIN Register r ON e.emp_id=r.emp_id JOIN Department d ON r.dept_id=d.dept_id;
//source is 2014-03-25 17:00
//desitnation is 2014-03-25 17:30
/* $exp = explode(' ',$source);
$curdate = $exp[0];
$time = $exp[1];
$dtime = strtotime($time);
$destTime = date("H:i", strtotime('+30 minutes', $dtime));
$destination = $curdate." ".$destTime;
 */
/* $source	=	date('Y-m-d H:i:s', $this->gettimeago(25.5, 0));
$desitnation	=	date('Y-m-d H:i:s', $this->gettimeago(1.5, 0)); */
$names = array('active', 'partially');
$currency_session	=	"btc_usd";
$exp = explode('_',$currency_session);
$firstCurrency  = strtoupper($exp[0]);
$secondCurrency = strtoupper($exp[1]);
$this->db->select_sum('a.Amount','amount');
$this->db->select_min('b.askPrice', 'price');
$this->db->select_max('b.askPrice', 'close');
$this->db->select('a.orderTime', 'orderTime');
$this->db->from('coin_order as a');          
$this->db->join('ordertemp as b', 'a.pair  = b.pair');   
$this->db->where_in('a.status', $names);
$this->db->where(array('a.firstCurrency' =>$firstCurrency, 'a.secondCurrency' =>$secondCurrency,'b.firstCurrency' =>$firstCurrency,'b.secondCurrency' =>$secondCurrency)); 
$query	=	$this->db->get(); 
if($query->num_rows() >= 1)
{                
	return $row = $query->row();	 
}   
else
{      
	return false;	
}
}
function forOnorders($id,$type)
{
	$this->db->select_sum('filledAmount','totalamount');
	if($type=="Buy")
	{
		$this->db->where('buyorderId',$id);  
	}
	else
	{
		$this->db->where('sellorderId',$id);  
	}
	$query	=	$this->db->get('ordertemp'); 
	if($query->num_rows() >= 1)
	{
		$row = $query->row();
		return $row->totalamount;
	}
	else
	{
		return false;
	}
}
function know_gen_ques_count()
{ 
	$this->db->where('ques_type_id',1);  	
	$query	=	$this->db->get('ticket_knowledge'); 
	if($query->num_rows() >= 1)
	{                
		$cnt=$query->num_rows();			 
	}   
	else
	{      
		$cnt=0;	
	}
	return $cnt;
}
function know_api_ques_count()
{ 
	$this->db->where('ques_type_id',2);  	
	$query	=	$this->db->get('ticket_knowledge'); 
	if($query->num_rows() >= 1)
	{                
		$cnt=$query->num_rows();			 
	}   
	else
	{      
		$cnt=0;	
	}
	return $cnt;
}
function know_meta_ques_count()
{ 
	$this->db->where('ques_type_id',3);  	
	$query	=	$this->db->get('ticket_knowledge'); 
	if($query->num_rows() >= 1)
	{                
		$cnt=$query->num_rows();			 
	}   
	else
	{      
		$cnt=0;	
	}
	return $cnt;
}
function getall_support_update()
{
	$query	=	$this->db->get('ticket_updates'); 
	if($query->num_rows() >= 1)
	{                
		return $query->result(); 		 
	}
}
function get_lasttrade_value($first_currency,$second_currency)
{
	$this->db->select('*')->from('coin_order')->where('firstCurrency',$first_currency)->where('secondCurrency',$second_currency)->order_by('Price', 'desc')->order_by('Amount', 'desc')->order_by('Total', 'desc')->limit(1);
	$query=$this->db->get();
	return $query->result();
}
function getfirstTotal($first_currency,$second_currency,$type)
{
	$this->db->select_sum('Amount','totalamount');
	$this->db->where('Type', $type);
	$this->db->where('firstCurrency', $first_currency);
	$this->db->where('secondCurrency', $second_currency);
	$this->db->where('status', 'active');
	$query	=	$this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{                
		$row = $query->row();
		$cnt = $row->totalamount;
	}   
	else
	{      
		$cnt	=	0;	
	}
	return $cnt;
}
function getsecondTotal($first_currency,$second_currency,$type)
{
	$this->db->select_sum('Total','totalamount');
	$this->db->where('Type', $type);
	$this->db->where('firstCurrency', $first_currency);
	$this->db->where('secondCurrency', $second_currency);
	$this->db->where('status', 'active');
	$query	=	$this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{                
		$row = $query->row();
		$cnt = $row->totalamount;
	}   
	else
	{      
		$cnt	=	0;	
	}
	return $cnt;
}
function viewfaq()
{
	$this->db->where('status','active');
	//$this->db->where(array('status'=>'active','categor');
	$query	= $this->db->get('faq_question');
	if($query->num_rows() >=1)
	{
		return $query->result();
		//return $query->row();
	}
}

function viewfaq_general()
{
	
	$this->db->where(array('status'=>'active','category'=>'general'));
	$query	= $this->db->get('faq_question');
	if($query->num_rows() >=1)
	{
		return $query->result();
		//return $query->row();
	}
}


function viewfaq_trade()
{
	
	$this->db->where(array('status'=>'active','category'=>'trade'));
	$query	= $this->db->get('faq_question');
	if($query->num_rows() >=1)
	{
		return $query->result();
		//return $query->row();
	}
}



function change_mail_model1()
{
	$custome_user_id	=	$this->session->user_id;
	$this->db->where('user_id',$custome_user_id);  	
	$query = $this->db->get('users');
	if($query->num_rows() == 1)
	{
		$row 			= 	$query->row();
		$chgmail		=	$row->temp_id;
	}
	$row = 	$this->get_userdetails($custome_user_id);
	$username 	= 	$row->username;
		//$to 		= 	"rameshnstr@gmail.com";
	$to 		= 	$row->emailid;
	$ip	=	$this->input->ip_address();   
	$this->db->where('id',1);  	
	$query = $this->db->get('site_config');
	if($query->num_rows() == 1)
	{
		$row 			= 	$query->row();
		$admin_email	=	$row->email_id;			 							 
		$companyname	=	$row->company_name;	
		$siteurl		=	$row->siteurl;				
	}
	$str=2;
	$str1=base64_encode($str);
	$confirm	=	"http://webuypearlet.osiztechnologies.com/edit/".$str1;
	/*	GET EMAIL TEMPLATE	START	*/
	$this->db->where('id',8);  	
	$dis_get_email_info = $this->db->get('email_templates')->row();
	$email_from1	=	$dis_get_email_info->from_id;
	$email_subject1	=	$dis_get_email_info->subject;
	$email_content1	=	$dis_get_email_info->message;
	$a	=	array('##USERNAME##'=>$username,'##IP##'=>$ip,'##FROM_EMAIL##'=>$admin_email,'##COMPANYNAME##'=>$companyname,'##ADMIN_EMAIL##'=>$admin_email,'##CONFIRMLINK##'=>$confirm,'##OLDEMAIL##'=>$to,'##NEWEMAIL##'=>$chgmail);
	$email_from	=	strtr($email_from1,$a);	
	$email_content	=	strtr($email_content1,$a);
		/*	GET EMAIL TEMPLATE	END
		$view_smtp_hostname		= $this->getsmtp_hostname;    
		$view_smtp_hostusername	= $this->getsmtp_hostusername;  
		$view_smtp_hostpass		= $this->getsmtp_hostpass; 
		$config['protocol'] = 'smtp'; // mail, sendmail, or smtp    The mail sending protocol.
		$config['smtp_host'] =$view_smtp_hostname; // SMTP Server Address.
		$config['smtp_user'] =$view_smtp_hostusername; // SMTP Username.
		$config['smtp_pass'] =$view_smtp_hostpass; // SMTP Password.
		$config['smtp_port'] = '465'; // SMTP Port.
		$config['smtp_timeout'] = '10'; // SMTP Timeout (in seconds).
		$config['wordwrap'] = TRUE; // TRUE or FALSE (boolean)    Enable word-wrap.
		$config['wrapchars'] = 76; // Character count to wrap at.
		$config['mailtype'] = 'html'; // text or html Type of mail. If you send HTML email you must send it as a complete web page. Make sure you don't have any relative links or relative image              paths otherwise they will not work.
		$config['charset'] = 'utf-8'; // Character set (utf-8, iso-8859-1, etc.).
		$config['validate'] = FALSE; // TRUE or FALSE (boolean)    Whether to validate the email address.
		$config['priority'] = 3; // 1, 2, 3, 4, 5    Email Priority. 1 = highest. 5 = lowest. 3 = normal.
		$config['crlf'] = "\r\n"; // "\r\n" or "\n" or "\r" Newline character. (Use "\r\n" to comply with RFC 822).
		$config['newline'] = "\r\n"; // "\r\n" or "\n" or "\r"    Newline character. (Use "\r\n" to comply with RFC 822).  
		$config['bcc_batch_mode'] = FALSE; // TRUE or FALSE (boolean)    Enable BCC Batch Mode.
		$config['bcc_batch_size']=200; // Number of emails in each BCC batch.	
		$this->email->initialize($config);*/
		$this->common_mail($admin_email,$companyname,$chgmail,$email_subject1,$email_content);  
		return "success";
	}	
	function change_mail_model()
	{
		$chgmail = $this->input->post('inputEmail3');
		$custome_user_id	=	$this->session->user_id;
		$row = 	$this->get_userdetails($custome_user_id);
		$username 	= 	$row->username;
	//$to 		= 	"rameshnstr@gmail.com";
		$to 		= 	$row->emailid;
		$ip	=	$this->input->ip_address();   
		$this->db->where('id',1);  	
		$query = $this->db->get('site_config');
		if($query->num_rows() == 1)
		{
			$row 			= 	$query->row();
			$admin_email	=	$row->email_id;			 							 
			$companyname	=	$row->company_name;	
			$siteurl		=	$row->siteurl;				
		}
		$str=1;
		$str1=base64_encode($str);
		$confirm	=	"http://webuypearlet.osiztechnologies.com/edit/".$str1;
		/*	GET EMAIL TEMPLATE	START	*/
		$this->db->where('id',8);  	
		$dis_get_email_info = $this->db->get('email_templates')->row();
		$email_from1	=	$dis_get_email_info->from_id;
		$email_subject1	=	$dis_get_email_info->subject;
		$email_content1	=	$dis_get_email_info->message;
		$a	=	array('##USERNAME##'=>$username,'##IP##'=>$ip,'##FROM_EMAIL##'=>$admin_email,'##COMPANYNAME##'=>$companyname,'##ADMIN_EMAIL##'=>$admin_email,'##CONFIRMLINK##'=>$confirm,'##OLDEMAIL##'=>$to,'##NEWEMAIL##'=>$chgmail);
		$email_from	=	strtr($email_from1,$a);	
		$email_content	=	strtr($email_content1,$a);
		/*	GET EMAIL TEMPLATE	END	
		$view_smtp_hostname		= $this->getsmtp_hostname;    
		$view_smtp_hostusername	= $this->getsmtp_hostusername;  
		$view_smtp_hostpass		= $this->getsmtp_hostpass; 
		$config['protocol'] = 'smtp'; // mail, sendmail, or smtp    The mail sending protocol.
		$config['smtp_host'] =$view_smtp_hostname; // SMTP Server Address.
		$config['smtp_user'] =$view_smtp_hostusername; // SMTP Username.
		$config['smtp_pass'] =$view_smtp_hostpass; // SMTP Password.
		$config['smtp_port'] = '465'; // SMTP Port.
		$config['smtp_timeout'] = '10'; // SMTP Timeout (in seconds).
		$config['wordwrap'] = TRUE; // TRUE or FALSE (boolean)    Enable word-wrap.
		$config['wrapchars'] = 76; // Character count to wrap at.
		$config['mailtype'] = 'html'; // text or html Type of mail. If you send HTML email you must send it as a complete web page. Make sure you don't have any relative links or relative image              paths otherwise they will not work.
		$config['charset'] = 'utf-8'; // Character set (utf-8, iso-8859-1, etc.).
		$config['validate'] = FALSE; // TRUE or FALSE (boolean)    Whether to validate the email address.
		$config['priority'] = 3; // 1, 2, 3, 4, 5    Email Priority. 1 = highest. 5 = lowest. 3 = normal.
		$config['crlf'] = "\r\n"; // "\r\n" or "\n" or "\r" Newline character. (Use "\r\n" to comply with RFC 822).
		$config['newline'] = "\r\n"; // "\r\n" or "\n" or "\r"    Newline character. (Use "\r\n" to comply with RFC 822).  
		$config['bcc_batch_mode'] = FALSE; // TRUE or FALSE (boolean)    Enable BCC Batch Mode.
		$config['bcc_batch_size']=200; // Number of emails in each BCC batch.	
		$this->email->initialize($config);*/
		$this->common_mail($admin_email,$companyname,$to,$email_subject1,$email_content);  
		$this->db->where('user_id',$custome_user_id);  
		$this->db->update('users',array('temp_id'=>$chgmail));
		return "success";
	}
	function update()
	{
		$custome_user_id	=	$this->session->user_id;
		$this->db->where('user_id',$custome_user_id);  	
		$query = $this->db->get('users');
		if($query->num_rows() == 1)
		{
			$row 			= 	$query->row();
			$chgmail		=	$row->temp_id;
		}
		$empty='';
		$this->db->where('user_id',$custome_user_id);  
		$this->db->update('users',array('emailid'=>$chgmail,'temp_id'=>$empty));
		return true;
	}

	function change_pass_model()
	{
		$oldpass = $this->input->post('oldpassword',true);
		$newpass = $this->input->post('newpassword',true);
		$old = password_verify($oldpass,PASSWORD_DEFAULT); 
		$new = password_hash($newpass,PASSWORD_DEFAULT);
		$custome_user_id	=	$this->session->user_id;
		$this->db->where('id',$custome_user_id);
		$this->db->where('password',$old);   	
		$query = $this->db->get('users');
		if($query->num_rows() == 1)
		{
			$this->db->where('id',$custome_user_id);  
			if($this->db->update('users',array('password'=>$new))==true)
			{
				echo "Your password changed Successfully";
			}
			else
			{
				echo "Error in password updation";
			}
		}else{
			echo "Incorrect old password ".$old;
		}	
	}

	function change_picture_model()
	{
		$file = $this->input->post('file');
		$custome_user_id	=	$this->session->user_id;
		$this->db->where('user_id',$custome_user_id);
		$query = $this->db->get('users');
		if($query->num_rows() == 1)
		{
			$this->db->where('user_id',$custome_user_id);  
			$this->db->update('users',array('profilepicture'=>$file));
		}
	}
	function vprofile($id)
	{
		$query=$this->db->where('user_id',$id);
		$query= $this->db->get('users');
		if($query->num_rows() == 1)
		{
			return $query->row();
		}
	}
	function fetchWallet($type)
	{   
		$this->db->where('type',$type);      
		$this->db->where('status','active');      
		$query=$this->db->get('wallet');	 	     
		if($query->num_rows() >=1)  
		{           
			return $row = $query->row();     
		}      
		else
		{
			return false;
		}
	}

	function updatecreatedAddress($createAddress,$currency,$xpub,$user_id=null)
	{	
		$datetime	=	date('Y-m-d h:i:s');

	// Api request
		if($user_id!="") {
			$customer_user_id	=	$user_id;
		} else {
			$customer_user_id	=	$this->session->user_id;	
		}

		$this->db->where('user_id',$customer_user_id);  
		$this->db->update('coin_address',array($currency=>$createAddress));  
		if($currency=='NLG')
		{

			$this->db->insert('gulden_address',array('address'=>$createAddress,'createddate'=>$datetime,'user_id'=>$customer_user_id));
		} 
		return true;
	}
	function fb()
	{
	//$custome_user_id	=	$this->session->user_id;
	//s$query=$this->db->where('id',$custome_user_id);
		$query=$this->db->get('site_config');
		if($query->num_rows() == 1)
		{
			return $query->row();
		}
	}
	function ajax_check($emailid)
	{   
		$result="";
		$this->db->where('emailid',$emailid);      
		$query=$this->db->get('users');	 	     
		if($query->num_rows() >=1)  
		{           
			$res	=	$query->result();     
			$result	=	"username already";	 		    
			return $result;
		}      
		else
		{
			return false;
		}
	}
	function ajax_check_uname($uname)
	{   
		$result="";
		$this->db->where('username',$uname);      
		$query=$this->db->get('users');	 	     
		if($query->num_rows() >=1)  
		{           
			$res	=	$query->result();     
			$result	=	"username already";	 		    
			return $result;
		}      
		else
		{
			return false;
		}
	}
	function get_minstatus()
	{
		$query=$this->db->get('tradecommission');
		return $query->result();
	}
	function get_chat_status()
	{
		$query = $this->db->get('site_config');
		if($query->num_rows() >=1)  
		{           
			$res	=	$query->row();     
			return $res->live_chat;
		}      
	}
	function get_chatmin()
	{
		$query = $this->db->get('site_config');
		if($query->num_rows()>=1)  
		{           
			$res	=	$query->row();     
			return $res->minamnt_chat;
		}      
	}
//TFA coding starts here
	function check_tfa_user()
	{
		$clientid		=	$this->input->post('clientid'); 
	/*$this->db->where('client_id',$clientid);
	$query = $this->db->get('users');*/ 
	$query = $this->db->query("SELECT * FROM `users` where (client_id='$clientid' OR emailid='$clientid')");
	if($query->num_rows() ==1)
	{
		$row = $query->row();
		return $row->randcode;
	}
} 

function check_tfa_admin()
{
	$email		=	$this->input->post('emailid');
	$this->db->select('randcode');
	$this->db->where('emailid',$email);
	$query = $this->db->get('users');
	return $query->result();
}
function checktfa()
{
	require_once 'GoogleAuthenticator.php';
	$ga 	= new PHPGangsta_GoogleAuthenticator();
	$clientid	=$this->input->post('clientid');
	$secret	=$this->get_secret($clientid);
	$code	=$this->input->post('tfacode');
	$oneCode = $ga->verifyCode($secret,$code,$discrepancy = 1);
	if($oneCode==1)
	{
		$login_date	=	date('Y-m-d');
		$login_time	=	date("h:i:s"); 
		$datetime 	= 	$login_date." ".$login_time;
		$clientid	=	$this->input->post('clientid');   
		$password	=	$this->input->post('password');

		$encpassword = md5($password);
	// $encrypted_pass = $this->simple_encrypt($password);
		$this->db->where('client_id',$clientid);  
	//$this->db->or_where('username', $email_id); 
		$this->db->where('password',$encpassword);      
	//$this->db->where('status','active');      
		$res_loguser	=	$this->db->get('users');
		$row		=	$res_loguser->row();  


		$db_user_id	=	$row->user_id;
		$db_email	=	$row->emailid;
		
		$db_client_id	=	$row->client_id;
		$firstname	=	$row->firstname;
		$lastname	=	$row->lastname;
		$db_name	=	$firstname." ".$lastname;
		$db_name1   =   $row->firstname;
		$username   =   $row->username;
		$db_status	=	$row->status; 
		$sessiondata = array(
			'customer_email_id'  => $db_email,
			'customer_user_id' => $db_user_id,
			'customer_client_id' =>$db_client_id,
			'customer_name' => $db_name, 
			'user_name' => $db_name1
			);

		$this->session->set_userdata($sessiondata);   
		if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
			$ip = $_SERVER['HTTP_CLIENT_IP'];
		} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
			$ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
		} else {
			$ip = $_SERVER['REMOTE_ADDR'];
		} 

		$this->load->library('user_agent');
		$user_browser	=	$this->agent->browser(); 
		$historydata = array(
			'userId'=>$db_user_id,
			'ipAddress'=>$ip,
			'Browser'=>$user_browser,
			'Action'=>"Logged in",
			'datetime'=>$datetime
			);
		$this->db->insert('history',$historydata);
		$data['loginstatus']="1";
		$this->db->where('user_id',$db_user_id);
		$this->db->update('users',$data);

		$this->db->where('id',1);  	
		$query = $this->db->get('site_config');
		if($query->num_rows() == 1)
		{
			$row 			= 	$query->row();
			$admin_email	=	$row->email_id;			 							 
			$companyname	=	$row->company_name;	
			$siteurl		=	$row->siteurl;				
		}

		$this->db->where('userId',$db_user_id);  	
		$query = $this->db->get('history');
		if($query->num_rows() == 1)
		{
			$row 			= 	$query->row();
			$datetime	= strtotime('d-m-Y h:i:s',$row->datetime);			 							 

		}

		if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
			$ip = $_SERVER['HTTP_CLIENT_IP'];
		} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
			$ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
		} else {
			$ip = $_SERVER['REMOTE_ADDR'];
		} 


		return "correct";

	}
	else
	{
		return "wrong";
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
function codegenerating_update()
{
	$customer_user_id		=	$this->session->user_id;
	$email		=	$this->session->userdata('customer_email_id');
	$client_username		=	$this->session->userdata('customer_name');
	if($this->input->post('tfa')=="enable")
	{
		$res_data = $this->get_tfacode();
		$data=array(
			'secret'  => $res_data['secret'],
			'onecode' => $res_data['oneCode'],
			'url'     => $res_data['qrCodeUrl'],
			'randcode'  => $this->input->post('tfa'),
			);
		$this->db->where('user_id',$customer_user_id);
		$qurery=$this->db->update('users',$data);
		/*		Get Admin Details Start		 */ 
		$this->db->where('id',1);  	
		$query = $this->db->get('site_config');
		if($query->num_rows() == 1)
		{
			$row 			= 	$query->row();
			$admin_email	=	$row->email_id;			 							 
			$companyname	=	$row->company_name;	
			$siteurl		=	$row->siteurl;				
		}
		$tfacode = $res_data['secret'];
			//$email = "avsarma91@gmail.com";
		$tfa_admin_status = $this->check_tfa_siteconfig();
		$tfa_status = $this->input->post('tfa');
		if($tfa_admin_status == "enable")
		{
			$status="You can use this secret code for TFA";
		}
		else
		{
			$status="TFA for this site is Disable, so you can use TFA after the TFA status will change to enable by site";
		}
		/*	GET EMAIL TEMPLATE	START	*/
		$this->db->where('id',9);  	
		$dis_get_email_info = $this->db->get('email_templates')->row();
		$email_from1	=	$dis_get_email_info->from_id;
		$email_subject1	=	$dis_get_email_info->subject;
		$email_content1	=	$dis_get_email_info->message;
		$a	=	array('##USERNAME##'=>$client_username,'##FROM_EMAIL##'=>$admin_email,'##COMPANYNAME##'=>$companyname,'##TFASTATUS##'=>$tfa_status,'##EMAIL##'=>$email,'##TFA##'=>$tfacode,'##SITEURL##'=>$siteurl,'##ADMIN_EMAIL##'=>$admin_email,'##STATUS##'=>$status);
		$email_from	=	strtr($email_from1,$a);	
		$email_content	=	strtr($email_content1,$a);
		/*	GET EMAIL TEMPLATE	END	*/ 
		$this->common_mail($admin_email,$companyname,$email,$email_subject1,$email_content); 
	}
	else
	{
		$this->db->where('user_id',$customer_user_id);
		$qurery=$this->db->update('users',array('randcode'=>"disable"));
	}
	return "success";
}
function enable_tfa()
{
	require_once 'GoogleAuthenticator.php';
	$ga = new PHPGangsta_GoogleAuthenticator();
	$customer_user_id		=	$this->session->user_id;
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
			$this->db->update('users',$data);
			
			$users = $this->get_userdetails($customer_user_id);
			if($users)
			{
				$username = $users->username;
				$secret = $users->secret;
				$email = $users->emailid;
				$status = 'Enable';
			}
			else
			{
				$username = "";
				$secret = "";
				$status = '';
				$email = '';
			}
			/*		Get Admin Details Start		 */ 
			$this->db->where('id',1);  	
			$query = $this->db->get('site_config');
			if($query->num_rows() == 1)
			{
				$row 			= 	$query->row();
				$admin_email	=	$row->email_id;			 							 
				$companyname	=	$row->company_name;	
				$siteurl		=	$row->siteurl;				
			}
			/*	GET EMAIL TEMPLATE	START	*/
			$this->db->where('id',8);  	
			$dis_get_email_info = $this->db->get('email_templates')->row();
			$email_from1	=	$dis_get_email_info->from_id;
			$email_subject1	=	$dis_get_email_info->subject;
			$email_content1	=	$dis_get_email_info->message;
			$a	=	array('##USERNAME##'=>$username,'##STATUS##'=>$status,'##SECRET##'=>$secret,'##FROM_EMAIL##'=>$admin_email,'##COMPANYNAME##'=>$companyname,'##SITEURL##'=>$siteurl,'##ADMIN_EMAIL##'=>$admin_email);
			$email_from	=	strtr($email_from1,$a);	
			$email_content	=	strtr($email_content1,$a);
			/*	GET EMAIL TEMPLATE	END	*/ 
			$this->common_mail($admin_email,$companyname,$email,$email_subject1,$email_content); 
		   /* $config['useragent'] = 'CodeIgniter';
            $config['protocol'] = 'smtp';
            //$config['mailpath'] = '/usr/sbin/sendmail';
            $config['smtp_host'] = 'ssl://smtp.googlemail.com'; 
            $config['smtp_user'] = 'bbjegan@gmail.com';
            $config['smtp_pass'] = 'sivakumar';
            $config['smtp_port'] = 465;
            $config['smtp_timeout'] = 5;
            $config['wordwrap'] = TRUE;
            $config['wrapchars'] = 76;
            $config['mailtype'] = 'html';
            $config['charset'] = 'utf-8';
            $config['validate'] = FALSE;
            $config['priority'] = 3;
            $config['newline'] = "\r\n";
            $config['crlf'] = "\r\n";
            $config['bcc_batch_mode'] = FALSE;
            $config['bcc_batch_size'] = 200;

            $this->load->library('email');
            $this->email->initialize($config);
            $this->email->set_newline("\r\n");  

            $this->email->from('bbjegan@gmail.com', $companyname);
            $this->email->to($email); 

            $this->email->subject($email_subject1);
             //$message="Test";
            $this->email->message($email_content);

            $this->email->send();*/
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
    		$this->db->update('users',$data);
    		$users = $this->get_userdetails($customer_user_id);
    		if($users)
    		{
    			$username = $users->username;
    			$secret = $users->secret;
    			$email = $users->emailid;
    			$status = 'Disable';
    		}
    		else
    		{
    			$username = "";
    			$secret = "";
    			$status = '';
    			$email = '';
    		}
    		/*		Get Admin Details Start		 */ 
    		$this->db->where('id',1);  	
    		$query = $this->db->get('site_config');
    		if($query->num_rows() == 1)
    		{
    			$row 			= 	$query->row();
    			$admin_email	=	$row->email_id;			 							 
    			$companyname	=	$row->company_name;	
    			$siteurl		=	$row->siteurl;				
    		}
    		/*	GET EMAIL TEMPLATE	START	*/
    		$this->db->where('id',10);  	
    		$dis_get_email_info = $this->db->get('email_templates')->row();
    		$email_from1	=	$dis_get_email_info->from_id;
    		$email_subject1	=	$dis_get_email_info->subject;
    		$email_content1	=	$dis_get_email_info->message;
    		$a	=	array('##USERNAME##'=>$username,'##STATUS##'=>$status,'##SECRET##'=>$secret,'##FROM_EMAIL##'=>$admin_email,'##COMPANYNAME##'=>$companyname,'##SITEURL##'=>$siteurl,'##ADMIN_EMAIL##'=>$admin_email);
    		$email_from	=	strtr($email_from1,$a);	
    		$email_content	=	strtr($email_content1,$a);
    		/*	GET EMAIL TEMPLATE	END	*/ 
    		$this->common_mail($admin_email,$companyname,$email,$email_subject1,$email_content); 
		/*$config['useragent'] = 'CodeIgniter';
            $config['protocol'] = 'smtp';
            //$config['mailpath'] = '/usr/sbin/sendmail';
            $config['smtp_host'] = 'ssl://smtp.googlemail.com'; 
            $config['smtp_user'] = 'bbjegan@gmail.com';
            $config['smtp_pass'] = 'sivakumar';
            $config['smtp_port'] = 465;
            $config['smtp_timeout'] = 5;
            $config['wordwrap'] = TRUE;
            $config['wrapchars'] = 76;
            $config['mailtype'] = 'html';
            $config['charset'] = 'utf-8';
            $config['validate'] = FALSE;
            $config['priority'] = 3;
            $config['newline'] = "\r\n";
            $config['crlf'] = "\r\n";
            $config['bcc_batch_mode'] = FALSE;
            $config['bcc_batch_size'] = 200;

            $this->load->library('email');
            $this->email->initialize($config);
            $this->email->set_newline("\r\n");  

            $this->email->from('bbjegan@gmail.com', $companyname);
            $this->email->to($email); 

            $this->email->subject($email_subject1);
             //$message="Test";
            $this->email->message($email_content);

            $this->email->send();*/
            return "disable";
        }
        else
        {
        	return "0";
        }
    }
}
function check_logindetails1()
{
	$clientid	=	$this->input->post('clientid');   
	$password	=	$this->input->post('password');  
	$encpassword = md5($password);
	// $encrypted_pass = $this->simple_encrypt($password);
	/*$this->db->where('client_id',$clientid);      
	$this->db->where('password',$encpassword);      
	$res_loguser	=	$this->db->get('users');*/

	$res_loguser = $this->db->query("SELECT * FROM `users` where (client_id='$clientid' OR emailid='$clientid') AND password='$encpassword' ");

	if($res_loguser->num_rows()==1) 
	{ 
		$row = $res_loguser->row(); 
		$db_status	=	$row->status; 
		if($db_status=="active")
		{
			return "active";
		}
		if($db_status=="blocked")
		{
			return "blocked";
		}	
	}
	else
	{ 	
		return "invalid";
	}
}
function get_userstatus($user_id)
{
	$this->db->where('user_id',$user_id);  
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
	$query = $this->db->get('users');
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
function get_tfacode()
{
	require_once 'GoogleAuthenticator.php';
	$ga = new PHPGangsta_GoogleAuthenticator();
	$data['secret'] = $ga->createSecret();
//echo "Secret is: ".$secret."\n\n";
	$data['qrCodeUrl'] = $ga->getQRCodeGoogleUrl('gulden', $data['secret']);
//echo "Google Charts URL for the QR-Code: ".$qrCodeUrl."\n\n";
	$data['oneCode'] = $ga->getCode($data['secret']);
//echo "Checking Code '$oneCode' and Secret '$secret':\n";
	return $data;
}
function check_tfa_siteconfig()
{
	$query = $this->db->get('site_config');
	if($query->num_rows() >= 1)
	{                   
		$row = $query->row();			
		return $row->TFA;			
	} 
	else
	{     
		return false;		
	}
}
function user_check_tfa()
{
	$this->load->database();
	$customer_user_id		=	$this->session->user_id;
	$this->db->where('id',$customer_user_id);
	$query = $this->db->get('users');
	if($query->num_rows() >= 1)
	{                   
		$row = $query->row();			
		return $row->randcode;			
	} 
	else
	{     
		return false;		
	}
}
//TFA coding ends here
function get_status_terms($id)
{
	$this->db->where('pageid',$id);  
	$query	=	$this->db->get('pages'); 
	if($query->num_rows() >= 1)
	{                
		$row = $query->row();			 
		return $row->status;
	}   
	else
	{      
		return false;		
	}
}
function insert_comment()
{
       /*  date_default_timezone_set('Asia/Kolkata');    
       $dftz011 = date_default_timezone_get();*/
       $dtms011 = new DateTime();
       $cd = $dtms011->format('Y-m-d H:i:s');
       $customer_user_id   	=   $this->session->user_id;
       $dateofreg=date('Y-m-d');
       $comment = $this->input->post('comment');
       $id      = $this->input->post('bid');
       $data = array(
       	'bid'=>$id,
       	'comments'=>$comment,
       	'created_date'=>$dateofreg,
       	'status'=>"active",
       	'c_date'=>$cd,
       	'user_id'=>$customer_user_id
       	);
       $query = $this->db->insert('tbl_bloguser_comments',$data);
       return "success";
   }
   function getTransactions($userId) 
   {
   	$this->db->where('userId',$userId);   
   	$get_qry	=	$this->db->get('transaction_history'); 
   	if($get_qry->num_rows()>=1)
   	{
   		return $get_qry->result();  
   	}
   	else
   	{
   		return false;   
   	}
   } 
   function verficationStatus($user_id) 
   {
   	$this->db->where('user_id',$user_id);   
   	$get_qry=$this->db->get('users'); 
   	if($get_qry->num_rows()>=1)
   	{
   		$row=$get_qry->row();  
   		return $row->verfiyStatus;  
   	}
   	else
   	{
   		return false;   
   	}
   }
   function fetchHistorydetails()
   {
   	$customer_user_id		=	$this->session->user_id;
   	$this->db->where('userId',$customer_user_id);      
   	$this->db->order_by('historyId','desc');      
   	$query	=	$this->db->get('history');
   	if($query->num_rows()>0) 
   	{ 
   		$records =  $query->result();
   		return $records;
   	}
   	else
   	{ 
   		return false;  
   	}
   }
   function verification_complete()
   {
   	$date	=	date('Y-m-d');
   	$customer_user_id	=	$this->session->user_id; 
   	$fname = $this->input->post('fname');
   	$lname = $this->input->post('lname');
   	$address = $this->input->post('address');
   	$postal_code = $this->input->post('postal_code');
   	$city = $this->input->post('city');
   	$country = $this->input->post('country');
   	$doc_number = $this->input->post('doc_number');
   	$bdate = $this->input->post('bdate');
   	$bmonth = $this->input->post('bmonth');
   	$byear = $this->input->post('byear');
   	$doc_date = $this->input->post('doc_date');
   	$doc_month = $this->input->post('doc_month');
   	$doc_year = $this->input->post('doc_year');
   	$doc_exp_date = $this->input->post('doc_exp_date');
   	$doc_exp_month = $this->input->post('doc_exp_month');
   	$doc_exp_year = $this->input->post('doc_exp_year'); 

   	$document1 = $_FILES['document1']['name'];   	      
   	$document2 = $_FILES['document2']['name'];   	      
   	$document3 = $_FILES['document3']['name']; 


   	$rnumber1 = $this->session->userdata('rnumber1');	
   	$rnumber2 = $this->session->userdata('rnumber2');	
   	$rnumber3 = $this->session->userdata('rnumber3');	
   	$rnumber4 = $this->session->userdata('rnumber4');	
   	if($document1!="")  
   	{  
   		@list($document1,$ext)=explode(".",$document1);						
   		$images1 = $rnumber1.$document1.".".$ext;	   
   	}  
   	if($document2!="")   
   	{  
   		@list($document2,$ext)=explode(".",$document2);						
   		$images2 = $rnumber2.$document2.".".$ext;	   
   	}  
   	if($document3!="")  
   	{  
   		@list($document3,$ext)=explode(".",$document3);						
   		$images3 = $rnumber3.$document3.".".$ext;	   
   	} 
   	$dob = $byear."-".$bmonth."-".$bdate;	
   	$document_date = $doc_year."-".$doc_month."-".$doc_date;	
   	$document_exp_date = $doc_exp_year."-".$doc_exp_month."-".$doc_exp_date;	

   	$updatedata = array(
   		'user_id'=>$customer_user_id,
   		'fname'=>$fname,
   		'lname'=>$lname,
   		'address'=>$address,
   		'postal_code'=>$postal_code,
   		'city'=>$city,
   		'country'=>$country,
   		'doc_number'=>$doc_number,
   		'dob'=>$dob,
   		'issuedDate'=>$document_date,
   		'expiredDate'=>$document_exp_date,
						//'document1'=>$images1,
						//'document2'=>$images2,
						//'document3'=>$images3,
   		'created_date'=>$date,
   		'verification_status'=>"pending"
   		);

   	$this->db->where('user_id',$customer_user_id);
   	$query = $this->db->update('user_verification',$updatedata);
	//$this->db->last_query(); die;
   	if($query)
   	{
   		return true;
   	}
   	else
   	{
   		return false;
   	}

   }

   function fetchSupportrecord($userId)
   {
   	$this->db->where('user_id',$userId);
   	$this->db->where('parent_id',NULL);   
	// $this->db->group_by('parent_id');
   	$get_qry=$this->db->get('support_detail'); 
   	if($get_qry->num_rows()>=1)
   	{
   		return $get_qry->result();
   	}
   	else
   	{
   		return false;   
   	}
   }
   function fetchSupportlastrecord($userId)
   {
   	$this->db->order_by('id','desc');   
   	$this->db->where('userId',$userId);   
   	$get_qry=$this->db->get('support_detail'); 
   	if($get_qry->num_rows()>=1)
   	{
   		return $row=$get_qry->result();   
   	}
   	else
   	{
   		return false;   
   	}
   }
   function getSupportrecords($id)
   {
	//$this->db->order_by('id','desc');   
   	$this->db->where('id',$id);
   	$this->db->or_where('parent_id',$id);   

   	$get_qry =$this->db->get('support_detail'); 
   	if($get_qry->num_rows()>=1)
   	{
   		return $row=$get_qry->result();   
   	}
   	else
   	{
   		return false;   
   	}
   }  
   function support_complete()
   {
   	$customer_email_id		=	$this->session->userdata('customer_email_id'); 
   	$date = date('Y-m-d');
   	$time = date("h:i A"); 
   	$datetime = $date." ".$time;
   	$customer_user_id		=	$this->session->user_id;
   	$email_id =	$this->session->userdata('customer_email_id');
   	$category 		= $this->input->post('departments');
   	$message 		= $this->input->post('message');
   	$rnumber		=	$this->session->userdata('supportfileSession');  
   	$support_file		=	$_FILES['support_file']['name'];   	      
	//image1            
   	if($support_file!="")  
   	{   
   		@list($support_file,$ext)=explode(".",$support_file);						
   		$images1 = $rnumber.$support_file.".".$ext;	  
   	}  
   	else
   	{
   		$images1 = "empty";
   	}
   	$data = array(
   		'user_id'=>$customer_user_id,
   		'departments'=>$category,
   		'message'=>$message,
   		'file'=>$images1,
   		'created_date'=>$datetime,
   		'email'=>$customer_email_id ,
   		'status'=>"processing"
   		);
   	$query = $this->db->insert('support_detail',$data);
   	if($query)
   	{
   		return true;
   	}
   	else
   	{
   		return false;
   	}
   }
   function particular_support()
   {
   	$customer_email_id		=	$this->session->userdata('customer_email_id'); 
   	$date = date('Y-m-d');
   	$time = date("h:i A"); 
   	$datetime = $date." ".$time;
   	$customer_user_id		=	$this->session->user_id;
   	$email_id =	$this->session->userdata('customer_email_id');
   	$category 		= $this->input->post('departments');
   	$message 		= $this->input->post('message');
   	$rnumber		=	$this->session->userdata('supportfileSession');  
   	$support_file		=	$_FILES['support_file']['name'];   	      
	//image1            
   	if($support_file!="")  
   	{   
   		@list($support_file,$ext)=explode(".",$support_file);						
   		$images1 = $rnumber.$support_file.".".$ext;	  
   	}  
   	else
   	{
   		$images1 = "empty";
   	}
   	$id = $this->session->userdata('sessionSupportid');
   	$data = array(
   		'user_id'=>$customer_user_id,
   		'parent_id'=>$id,
   		'departments'=>$category,
   		'message'=>$message,
   		'file'=>$images1,
   		'created_date'=>$datetime,
   		'email'=>$customer_email_id ,
   		'status'=>"processing"
   		);
   	$query = $this->db->insert('support_detail',$data);
   	if($query)
   	{
   		return true;
   	}
   	else
   	{
   		return false;
   	}
   }
   function getNotificationdetail()
   {
   	$customer_user_id		=	$this->session->user_id;
   	$this->db->where('userId',$customer_user_id);      
   	$query	=	$this->db->get('userNotification');
   	if($query->num_rows()>0) 
   	{ 
   		return $row = $query->row();
   	}
   	else
   	{ 
   		return false;  
   	}
   }
   function addpaypal()
   {
   	$amount = $this->input->post('amount');
   	$pay_deposit_fee =$this->get_paydeposit_fee();
   	$pay_tot_fee = $amount*$pay_deposit_fee/100;
   	$highest_dep_fee = $this->higest_deposit_fee();
   	if($highest_dep_fee >= $pay_tot_fee || $highest_dep_fee==0)
   	{
   		$updatebal = $amount-$pay_tot_fee;
   	}
   	else
   	{
   		$updatebal = $amount-$highest_dep_fee;

   	}
   	$current_date	=	date('Y-m-d'); 
   	$current_time	=	date('H:i A'); 
   	$customer_user_id		=	$this->session->user_id;
   	$customer_email_id		=	$this->session->userdata('customer_email_id');
   	$data = array(
   		'user_id'=>$customer_user_id,
   		'amount'=>$updatebal,
   		'type'=>"paypal",
   		'request_date'=>$current_date,
   		'status'=>'pending'
   		);
   	$this->db->insert('deposit_payment',$data);
   	$last_userinsid=$this->db->insert_id();   
   	if($last_userinsid)
   	{
   		$sessiondata = array(
   			'paypal_id'  => $last_userinsid 
   			);

   		$this->session->set_userdata($sessiondata);    
   	}
   }
   function paypal_update($txid)
   {
   	$current_date	=	date('Y-m-d'); 
   	$current_time	=	date('H:i A'); 
   	$customer_user_id		=	$this->session->user_id;
   	$customer_email_id		=	$this->session->userdata('customer_email_id');
   	$pay_id = $this->session->userdata('paypal_id');
   	$data = array(
   		'txid'=>$txid,
   		);
   	$this->db->where('deposit_id',$pay_id);
   	$this->db->update('deposit_payment',$data);

   	$this->db->where('deposit_id',$pay_id);
   	$query = $this->db->get('deposit_payment');
   	if($query->num_rows())
   	{
   		$row = $query->row();
   		$amount = $row->amount;
   	}
   	else
   	{
   		$amount = '';
   	}
   	$userbalance 		= $this->fetchuserbalancebyId($customer_user_id,"USD");
	/* $paypal_fee = $this->get_paypal_fee();
	$paypal_tot_fee = $amount*$paypal_fee/100;
	$highest_dep_fee = $this->higest_deposit_fee();
	if($highest_dep_fee >= $paypal_tot_fee  || $highest_dep_fee==0)
	{
		$updatebalance = $amount-$paypal_tot_fee;
	}
	else
	{
		$updatebalance = $amount-$highest_dep_fee;
	}
		//$updatebalance = $userbalance + $amount;
	$this->db->update('balance',array('USD'=>$updatebalance)); */
	$email_confirmation = $this->check_emailconformation();
	if($email_confirmation=="off")
	{
		/*		Get Admin Details Start		 */ 
		$this->db->where('id',1);  	
		$query = $this->db->get('site_config');
		if($query->num_rows() == 1)
		{
			$row 			= 	$query->row();
			$admin_email	=	$row->email_id;			 							 
			$companyname	=	$row->company_name;	
			$siteurl		=	$row->siteurl;				
		}
		$userResult = 	$this->get_userdetails($customer_user_id);
		$username 	= 	$userResult->username;
		$to 		= 	$userResult->emailid;
		$ip	=	$this->input->ip_address();    
		/*	GET EMAIL TEMPLATE	START	*/
		$this->db->where('id',9);  	
		$dis_get_email_info = $this->db->get('email_templates')->row();
		$email_from1	=	$dis_get_email_info->from_id;
		$email_subject1	=	$dis_get_email_info->subject;
		$email_content1	=	$dis_get_email_info->message;
		$a	=	array('##USERNAME##'=>$username,'##IP##'=>$ip,'##FROM_EMAIL##'=>$admin_email,'##CURRENCY##'=>'USD','##COMPANYNAME##'=>$companyname,'##AMOUNT##'=>$amount,'##TXID##'=>$txid,'##SITEURL##'=>$siteurl,'##ADMIN_EMAIL##'=>$admin_email);
		$email_from	=	strtr($email_from1,$a);	
		$email_content	=	strtr($email_content1,$a);
		/*	GET EMAIL TEMPLATE	END	*/
		$this->common_mail($admin_email,$companyname,$customer_email_id,$email_subject1,$email_content);  
	}
	return true;
}
function higest_deposit_fee()
{
	$query = $this->db->get('fees_config');
	if($query->num_rows())
	{
		$row = $query->row();
		return $row->high_deposit_fee ;
	}
	else
	{
		return false;
	}
}
//anand API
function withdraw_fee_btc()
{
	$query = $this->db->get('fees_config');
	if($query->num_rows())
	{
		$row = $query->row();
		return $row->withdraw_fee_btc ;
	}
	else
	{
		return false;
	}
}

function get_paypal_fee()
{
	$query = $this->db->get('fees_config');
	if($query->num_rows())
	{
		$row = $query->row();
		return $row->paypal_deposit_fee;
	}
	else
	{
		return false;
	}
}
function get_paypalwith_fee()
{
	$query = $this->db->get('fees_config');
	if($query->num_rows())
	{
		$row = $query->row();
		return $row->paypal_withdraw_fee;
	}
	else
	{
		return false;
	}
}
function get_buy_ripple_fee()
{
	$query = $this->db->get('fees_config');
	if($query->num_rows())
	{
		$row = $query->row();
		return $row->buy_ripple ;
	}
	else
	{
		return false;
	}
}
function check_emailconformation()
{
	$customer_user_id		=	$this->session->user_id;
	$this->db->where('user_id',$customer_user_id);      
	$query	=	$this->db->get('email_confirmation');
	if($query->num_rows() >0) 
	{ 
		$row = $query->row();
		return $row->bank_email;
	}
	else
	{ 
		return false;  
	}
}
function pendingusdamount()
{
	$customer_user_id		=	$this->session->user_id;
	$this->db->where_not_in('status','confirmed');
	$this->db->where('user_id',$customer_user_id);
	$this->db->select_sum('askamount','totamount');
	$query = $this->db->get('international_withdraw');
	if($query->num_rows())
	{
		$row = $query->row();
		return $row->totamount;
	}
	else
	{
		return false;
	}
	
}
function pendingbtcamount()
{
	$customer_user_id		=	$this->session->user_id;
	$this->db->where_not_in('status','confirmed');
	$this->db->where('userId',$customer_user_id);
	$this->db->select_sum('askamount','totamount');
	$query = $this->db->get('coin_withdraw');
	if($query->num_rows())
	{
		$row = $query->row();
		return $row->totamount;
	}
	else
	{
		return false;
	}
	
}
function international_withdraw_req()
{ 
	$customer_user_id		=	$this->session->user_id;
	$currency = $this->input->post('currency');
	$balance = $this->getEcurrencybal($currency); 
	$pending_usd_amount = $this->checkOrderbalance($currency);
	$available_usd = $balance - $pending_usd_amount;
	$amount = $this->input->post('eur_amount');
	$type = $this->input->post('accounttype');
	$purse = $this->input->post('acc_name');
	if($balance >= $amount)
	{
		$ib_withdraw_fee =$this->ib_withdraw_fee();
		$ib_tot_fee = $amount*$ib_withdraw_fee/100;
		$highest_dep_fee = $this->higest_deposit_fee();
		if($highest_dep_fee >= $ib_tot_fee || $highest_dep_fee==0)
		{
			$updatebal = $amount-$ib_tot_fee;
		}
		else
		{
			$updatebal = $amount-$highest_dep_fee;
			//$updatebal = $highest_dep_fee;
		}

		$userbalance = $this->fetchuserbalancebyId($customer_user_id,$currency);
		$updatebalance = $userbalance - $amount;
		$this->db->where('userId',$customer_user_id);
		$this->db->update('balance',array($currency=>$updatebalance));



		$current_date	=	date('Y-m-d'); 
		$current_time	=	date('H:i A'); 
		$customer_user_id		=	$this->session->user_id;
		
		$data = array(
			'acc_name'			=>	$this->input->post('acc_name'),
			'user_id'			=>	$customer_user_id,
			'amount'			=>	$updatebal,
			'askamount'			=>	$amount,
				// 'type'		=>	"withdraw_USD",
				//'city'				=>	$this->input->post('city'),
				//'currency'			=>	$this->input->post('currency'),
			//	'postal_code'		=>	$this->input->post('postal_code'),
				//'iban'				=>	$this->input->post('iban'),
				//'country'			=>	$this->input->post('country'),
				//'bank_country'		=>	$this->input->post('bank_country'),
				//'swift'				=>	$this->input->post('swift'),
				//'bank_name'			=>	$this->input->post('bank_name'),
				//'bank_address'		=>	$this->input->post('bank_address'),
				//'bank_postalcode'	=>	$this->input->post('bank_postalcode'),
				//'bank_city'			=>	$this->input->post('bank_city'),
				//'infermation'		=>	$this->input->post('infermation'),
			'request_date'		=>	$current_date,
			'currency'			=>	$currency,
			'status'			=>	'processing'
			);
		
		if($this->input->post('save_data'))
		{
			$this->db->where('user_id',$customer_user_id);
			$query = $this->db->get('inational_with_userdata');
			if($query->num_rows())
			{
				$this->db->where('user_id',$customer_user_id);
				$this->db->update('inational_with_userdata',$data);
			}
			else
			{
				$this->db->insert('inational_with_userdata',$data);
			}
		}
		
		$this->db->insert('international_withdraw',$data);
		$last_insertid = $this->db->insert_id();
		$token = $this->generateRandomString();
		$withdraw_data = array(
			'request_date'	=>	$current_date,
			'request_time'	=>	$current_time,
			'amount'		=>	$updatebal,
			'askamount'		=>	$amount,
			'status'		=>	"processing",
			'currency'		=>	$currency,
			'payment'		=>	"Bank Deposit",
			'user_id'		=>	$customer_user_id,
			'purse'         =>  $purse,
			'token'			=>	$token,
			'orderid'		=>	$last_insertid,
			);
		$this->db->insert('withdraw_request',$withdraw_data);

		$transdata	=	array(                  
			'userId'		=>	$customer_user_id,
			'type'			=>	"Withdraw",
			'currency'		=>	$currency,  
			'token'			=>	$token,  
			'amount'		=>	$amount,
		//'askamount'=>$askamount,
			'date'			=>	$current_date,   
			'time'			=>	$current_time,   
			'status'		=>	'active'
			);
		$this->db->insert('transaction_history',$transdata);
		/*		Get Admin Details Start		 */ 
		$this->db->where('id',1);  	
		$query = $this->db->get('site_config');
		if($query->num_rows() == 1)
		{
			$row 			= 	$query->row();
			$admin_email	=	$row->email_id;			 							 
			$companyname	=	$row->company_name;	
			$siteurl		=	$row->siteurl;				
		}
		$userResult = 	$this->get_userdetails($customer_user_id);
		$username 	= 	$userResult->username;
		$to 		= 	$userResult->emailid;
	//$to 		= 	"avsarma91@gmail.com";
		$ip			=	$this->input->ip_address();    
		$confirm	=	$siteurl."/gulden/ewithdraw_confirm/".$token;
		$cancel		=	$siteurl."/gulden/ewithdraw_cancel/".$token;
		/*	GET EMAIL TEMPLATE	START	*/
		$this->db->where('id',6);  	
		$dis_get_email_info = $this->db->get('email_templates')->row();
		$email_from1	=	$dis_get_email_info->from_id;
		$email_subject1	=	$dis_get_email_info->subject;
		$email_content1	=	$dis_get_email_info->message;
		$a	=	array('##USERNAME##'=>$username,'##IP##'=>$ip,'##FROM_EMAIL##'=>$admin_email,'##COMPANYNAME##'=>$companyname,'##AMOUNT##'=>$amount,'##PURSE##'=>$purse,'##CURRENCY##'=>$currency,'##SITEURL##'=>$siteurl,'##ADMIN_EMAIL##'=>$admin_email,'##CONFIRMLINK##'=>$confirm,'##CANCELLINK##'=>$cancel);

		//$email_from	=	strtr($email_from1,$a);	
		$email_content	=	strtr($email_content1,$a);  
		/*	GET EMAIL TEMPLATE	END	*/
		$this->common_mail($admin_email,$companyname,$to,$email_subject1,$email_content);  
		return true;						
	}
	else
	{
		return false;
	}
}
function get_iwuserdata()
{
	$customer_user_id		=	$this->session->user_id;
	$this->db->where('user_id',$customer_user_id);
	$query = $this->db->get('inational_with_userdata');
	if($query->num_rows())
	{
		return $query->row();
	}
	else
	{
		return false;
	}
}
function moneypolo_withdraw_req()
{ 
	$amount = $this->input->post('amount');
	$balance = $this->getEcurrencybal('USD');
	$amount = $this->input->post('amount');
	$pending_usd_amount = $this->get_pendingusdamount();
	$available_usd = $balance - $pending_usd_amount;
	$amount = $this->input->post('amount');
	if($balance >= $amount)
	{
		$get_mpwith_fee = $this->get_mpwith_fee();
		$paypal_tot_fee = $amount*$get_mpwith_fee/100;
		$highest_dep_fee = $this->higest_deposit_fee();
		if($highest_dep_fee >= $paypal_tot_fee  || $highest_dep_fee==0)
		{
			$updatebal = $amount-$paypal_tot_fee;
		}
		else
		{
			$updatebal = $amount-$highest_dep_fee;
		}


		$current_date	=	date('Y-m-d'); 
		$current_time	=	date('H:i A'); 
		$customer_user_id		=	$this->session->user_id;

		$userbalance = $this->fetchuserbalancebyId($customer_user_id,"USD");
		$updatebalance = $userbalance - $amount;
		$this->db->where('userId',$customer_user_id);
		$this->db->update('balance',array('USD'=>$updatebalance));

		$data = array(
			'mp_user_name'		=>	$this->input->post('mp_user_name'),
			'mp_acc_name'		=>	$this->input->post('mp_acc_name'),
			'user_id'			=>	$customer_user_id,
			'amount'			=>	$updatebal,
				//'askamount'			=>	$amount,
			'mp_acc_number'		=>	$this->input->post('mp_acc_number'),
			'currency'			=>	$this->input->post('currency'),
			'mp_acc_type'		=>	$this->input->post('mp_acc_type'),
			'request_date'		=>	$current_date,
			'status'			=>	'processing'
			);
		$this->db->insert('withdraw_moneypolo',$data);
		$last_insertid = $this->db->insert_id();
		$token = $this->generateRandomString();
		$withdraw_data = array(
			'request_date'	=>	$current_date,
			'request_time'	=>	$current_time,
			'amount'		=>	$updatebal,
			'askamount'		=>	$amount,
			'status'		=>	"processing",
			'currency'		=>	"USD",
			'payment'	=>	"Moneypolo",
			'user_id'		=>	$customer_user_id,
			'token'		=>	$token,
			'orderid'		=>	$last_insertid,
			);
		$this->db->insert('withdraw_request',$withdraw_data);

		$transdata	=	array(                  
			'userId'=>$customer_user_id,
			'type'=>"Withdraw",
			'currency'=>'USD',  
			'token'=>$token,  
			'amount'=>$amount,
		//'askamount'=>$askamount,
			'date'=>$current_date,   
			'time'=>$current_time,   
			'status'=>'active'
			);
		$this->db->insert('transaction_history',$transdata);
		/*		Get Admin Details Start		 */ 
		$this->db->where('id',1);  	
		$query = $this->db->get('site_config');
		if($query->num_rows() == 1)
		{
			$row 			= 	$query->row();
			$admin_email	=	$row->email_id;			 							 
			$companyname	=	$row->company_name;	
			$siteurl		=	$row->siteurl;				
		}
		$userResult = 	$this->get_userdetails($customer_user_id);
		$username 	= 	$userResult->username;
		$to 		= 	$userResult->emailid;
	//$to 		= 	"avsarma91@gmail.com";
		$ip			=	$this->input->ip_address();    
		$confirm	=	$siteurl."/gulden/ewithdraw_confirm/".$token;
		$cancel		=	$siteurl."/gulden/ewithdraw_cancel/".$token;
		/*	GET EMAIL TEMPLATE	START	*/
		$this->db->where('id',6);  	
		$dis_get_email_info = $this->db->get('email_templates')->row();
		$email_from1	=	$dis_get_email_info->from_id;
		$email_subject1	=	$dis_get_email_info->subject;
		$email_content1	=	$dis_get_email_info->message;
		$a	=	array('##USERNAME##'=>$username,'##IP##'=>$ip,'##FROM_EMAIL##'=>$admin_email,'##COMPANYNAME##'=>$companyname,'##AMOUNT##'=>$amount,'##PURSE##'=>$purse_detail,'##CURRENCY##'=>$currency,'##SITEURL##'=>$siteurl,'##ADMIN_EMAIL##'=>$admin_email,'##CONFIRMLINK##'=>$confirm,'##CANCELLINK##'=>$cancel);
		$email_from	=	strtr($email_from1,$a);	
		$email_content	=	strtr($email_content1,$a);
		/*	GET EMAIL TEMPLATE	END	*/
		$this->common_mail($admin_email,$companyname,$to,$email_subject1,$email_content);  
		return true;
	}
	else
	{
		return false;
	}
}
function international_deposit_req()
{
	$amount = $this->input->post('amount');
	$ib_deposit_fee = $this->ib_deposit_fee();
	$mp_tot_fee = $amount*$ib_deposit_fee/100;
	$highest_dep_fee = $this->higest_deposit_fee();
	if($highest_dep_fee >= $mp_tot_fee || $highest_dep_fee==0)
	{
		$updatebal = $amount-$mp_tot_fee;
	}
	else
	{
		$updatebal = $amount-$highest_dep_fee;
		
	}
	$current_date	=	date('Y-m-d'); 
	$current_time	=	date('H:i A'); 
	$customer_user_id		=	$this->session->user_id;
	$data = array(
		'user_id'			=>	$customer_user_id,
		'amount'			=>	$updatebal,
		'first_name'		=>	$this->input->post('first_name'),
		'last_name'			=>	$this->input->post('last_name'),
		'infermation'		=>	$this->input->post('infermation'),
		'request_date'		=>	$current_date,
		'type'				=>	"Bank Deposit",
		'currency'				=>	$this->input->post('currency'),
		'status'			=>	'pending'
		);
	$this->db->insert('deposit_payment',$data);
	$last_userinsid=$this->db->insert_id(); 
	if($last_userinsid)
	{
		return $last_userinsid;
	}
	else
	{
		return false;
	}
}
function ib_deposit_fee()
{
	$query = $this->db->get('fees_config');
	if($query->num_rows())
	{
		$row = $query->row();
		return $row->inational_deposit_fee;
	}
	else
	{
		return false;
	}
}
function ib_withdraw_fee()
{
	$query 		= $this->db->get('fees_config');
	if($query->num_rows())
	{
		$row = $query->row();
		return $row->inational_withdraw_fee;
	}
	else
	{
		return false;
	}
}

function moneypolo_deposit_req()
{
	$amount = $this->input->post('amount');
	$moneypolo_deposit_fee =$this->moneypolo_deposit_fee();
	$mp_tot_fee = $amount*$moneypolo_deposit_fee/100;
	$highest_dep_fee = $this->higest_deposit_fee();
	if($highest_dep_fee >= $mp_tot_fee || $highest_dep_fee==0)
	{
		$updatebal = $amount-$mp_tot_fee;
	}
	else
	{
		$updatebal = $amount-$highest_dep_fee;
	}
	//$userbalance 		= $this->fetchuserbalancebyId($customer_user_id,"USD");
	$current_date	=	date('Y-m-d'); 
	$current_time	=	date('H:i A'); 
	$customer_user_id		=	$this->session->user_id;
	$data = array(
		'user_id'			=>	$customer_user_id,
		'amount'			=>	$updatebal,
		'first_name'		=>	$this->input->post('first_name'),
		'last_name'			=>	$this->input->post('last_name'),
		'mp_user_name'		=>	$this->input->post('mp_user_name'),
		'infermation'		=>	$this->input->post('infermation'),
		'request_date'		=>	$current_date,
		'type'				=>	"moneypolo",
		'status'			=>	'pending'
		);
	$this->db->insert('deposit_payment',$data);
	$last_userinsid=$this->db->insert_id(); 
	if($last_userinsid)
	{
		return $last_userinsid;
	}
	else
	{
		return false;
	}
}
function moneypolo_deposit_fee()
{
	$query = $this->db->get('fees_config');
	if($query->num_rows())
	{
		$row = $query->row();
		return $row->moneypolo_deposit_fee;
	}
	else
	{
		return false;
	}
}
function mpaccount_details()
{
	$this->db->where('mpacc_id','1');   
	$query = $this->db->get('mpacc_details');
	if($query->num_rows() >= 1)
	{                   
		$row = $query->row();			
		return $query->result();			
	} 
	else
	{     
		return false;		
	}
}
function account_details()
{
	//$this->db->where('acc_id','1');   
	$query = $this->db->get('acc_details');
	if($query->num_rows() >= 1)
	{                   
		$row = $query->row();			
		return $query->result();			
	} 
	else
	{     
		return false;		
	}
}
function cancel_deposit($id)
{
	$this->db->where('deposit_id',$id);
	$this->db->update('deposit_payment',array('status'=>"cancelled"));
	return true;
}
function get_withdraw_details()
{
	$customer_user_id		=	$this->session->user_id;
	//$this->db->where('userId',$customer_user_id);
	//$this->db->where_not_in('status','pending');

	$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency,purse FROM `coin_withdraw` where userId='$customer_user_id'  UNION SELECT req_id,payment,request_date,status,askamount,currency,purse FROM `withdraw_request` where user_id='$customer_user_id'  ORDER BY request_date desc");
	if($query->num_rows() >=1)
	{
		return $query->result();
	}
	else
	{
		return false;
	}
}
function getapi_withdraw_details($id)
{
	//$customer_user_id		=	$this->session->user_id;
	$this->db->where('userId',$id);
	$query = $this->db->get('coin_withdraw');
	if($query->num_rows() >=1)
	{
		return $query->result();
	}
	else
	{
		return false;
	}
}
function get_deposit_details()
{
	$customer_user_id		=	$this->session->user_id;
	$this->db->where('user_id',$customer_user_id);
	$query = $this->db->get('deposit_payment');
	if($query->num_rows() >=1)
	{
		return $query->result();
	}
	else
	{
		return false;
	}
}
function user_acc_details()
{
	$customer_user_id		=	$this->session->user_id;
	$data = array(
		'iban'				=>	$this->input->post('iban'),
		'user_id'			=>	$customer_user_id,
		'bank_swift'		=>	$this->input->post('bank_swift'),
		'bank_name'			=>	$this->input->post('bank_name'),
		'bank_address'		=>	$this->input->post('bank_address'),
		'bank_postal_code'	=>	$this->input->post('bank_postal_code'),
		'bank_city'			=>	$this->input->post('bank_city'),
		'bank_country'		=>	$this->input->post('bank_country'),
		'currency'			=>	$this->input->post('currency')
		);
	$this->db->insert('user_bankaccount',$data);
	return true;
}
function get_bankacc_details()
{
	$customer_user_id		=	$this->session->user_id;
	$this->db->where('user_id',$customer_user_id);
	$query = $this->db->get('user_bankaccount');
	if($query->num_rows() >=1)
	{
		return $query->result();
	}
	else
	{
		return false;
	}
}
function edituser_acc_details()
{
	$customer_user_id		=	$this->session->user_id;
	$data = array(
		'iban'				=>	$this->input->post('iban'),
		'user_id'			=>	$customer_user_id,
		'bank_swift'		=>	$this->input->post('bank_swift'),
		'bank_name'			=>	$this->input->post('bank_name'),
		'bank_address'		=>	$this->input->post('bank_address'),
		'bank_postal_code'	=>	$this->input->post('bank_postal_code'),
		'bank_city'			=>	$this->input->post('bank_city'),
		'bank_country'		=>	$this->input->post('bank_country'),
		'currency'			=>	$this->input->post('currency')
		);
	$this->db->update('user_bankaccount',$data);
	return true;
}
function deactivate_account()
{
	$customer_user_id		=	$this->session->user_id;
	$password = $this->input->post('password');
	$this->db->where('password',$password);      
	$query = $this->db->get('users');
	if($query->num_rows()) 
	{ 
		$this->db->where('user_id',$customer_user_id);      
		$query1	=	$this->db->update('users',array('status'=>'deactive'));
		$this->session->sess_destroy();
		return "success";
	}
	else
	{ 
		return "false";  
	}
	
}
function create_buy_order($amount,$price,$curr_pair,$id)
{
	$exp = explode('_',$curr_pair);
	$firstCurrency  = strtoupper($exp[0]);
	$secondCurrency = strtoupper($exp[1]);
	$balance2 = $this->get_userbalance($id,$secondCurrency); 
	$balance1 = $this->get_userbalance($id,$firstCurrency);
	if($balance2 <= 500)
	{
		$trade_comm = 0.50;
	}
	//echo "sarma".$balance2;
	else if($balance2 <= 1000 && $balance2 > 500)
	{
		$trade_comm = 0.48;
	}
	else if($balance2 <= 2000 && $balance2 > 1000)
	{
	//echo "sarma";
		$trade_comm = 0.46;
	}
	else if($balance2 <=4000 && $balance2 > 2000)
	{
		$trade_comm = 0.44;
	}
	else if($balance2 <= 6500 && $balance2 > 4000)
	{
		$trade_comm = 0.42;
	}
	else if($balance2 <= 10000 && $balance2 > 6500)
	{
		$trade_comm = 0.40;
	}
	else if($balance2 <= 15000 && $balance2 > 10000)
	{
		$trade_comm = 0.38;
	}
	else if($balance2 <= 20000 && $balance2 > 15000)
	{
		$trade_comm = 0.36;
	}
	else if($balance2 <= 25000 && $balance2 > 20000)
	{
		$trade_comm = 0.34;
	}
	else if($balance2 <= 37500 && $balance2 > 25000)
	{
		$trade_comm = 0.32;
	}
	else if($balance2 <= 50000 && $balance2 > 37500)
	{
		$trade_comm = 0.30;
	}
	else if($balance2 <= 62500 && $balance2 > 50000)
	{
		$trade_comm = 0.28;
	}
	else if($balance2 <= 75000 && $balance2 > 62500)
	{
		$trade_comm = 0.26;
	}
	else if($balance2 <= 100000 && $balance2 > 75000)
	{
		$trade_comm = 0.24;
	}
	else if($balance2 <= 150000  && $balance2 > 100000 )
	{
		$trade_comm = 0.22;
	}
	else if($balance2 >= 150000)
	{
		$trade_comm = 0.22;
	}
	//echo "sar".$balance2;
	$total = $amount * $price;
	$fee = ($total*$trade_comm)/100;
	$current_date	=	date('Y-m-d'); 
	$current_time	=	date('H:i A'); 
	//$customer_user_id	=	$this->session->user_id; 
	$firstCurrency	 	= $firstCurrency;
	$secondCurrency 	= $firstCurrency;
	$firstBalance 	= $balance1;
	$secondBalance 	= balance2;
	$amount 	= $amount;
	$price 		= $price;
	$total 		= $total; // second currency
	$process 	= 'positive';
	$fee 		= $fee; // first currency
	//BTC-USD	LTC-BTC   USD-RUR
	$updatesecondBalance 	= $secondBalance-$total;
	if($curr_pair=="btc_usd")
	{
		$updatedata = array(
			'USD'=>$updatesecondBalance
			);
	}
	else if($curr_pair=="ltc_usd")
	{
		$updatedata = array(
			'USD'=>$updatesecondBalance
			);
	}
	$this->db->where('userId',$id);  
	$updatequery = $this->db->update('balance',$updatedata);
	if($updatequery)
	{
		$datetime	=date("Y-m-d H:i:s");
		//$pair = $firstCurrency."_".$secondCurrency;
		$data	=	array(
			'userId'=>$id,
			'Amount'=>$amount,
			'Price'=>$price,
			'Total'=>$total,
			'Fee'=>$fee,
			'firstCurrency'=>$firstCurrency,
			'secondCurrency'=>$secondCurrency,
			'Process'=>$process,
			'Type'=>"Buy",
			'orderDate'=>$current_date,
			'orderTime'=>$current_time,
			'datetime'=>$datetime,
			'pair'=>$curr_pair,
			'status'=>"active"
			);
		$this->db->insert('coin_order',$data);
		$insid = $this->db->insert_id();
		if($insid)
		{
			$this->db->where('trade_id',$insid);
			$query = $this->db->get('coin_order');
			if($query->num_rows() >=1)
			{
				return $query->result();
			}
			else
			{
				return false;
			}
		}
	}
	else
	{
		return false;
	}
}
function create_sell_order($amount,$price,$curr_pair,$id)
{
	$exp = explode('_',$curr_pair);
	$firstCurrency  = strtoupper($exp[0]);
	$secondCurrency = strtoupper($exp[1]);
	$balance2 = $this->get_userbalance($id,$secondCurrency); 
	$balance1 = $this->get_userbalance($id,$firstCurrency);
	if($balance2 <= 500)
	{
		$trade_comm = 0.50;
	}
	//echo "sarma".$balance2;
	else if($balance2 <= 1000 && $balance2 > 500)
	{
		$trade_comm = 0.48;
	}
	else if($balance2 <= 2000 && $balance2 > 1000)
	{
	//echo "sarma";
		$trade_comm = 0.46;
	}
	else if($balance2 <=4000 && $balance2 > 2000)
	{
		$trade_comm = 0.44;
	}
	else if($balance2 <= 6500 && $balance2 > 4000)
	{
		$trade_comm = 0.42;
	}
	else if($balance2 <= 10000 && $balance2 > 6500)
	{
		$trade_comm = 0.40;
	}
	else if($balance2 <= 15000 && $balance2 > 10000)
	{
		$trade_comm = 0.38;
	}
	else if($balance2 <= 20000 && $balance2 > 15000)
	{
		$trade_comm = 0.36;
	}
	else if($balance2 <= 25000 && $balance2 > 20000)
	{
		$trade_comm = 0.34;
	}
	else if($balance2 <= 37500 && $balance2 > 25000)
	{
		$trade_comm = 0.32;
	}
	else if($balance2 <= 50000 && $balance2 > 37500)
	{
		$trade_comm = 0.30;
	}
	else if($balance2 <= 62500 && $balance2 > 50000)
	{
		$trade_comm = 0.28;
	}
	else if($balance2 <= 75000 && $balance2 > 62500)
	{
		$trade_comm = 0.26;
	}
	else if($balance2 <= 100000 && $balance2 > 75000)
	{
		$trade_comm = 0.24;
	}
	else if($balance2 <= 150000  && $balance2 > 100000 )
	{
		$trade_comm = 0.22;
	}
	else if($balance2 >= 150000)
	{
		$trade_comm = 0.22;
	}
	//echo "sar".$balance2;
	$total = $amount * $price;
	$fee = ($total*$trade_comm)/100;
	$current_date	=	date('Y-m-d'); 
	$current_time	=	date('H:i A'); 
	//$customer_user_id	=	$this->session->user_id; 
	$firstCurrency	 	= $firstCurrency;
	$secondCurrency 	= $firstCurrency;
	$firstBalance 	= $balance1;
	$secondBalance 	= balance2;
	$amount 	= $amount;
	$price 		= $price;
	$total 		= $total; // second currency
	$process 	= 'positive';
	$fee 		= $fee; // first currency
	//BTC-USD	LTC-BTC   USD-RUR
	$updatefirstBalance 	= $firstBalance-$amount;
	if($curr_pair=="btc_usd")
	{
		$updatedata = array(
			'USD'=>$updatefirstBalance
			);
	}
	else if($curr_pair=="ltc_usd")
	{
		$updatedata = array(
			'USD'=>$updatefirstBalance
			);
	}
	$this->db->where('userId',$id);  
	$updatequery = $this->db->update('balance',$updatedata);
	if($updatequery)
	{
		$datetime	=date("Y-m-d H:i:s");
		//$pair = $firstCurrency."_".$secondCurrency;
		$data	=	array(
			'userId'=>$id,
			'Amount'=>$amount,
			'Price'=>$price,
			'Total'=>$total,
			'Fee'=>$fee,
			'firstCurrency'=>$firstCurrency,
			'secondCurrency'=>$secondCurrency,
			'Process'=>$process,
			'Type'=>"Sell",
			'orderDate'=>$current_date,
			'orderTime'=>$current_time,
			'datetime'=>$datetime,
			'pair'=>$curr_pair,
			'status'=>"active"
			);
		$this->db->insert('coin_order',$data);
		$insid = $this->db->insert_id();
		if($insid)
		{
			$this->db->where('trade_id',$insid);
			$query = $this->db->get('coin_order');
			if($query->num_rows() >=1)
			{
				return $query->result();
			}
			else
			{
				return false;
			}
		}
	}
	else
	{
		return false;
	}
}
function deposit_address($currency,$id)
{
	//$customer_user_id	=	$this->session->user_id;
	$this->db->where('user_id',$id);  
	$query=$this->db->get('coin_address'); 
	if($query->num_rows() >= 1)
	{                
		$row = $query->row();	
		if($currency=="BTC")
		{ 
			$address = $row->BTC; 
		}
		else if($currency=="LTC")
		{ 
			$address = $row->LTC; 
		}
		else if($currency=="WCN")
		{ 
			$address = $row->WCN; 
		}
		return $address;
	}   
	else
	{      
		return false;		
	}
}
function email_confirmation_complete()
{
	$customer_user_id		=	$this->session->user_id;
	$one = $this->input->post('one');
	$two = $this->input->post('two');
	$three = $this->input->post('three');
	$data = array(
		'bitcoin_email'=>$one,
		'ripple_email'=>$two,
		'bank_email'=>$three,
		);
	$this->db->where('user_id',$customer_user_id);      
	$query	=	$this->db->update('email_confirmation',$data);
	return "success";
}
function notificationFun()
{
	$customer_user_id		=	$this->session->user_id;
	//$one = $this->input->post('one');
	$news = $this->input->post('news');
	$btc = $this->input->post('btc');
	$usd = $this->input->post('usd');
	
	$data = array(
		'newsletter_mail'=>$news,
		'bitcoin_deposit'=>$btc,
		'usd_deposit'=>$usd,
		);
	$this->db->where('userId',$customer_user_id);      
	$query	=	$this->db->update('userNotification',$data);
	return "success";
}
function get_email_confirmation()
{
	$customer_user_id		=	$this->session->user_id;
	$this->db->where('user_id',$customer_user_id);      
	$query	=	$this->db->get('email_confirmation');
	if($query->num_rows() >0) 
	{ 
		return $row = $query->row();
	}
	else
	{ 
		return false;  
	}
}
function set_currencysession($cur)
{
	if($cur=="ltc_usd")
	{
		$currency="ltc_usd";
	}
	else if($cur=="btc_usd")
	{
		$currency="btc_usd";
	}
	$sessiondata = array(
		'accport_currency'  => $currency 
		);

	$this->session->set_userdata($sessiondata);  
		//$this->session->set_userdata('accport_currency',$currency);  
	return true;
}
function get_intdeposit_fee()
{
	$this->db->where('id',1);
	$query = $this->db->get('fees_config');
	if($query->num_rows() == 1)
	{
		$row = $query->row();
		return $row->inational_deposit_fee;
		
	}
}
function get_mpdeposit_fee()
{
	$this->db->where('id',1);
	$query = $this->db->get('fees_config');
	if($query->num_rows() == 1)
	{
		$row = $query->row();
		return $row->moneypolo_deposit_fee;
		
	}
}
function get_paydeposit_fee()
{
	$this->db->where('id',1);
	$query = $this->db->get('fees_config');
	if($query->num_rows() == 1)
	{
		$row = $query->row();
		return $row->paypal_deposit_fee;
		
	}
}
function get_mpwithdraw_fee()
{
	$this->db->where('id',1);
	$query = $this->db->get('fees_config');
	if($query->num_rows() == 1)
	{
		$row = $query->row();
		return $row->moneypolo_withdraw_fee;
		
	}
}
function get_intwithdraw_fee()
{
	$this->db->where('id',1);
	$query = $this->db->get('fees_config');
	if($query->num_rows() == 1)
	{
		$row = $query->row();
		return $row->inational_withdraw_fee;
		
	}
}
function get_paywithdraw_fee()
{
	$this->db->where('id',1);
	$query = $this->db->get('fees_config');
	if($query->num_rows() == 1)
	{
		$row = $query->row();
		return $row->paypal_withdraw_fee;
		
	}
}
//paypal admin settings
function get_paypalsettings()
{
	$this->db->where('id',1);
	$query = $this->db->get('site_config');
	if($query->num_rows() == 1)
	{
		return	$row = $query->row();
	}
	else
	{
		return false;
	}
}
// pending withdraw_cancel/
function get_withdraw_pending($currency)
{
	$customer_user_id		=	$this->session->user_id;
	$this->db->select_sum('amount');
	$this->db->where('userId',$customer_user_id);
	$this->db->where('status',"processing");
	$this->db->where('currency',$currency);
	$query = $this->db->get('coin_withdraw');
	if($query->num_rows() >= 1)
	{
		return $row = $query->result(); 
	}
	else
	{
		return false;
	}
}
function get_paypal_pending()
{
	$customer_user_id		=	$this->session->user_id;
	$this->db->select_sum('amount');
	$this->db->where('user_id',$customer_user_id);
	$this->db->where('status',"pending");
	$query = $this->db->get('withdraw_request');
	if($query->num_rows() >= 1)
	{
		return $row = $query->result(); 
	}
	else
	{
		return false;
	}
}
function get_moneypolo_pending()
{
	$customer_user_id		=	$this->session->user_id;
	$this->db->select_sum('amount');
	$this->db->where('user_id',$customer_user_id);
	$this->db->where('status',"pending");
	$query = $this->db->get('withdraw_moneypolo');
	if($query->num_rows() >= 1)
	{
		return $row = $query->result(); 
	}
	else
	{
		return false;
	}
}
function get_inational_pending()
{
	$customer_user_id		=	$this->session->user_id;
	$this->db->select_sum('amount');
	$this->db->where('user_id',$customer_user_id);
	$this->db->where('status',"pending");
	$query = $this->db->get('international_withdraw');
	if($query->num_rows() >= 1)
	{
		return $row = $query->result(); 
	}
	else
	{
		return false;
	}
}
function get_waiting_withdraw($cur)
{
	$customer_user_id		=	$this->session->user_id;
	$this->db->where('userId',$customer_user_id);
	$this->db->where('currency',$cur);
	$this->db->where('status','processing');
	$this->db->select_sum('amount');
	$query = $this->db->get('coin_withdraw');
	if($query->num_rows() >= 1)
	{
		return $row = $query->result(); 
	}
	else
	{
		return false;
	}
}
//conscutive order
function fetch_active_buyorder($one,$two)
{
	$customer_user_id		=	$this->session->user_id; 
	$names = array('active', 'partially');
	$this->db->where('firstCurrency',$one);  
	$this->db->where('secondCurrency',$two);  
	$this->db->where('Type','Buy');  
	$this->db->where('userId',$customer_user_id);  
	$this->db->where_in('status', $names);
	$this->db->select_sum("Amount",'amount');
	$this->db->from('coin_order');
	//$this->db->group_by("Price");
	$query = $this->db->get('');
	//$query	=	$this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{  
		return $query->result();
	}   
	else
	{   
		return false;		
	}
}
function get_con_order($first_currency,$second_currency)
{
	$customer_user_id		=	$this->session->user_id; 
	$this->db->where('firstCurrency',$first_currency);  
	$this->db->where('secondCurrency',$second_currency);  
	$this->db->where('userId',$customer_user_id);  
	$this->db->where('Type','Sell');  
	$this->db->where_in('status', 'consecutive');
	$this->db->select_sum("Amount",'amount');
	$this->db->from('coin_order');
	//$this->db->group_by("Price");
	$query = $this->db->get('');
	//$query	=	$this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{  
		return $query->result();
	}   
	else
	{      
		return false;		
	}
}
//get highest fee
function get_highest_fee()
{
	$query = $this->db->get('fees_config');
	if($query->num_rows() == 1)
	{
		$row = $query->row();
		return $row->high_withdraw_fee;
	}
}
function get_highestdep_fee()
{
	$query = $this->db->get('fees_config');
	if($query->num_rows() == 1)
	{
		$row = $query->row();
		return $row->high_deposit_fee;
	}
}
function getactive_order($id)
{
	$this->db->where('trade_id',$id);
	$query = $this->db->get('coin_order');
	if($query->num_rows()==1)
	{
		return $query->row();
	}
	else
	{
		return false;
	}
	
}
function get_oldtotal($id)
{
	$this->db->where('trade_id',$id);
	$query = $this->db->get('coin_order');
	if($query->num_rows() == 1)
	{
		$row = $query->row();
		return $row->Total;
	}
	else
	{
		return false;
	}
}
function get_oldamount($id)
{
	$this->db->where('trade_id',$id);
	$query = $this->db->get('coin_order');
	if($query->num_rows() == 1)
	{
		$row = $query->row();
		return $row->Amount;
	}
	else
	{
		return false;
	}
}

function api()
{
	$query = $this->db->get('site_config');
	if($query->num_rows() == 1)
	{
		$row = $query->row();
		return $row->api;
	}
	else
	{
		return false;
	}
}
function language()
{
	$query = $this->db->get('site_config');
	if($query->num_rows() == 1)
	{
		$row = $query->row();
		return $row->language;
	}
	else
	{
		return false;
	}
}

// trade history - sorting - type
function ajaxtypefortransmodel()
{
	$customer_user_id		=	$this->session->user_id; 
	$keyword	=	$this->input->post('keyword'); 
	//$names = array('active', 'partially');
	if($keyword!='all')
	{
		if($keyword=='Withdraw')
		{
			$names = array('Withdraw','EWithdraw');
			$this->db->where_in('type',$names);
		}
		else
		{
			$this->db->where('type',$keyword);  
		}
	}	
	$this->db->where('userId',$customer_user_id);  
	$query	=	$this->db->get('transaction_history'); 
	if($query->num_rows() >= 1)
	{                
		return $query->result();			 
	}   
	else
	{      
		return false;		
	}
}
//open orders sorting
function get_type_order($first_currency,$second_currency)
{
	$keyword	=	$this->input->post('keyword'); 
	//$names = array('active', 'partially');
	if($keyword!='all')
	{
		$this->db->where_in('type',$keyword);
	}	
	$names = array('active', 'partially');
	$customer_user_id   =    $this->session->user_id;
	$this->db->order_by('trade_id','desc');
	$this->db->where('userId',$customer_user_id);                  
	$this->db->where('firstCurrency',$first_currency);  
	$this->db->where('secondCurrency',$second_currency);              
	$this->db->where_in('status', $names);                  
	$query=$this->db->get('coin_order');
	if($query->num_rows() >= 1)
	{
		return $query->result();
	}
	else
	{
		return false;
	}
}
function sortingmodel()
{
	$type = $this->session->userdata('type');
	$sorting = $this->session->userdata('sorting');
	$time = $this->session->userdata('time');
	$customer_user_id		=	$this->session->user_id; 
	$keyword	=	$this->input->post('keyword');
	if($type!='' && $type!='all')
	{

		if($type=='Withdraw' )
		{
			$names = array('Withdraw','EWithdraw');
			$this->db->where_in('type',$names);
		}
		else
		{
			$this->db->where('type',$type);  
		}
	}	
	if($sorting!='' && $sorting!='AllTypes')
	{
		if($sorting=='AllTypes')
		{
			$field='type';
			$this->db->order_by($field, 'asc');
		}	
		else if($sorting=='DateandTime')
		{
			$field='date';
			$this->db->order_by($field, 'asc');  
		}
		else if($sorting=='BTCamount')
		{
			$field='amount';
			$this->db->where('currency','BTC');
			$this->db->order_by($field, 'asc');
		}
		else if($sorting=='LTCamount')
		{
			$field='amount';
			$this->db->where('currency','LTC');
			$this->db->order_by($field, 'asc');
		}
		else if($sorting=='USDamount')
		{
			$field='amount';
			$this->db->where('currency','USD');
			$this->db->order_by($field, 'asc');
		}
		else if($sorting=='BTCprice')
		{
			$field='price';
			$this->db->order_by($field, 'asc');
		}
		else if($sorting=='Descending')
		{
			$field='transactionId';
			$this->db->order_by($field, 'desc');
		}
		else if($keyword=='Ascending')
		{
			$field='transactionId';
			$this->db->order_by($field, 'asc');
		} 
	}	
	if($time!='' && $time!='anytime')
	{
		if($time=='anytime')
		{
			//$this->db->where('userId',$customer_user_id); 
		}	
		else if($time=='pastday')
		{
			$yesterday = date("Y-m-d", mktime(0, 0, 0, date("m"),date("d")-1,date("Y")));
			$this->db->where('date',$yesterday);  
		}
		else if($time=='pastweek')
		{
			$curdate=date('Y-m-d');
			$week = date("W",strtotime($curdate));  
			$lastweek=$week-1;
			$year = date("Y",strtotime($curdate));
			$from = date("Y-m-d", strtotime("{$year}-W{$lastweek}-1")); 
			$to = date("Y-m-d", strtotime("{$year}-W{$lastweek}-7"));  
			$this->db->where("`date` BETWEEN '$from' and '$to'", NULL, FALSE);  
		}
		else if($time=='pastmonth')
		{
			$curdate=date('Y-m-d');
			$start_date = date('Y-m-d', strtotime($curdate . ' -1 month'));

			$month = date("m",strtotime($curdate));  
			$year = date("Y",strtotime($curdate)); 
			$lastmonth=$month-1;
			$first = date('Y-m-d', mktime(0, 0, 0, $lastmonth, 1, $year));
			$last = date('Y-m-t', mktime(0, 0, 0, $lastmonth, 1, $year)); 
			$this->db->where("`date` BETWEEN '$start_date' and '$curdate'", NULL, FALSE);  
			$field='transactionId';
			$this->db->order_by($field, 'desc');
		} 
	}	
	$this->db->where('userId',$customer_user_id);  
	$query	=	$this->db->get('transaction_history'); 
	if($query->num_rows() >= 1)
	{                
		return $query->result();			 
	}   
	else
	{      
		return false;		
	}
}
// trade history - sorting - status
function ajaxstatusfortransmodel()
{
	$customer_user_id		=	$this->session->user_id; 
	// SELECT with_id,payment,request_date,status,amount FROM `coin_withdraw` UNION SELECT req_id,payment,request_date,statusamount FROM `withdraw_request`
	// $keyword	=	$this->input->post('keyword');
	// if($keyword!='all')
	// {
	// 	$this->db->where('status',$keyword);  
	// }	
	// $this->db->where('userId',$customer_user_id);  
	$query	=	$this->db->query('SELECT with_id,payment,request_date,status,amount FROM `coin_withdraw` where userId=1 UNION SELECT req_id,payment,request_date,status,amount FROM `withdraw_request` where user_id=1'); 
	if($query->num_rows() >= 1)
	{                
		return $query->result();			 
	}   
	else
	{      
		return false;		
	}
}
//Mapping function of gulden orders
function cron_mapping_model()
{
	$names = array('active', 'partially');
	$this->db->where_in('status', $names);                  
	$query=$this->db->get('coin_order');
	if($query->num_rows())
	{
		$result = $query->result();
	}
	if($result)
	{
		foreach($result as $row)
		{
			$acc_order_id 		= $row->order_id;
			$acc_trade_id 		= $row->trade_id;
			$tradeType 	  		= $row->Type;
			$tradeuserId  		= $row->userId;
			$tradefirstCurrency = $row->firstCurrency;
			$tradesecondCurrency = $row->secondCurrency;
			$tradeAmount		= $row->Amount;
			$tradeTotal			= $row->Total;
			$tradeFee			= $row->Fee;
			require_once 'guldenapi.php';
			$KEY 		= 'hGL8s1JxJ79ZLzltTwrCEiVb6OuCFcQE';
			$SECRET 	= 'HGhL3Ad2xl9wyoqRk0ALmXEYNX3vl0oV';
			$CLIENT_ID 	= '740293';
			$bapi = new guldenapi($KEY,$SECRET,$CLIENT_ID);
			$ticker = $bapi->openOrders();
			foreach($ticker as $list)
			{
				$order_id = $list['id'];
				if($order_id!=$acc_order_id && $acc_order_id!=0)
				{
					if($tradeType=="Buy")
					{
						//  +  BTC  USD -
						$userbalance 		= $this->fetchuserbalancebyId($tradeuserId,$tradefirstCurrency);
						$amountBalance 		= 	$tradeAmount-$tradeFee;
						$updatebuyBalance 	=	$userbalance+$amountBalance;
						$this->db->where('userId',$tradeuserId); 
						if($tradefirstCurrency=="BTC")
						{
							$this->db->update('balance',array('BTC'=>$updatebuyBalance));
						}
						else if($tradefirstCurrency=="LTC")
						{
							$this->db->update('balance',array('LTC'=>$updatebuyBalance));
						}
					}
					else
					{
					//   -  BTC  USD  +
						$userbalance = $this->fetchuserbalancebyId($tradeuserId,$tradesecondCurrency);
						$amountBalance 		= $tradeTotal-$tradeFee;
						$updatesellBalance 	= $userbalance+$amountBalance;
						$this->db->where('userId',$tradeuserId); 
						if($tradesecondCurrency=="USD")
						{
							$this->db->update('balance',array('USD'=>$updatesellBalance));
						}
						else if($tradesecondCurrency=="USD")
						{
							$this->db->update('balance',array('USD'=>$updatesellBalance));
						}
					}
					$this->db->where('order_id',$acc_order_id);
					$this->db->where('trade_id',$acc_trade_id);
					$this->db->update('coin_order',array('status'=>"filled"));
				}
			}
		}
	}
	else
	{
		return false;
	}
}
function sorting()
{
	$customer_user_id		=	$this->session->user_id; 
	$keyword	=	$this->input->post('keyword'); 
	if($keyword=='AllTypes')
	{
		$field='type';
		$this->db->order_by($field, 'asc');
	}	
	else if($keyword=='DateandTime')
	{
		$field='date';
		$this->db->order_by($field, 'asc');  
	}
	else if($keyword=='BTCamount')
	{
		$field='amount';
		$this->db->where('currency','BTC');
		$this->db->order_by($field, 'asc');
	}
	else if($keyword=='USDamount')
	{
		$field='amount';
		$this->db->where('currency','USD');
		$this->db->order_by($field, 'asc');
	}
	else if($keyword=='BTCprice')
	{
		$field='price';
		$this->db->where('userId',$customer_user_id);
		$this->db->order_by($field, 'asc');
	}
	else if($keyword=='Descending')
	{
		$field='transactionId';
		$this->db->order_by($field, 'desc');
	}
	else if($keyword=='Ascending')
	{
		$field='transactionId';
		$this->db->order_by($field, 'asc');
	} 
	$this->db->where('userId',$customer_user_id); 
	$query	=	$this->db->get('transaction_history'); 
	if($query->num_rows() >= 1)
	{                
		return $query->result();			 
	}   
	else
	{      
		return false;		
	}
}
function ajaxanytimepast24hour()
{
	$customer_user_id		=	$this->session->user_id; 
	$keyword	=	$this->input->post('keyword'); 
	if($keyword=='anytime')
	{
		$this->db->where('userId',$customer_user_id); 
	}	
	else if($keyword=='pastday')
	{
		$yesterday=date("Y-m-d", mktime(0, 0, 0, date("m"),date("d")-1,date("Y")));
		$this->db->where('userId',$customer_user_id); 
		$this->db->where('date',$yesterday);  
	}
	else if($keyword=='pastweek')
	{
		$curdate=date('Y-m-d');
		$week = date("W",strtotime($curdate));  
		$lastweek=$week-1;
		$year = date("Y",strtotime($curdate));
		$from = date("Y-m-d", strtotime("{$year}-W{$lastweek}-1")); 
		$to = date("Y-m-d", strtotime("{$year}-W{$lastweek}-7"));  
		$this->db->where('userId',$customer_user_id); 
		$this->db->where("`date` BETWEEN '$from' and '$to'", NULL, FALSE);  
	}
	else if($keyword=='pastmonth')
	{
		$curdate=date('Y-m-d');
		$start_date = date('Y-m-d', strtotime($curdate . ' -1 month'));
		
		$month = date("m",strtotime($curdate));  
		$year = date("Y",strtotime($curdate)); 
		$lastmonth=$month-1;
		$first = date('Y-m-d', mktime(0, 0, 0, $lastmonth, 1, $year));
		$last = date('Y-m-t', mktime(0, 0, 0, $lastmonth, 1, $year)); 
		$this->db->where('userId',$customer_user_id); 
		$this->db->where("`date` BETWEEN '$start_date' and '$curdate'", NULL, FALSE);  
		$field='transactionId';
		$this->db->order_by($field, 'desc');
	} 
	$query	=	$this->db->get('transaction_history'); 
	if($query->num_rows() >= 1)
	{                
		return $query->result();			 
	}   
	else
	{      
		return false;		
	}
}
//trading fees_config
function getfeedetails()
{
	$query = $this->db->get('trading_fee');
	if($query->num_rows())
	{                   
		return $query->result();			
	} 
	else
	{     
		return false;		
	}

}
function insert()
{
	$this->db->insert('chat_commision',array('rur_com'=>253));
}
//30 days usd volume
function get_usdvolume()
{
	$customer_user_id		=	$this->session->user_id; 
	$curdate	=	date('Y-m-d');
	$start_date = date('Y-m-d', strtotime($curdate . ' -1 month'));
	$this->db->where('userId',$customer_user_id); 
	$this->db->where("`date` BETWEEN '$start_date' and '$curdate'", NULL, FALSE);  
	$this->db->select_sum("total",'usdvolume');
	$this->db->from('transaction_history');
	$query = $this->db->get('');
	if($query->num_rows())
	{
		$row = $query->row();
		return $row->usdvolume;
	}
	else
	{
		return false;
	}
}	
function get_volume()
{
	$customer_user_id		=	$this->session->user_id; 
	$curdate=date('Y-m-d');
	$start_date = date('Y-m-d', strtotime($curdate . ' -1 month'));
	$this->db->where('userId',$customer_user_id); 
	$this->db->where("`date` BETWEEN '$start_date' and '$curdate'", NULL, FALSE);  
	$this->db->select_sum("total",'usdvolume');
	$this->db->from('transaction_history');
	$query = $this->db->get('');
	if($query->num_rows())
	{
		$row = $query->row();
		return $row->usdvolume;
	}
	else
	{
		return false;
	}
}	
function get_tradingvolume($first_cur,$second_cur)
{
	$curdate 	= date('Y-m-d');
	$start_date = date('Y-m-d', strtotime($curdate . ' -1 day'));
	$this->db->where("`orderDate` BETWEEN '$start_date' and '$curdate'", NULL, FALSE);  
	$this->db->where('status','filled');
	$this->db->where('firstCurrency',$first_cur);
	$this->db->where('secondCurrency',$second_cur);
	$this->db->select_sum("Amount",'volume');
	$this->db->from('coin_order');
	$query = $this->db->get('');
	if($query->num_rows())
	{
		$row = $query->row();
		return $row->volume;
	}
	else
	{
		return false;
	}
}
function get_totalvolume($first_cur,$second_cur)
{
	// $curdate 	= date('Y-m-d');
	// $start_date = date('Y-m-d', strtotime($curdate . ' -1 day'));
	// $this->db->where("`orderDate` BETWEEN '$start_date' and '$curdate'", NULL, FALSE);  
	$this->db->where('status','filled');
	$this->db->where('firstCurrency',$first_cur);
	$this->db->where('secondCurrency',$second_cur);
	$this->db->select_sum("Amount",'volume');
	$this->db->from('coin_order');
	$query = $this->db->get('');
	if($query->num_rows())
	{
		$row = $query->row();
		return $row->volume;
	}
	else
	{
		return false;
	}
}
function get_withdrawfee()
{
	$query = $this->db->get('fees_config');
	if($query->num_rows())
	{
		return $query->row();
	}
	else
	{
		return false;
	}
}
function get_banner_images()
{
	$this->db->where('id',1);	
	$query = $this->db->get('site_config');
	if($query->num_rows())
	{
		return $query->row();
	}
	else
	{
		return false;
	}
}
function get_verificationstatus()
{
	$customer_user_id = $this->session->user_id;
	$this->db->where('user_id',$customer_user_id);
	$query = $this->db->get('user_verification');
	if($query->num_rows())
	{
		$row = $query->row();
		return $row->verification_status;
	}
	else
	{
		return false;
	}
}
function check_pendingdeposit()
{
	$customer_user_id = $this->session->user_id;
	$this->db->where('user_id',$customer_user_id);
	$this->db->where('status','pending');
	$query = $this->db->get('deposit_payment');
	if($query->num_rows())
	{
		$row = $query->row();
		return $row->deposit_id;
	}
	else
	{
		return false;
	}
}
function check_pendingdeposit_ngn()
{
	$customer_user_id = $this->session->user_id;
	$this->db->where('user_id',$customer_user_id);
	$this->db->where('currency','NGN');
	$this->db->where('status','pending');
	$query = $this->db->get('deposit_payment');
	if($query->num_rows())
	{
		$row = $query->row();
		return $row->deposit_id;
	}
	else
	{
		return false;
	}
}
function check_pendingdeposit_zar()
{
	$customer_user_id = $this->session->user_id;
	$this->db->where('user_id',$customer_user_id);
	$this->db->where('currency','USD');
	$this->db->where('status','pending');
	$query = $this->db->get('deposit_payment');
	if($query->num_rows())
	{
		$row = $query->row();
		return $row->deposit_id;
	}
	else
	{
		return false;
	}
}
function create_buy_xrp()
{
	$customer_user_id = $this->session->user_id;
	$user_balance = $this->fetchuserbalancebyId($customer_user_id,'USD');
	$usd_amount = $this->input->post('usd_amount');
	$xrp_address = $this->input->post('xrp_address');
	$xrp_amount = $this->xrp_current_rate();

	$amount = (float)$xrp_amount;

	try{
	$bitcoin_row = $this->fetchWallet('bitcoin');    // fetch bitcoin wallet credentials
	$bitcoin_username	=	$bitcoin_row->username;
	$bitcoin_password	=	$bitcoin_row->password;
	$bitcoin_portnumber = 	$bitcoin_row->portnumber;
	$bitcoin 	= new jsonRPCClient("http://$bitcoin_username:$bitcoin_password@127.0.0.1:$bitcoin_portnumber/");
	$isvalid = $bitcoin->sendtoaddress($xrp_address,$amount);
	
	
	return 'success';
}
catch (Exception $e) {
	return 'error';
}
}
function xrp_current_rate()
{
	$url = 'http://api.cryptocoincharts.info/tradingPair/[xrp_usd]';
	$result = file_get_contents($url);
	$result = json_decode($result);

	$xrp_rate = $result->markets[0]->price;
	$ripple_fee = $this->get_buy_ripple_fee();
	$ripple_rate = $xrp_rate*$ripple_fee/100;
	return $xrp = $xrp_rate + $ripple_rate;
}
//Bitgo functions 
function get_access_token()
{
	//return $output = shell_exec('cd /home/guldenltd/public_html; /usr/local/bin/node auth.js');
	// $this->db->where('id','1');
	// $query = $this->db->get('bitgo_details');
	// if($query->num_rows())
	// {
	// 	$row = $query->row();
	// 	return $row->access_token;
	// }
	// else
	// {
	// 	return false;
	// }

// 	EMAIL="janedoe@bitgo.com"
// PASSWORD="mypassword"
// HMAC=`echo -n "$PASSWORD" | openssl dgst -sha256 -hmac "$EMAIL" | sed 's/^.* //' `

// curl -X POST \
// -H "Content-Type: application/json" \
// -d "{\"email\": \"$EMAIL\", \"password\": \"$HMAC\", \"otp\": \"0000000\"}" \
// https://test.bitgo.com/api/v1/user/login

						/*$a = str_replace("@","'","@s/^.* //@");

						$output = exec('EMAIL="veerasarma@osiztechnologies.com"
						PASSWORD="sarmaravi1616"
						HMAC=`echo -n "$PASSWORD" | openssl dgst -sha256 -hmac "$EMAIL" | sed '.$a.' `

						curl -X POST \
						-H "Content-Type: application/json" \
						-d "{\"email\": \"$EMAIL\", \"password\": \"$HMAC\", \"otp\": \"0000000\"}" \
						https://test.bitgo.com/api/v1/user/login');
							$abc = json_decode($output);
							// echo "<pre>";
							$access_token = $abc->access_token;
						$a = str_replace("@","'",'@{"otp": "0000000"}@');
						$output = exec('ACCESS_TOKEN="'.$access_token.'"
							curl -X POST -H "Authorization: Bearer $ACCESS_TOKEN" \
						-d '.$a.' \
						-H "Content-Type: application/json" \
						https://test.bitgo.com/api/v1/user/unlock');
						return $access_token;*/
						$this->db->where('id','1');
						$query = $this->db->get('bitgo_details');
						if($query->num_rows())
						{
							$row = $query->row();
							return $row->access_token;
						}
						else
						{
							return false;
						}
					}



					function get_walletpass()
					{
						$this->db->where('id','1');
						$query = $this->db->get('bitgo_details');
						if($query->num_rows())
						{
							$row = $query->row();
							return $row->wallet_passphrase;
						}
						else
						{
							return false;
						}
					}

					function get_userwallet()
					{
						$this->db->where('id','1');
						$query = $this->db->get('admin');
						if($query->num_rows())
						{
							$row = $query->row();
							return $row->walletId;
						}
						else
						{
							return false;
						}
					}

					function get_xpub()
					{
						$customer_user_id	=	$this->session->user_id; 	
						$this->db->where('user_id',$customer_user_id);
						$query = $this->db->get('users');
						if($query->num_rows())
						{
							$row = $query->row();
							return $row->xpub;
						}
						else
						{
							return false;
						}
					}

					function get_adminpurse()
					{
						$this->db->where('id',1);
						$query = $this->db->get('admin');
						if($query->num_rows())
						{
							$row = $query->row();
							return $row->walletId;
						}
						else
						{
							return false;
						}
					}
					function getalluserdetails()
					{
						$query = $this->db->get('users');
						if($query->num_rows())
						{
							return $query->result();
						}
						else
						{
							return false;
						}
					}
/*function bitgo_deposit_process()
{
	$cur_date	=	date('Y-m-d');	 

		$cur_time	=	date('h:i:s');	   	
		$alluserdetails = 	$this->getalluserdetails();
	     $access_token = $this->get_access_token();

	        if($alluserdetails)
	        {	
        		foreach($alluserdetails as $row)
				{
	 
				       $user_wallet 	= $row->user_wallet;  
				       $btcuserId 		= $row->user_id;

					 if($user_wallet!="")
					 {

						$user_id = $row->user_id;

						$output = shell_exec('cd /var/www/html; /usr/bin/node transactions.js "'.trim($access_token).'" "'.trim($user_wallet).'"');
						//$output = exec('cd /var/www/sellbitbuy_script; /usr/local/bin/node transactions.js');
						  echo "<pre>";
                          print_r($output);
							 $output = str_replace("running without secp256k1 acceleration", " ", $output);
								 //print_r($output);
							
							 
							$output = json_decode($output); 
                           
							for($i=0;$i<count($output);$i++) 
							{
								$dep_id 			=  $output[$i]->txid; 
								$confirmations 		=  $output[$i]->confirmations; 
								$bitcoin_balance 	=  $output[$i]->value; 
								$depdate 			=  $output[$i]->date; 
								$type 				=  $output[$i]->type; 
								$a 					=  explode('T',$depdate);
								$date 				=  $a[0];
								$time1 				=  trim($a[1],'Z');
								$time 				=  trim($time1,'.000');
								$time 				=  substr($time, 0, strpos($time, "."));
								$datetime 			=  $date." ".$time;
								if($type=="Received" && $confirmations>3)
								{
									$dep_already = $this->checkdepositalready($btcuserId,$dep_id); 
									if(!$dep_already)
									{

										$fetchBTCbalance 	= $this->fetchuserbalancebyId($btcuserId,'BTC');
									$updateBTCbalance 	= $fetchBTCbalance+$bitcoin_balance;

									$btcVolume 	= $this->walletVolume('bitcoin');			// volume calculation
									$updatebtcVolume 	= $btcVolume+$bitcoin_balance;  

									// insert data into transaction history


									// Debit user balance	
									$this->db->where('type','bitcoin'); // for Update volume
									$this->db->update('wallet',array('volume'=>$updatebtcVolume));
									$this->db->where('userId',$btcuserId);  // for Update current coin balance
									$this->db->update('balance',array('BTC'=>$updateBTCbalance));

									// Transaction History
									$btctransdata = array(
									"userId"=>$btcuserId,
									"type"=>"Deposit",
									"currency"=>"BTC",
									// "depositaddress"=>$btc_address,
									"amount"=>$bitcoin_balance,
									"comment"=>"BTC payment",
									"date"=>$cur_date,
									"time"=>$cur_time,
									"status"=>"active"
									);
									$this->db->insert('transaction_history',$btctransdata);

									// Notification
									$notifydata = array(
									"userId"		=>$btcuserId,
									"type"			=>"Deposit",
									"currency"		=>"BTC",
									"depositAmount"	=>$bitcoin_balance,
									"date"			=>$cur_date,
									"time"			=>$cur_time,
									"status"		=>"active"
									);
									$this->db->insert('notification',$notifydata);

									// insert the data for deposited already
									$userdata = array(
									'dep_id' => $dep_id,
									'user_id' => $btcuserId,
									'date_time' => $datetime,
									// 'address' => $btc_address
									);

									$this->db->insert('bitgo_deposit_detail',$userdata);	

									// insert the data for deposit details
									$userdata = array(
									'user_id' => $btcuserId,
									'currency' => "BTC",
									'type' => "BTC payment",
									'request_time' => $time,
									'amount' => $bitcoin_balance,
									//'askamount' => $bitcoin_balance,
									'request_date' => $date,
									'trans_id' => $dep_id,
									'status' => "Confirmed"
									);

									$this->db->insert('deposit_payment',$userdata);	

									//Coin address used
									// $data	=	array(                  
									// 'count'=>"1",
									// 'request_date'=>$date,   
									// 'request_time'=>$time,   
									// 'btcstatus'=>'used'
									// );
									// $this->db->where('user_id',$btcuserId);  
									// $this->db->update('coin_address',$data); 

									// Send BTC from user wallet to administartor wallet
									//$user_wallet 		= $this->get_userwallet();

										//Email funcition for user
									 

									 $access_token 		= $this->get_access_token();
									 $wallet_passphrase 	= $this->get_walletpass();
									 $adminpurse 		= $this->get_adminpurse();

									$approxi = $bitcoin_balance-0.0003;
									$finalamount = $approxi/0.00000001;

								 
									$output = shell_exec('cd /var/www/html; /usr/bin/node with.js '.trim($access_token).' '.trim($user_wallet).' '.$wallet_passphrase.' '.trim($adminpurse).' '.$approxi);
									 
                                     $output = str_replace("running without secp256k1 acceleration", " ", $output);
								 //print_r($output);
													 

									if($output)
									{
										$response = json_decode($output);
										 // echo "<pre>";
										
										$hash = $response->hash;

										$data = array(
														'user_id'=>$btcuserId,
														'amount'=>$bitcoin_balance,
														'hash'=>$hash
													);
										$this->db->insert('admin_btc',$data);
									}
									
																
							               

											$this->db->where('id',1);  	
											$query = $this->db->get('site_config');
											if($query->num_rows() == 1)
											{
											$row 			= 	$query->row();
											$admin_email	=	$row->email_id;			 							 
											$companyname	=	$row->company_name;	
											$siteurl		=	$row->siteurl;				
											}

											$userResult = 	$this->get_userdetails($btcuserId);
											$username 	= 	$userResult->username;
											$email 		= 	$userResult->emailid;
											$ip	=	$this->input->ip_address();

											 
											
											$dis_get_email_info	=	mysql_query("select * from email_templates where id='16'") or die(mysql_error());
											$get_email_info	=	mysql_fetch_array($dis_get_email_info);
											$email_from1	=	$get_email_info['from_id'];
											$email_subject1	=	$get_email_info['subject'];
											$email_content1	=	$get_email_info['message'];

											
											$a	=	array('##USERNAME##'=>$username,'##FROM_EMAIL##'=>$admin_email,
											'##AMOUNT##'=>$bitcoin_balance,
											'##CURRENCY##'=>'BTC',
											'##COMPANYNAME##'=>$companyname,'##EMAIL##'=>$email,'##SITEURL##'=>$siteurl,'##ADMIN_EMAIL##'=>$admin_email);
											$email_from	=	strtr($email_from1,$a);	
											$email_content	=	strtr($email_content1,$a);
											$this->common_mail($admin_email,$companyname,$to,$email_subject1,$email_content); 
											 
											$this->common_mail($admin_email,$companyname,$email,$email_subject1,$email_content);

											// Email function for admin
											 
											
											$dis_get_email_info	=	mysql_query("select * from email_templates where id='22'") or die(mysql_error());
											$get_email_info	=	mysql_fetch_array($dis_get_email_info);
											$email_from1	=	$get_email_info['from_id'];
											$email_subject1	=	$get_email_info['subject'];
											$email_content1	=	$get_email_info['message'];

										
											$a	=	array('##USERNAME##'=>$username,'##FROM_EMAIL##'=>$admin_email,
											'##AMOUNT##'=>$bitcoin_balance,
											'##CURRENCY##'=>'BTC',
											'##COMPANYNAME##'=>$companyname,'##SITEURL##'=>$siteurl,'##ADMIN_EMAIL##'=>$admin_email);
											$email_from	=	strtr($email_from1,$a);	
											$email_content	=	strtr($email_content1,$a); 
											$this->common_mail($admin_email,$companyname,$admin_email,$email_subject1,$email_content);

										
									}

								}
								
							}

					}

				}
				// break;
				
			
		}
}
*/

function bitgo_deposit_process()
{
	$cur_date	=	date('Y-m-d');	 
	$cur_time	=	date('h:i:s');

	$orders = $this->checkdepositalready1();

	$transactionIds = array();
	if(count($orders))
	{
		foreach($orders as $order)
		{
			if(trim($order->trans_id) != '')
				$transactionIds[$order->trans_id] = $order->trans_id;
		}


	}
	$bitcoin_transactions     = $this->get_bitcoin_transactions();

	echo "<pre>";
	print_r($bitcoin_transactions);

	if($bitcoin_transactions && count($bitcoin_transactions)){

		echo "<pre>";
		print_r($bitcoin_transactions);

		foreach($bitcoin_transactions as $transaction){


			if($transaction['confirmations'] > 3)
			{
				if(isset($transaction['outputs']) && isset($transaction['outputs'][0]) && isset($transaction['outputs'][0]['account'])){


					for($i=0;$i<count($transaction['outputs']);$i++){

						if(!isset($transactionIds[$transaction['id']]) ){


							$amount = ($transaction['outputs'][$i]['value']/100000000);
							$crypto_address = $transaction['outputs'][$i]['account'];
							$wallet_txid = $transaction['id'];
							$datetimes = $transaction['date'];
							$userid = $this->BTC_address_list($crypto_address);
							$time1 				=  trim($datetimes,'Z');
							$time2 				=  trim($time1,'.000');
							$time3 				=  substr($time2, 0, strpos($time2, "."));
							$datetime = str_replace('T',' ', $time3);
							$time4 = explode(' ', $datetime);
							$date=$time4['0'];
							$time = $time4['1'];


							$fetchBTCbalance 	= $this->fetchuserbalancebyId($userid,'BTC');
							$updateBTCbalance 	= $fetchBTCbalance+$amount;

						       $btcVolume 	= $this->walletVolume('bitcoin');			// volume calculation
						       $updatebtcVolume 	= $btcVolume+$bitcoin_balance;  
						       // insert data into transaction history


									// Debit user balance	
									$this->db->where('type','bitcoin'); // for Update volume
									$this->db->update('wallet',array('volume'=>$updatebtcVolume));
									$this->db->where('userId',$userid);  // for Update current coin balance
									$this->db->update('balance',array('BTC'=>$updateBTCbalance));

									// Transaction History
									$btctransdata = array(
										"userId"=>$userid,
										"type"=>"Deposit",
										"currency"=>"BTC",
									// "depositaddress"=>$btc_address,
										"amount"=>$amount,
										"comment"=>"BTC payment",
										"date"=>$cur_date,
										"time"=>$cur_time,
										"status"=>"active"
										);
									$this->db->insert('transaction_history',$btctransdata);

									// Notification
									$notifydata = array(
										"userId"		=>$userid,
										"type"			=>"Deposit",
										"currency"		=>"BTC",
										"depositAmount"	=>$amount,
										"date"			=>$cur_date,
										"time"			=>$cur_time,
										"status"		=>"active"
										);
									$this->db->insert('notification',$notifydata);

									// insert the data for deposited already
									$userdata = array(
										'dep_id' => $wallet_txid,
										'user_id' => $userid,
										'date_time' => $datetime,
									// 'address' => $btc_address
										);

									$this->db->insert('bitgo_deposit_detail',$userdata);	

									// insert the data for deposit details
									$userdata = array(
										'user_id' => $userid,
										'currency' => "BTC",
										'type' => "BTC payment",
										'request_time' => $time,
										'amount' => $amount,
									//'askamount' => $bitcoin_balance,
										'request_date' => $date,
										'trans_id' => $wallet_txid,
										'status' => "Confirmed"
										);

									$this->db->insert('deposit_payment',$userdata);	






								}
							}
						}

					}
				}
			}


		}

		function getalladdressdetails()
		{
			$query = $this->db->get('coin_address');
			if($query->num_rows() > 0)
			{
				return $query->result();
			}
			else
			{
				return false;
			}
		}


		function eth_deposit_process()
		{
			$cur_date = date('Y-m-d');
			$cur_time = date('H:i:s');
			$alluserdetails = 	$this->getalladdressdetails();

			if($alluserdetails)
			{	
				foreach($alluserdetails as $row)
				{

					$btcuserId = $row->user_id;
					$account = trim($row->ETH);
					$result = $this->db->query('SELECT MAX(blocknumber) as max_blocknumber FROM transaction_history')->row(); 
					$max_blocknumber = $result ->max_blocknumber;
	            // $max_blocknumber ="2424957";
				//echo $lastnumber = shell_exec('cd /var/www/html; /usr/bin/node ethstart_transactions.js ');


                 //$max_blocknumber="1847000";

              //  $output1="https://api.etherscan.io/api?module=account&action=txlist&address=".$account."&startblock=0&endblock=latest";
             //   $output=file_get_contents($output1);
					$output = file_get_contents('https://api.etherscan.io/api?module=account&action=txlist&address='.$account.'&startblock='.$max_blocknumber.'&endblock=latest');
					$result = json_decode($output);
					echo "<pre>";
					print_r($result);

					if($result->message == 'OK')
					{
						$transaction=$result->result;
         			 /*  echo "<pre>";
         			 print_r($result->result);*/

         			 for($tr=0;$tr<count($transaction);$tr++)
         			 {

         			 	$block_number  = $transaction[$tr]->blockNumber;
         			 	$address  = $transaction[$tr]->to;
         			 	$txid 		= $transaction[$tr]->hash;
         			 	$value1 		= $transaction[$tr]->value;
         			 }

         			 $dep_id = $txid;
         			 $bitcoin_balance1= $value1;
         			 $bitcoin_balance= $bitcoin_balance1/1000000000000000000;  
         			 $dep_already = $this->checkdepositalready($btcuserId,$dep_id); 
         			 if(!$dep_already)
         			 { 
		                       	 // echo "hai";


         			 	if($account == $address)
         			 	{


         			 		$fetchBTCbalance 	= $this->fetchuserbalancebyId($btcuserId,'ETH');
         			 		$updateBTCbalance1 	= $fetchBTCbalance+$bitcoin_balance;
         			 		$updateBTCbalance = number_format($updateBTCbalance1,8);


                                    //echo "adf".$btcuserId;
									// insert data into transaction history

									$this->db->where('userId',$btcuserId);  // for Update current coin balance
									$this->db->update('balance',array('ETH'=>$updateBTCbalance));




							        /*
									$this->db->where('userId',$btcuserId);  // for Update current coin balance
									$this->db->update('users',array('ethcode'=>$block_number));*/

									// Transaction History
									$btctransdata = array(
										"userId"=>$btcuserId,
										"type"=>"Deposit",
										"currency"=>"ETH",
									// "depositaddress"=>$btc_address,
										"amount"=>$bitcoin_balance,
										"comment"=>"ETH payment",
										"date"=>$cur_date,
										"time"=>$cur_time,
										"status"=>"active",
										"blocknumber"=>$block_number
										);
									$this->db->insert('transaction_history',$btctransdata);

									// Notification
									$notifydata = array(
										"userId"		=>$btcuserId,
										"type"			=>"Deposit",
										"currency"		=>"ETH",
										"depositAmount"	=>$bitcoin_balance,
										"date"			=>$cur_date,
										"time"			=>$cur_time,
										"status"		=>"active"
										);
									$this->db->insert('notification',$notifydata);



									// insert the data for deposit details
									$userdata = array(
										'user_id' => $btcuserId,
										'currency' => "ETH",
										'type' => "ETH payment",
										'request_time' => $cur_time,
										'amount' => $bitcoin_balance,
									//'askamount' => $bitcoin_balance,
										'request_date' => $cur_date,
										'trans_id' => $dep_id,
										'status' => "Confirmed"
										);

									$this->db->insert('deposit_payment',$userdata);	


									//Email funcition for user
									/*		Get Admin Details Start		 */ 

									$this->db->where('id',1);  	
									$query = $this->db->get('site_config');
									if($query->num_rows() == 1)
									{
										$row 			= 	$query->row();
										$admin_email	=	$row->email_id;			 							 
										$companyname	=	$row->company_name;	
										$siteurl		=	$row->siteurl;				
									}

									$userResult = 	$this->get_userdetails($btcuserId);
									$username 	= 	$userResult->username;
									$email 		= 	$userResult->emailid;
									$ip	=	$this->input->ip_address();

									/*	GET EMAIL TEMPLATE	START	*/
									
									$this->db->where('id',16);  	
									$dis_get_email_info = $this->db->get('email_templates')->row();
									$email_from1	=	$dis_get_email_info->from_id;
									$email_subject1	=	$dis_get_email_info->subject;
									$email_content1	=	$dis_get_email_info->message;


									$a	=	array('##USERNAME##'=>$username,'##FROM_EMAIL##'=>$admin_email,
										'##AMOUNT##'=>$bitcoin_balance,
										'##CURRENCY##'=>'ETH',
										'##COMPANYNAME##'=>$companyname,'##EMAIL##'=>$email,'##SITEURL##'=>$siteurl,'##ADMIN_EMAIL##'=>$admin_email);
									$email_from	=	strtr($email_from1,$a);	
									$email_content	=	strtr($email_content1,$a); 
									$this->common_mail($admin_email,$companyname,$email,$email_subject1,$email_content);
									return true;
								}

							}

						}
					}
				}
			}
			function nlg_deposit_process()
			{
				$cur_date = date('Y-m-d');
				$cur_time = date('H:i:s');

	$litecoin_row = $this->fetchWallet('nlgcoin');    // fetch litecoin wallet credentials
	/*$litecoin_username	=	$litecoin_row->username;
	$litecoin_password	=	$litecoin_row->password;
	$litecoin_portnumber = 	$litecoin_row->portnumber;*/
	$litecoin_username  ='gulden'; 
	$litecoin_password  ='Gulden';
	$litecoin_portnumber ='9888';
	$litecoin 	= new jsonRPCClient("http://$litecoin_username:$litecoin_password@127.0.0.1:$litecoin_portnumber/");

	
	$litecoin_isvalid 		= 	$litecoin->listtransactions();

	  //print_r($litecoin_isvalid);
	if($litecoin_isvalid)
	{
		for($i=0;$i<count($litecoin_isvalid);$i++)
		{
			$account  	= 	$litecoin_isvalid[$i]['account'];
			$category 	=  	$litecoin_isvalid[$i]['category'];
			$ltctxid 	=  	$litecoin_isvalid[$i]['txid'];
			$address 	=  	$litecoin_isvalid[$i]['address'];

			if($category=="receive")
			{
				$isvalid = $litecoin->gettransaction($ltctxid);
				// echo "<pre>";
				// print_r($isvalid);
				$det_category        		=   $isvalid['details'][0]['category'];

				if($det_category=="receive")
				{
					$ltcaccount        	=   $isvalid['details'][0]['account'];
					$ltcaddress 		= 	$isvalid['details'][0]['address'];
					$litecoin_balance 	= 	$isvalid['details'][0]['amount']; 
					$ltcconfirmations 	= 	$isvalid['confirmations']; 
				}
				else
				{
					$ltcaccount        	=   $isvalid['details'][1]['account'];
					$ltcaddress 		= 	$isvalid['details'][1]['address'];
					$litecoin_balance 	= 	$isvalid['details'][1]['amount']; 
					$ltcconfirmations 	= 	$isvalid['confirmations']; 

				}
				
				$btcuserId 			= $this->deposit_address_user('NLG',$address);
				$dep_id 			= $ltctxid;
				$bitcoin_balance 	= $litecoin_balance;
				if($btcuserId !='' && $btcuserId !=0){ 

					$dep_already = $this->checkdepositalready($btcuserId,$dep_id); 
					if(!$dep_already)
					{

						$fetchBTCbalance 	= $this->fetchuserbalancebyId($btcuserId,'NLG'); 
						$updateBTCbalance 	= $fetchBTCbalance+$bitcoin_balance;

					// insert data into transaction history

					$this->db->where('userId',$btcuserId);  // for Update current coin balance
					$this->db->update('balance',array('NLG'=>$updateBTCbalance));

					// Transaction History
					$btctransdata = array(
						"userId"=>$btcuserId,
						"type"=>"Deposit",
						"currency"=>"NLG",
					// "depositaddress"=>$btc_address,
						"amount"=>$bitcoin_balance,
						"comment"=>"NLG payment",
						"date"=>$cur_date,
						"time"=>$cur_time,
						"status"=>"active"
						);
					$this->db->insert('transaction_history',$btctransdata);

					// Notification
					$notifydata = array(
						"userId"		=>$btcuserId,
						"type"			=>"Deposit",
						"currency"		=>"NLG",
						"depositAmount"	=>$bitcoin_balance,
						"date"			=>$cur_date,
						"time"			=>$cur_time,
						"status"		=>"active"
						);
					$this->db->insert('notification',$notifydata);

					

					// insert the data for deposit details
					$userdata = array(
						'user_id' => $btcuserId,
						'currency' => "NLG",
						'type' => "NLG payment",
						'request_time' => $cur_time,
						'amount' => $bitcoin_balance,
					//'askamount' => $bitcoin_balance,
						'request_date' => $cur_date,
						'trans_id' => $dep_id,
						'status' => "finished"
						);

					$this->db->insert('deposit_payment',$userdata);	

					
						//Email funcition for user
					/*		Get Admin Details Start		 */ 

					$this->db->where('id',1);  	
					$query = $this->db->get('site_config');
					if($query->num_rows() == 1)
					{
						$row 			= 	$query->row();
						$admin_email	=	$row->email_id;			 							 
						$companyname	=	$row->company_name;	
						$siteurl		=	$row->siteurl;				
					}

					$userResult = 	$this->get_userdetails($btcuserId);
					$username 	= 	$userResult->username;
					$email 		= 	$userResult->emailid;
					$ip	=	$this->input->ip_address();

					/*	GET EMAIL TEMPLATE	START	*/

					$this->db->where('id',16);  	
					$dis_get_email_info = $this->db->get('email_templates')->row();
					$email_from1	=	$dis_get_email_info->from_id;
					$email_subject1	=	$dis_get_email_info->subject;
					$email_content1	=	$dis_get_email_info->message;

					$a	=	array('##USERNAME##'=>$username,'##FROM_EMAIL##'=>$admin_email,
						'##AMOUNT##'=>$bitcoin_balance,
						'##CURRENCY##'=>'ETH',
						'##COMPANYNAME##'=>$companyname,'##EMAIL##'=>$email,'##SITEURL##'=>$siteurl,'##ADMIN_EMAIL##'=>$admin_email);
					$email_from	=	strtr($email_from1,$a);	
					$email_content	=	strtr($email_content1,$a); 
							//$this->common_mail($admin_email,$companyname,$email,$email_subject1,$email_content);
					return true;
				}
			}
		}
	}
}
}
function get_userid($address)
{
	$this->db->where('ETH',$address);
	$query = $this->db->get('coin_address');
	echo $this->db->last_query();
	if($query->num_rows())
	{
		$row = $query->row();
		echo $row->user_id;
		return $row->user_id;
	}
	else
	{
		return false;
	}
}
function checkdepositalready($user_id,$dep_id)
{
	$this->db->where('trans_id',$dep_id);
	$query = $this->db->get('deposit_payment');
	if($query->num_rows())
	{
		return true;
	}
	else
	{
		return false;
	}
}
function get_btc_addresses()
{
	$customer_user_id = $this->session->user_id;
	$this->db->where('user_id',$customer_user_id);
	$this->db->order_by('createddate','desc');
	$query = $this->db->get('bitcoin_address');
	if($query->num_rows())
	{
		return $query->result();
	}
	else
	{
		return false;
	}
}

// anand API
function get_btc_address($address)
{
	$this->db->where('address',$address);
	$query = $this->db->get('bitcoin_address');
	if($query->num_rows()==1)
	{
		return true;
	}
	else
	{
		return false;
	}
}
function get_wcn_address($address)
{
	$this->db->where('address',$address);
	$query = $this->db->get('wcn_address');
	if($query->num_rows()==1)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function get_ltc_addresses()
{
	$customer_user_id = $this->session->user_id;
	$this->db->where('user_id',$customer_user_id);
	$this->db->order_by('createddate','desc');
	$query = $this->db->get('litecoin_address');
	if($query->num_rows())
	{
		return $query->result();
	}
	else
	{
		return false;
	}
}

function get_wcn_addresses()
{
	$customer_user_id = $this->session->user_id;
	$this->db->where('user_id',$customer_user_id);
	$this->db->order_by('createddate','desc');
	$query = $this->db->get('wcn_address');
	if($query->num_rows())
	{
		return $query->result();
	}
	else
	{
		return false;
	}
}
function get_xrp_rate()
{
	$url = 'http://api.cryptocoincharts.info/tradingPair/[xrp_usd]';
	$result = file_get_contents($url);
	$result = json_decode($result);

	return $xrp_rate = $result->markets[0]->price;
}
function get_xrpbtc_rate()
{
	$url = 'http://api.cryptocoincharts.info/tradingPair/[xrp_btc]';
	$result = file_get_contents($url);
	$result = json_decode($result);

	return $xrp_rate = $result->markets[0]->price;
}
function xrpcoinrequestmodel()
{
	
	
	$curr = "ripplecoin"; 
	
	$address 			= 	$this->input->post('address');
	/* $namecoin_row = $this->fetchWallet($curr);    // fetch bitcoin wallet credentials
	$namecoin_username	=	$namecoin_row->username;
	$namecoin_password	=	$namecoin_row->password;
	$namecoin_portnumber = 	$namecoin_row->portnumber;
	$namecoin 	= new jsonRPCClient("http://$namecoin_username:$namecoin_password@127.0.0.1:$namecoin_portnumber/");
	$isvalid = $namecoin->validateaddress($address);
	if($isvalid['isvalid']==1)
	{ */
		$customer_user_id	=	$this->session->user_id;
		$request_date	=	date('Y-m-d');
		$request_time	=	date("h:i:s");  
		$currency		= 	'XRP';
		$final			= 	$this->input->post('final');
		$askamount		= 	$this->input->post('amount');
		$purse 			= 	$this->input->post('address');
		$payment 		= 	$this->input->post('payment');
		
		$buy_rate = $this->lowestaskprice("BTC","USD"); 
		if($buy_rate=="")
		{
			$buy_rate="235";
		}
		
		
		$amount = $askamount-$final;
			//$account = $this->checkdepositAddress($currency);
		$token = $this->generateRandomString();

		$usd_fee = $buy_rate*$final;
		$high_fee = $this->get_highest_fee();
		if($high_fee<$usd_fee)
		{
			$fee = $high_fee/$buy_rate;
			$amount = $askamount-$fee;
		}
		$data	=	array(                  
			'userId'=>$customer_user_id,
			'currency'=>$currency,
			'token'=>$token,
			'purse'=>$purse,
			'amount'=>$amount, 
			'payment'=>'ripple'.strtolower($payment), 
			'askamount'=>$askamount,   		
			'paymentname'=>$payment,   		
			'request_date'=>$request_date,   
			'request_time'=>$request_time,   
			'status'=>'processing'
			);
		$this->db->insert('coin_withdraw',$data); 
		$insid = $this->db->insert_id();
		if($insid)
		{
			if($payment=='USD')
			{
				$balance = $this->fetchuserbalancebyId($customer_user_id,'USD');  // fetch first balance
				$updatefirstBalance = $balance-$askamount;
				$updatedata = array('USD'=>$updatefirstBalance);
			}
			else
			{
				$balance = $this->fetchuserbalancebyId($customer_user_id,'BTC');  // fetch first balance
				$updatefirstBalance = $balance-$askamount;
				$updatedata = array('BTC'=>$updatefirstBalance);
			}
			
			
			$this->db->where('userId',$customer_user_id); 
			$this->db->update('balance',$updatedata);
			$transdata	=	array(                  
				'userId'=>$customer_user_id,
				'type'=>"Withdraw",
				'currency'=>$currency,  
				'token'=>$token,  
				'amount'=>$amount,
				'askamount'=>$askamount,		
				'date'=>$request_date,   
				'time'=>$request_time,   
				'status'=>'active'
				);
			$this->db->insert('transaction_history',$transdata);
			/*		Get Admin Details Start		 */ 
			$this->db->where('id',1);  	
			$query = $this->db->get('site_config');
			if($query->num_rows() == 1)
			{
				$row 			= 	$query->row();
				$admin_email	=	$row->email_id;			 							 
				$companyname	=	$row->company_name;	
				$siteurl		=	$row->siteurl;				
			}
			$userResult = 	$this->get_userdetails($customer_user_id);
			$username 	= 	$userResult->username;
			$to 		= 	$userResult->emailid;
			$ip	=	$this->input->ip_address();    
			$confirm	=	$siteurl."/gulden/withdraw_confirm/".$token;	
			$cancel		=	$siteurl."/gulden/withdraw_cancel/".$token;
			/*	GET EMAIL TEMPLATE	START	*/
			$this->db->where('id',6);  	
			$dis_get_email_info = $this->db->get('email_templates')->row();
			$email_from1	=	$dis_get_email_info->from_id;
			$email_subject1	=	$dis_get_email_info->subject;
			$email_content1	=	$dis_get_email_info->message;
			$a	=	array('##USERNAME##'=>$username,'##IP##'=>$ip,'##FROM_EMAIL##'=>$admin_email,'##COMPANYNAME##'=>$companyname,'##AMOUNT##'=>$amount,'##PURSE##'=>$purse,'##CURRENCY##'=>$currency,'##SITEURL##'=>$siteurl,'##ADMIN_EMAIL##'=>$admin_email,'##CONFIRMLINK##'=>$confirm,'##CANCELLINK##'=>$cancel);
			$email_from	=	strtr($email_from1,$a);	
			$email_content	=	strtr($email_content1,$a);
			$notification = $this->get_email_notification($currency);
			if($notification=='on')
			{
				/*	GET EMAIL TEMPLATE	END	*/ 
				$this->common_mail($admin_email,$companyname,$to,$email_subject1,$email_content);
			}
			else
			{
				return $token;
			}
			return "success";
		}
		else	
		{
			return "failure";
		}
	/* }
	else
	{
		return "0";
	} */
}
function get_closed_usdamount()
{
	$names = array('active', 'partially');
	$customer_user_id = $this->session->user_id;
	$this->db->where('userId',$customer_user_id);
	$this->db->select_sum('Total','total');
	$this->db->select_sum('Amount','amount');
	$this->db->where_in('status', $names);
	$this->db->where('Type','Sell');
	$query = $this->db->get('coin_order');
	if($query->num_rows())
	{
		return $row = $query->row();
	}
	else
	{
		return false;
	}
}
function get_closed_btcamount()
{
	$names = array('active', 'partially');
	$customer_user_id = $this->session->user_id;
	$this->db->where('userId',$customer_user_id);
	$this->db->where_in('status', $names);
	$this->db->select_sum('Total','total');
	$this->db->select_sum('Amount','amount');
	$this->db->where('Type','Buy');
	$query = $this->db->get('coin_order');
	if($query->num_rows())
	{
		return $row = $query->row();
	}
	else
	{
		return false;
	}
}








function getnewsdetails()
{
	$this->db->limit(2);
	$this->db->order_by('bid','desc');
	$this->db->where('status','active');
	$query = $this->db->get('tbl_blog');
	if($query->num_rows())
	{                   
		return $query->result();			
	} 
	else
	{     
		return false;		
	}

}
function singlenewss($id)
{
	//echo $id; die;
	$this->db->where('bid',$id);
	$query = $this->db->get('tbl_blog');
	if($query->num_rows())
	{                   
		return $query->row();			
	} 
	else
	{     
		return false;		
	}
}
function allnews($perpage,$urisegment)
{
	$this->db->order_by('bid','desc');
	$this->db->where('status','active');
	$query = $this->db->get('tbl_blog',$perpage,$urisegment);
	if($query->num_rows())
	{                   
		return $query->result();			
	} 
	else
	{     
		return false;		
	}
}
function getallnewscount1()
{
	$this->db->where('status','active');
	$query=$this->db->get('tbl_blog');
	if($query->num_rows()>=1)
	{
		$cnt=$query->num_rows();			

	}
	else
	{
		$cnt="0";

	}
	return $cnt;
}
function get_terms($id)
{
	$this->db->where('pageid',$id);
	$this->db->where('status','active');  
	$query	=	$this->db->get('pages'); 
	if($query->num_rows() >= 1)
	{                
		return $query->row();			 
		 //return $row->status;
	}   
	else
	{      
		return false;		
	}
}

function getfeessdetails()
{
	$query = $this->db->get('trading_fee');
	if($query->num_rows())
	{                   
		return $query->row();			
	} 
	else
	{     
		return false;		
	}

}
function gettypevalue($typevalue,$gettypevalue)
{
	$customer_user_id		=	$this->session->user_id;

	if($gettypevalue=="processing" || $gettypevalue=="In process")
	{
		if($typevalue=="International Bank transfer")
		{
			$this->db->where('status','processing');
			$this->db->where('user_id',$customer_user_id);
			$query = $this->db->get('withdraw_request');
		}
		else if($typevalue=="bitcoin")
		{
			$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$customer_user_id' and status='processing' and payment='bitcoin' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$customer_user_id' and status='processing' and payment='bitcoin'");
		}
		else if($typevalue=="rippleusd")
		{
			$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$customer_user_id' and status='processing' and payment='rippleusd' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$customer_user_id' and status='processing' and payment='rippleusd'");
		}
		else if($typevalue=="ripplebtc")
		{
			$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$customer_user_id' and status='processing' and payment='ripplebtc' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$customer_user_id' and status='processing' and payment='ripplebtc'");
	//echo $this->db->last_query(); die;
		}
		else if($typevalue=="all")
		{
			$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$customer_user_id' and status='processing' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$customer_user_id' and status='processing'");
		}
	}
	else if($gettypevalue=="confirmed" || $gettypevalue=="Confirmed")
	{
		if($typevalue=="International Bank transfer")
		{
			$this->db->where('status','confirmed');
			$this->db->where('user_id',$customer_user_id);
			$query = $this->db->get('withdraw_request');
		}
		else if($typevalue=="bitcoin")
		{
			$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$customer_user_id' and status='confirmed' and payment='bitcoin' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$customer_user_id' and status='confirmed' and payment='bitcoin'");
		}
		else if($typevalue=="rippleusd")
		{
			$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$customer_user_id' and status='confirmed' and payment='rippleusd' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$customer_user_id' and status='confirmed' and payment='rippleusd'");
		}
		else if($typevalue=="ripplebtc")
		{
			$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$customer_user_id' and status='confirmed' and payment='ripplebtc' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$customer_user_id' and status='confirmed' and payment='ripplebtc'");
	//echo $this->db->last_query(); die;
		}
		else if($typevalue=="all")
		{
			$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$customer_user_id' and status='confirmed' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$customer_user_id' and status='confirmed'");
		}
	}
	else if($gettypevalue=="cancelled" || $gettypevalue=="Canceled")
	{
		if($typevalue=="International Bank transfer")
		{
			$this->db->where('status','cancelled');
			$this->db->where('user_id',$customer_user_id);
			$query = $this->db->get('withdraw_request');
		}
		else if($typevalue=="bitcoin")
		{
			$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$customer_user_id' and status='cancelled' and payment='bitcoin' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$customer_user_id' and status='cancelled' and payment='bitcoin'");
		}
		else if($typevalue=="rippleusd")
		{
			$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$customer_user_id' and status='cancelled' and payment='rippleusd' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$customer_user_id' and status='cancelled' and payment='rippleusd'");
		}
		else if($typevalue=="ripplebtc")
		{
			$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$customer_user_id' and status='cancelled' and payment='ripplebtc' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$customer_user_id' and status='cancelled' and payment='ripplebtc'");
	//echo $this->db->last_query(); die;
		}
		else if($typevalue=="all")
		{
			$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$customer_user_id' and status='cancelled' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$customer_user_id' and status='cancelled'");
		}
	}
	else if($gettypevalue=="finished" || $gettypevalue=="Finished")
	{
		if($typevalue=="International Bank transfer")
		{
			$this->db->where('status','finished');
			$this->db->where('user_id',$customer_user_id);
			$query = $this->db->get('withdraw_request');
		}
		else if($typevalue=="bitcoin")
		{
			$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$customer_user_id' and status='finished' and payment='bitcoin' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$customer_user_id' and status='finished' and payment='bitcoin'");
		}
		else if($typevalue=="rippleusd")
		{
			$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$customer_user_id' and status='finished' and payment='rippleusd' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$customer_user_id' and status='finished' and payment='rippleusd'");
		}
		else if($typevalue=="ripplebtc")
		{
			$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$customer_user_id' and status='finished' and payment='ripplebtc' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$customer_user_id' and status='finished' and payment='ripplebtc'");
		}
		else if($typevalue=="all")
		{
			$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$customer_user_id' and status='finished' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$customer_user_id' and status='finished'");	
	//echo $this->db->last_query(); die;
		}
	}
	else
	{
		if($typevalue=="International Bank transfer")
		{
			$this->db->where('user_id',$customer_user_id);
			$query = $this->db->get('withdraw_request');
		}
		else if($typevalue=="bitcoin")
		{
			$this->db->where('userId',$customer_user_id);
			$this->db->where('payment',"bitcoin");
			$query = $this->db->get('coin_withdraw');
		}
		else if($typevalue=="rippleusd")
		{
			$this->db->where('userId',$customer_user_id);
			$this->db->where('payment',"rippleusd");
			$query = $this->db->get('coin_withdraw');
		}
		else if($typevalue=="ripplebtc")
		{
			$this->db->where('userId',$customer_user_id);
			$this->db->where('payment',"ripplebtc");
			$query = $this->db->get('coin_withdraw');
	//echo $this->db->last_query(); die;
		}
		else if($typevalue=="all")
		{
			$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$customer_user_id' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$customer_user_id'");
		}
	}
	if($query->num_rows() >=1)
	{
		return $query->result();
	}
	else
	{
		return false;
	}
}
function getstatusvalue($typevalue,$ori_type)
{
	$customer_user_id		=	$this->session->user_id;
	if($ori_type=="International Bank transfer" || $ori_type=="International transfer")
	{
		if($typevalue=="processing")
		{
			$this->db->where('status','processing');
			$this->db->where('user_id',$customer_user_id);
			$query = $this->db->get('withdraw_request');
		}
		else if($typevalue=="finished")
		{
			$this->db->where('status','finished');
			$this->db->where('user_id',$customer_user_id);
			$query = $this->db->get('withdraw_request');
		}
		else if($typevalue=="cancelled")
		{
			$this->db->where('status','cancelled');
			$this->db->where('user_id',$customer_user_id);
			$query = $this->db->get('withdraw_request');
		}
		else if($typevalue=="confirmed")
		{
			$this->db->where('status','confirmed');
			$this->db->where('user_id',$customer_user_id);
			$query = $this->db->get('withdraw_request');
		}
	}
	else if($ori_type=="bitcoin" || $ori_type=="Bitcoin")
	{
		if($typevalue=="processing")
		{
			$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$customer_user_id' and status='processing' and payment='bitcoin' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$customer_user_id' and status='processing' and payment='bitcoin'");
		}
		else if($typevalue=="finished")
		{	
			$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$customer_user_id' and status='finished' and payment='bitcoin' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$customer_user_id' and status='finished' and payment='bitcoin'");
		}
		else if($typevalue=="cancelled")
		{
			$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$customer_user_id' and status='cancelled' and payment='bitcoin' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$customer_user_id' and status='cancelled' and payment='bitcoin'");
		}
		else if($typevalue=="confirmed")
		{
			$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$customer_user_id' and status='confirmed' and payment='bitcoin' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$customer_user_id' and status='confirmed' and payment='bitcoin'");
		}
	}
	else if($ori_type=="rippleusd" || $ori_type=="Ripple USD")
	{
		if($typevalue=="processing")
		{
			$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$customer_user_id' and status='processing' and payment='rippleusd' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$customer_user_id' and status='processing' and payment='rippleusd'");
		}
		else if($typevalue=="finished")
		{	
			$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$customer_user_id' and status='finished' and payment='rippleusd' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$customer_user_id' and status='finished' and payment='rippleusd'");
		}
		else if($typevalue=="cancelled")
		{
			$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$customer_user_id' and status='cancelled' and payment='rippleusd' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$customer_user_id' and status='cancelled' and payment='rippleusd'");
		}
		else if($typevalue=="confirmed")
		{
			$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$customer_user_id' and status='confirmed' and payment='rippleusd' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$customer_user_id' and status='confirmed' and payment='rippleusd'");
		}
	}
	else if($ori_type=="ripplebtc" || $ori_type=="Ripple BTC")
	{
		if($typevalue=="processing")
		{
			$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$customer_user_id' and status='processing' and payment='ripplebtc' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$customer_user_id' and status='processing' and payment='ripplebtc'");
		}
		else if($typevalue=="finished")
		{	
			$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$customer_user_id' and status='finished' and payment='ripplebtc' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$customer_user_id' and status='finished' and payment='ripplebtc'");
		}
		else if($typevalue=="cancelled")
		{
			$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$customer_user_id' and status='cancelled' and payment='ripplebtc' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$customer_user_id' and status='cancelled' and payment='ripplebtc'");
		}
		else if($typevalue=="confirmed")
		{
			$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$customer_user_id' and status='confirmed' and payment='ripplebtc' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$customer_user_id' and status='confirmed' and payment='ripplebtc'");
		}
	}
	else
	{
		if($typevalue=="processing")
		{
			$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$customer_user_id' and status='processing' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$customer_user_id' and status='processing'");
		}
		else if($typevalue=="finished")
		{
			$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$customer_user_id' and status='finished' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$customer_user_id' and status='finished'");
		}
		else if($typevalue=="cancelled")
		{
			$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$customer_user_id' and status='cancelled' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$customer_user_id' and status='cancelled'");
		}
		else if($typevalue=="confirmed")
		{
			$query = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$customer_user_id' and status='confirmed' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$customer_user_id' and status='confirmed'");
		}
	}
	if($query->num_rows() >=1)
	{
		return $query->result();
	}
	else
	{
		return false;
	}
}


function ajaxdeposittypesearch($typevalue,$statusvalue)
{
	$customer_user_id = $this->session->user_id;
	if($statusvalue=="pending" || $statusvalue=="Pending")
	{
		if($typevalue=="International Bank transfer")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('status','pending');
			$this->db->where('type','International banking');
			$query = $this->db->get('deposit_payment');
	//echo $this->db->last_query(); die;
		}
		else if($typevalue=="bitcoin")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('status','pending');
			$this->db->where('type','BTC payment');
			$query = $this->db->get('deposit_payment');
		}
		else if($typevalue=="litecoin")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('status','pending');
			$this->db->where('type','LTC payment');
			$query = $this->db->get('deposit_payment');
		}
		else if($typevalue=="rippleusd")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('status','pending');
			$this->db->where('type','rippleusd');
			$query = $this->db->get('deposit_payment');
		}
		else if($typevalue=="ripplebtc")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('status','pending');
			$this->db->where('type','ripplebtc');
			$query = $this->db->get('deposit_payment');
		}
		else if($typevalue=="all")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('status','pending');
			$query = $this->db->get('deposit_payment');
		}
	}
	else if($statusvalue=="confirmed" || $statusvalue=="Confirmed")
	{
		if($typevalue=="International Bank transfer")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('status','confirmed');
			$this->db->where('type','International banking');
			$query = $this->db->get('deposit_payment');
	//echo $this->db->last_query(); die;
		}
		else if($typevalue=="bitcoin")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('status','confirmed');
			$this->db->where('type','BTC payment');
			$query = $this->db->get('deposit_payment');
		}
		else if($typevalue=="litecoin")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('status','confirmed');
			$this->db->where('type','LTC payment');
			$query = $this->db->get('deposit_payment');
		}
		else if($typevalue=="rippleusd")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('status','confirmed');
			$this->db->where('type','rippleusd');
			$query = $this->db->get('deposit_payment');
		}
		else if($typevalue=="ripplebtc")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('status','confirmed');
			$this->db->where('type','ripplebtc');
			$query = $this->db->get('deposit_payment');
		}
		else if($typevalue=="all")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('status','confirmed');
			$query = $this->db->get('deposit_payment');
		}
	}
	else if($statusvalue=="cancelled" || $statusvalue=="Cancelled")
	{
		if($typevalue=="International Bank transfer")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('status','cancelled');
			$this->db->where('type','International banking');
			$query = $this->db->get('deposit_payment');
	//echo $this->db->last_query(); die;
		}
		else if($typevalue=="bitcoin")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('status','cancelled');
			$this->db->where('type','BTC payment');
			$query = $this->db->get('deposit_payment');
		}
		else if($typevalue=="litecoin")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('status','cancelled');
			$this->db->where('type','LTC payment');
			$query = $this->db->get('deposit_payment');
		}
		else if($typevalue=="rippleusd")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('status','cancelled');
			$this->db->where('type','rippleusd');
			$query = $this->db->get('deposit_payment');
		}
		else if($typevalue=="ripplebtc")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('status','cancelled');
			$this->db->where('type','ripplebtc');
			$query = $this->db->get('deposit_payment');
		}
		else if($typevalue=="all")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('status','cancelled');
			$query = $this->db->get('deposit_payment');
		}
	}
	else
	{
		if($typevalue=="International Bank transfer")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('type','International banking');
			$query = $this->db->get('deposit_payment');
	//echo $this->db->last_query(); die;
		}
		else if($typevalue=="bitcoin")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('type','BTC payment');
			$query = $this->db->get('deposit_payment');
		}
		else if($typevalue=="litecoin")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('type','LTC payment');
			$query = $this->db->get('deposit_payment');
		}
		else if($typevalue=="rippleusd")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('type','rippleusd');
			$query = $this->db->get('deposit_payment');
		}
		else if($typevalue=="ripplebtc")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('type','ripplebtc');
			$query = $this->db->get('deposit_payment');
		}
		else if($typevalue=="all")
		{
			$this->db->where('user_id',$customer_user_id);
			$query = $this->db->get('deposit_payment');
		}
	}
	if($query->num_rows())
	{
		return $query->result();
	}
	else
	{
		return false;
	}
}
function ajaxdepositstatussearch($typevalue,$ori_type)
{
	$customer_user_id = $this->session->user_id;
	if($ori_type=="International Bank transfer" || $ori_type=="International transfer")
	{
		if($typevalue=="pending")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('type','International banking');
			$this->db->where('status','pending');
			$query = $this->db->get('deposit_payment');
	//echo $this->db->last_query(); die;
		}
		else if($typevalue=="confirmed")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('type','International banking');
			$this->db->where('status','confirmed');
			$query = $this->db->get('deposit_payment');
		}
		else if($typevalue=="cancelled")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('type','International banking');
			$this->db->where('status','cancelled');
			$query = $this->db->get('deposit_payment');
		}
	}
	else if($ori_type=="bitcoin" || $ori_type=="Bitcoin")
	{
		if($typevalue=="pending")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('type','bitcoin');
			$this->db->where('status','pending');
			$query = $this->db->get('deposit_payment');
	//echo $this->db->last_query(); die;
		}
		else if($typevalue=="confirmed")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('type','bitcoin');
			$this->db->where('status','confirmed');
			$query = $this->db->get('deposit_payment');
		}
		else if($typevalue=="cancelled")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('type','bitcoin');
			$this->db->where('status','cancelled');
			$query = $this->db->get('deposit_payment');
		}	
	}
	else if($ori_type=="rippleusd" || $ori_type=="Ripple USD")
	{
		if($typevalue=="pending")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('type','rippleusd');
			$this->db->where('status','pending');
			$query = $this->db->get('deposit_payment');
	//echo $this->db->last_query(); die;
		}
		else if($typevalue=="confirmed")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('type','rippleusd');
			$this->db->where('status','confirmed');
			$query = $this->db->get('deposit_payment');
		}
		else if($typevalue=="cancelled")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('type','rippleusd');
			$this->db->where('status','cancelled');
			$query = $this->db->get('deposit_payment');
		}	
	}
	else if($ori_type=="ripplebtc" || $ori_type=="Ripple BTC")
	{
		if($typevalue=="pending")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('type','ripplebtc');
			$this->db->where('status','pending');
			$query = $this->db->get('deposit_payment');
	//echo $this->db->last_query(); die;
		}
		else if($typevalue=="confirmed")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('type','ripplebtc');
			$this->db->where('status','confirmed');
			$query = $this->db->get('deposit_payment');
		}
		else if($typevalue=="cancelled")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('type','ripplebtc');
			$this->db->where('status','cancelled');
			$query = $this->db->get('deposit_payment');
		}	
	}
	else
	{
		if($typevalue=="pending")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('status','pending');
			$query = $this->db->get('deposit_payment');
	//echo $this->db->last_query(); die;
		}
		else if($typevalue=="confirmed")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('status','confirmed');
			$query = $this->db->get('deposit_payment');
		}
		else if($typevalue=="cancelled")
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->where('status','cancelled');
			$query = $this->db->get('deposit_payment');
		}
	}
	if($query->num_rows())
	{
		return $query->result();
	}
	else
	{
		return false;
	}
}
function get_depositss_details()
{
	$customer_user_id = $this->session->user_id;
	$this->db->order_by('request_date','desc');
	$this->db->where('user_id',$customer_user_id);
	$query = $this->db->get('deposit_payment');
	if($query->num_rows())
	{
		return $query->result();
	}
}





//padmashree
function verifysetting()
{ 
	$current_date	=	date('Y-m-d');
	$customer_user_id		=	$this->session->user_id;

	$data = array(
		'iban'				=>	$this->input->post('iban'),
		'swift'				=>	$this->input->post('swift'),
		'user_id'			=>	$customer_user_id,
		'bank_name'			=>	$this->input->post('bank_name'),
		'bank_address'		=>	$this->input->post('bank_address'),
		'bank_postalcode'	=>	$this->input->post('bank_postalcode'),
		'bank_country'		=>	$this->input->post('bank_country'),
		'bank_city'			=>	$this->input->post('bank_city'),
		'currency'			=>	'USD',
		'request_date'		=>	$current_date,
		'status'			=>	'processing'
		);

	if($this->input->post('submit'))
	{
		$this->db->where('user_id',$customer_user_id);
		$query = $this->db->get('inational_with_userdata');
		if($query->num_rows())
		{
			$this->db->where('user_id',$customer_user_id);
			$this->db->update('inational_with_userdata',$data);
		}
		else
		{
			$this->db->insert('inational_with_userdata',$data);
		}
	}

	
	return true;						

}
function loginhistory($perpage,$urisegment)
{
	$customer_user_id = $this->session->user_id;
	$this->db->order_by('historyId','desc');
	$this->db->where('userId',$customer_user_id);
	$query = $this->db->get('history',$perpage,$urisegment);
	if($query->num_rows())
	{
		return $query->result();
	}
}
function loginhistorycount()
{
	$customer_user_id = $this->session->user_id;
	$this->db->where('userId',$customer_user_id);
	$query = $this->db->get('history');
	if($query->num_rows()>=1)
	{
		$cnt=$query->num_rows();			

	}
	else
	{
		$cnt="0";

	}
	return $cnt;
}

/*function get_loginhistory()
{
	$this->db->where('userid',109);
	$this->db->from('history');
	$this->db->orderby('datetime',desc);
	$res=$this->db->get();
	{
		return $res->row();
	}
}*/

function showstatus($id)
{
	$this->db->where('pageid',$id);  
	$query	=	$this->db->get('pages'); 
	if($query->num_rows() >= 1)
	{                
		$row= $query->row();			 
		return $row->status;
	}   
	else
	{      
		return false;		
	}
}
function verified()
{
	$customer_user_id = $this->session->user_id;
	$this->db->where('user_id',$customer_user_id);
	$query = $this->db->get('user_verification');
	if($query->num_rows())
	{
		return $query->row();
	}
}









function ajaxtiming1($t1,$t2,$t3,$sortss="")
{
	$currency=$this->session->userdata('currency');
	$currency = explode("_", $currency);
	$firstcurrency=$currency[0];
	$secondcurrency=$currency[1]; 
	
	if($t3=="Type")
	{
		$t3="type";
	}
	else if($t3=="Date Time")
	{
		$t3="date";
	}
	else if($t3=="BTC amount")
	{
		$t3="amount";
	}
	else if($t3=="LTC amount")
	{
		$t3="amount";
	}
	else if($t3=="ETH amount")
	{
		$t3="amount";
	}
	else if($t3=="USD amount")
	{
		$t3="total";
	}
	else if($t3=="BTC price")
	{
		$t3="price";
	}
	/*echo $t1;
	echo $t2;
	echo $t3; */
	if($sortss=="")
	{
		$sortss="desc";
	}
	else
	{
		$sortss=$sortss;
	}
	//echo $sortss; die;
	$customer_user_id = $this->session->user_id;
	//echo $this->db->last_query(); die;

	if($t1=='Any Time' && $t2=='Any Type' && $t3=='date')
	{
		$this->db->where('userId',$customer_user_id);  
//	$this->db->like('type',$t2);  
		$this->db->where('currency',$firstcurrency);  
		$this->db->where('secondcurrency',$secondcurrency);

		$this->db->where('type !=',"Cancel");
		$this->db->order_by('transactionId','desc');
		$query=$this->db->get('transaction_history'); 
	//echo $this->db->last_query(); die;
	}	
	else if($t1=='Any Time' && $t2!='Any Type' && $t3!='date')
	{			
		$this->db->where('userId',$customer_user_id);  
		$this->db->like('type',$t2);  

		$this->db->where('type !=',"Cancel");
		$this->db->where('currency',$firstcurrency);  
		$this->db->where('secondcurrency',$secondcurrency);  
		$this->db->order_by('transactionId','desc'); 
		$query=$this->db->get('transaction_history'); 
	//echo $this->db->last_query(); die;
	}	
	else if($t1=='Any Time' && $t2!='Any Type' && $t3=='date')
	{
		$this->db->where('userId',$customer_user_id);  
		$this->db->like('type',$t2);  
		$this->db->order_by('transactionId','desc');
		$this->db->where('type !=',"Cancel");
		$this->db->where('currency',$firstcurrency); 
		$this->db->where('secondcurrency',$secondcurrency);
		$query=$this->db->get('transaction_history'); 
	//echo $this->db->last_query(); die;
	}	
	else if($t1=='Any Time' && $t2=='Any Type' && $t3!='date')
	{
		$this->db->where('userId',$customer_user_id);  
//$this->db->like('type',$t2);  
		$this->db->order_by('transactionId','desc');
		$this->db->where('type !=',"Cancel"); 
		$this->db->where('currency',$firstcurrency);
		$this->db->where('secondcurrency',$secondcurrency);
		$query=$this->db->get('transaction_history'); 
	//echo $this->db->last_query(); die;
	}	
	else if($t1=='Past 24 Hours' && $t2!='Any Type' && $t3!='date')
	{
		$yesterday=date("Y-m-d", mktime(0, 0, 0, date("m"),date("d")-1,date("Y")));
		$this->db->where('date',$yesterday);  
		$this->db->where('userId',$customer_user_id);  
		$this->db->like('type',$t2);  
		$this->db->where('type !=',"Cancel");
		$this->db->where('currency',$firstcurrency);
		$this->db->where('secondcurrency',$secondcurrency); 
		$this->db->order_by('transactionId','desc');
		$query=$this->db->get('transaction_history'); 
	}

	else if($t1=='Past 24 Hours' && $t2=='Any Type' && $t3!='date')
	{
		$yesterday=date("Y-m-d", mktime(0, 0, 0, date("m"),date("d")-1,date("Y")));
		$this->db->where('date',$yesterday);  
		$this->db->where('userId',$customer_user_id);  
	//$this->db->like('type',$t2);  
		$this->db->where('type !=',"Cancel");
		$this->db->where('currency',$firstcurrency);
		$this->db->where('secondcurrency',$secondcurrency); 
		$this->db->order_by('transactionId','desc');
		$query=$this->db->get('transaction_history'); 
	}
	else if($t1=='Past 24 Hours' && $t2!='Any Type' && $t3=='date')
	{
		$yesterday=date("Y-m-d", mktime(0, 0, 0, date("m"),date("d")-1,date("Y")));
		$this->db->where('date >=',$yesterday);  
		$this->db->where('userId',$customer_user_id);  
		$this->db->like('type',$t2);  
		$this->db->where('type !=',"Cancel"); 
		$this->db->where('currency',$firstcurrency);
		$this->db->where('secondcurrency',$secondcurrency);
		$this->db->order_by('transactionId','desc'); 
		$query=$this->db->get('transaction_history'); 
	}

	else if($t1=='Past 24 Hours' && $t2=='Any Type' && $t3=='date')
	{
		$yesterday=date("Y-m-d", mktime(0, 0, 0, date("m"),date("d")-1,date("Y")));
		$this->db->where('date >=',$yesterday);  
		$this->db->where('userId',$customer_user_id);  
			//$this->db->like('type',$t2);  
		$this->db->order_by('transactionId','desc');
		$this->db->where('type !=',"Cancel"); 
		$this->db->where('currency',$firstcurrency);
		$this->db->where('secondcurrency',$secondcurrency);
		$query=$this->db->get('transaction_history'); 
	}
	else if($t1=='Past Week' && $t2!='Any Type' && $t3!='date')
	{
		$curdate=date('Y-m-d');
		$week = date("W",strtotime($curdate));  
		$lastweek = $week;
		$year = date("Y",strtotime($curdate));
		$from = date("Y-m-d", strtotime("{$year}-W{$lastweek}-1")); 
		$to = date("Y-m-d", strtotime("{$year}-W{$lastweek}-7"));  
		$this->db->where("`date` BETWEEN '$from' and '$to'", NULL, FALSE);  
		$this->db->where('userId',$customer_user_id);  
		$this->db->like('type',$t2);  
		$this->db->order_by('transactionId','desc');
		$this->db->where('currency',$firstcurrency);
		$this->db->where('secondcurrency',$secondcurrency);
		$this->db->where('type !=',"Cancel"); 
		$query=$this->db->get('transaction_history'); 
	}
	else if($t1=='Past Week' && $t2=='Any Type' && $t3!='date')
	{
		$curdate=date('Y-m-d');
		$week = date("W",strtotime($curdate));  
		$lastweek=$week;
		$year = date("Y",strtotime($curdate));
		$from = date("Y-m-d", strtotime("{$year}-W{$lastweek}-1")); 
		$to = date("Y-m-d", strtotime("{$year}-W{$lastweek}-7"));  
		$this->db->where("`date` BETWEEN '$from' and '$to'", NULL, FALSE);  
		$this->db->where('userId',$customer_user_id);  
	//$this->db->like('type',$t2);  
		$this->db->order_by('transactionId','desc');
		$this->db->where('currency',$firstcurrency);
		$this->db->where('secondcurrency',$secondcurrency);
		$this->db->where('type !=',"Cancel"); 
		$query=$this->db->get('transaction_history'); 
	}
	else if($t1=='Past Week' && $t2!='Any Type' && $t3=='date')
	{
		$curdate=date('Y-m-d');
		$week = date("W",strtotime($curdate));  
		$lastweek=$week;
		$year = date("Y",strtotime($curdate));
		$from = date("Y-m-d", strtotime("{$year}-W{$lastweek}-1")); 
		$to = date("Y-m-d", strtotime("{$year}-W{$lastweek}-7"));  
		$this->db->where("`date` BETWEEN '$from' and '$to'", NULL, FALSE);  
		$this->db->where('userId',$customer_user_id);  
		$this->db->like('type',$t2);  
		$this->db->order_by('transactionId','desc');
		$this->db->where('type !=',"Cancel");
		$this->db->where('currency',$firstcurrency);
		$this->db->where('secondcurrency',$secondcurrency); 
		$query=$this->db->get('transaction_history'); 
	}
	else if($t1=='Past Week' && $t2=='Any Type' && $t3=='date')
	{
		$curdate=date('Y-m-d');
		$week = date("W",strtotime($curdate));  
		$lastweek=$week;
		$year = date("Y",strtotime($curdate));
		$from = date("Y-m-d", strtotime("{$year}-W{$lastweek}-1")); 
		$to = date("Y-m-d", strtotime("{$year}-W{$lastweek}-7"));  
		$this->db->where("`date` BETWEEN '$from' and '$to'", NULL, FALSE);  
		$this->db->where('userId',$customer_user_id); 
		$this->db->where('currency',$firstcurrency);
		$this->db->where('secondcurrency',$secondcurrency); 
	//$this->db->like('type',$t2);  
		$this->db->order_by('transactionId','desc');
		$this->db->where('type !=',"Cancel"); 
		$query=$this->db->get('transaction_history'); 
	}
	else if($t1=='Past Month' && $t2!='Any Type' && $t3!='date')
	{
		$curdate=date('Y-m-d');
		$start_date = date('Y-m-d', strtotime($curdate . ' -1 month'));

		$month = date("m",strtotime($curdate));  
		$year = date("Y",strtotime($curdate)); 
		$lastmonth=$month;
		$first = date('Y-m-d', mktime(0, 0, 0, $lastmonth, 1, $year));
		$last = date('Y-m-t', mktime(0, 0, 0, $lastmonth, 1, $year)); 
		$this->db->where("`date` BETWEEN '$start_date' and '$curdate'", NULL, FALSE);  
		$this->db->where('userId',$customer_user_id);  
		$this->db->like('type',$t2);  
		$this->db->order_by($t3,$sortss); 
		$this->db->where('currency',$firstcurrency);
		$this->db->where('secondcurrency',$secondcurrency);
		$this->db->where('type !=',"Cancel"); 
		$query=$this->db->get('transaction_history'); 
	} 
	else if($t1=='Past Month' && $t2!='Any Type' && $t3=='date')
	{
		$curdate=date('Y-m-d');
		$start_date = date('Y-m-d', strtotime($curdate . ' -1 month'));

		$month = date("m",strtotime($curdate));  
		$year = date("Y",strtotime($curdate)); 
		$lastmonth=$month;
		$first = date('Y-m-d', mktime(0, 0, 0, $lastmonth, 1, $year));
		$last = date('Y-m-t', mktime(0, 0, 0, $lastmonth, 1, $year)); 
		$this->db->where("`date` BETWEEN '$start_date' and '$curdate'", NULL, FALSE);  
		$this->db->where('userId',$customer_user_id);  
		$this->db->like('type',$t2);  
		$this->db->order_by('transactionId','desc');
		$this->db->where('type !=',"Cancel"); 
		$this->db->where('currency',$firstcurrency);
		$this->db->where('secondcurrency',$secondcurrency);
		$query=$this->db->get('transaction_history'); 
	} 
	else if($t1=='Past Month' && $t2=='Any Type' && $t3!='date')
	{
		$curdate=date('Y-m-d');
		$start_date = date('Y-m-d', strtotime($curdate . ' -1 month'));

		$month = date("m",strtotime($curdate));  
		$year = date("Y",strtotime($curdate)); 
		$lastmonth=$month;
		$first = date('Y-m-d', mktime(0, 0, 0, $lastmonth, 1, $year));
		$last = date('Y-m-t', mktime(0, 0, 0, $lastmonth, 1, $year)); 
		$this->db->where("`date` BETWEEN '$start_date' and '$curdate'", NULL, FALSE);  
		$this->db->where('userId',$customer_user_id);  
	//$this->db->like('type',$t2);  
		$this->db->order_by('transactionId','desc');
		$this->db->where('type !=',"Cancel");
		$this->db->where('currency',$firstcurrency);
		$this->db->where('secondcurrency',$secondcurrency); 
		$query=$this->db->get('transaction_history'); 
	} 
	else if($t1=='Past Month' && $t2=='Any Type' && $t3=='date')
	{
		$curdate=date('Y-m-d');
		$start_date = date('Y-m-d', strtotime($curdate . ' -1 month'));

		$month = date("m",strtotime($curdate));  
		$year = date("Y",strtotime($curdate)); 
		$lastmonth=$month;
		$first = date('Y-m-d', mktime(0, 0, 0, $lastmonth, 1, $year));
		$last = date('Y-m-t', mktime(0, 0, 0, $lastmonth, 1, $year)); 
		$this->db->where('type !=',"Cancel"); 
		$this->db->where("`date` BETWEEN '$start_date' and '$curdate'", NULL, FALSE);  
		$this->db->where('userId',$customer_user_id);  
		$this->db->where('currency',$firstcurrency);
		$this->db->where('secondcurrency',$secondcurrency);
	//$this->db->like('type',$t2);  
		$this->db->order_by('transactionId','desc');
		$query=$this->db->get('transaction_history'); 
	} 
	else
	{
		echo "dslkfjsdlkjf;skdjf";
	}
		//echo $this->db->last_query(); die;
	if($query->num_rows() >= 1)
	{                	
		return $query->result();			 
	}   
	else
	{      
		return false;		
	}
}
function get_sumamount($price)
{
	$this->db->where('Price >=',$price);
	$this->db->where('Type','Buy');
	$this->db->select_sum('Amount','amount');
	$query = $this->db->get('coin_order');
	if($query->num_rows())
	{
		$row = $query->row();
		return $row->amount;
	}
	else
	{
		return false;
	}
}
function get_sellsumamount($price)
{
	$this->db->where('Price <=',$price);
	$this->db->where('Type','Sell');
	$this->db->select_sum('Amount','amount');
	$query = $this->db->get('coin_order');
	if($query->num_rows())
	{
		$row = $query->row();
		return $row->amount;
	}
	else
	{
		return false;
	}
}
function get_ripple_address()
{
	$this->db->where('id',1);
	$query = $this->db->get('site_config');
	if($query->num_rows())
	{
		return $row = $query->row();
		// return $row->ripple_address;
	}
	else
	{
		return false;
	}
}
function get_destinationtag()
{
	$customer_user_id		=	$this->session->user_id; 
	$this->db->where('user_id',$customer_user_id);
	$query = $this->db->get('users');
	if($query->num_rows())
	{
		$row = $query->row();
		return $row->destination_tag;
	}
	else
	{
		return false;
	}
}
function add_destination_tag($random_string)
{
	$customer_user_id		=	$this->session->user_id; 
	$this->db->where('user_id',$customer_user_id);
	$query = $this->db->update('users',array('destination_tag'=>$random_string));
	return true;
}
function get_transactions()
{
	$customer_user_id		=	$this->session->user_id; 
	$this->db->where('userId',$customer_user_id);
	$query = $this->db->get('transaction_history');
	if($query->num_rows())
	{
		return $query->result();
	}
	else
	{
		return false;
	}
}
function metatitle($metaurl)
{
	$this->db->where('page_name',$metaurl);  
	$query=$this->db->get('meta_content'); 
	if($query->num_rows >= 1)
	{                	
		return $query->row();			 
	}   
	else
	{      
		return false;		
	}
}
//tradeview chart section starts here
function forLowHigh($source,$interval,$type=NULL)
{ 
	$exp 		= explode(' ',$source);
	$curdate 	= "";
	$time 		= "";

	
	$destination = date('Y-m-d H:i:s', strtotime($source . ' +'.$interval.' minutes'));

	
	$names 	= array('filled', 'partially');

	$currency_session	=	"btc_usd";
	
	$exp = explode('_',$currency_session);
	$firstCurrency  = strtoupper($exp[0]);
	$secondCurrency = strtoupper($exp[1]);
	$this->db->select_sum('Amount','volume');
	$this->db->select_min('Price', 'low');
	$this->db->select_max('Price', 'high');
	$this->db->select_min('Price', 'open');
	$this->db->select_max('Price', 'close');
	$this->db->select('orderTime', 'orderTime');
	$this->db->from('coin_order');          

	$this->db->where("datetime >= '$source'");
	$this->db->where("datetime <= '$destination'");

	$this->db->where_in('status', $names);
	$this->db->where(array('firstCurrency' =>$firstCurrency, 'secondCurrency' =>$secondCurrency)); 
	$query	=	$this->db->get(); 
	 // echo $this->db->last_query();
	if($query->num_rows() >= 1)
	{                
		return $row = $query->row();			 
	}   
	else
	{      
		return false;		
	}
}
function getstart_date()
{

	$this->db->order_by('trade_id','asc'); 
	$query	=	$this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{                
		$row = $query->row();			 
		return $row->datetime;
	}   
	else
	{      
		return false;		
	}
}

//function for check the login details
function logincheck($emailid)
{
	$this->db->where('emailid',$emailid);
	$query=$this->db->get('users');
	if($query->num_rows()==1)
	{

		return true;
	}
	else
	{
		return false;
	}
}

function emailupdate($email,$id)
{
	$data=array('emailid'=>$email);
	$this->db->where('user_id',$id);
	$res=$this->db->update('users',$data);
	if($res)
	{
		echo "Your email updated Successfully";
	}
	else
	{
		echo "Error in email updation";
	}
}

function profileupdate($data,$id)
{
	$this->db->where('user_id',$id);
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

/*function addenquiry($data)
 {
   $res=$this->db->insert('enquiry',$data);
   if($res)
   {
   	return true;
   }
   else
   {
   	return false;
   }
}*/

 function addenquiry($data) //new function added by Jegan for contactus page
 {
 	$res=$this->db->insert('support_detail',$data);
 	if($res)
 	{
 		return true;
 	}
 	else
 	{
 		return false;
 	}
 }


 function get_contactus_details()
 {
 	$res=$this->db->get('site_config');
 	if($res)
 	{
 		return $res->row();
 	}
 }

 // Anand Api function

 function get_data($tbl_name,$where,$type)
 {
 	$this->db->where($where);
 	$query = $this->db->get($tbl_name);
	//echo $this->db->last_query();die;
 	$output = '';
 	if($query->num_rows()>0){

 		if($type=='result')
 			$output = $query->result();
 		else if($type=='row')
 			$output = $query->row();
 		return $output;

 	} else {
 		return false;
 	}
 }

 function get_safety($id)
 {
 	$this->db->where('pageid',$id);  
 	$this->db->where('status','active');  
 	$query	=	$this->db->get('pages'); 
 	if($query->num_rows() >= 1)
 	{                
 		return $query->row();			 
		 //return $row->status;
 	}   
 	else
 	{      
 		return false;		
 	}
 }


function trade_history_type() //added by jegan
{
	$id=$this->session->user_id;
	$this->db->limit(15);
	$type=$this->input->get('p');
	if($type=="all")
	{
		$this->db->where('userid',$id);
		$res=$this->db->get('coin_order');
		if($res->num_rows()>0)
		{


			echo "<div class='table-responsive cls_trade_table'>";
			echo "<table class='table table-striped'>";
			echo "<thead>";
			echo "<tr>";
			echo "<th>Type</th>";
			echo "<th>Price</th>";
			echo "<th>BTC</th>";
			echo "<th>Total</th>";
			echo "<th>Time</th>";

			foreach($res->result() as $row)
			{

				echo "</tr>";
				echo "</thead>";
				echo "<tbody>";

				echo "<tr>";
				echo "<td><span class='cls_pink_text'>".$row->Type."</span></td>";
				echo "<td>".$row->Price."</td>";
				echo "<td>".$row->Amount."</td>";
				echo "<td>".$row->Total."</td>";
				echo "<td>".$row->orderTime."</td>";
				echo "</tr>";

			}

			echo "</tbody>";
			echo "</table> ";
			echo "</div>";
		}
		else
		{
			return false;
		}
	}
	else if($type=="buy")
	{
		$this->db->where(array('userid'=>$id,'Type'=>$type));
		$this->db->limit(10);
		$res=$this->db->get('coin_order');
		if($res->num_rows()>0)
		{
			echo "<div class='table-responsive cls_trade_table'>";
			echo "<table class='table table-striped'>";
			echo "<thead>";
			echo "<tr>";
			echo "<th>Type</th>";
			echo "<th>Price</th>";
			echo "<th>BTC</th>";
			echo "<th>Total</th>";
			echo "<th>Time</th>";

			foreach($res->result() as $row)
			{

				echo "</tr>";
				echo "</thead>";
				echo "<tbody>";

				echo "<tr>";
				echo "<td><span class='cls_pink_text'>".$row->Type."</span></td>";
				echo "<td>".$row->Price."</td>";
				echo "<td>".$row->Amount."</td>";
				echo "<td>".$row->Total."</td>";
				echo "<td>".$row->orderTime."</td>";
				echo "</tr>";

			}

			echo "</tbody>";
			echo "</table> ";
			echo "</div>";

		}
		else
		{
			return false;
		}

	}
	else if($type=="sell")
	{
		$this->db->where(array('userid'=>$id,'Type'=>$type));
		$this->db->limit(10);
		$res=$this->db->get('coin_order');
		if($res->num_rows()>0)
		{
			echo "<div class='table-responsive cls_trade_table'>";
			echo "<table class='table table-striped'>";
			echo "<thead>";
			echo "<tr>";
			echo "<th>Type</th>";
			echo "<th>Price</th>";
			echo "<th>BTC</th>";
			echo "<th>Total</th>";
			echo "<th>Time</th>";

			foreach($res->result() as $row)
			{

				echo "</tr>";
				echo "</thead>";
				echo "<tbody>";

				echo "<tr>";
				echo "<td><span class='cls_pink_text'>".$row->Type."</span></td>";
				echo "<td>".$row->Price."</td>";
				echo "<td>".$row->Amount."</td>";
				echo "<td>".$row->Total."</td>";
				echo "<td>".$row->orderTime."</td>";
				echo "</tr>";

			}

			echo "</tbody>";
			echo "</table> ";
			echo "</div>";

		}
		else
		{
			return false;
		}

	}

}

function deposit_type() //added by jegan
{
	$id=$this->session->user_id;
	//$this->db->limit(10);
	$this->db->order_by('request_date','desc');
	$type=$this->input->get('p');
	if($type=="all")
	{

		echo "<div id='div_table11' class='table-responsive cls_trade_table'>";
		echo "<table class='table table-striped trade_table' custom='table11'>";
		echo "<thead>";
		echo "<tr>";
		echo "<th>Date</th>";
		echo "<th>Type</th>";
		echo "<th>Amount Credited</th>";
		echo "<th>Status</th>";
		echo "</tr>";
		echo "</thead>";
		$this->db->where('user_id',$id);
		$res=$this->db->get('deposit_payment');
		if($res->num_rows()>0)
		{


			/*echo "<div class='table-responsive cls_trade_table'>";
			echo "<table class='table table-striped'>";*/

			echo "<tbody>";


			foreach($res->result() as $row)
			{



				echo "<tr>";
              //echo "<td><span class='cls_pink_text'>".$row->Type."</span></td>";
				echo "<td>".$row->request_date."</td>";
				echo "<td><span class='cls_pink_text'>".$row->type."</span></td>";
				echo "<td>".$row->amount."</td>";
				echo "<td>".$row->status."</td>";
				echo "</tr>";

			}


		}
		else
		{
			echo "<td colspan='5'>No Recored Founds</td>";

			//return false;
		}
		echo "</tbody>";
		echo "</table> ";
		echo "</div>";
	}
	else if($type=="Bank EFT")
	{
		echo "<div id='div_table12' class='table-responsive cls_trade_table'>";
		echo "<table class='table table-striped trade_table' custom='table12'>";
		echo "<thead>";
		echo "<tr>";
		echo "<th>Date</th>";
		echo "<th>Type</th>";
		echo "<th>Amount Credited</th>";
		echo "<th>Status</th>";
		echo "</tr>";
		echo "</thead>";
		echo "<tbody>";
		$this->db->where(array('user_id'=>$id,'type'=>$type));
		//$this->db->limit(10);
		$res=$this->db->get('deposit_payment');
		if($res->num_rows()>0)
		{
			/*echo "<div class='table-responsive cls_trade_table'>";
			echo "<table class='table table-striped'>";*/



			foreach($res->result() as $row)
			{



				echo "<tr>";
              //echo "<td><span class='cls_pink_text'>".$row->Type."</span></td>";
				echo "<td>".$row->request_date."</td>";
				echo "<td><span class='cls_pink_text'>".$row->type."</span></td>";
				echo "<td>".$row->amount."</td>";
				echo "<td>".$row->status."</td>";
				echo "</tr>";

			}


		}
		else
		{
			echo "<td colspan='5'>No Recored Founds</td>";

			//return false;
		}
		echo "</tbody>";
		echo "</table> ";
		echo "</div>";

	}
	else if($type=="BTC payment")
	{
		echo "<div id='div_table13' class='table-responsive cls_trade_table'>";
		echo "<table class='table table-striped trade_table' custom='table13'>";
		echo "<thead>";
		echo "<tr>";
		echo "<th>Date</th>";
		echo "<th>Type</th>";
		echo "<th>Amount Credited</th>";
		echo "<th>Status</th>";

		echo "</tr>";
		echo "</thead>";
		echo "<tbody>";
		$this->db->where(array('user_id'=>$id,'type'=>$type));
		//$this->db->limit(10);
		$res=$this->db->get('deposit_payment');
		if($res->num_rows()>0)
		{/*
			echo "<div class='table-responsive cls_trade_table'>";
			echo "<table class='table table-striped'>";*/



			foreach($res->result() as $row)
			{

				echo "<tr>";
              //echo "<td><span class='cls_pink_text'>".$row->Type."</span></td>";
				echo "<td>".$row->request_date."</td>";
				echo "<td><span class='cls_pink_text'>".$row->type."</span></td>";
				echo "<td>".$row->amount."</td>";
				echo "<td>".$row->status."</td>";
				echo "</tr>";

			}


		}
		else
		{
			echo "<td colspan='5'>No Recored Founds</td>";

			//return false;
		}
		echo "</tbody>";
		echo "</table> ";
		echo "</div>";

	}
	else if($type=="ETH payment")
	{
		echo "<div id='div_table14' class='table-responsive cls_trade_table'>";
		echo "<table class='table table-striped trade_table' custom='table14'>";
		echo "<thead>";
		echo "<tr>";
		echo "<th>Date</th>";
		echo "<th>Type</th>";
		echo "<th>Amount Credited</th>";
		echo "<th>Status</th>";
		echo "</tr>";
		echo "</thead>";
		echo "<tbody>";
		$this->db->where(array('user_id'=>$id,'type'=>$type));
		//$this->db->limit(10);
		$res=$this->db->get('deposit_payment');
		if($res->num_rows()>0)
		{
		/*	echo "<div class='table-responsive cls_trade_table'>";
		echo "<table class='table table-striped'>";*/



		foreach($res->result() as $row)
		{



			echo "<tr>";
              //echo "<td><span class='cls_pink_text'>".$row->Type."</span></td>";
			echo "<td>".$row->request_date."</td>";
			echo "<td><span class='cls_pink_text'>".$row->type."</span></td>";
			echo "<td>".$row->amount."</td>";
			echo "<td>".$row->status."</td>";
			echo "</tr>";

		}


	}
	else
	{
		echo "<td colspan='5'>No Recored Founds</td>";

			//return false;
	}
	echo "</tbody>";
	echo "</table> ";
	echo "</div>";
}

else if($type=="LTC payment")
{
	echo "<div id='div_table15' class='table-responsive cls_trade_table'>";
	echo "<table class='table table-striped trade_table' custom='table15'>";
	echo "<thead>";
	echo "<tr>";
	echo "<th>Date</th>";
	echo "<th>Type</th>";
	echo "<th>Amount Credited</th>";
	echo "<th>Status</th>";
	echo "</tr>";
	echo "</thead>";
	echo "<tbody>";

	$this->db->where(array('user_id'=>$id,'type'=>$type));
		//$this->db->limit(10);
	$res=$this->db->get('deposit_payment');
	if($res->num_rows()>0)
	{
		/*	echo "<div class='table-responsive cls_trade_table'>";
		echo "<table class='table table-striped'>";*/


		foreach($res->result() as $row)
		{



			echo "<tr>";
              //echo "<td><span class='cls_pink_text'>".$row->Type."</span></td>";
			echo "<td>".$row->request_date."</td>";
			echo "<td><span class='cls_pink_text'>".$row->type."</span></td>";
			echo "<td>".$row->amount."</td>";
			echo "<td>".$row->status."</td>";
			echo "</tr>";

		}


	}
	else
	{
		echo "<td colspan='5'>No Recored Founds</td>";

			//return false;
	}
	echo "</tbody>";
	echo "</table> ";
	echo "</div>";
}

}

function deposit_status_type() //added by jegan
{


	echo "<div id='div_table16' class='table-responsive cls_trade_table'>";
	echo "<table class='table table-striped trade_table' custom='table16'>";
	echo "<thead>";
	echo "<tr>";
	echo "<th>Date</th>";
	echo "<th>Type</th>";
	echo "<th>Amount Credited</th>";
	echo "<th>Status</th>";
	echo "</tr>";
	echo "</thead>";
	echo "<tbody>";



	$id=$this->session->user_id;
	//$this->db->limit(10);
	$status=$this->input->get('p');
	$bank=$this->input->get('p1');
	$this->db->order_by('request_date','desc');
	$this->db->where('user_id',$id);
	$this->db->where('type',$bank);
	
	if($status != 'all'){
		$this->db->where('status',$status);
	}
	
	$res=$this->db->get('deposit_payment');

	if($res->num_rows()>0)
	{

			/*echo "<div class='table-responsive cls_trade_table'>";
			echo "<table class='table table-striped'>";*/



			foreach($res->result() as $row)
			{


				echo "<tr>";
              //echo "<td><span class='cls_pink_text'>".$row->Type."</span></td>";
				echo "<td>".$row->request_date."</td>";
				echo "<td><span class='cls_pink_text'>".$row->type."</span></td>";
				echo "<td>".$row->amount."</td>";
				echo "<td>".$row->status."</td>";
				echo "</tr>";

			}



		}
		else{
			echo "<td colspan='5'>No Recored Founds</td>";
			//return false;
		}
		echo "</tbody>";
		echo "</table> ";
		echo "</div>";



	}

function withdraw_type() //added by jegan
{
	$id=$this->session->user_id;
	//$this->db->limit(20);
	$type=$this->input->get('p');
	if($type=="all")
	{

		echo "<div id='div_table17' class='table-responsive cls_trade_table with_table'>";
		echo "<table class='table table-striped trade_table' custom='table17'>";
		echo "<thead>";
		echo "<tr>";
		echo "<th style='text-align:left;' width='10%'>Date</th>";
		echo "<th style='text-align:left;' width='15%'>Type</th>";
		echo "<th style='text-align:left;' width='10%'>Account/Address</th>";

		echo "<th style='text-align:left;' width='10%'>Currency</th>";
		echo "<th style='text-align:left;' width='20%'>Amount Sent</th>";
		echo "<th style='text-align:left;' width='20%'>Comment</th>";
		echo "</tr>";
		echo "</thead>";
		echo "<tbody>";
	/*
		$this->db->select('*');
		$this->db->from('coin_withdraw');
		$this->db->join('withdraw_request','coin_withdraw.userid=withdraw_request.user_id');
		//$this->db->where('userid',$id);*/
		//$res=$this->db->get();
		//$res=$this->db->get('coin_withdraw');
		$res = $this->db->query("SELECT with_id,payment,request_date,status,askamount,currency FROM `coin_withdraw` where userId='$id' UNION SELECT req_id,payment,request_date,status,askamount,currency FROM `withdraw_request` where user_id='$id' ORDER BY request_date desc");

		if($res->num_rows()>0)
		{

/*
			echo "<div class='table-responsive cls_trade_table'>";
			echo "<table class='table table-striped'>";*/

			foreach($res->result() as $row)
			{


				echo "<tr>";
              //echo "<td><span class='cls_pink_text'>".$row->Type."</span></td>";
				echo "<td style='text-align:left;' >".$row->request_date."</td>";
				echo "<td style='text-align:left;'><span class='cls_pink_text'>".$row->payment."</span></td>";
				echo "<td style='text-align:left;'><span class='cls_pink_text'>".$row->purse."</span></td>";

				echo "<td style='text-align:left;'>".$row->currency."</td>";
				echo "<td style='text-align:left;'>".$row->askamount."</td>";
				echo "<td style='text-align:left;'>".$row->status.'&nbsp;&nbsp;&nbsp;&nbsp;';
				echo $row->status=="processing"?'<a href="'.base_url().'gulden/emailresend/'.$row->with_id.'">Email Resend</a>':'';
				echo "</td>";
				echo "</tr>";

			}


		}
		else
		{
			echo "<td colspan='5'><span class='cls_pink_text'>No Records Found</span></td>";

			//return false;
		}
		echo "</tbody>";
		echo "</table> ";
		echo "</div>";
	}
	else if($type=="Bank EFT")
	{
		echo "<div id='div_table18' class='table-responsive cls_trade_table with_table'>";
		echo "<table class='table table-striped trade_table' custom='table18'>";
		echo "<thead>";
		echo "<tr>";
		echo "<th style='text-align:left;' width='10%'>Date</th>";
		echo "<th style='text-align:left;' width='15%'>Type</th>";
		echo "<th style='text-align:left;' width='10%'>Account/Address</th>";

		echo "<th style='text-align:left;' width='10%'>Currency</th>";
		echo "<th style='text-align:left;' width='20%'>Amount Sent</th>";
		echo "<th style='text-align:left;' width='20%'>Comment</th>";
		echo "</tr>";
		echo "</thead>";
		echo "<tbody>";
		$this->db->where(array('user_id'=>$id,'payment'=>$type));
		//$this->db->limit(10);
		$this->db->order_by('request_date','desc');
		$res=$this->db->get('withdraw_request');
		if($res->num_rows()>0)
		{
		/*	echo "<div class='table-responsive cls_trade_table'>";
		echo "<table class='table table-striped'>";*/


		foreach($res->result() as $row)
		{



			echo "<tr>";
              //echo "<td><span class='cls_pink_text'>".$row->Type."</span></td>";
			echo "<td style='text-align:left;'>".$row->request_date."</td>";
			echo "<td style='text-align:left;'><span class='cls_pink_text'>".$row->payment."</span></td>";
			echo "<td style='text-align:left;'><span class='cls_pink_text'>".$row->purse."</span></td>";

			echo "<td style='text-align:left;'>".$row->currency."</td>";
			echo "<td style='text-align:left;'>".$row->askamount."</td>";
			echo "<td style='text-align:left;'>".$row->status.'&nbsp;&nbsp;&nbsp;&nbsp;';
			echo $row->status=="processing"?'<a href="'.base_url().'gulden/emailresend/'.$row->req_id.'">Email Resend</a>':'';
			echo "</td>";
			echo "</tr>";

		}


	}
	else
	{
		echo "<td colspan='5'><span class='cls_pink_text'>No Records Found</span></td>";

			//return false;
	}
	echo "</tbody>";
	echo "</table> ";
	echo "</div>";

}
else if($type=="bitcoin")
{
	echo "<div id='div_table19' class='table-responsive cls_trade_table with_table'>";
	echo "<table class='table table-striped trade_table' custom='table19'>";
	echo "<thead>";
	echo "<tr>";
	echo "<th>Date</th>";
	echo "<th>Type</th>";
	echo "<th>Account/Address</th>";
	echo "<th>Currency</th>";
	echo "<th>Amount Sent</th>";
	echo "<th>Comment</th>";
	echo "</tr>";
	echo "</thead>";
	echo "<tbody>";

	$this->db->where(array('userid'=>$id,'payment'=>$type));
		//$this->db->limit(10);
	$this->db->order_by('request_date','desc');
	$res=$this->db->get('coin_withdraw');
	if($res->num_rows()>0)
	{
			/*echo "<div class='table-responsive cls_trade_table'>";
			echo "<table class='table table-striped'>";*/


			foreach($res->result() as $row)
			{



				echo "<tr>";
              //echo "<td><span class='cls_pink_text'>".$row->Type."</span></td>";
				echo "<td>".$row->request_date."</td>";
				echo "<td><span class='cls_pink_text'>".$row->payment."</span></td>";
				echo "<td><span class='cls_pink_text'>".$row->purse."</span></td>";
				echo "<td>".$row->currency."</td>";
				echo "<td>".$row->askamount."</td>";
				echo "<td>".$row->status."</td>";
				echo "</tr>";

			}


		}
		else
		{
			echo "<td colspan='5'><span class='cls_pink_text'>No Records Found</span></td>";

			//return false;
		}
		echo "</tbody>";
		echo "</table> ";
		echo "</div>";
	}

	else if($type=="ethereumcoin")
	{

		echo "<div id='div_table20' class='table-responsive cls_trade_table with_table'>";
		echo "<table class='table table-striped trade_table' custom='table20'>";
		echo "<thead>";
		echo "<tr>";
		echo "<th>Date</th>";
		echo "<th>Type</th>";
		echo "<th>Account/Address</th>";
		echo "<th>Amount Sent</th>";
		echo "<th>Comment</th>";
		echo "</tr>";
		echo "</thead>";
		echo "<tbody>";

		$this->db->where(array('userid'=>$id,'payment'=>$type));
		//$this->db->limit(10);
		$this->db->order_by('request_date','desc');
		$res=$this->db->get('coin_withdraw');
		if($res->num_rows()>0)
		{
		/*	echo "<div class='table-responsive cls_trade_table'>";
		echo "<table class='table table-striped'>";*/



		foreach($res->result() as $row)
		{


			echo "<tr>";
              //echo "<td><span class='cls_pink_text'>".$row->Type."</span></td>";
			echo "<td>".$row->request_date."</td>";
			echo "<td><span class='cls_pink_text'>".$row->payment."</span></td>";
			echo "<td><span class='cls_pink_text'>".$row->purse."</span></td>";
			echo "<td>".$row->askamount."</td>";
			echo "<td>".$row->status."</td>";
			echo "</tr>";

		}


	}
	else
	{
		echo "<td colspan='5'><span class='cls_pink_text'>No Records Found</span></td>";

			//return false;
	}
	echo "</tbody>";
	echo "</table> ";
	echo "</div>";

}

else if($type=="litecoin")
{

	echo "<div id='div_table21' class='table-responsive cls_trade_table with_table'>";
	echo "<table class='table table-striped trade_table' custom='table21'>";
	echo "<thead>";
	echo "<tr>";
	echo "<th>Date</th>";
	echo "<th>Type</th>";
	echo "<th>Account/Address</th>";
	echo "<th>Amount Sent</th>";
	echo "<th>Comment</th>";

	echo "</tr>";
	echo "</thead>";
	echo "<tbody>";
	$this->db->where(array('userid'=>$id,'payment'=>$type));
		//$this->db->limit(10);
	$this->db->order_by('request_date','desc');
	$res=$this->db->get('coin_withdraw');
	if($res->num_rows()>0)
	{
		/*	echo "<div class='table-responsive cls_trade_table'>";
		echo "<table class='table table-striped'>";*/


		foreach($res->result() as $row)
		{


			echo "<tr>";
              //echo "<td><span class='cls_pink_text'>".$row->Type."</span></td>";
			echo "<td>".$row->request_date."</td>";
			echo "<td><span class='cls_pink_text'>".$row->payment."</span></td>";
			echo "<td><span class='cls_pink_text'>".$row->purse."</span></td>";
			echo "<td>".$row->askamount."</td>";
			echo "<td>".$row->status."</td>";
			echo "</tr>";

		}


	}
	else
	{
		echo "<td colspan='5'><span class='cls_pink_text'>No Records Found</span></td>";

			//return false;
	}
	echo "</tbody>";
	echo "</table> ";
	echo "</div>";
}

}


function lastloginhistory()
{

	$id=$this->session->user_id;
	$this->db->where('userid',$id);
	$this->db->order_by('historyId','desc');
	$res=$this->db->get('history');
	if($res->num_rows()>0)
	{
		return $res->row();	

	}  
}
function bankdetailsupdate($data,$id)
{
	$data1 = array('status'=>"0");	
	$this->db->where('usersfk',$id);            	
	$this->db->update('user_bank_details',$data1);

	$data['usersfk']=$id;
	$res=$this->db->insert('user_bank_details',$data);
	if($res)
	{
		echo "Your Bank Details Successfully updated";
	}
	else
	{
		echo "Error in Updation";
	}
}
function acccount_details()
{
	$id=$this->session->user_id;
	$this->db->where('usersfk',$id);
	$this->db->where('status',1);
	$res=$this->db->get('user_bank_details'); 
	if($res->num_rows()>0)
	{
		return $res->row();	
	}
	else
	{
		return false;
	}
}
function onlineuserchat()
{	
	// $this->db->order_by('historyId','desc');
	
	$this->db->where('loginstatus',1);
	$query=$this->db->get('users');
     // echo $this->db->last_query();die;
	$rowcount = $query->num_rows();
     	// 	print_r($rowcount);
	return $rowcount;



}
function logoutstatus($id)

{

	$data['loginstatus']="0";
	$this->db->where('user_id',$id);
	$res=$this->db->update('users',$data);
	return true;
}

/* punitha bavani start Date : 16.07.2016 */

function activatlink($id)
{

	$id= base64_decode($id); 

	$data	=	array(                  
		'status'=>'active',   		
		);
	$this->db->where('user_id',$id);
	$this->db->update('users',$data);  

	return true;


}

function getcreatedAddress($type,$user_id=null)
{   
	if($user_id!='') {
		$customer_user_id =	$user_id;
	} else {
		$customer_user_id =	$this->session->user_id;
	}
	$this->db->where('user_id',$customer_user_id);     
	$query=$this->db->get('coin_address');	 
	//echo $this->db->last_query();die;	     
	if($query->num_rows()>=1)  
	{           
		return $row = $query->row();     
	}      
	else
	{
		return false;
	}
}

/* punitha bavani end */
function lowestaskprice1($firstCurrency,$secondCurrency)
{
	$names = array('active', 'partially');
	$this->db->where('firstCurrency',$firstCurrency);  
	$this->db->where('secondCurrency',$secondCurrency); 
	$this->db->where('Type',"Buy"); 	
	$this->db->where_in('status',$names); 	
	//$this->db->order_by("orderDate","desc");  
	//$this->db->order_by("orderTime","desc");
	$this->db->order_by("Price","desc");  
	$this->db->limit(1);  
	$query=$this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{
		$row = $query->row();
		return $row->Price;
	}
	else
	{
		return false;
	}
}

function highestbidprice1($firstCurrency,$secondCurrency)
{
	$names = array('active', 'partially');
	$this->db->where('firstCurrency',$firstCurrency);  
	$this->db->where('secondCurrency',$secondCurrency);  
	$this->db->where('Type',"Sell");  
	$this->db->where_in('status',$names); 	
	$this->db->order_by('Price',"asc");  
	$this->db->limit(1);  
	$query=$this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{
		$row = $query->row();
		return $row->Price;
	}
	else
	{
		return false;
	}
}
function fetchtrade_history($one,$two)
{
	$customer_user_id		=	$this->session->user_id; 
	$names = array('filled', 'partially');
	$this->db->where('firstCurrency',$one);  
	$this->db->where('secondCurrency',$two);  
	$this->db->where('Type','Buy');  
	$this->db->where('userId',$customer_user_id);  
	$this->db->where_in('status', $names);
	// $this->db->select_sum("Amount",'amount');
	$this->db->from('coin_order');
	//$this->db->group_by("Price");
	$query = $this->db->get('');
	//$query	=	$this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{  
		return $query->result();
	}   
	else
	{   
		return false;		
	}
}
function accountholder()
{

	$id=$this->session->user_id;
	$this->db->where('user_id',$id);
	$res=$this->db->get('users');
	if($res->num_rows()>0)
	{
		$row=$res->row();
		return $row->account_no;	
	}
}
function get_eth_address()
{

	$customer_user_id		=	$this->session->user_id; 
	$this->db->where('user_id',$customer_user_id);  
	$query = $this->db->get('coin_address');
	if($query->num_rows() >= 1)
	{  
		$row = $query->row();
		return $row->ETH;
	}   
	else
	{   
		return false;		
	}
}



function countsellorder($type,$firstcurrency,$secondcurrency)
{
	

	//$id=$this->session->user_id;

	$names = array('active', 'partially');
	$this->db->where_in('status',$names); 	
	$this->db->where('firstCurrency',$firstcurrency); 
	$this->db->where('secondCurrency',$secondcurrency); 
	$this->db->where('Type',$type); 	
	
	//$this->db->where('userId',$id);
	$query=$this->db->get('coin_order'); 

	if($query->num_rows() >= 1)
	{
		return $query->num_rows();
	}
	else
	{
		return false;
	}



}

function bankuserdetails()

{

	$id=$this->session->user_id;
	$this->db->where('user_id',$id);
	$res=$this->db->get('users');
	if($res->num_rows()>0)
	{

		return $res->result();	
	}


}

function getParticularordersprice($orderid)
{ 
	$this->db->where('trade_id',$orderid);  

	$query	=	$this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{
		$row = $query->row();
		return $row->Amount;
	}
	else
	{
		return false;
	}
} 

function checksellorderid($id)
{
	//$this->db->select_sum('filledAmount','totalamount');
	$this->db->where('sellorderId',$id);  
	$this->db->order_by('tempId','desc');  	
	$query	=	$this->db->get('ordertemp'); 
	if($query->num_rows() >= 1)
	{
		$row = $query->row();
		return $row->buyorderId;
	}
	else
	{
		return false;
	}
}
function checkbuyorderid($id)
{
	//$this->db->select_sum('filledAmount','totalamount');
	$this->db->where('buyorderId',$id);  
	$query	=	$this->db->get('ordertemp'); 
	if($query->num_rows() >= 1)
	{
		$row = $query->row();
		return $row->sellorderId;
	}
	else
	{
		return false;
	}
}
function get_ordertemp_count($id)
{
	$this->db->where('buyorderId',$id);  
	$this->db->or_where('sellorderId',$id);  
	$query	=	$this->db->get('ordertemp'); 
	if($query->num_rows())
	{
		return $query->num_rows();
	}
	else
	{
		return false;
	}
}
function get_ordertemp_details($id)
{
	$this->db->where('buyorderId',$id);  
	$this->db->or_where('sellorderId',$id); 
	$query	=	$this->db->get('ordertemp'); 

	if($query->num_rows())
	{
		return $query->result();
	}
	else
	{
		return false;
	}
}

function test123()
{

	$this->db->insert('test1',array('test'=>'hai'));
	return true;
}

function resendmail($id)
{
	$customer_user_id = $this->session->user_id;

	$this->db->where('req_id',$id);
	$this->db->where('user_id',$customer_user_id);
	$this->db->where('status','processing');
	$query = $this->db->get('withdraw_request');
	if($query->num_rows() >=1 )
	{
		$row = $query->row();

		$token = $row->token;
		$amount = $row->amount; 

	}
	
	$this->db->where('id',1);  	
	$query = $this->db->get('site_config');
	if($query->num_rows() == 1)
	{
		$row 			= 	$query->row();
		$admin_email	=	$row->email_id;			 							 
		$companyname	=	$row->company_name;	
		$siteurl		=	$row->siteurl;				
	}
	$userResult = 	$this->get_userdetails($customer_user_id);
	$username 	= 	$userResult->username;
	$to 		= 	$userResult->emailid;
	
	$ip			=	$this->input->ip_address();    
	$confirm	=	$siteurl."/gulden/ewithdraw_confirm/".$token;
	$cancel		=	$siteurl."/gulden/ewithdraw_cancel/".$token;

	/*	GET EMAIL TEMPLATE	START	*/

	$this->db->where('id',6);  	
	$dis_get_email_info = $this->db->get('email_templates')->row();
	$email_from1	=	$dis_get_email_info->from_id;
	$email_subject1	=	$dis_get_email_info->subject;
	$email_content1	=	$dis_get_email_info->message;
	$a	=	array('##USERNAME##'=>$username,'##IP##'=>$ip,'##FROM_EMAIL##'=>$admin_email,'##COMPANYNAME##'=>$companyname,'##AMOUNT##'=>$amount,'##PURSE##'=>$purse_detail,'##CURRENCY##'=>$currency,'##SITEURL##'=>$siteurl,'##ADMIN_EMAIL##'=>$admin_email,'##CONFIRMLINK##'=>$confirm,'##CANCELLINK##'=>$cancel);
	$email_from	=	strtr($email_from1,$a);	
	$email_content	=	strtr($email_content1,$a);

	/*	GET EMAIL TEMPLATE	END	*/

	$this->common_mail($admin_email,$companyname,$to,$email_subject1,$email_content);

	return true;
}
function accoutnumber_model($banktype)
{
	$customer_user_id		=	$this->session->user_id; 
	$this->db->where('user_id',$customer_user_id);
	$this->db->where('payment',$banktype);
	$query = $this->db->get('withdraw_request');
	if($query->num_rows() >=1 )
	{
		$row = $query->row();

		return $row->purse;
	}

}
function activated_verifiedlink($id)
{
	$cur_date	= date('Y-m-d');
	$wheredata = array('user_id'=>$id,'verfiyStatus'=>"unverified");
	$this->db->where($wheredata);	  	
	$query = $this->db->get('users');	
	if($query->num_rows() >= 1)
	{       
		$data = array('status'=>"active",'verfiyStatus'=>"verified",'activated_date'=>$cur_date);	
		$this->db->where('user_id',$id);            	
		$this->db->update('users',$data);
		return "ok";			 
	}   
	else
	{
		return "nok";
	}       
} 
function delete_chat($id)
{
	$this->db->delete('chat',array('chat_id' => $id));       
	return true;

}



function wcn_deposit_process()
{
	$cur_date = date('Y-m-d');
	$cur_time = date('H:i:s');

	$litecoin_row = $this->fetchWallet('wcn');    // fetch litecoin wallet credentials
	$litecoin_username	=	$litecoin_row->username;
	$litecoin_password	=	$litecoin_row->password;
	$litecoin_portnumber = 	$litecoin_row->portnumber;
	$litecoin 	= new jsonRPCClient("http://$litecoin_username:$litecoin_password@127.0.0.1:$litecoin_portnumber/");

	
	$litecoin_isvalid 		= 	$litecoin->listtransactions();

	print_r($litecoin_isvalid);

	//print_r($litecoin_isvalid);
	if($litecoin_isvalid)
	{
		for($i=0;$i<count($litecoin_isvalid);$i++)
		{
			$account  	= 	$litecoin_isvalid[$i]['account'];
			$category 	=  	$litecoin_isvalid[$i]['category'];
			$ltctxid 	=  	$litecoin_isvalid[$i]['txid'];

			if($category=="receive")
			{
				$isvalid = $litecoin->gettransaction($ltctxid);
				/*echo "<pre>";
				print_r($isvalid);*/
				$det_category        		=   $isvalid['details'][0]['category'];

				if($det_category=="receive")
				{
					$ltcaccount        	=   $isvalid['details'][0]['account'];
					$ltcaddress 		= 	$isvalid['details'][0]['address'];
					$litecoin_balance 	= 	$isvalid['details'][0]['amount']; 
					$ltcconfirmations 	= 	$isvalid['confirmations']; 
				}
				else
				{
					$ltcaccount        	=   $isvalid['details'][1]['account'];
					$ltcaddress 		= 	$isvalid['details'][1]['address'];
					$litecoin_balance 	= 	$isvalid['details'][1]['amount']; 
					$ltcconfirmations 	= 	$isvalid['confirmations']; 

				}
				$btcuserId 			= $this->fetchuserIdforcron($ltcaccount);
				$dep_id 			= $ltctxid;
				$bitcoin_balance 	= $litecoin_balance;


				$dep_already = $this->checkdepositalready($btcuserId,$dep_id); 
				if(!$dep_already)
				{

					$fetchBTCbalance 	= $this->fetchuserbalancebyId($btcuserId,'WCN');
					$updateBTCbalance 	= $fetchBTCbalance+$bitcoin_balance;

					// insert data into transaction history

					$this->db->where('userId',$btcuserId);  // for Update current coin balance
					$this->db->update('balance',array('WCN'=>$updateBTCbalance));

					// Transaction History
					$btctransdata = array(
						"userId"=>$btcuserId,
						"type"=>"Deposit",
						"currency"=>"WCN",
					// "depositaddress"=>$btc_address,
						"amount"=>$bitcoin_balance,
						"comment"=>"WCN payment",
						"date"=>$cur_date,
						"time"=>$cur_time,
						"status"=>"active"
						);
					$this->db->insert('transaction_history',$btctransdata);

					// Notification
					$notifydata = array(
						"userId"		=>$btcuserId,
						"type"			=>"Deposit",
						"currency"		=>"WCN",
						"depositAmount"	=>$bitcoin_balance,
						"date"			=>$cur_date,
						"time"			=>$cur_time,
						"status"		=>"active"
						);
					$this->db->insert('notification',$notifydata);

					

					// insert the data for deposit details
					$userdata = array(
						'user_id' => $btcuserId,
						'currency' => "WCN",
						'type' => "WCN payment",
						'request_time' => $cur_time,
						'amount' => $bitcoin_balance,
					//'askamount' => $bitcoin_balance,
						'request_date' => $cur_date,
						'trans_id' => $dep_id,
						'status' => "finished"
						);

					$this->db->insert('deposit_payment',$userdata);	

					
						//Email funcition for user
					/*		Get Admin Details Start		 */ 

					$this->db->where('id',1);  	
					$query = $this->db->get('site_config');
					if($query->num_rows() == 1)
					{
						$row 			= 	$query->row();
						$admin_email	=	$row->email_id;			 							 
						$companyname	=	$row->company_name;	
						$siteurl		=	$row->siteurl;				
					}

					$userResult = 	$this->get_userdetails($btcuserId);
					$username 	= 	$userResult->username;
					$email 		= 	$userResult->emailid;
					$ip	=	$this->input->ip_address();

					/*	GET EMAIL TEMPLATE	START	*/

					$this->db->where('id',16);  	
					$dis_get_email_info = $this->db->get('email_templates')->row();
					$email_from1	=	$dis_get_email_info->from_id;
					$email_subject1	=	$dis_get_email_info->subject;
					$email_content1	=	$dis_get_email_info->message;


					$a	=	array('##USERNAME##'=>$username,'##FROM_EMAIL##'=>$admin_email,
						'##AMOUNT##'=>$bitcoin_balance,
						'##CURRENCY##'=>'ETH',
						'##COMPANYNAME##'=>$companyname,'##EMAIL##'=>$email,'##SITEURL##'=>$siteurl,'##ADMIN_EMAIL##'=>$admin_email);
					$email_from	=	strtr($email_from1,$a);	
					$email_content	=	strtr($email_content1,$a); 
					$this->common_mail($admin_email,$companyname,$email,$email_subject1,$email_content);
					return true;
				}
			}
		}
	}
}

function hit_deposit_process()
{
	$cur_date = date('Y-m-d');
	$cur_time = date('H:i:s');

	$litecoin_row = $this->fetchWallet('hitcoin');    // fetch litecoin wallet credentials
	$litecoin_username	=	$litecoin_row->username;
	$litecoin_password	=	$litecoin_row->password;
	$litecoin_portnumber = 	$litecoin_row->portnumber;
	$litecoin 	= new jsonRPCClient("http://$litecoin_username:$litecoin_password@127.0.0.1:$litecoin_portnumber/");

	
	$litecoin_isvalid 		= 	$litecoin->listtransactions();

	print_r($litecoin_isvalid);

	//print_r($litecoin_isvalid);
	if($litecoin_isvalid)
	{
		for($i=0;$i<count($litecoin_isvalid);$i++)
		{
			$account  	= 	$litecoin_isvalid[$i]['account'];
			$category 	=  	$litecoin_isvalid[$i]['category'];
			$ltctxid 	=  	$litecoin_isvalid[$i]['txid'];

			if($category=="receive")
			{
				$isvalid = $litecoin->gettransaction($ltctxid);
				/*echo "<pre>";
				print_r($isvalid);*/
				$det_category        		=   $isvalid['details'][0]['category'];

				if($det_category=="receive")
				{
					$ltcaccount        	=   $isvalid['details'][0]['account'];
					$ltcaddress 		= 	$isvalid['details'][0]['address'];
					$litecoin_balance 	= 	$isvalid['details'][0]['amount']; 
					$ltcconfirmations 	= 	$isvalid['confirmations']; 
				}
				else
				{
					$ltcaccount        	=   $isvalid['details'][1]['account'];
					$ltcaddress 		= 	$isvalid['details'][1]['address'];
					$litecoin_balance 	= 	$isvalid['details'][1]['amount']; 
					$ltcconfirmations 	= 	$isvalid['confirmations']; 

				}
				$btcuserId 			= $this->fetchuserIdforcron($ltcaccount);
				$dep_id 			= $ltctxid;
				$bitcoin_balance 	= $litecoin_balance;


				$dep_already = $this->checkdepositalready($btcuserId,$dep_id); 
				if(!$dep_already)
				{

					$fetchBTCbalance 	= $this->fetchuserbalancebyId($btcuserId,'HIT');
					$updateBTCbalance 	= $fetchBTCbalance+$bitcoin_balance;

					// insert data into transaction history

					$this->db->where('userId',$btcuserId);  // for Update current coin balance
					$this->db->update('balance',array('HIT'=>$updateBTCbalance));

					// Transaction History
					$btctransdata = array(
						"userId"=>$btcuserId,
						"type"=>"Deposit",
						"currency"=>"HIT",
					// "depositaddress"=>$btc_address,
						"amount"=>$bitcoin_balance,
						"comment"=>"HIT payment",
						"date"=>$cur_date,
						"time"=>$cur_time,
						"status"=>"active"
						);
					$this->db->insert('transaction_history',$btctransdata);

					// Notification
					$notifydata = array(
						"userId"		=>$btcuserId,
						"type"			=>"Deposit",
						"currency"		=>"HIT",
						"depositAmount"	=>$bitcoin_balance,
						"date"			=>$cur_date,
						"time"			=>$cur_time,
						"status"		=>"active"
						);
					$this->db->insert('notification',$notifydata);

					

					// insert the data for deposit details
					$userdata = array(
						'user_id' => $btcuserId,
						'currency' => "HIT",
						'type' => "HIT payment",
						'request_time' => $cur_time,
						'amount' => $bitcoin_balance,
					//'askamount' => $bitcoin_balance,
						'request_date' => $cur_date,
						'trans_id' => $dep_id,
						'status' => "finished"
						);

					$this->db->insert('deposit_payment',$userdata);	

					
						//Email funcition for user
					/*		Get Admin Details Start		 */ 

					$this->db->where('id',1);  	
					$query = $this->db->get('site_config');
					if($query->num_rows() == 1)
					{
						$row 			= 	$query->row();
						$admin_email	=	$row->email_id;			 							 
						$companyname	=	$row->company_name;	
						$siteurl		=	$row->siteurl;				
					}

					$userResult = 	$this->get_userdetails($btcuserId);
					$username 	= 	$userResult->username;
					$email 		= 	$userResult->emailid;
					$ip	=	$this->input->ip_address();

					/*	GET EMAIL TEMPLATE	START	*/

					$this->db->where('id',16);  	
					$dis_get_email_info = $this->db->get('email_templates')->row();
					$email_from1	=	$dis_get_email_info->from_id;
					$email_subject1	=	$dis_get_email_info->subject;
					$email_content1	=	$dis_get_email_info->message;


					$a	=	array('##USERNAME##'=>$username,'##FROM_EMAIL##'=>$admin_email,
						'##AMOUNT##'=>$bitcoin_balance,
						'##CURRENCY##'=>'ETH',
						'##COMPANYNAME##'=>$companyname,'##EMAIL##'=>$email,'##SITEURL##'=>$siteurl,'##ADMIN_EMAIL##'=>$admin_email);
					$email_from	=	strtr($email_from1,$a);	
					$email_content	=	strtr($email_content1,$a); 
					$this->common_mail($admin_email,$companyname,$email,$email_subject1,$email_content);
					return true;
				}
			}
		}
	}
}

function checkdepositalready1()
{
	
	$query = $this->db->get('deposit_payment');
	if($query->num_rows())
	{
		return $query->result();
	}
	else
	{
		return false;
	}
}
function get_bitcoin_transactions()
{
	$access_token = $this->get_access_token();
	$wallet_id="3PnQgkttqJr3YPEecjj4iMxUE7a3Tw3yx1";
	$output = array();
	$return_var = -1;
	$transactions = shell_exec('cd /var/www/html; /usr/bin/node transactions.js "'.trim($access_token).'" "'.trim($wallet_id).'"');

	if($transactions){
		$transactionsJson = json_decode($transactions, true);
		return $transactionsJson['transactions'];
	}
	else
	{
		return array();
	}
}
function BTC_address_list($address)
{

	$this->db->where('address',$address);

	$query = $this->db->get('bitcoin_address');
	if($query->num_rows())
	{
		$value = $query->row();
		return $value->user_id;
	}
	else
	{
		return false;
	}


}
function checkbtcAddress($currency)
{
	$customer_user_id	=	$this->session->user_id;
	$this->db->where('user_id',$customer_user_id);  
	
	$query	=	$this->db->get('bitcoin_address'); 
	if($query->num_rows() >= 1)
	{                
		$row = $query->row();	
		if($currency=="BTC")
		{ 
			$address = $row->address; 
		}
		
		
		return $address;
	}   
	else
	{      
		return false;		
	}
}
function checkdepositAddress_api($currency,$user_id)
{	

	$this->db->where('user_id',$user_id);  
	$query=$this->db->get('coin_address'); 
	if($query->num_rows() >= 1)
	{                
		$row = $query->row();	
		if($currency=="BTC")
		{ 
			$address = $row->BTC; 
		}
		else if($currency=="LTC")
		{ 
			$address = $row->LTC; 
		}
		else if($currency=="ETH")
		{ 
			$address = $row->ETH; 
		}
		else if($currency=="XRP")
		{ 
			$address = $row->XRP; 
		}
		else if($currency=="WCN")
		{ 
			$address = $row->WCN; 
		}
		return $address;
	}   
	else
	{      
		return false;		
	}
}
function disable_tfa()
{
	$customer_user_id	=	$this->session->user_id; 
	$data = array('randcode'=>'disable');	
	$this->db->where('user_id',$customer_user_id);            	
	$this->db->update('users',$data); 
	return true; 
}
function deposit_address_user($currency,$address)
{
	//$customer_user_id	=	$this->session->user_id;
	$this->db->where($currency,$address);  
	$query=$this->db->get('coin_address'); 
	//echo $this->db->last_query();
	if($query->num_rows() >= 1)
	{              

		$row = $query->row();  
		return $row->user_id;
	}   
	else
	{      
		return false;		
	}
}
//308870
} // end of class
?>
