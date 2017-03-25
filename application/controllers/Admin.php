<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Admin extends MY_Controller
{

	public function __construct()
	{
		parent::__construct();
		$this->load->library('grocery_CRUD');
		$this->load->model('admin_model');
		$this->load->model('mdl_user');
		$this->load->model('mdl_user_verification');

	}

	public function index()
	{
		auth(['admin','superadmin']);

		if (!$this->session->user_id > 0) {
			redirect('/');
		}

		$this->data['content'] = $this->load->view('admin/v_index',[], true);
		view($this->data, 'admin');
	}

	public function users()
	{
		$crud = new grocery_CRUD();
		
		$crud->set_table('users');
		$crud->set_subject('Manage Users');
		$crud->columns('id','email','username','verfiyStatus','trade_verification','role');
		$crud->unset_fields('id','modified_date','dateofreg','activated_date','timeofreg','password');
		
		$crud->set_field_upload('profilepicture','uploads');

		// types
		$crud->change_field_type('password', 'password');

		// display as
		$crud->display_as('verfiyStatus','Verify Status');

		// callback
		$crud->callback_column('verfiyStatus',array($this,'callback_verify_status'));
		$crud->callback_delete(array($this,'callback_users_delete'));

		$this->load->model('mdl_user_verification');
		$crud->callback_column('trade_verification',array($this,'callback_trade_verification'));

		$output = $crud->render();

		$this->data['content'] = $this->load->view('admin/v_grocery_crud', (array) $output, true);
		view($this->data, 'admin');	
	}

	public function callback_users_delete($primary_key)
	{
		// get user
		$user = $this->mdl_user->get($primary_key);
		$user_verification = $this->mdl_user_verification->get($primary_key);
		if($user->verifyStatus != 'verified' && $user_verification->verification_status != 'verified' ){
		   $this->mdl_user->delete($primary_key);
		}else{
			return false;
		}
	}

	public function user_verification($value='')
	{
		$crud = new grocery_CRUD();
		
		$crud->set_table('user_verification');
		$crud->set_subject('user_verification');
		
		$crud->set_field_upload('passport','uploads');
		$crud->set_field_upload('selfie','uploads');
		$crud->set_field_upload('backcard','uploads');
		
		$crud->field_type('created_date', 'readonly');

		$crud->set_relation('user_id','users','username');
		
		$crud->display_as('user_id','Client Name');

		$crud->unset_add();
		$crud->unset_read();
		$crud->unset_back_to_list();
		$crud->unset_print();
		$crud->unset_export();

		// callback
		$crud->set_lang_string('update_success_message','Your data has been successfully stored into the database.<br/>Please wait while you are redirecting to the list page.
			<script type="text/javascript">window.location = "'.site_url(strtolower(__CLASS__).'/'.strtolower('users')).'";</script>
			');

		$output = $crud->render();
		$this->data['content'] = $this->load->view('admin/v_grocery_crud', (array) $output, true);
		view($this->data, 'admin');		
	}

	public function callback_trade_verification($value,$row)
	{
    	// check user trade verification
		$user_verification = $this->mdl_user_verification->get($row->id);

		if($user_verification){
			return anchor('admin/user_verification/edit/'.$user_verification->id,$this->callback_verify_status($user_verification->verification_status).' <small class="fa fa-external-link"></small>');
		}else{
			return '<span class="label label-danger">unverified</span>';
		}
	}

	public function callback_verify_status($value='', $row='')
	{
		if($value == 'unverified'){
			$value = '<span class="label label-warning">'.$value.'</span>';
		}else{
			$value = '<span class="label label-success">'.$value.'</span>';
		}
		return $value;
	}

}

?>
