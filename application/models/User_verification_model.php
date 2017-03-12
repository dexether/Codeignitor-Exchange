<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class User_verification_model extends CI_Model {

	public $table = 'user_verification';

	public function __construct()
	{
		parent::__construct();
		
	}

	/**
	 *  @return one row if user_id eist else return all
	 */
	public function get($user_id=0)		
	{
		$row = $this->db->get_where($this->table, ['user_id' => $user_id])->row();

		if(!isset($row->passport)){
			$row->passport = 'http://placehold.it/406x150';
		}else{
			$row->passport = base_url('uploads/'.$row->passport);
		}

		if(!isset($row->selfie)){
			$row->selfie = 'http://placehold.it/406x150';
		}else{
			$row->selfie = base_url('uploads/'.$row->selfie);
		}

		if(!isset($row->backcard)){
			$row->backcard = 'http://placehold.it/406x150';
		}else{
			$row->backcard = base_url('uploads/'.$row->backcard);
		}
		return $row;
	}

	public function upload($file='')
	{
		$conf['upload_path']   = 'uploads';
		$conf['allowed_types'] = 'gif|jpg|png|pdf';
		$conf['file_name']     = '';
		$conf['overwrite']     = FALSE;
		$conf['max_size']      = 5000;
		$conf['max_width']     = 0;
		$conf['max_height']    = 0;
		$conf['encrypt_name']  = FALSE;
		$this->load->library('upload', $conf);

		if(!$this->upload->do_upload($file)){
			$this->session->set_flashdata('errors', $this->upload->display_errors('<p>', '</p>'));
		}else{
			$upload_data = $this->upload->data();
			$data = ['verification_status'=>'unverified','user_id' => $this->session->user_id,$file => $upload_data['file_name']];
			$this->update($data,$this->session->user_id);
			$this->session->set_flashdata('success','Data Updated');
		}
	}

	public function update($data=[],$user_id=0)
	{
		if(!$user_id){
			$user_id = $this->session->user_id;
		}

		$result = $this->db->get_where($this->table, ['user_id' => $user_id]);
		if($result->num_rows() > 0){
			$this->db->update($this->table, $data, ['user_id' => $user_id]);
		}else{
			$this->db->insert($this->table,$data);
		}
	}

}

/* End of file  */
/* Location: ./application/models/ */