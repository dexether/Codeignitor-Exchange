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

		$crud->add_action('Add Deposit', '', 'admin/user_deposit', 'crud_users_add_deposit');


        $this->l_asset->add('plugins/alertifyjs/css/alertify.min.css','css');
        $this->l_asset->add('plugins/alertifyjs/css/themes/default.min.css','css');
        $this->l_asset->add('plugins/alertifyjs/alertify.min.js','js');
        $this->l_asset->add('js/admin/user_profile.js', 'js');

        $this->data['content'] = $this->load->view('admin/v_grocery_crud', (array) $output, true);

		$output = $crud->render();
		$this->data['head_js'] = '<script src="'.base_url().'js/admin/add_deposit.js"></script>';
		$this->data['head_css'] = '<link rel="stylesheet" href="'. base_url() .'/css/crud_users.css">';
		$this->data['content'] = $this->load->view('admin/v_grocery_crud_users', (array) $output, true);

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
		$crud->where('status', 'pending');
		$crud->set_subject('Manage Withdrawals');
		$crud->columns('user_id', 'EUR', 'GTS', 'NLG', 'transaction', 'status', 'verified', 'withdrawal_date');


        $admin_roles = ['superadmin'];
        if(in_array($this->session->userdata('role'), $admin_roles))
        {
			$crud->add_action('To Paid', '', 'admin/withdraw_to_paid', 'edit_button btn btn-default');
        }

		$output = $crud->render();
		$this->data['content'] = $this->load->view('admin/v_grocery_crud_withdraw', (array) $output, true);
		view($this->data, 'admin');
	}

	public function withdraw_to_paid($id)
	{
		$this->load->model('mdl_withdraw');
		$this->mdl_withdraw->withdraw_to_paid($id);
		redirect('/admin/withdraw');
	}

	public function sepa_files($filename = '') 
	{
		if (!empty($filename)) {
			$file = APPPATH . 'SEPA/' . $filename;
			header('Content-Description: File Transfer');
		    header('Content-Type: application/octet-stream');
		    header('Content-Disposition: attachment; filename="'.basename($file).'"');
		    header('Expires: 0');
		    header('Cache-Control: must-revalidate');
		    header('Pragma: public');
		    header('Content-Length: ' . filesize($file));
		    readfile($file);
		    exit;
		}
		$files = array_diff(scandir(APPPATH . 'SEPA/'), array('..', '.'));

		foreach ($files as $file) {
			$string = file_get_contents(APPPATH . 'SEPA/' . $file);
			$splxml = simplexml_load_string($string);
			
			$creation_date = $splxml->CstmrCdtTrfInitn->GrpHdr->CreDtTm;
			$creation_date = implode(' at ', explode('T', $creation_date));

			$num_of_trx = $splxml->CstmrCdtTrfInitn->GrpHdr->NbOfTxs;
			$sum = $splxml->CstmrCdtTrfInitn->GrpHdr->CtrlSum;
			$output['names'][$file] = [
				'creation_date' => $creation_date,
				'num_of_trx' => $num_of_trx,
				'sum' => $sum
			];
		}

		$this->data['head_css'] = '<link type="text/css" rel="stylesheet" href="'.base_url().'css/admin_fees.css" >';
		$this->data['head_css'] .= '<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>';
		$this->data['head_css'] .= '<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">';
		$this->data['content'] = $this->load->view('admin/v_sepa_files', $output, true);
		view($this->data, 'admin');
	}

	public function fees()
	{
		$this->load->model('Admin_model');
		$this->form_validation->set_rules('from', 'From', 'required');
		$this->form_validation->set_rules('to', 'To', 'required');

		if ($this->form_validation->run() == true) {
			$vars['from'] = $from = $this->input->post('from');
			$vars['to']   = $to   = $this->input->post('to');
			$fees = $this->Admin_model->fetch_paid_fees($from, $to);
		} else {
			$vars['error'] = validation_errors('<p class="alert alert-danger">', '</p>');
			$fees = $this->Admin_model->fetch_paid_fees();
		}

		if (is_null($fees)) {
			$vars['fees'] = 'No fees record';
		} else {

			foreach ($fees as $fee) {
				$vars['fees'][] = [
					'user' => $fee->user_id,
					'transaction_id' => $fee->transaction,
					'amount' => $fee->fee_amount,
					'origin' => $fee->origin,
					'date' => $fee->dateofpayment
				];	
			}
		}

		$this->data['head_css'] = '<link type="text/css" rel="stylesheet" href="'.base_url().'css/admin_fees.css" >';
		$this->data['head_css'] .= '<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>';
		$this->data['head_css'] .= '<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">';
		$this->data['content'] = $this->load->view('admin/v_fees', $vars, true);
		view($this->data, 'admin');
	}


	public function user_deposit($id)
	{
		$this->form_validation->set_rules('amount', 'Amount', 'required');

		if ($this->form_validation->run() == true) {
			$rand = rand(1000, 999999);
			$transaction = $id . $rand;
	        $amount = abs($this->input->post('amount'));
	        $date = date('Y-m-d', time());

			$this->load->model('mdl_deposit');
			$this->mdl_deposit->deposit_record_EUR($id, $amount, $transaction, 'true', $date, 'Admin added deposit', 'EUR');

			redirect('/admin/users?r=success');
			return;
		} else {
			$vars['error'] = validation_errors('<p class="alert alert-danger">', '</p>');
		}

		$this->load->model('mdl_user');
		$vars['user'] = $this->mdl_user->get_userdetails($id);

		$this->data['head_js'] = '<script src="'.base_url().'js/admin/add_deposit.js"></script>';
		$this->data['head_css'] = '<link rel="stylesheet" href="'. base_url() .'/css/crud_users.css">';
		$this->data['content'] = $this->load->view('admin/v_deposit', $vars, true);
		view($this->data, 'admin');
        }

	public function bank_details()
	{
		auth(['admin','superadmin']);
        $upload_path = 'uploads';

		$crud = new grocery_CRUD();

		$crud->set_table('user_bank_details');
		$crud->set_subject('Manage User Bank Details');

		$crud->add_action('Reject', '', 'admin/reject_bank', 'btn btn-danger');
		$crud->add_action('Approve', '', 'admin/approve_bank', 'btn btn-primary');

		$output = $crud->render();
		$this->data['content'] = $this->load->view('admin/v_grocery_crud', (array) $output, true);
		view($this->data, 'admin');
	}

	public function approve_bank($id)
	{
		$this->load->model('mdl_user_bank_details');
		$this->mdl_user_bank_details->admin_action(1, $id);
			redirect('admin/bank_details');
	}
	
	public function reject_bank($id)
	{
		if (isset($_POST['message'])) {
			$post_message = trim($this->input->post('message'));
			$message = (!empty($post_message)? $post_message:'Bank information is rejected by admin.');

			$this->load->model('mdl_user_bank_details');
			$this->mdl_user_bank_details->admin_action(0, $id, $message);

			redirect('admin/bank_details');
		}

		$this->data['content'] = $this->load->view('admin/v_reject_message', [], True);
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