<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Model used for all desposit related issues
 */
class mdl_deposit extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
    }
    
    public function get_address($user_id, $fund='NLG')
    {
        //check if record exists
        $this->db->where('user_id',  $user_id);
        $a = $this->db->get('addresses');
        if($a->num_rows() > 0)
        {
            $row = $a->row();
            if(isset($row->$$fund) && !empty($row->$$fund))
            return $row->$$fund;
        }

        if($fund == 'NLG')
            //create address
            require_once APPPATH.'third_party/rpc/Gulden.php';
            
            $rpc = new Gulden(GULDEN_USER, GULDEN_PASSWORD, GULDEN_HOST ,GULDEN_PORT);
            $address = $rpc->getnewaddress(GULDEN_ACCOUNT);
            if(!$rpc->error && $address)
            {
                if($a->num_rows() > 0)
                {    
                    $this->db->where('user_id',  $user_id);
                    $this->db->update('addresses', array('NLG'=>$address));

                }else
                {
                    $insert['user_id'] = $user_id;
                    $insert['NLG'] = $address;
                    $this->db->insert('addresses', $insert);
                }
                return $address;
            }
            return false;
    }

    public function get_deposit_code($user_id)
    {
        $this->db->where('user_id',  $user_id);
        $this->db->where('status',  'open');
        $a = $this->db->get('bank_deposit');
        if($a->num_rows() > 0)
        {
            $row = $a->row();
            return $row->deposit_code;
        }
        else
        {
            $code =  random_string(8, false, true, false, true, true);
            $insert['user_id'] = $user_id;
            $insert['deposit_code'] = $code;
            $insert['status'] = 'open';
            $this->db->insert('bank_deposit', $insert);

            return $code;
        }
    }


    public function get_deposit_history() 
    {
        $query = $this->db->query('SELECT * FROM `deposits` WHERE user_id = ?', [$this->session->user_id]);
        
        if (!$query->row()) {
            return ['status'=>false];
        }

        foreach($query->result() as $res) {
            $data[] = $res;
        }

        return ['status'=>true, 'data'=>$data];
    }


    public function deposit_record_EUR($user_id, $amount, $transaction, $status, $date, $description, $type) 
    {
        $data = [
            'user_id'         => $user_id,
            strtoupper($type) => $amount,
            'transaction'     => $transaction,
            'verified'        => $status,
            'deposit_date'            => $date,
            'description'     => $description,
            'type'            => $type
        ];
        $this->db->insert('deposits', $data);

        if ($status == 'true' and $type == 'eur') {
            $this->update_balance($user_id, $amount);


            $this->db->query('INSERT INTO `deposit_fee`(`user_id`, `dateoffee`, `fee_amount`, `transaction`, `status`) VALUES (?, NOW(), ?, ?, ?);', [$user_id, TAXDEPOSIT, $transaction, 'paid']);

            $this->db->query('INSERT INTO `paid_fees`(`user_id`, `dateofpayment`, `fee_amount`, `transaction`, `origin`) VALUES (?, NOW(), ?, ?, ?);', [$user_id, TAXDEPOSIT, $transaction, 'deposit']);
        }
    }

    private function update_balance($user_id, $amount)
    {
        $this->db->select('EUR');
        $query = $this->db->get_where('balance', ['user_id' => $user_id]);
        $eur_balance = $query->row()->EUR;
        $eur_balance += $amount-TAXDEPOSIT;

        $this->db->query("UPDATE `ciexcgt`.`balance` SET `EUR`=? WHERE `user_id`=?;
        ", [$eur_balance, $user_id]);
    }

}