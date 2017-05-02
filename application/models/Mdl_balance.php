<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mdl_balance extends CI_Model {

	public $table = 'balance';

	public function __construct()
	{
		parent::__construct();
		
	}

	function fetch_user_balance_by_id($id,$currency)
	{ 
		$this->db->where('user_id',$id);  
		$query=$this->db->get('balance'); 
		if($query->num_rows() >= 1)
		{     	
			$row = $query->row();
			return isset($row->$currency)?$row->$currency:false;
	}   
	else
	{      
		return false;		
	}
}

function currency_balance()
{
	$this->db->where('user_id',$this->session->user_id);
	$res=$this->db->get('balance');
	if($res->num_rows()>0)
	{
		return $res->row();	
	}else{
		return false;
	}
}

}

/* End of file  */
/* Location: ./application/models/ */