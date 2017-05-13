<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Withdraw extends MY_Controller
{
    public $data;
    private $status;
    private $status_error;

    private $currencies = ['eur', 'nlg', 'gts'];

    public function __construct()
    {
        parent::__construct();

        if (!isset($this->session->user_id)){
            $this->index();
        }

        $this->load->model('mdl_withdraw');
        $this->status_check($this->mdl_withdraw->tfa_bank_status());
    }

    public function currency_withdraw($currency = '') 
    {
    	if (!$this->status) {
    		$data['error'] = $this->status_error;
    		$data['menu'] = $this->data['menu'];
        	$data['content'] = $this->load->view('funds/v_withdraw_error', $data, true);
        	return $this->load->view('template/v_main_template', $data);
    	}

    	$currency_info = $this->check_currency($currency);

        $this->form_validation->set_rules('amount', 'Amount', 'trim|required|numeric');

        if ($this->form_validation->run() == true) {
            
            $amount = abs($this->input->post('amount'));
            
            if ((float)$amount <= (float)$currency_info['balance'] && $amount !== 0) {
                
                $this->session->pending_curr = [ 'type'=>$currency_info['name'] ,'amount'=>$amount ];
                redirect('/tfa/display/eur_withdraw');
                return;
            }

            $data['alert'] = '<p class="alert alert-danger">Amount not valid.</p>';

        } else {
            $data['alert'] = validation_errors('<p class="alert alert-danger">', '</p>');
        }

        $data['currency'] = $currency_info;
        $data['menu'] = $this->data['menu'];
        $data['content'] = $this->load->view('funds/v_eur_withdraw.php', $data, true);
        return $this->load->view('template/v_main_template', $data);
   	}


	    public function accept_withdraw()
	    {
	        //var_dump($this->session->withdraw_conf);

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
	    }


	    public function confirm_withdraw ($transaction) 
	    {
	        echo 'confirm<br>';
	        echo $transaction;
	    }


	    public function cancel_withdraw ($transaction) 
	    {
	        echo 'cancel<br>';
	        echo $transaction;
	    }

	    private function status_check ($is) 
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
        	$balance = $this->mdl_balance->fetch_user_balance_by_id($this->session->user_id, $currency);
        	$currency_info = [ 'name'=>$currency ,'balance'=>number_format($balance, 2)];
        	return $currency_info;
	    }

	    private function index() {
	        redirect('/');
	    }
}