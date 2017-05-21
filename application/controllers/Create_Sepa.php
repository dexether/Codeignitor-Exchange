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
		$date = new DateTime();
		$msg_Id = $date->format('Y-m-d');
		$msg_Id .= 'T' . $date->format('H:i:s:v');

		$creditTransferFile = new SephpaCreditTransfer('Guldentrader', $msg_Id, SephpaCreditTransfer::SEPA_PAIN_001_002_03);
	
		$creditTransferCollection = $creditTransferFile->addCollection(array(
		// required information about the debtor
		    'pmtInfId'      => 'PaymentID-1234',        // ID of the payment collection
		    'dbtr'          => 'Name of Debtor',        // (max 70 characters)
		    'iban'          => 'DE21500500001234567897',// IBAN of the Debtor
		    'bic'           => 'SPUEDE2UXXX',           // BIC of the Debtor
		// optional
		    'ccy'           => 'EUR',                   // Currency. Default is 'EUR'
		    'btchBookg'     => 'true',                  // BatchBooking, only 'true' or 'false'
		    //'ctgyPurp'      => ,                      // Category Purpose. Do not use this if you do not know how. For further information read the SEPA documentation
		    'reqdExctnDt'   => '2013-11-25',            // Requested Execution Date: YYYY-MM-DD
		    'ultmtDebtr'    => 'Ultimate Debtor Name'   // just an information, this do not affect the payment (max 70 characters)
		));

		$creditTransferCollection->addPayment(array(
		// needed information about the creditor
		    'pmtId'     => 'TransferID-1234-1',     // ID of the payment (EndToEndId)
		    'instdAmt'  => 0.42,                    // amount,
		    'iban'      => 'DE21500500009876543210',// IBAN of the Creditor
		    'bic'       => 'SPUEDE2UXXX',           // BIC of the Creditor (only required for pain.001.002.03)
		    'cdtr'      => 'Name of Creditor',      // (max 70 characters)
		// optional
		    'ultmtCdrt' => 'Ultimate Creditor Name',// just an information, this do not affect the payment (max 70 characters)
		    //'purp'      => ,                      // Do not use this if you do not know how. For further information read the SEPA documentation
		    'rmtInf'    => 'Remittance Information' // unstructured information about the remittance (max 140 characters)
		));

		$creditTransferFile->downloadSepaFile();
	}
}