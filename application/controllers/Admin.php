<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Admin extends MY_Controller
{

	public function __construct()
	{
		parent::__construct();

		$this->output->set_header("Cache-Control: no-store, no-cache, must-revalidate, no-transform, max-age=0, post-check=0, pre-check=0");
		$this->output->set_header("Pragma: no-cache");
		$this->load->model('admin_model');
		$this->load->model('mdl_user');

	}

	public function index()
	{
		auth(['admin','superadmin']);

		if (!$this->session->user_id > 0) {
			redirect('/');
		}

		$this->data['content'] = $this->load->view('admin/v_index', $data, true);
		view($this->data, 'admin');
	}

	public function users()
	{
		
	}

}

?>
