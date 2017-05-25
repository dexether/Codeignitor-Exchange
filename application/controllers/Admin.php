<?php if (!defined('BASEPATH')) exit('No direct script access allowed');


class Admin extends MY_Controller
{


	public function __construct()
	{
		parent::__construct();
        $admin_roles = ['admin','superadmin'];
        if(!in_array($this->session->userdata('role'), $admin_roles))
        {
            redirect ('/');
        }

		$this->load->library('grocery_CRUD');
		$this->load->model('admin_model');
		$this->load->model('mdl_user');
		$this->load->model('mdl_user_verification');
        $this->load->model('mdl_fees');
	}

	public function index()
	{
		auth(['admin','superadmin']);
		$this->data['content'] = $this->load->view('admin/v_index',[], true);
		view($this->data, 'admin');
	}

	public function users()
	{

		auth(['admin','superadmin']);
        $upload_path = 'uploads';

		$crud = new grocery_CRUD();

		$crud->set_table('users');
		$crud->set_subject('Manage Users');
		$crud->columns('id','email','username','verfiyStatus','trade_verification','role');
		$crud->unset_fields('id','modified_date','dateofreg','activated_date','timeofreg','password','profilepicture_path', 'profilepicture_mime', 'profilepicture_remove_reason');

		$crud->display_as('profilepicture', 'Profile picture');
		$crud->callback_edit_field('profilepicture',
								array($this, 'callback_edit_profilepicture'));

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


        $this->l_asset->add('plugins/alertifyjs/css/alertify.min.css','css');
        $this->l_asset->add('plugins/alertifyjs/css/themes/default.min.css','css');
        $this->l_asset->add('plugins/alertifyjs/alertify.min.js','js');
        $this->l_asset->add('js/admin/user_profile.js', 'js');

        $this->data['content'] = $this->load->view('admin/v_grocery_crud', (array) $output, true);
		view($this->data, 'admin');
	}

	public function callback_edit_profilepicture($value, $user_id) {
        $user_id = intval($user_id);
        $noImage = false;
        if (!$user_id) {
        	$noImage = true;
        } else {
	        $user = $this->mdl_user->get_userdetails($user_id);
	        if (!$user or !$user->profilepicture) {
	        	$noImage = true;
	        }
        }
        $csrf_token_name = $this->security->get_csrf_token_name();
        if ($noImage) {
        	$data = [
        		'imgStyle' => 'style="display:none;"',
        		'emptyStyle' => '',
	        	'csrf_token_name' => $csrf_token_name,
	        	'imgUrl' => '',
        		'profilepicture' => ''
	       	];
        } else {
        	$data = [
        		'imgStyle' => '',
        		'emptyStyle' => 'style="display:none;"',
	        	'csrf_token_name' => $csrf_token_name,
        		'imgUrl' => '/tools/show_profile_picture/' . $user->profilepicture,
        		'profilepicture' => $user->profilepicture
        	];
        }

        $template = $this->load->view('admin/v_edit_profilepicture', $data, true);
		return $template;
        }

	public function withdraw()
	{
		auth(['admin','superadmin']);
                $upload_path = 'uploads';

		$crud = new grocery_CRUD();

		$crud->set_table('withdrawal');
		$crud->set_subject('Manage Withdrawals');
		$crud->columns('user_id', 'EUR', 'GTS', 'NLG', 'transaction', 'status', 'verified', 'withdrawal_date');

		$output = $crud->render();
		$this->data['content'] = $this->load->view('admin/v_grocery_crud', (array) $output, true);
		view($this->data, 'admin');
        }

	public function bank_details()
	{
		auth(['admin','superadmin']);
        $upload_path = 'uploads';

		$crud = new grocery_CRUD();

		$crud->set_table('user_bank_details');
		$crud->set_subject('Manage User Bank Details');

		$output = $crud->render();
		$this->data['content'] = $this->load->view('admin/v_grocery_crud', (array) $output, true);
		view($this->data, 'admin');
	}

	public function callback_users_delete($primary_key)
	{
		// get user
		$user = $this->mdl_user->get($primary_key);
		$user_verification = $this->mdl_user_verification->get($primary_key);

		$is_user_verified = $user->verfiyStatus === 'verified' ||
							($user_verification && $user_verification->verification_status === 'verified');

		if (!$is_user_verified){
			$this->mdl_user->delete($primary_key);
		} else {
			return false;
		}
	}

	public function user_verification($primary_key='')
	{
		auth(['admin','superadmin']);
		// init

        $upload_path = '../application/uploads';
		$crud = new grocery_CRUD();
		$crud->set_table('user_verification');
		$crud->set_subject('user_verification');
		$crud->set_field_upload('selfie', $upload_path);
		$crud->set_field_upload('backcard', $upload_path);
		$crud->field_type('created_date', 'readonly');
		$crud->set_relation('user_id','users','username');
		$crud->display_as('user_id','Client Name');

		// load user data - only on edit
		if($crud->getState() == 'edit'){
			$primary_key = $crud->getStateInfo()->primary_key;
			$this->data['user'] = $this->db->get_where('user_verification',['id' => $primary_key])->row();
		}else{
			$this->data['user'] = NULL;
		}

		// unset
		$crud->unset_add();
		$crud->unset_read();
		$crud->unset_back_to_list();
		$crud->unset_print();
		$crud->unset_export();

		if(! isset($this->data['user']->passport_refuse_reason)){
			$crud->unset_fields('passport_refuse_reason'); // just show if reason exist and can edit
		}

		if(! isset($this->data['user']->backcard_refuse_reason)){
		   $crud->unset_fields('passport_refuse_reason'); // just show if reason exist and can edit
		}

		if(! isset($this->data['user']->selfie_refuse_reason)){
		   $crud->unset_fields('selfie_refuse_reason'); // just show if reason exist and can edit
		}
		// callback
		$crud->set_lang_string('update_success_message','Your data has been successfully stored into the database.<br/>Please wait while you are redirecting to the list page.
			<script type="text/javascript">window.location = "'.site_url('admin/users').'";</script>
			');

		// check
		$crud->callback_field('passport',array($this,'callback_passport'));
		$crud->callback_field('backcard',array($this,'callback_backcard'));
		$crud->callback_field('selfie',array($this,'callback_selfie'));

		$output = $crud->render();

		// assets
		$this->l_asset->add('plugins/alertifyjs/css/alertify.min.css','css');
		$this->l_asset->add('plugins/alertifyjs/css/themes/default.min.css','css');
		$this->l_asset->add('plugins/alertifyjs/alertify.min.js','js');
		$this->l_asset->add('js/admin/user_verification.js','js');

		$this->data['content'] = $this->load->view('admin/v_grocery_crud', (array) $output, true);
		view($this->data, 'admin');
	}

	public function clear_uploads_data()
	{
		if($this->input->is_ajax_request()){
		   // update user_verification table
			$refuse_reason = $this->input->post('refuse_reason');
			$field_name = $this->input->post('field_name');
			$id = $this->input->post('id');
			$this->db->set($field_name.'_refuse_reason',$refuse_reason);
			$this->db->set($field_name,'');
			$this->db->set($field_name.'_path','');
			$this->db->set($field_name.'_mimetype','');
			$this->db->where('id', $id);
			$this->db->update('user_verification');
		}else{
			show_error('this action not allowed');
		}
	}

	public function callback_passport($value = "", $primary_key = null)
	{
		$row = $this->data['user'];
		if(isset($row->passport_path) and $row->passport_path != ''){
			$output  = img('tools/show_passport_upload/'.$value,false,'class="img-rounded" id="passportImg"');
			$output .= '<a href="javascript:void(0)" class="text-danger deleteuploadsBTn" data-image-id="passportImg" data-fieldName="passport" data-csrf-gt="'.$this->security->get_csrf_hash().'" data-primary-key="'.$primary_key.'">delete</a>';
		}else{
			$output = '<i class="fa fa-picture-o fa-5x text-success"></i>';
		}
		return $output;

	}

	public function callback_backcard($value = "", $primary_key = null)
	{
		$row = $this->data['user'];
		if(isset($row->backcard_path) and $row->backcard_path != ''){
			$output  = img('tools/show_backcard_upload/'.$value,false,'class="img-rounded" id="backcardImg"');
			$output .= '<a href="javascript:void(0)" class="text-danger deleteuploadsBTn" data-image-id="backcardImg" data-fieldName="backcard" data-csrf-gt="'.$this->security->get_csrf_hash().'" data-primary-key="'.$primary_key.'">delete</a>';
		}else{
			$output = '<i class="fa fa-picture-o fa-5x text-success"></i>';
		}
		return $output;

	}

	public function callback_selfie($value = "", $primary_key = null)
	{
		$row = $this->data['user'];
		if(isset($row->selfie_path) and $row->selfie_path != ''){
			$output  = img('tools/show_selfie_upload/'.$value,false,'class="img-rounded" id="selfieImg"');
			$output .= '<a href="javascript:void(0)" class="text-danger deleteuploadsBTn" data-image-id="selfieImg" data-fieldName="selfie" data-csrf-gt="'.$this->security->get_csrf_hash().'" data-primary-key="'.$primary_key.'">delete</a>';
		}else{
			$output = '<i class="fa fa-picture-o fa-5x text-success"></i>';
		}
		return $output;

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

	public function fees()
	{
		auth(['admin','superadmin']);
		$this->l_asset->add('js/admin/fees_charts.js','js');

		$this->data['content'] = $this->load->view('admin/v_fees',[], true);
		view($this->data, 'admin');
	}


    public function get_open_fees_data()
    {
        auth(['admin','superadmin']);
        $days = intval($this->input->post('period', true));
        if ($days < 0 || $days > 30) {
            echo json_encode([
                'status' => 'error',
                'msg'    => 'Incorrect input parameter value'
            ]);
            exit;
        }

        $data = $this->mdl_fees->get_recent_fees_data($days);
        echo json_encode([
            'status' => 'ok',
            'data'   => $data
        ]);
        exit;
    }


    public function payment()
    {
        auth(['admin','superadmin']);
        $result = $this->mdl_fees->do_payment_main();
        if ($result) { // if error has been occured
            $result = [
                'status' => 'error',
                'msg' => $result
            ];
        } else {
            $result = [
                'status' => 'ok',
                'data' => 'Test'
            ];
        }
        echo json_encode($result);
        exit;
    }


	public function open_fees()
	{
		auth(['admin','superadmin']);

		$crud = new grocery_CRUD();

		$crud->set_table('open_fees');
		$crud->set_subject('Open fee');
        $crud->set_relation('user_id', 'users', '{firstname} {lastname}<br> ({email})');
        $crud->display_as('user_id', 'User');

        $crud->required_fields('user_id');
        $crud->unset_columns('table');

        $crud->field_type('status', 'enum', array('open', 'closed'));

		$output = $crud->render();

        $this->l_asset->add('plugins/alertifyjs/css/alertify.min.css','css');
        $this->l_asset->add('plugins/alertifyjs/css/themes/default.min.css','css');
        $this->l_asset->add('plugins/alertifyjs/alertify.min.js','js');
        $this->l_asset->add('js/admin/open_fees.js','js');

		$this->data['content'] = $this->load->view('admin/v_grocery_crud', (array) $output, true);
		view($this->data, 'admin');
	}


    /**
     * AJAX-queried function to check if we need to show 'Pay' button in
     * open_fees CRUD admin part
     *
     * @return boolean
     */
    public function is_pay_button_showed()
    {
        $sum = $this->mdl_fees->calc_open_fee();
        $toShow = $sum >= $this->mdl_fees::PAYMENT_MIN_LIMIT;
        echo json_encode(
            ['status' => 'ok', 'data' => $toShow]
        );
        exit;
    }


	public function closed_fees()
	{
		auth(['admin','superadmin']);

		$crud = new grocery_CRUD();

		$crud->set_table('closed_fees');
		$crud->set_subject('Closed fee');
        $crud->set_relation('open_fee_id', 'open_fees', '{user_id} {`table`} {fee}');
        $crud->display_as('open_fee_id', 'Open fee');

        $crud->required_fields('payout_id', 'open_fee_id', 'process_datetime', 'status');
        // $crud->unset_columns('table');

        $crud->field_type('status', 'enum', array('open', 'closed', 'processed'));

		$output = $crud->render();


		$this->data['content'] = $this->load->view('admin/v_grocery_crud', (array) $output, true);
		view($this->data, 'admin');
	}

	public function dividends()
	{
		auth(['admin','superadmin']);

		$crud = new grocery_CRUD();

		$crud->set_table('dividend');
		$crud->set_subject('Dividend');

        $crud->required_fields('total_fee', 'dividend_datetime', 'status');

        // $crud->field_type('status', 'enum', array('open', 'closed', 'processed'));

		$output = $crud->render();

		$this->data['content'] = $this->load->view('admin/v_grocery_crud', (array) $output, true);
		view($this->data, 'admin');
	}


}