 <?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Create_Sepa extends MY_Controller
{

	private $creditTransferFile;
	private $creditTransferCollection;
	private $message_id;
	private $users;

	public function __construct()
	{
		parent::__construct();

        $admin_roles = ['superadmin'];
        if(!in_array($this->session->userdata('role'), $admin_roles))
        {
            show_404();
            return;
        }

		include APPPATH . '/libraries/SepaUtilities.php';
		include APPPATH . '/libraries/SephpaCreditTransfer.php';
		include APPPATH . '/libraries/payment-collections/SepaPaymentCollection.php';
		include APPPATH . '/libraries/SepaCreditTransfer00100203.php';


		$date = date('Y-m-d', time());
		$time = date('H:i:s:u');
		$this->message_id = $date . 'T' . $time;

		$this->load->model('mdl_sepa');
		$data = $this->mdl_sepa->prepare();
		
		foreach($data as $user) {

			if(!SepaUtilities::checkIban($user['IBAN']) OR !SepaUtilities::checkBic($user['BIC'])) {
				continue;
			}

			$this->users[] = [
				'transaction' 	=> $user['transaction'],
				'IBAN' 			=> $user['IBAN'],
				'BIC'  			=> $user['BIC'],
				'amount'		=> $user['amount'] - TAXSEPA,
				'name' 			=> $user['firstname'] . ' ' . $user['lastname'],

			];
		}
	}

	public function index() 
	{
		$this->start_sepa();
		$this->create_collection();
		
		$this->load->model('mdl_sepa');
		$data = $this->mdl_sepa->prepare();
		
		if (empty($this->users)) {
			redirect('admin/withdraw/valid_error');
			return;
		}	

		foreach($this->users as $user) {

			$amount = $user['amount'] - TAXSEPA;
			$this->add_payment( $user['transaction'], $amount, $user['IBAN'], $user['BIC'], $user['name']);
		}

		$filename =  APPPATH . 'SEPA/sepa'.date('Y-m-d.');
		$rand = rand(1000, 9999);
		while (file_exists($filename . $rand . '.xml')) {
			$rand = rand(1000, 9999);
		}
		$filename = $filename . $rand . '.xml';
		$this->creditTransferFile->storeSepaFile($filename);

		redirect('admin/withdraw');
	}

	private function start_sepa()
	{
		$this->creditTransferFile = new SephpaCreditTransfer(	INITIATORNAME,
                                                   				$this->message_id, 
                                                   				SephpaCreditTransfer::SEPA_PAIN_001_002_03	);
	}

	private function create_collection() 
	{
		$this->creditTransferCollection = $this->creditTransferFile->addCollection(array(
		// required information about the debtor
		    'pmtInfId'      => $this->message_id . '-1',        // ID of the payment collection
		    'dbtr'          => DEBTORNAME,        // (max 70 characters)
		    'iban'          => DEBTORIBAN,// IBAN of the Debtor
		    'bic'           => DEBTORBIC,           // BIC of the Debtor
		// optional
		    'ccy'           => 'EUR',                   // Currency. Default is 'EUR'
		    'btchBookg'     => 'true',                  // BatchBooking, only 'true' or 'false'
		    //'ctgyPurp'      => ,                      // Category Purpose. Do not use this if you do not know how. For further information read the SEPA documentation
		    'reqdExctnDt'   => date('Y-m-d', time()),            // Requested Execution Date: YYYY-MM-DD
		    'ultmtDebtr'    => DEBTORBIC   // just an information, this do not affect the payment (max 70 characters)
			));
	}

	private function add_payment( $transaction, $amount, $iban, $bic, $name )
	{
		$this->creditTransferCollection->addPayment(array(
		// needed information about the creditor
		    'pmtId'     => $transaction,     // ID of the payment (EndToEndId)
		    'instdAmt'  => $amount,                    // amount,
		    'iban'      => $iban,// IBAN of the Creditor
		    'bic'       => $bic,           // BIC of the Creditor (only required for pain.001.002.03)
		    'cdtr'      => $name,      // (max 70 characters)
		// optional
		    'ultmtCdrt' => '',// just an information, this do not affect the payment (max 70 characters)
		    //'purp'      => ,                      // Do not use this if you do not know how. For further information read the SEPA documentation
		    'rmtInf'    => 'Remittance Information' // unstructured information about the remittance (max 140 characters)
		));
	}	
}
