<?php
class Admin_model extends CI_Model
{
	public $getsmtp_hostname        ="bitcoin2.osiztechnologies.com";    
    public $getsmtp_hostpass        ="7kh6r#RJ(Mqv";    
    public $getsmtp_hostusername	="bitcoin2";
	function generall()
	{	
		$data['base']		= $this->config->item('base_url');
	    $data['css']		= $this->config->item('css');  
		
		$data['ckeditor'] 	= $this->ckeditor = array(
		
			//ID of the textarea that will be replaced
			'id' 	=> 	'textareacontent',
			'path'	=>	'js/ckeditor',
		
			//Optionnal values
			'config' => array(
				'toolbar' 	=> 	"Full", 	//Using the Full toolbar
				'width' 	=> 	"350px",	//Setting a custom width
				'height' 	=> 	'250px',	//Setting a custom height
				'filebrowserBrowseUrl' => base_url(). 'js/ckfinder/ckfinder.html',   
          'filebrowserImageBrowseUrl' => base_url(). 'js/ckfinder/ckfinder.html?Type=Images',
          'filebrowserFlashBrowseUrl' => base_url(). 'js/ckfinder/ckfinder.html?Type=Flash',
          'filebrowserUploadUrl' => base_url().'js/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files',
          'filebrowserImageUploadUrl' => base_url() . 'js/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images',
          'filebrowserFlashUploadUrl' => base_url() . 'js/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Flash'
					
			),
		
			//Replacing styles from the "Styles tool"
			'styles' => array(
			
				//Creating a new style named "style 1"
				'style 1' => array (
					'name' 		=> 	'Blue Title',
					'element' 	=> 	'h2',
					'styles' => array(
						'color' 			=> 	'Blue',
						'font-weight' 		=> 	'bold'
					)
				),
				
				//Creating a new style named "style 2"
				'style 2' => array (
					'name' 		=> 	'Red Title',
					'element' 	=> 	'h2',
					'styles' => array(
						'color' 			=> 	'Red',
						'font-weight' 		=> 	'bold',
						'text-decoration'	=> 	'underline'
					)
				)				
			)
		);		
		
		
		$this->load->database();
		   
		return $data;
	}
	
	function mailsettings()
{ 	
	$this->load->library('email');
	$config['wrapchars'] = 76; // Character count to wrap at.
	$config['mailtype'] = 'html'; // text or html Type of mail. If you send HTML email you must send it as a complete web page. Make sure you don't have any relative links or relative image paths otherwise they will not work.
	$config['charset'] = 'utf-8'; // Character set (utf-8, iso-8859-1, etc.).
	$this->email->initialize($config);	
} 
// adin login check
function logincheck()
{
	$username = $this->input->post('username');
	$password 	 = $this->input->post('password');
	$this->db->where('username',$username);
	$this->db->where('password',$password);
	$query = $this->db->get('admin');
	if($query->num_rows() == 1)
	{
		$row = $query->row();
		$login_name	=$row->username;
		$id	=$row->id;
		$this->session->set_userdata('loggeduser',$login_name);
		$this->session->set_userdata('id',$id);
		return true;
	}
	return false;
}
function generatedni()
{
	$query = $this->db->get('admin');
	if($query->num_rows() == 1)
	{
		$row = $query->row();
		$login_name	=$row->username;
		$id	=$row->id;
		$this->session->set_userdata('loggeduser',$login_name);
		$this->session->set_userdata('id',$id);
		return true;
	}
	return false;
}
function loginsubadmincheck()
{
	$username = $this->input->post('username');
	$password 	 = $this->input->post('password');
	$this->db->where('sub_username',$username);
	$this->db->where('sub_password',$password);
	$query = $this->db->get('sub_admin');
	if($query->num_rows() == 1)
	{
		$row = $query->row();
		$login_name	=$row->sub_username;
		$subId	=$row->subId;
		$permission	=$row->permission;
		$this->session->set_userdata('loggeduser',$login_name);
			$this->session->set_userdata('subId',$subIbd);
		//$this->session->set_userdata('permission',$permission);
		return true;
	}
	return false;
}
//adin get forget password	
	function get_forgetpswd()
	{
	
		$this->load->library('email');
		
		$wheredata = array('email_id'=>$this->input->post('emailid'));
		$this->db->where($wheredata);	  
        $query = $this->db->get('admin');
		
		 if($query->num_rows() == 1)
        {           
            $row = $query->row();
			$username=$row->username;				
			$password=$row->password;				
 		$config['charset'] = 'utf-8';
		$config['wordwrap'] = TRUE;
		$config['mailtype'] = 'html';	 
		$this->email->initialize($config);	 
		$this->email->from($row->email_id);
		$this->email->to($this->input->post('emailid'));
		$this->email->subject('Bitinka Admin Credentials');
		$this->email->message("<p style='font-family: Helvetica,Arial,sans-serif; color: rgb(84, 84, 84); margin: 0pt 20px; font-size: 14px; text-align: left; padding: 15px 0px;'>Your Username:    <b>".$username."</b></p><p style='font-family: Helvetica,Arial,sans-serif; color: rgb(84, 84, 84); margin: 0pt 20px; font-size: 14px; text-align: left; padding: 15px 0px;'>Your Password:   <b>".$password."</b></p>");
		$this->email->send();
		
		/*$config['protocal'] = 'smtp';
        $config['mail_path'] = 'ssl://smtp.googlemail.com';
        $config['smtp_host'] = 'ssl://smtp.googlemail.com';
        $config['smtp_port'] = '465';
        $config['smtp_user'] = 'USEREMAIL';
        $config['smtp_pass'] = 'PASSWORD';
        $config['charset'] = "utf-8";
        $config['mailtype'] = "html";
        $config['newline'] = "\r\n";*/
			return true;		
		}
		else
		{
			return false;
		}
		
		
	}

	//subadin get forget password	
	function get_subforgetpswd()
	{
	
		$this->load->library('email');
		
		$wheredata = array('sub_emailid'=>$this->input->post('emailid'));
		$this->db->where($wheredata);	  
        $query = $this->db->get('sub_admin');
		 if($query->num_rows() == 1)
        {           
            $row = $query->row();
			$username=$row->sub_username;				
			$password=$row->sub_password;
			$querys = $this->db->get('admin');
		 if($querys->num_rows() == 1)
        {
        	   $rows = $querys->row();
			$email_id=$rows->email_id;
        }				
 		$config['charset'] = 'utf-8';
		$config['wordwrap'] = TRUE;
		$config['mailtype'] = 'html';	 
		$this->email->initialize($config);	 
		 $this->email->from($email_id);
		 $this->email->to($this->input->post('emailid'));
		 $this->email->subject('Bitinka Sub-Admin Credentials');
		 $this->email->message("<p style='font-family: Helvetica,Arial,sans-serif; color: rgb(84, 84, 84); margin: 0pt 20px; font-size: 14px; text-align: left; padding: 15px 0px;'>Your Username:    <b>".$username."</b></p><p style='font-family: Helvetica,Arial,sans-serif; color: rgb(84, 84, 84); margin: 0pt 20px; font-size: 14px; text-align: left; padding: 15px 0px;'>Your Password:   <b>".$password."</b></p>"); 
		$this->email->send();
		
		/*$config['protocal'] = 'smtp';
        $config['mail_path'] = 'ssl://smtp.googlemail.com';
        $config['smtp_host'] = 'ssl://smtp.googlemail.com';
        $config['smtp_port'] = '465';
        $config['smtp_user'] = 'USEREMAIL';
        $config['smtp_pass'] = 'PASSWORD';
        $config['charset'] = "utf-8";
        $config['mailtype'] = "html";
        $config['newline'] = "\r\n";*/
			return true;		
		}
		else
		{
			return false;
		}
		
		
	}
//reset admin password
function admin_change_pswd()
{	
	$oldpassword =$this->input->post('password');
	$this->db->where('password',$oldpassword);  	
	$query = $this->db->get('admin');
	if($query->num_rows() == 1)
	{
		$data = array('password'=>$this->input->post('newpassword'));
		$query=$this->db->update('admin',$data);
		return true;	
	}
	else
	{
		return false;
	}
}
 
function subadmin_change_pswd()
{	
	$subId=$this->session->userdata('subId'); 
	$oldpassword =$this->input->post('password');
	$this->db->where('subId',$subId);  
	$this->db->where('sub_password',$oldpassword);  	
	$query = $this->db->get('sub_admin');
	if($query->num_rows() == 1)
	{
		$data = array('sub_password'=>$this->input->post('newpassword'));
		$this->db->where('subId',$subId);  
		$query=$this->db->update('sub_admin',$data);
		return true;	
	}
	else
	{
		return false;
	}
}

function getrowsperpage()
{
	$this->db->where('id','1');
	$query = $this->db->get('admin');
	if($query->num_rows() == 1)
	{
		$row = $query->row();
		return $rowsperpage=$row->intRows;
	}
}

// get admin details
function getadmindetails()
{
	$this->db->where('id','1');   
	$query = $this->db->get('site_config');
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
function get_admindetails()
{
	$this->db->where('id','1');   
	$query = $this->db->get('site_config');
	if($query->num_rows() >= 1)
	{                   
		return $row = $query->row();			
		// return $query->result();			
	} 
	else
	{     
		return false;		
	}
}

//general settings	
function general_settings()
{	
	$data = array(
				//'username'=>$this->input->post('username'),
				'company_name'		=>	$this->input->post('companyname'),
				'contact_person'	=>	$this->input->post('contactperson'),
				'email_id'			=>	$this->input->post('email'),	
				'address'			=>	$this->input->post('address'),
				'city'				=>	$this->input->post('city'),
				'state'				=>	$this->input->post('state'),			 
				'phno'				=>	$this->input->post('phone'),
				'fax_no'			=>	$this->input->post('fax_no'),
				'paypal_mode'		=>	$this->input->post('paypal_mode'),
				'facebook_url'		=>	$this->input->post('facebook_url'),
				'TFA' 				=>	$this->input->post('TFA'),
				'twitter_url' 		=>	$this->input->post('twitter_url'),
				'pinterest' 		=>	$this->input->post('pinterest'),
				'ripple_address' 	=>	$this->input->post('ripple_address'),
				'ripple_name' 		=>	$this->input->post('ripple_name'),
				'secret' 			=>	$this->input->post('secret'),
				'google_plus' 		=>	$this->input->post('google_plus')
				  );
				  
	$this->db->where('id',1);  	
	$this->db->update('site_config',$data);			
	return true;
}

// get send money details
function getsendmoneydetails()
{
	$this->db->where('id','1');   
	$query = $this->db->get('sendmoney_settings');
	if($query->num_rows() >= 1)
	{                   
		return $row = $query->row();			
	} 
	else
	{     
		return false;		
	}
}

//general settings	
function updatesend_settings($id)
{	
	
	$data = array(
				'commission'	=>$this->input->post('commission'),
				'btc_min'=>$this->input->post('btc_min'),
				'usd_min'=>$this->input->post('usd_min'),	
				'ars_min'=>$this->input->post('ars_min'),
				'clp_min'=>$this->input->post('clp_min'),
				'pen_min'=>$this->input->post('pen_min'),			 
				'bob_min'=>$this->input->post('bob_min'),
				'bsf_min'=>$this->input->post('bsf_min')
				  );
				  
	$this->db->where('id',$id);  	
	$this->db->update('sendmoney_settings',$data);			
	return true;
}

function getuser_details()
{
	$this->db->order_by('dateofreg','desc');		
	$query = $this->db->get('users');		
	if($query->num_rows() >= 1)
	{           
	    return $query->result();			
	}  
	else
	{      
	return false;		
	}
}	
function getsubadmin_details()
{
	 $subId=$this->session->userdata('subId'); 
	$this->db->where('subId',$subId);  		
	$query = $this->db->get('sub_admin');		
	if($query->num_rows() >= 1)
	{           
	    return $query->result();			
	}  
	else
	{      
	return false;		
	}
}
function getuser_detailscount()
{
	$query=$this->db->get('userdetails');
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
function changestatus_userdetails($id)
{
	$this->db->where('user_id',$id);        
        $query = $this->db->get('userdetails');
        if($query->num_rows() >= 1)
	   {
                   
           $row = $query->row();			
            $oldstatus=$row->status;			
         }    
		 
		if($oldstatus=="active")
		{ $newstatus="deactive";
		} else {
			$newstatus="active";
			}  		
	  				
		$data=array(
				'status'=>$newstatus				
				);			
 
			$this->db->where('user_id',$id);  	
		    $this->db->update('userdetails',$data);
		 
	  		
			 return true;
}
function adduserdetails()
{
	ini_set("display_errors","1");
		extract($this->input->post());
		$profile_image=$_FILES['profile_image']['name'];
		$random=rand(0,99999);					
		$filename=$random."_".$username;
		$config['upload_path'] ='uploader/customers/profilepicture/';
		$config['allowed_types'] = 'gif|jpg|jpeg|png';
		$config['file_name']=$filename;
		$this->load->library('upload', $config);
		$this->upload->initialize($config);
		if(($_FILES['profile_image']['name']!="") & ($this->upload->do_upload('profile_image')))
		{
			$uploaded_data=$this->upload->data();
			$idata['profilepicture']=$uploaded_data['file_name'];
	    }
	    else
			$idata['profilepicture']='default_profile.jpg';
			$idata['username']=$username;
			$idata['emailid']=$emailid;
			$idata['password']=$password;
			$idata['status']='active';
			$idata['dateofreg']=date("Y-m-d");
			
		if($this->db->insert('userdetails',$idata))
		{
			$this->db->where('id',1);  	
			$query = $this->db->get('site_config');
			if($query->num_rows() == 1)
			{
				$row 			= 	$query->row();
				$admin_email	=	$row->email_id;			 							 
				$companyname	=	$row->company_name;	
				$siteurl		=	$row->siteurl;				
			}
			$last_userinsid=$this->db->insert_id();
			$this->db->where('id',1);  
			$dis_get_email_info = $this->db->get('email_templates')->row();
			$email_from1	=	$dis_get_email_info->from_id;
			$email_subject1	=	$dis_get_email_info->subject;
			$email_content1	=	$dis_get_email_info->message; 

			 
			$a	=	array('##USERNAME##'=>$username,'##USERID##'=>$last_userinsid,'##FROM_EMAIL##'=>$admin_email,'##COMPANYNAME##'=>$companyname,'##EMAIL##'=>$emailid,'##SITEURL##'=>$siteurl,'##ADMIN_EMAIL##'=>$admin_email);
			$email_from	=	strtr($email_from1,$a);	
			$email_content	=	strtr($email_content1,$a);
			/*	GET EMAIL TEMPLATE	END	*/
			$this->mailsettings();
			$this->email->from($admin_email);
			$this->email->to($email);
			$this->email->subject($email_subject1);
			$this->email->message($email_content);
			$this->email->send();
			return true;
	 }
		

}
function getuserdetails($id)
{
		$this->db->where('user_id',$id);        
        $query = $this->db->get('userdetails');
        if($query->num_rows() >= 1)
	   {
                   
           $row = $query->row();			
            return $query->result();			
         }      
        return false;			
}	
function edit_userdetails($id,$filename)
{
	$profile=$_FILES['profile_image']['name'];
	if($profile!="")
	{
		$profile_picture=$filename;
		}
	else
	{
		$profile_picture=$this->input->post('oldprofile_picture');
	}
	$data=array(
	'username'=>$this->input->post('username'),
	'emailid'=>$this->input->post('emailid')
	// 'password'=>$this->input->post('password'),	
	// 'dninumber'=>$this->input->post('dni'),					
	// 'profilepicture'=>$profile_picture
	);
	$this->db->where('user_id',$id);  	
	$this->db->update('userdetails',$data);
	return true;
}
function remove_userdetails($id)
{	
	 $this->db->delete('userdetails',array('user_id' => $id));
       
          return true;
}

function getpage_details($perpage,$urisegment)
{
	$this->db->order_by('pageid');
	$this->db->where('language_id','1');  		
        $query = $this->db->get('pages');		
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
function getpage_details_spanish($perpage,$urisegment)
{
	$this->db->order_by('pageid');
	$this->db->where('language_id','2');  		
        $query = $this->db->get('pages',$perpage,$urisegment);		
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
function changestatus_page($id)
{
	
	
	$this->db->where('pageid',$id);        
        $query = $this->db->get('pages');
        if($query->num_rows() >= 1)
	   {
                   
           $row = $query->row();			
            $oldstatus=$row->status;			
         }    
		 
		if($oldstatus=="active")
		{ $newstatus="deactive";
		} else {
			$newstatus="active";
			}  
		
	  		
		$data=array('status'=>$newstatus			
				);			
 
			$this->db->where('pageid',$id);  	
		    $this->db->update('pages',$data);
		 
	  		
			 return true;
}	
function getpage($id)
	{
		
		$this->db->where('pageid',$id);        
        $query = $this->db->get('pages');
        if($query->num_rows() >= 1)
	   {
                   
           $row = $query->row();			
            return $query->result();			
         }      
        return false;		
		
	
	}
function bcpdeposit($currency)
{      
	$this->db->where('currency',$currency);
    $query = $this->db->get('viabcp_payments');
	if($query->num_rows() >= 1)
	{
		return $query->result();			
	}      
        return false;	
}	
function pendepositss($pen_id)
{      
   $this->db->where('pendeposit_id','$pen_id'); 
	$query=$this->db->get('pen_deposit');
        if($query->num_rows() >= 1)
	   {
                   
           $row = $query->row();			
            return $query->result();			
         }      
        return false;	
}	
function getpagescount()
{
	$this->db->where('language_id','1'); 
	$query=$this->db->get('pages');
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
function getpagescount_spanish()
{
	$this->db->where('language_id','2'); 
	$query=$this->db->get('pages');
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
function edit_pagedetails($id)
{
	
	
	    $curdate=date('Y-m-d');
	$data=array(
				'pagetitle'=>$this->input->post('pagetitle'),
				'pagecontent'=>$this->input->post('content'),
				'description'=>$this->input->post('description'),
				'datecreated'=>$curdate,
				'displaytitle'=>$this->input->post('displaytitle')			
				);
				
 
			$this->db->where('pageid',$id);  	
		    $this->db->update('pages',$data);		 
	  		
			 return true;
}
function remove_pagedetails($id)
{	
	  $this->db->delete('pages',array('pageid' => $id));       
      return true;
}
function withdraw_coins($perpage,$urisegment)
{
	$query = $this->db->get('coin_withdraw',$perpage,$urisegment);		
	if($query->num_rows() >= 1)
	{           
		return $query->result();			
	}        
	return false;		
}
function withdraw_coinscount()
{
	$query	=	$this->db->get('coin_withdraw');
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
function withdraw_Ecur($type)
{
	$this->db->select('WR.*');
	$this->db->where('WR.status',$type);
	$this->db->join('userdetails UD','WR.user_id=UD.user_id');
	$query = $this->db->get('withdraw_request WR');		
	if($query->num_rows() >= 1)
	{           
		return $query->result();			
	}        
	return false;		
}
function withdraw_Ecurcount()
{
	$query	=	$this->db->get('withdraw_request');
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
function changeStatus_ebalanceModel($id)
{
	$this->db->where('req_id',$id);        
	$query = $this->db->get('withdraw_request');
	if($query->num_rows() >= 1)
	{
		$row = $query->row();			
		$oldstatus=$row->status;			
	}    
	if($oldstatus=="processing")
	{ 
		$newstatus="filled";
	} 
	else 
	{
		$newstatus="confirmed";
	}  		
	$data=array(
	'status'=>$newstatus				
	);			
	$this->db->where('req_id',$id);  	
	$this->db->update('withdraw_request',$data);
	return true;
}
function getwithdrawrequest($id)
{
	$this->db->where('req_id',$id);        
	$query = $this->db->get('withdraw_request');
	if($query->num_rows() >= 1)
	{
		return $row = $query->row();			
	}      
	return false;			
}
function fetchWallet($type)
{   
	$this->db->where('type',$type);      
	$this->db->where('status','active');      
	$query=$this->db->get('wallet');	 	     
	if($query->num_rows()>=1)  
	{           
		return $row = $query->row();     
	}      
	else
	{
		return false;
	}
}
//email templates
function email_templates()
{
	
	$query=$this->db->get('email_templates');
	if($query->num_rows() >=1)
	{
		return $query->result();	
	}
	else
	{
	return false;
	}	
}
function get_emailtemplate($id)
{
	$this->db->where('id',$id);
	$query=$this->db->get('email_templates');
	if($query->num_rows() >=1)
	{
		return $query->result();	
	}
	else
	{
	return false;
	}	
}
function getemail_templatescount()
{
	$query=$this->db->get('email_templates');
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
function edit_emailtemplate($id)
{
	$data=array(
	'subject'=>$this->input->post('subject'),
	'message'=>$this->input->post('message'),	
	'title'=>$this->input->post('templatetitle')	
			);
			
	$this->db->where('id',$id);  	
	$this->db->update('email_templates',$data);
		 
	  		
	 return true;
}
// start blog 
function getblog_details()
{
	$this->db->order_by('bid','desc');
	$query = $this->db->get('tbl_blog');		
	if($query->num_rows() >= 1)
	{           
		return $query->result();			
	}   
	else
	{
		return false;		
	}
}	
function getblogcount()
{
	$this->db->order_by('bid','desc');
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
function changestatus_blogdetails($id)
{ 
	$this->db->where('bid',$id);        
        $query = $this->db->get('tbl_blog');
        if($query->num_rows() >= 1)
	   {
                   
           $row = $query->row();			
            $oldstatus=$row->status;			
         }    
		 
		if($oldstatus=="active")
		{ 
		 $newstatus="deactive";
		} 
		  else 
		{
			$newstatus="active";
			}  		
	  				
		$data=array(
				'status'=>$newstatus				
				);			
 
			$this->db->where('bid',$id);  	
		    $this->db->update('tbl_blog',$data);
 	  		
			 return true;
}
function getblog($id)  
	{
		$this->db->where('bid',$id);        
        $query = $this->db->get('tbl_blog'); 
        if($query->num_rows() >= 1)
	   {
                   
           $row = $query->row();			
            return $query->result();			
         }      
        return false;			
	
	}	
	function edit_blogdetails($id)
{  
    	$cur_date=date('Y-m-d');	   
  	$rnumber=$this->session->userdata('admin_addblogimg_randnum');        
 	//image1    
	$data=array(  
				'title'=>$this->input->post('title'),				
				'description'=>$this->input->post('description'),
				  'modified_date'=>$cur_date, 	     		 
				);
						
 			$this->db->where('bid',$id);  	  
		    $this->db->update('tbl_blog',$data);
 	  		
			 return true;
}
function getblogdetails($title)
	{
		$this->db->where('title',$title);         
        $query = $this->db->get('tbl_blog');
        if($query->num_rows() >= 1)
	   {
                   
           $row = $query->row();			
            return $query->result();			
         }       
        return false;		
		
	
	}
function remove_blogdetails($id)
{	
	 $this->db->delete('tbl_blog',array('bid' => $id));
       
          return true;
}	
function profit_model($perpage,$urisegment)
{
	$this->db->select('*');
	$this->db->select_sum("theftAmount",'amount');
	$this->db->from('coin_theft');
	$this->db->group_by("date");
	$this->db->group_by("theftCurrency");
	$this->db->order_by('date','desc');
	$this->db->limit($perpage,$urisegment);
	$query=$this->db->get('');
	return $query->result();
}
function profit_modelcount()
{
	$this->db->select('*');
	$this->db->from('coin_theft');
	$this->db->group_by("date");
	$this->db->group_by("theftCurrency");

	$query	=	$this->db->get('');
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
function get_ticket_details()
{
	$this->db->order_by('created_date','desc');	
	$this->db->where('parent_id IS NULL');	
    $query = $this->db->get('support_detail');		
	if($query->num_rows() >= 1)
    {           
        return $query->result();			
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
function getunreadsupportcount()
{	
	$this->db->where('status','processing');
	$this->db->where('parent_id IS NULL');		
    $query = $this->db->get('support_detail');		
	if($query->num_rows() >= 1)
    {           
        $cnt = $query->num_rows();			
    }  
	else
	{      
    	$cnt = 0;	
	}
	return $cnt;
}// Get get_ticket details pagination ends

function remove_ticketdetails($id)
{	
	 $this->db->delete('support_detail',array('id' => $id));
     return true;
}//remove ticket ends

// Get get ticket_count starts
function get_ticket_count()
{
	$query=$this->db->get('support_detail');
	if($query->num_rows()>=1)
	{
		$cnt=$query->num_rows();			
			
		}
		else
		{
			$cnt="0";
			
		}
	return $cnt;
}// Get get ticket_count ends
function get_ticketdetail($id)
	{
	$this->db->select("if(S.user_id IS NOT NULL,U.username,S.username) as uname,S.*",FALSE);
	$this->db->join("userdetails U","S.user_id=U.user_id","left");
	return $this->db->where("(id =". $id." OR parent_id=".$id.")")->get("support_detail S")->result();		
	}// get ticket detail starts ends
//end

function read_ticket($id)
{
	$this->db->where('id',$id);
	$this->db->update('support_detail',array('status'=>'read'));
	return true;
}

public function getuserverificationstatus()
{
	$this->db->order_by('created_date','desc');
	$this->db->where('address !='," ");
	$this->db->where('verification_status !=',"rejected");
	$query	=	$this->db->get('user_verification');
	if($query)
	{
		return $query->result();
	}
	else
	{
		return false;
	}
}

function getuserdetailsrow($id)
{
	$this->db->where('user_id',$id);        
	$query = $this->db->get('userdetails');
	if($query->num_rows() >= 1)
	{
		return $row = $query->row();			
	}      
	return false;			
}

function getuserverification($id)
{
	$this->db->where('verifyId',$id);        
	$query = $this->db->get('user_verification');
	if($query->num_rows() >= 1)
	{
		return $row = $query->row();			
	}      
	return false;			
}

function changestatus_userverification($id,$val)
{
	$this->db->where('verifyId',$id);
	$query	=$this->db->update('user_verification',array('user_verificationstatus'=>$val));
	if($query)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function trade_details()
{
	$names = array('filled', 'partially');
	$this->db->where_in('status',$names); 	
	$query = $this->db->get('coin_order');		
	if($query->num_rows() >= 1)
	{           
		return $query->result();			
	}        
	return false;		
}

function order_details()
{
	$names = array('active', 'partially');
	$this->db->where_in('status', $names);
	$query=$this->db->get('coin_order'); 
	if($query->num_rows() >= 1)
	{           
		return $query->result();			
	}        
	return false;		
}

function getcomments_details()
{     
	$bid=$this->session->userdata('blog_cmt');  
	$this->db->where('bid',$bid);  		 
	$query = $this->db->get('tbl_bloguser_comments');		
	if($query->num_rows() >= 1)
	{           
		$row = $query->row();			
		return $query->result();			
	}        
	return false;		 
}	

function get_myposttitle($id)
{
	$this->db->where('bid',$id);        
	$query = $this->db->get('tbl_blog'); 
	if($query->num_rows() >= 1)
	{
		$row = $query->row();	 
		$title=$row->title;
		return $title;		  	
	}     
	else
	{    
		return false;
	} 
}  

function get_usernameblog($id)  
{
	$this->db->where('user_id',$id);        
	$query = $this->db->get('userdetails'); 
	if($query->num_rows() >= 1)
	{
		$row = $query->row();	 
		return $username=$row->username;
	}       
	return false;			
}

function getcomments($id)  
{
	$this->db->where('cid',$id);        
    $query = $this->db->get('tbl_bloguser_comments'); 
    if($query->num_rows() >= 1)
   {
               
       $row = $query->row();			
        return $query->result();			
     }      
    return false;			
}

function edit_commentsdetails($id)   
{
	$data=array(
				'comments'=>$this->input->post('comments') 			
 				);
	$this->db->where('cid',$id);  	
	$this->db->update('tbl_bloguser_comments',$data);
	return true; 
}

function remove_commentsdetails($id)
{	 
	$this->db->delete('tbl_bloguser_comments',array('cid' => $id));      
    return true;
}	

function changestatus_commentsdetails($id)
{ 
	$this->db->where('cid',$id);        
	$query = $this->db->get('tbl_bloguser_comments');
	if($query->num_rows() >= 1)
	{
		$row = $query->row();			
		$oldstatus=$row->status;			
	}    

	if($oldstatus=="active")
	{ 
		$newstatus="deactive";
	} 
	else 
	{
		$newstatus="active";
	}  		

	$data=array(
	'status'=>$newstatus				
	);			

	$this->db->where('cid',$id);  	
	$this->db->update('tbl_bloguser_comments',$data);
	return true;
}

function addblogdetails()
{
       $created_date=date('Y-m-d');
	$cur_date=date('Y-m-d');	   
 	
 	$rnumber=$this->session->userdata('admin_addblogimg_randnum');        
 	//image1
	/* $image1=$_FILES['blog_image']['name'];   
	if($image1!="")  
	{
	@list($image1,$ext)=explode(".",$image1);	 
	$image1=str_replace (" ", "_",$image1);		 				 
	$images1=$rnumber."_".$image1.".".$ext;	  
	} */
 	
 	$data=array(
				'title'=>$this->input->post('title'),				   
				'description'=>$this->input->post('description'),	   
				//'blog_image'=>$images1,          
			    'created_date'=>$cur_date,	    
				'modified_date'=>$cur_date, 	   		
				'status'=>"active"      
				);   
				    
	$this->db->insert('tbl_blog',$data);
	return true; 
}	

function getfaq_detailscount($catid)
{
	$this->load->database();
	$this->db->where('cat_id',$catid);                
	$query=$this->db->get('faq_question');
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

function getfaq_details()
{
	$this->db->where('status',"active"); 
	$query = $this->db->get('faq_question');
	if($query->num_rows() >= 1)
	{
		return $query->result();			
	}   
	else
	{   
		return false;		
	}
}
function getfaq_details_spanish()
{
	$this->db->where('language',"2");  
	$query = $this->db->get('faq_question');
	if($query->num_rows() >= 1)
	{
		return $query->result();			
	}   
	else
	{   
		return false;		
	}
}

function getfaq_details_available($catid,$question)
{
	$this->load->database();
	$this->db->where('cat_id',$catid); 
	$this->db->where('question',$question);   
    $query = $this->db->get('faq_question');
    if($query->num_rows() >= 1)
   	{
       	$row = $query->row();			
        return $query->result();			
    }      
    return false;		
}

function addfaq_details()
{
	$data=array(
				'language'=>$this->input->post('language'),
				'question'=>$this->input->post('question'),
				'answer'=>$this->input->post('answer'),				
				'status'=>"active"
				);
	$this->db->insert('faq_question',$data);
	return true;
}	
function changestatus_faq_details($id)
{
	$this->load->database();
	$this->db->where('faqid',$id);        
	$query = $this->db->get('faq_question');
	if($query->num_rows() >= 1)
	{
		$row = $query->row();			
		$oldstatus=$row->status;			
	}    
	if($oldstatus=="active")
	{ 
		$newstatus="deactive";
	} 
	else 
	{
		$newstatus="active";
	}  
	$curdate	=	date('Y-m-d G:i:s');				
	$data	=	array(
				'status'=>$newstatus
					);			
	$this->db->where('faqid',$id);  	
	$this->db->update('faq_question',$data);
	return true;
}
function get_faq_details($id)
{
	$this->load->database();
	$this->db->where('faqid',$id);        
    $query = $this->db->get('faq_question');
    if($query->num_rows() >= 1)
   {                   
       //$row = $query->row();			
        return $query->result();			
     }      
    return false;		
}
function edit_faq_details($id)
{
	$data=array(
	'question'=>$this->input->post('question'),
	'answer'=>$this->input->post('answer'),				
	);			
	$this->db->where('faqid',$id);  	
	$this->db->update('faq_question',$data);
	return true;
}
function remove_faq_details($id)
{	
	$this->db->delete('faq_question',array('faqid' => $id));
    return true;
}	

//send mail starts
function send_mail()
{
	$tomail 	= $this->input->post('tomail');
	$comp_tosubject 	= $this->input->post('subject');
	$comp_content 		= $this->input->post('message');
		
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
	$user  ="User";
	/*	GET EMAIL TEMPLATE	START	*/
	$this->db->where('id',12);  
			$dis_get_email_info = $this->db->get('email_templates')->row();
			$email_from1	=	$dis_get_email_info->from_id;
			$email_subject1	=	$dis_get_email_info->subject;
			$email_content1	=	$dis_get_email_info->message; 

 
	$a	=	array('##USERNAME##'=>$user,'###CONTENT###'=>$comp_content,' ###TICKET###'=>uri(3));
	$email_from	=	strtr($email_from1,$a);	
	$email_content	=	strtr($email_content1,$a);
	/*	GET EMAIL TEMPLATE	END	*/
	$this->mailsettings();
	$this->email->from($admin_email,$companyname);
	$this->email->to($tomail);
	$this->email->subject("Reg :".$comp_tosubject);
	$this->email->message($email_content);
	$this->email->send();
	return true;
} //send mail ends

// Sivakami Codes Starts Here

//generalqstn
function addqstndetails()
{
	$data=array('qstn'=>$this->input->post('question'),'ans'=>$this->input->post('answer'),'status'=>"active");
	$this->db->insert('generalqstn',$data);
	return true;
}
function getgendetail()
{
	$query = $this->db->get('generalqstn');
	if($query->num_rows() >= 1)
	{
		return $query->result();			
	}   
	else
	{   
		return false;		
	}
}	
function changestatusgeneraldetails($g_id)
{
	$this->load->database();
	$this->db->where('g_id',$g_id);        
	$query = $this->db->get('generalqstn');
	if($query->num_rows() >= 1)
	{
		$row = $query->row();			
		$oldstatus=$row->status;			
	}    
	if($oldstatus=="active")
	{ 
		$newstatus="deactive";
	} 
	else 
	{
		$newstatus="active";
	}  
	$curdate	=	date('Y-m-d G:i:s');				
	$data	=	array(
				'status'=>$newstatus
					);			
	$this->db->where('g_id',$g_id);  	
	$this->db->update('generalqstn',$data);
	return true;
}
function getgeneraldet($g_id)
{
	$this->load->database();
	$this->db->where('g_id',$g_id);        
    $query = $this->db->get('generalqstn');
    if($query->num_rows() >= 1)
   {                   
       //$row = $query->row();			
        return $query->result();			
     }      
    return false;		
}
function editgeneralqstndetails($g_id)
{
	$data=array(
	'qstn'=>$this->input->post('question'),
	'ans'=>$this->input->post('answer'),				
	);			
	$this->db->where('g_id',$g_id);  	
	$this->db->update('generalqstn',$data);
	return true;
}
function deletedetails($g_id)
	{
		$delete=$this->db->delete('generalqstn',array('g_id'=>$g_id));
		if($delete)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
//api
function addapidetails()
{
	$data=array('qstn'=>$this->input->post('question'),'ans'=>$this->input->post('answer'),'status'=>"active");
	$this->db->insert('apiqstn',$data);
	return true;
}
function getapidetails()
{
	$query = $this->db->get('apiqstn');
	if($query->num_rows() >= 1)
	{
		return $query->result();			
	}   
	else
	{   
		return false;		
	}
}	
function chngstatus($api_id)
{
	$this->load->database();
	$this->db->where('api_id',$api_id);        
	$query = $this->db->get('apiqstn');
	if($query->num_rows() >= 1)
	{
		$row = $query->row();			
		$oldstatus=$row->status;			
	}    
	if($oldstatus=="active")
	{ 
		$newstatus="deactive";
	} 
	else 
	{
		$newstatus="active";
	}  
	$curdate	=	date('Y-m-d G:i:s');				
	$data	=	array('status'=>$newstatus);			
	$this->db->where('api_id',$api_id);  	
	$this->db->update('apiqstn',$data);
	return true;
}
function getapi($api_id)
{
	$this->load->database();
	$this->db->where('api_id',$api_id);        
    $query = $this->db->get('apiqstn');
    if($query->num_rows() >= 1)
   {                   
      $row = $query->row();			
        return $query->result();			
     }      
    return false;		
}
function editapindetails($api_id)
{
	$data=array('qstn'=>$this->input->post('question'),'ans'=>$this->input->post('answer'));			
	$this->db->where('api_id',$api_id);  	
	$this->db->update('apiqstn',$data);
	return true;
}
function delapidetails($api_id)
{
	$delete=$this->db->delete('apiqstn',array('api_id'=>$api_id));
	if($delete)
	{
		return true;
	}
	else
	{
		return false;
	}
}
// Sivakami Codes Ends Here
# Author : Vivek 
function get_ticket($id)
{
	return $this->db->where("id",$id)->get("support_detail S")->row();
}
function reply_to_ticket($id)
{
		extract($this->input->post());
		$files['upload_path'] = 'uploads/';
		$files['allowed_types'] = 'gif|jpg|png|jpeg';
		$files['max_size']	= '100';
		$files['max_width']  = '1024';
		$files['max_height']  = '768';
		$this->load->library('upload', $files);
		if($this->upload->do_upload('image'))
		{
			$data=$this->upload->data("file_name");
			$idata['file']=$data["file_name"];
		}
		else
		{
			$idata['file'] = 'empty';
		}
		$parent_ticket=$this->get_ticket($id);
		$idata['message']=$message;
		$idata['subject']=isset($parent_ticket->subject)?$parent_ticket->subject:NULL;
		//$idata['username']="admin";
                $idata['username']=isset($parent_ticket->name)?$parent_ticket->name:NULL; 
		$idata['email']=isset($parent_ticket->email)?$parent_ticket->email:NULL;
		$idata['name']=isset($parent_ticket->name)?$parent_ticket->name:NULL;
		$idata['departments']=isset($parent_ticket->departments)?$parent_ticket->departments:NULL;
		$idata['parent_id']=$id;
		$idata['created_date']=date("Y-m-d");
		$idata['user_id']=NULL;
		$_POST['subject']=$idata['subject'];
		$_POST['tomail']=$idata['email'];
                $message=$_POST['message'];
		$question=isset($parent_ticket->message)?$parent_ticket->message:NULL;

		$this->db->insert("support_detail",$idata);
		$tomail = $idata['email'];

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
	$url  = $siteurl."conversation/".$id;
	
	/*	GET EMAIL TEMPLATE	START	*/
	$this->db->where('id',15);  
			$dis_get_email_info = $this->db->get('email_templates')->row();
			$email_from1	=	$dis_get_email_info->from_id;
			$email_subject1	=	$dis_get_email_info->subject;
			$email_content1	=	$dis_get_email_info->message; 

	 
	$a	=	array('###USERNAME###'=>$username,'###URL###'=>$url,'###COMPANYNAME###'=>$companyname,' ###TICKET###'=>$id,'###MESSAGE###'=>$message,'###QUESTION###'=>$question);
	$email_from	=	strtr($email_from1,$a);	
	$email_content	=	strtr($email_content1,$a);
	/*	GET EMAIL TEMPLATE	END	*/
	$this->mailsettings();
	$this->email->from($admin_email,$companyname);
	$this->email->to($tomail);
	$this->email->subject("Reg :".$email_subject1);
	$this->email->message($email_content);
	$this->email->send();
	return true;

}
# Author : Vivek  ENDS

function add_subadmindetails()
{
	ini_set("display_errors","1");
	extract($this->input->post());
	$idata['sub_name']		=	$sub_name;
	$idata['sub_username']	=	$sub_username;
	$idata['sub_emailid']	=	$sub_emailid;
	$idata['sub_password']	=	$sub_password;
	$idata['permission'] 	= 	implode(',',$this->input->post('permission'));
	$idata['status']		=	'active';
	$query = $this->db->insert('sub_admin',$idata);
	if($query)
	{
		$this->db->where('id',1);  	
		$query = $this->db->get('site_config');
		if($query->num_rows() == 1)
		{
			$row 			= 	$query->row();
			$admin_email	=	$row->email_id;			 							 
			$companyname	=	$row->company_name;	
			$siteurl		=	$row->siteurl;				
		}
		$sub_username = $this->input->post('sub_username');
		$password = $this->input->post('sub_password');
		$tomail = $this->input->post('sub_emailid');
		$loginurl = base_url()."admin/subadminlogin";
		$last_userinsid = $this->db->insert_id();
		$this->db->where('id',15);  
			$dis_get_email_info = $this->db->get('email_templates')->row();
			$email_from1	=	$dis_get_email_info->from_id;
			$email_subject1	=	$dis_get_email_info->subject;
			$email_content1	=	$dis_get_email_info->message; 
		 
		$a	=	array('##USERNAME##'=>$sub_username,'##COMPANYNAME##'=>$companyname,'##PASSWORD##'=>$password,'##LOGINURL##'=>$loginurl,'##ADMIN_EMAIL##'=>$admin_email);
		$email_from	=	strtr($email_from1,$a);	
		$email_content	=	strtr($email_content1,$a);
		/*	GET EMAIL TEMPLATE	END	*/
		$this->mailsettings();
		$this->email->from($admin_email);
		$this->email->to($tomail);
		$this->email->subject($email_subject1);
		$this->email->message($email_content);
		$this->email->send();
		return true;
 	}
}

function getuserverificationrow($id)
{
	$this->db->where('user_id',$id);  
	$this->db->order_by('user_id','desc');      
	$query = $this->db->get('user_verification');
	if($query->num_rows() >= 1)
	{
		return $row = $query->row();			
	}      
	return false;			
}

function update_viabcp_status($autoid,$status)
{
	$this->db->where('auto_id',$autoid);        
	$query = $this->db->get('viabcp_payments');
	if($query->num_rows() >= 1)
	{
		$data = array('pen_status'=>$status);
		$this->db->where('auto_id',$autoid);   
		$query=$this->db->update('viabcp_payments',$data);
		return true;
	}      
	return false;			
}

function getuserdetailsbyemail($emailid)
{
	$this->db->where('emailid',$emailid);        
	$query = $this->db->get('userdetails');
	if($query->num_rows() >= 1)
	{
		return $row = $query->row();			
	}      
	return false;			
}	

function userscount()
{
	$this->db->where('status','active');        
	$query = $this->db->get('users');
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

function newuserscount()
{
	$curdate = date("Y-m-d");
	$this->db->where('activated_date',$curdate);        
	$this->db->where('status','active');        
	$query = $this->db->get('users');
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

function create_ticket()
{
	$user_emailid = $this->session->userdata('sessionTickEmailid');
	$admin_message = $this->input->post('message');
	$userrow = $this->getuserdetailsbyemail($user_emailid);
	$username = $userrow->username;
	
	$this->db->where('id',1);  	
	$query = $this->db->get('site_config');
	if($query->num_rows() == 1)
	{
		$row 			= 	$query->row();
		$admin_email	=	$row->email_id;			 							 
		$companyname	=	$row->company_name;	
		$siteurl		=	$row->siteurl;				
	}
	$this->db->where('id',20);  
			$dis_get_email_info = $this->db->get('email_templates')->row();
			$email_from1	=	$dis_get_email_info->from_id;
			$email_subject1	=	$dis_get_email_info->subject;
			$email_content1	=	$dis_get_email_info->message; 

	 
	$a	=	array('##USERNAME##'=>$username,'##MESSAGE##'=>$admin_message,'##FROM_EMAIL##'=>$admin_email,'##COMPANYNAME##'=>$companyname);
	$email_from	=	strtr($email_from1,$a);	
	$email_content	=	strtr($email_content1,$a);
	/*	GET EMAIL TEMPLATE	END	*/
	$this->mailsettings();
	$this->email->from($admin_email,$companyname);
	$this->email->to($user_emailid);
	$this->email->subject($email_subject1);
	$this->email->message($email_content);
	$this->email->send();
	return true;
}

//BTC Values Starts....
function get_btcvalues()
{
	$this->db->where('id','1');   
	$query = $this->db->get('bitcoin_values');
	if($query->num_rows() >= 1)
	{                   
		return $query->row();			
	} 
	else
	{     
		return false;		
	}
}

function update_btcvalues()
{	
	$data = array(
		'btcusd_low'	=>$this->input->post('btcusd_low'),
		'btcusd_high'	=>$this->input->post('btcusd_high'),
		'btcars_low'	=>$this->input->post('btcars_low'),	
		'btcars_high'	=>$this->input->post('btcars_high'),
		'btcpen_low'	=>$this->input->post('btcpen_low'),
		'btcpen_high'	=>$this->input->post('btcpen_high'),			 
		'btcbob_low'	=>$this->input->post('btcbob_low'),
		'btcbob_high'	=>$this->input->post('btcbob_high'),
		'btcbsf_low'	=>$this->input->post('btcbsf_low'),
		'btcbsf_high'	=>$this->input->post('btcbsf_high'),					
		'btcclp_low'	=>$this->input->post('btcclp_low'),
		'btcclp_high'	=>$this->input->post('btcclp_high')
				  );
	$this->db->where('id','1');  	
	$this->db->update('bitcoin_values',$data);			
	return true;
}
//BTC Values Ends....

function verificationlabel($num) 
{
	if($num==1)
	{
		$value = "Passport";
	}
	else if($num==2)
	{
		$value = "Back of an ID";
	}
	else if($num==3)
	{
		$value = "Driving License";
	}
	else if($num==4)
	{
		$value = "Bank statement";
	}
	else if($num==5)
	{
		$value = "Utility bill";
	}
	else
	{
		$value = "Certificate of residency";
	}
	return $value;
}

function userdetailemail($id)
{
	$this->db->where('user_id',$id);        
	$query = $this->db->get('userdetails');
	if($query->num_rows() >= 1)
	{
		$row = $query->row();			
		return $row->emailid;
	}      
	return false;
}

function uvrow($id)
{
	$this->db->where('verifyId',$id);        
	$query = $this->db->get('user_verification');
	if($query->num_rows() >= 1)
	{
		$row = $query->row();			
		$userid = $row->user_id;
		return $this->userdetailemail($userid);
	}      
	return false;
}

function sendemailuser($id)
{	

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
	$db_email = $this->uvrow($id); 
	$email_subject1 = $companyname." - Verification completted";
	$email_content = "Hi User,<br> Your account has been has successfully verified.<br>
	Please check your account
	";
	$this->mailsettings(); 	
	$this->email->from($admin_email,$companyname);
	$this->email->to($db_email);
	$this->email->subject($email_subject1);
	$this->email->message($email_content);
	$this->email->send();
	return true;
}
function sendemailuser1($id)
{	
	$mail_content = $this->input->post('mail_content');
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
	$db_email = $this->uvrow($id); 
	$email_subject1 = $companyname." - Verification Deniel";
	$email_content = "Hi User,<br> <br>
	Your account has been Deniel for following reason<br><br>
	<p>".$mail_content."</p>";
	$this->mailsettings(); 	
	$this->email->from($admin_email,$companyname);
	$this->email->to($db_email);
	$this->email->subject($email_subject1);
	$this->email->message($email_content);
	$this->email->send();
	return true;
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

function international_deposit()
{
    $this->db->order_by('deposit_id','desc');
	$this->db->where_not_in('status','cancelled');
	//$this->db->where('type','Bank EFT');
	
	$query = $this->db->get('deposit_payment');	
// $this->db->last_query(); 	
	if($query->num_rows() > 0)
	{           
		return $query->result();			
	}        
	return false;		
}
function get_userdetails_by_acc($acc_number)
{
	$this->db->where('account_no',$acc_number);
	$query = $this->db->get('userdetails');
	if($query->num_rows())
	{
		return $query->row();
	}
	else
	{
		return false;
	}
}
function submit_bank_deposit()
{
	$amount = $this->input->post('deposit_amount');
	$current_date = date('Y-m-d');
	$acc_number = $this->input->post('acc_number');
	$userdetails = $this->get_userdetails_by_acc($acc_number);
	$newstatus	="confirmed";	
	//insert on deposit amount table
		if($userdetails)
		{
				$data = array(
					'user_id'			=>	$userdetails->user_id,
					'amount'			=>	$amount,
					'first_name'		=>	$userdetails->firstname,
					'last_name'			=>	$userdetails->lastname,
					'request_date'		=>	$current_date,
					'type'				=>	"Bank EFT",
					'currency'			=>	"ZAR",
					'status'			=>	$newstatus
			);
				$this->db->insert('deposit_payment',$data);
				// balance updation process
				$user_id 			= $userdetails->user_id;
				$userbalance     	= $this->fetchuserbalancebyId($user_id,"ZAR");
				$updatebalance   	= $userbalance + $amount;
				$this->db->where('userId',$user_id);
				$this->db->update('coin_userbalance',array("ZAR"=>$updatebalance));
			
			//Deposit information email
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
			$username 	= 	$userdetails->username;
			$to 		= 	$userdetails->emailid;
			$currency = "ZAR";
			/*	GET EMAIL TEMPLATE	START	*/
			$this->db->where('id',9);  
			$dis_get_email_info = $this->db->get('email_templates')->row();
			$email_from1	=	$dis_get_email_info->from_id;
			$email_subject1	=	$dis_get_email_info->subject;
			$email_content1	=	$dis_get_email_info->message; 
				 
				$a	=	array('##USERNAME##'=>$username,'##FROM_EMAIL##'=>$admin_email,'##COMPANYNAME##'=>$companyname,'##AMOUNT##'=>$amount,'##CURRENCY##'=>$currency,'##SITEURL##'=>$siteurl,'##ADMIN_EMAIL##'=>$admin_email);
				$email_from	=	strtr($email_from1,$a);	
				$email_content	=	strtr($email_content1,$a);
				$notification = $this->get_depemail_notification($currency,$user_id);
				if($notification=='off')
				{
					/*	GET EMAIL TEMPLATE	END	*/
					$this->mailsettings();
					$this->email->from($admin_email);
					$this->email->to($to);
					$this->email->subject($email_subject1);
					$this->email->message($email_content);
					$this->email->send();
				}
				
				$current_date	=	date('Y-m-d'); 
				$current_time	=	date('H:i A'); 	
				$data_txhis = array(
						'userId' => $user_id,
						'type' => 'Deposit',
						'currency' => $currency,
						'date' => $current_date,
						'time' => $current_time,
						'amount' => $amount,
						//'total' => $amount,
						'status' => $newstatus
				);
				$this->db->insert('transaction_history',$data_txhis);
			return true;
			}
			else
			{
				return false;
			}
	
}
function deposit_confirm($id)
	{
		$this->db->where('deposit_id',$id);        
		$query = $this->db->get('deposit_payment');
		if($query->num_rows() >= 1)
		{
			$row = $query->row();			
			$oldstatus=$row->status;			
			$amount=$row->amount;	
			$user_id=$row->user_id;	
			$type=$row->type;	
			$currency=$row->currency;	
		}    
		if($oldstatus=="pending")
		{ 
				$newstatus="confirmed";	
				$userbalance=$this->fetchuserbalancebyId($user_id,$currency);
				$updatebalance = $userbalance + $amount;
				$this->db->where('userId',$user_id);
				$this->db->update('coin_userbalance',array($currency=>$updatebalance));
				
					
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
		$userResult = 	$this->get_userdetails($user_id);
		$username 	= 	$userResult->username;
		$to 		= 	$userResult->emailid;
		$currency = $currency;
		/*	GET EMAIL TEMPLATE	START	*/
		$this->db->where('id',9);  
			$dis_get_email_info = $this->db->get('email_templates')->row();
			$email_from1	=	$dis_get_email_info->from_id;
			$email_subject1	=	$dis_get_email_info->subject;
			$email_content1	=	$dis_get_email_info->message; 
			 
			$a	=	array('##USERNAME##'=>$username,'##FROM_EMAIL##'=>$admin_email,'##COMPANYNAME##'=>$companyname,'##AMOUNT##'=>$amount,'##CURRENCY##'=>$currency,'##SITEURL##'=>$siteurl,'##ADMIN_EMAIL##'=>$admin_email);
			$email_from	=	strtr($email_from1,$a);	
			$email_content	=	strtr($email_content1,$a);
			$notification = $this->get_depemail_notification($currency,$user_id);
			if($notification=='off')
			{
				/*	GET EMAIL TEMPLATE	END	*/
				$this->mailsettings();
				$this->email->from($admin_email);
				$this->email->to($to);
				$this->email->subject($email_subject1);
				$this->email->message($email_content);
				$this->email->send();
			}
					$data=array(
				'status'=>$newstatus				
				);			

			$this->db->where('deposit_id',$id);  	
			$this->db->update('deposit_payment',$data);
			
			$current_date	=	date('Y-m-d'); 
			$current_time	=	date('H:i A'); 	
			$data_txhis = array(
					'userId' => $user_id,
					'type' => 'Deposit',
					'currency' => $currency,
					'date' => $current_date,
					'time' => $current_time,
					'amount' => $amount,
					//'total' => $amount,
					'status' => $newstatus
			);
			$this->db->insert('transaction_history',$data_txhis);
			
		} 
		else
		{
			$newstatus="pending";
			$userbalance=$this->fetchuserbalancebyId($user_id,$currency);
			if($userbalance>=$amount){
				$updatebalance = $userbalance - $amount;
				$this->db->where('userId',$user_id);
				$this->db->update('coin_userbalance',array($currency=>$updatebalance));
						$data=array(
				'status'=>$newstatus				
				);			

			$this->db->where('deposit_id',$id);  	
			$this->db->update('deposit_payment',$data);
			
			$current_date	=	date('Y-m-d'); 
			$current_time	=	date('H:i A'); 	
			$data_txhis = array(
					'userId' => $user_id,
					'type' => 'Deposit',
					'currency' => $currency,
					'date' => $current_date,
					'time' => $current_time,
					'amount' => $amount,
					//'total' => $amount,
					'status' => $newstatus
			);
			$this->db->insert('transaction_history',$data_txhis);

			}
			
			
		}  		
					

			 return true;
	}
function fetchuserbalancebyId($id,$currency)
{ 
	$this->db->where('userId',$id);  
	$query=$this->db->get('coin_userbalance'); 
	if($query->num_rows() >= 1)
	{     	
		$row = $query->row();
		if($currency=="BTC")
		{
			$value = $row->BTC; 
		}else if($currency=="ZAR")
		{
			$value = $row->ZAR; 
		}
		else if($currency=="NGN")
		{
			$value = $row->NGN; 
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
		else
		{
			$value = $row->USD;
		}
		return $value;
	}   
	else
	{      
		return false;		
	}
}
function get_userdetails($user_id)
{ 
	$this->db->where('id',$user_id);  
	$query=$this->db->get('users'); 
	if($query->num_rows() >= 1){                
	   return $query->row();			 
	}else{      
	   return false;		
	}
}
function get_depemail_notification($cur,$user_id)
{
	//$customer_user_id	=	$this->session->userdata('customer_user_id');
	$this->db->where('userId',$user_id);
	$query = $this->db->get('userNotification');
	if($query->num_rows())
	{
		$row = $query->row();
		if($cur=='BTC')
		{
			return $row->bitcoin_deposit;
		}	
		else if($cur=='BTC')
		{
			return $row->litecoin_deposit;
		}
		else
		{
			return $row->usd_deposit;
		}
	}
}
//International withdraw
function international_withdraw()
{
	$this->db->order_by('withdraw_id','desc');
	$this->db->where_not_in('status','processing');
	$this->db->where_not_in('status','cancelled');	
	$query = $this->db->get('international_withdraw');		
	if($query->num_rows() >= 1)
	{           
		return $query->result();			
	}        
	return false;		
}
function request_confirm($id)
	{

		$this->db->where('withdraw_id',$id);        
		$query = $this->db->get('international_withdraw');
		if($query->num_rows() >= 1)
		{
			$row = $query->row();			
			$oldstatus = $row->status;			
			$amount = $row->askamount;	
			$user_id = $row->user_id;	
			$currency = $row->currency;	
		}    
		if($oldstatus=="pending")
		{ 
				$newstatus="finished";	
				$userbalance=$this->fetchuserbalancebyId($user_id,$currency);
				// $updatebalance = $userbalance - $amount;
				// $this->db->where('userId',$user_id);
				// $this->db->update('coin_userbalance',array('USD'=>$updatebalance));
				
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
		$userResult = 	$this->get_userdetails($user_id);
		$username 	= 	$userResult->username;
		$to 		= 	$userResult->emailid;
		$currency = $currency;
		/*	GET EMAIL TEMPLATE	START	*/
		$this->db->where('id',7);  
			$dis_get_email_info = $this->db->get('email_templates')->row();
			$email_from1	=	$dis_get_email_info->from_id;
			$email_subject1	=	$dis_get_email_info->subject;
			$email_content1	=	$dis_get_email_info->message; 
			 
			$a	=	array('##USERNAME##'=>$username,'##FROM_EMAIL##'=>$admin_email,'##COMPANYNAME##'=>$companyname,'##AMOUNT##'=>$amount,'##CURRENCY##'=>$currency,'##SITEURL##'=>$siteurl,'##ADMIN_EMAIL##'=>$admin_email);
			$email_from	=	strtr($email_from1,$a);	
			$email_content	=	strtr($email_content1,$a);
			$notification = $this->get_email_notification($currency,$user_id);
			// echo "pending";
			if($notification=='off')
			{
				/*	GET EMAIL TEMPLATE	END	*/
				$this->mailsettings();
				$this->email->from($admin_email);
				$this->email->to($to);
				$this->email->subject($email_subject1);
				$this->email->message($email_content);
				$this->email->send();
			}
		} 
		else
		{
			$newstatus="pending";
			$userbalance=$this->fetchuserbalancebyId($user_id,$currency);
			$updatebalance = $userbalance + $amount;
			$this->db->where('userId',$user_id);
			$this->db->update('coin_userbalance',array($currency=>$updatebalance));
		}  		
		$this->db->where('withdraw_id',$id);
		$this->db->update('international_withdraw',array('status'=>$newstatus));

		$this->db->where('orderid',$id);
		$this->db->update('withdraw_request',array('status'=>$newstatus));
		return true;
	}
	function get_requestdetail($id)
	{
		$this->db->where('withdraw_id',$id);        
        $query = $this->db->get('international_withdraw');
        if($query->num_rows() >= 1)
	   {
           return $row = $query->row();			
             $query->result();			
         }      
        return false;			
	
	}
	function get_email_notification($cur,$user_id)
{
	$this->db->where('userId',$user_id);
	$query = $this->db->get('userNotification');
	if($query->num_rows())
	{
		$row = $query->row();
		if($cur=='BTC')
		{
			return $row->bitcoin_withdraw;
		}	
		else if($cur=='BTC')
		{
			return $row->litecoin_withdraw;
		}
		else
		{
			return $row->usd_withdraw;
		}
	}
}





function gettrading_fee()
{
	$query = $this->db->get('trading_fee');		
	if($query->num_rows() >= 1)
	{           
	return $query->row();			
	}   
	else
	{
	return false;		
	}
}	
function edit_tradefee()
{  
	$data=array(  
			'lessthan_20000'=>$this->input->post('lessthan_20000'),				
			'lessthan_100000'=>$this->input->post('lessthan_100000'),				
			'lessthan_200000'=>$this->input->post('lessthan_200000'),				
			'lessthan_400000'=>$this->input->post('lessthan_400000'),				
			'lessthan_600000'=>$this->input->post('lessthan_600000'),				
			'lessthan_1000000'=>$this->input->post('lessthan_1000000'),				
			'lessthan_2000000'=>$this->input->post('lessthan_2000000'),				
			'lessthan_4000000'=>$this->input->post('lessthan_4000000'),				
			'lessthan_20000000'=>$this->input->post('lessthan_20000000'),				
			'greaterthan_20000000'=>$this->input->post('greaterthan_20000000')	 
			);	  
	$this->db->update('trading_fee',$data);
	return true;
}
function bitgo_control()
{
	$query = $this->db->get('bitgo_details');	
	if($query->num_rows() >= 1)
	{           
	return $query->row();			
	}   
	else
	{
	return false;		
	}
}	
function edit_bitgo_control()
{     


  
  /* $c =  mysql_real_escape_string($this->input->post('wallet_passphrase'));
  echo  $a = htmlentities($c);
    echo $b = html_entity_decode($a);  die;*/

	$data=array(  
				'access_token'=>$this->input->post('access_token'),				
				'wallet_passphrase'=>$this->input->post('wallet_passphrase')
				);	  
	$this->db->update('bitgo_details',$data);
	return true;
}
function feeconfig()
{
	$query = $this->db->get('fees_config');	
	if($query->num_rows() >= 1)
	{           
	return $query->row();			
	}   
	else
	{
	return false;		
	}
}	
function edit_feeconfig()
{     
	$data=array(  
	'inational_deposit_fee'=>$this->input->post('inational_deposit_fee'),				
	'inational_withdraw_fee'=>$this->input->post('inational_withdraw_fee'),				
	'buy_ripple'=>$this->input->post('buy_ripple'),				
	'high_withdraw_fee'=>$this->input->post('high_withdraw_fee'),				
	'high_deposit_fee'=>$this->input->post('high_deposit_fee'),				
	'withdraw_fee_btc'=>$this->input->post('withdraw_fee_btc'),				
	'withdraw_fee_ltc'=>$this->input->post('withdraw_fee_ltc'),				
	'withdraw_fee_eth'=>$this->input->post('withdraw_fee_eth'),
	'withdraw_fee_wcn'=>$this->input->post('withdraw_fee_wcn'),				
	'ripple_deposit'=>$this->input->post('ripple_deposit'),				
	'ripple_withdraw'=>$this->input->post('ripple_withdraw') 
	);	  
	$this->db->update('fees_config',$data);
	return true;
}










//padmashree23/4/2015
function bankdetail()
{
	$this->db->where('acc_id',1);
	$query = $this->db->get('acc_details');	
	if($query->num_rows() >= 1)
	{           
	return $query->row();			
	}   
	else
	{
	return false;		
	}
}	
function add_bankdetail()
{     
	$data=array(  
				'account_owner'=>$this->input->post('account_owner'),				
				'bank_name'=>$this->input->post('bank_name'), 
				'acc_number'=>$this->input->post('acc_number'), 
				'branch_code'=>$this->input->post('branch_code'), 
				'acc_type'=>$this->input->post('acc_type'), 
				
				/*'admin_address'=>$this->input->post('admin_address'), 
				'admin_city'=>$this->input->post('admin_city'), 
				'country'=>$this->input->post('country'), 
				'iban'=>$this->input->post('iban'), 
				'message'=>$this->input->post('message'), 
				'bank_address'=>$this->input->post('bank_address'), 
				'bank_city'=>$this->input->post('bank_city'), 
				'bank_country'=>$this->input->post('bank_country'), 
				'BIC'=>$this->input->post('BIC')*/
				);	  
	$this->db->insert('acc_details',$data);
	return true;
}










function notverifiedusers()
{
	$query  =       $this->db
                    ->select('*')
                    ->from('user_verification t1 ')
                    ->join("userdetails t2","t2.user_id = t1.user_id")
                    ->where('t2.status !=','deactive')
                    ->where('t1.verification_status !=','verified')
                    ->get('userdetails t2');
                 //   echo $this->db->last_query(); die;
	return $query->num_rows();
}


function btccount()
{
   $this->db->select('sum(theftAmount) AS btccount');
	$this->db->from('coin_theft');
	$this->db->where('theftCurrency','BTC');
	$query = $this->db->get();
	//echo $this->db->last_query(); die;
	if($query->num_rows() >= 1)
	{           
	return $query->row();			
	}   
	else
	{
	return false;		
	}
}
function usdcount()
{
	   $this->db->select('sum(theftAmount) AS usdcount');
	$this->db->from('coin_theft');
	$this->db->where('theftCurrency','USD');
	$query = $this->db->get();
	//echo $this->db->last_query(); die;
	if($query->num_rows() >= 1)
	{           
	return $query->row();			
	}   
	else
	{
	return false;		
	}
}














function get_chart_details($source,$interval)
	{
		$dtime 			= strtotime($source);
		$source 		= date("Y-m-d H:i:s", strtotime($source));
		if($interval=="0.5")
		{
			$destination 	= date("Y-m-d H:i:s", strtotime('+30 minutes', $dtime));
		}
		else if($interval=="1")
		{
			$destination 	= date("Y-m-d H:i:s", strtotime('+1 days', $dtime));
		}
		else
		{
			$destination 	= date("Y-m-d H:i:s", strtotime('+1 months', $dtime));
		}

		$this->db->from('coin_theft');
		$this->db->where('theftCurrency','EUR');
		$this->db->where("date >= '$source'");
		$this->db->where("date <= '$destination'");
		// $this->db->where("`create_date` BETWEEN '$source' and '$destination'", NULL, FALSE); 
		$this->db->select('If(SUM(`theftAmount`) is NULL,0,SUM(`theftAmount`)) AS comm',FALSE);
		$query = $this->db->get('');
		if($query->num_rows())
		{
			$row = $query->row();
			return $row->comm;
		}
		else
		{
			return false;
		}
		// $destination = $curdate." ".$destTime;
	}
	function get_userdata($source,$interval)
	{
		$dtime 			= strtotime($source);
		$source 		= date("Y-m-d", strtotime($source));
		if($interval==1)
		{
			$destination 	= date("Y-m-d", strtotime('+1 days', $dtime));
		}
		else
		{
			$destination 	= date("Y-m-d", strtotime('+1 months', $dtime));
		}

		$this->db->from('userdetails');
		$this->db->where('status','active');
		$this->db->where("dateofreg  >= '$source'");
		$this->db->where("dateofreg  <= '$destination'");
		// $this->db->where("`create_date` BETWEEN '$source' and '$destination'", NULL, FALSE); 
		
		$query = $this->db->get('');
		if($query->num_rows())
		{
			return $query->num_rows();
		}
		else
		{
			return 0;
		}
	}

function get_chart_details1($source,$interval)
	{
		$dtime 			= strtotime($source);
		$source 		= date("Y-m-d H:i:s", strtotime($source));
		if($interval=="0.5")
		{
			$destination 	= date("Y-m-d H:i:s", strtotime('+30 minutes', $dtime));
		}
		else if($interval=="1")
		{
			$destination 	= date("Y-m-d H:i:s", strtotime('+1 days', $dtime));
		}
		else
		{
			$destination 	= date("Y-m-d H:i:s", strtotime('+1 months', $dtime));
		}

		$this->db->from('coin_theft');
		$this->db->where('theftCurrency','NLG');
		$this->db->where("date >= '$source'");
		$this->db->where("date <= '$destination'");
		// $this->db->where("`create_date` BETWEEN '$source' and '$destination'", NULL, FALSE); 
		$this->db->select('If(SUM(`theftAmount`) is NULL,0,SUM(`theftAmount`)) AS comm',FALSE);
		$query = $this->db->get('');
		if($query->num_rows())
		{
			$row = $query->row();
			return $row->comm;
		}
		else
		{
			return false;
		}
		// $destination = $curdate." ".$destTime;
	}
	function get_user_details()
	{
		$result = get_data('userdetails',array(),"",'user_id','desc');
		return $result->result();
	}

   function displaybankdetails()
   {

   	  $query = $this->db->get('acc_details');
		if($query->num_rows())
		{
			
			return $query->result();
		}
		else
		{
			return false;
		}
   }

function getbank($id)  
	{
		$this->db->where('acc_id',$id);        
        $query = $this->db->get('acc_details'); 
        if($query->num_rows() >= 1)
	   {
                   
           $row = $query->row();			
            return $query->result();			
         }      
        return false;			
	
	}
		function edit_blankdetails($id)
{  
    	
	$data=array(  
				'account_owner'=>$this->input->post('account_owner'),				
				'bank_name'=>$this->input->post('bank_name'), 
				'acc_number'=>$this->input->post('acc_number'), 
				'branch_code'=>$this->input->post('branch_code'), 
				'acc_type'=>$this->input->post('acc_type'), 
				
				);	
						
 			$this->db->where('acc_id',$id);  	  
		    $this->db->update('acc_details',$data);
 	  		
			 return true;
}

function remove_bankdetails($id)
{	
	 $this->db->delete('acc_details',array('acc_id' => $id));
       
          return true;
}


function get_userbankdetails($id)
{
        $this->db->where('withdraw_id',$id);        
        $query = $this->db->get('international_withdraw');
        if($query->num_rows() >= 1)
	   {
            $row = $query->row();			
             $userid=$row->user_id;
         }  

	$this->db->where('usersfk',$userid);
	$query= $this->db->get('user_bank_details');
	 if($query->num_rows() >= 1)
	   {
                   
            return $query->row();			
           			
         }  
         else{    
        return false;
        }			
	
	}

	function get_userpdfdetails($id)
	{
		$this->db->where('withdraw_id',$id);        
        $query = $this->db->get('international_withdraw');
        if($query->num_rows() >= 1)
	   {
            $row = $query->row();			
             $userid=$row->user_id;
         }  

	$this->db->where('user_id',$userid);
	$query= $this->db->get('userdetails');
	 if($query->num_rows() >= 1)
	   {
                   
            return $query->row();			
           			
         }  
         else
         {    
        return false;
        }			
	
	}

function userbank($id)
{
  $this->db->where('usersfk',$id);        
        $query = $this->db->get('user_bank_details');
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

function remove_userverificationdetails($id)
{	
	 $this->db->delete('user_verification',array('user_id' => $id));
       
          return true;
}

function adminconfirmationmodel()
{
	$id = $this->input->post('id');
	$this->db->where('user_id',$id);
	$this->db->update('user_verification',array('verification_status' =>'verified'));
	return true;

}

function get_chart_details2($source,$interval)
	{
		$dtime 			= strtotime($source);
		$source 		= date("Y-m-d H:i:s", strtotime($source));
		if($interval=="0.5")
		{
			$destination 	= date("Y-m-d H:i:s", strtotime('+30 minutes', $dtime));
		}
		else if($interval=="1")
		{
			$destination 	= date("Y-m-d H:i:s", strtotime('+1 days', $dtime));
		}
		else
		{
			$destination 	= date("Y-m-d H:i:s", strtotime('+1 months', $dtime));
		}

		$this->db->from('coin_theft');
		$this->db->where('theftCurrency','GTS');
		$this->db->where("date >= '$source'");
		$this->db->where("date <= '$destination'");
		// $this->db->where("`create_date` BETWEEN '$source' and '$destination'", NULL, FALSE); 
		$this->db->select('If(SUM(`theftAmount`) is NULL,0,SUM(`theftAmount`)) AS comm',FALSE);
		$query = $this->db->get('');
		if($query->num_rows())
		{
			$row = $query->row();
			return $row->comm;
		}
		else
		{
			return false;
		}
		// $destination = $curdate." ".$destTime;
	}


function get_chart_details3($source,$interval)
	{
		$dtime 			= strtotime($source);
		$source 		= date("Y-m-d H:i:s", strtotime($source));
		if($interval=="0.5")
		{
			$destination 	= date("Y-m-d H:i:s", strtotime('+30 minutes', $dtime));
		}
		else if($interval=="1")
		{
			$destination 	= date("Y-m-d H:i:s", strtotime('+1 days', $dtime));
		}
		else
		{
			$destination 	= date("Y-m-d H:i:s", strtotime('+1 months', $dtime));
		}

		$this->db->from('coin_theft');
		$this->db->where('theftCurrency','WCN');
		$this->db->where("date >= '$source'");
		$this->db->where("date <= '$destination'");
		// $this->db->where("`create_date` BETWEEN '$source' and '$destination'", NULL, FALSE); 
		$this->db->select('If(SUM(`theftAmount`) is NULL,0,SUM(`theftAmount`)) AS comm',FALSE);
		$query = $this->db->get('');
		if($query->num_rows())
		{
			$row = $query->row();
			return $row->comm;
		}
		else
		{
			return false;
		}
		// $destination = $curdate." ".$destTime;
	}

function userverficationdetails($id)
{
	$this->load->database();
	$this->db->where('user_id',$id);        
	$query = $this->db->get('user_verification');
	if($query->num_rows() >= 1)
	{
		$row = $query->row();			
		$oldstatus=$row->verification_status;			
	}   
	
	if($oldstatus=="verified")
	{ 
		$newstatus="unverified";
	} 
	else 
	{
		$newstatus="verified";
	}  
	$curdate	=	date('Y-m-d G:i:s');				
	$data	=	array('verification_status'=>$newstatus);			
		$this->db->where('user_id',$id);  	
	$this->db->update('user_verification',$data);
	return true;
}

function userverficationdetails1($id)
{
	$this->db->where('user_id',$id);        
	$query = $this->db->get('user_verification');
	if($query->num_rows() >= 1)
	{
       return $query->row();
	}
	else
	{
		return false;
	}
}

function fetch_paid_fees($from = '', $to = '')
{
	if(empty($from) OR empty($to)) {
		$to = date('Y-m-d', time());
		$from = date('Y-m-d', time()-2592000);

		$x = $this->db->query('SELECT * FROM `paid_fees` WHERE `dateofpayment` >= ? AND `dateofpayment` <= ?', [$from, $to]);
		return $x->result();
	}

	$x = $this->db->query('SELECT * FROM `paid_fees` WHERE `dateofpayment` >= ? AND `dateofpayment` <= ?', [$from, $to]);
	return $x->result();
}
//general_settings
}//end of class

?>
