<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mdl_User_verification extends CI_Model {

	public $table = 'user_verification';

	public function __construct()
	{
		parent::__construct();
	}


	protected function set_image_path($obj, $field_name)
	{
		$new_field_val = '';
		if (!isset($obj->$field_name) || !$obj->$field_name){
			$new_field_val = 'http://placehold.it/406x150';
		} else {
			$new_field_val =  base_url('tools/show_' . $field_name . '_upload/' . $obj->$field_name);
		}
		$obj->$field_name = $new_field_val;
	}

	/**
	 *  @return one row if user_id eist else return all
	 */
	public function get($user_id=0)
	{
		$row = $this->db->get_where($this->table, ['user_id' => $user_id]);
		if ($row->num_rows() === 0) return false;

		$row_obj = $row->row();

		$this->set_image_path($row_obj, 'passport');
		$this->set_image_path($row_obj, 'selfie');
		$this->set_image_path($row_obj, 'backcard');


		// var_dump($row_obj);
		// die;


		return $row_obj;
	}

	public function upload($file='')
	{
		$conf['upload_path']   = 'uploads';
		$conf['allowed_types'] = 'gif|jpg|png|pdf';
		$conf['overwrite']     = FALSE;
		$conf['max_size']      = 5000;
		$conf['max_width']     = 0;
		$conf['max_height']    = 0;
		$conf['encrypt_name']  = TRUE;
		$this->load->library('upload', $conf);

		if(!$this->upload->do_upload($file)){
			$this->session->set_flashdata('errors', $this->upload->display_errors('<p>', '</p>'));
		}else{
			$upload_data = $this->upload->data();
			$data = [
			'verification_trade'=>'unverified',
			'user_id' => $this->session->user_id,
			$file => $upload_data['raw_name'],
			$file.'_path' => 'uploads/'.$upload_data['file_name'],
			$file.'_mimetype' => $upload_data['file_type'],
                             // $file.'_mimetype' => '',
			];
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