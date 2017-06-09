<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Withdraw extends MY_Controller
{
    public $data;

    // see private function check_status()
    private $status;
    private $status_error;

    // allowed currencies, see private function check_currency()
    private $currencies = ['eur', 'nlg'];


    public function __construct()
    {
        parent::__construct();

        //checks if user is logged in
        if (!isset($this->session->user_id)){
            $this->index();
        }

        $this->load->model('mdl_withdraw');
        $this->check_status($this->mdl_withdraw->tfa_bank_status());
    }


    // 1. Checks is amount ok, if yes sends is to TFA
    // 2. If currency is not set returns 404, see private function check_currency()
    public function currency_withdraw($currency = '') 
    {
		if (!$this->status) {
			$data['error'] = $this->status_error;
            $data['menu'] = $this->load->view('markets/v_menu', array('uri'=>$this->uri->segment(2)), true);
	    	$data['content'] = $this->load->view('funds/v_withdraw_error', $data, true);
	    	return $this->load->view('template/v_main_template', $data);
		}

		$currency_info = $this->check_currency($currency);

	    $this->form_validation->set_rules('amount', 'Amount', 'trim|required|numeric');

	    if ($this->form_validation->run() == true) {
	        
	        $amount = abs($this->input->post('amount'));

	        if ((float)$amount <= (float)$currency_info['balance'] && $amount !== 0) {
	            
	            $this->session->pending_curr = [ 'type'=>$currency_info['name'] , 'amount'=>$amount ];
	            redirect('/tfa/display/currency_withdraw');
	            return;
	        }

	        $data['alert'] = '<p class="alert alert-danger">Amount not valid.</p>';

	    } else {
	        $data['alert'] = validation_errors('<p class="alert alert-danger">', '</p>');
	    }

        $currency_info['balance'] = number_format($currency_info['balance'], 2);
	    $data['currency'] = $currency_info;
	    $data['menu'] = $this->load->view('markets/v_menu', array('uri'=>$this->uri->segment(2)), true);
        $data['pending'] = number_format($currency_info['pending'], 2);
	    $data['content'] = $this->load->view('funds/v_eur_withdraw.php', $data, true);
	    return $this->load->view('template/v_main_template', $data);
   	}


   	// Checks if some session data was set, returns 404 if not
    public function accept_withdraw()
    {
        if(!isset($this->session->withdraw_conf)) {
            show_404();
            return;
        }

        if($this->session->withdraw_conf !== true) {
            show_404();
            return;
        }
  
        $this->load->model('mdl_withdraw');
        $vars = $this->mdl_withdraw->withdraw_record();
        $this->mdl_withdraw->common_mail($vars); 

        // Set some session data to null so user can't withdraw 2 times in row by accident
        $this->session->pending_curr = NULL;  
        $this->session->withdraw_conf = NULL;

        $content = 'Your transaction has been successfully created. Email confirmation has been sent to your email address.';  
        $vars['message'] = '<div class="alert alert-success"><i class="glyphicon glyphicon-ok"></i> '.$content.' <br/></div>';
        $data['content'] = $this->load->view('funds/v_withdraw_message', $vars, TRUE);  
        $data['menu'] = $this->load->view('markets/v_menu', array('uri'=>$this->uri->segment(2)), true);
        $this->load->view('template/v_main_template', $data);
    }



    public function confirm_withdraw ($transaction) 
    {
        $this->load->model('mdl_withdraw');
        $return = $this->mdl_withdraw->confirm_withdraw($transaction);

        if (!$return) {
            show_404();
            return;
        }

        $content = 'Your transaction has been successfully activated.';  
        $vars['message'] = '<div class="alert alert-success"><i class="glyphicon glyphicon-ok"></i> '.$content.'</div>';
        $data['content'] = $this->load->view('funds/v_withdraw_message', $vars, TRUE); 
        $data['menu'] = $this->load->view('markets/v_menu', array('uri'=>$this->uri->segment(2)), true);
        $this->load->view('template/v_main_template', $data);  
    }


    public function cancel_withdraw ($transaction) 
    {
        $this->load->model('mdl_withdraw');
        $return = $this->mdl_withdraw->cancelq_withdraw($transaction);

        if (!$return) {
            show_404();
            return;
        }

        $content = 'Your transaction has been successfully canceled.' ; 
        $vars['message'] = '<div class="alert alert-success"><i class="glyphicon glyphicon-ok"></i> '.$content.' <br/></div>';
        $data['content'] = $this->load->view('funds/v_withdraw_message', $vars, TRUE);
        $data['menu'] = $this->load->view('markets/v_menu', array('uri'=>$this->uri->segment(2)), true);
        $this->load->view('template/v_main_template', $data);
        
    }



    //=======================================================================
    // PRIVATE FUNCTIONS
    //=======================================================================
    
    private function check_status ($is) 
    {
    	if (!$is['tfa_enabled']) {
    		$this->status = FALSE;
    		$this->status_error = 'Sorry, you can not withdraw. TFA must be enabled in settings menu.';
    		return;
    	}

    	if (!$is['bank_verified']) {
    		$this->status = FALSE;
    		$this->status_error = 'Sorry, you can not withdraw. Bank details must be verified.';
    		return;
    	}

    	$this->status = TRUE;
    }

    private function check_currency($currency) 
    {
    	$currency = trim($currency);
    	if (!in_array($currency, $this->currencies)) {
    		show_404();
    		die();
    		return;
    	}

    	$currency = strtoupper($currency);
    	$this->load->model('mdl_balance');
    	$obj = $this->mdl_balance->fetch_user_balance_by_id($this->session->user_id, $currency);
        $pending = 'pending_' . $currency;
    	$currency_info = ['name'=>$currency ,'balance'=>$obj->$currency, 'pending'=>$obj->$pending];
    	return $currency_info;
    }

    private function index() {
        redirect('/');
    }
}