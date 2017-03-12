<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mdl_user_bank_details extends CI_Model {

	public $table = 'user_bank_details';

	public function __construct()
	{
		parent::__construct();
	}

	function bank_details_update($data,$id)
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

}

/* End of file User_bank_details_model.php */
/* Location: ./application/models/User_bank_details_model.php */