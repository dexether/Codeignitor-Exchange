<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mdl_User_verification extends CI_Model {

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

		if(is_object($row)){
			if(!isset($row->passport)){
				$row->passport = 'http://placehold.it/406x150';
			}else{
				$path = base_url('tools/show_passport_upload/'.$row->passport);
				$row->passport = $path;
			}

			if(!isset($row->selfie)){
				$row->selfie = 'http://placehold.it/406x150';
			}else{
				$path = base_url('tools/show_selfie_upload/'.$row->selfie);
				$row->selfie = $path;
			}

			if(!isset($row->backcard)){
				$row->backcard = 'http://placehold.it/406x150';
			}else{
				$path = base_url('tools/show_backcard_upload/'.$row->backcard);
				$row->backcard = $path;
			}
		}else{
			return false;
		}
		return $row;
	}

	public function upload($file='')
	{
            $conf['upload_path']   = 'uploads';
            $conf['allowed_types'] = 'gif|jpg|png|pdf';
            $conf['file_name']     = md5();
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