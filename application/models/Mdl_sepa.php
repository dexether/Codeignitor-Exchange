<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');


class mdl_sepa extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
    }


    public function prepare()
    {
        $data = $this->get_pending_data();

        foreach ($data as $records) {
            $user_id = $records->user_id;
            $transaction = $records->transaction;
            $amount = $records->EUR;
            $users[] = ['user_id'=>$user_id, 'transaction'=>$transaction, 'amount'=>$amount];
        }


        foreach ($users as $key=>$array) {
            $r = $this->user_bank_details($array['user_id']);
            $users[$key]['IBAN'] = $r->inter_banking_code;
            $users[$key]['BIC'] = $r->routing_number; 
            $users[$key]['verification_code'] = $r->verification_code; 
            $users[$key]['bank_name'] = $r->bank_name;

            $query = $this->db->get_where('users', ['id'=>$array['user_id']]);
            $users[$key]['firstname'] = $query->result()[0]->firstname;
            $users[$key]['lastname'] = $query->result()[0]->lastname;
        }

        return $users;
    }




    private function get_pending_data() 
    {   
        $query = $this->db->query('SELECT * FROM `withdrawal` WHERE `status` = "pending" AND `EUR` <> 0');
        return $query->result();
    }

    private function user_bank_details($user_id)
    {
        $query = $this->db->query('SELECT * FROM `user_bank_details` WHERE `user_id` = ?', [$user_id]);
        return $query->result()[0];
    }

    
}