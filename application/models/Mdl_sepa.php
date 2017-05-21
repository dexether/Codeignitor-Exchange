<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');


class mdl_sepa extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
    }


    public function create_sepa()
    {
        $date = date('Y-m-d');
        var_dump($date);
        //var_dump($this->group_header());
    }


    private function head() 
    {
        return <<<SEPA
        <?xml version="1.0" encoding="utf-8" ?>
        <Document xmlns="urn:iso:std:iso:20022:tech:xsd:pain.001.001.03" xmlns:xsi="http:⇒
        //www.w3.org/2001/XMLSchema-instance">
           <CstmrCdtTrfInitn>
SEPA;
    }


    private function group_header($message_id, $date_time, $num_of_transactions, $name)
    {
        return <<<SEPA
        <GrpHdr>
            <MsgId> Message Identification </MsgId>
            <CreDtm> Creation Date Time </CreDtm>
            <NbOfTxs> Number Of Transactions </NbOfTxs>
            
            <InitgPty> 
                <nm></nm>
            </InitgPty>
        </GrpHdr>
SEPA;
    }


    private function footer() 
    {
        return <<<SEPA
        </CstmrCdtTrfInitn>
        </Document>
SEPA;
    }
    
}