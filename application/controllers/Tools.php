<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Tools extends MY_Controller {

	public function __construct()
	{
		parent::__construct();
	}

	public function index()
	{
		
	}

	public function show_passport_upload($upload_id){
		// echo 'uploads/'.$upload_id;
		$row = $this->db->get_where('user_verification', ['passport' => $upload_id])->row();
		$file = $row->passport_path;
		$content_type = $row->passport_mimetype;
		header('Content-Type:'.$content_type);
		//header('Content-Length: ' . filesize($file));
		readfile($file);
	}

	public function show_selfie_upload($upload_id){
		// echo 'uploads/'.$upload_id;
		$row = $this->db->get_where('user_verification', ['selfie' => $upload_id])->row();
		$file = $row->selfie_path;
		$content_type = $row->selfie_mimetype;
		header('Content-Type:'.$content_type);
		//header('Content-Length: ' . filesize($file));
		readfile($file);
	}

	public function show_backcard_upload($upload_id){
		// echo 'uploads/'.$upload_id;
		$row = $this->db->get_where('user_verification', ['backcard' => $upload_id])->row();
		$file = $row->backcard_path;
		$content_type = $row->backcard_mimetype;
		header('Content-Type:'.$content_type);
		//header('Content-Length: ' . filesize($file));
		readfile($file);
	}

}

/* End of file Tools.php */
/* Location: ./application/controllers/Tools.php */