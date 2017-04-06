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

}