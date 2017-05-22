<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Create_Sepa extends MY_Controller
{
	public function __construct()
	{
		parent::__construct();
		include APPPATH . '/libraries/SepaUtilities.php';
		include APPPATH . '/libraries/SephpaCreditTransfer.php';
		include APPPATH . '/libraries/payment-collections/SepaPaymentCollection.php';
		include APPPATH . '/libraries/SepaCreditTransfer00100203.php';
	}

	public function index() 
	{
		$this->load->model('mdl_sepa');

		$data = $this->mdl_sepa->prepare();
		var_dump($data);
	}	
}
