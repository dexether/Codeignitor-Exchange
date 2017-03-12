<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mdl_country extends CI_Model {

	public $table = 'country';

	public function __construct()
	{
		parent::__construct();
		
	}

	function get_all()
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

	function get_by_id($id)
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

}

/* End of file  */
/* Location: ./application/models/ */