<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mdl_balance extends CI_Model {

	public $table = 'balance';

	public function __construct()
	{
		parent::__construct();
		
	}

	function fetch_user_balance_by_id($id,$currency)
	{ 
		$this->db->where('userId',$id);  
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
		} //below 2 else if added by jegan
		else if($currency=="ZAR")
		{
			$value = $row->ZAR;
		}
		else if($currency=="ETH")
		{
			$value = $row->ETH;
		}
		else if($currency=="NGN")
		{
			$value = $row->NGN;
		}
		else if($currency=="WCN")
		{
			$value = $row->WCN;
		}
		else if($currency=="HIT")
		{
			$value = $row->HIT;
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
		return $value;
	}   
	else
	{      
		return false;		
	}
}

function currency_balance()
{
	$id= $this->session->user_id;
	$this->db->where('userId',$id);
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