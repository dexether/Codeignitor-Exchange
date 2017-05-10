<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Tools extends MY_Controller{
    var $data = array();

    public function __construct()
    {
        parent::__construct();
    }

   public function deposit_nlg($txid=null)
    {
        if($txid)
        {
            $txid = $this->security->xss_clean($txid);
            //echo "txid:",$txid, "\n";
            require_once APPPATH.'third_party/rpc/Gulden.php';
            $rpc = new Gulden(GULDEN_USER, GULDEN_PASSWORD, GULDEN_HOST, GULDEN_PORT);
            //var_dump ($rpc);
            $transaction = $rpc->gettransaction($txid);
            //var_dump($transaction);
            if(isset($transaction['confirmations']))
            {
                //echo "confirmations:",$transaction['confirmations'], "\n";
                //call processor on guldentrader
                foreach ($transaction['details'] as $v) {
                    //call processor;
                    if($v['accountlabel'] == GULDEN_ACCOUNT && $v['category']=='receive')
                    {
                        //get user from address
                        $this->db->where('NLG',  $v['address']);
                        $a = $this->db->get('addresses');
                        if($a->num_rows() > 0)
                        {
                            $user_id = $a->row()->user_id;

                            //insert into deposit
                            /*
                             *
                             * DROP TABLE IF EXISTS `deposits`;
                                CREATE TABLE `deposits` (
                                  `id` int(11) unsigned NOT NULL,
                                  `user_id` int(11) unsigned NOT NULL,
                                  `txid` varchar(100) NOT NULL,
                                  `amount` decimal(16,8) UNSIGNED NOT NULL DEFAULT '0.00000000',
                                  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
                                ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
                             */
                            if($transaction['confirmations'] == 0)
                            {
                                $i = array();
                                $i['user_id'] = $user_id;
                                $i['txid'] = $transaction['txid'];
                                $i['status'] = 'recieved';
                                $i['NLG'] = $v['amount'];

                                $this->db->insert('deposits', $i);

                            }
                            else
                            if($transaction['confirmations'] == 1)
                            {
                                $u = array();
                                $u['status'] = 'confirmed';
                                $this->db->where('user_id', $user_id);
                                $this->db->where('txid', $transaction['txid']);
                                $this->db->update('deposits', $u);

                                $sql = 'UPDATE `balance` SET `gulden` = `gulden` + '.str_replace(',','',$v['amount']). ' WHERE `id` = '. $this->db->escape($user_id);
                                $this->db->query($sql);
                            }
                        }
                    }
                }
            }
        }
    }


    protected function get_user_verification_info($condition)
    {
        $row = $this->db->get_where('user_verification', $condition);
        if ($row->num_rows() === 0) {
            show_404();
            exit;
        }
        return $row->row();
    }


    protected function output_file($file_path, $file_mime_type)
    {
        header('Content-Type:' . $file_mime_type);
        //header('Content-Length: ' . filesize($file_path));
        readfile($file_path);
        // exit;
    }


	public function show_passport_upload($upload_id){
		$row = $this->get_user_verification_info(['passport' => $upload_id]);
        $this->output_file($row->passport_path, $row->passport_mimetype);
	}

	public function show_selfie_upload($upload_id){
		$row = $this->get_user_verification_info(['selfie' => $upload_id]);
        $this->output_file($row->selfie_path, $row->selfie_mimetype);
	}

	public function show_backcard_upload($upload_id){
		$row = $this->get_user_verification_info(['backcard' => $upload_id]);
        $this->output_file($row->backcard_path, $row->backcard_mimetype);
	}

    public function deposit($user_id)
    {

    }

}

/* End of file Tools.php */
/* Location: ./application/controllers/Tools.php */
