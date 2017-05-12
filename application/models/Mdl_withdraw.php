<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mdl_withdraw extends CI_Model {

	public function tfa_bank_status() {

        $user_id = $this->session->user_id;
        $this->db->select('randcode');
        $query = $this->db->get_where('users', ['id' => $user_id]);

        $tfa_enabled = ( $query->row()->randcode == 'enable'? TRUE : FALSE );
        

        $this->db->select('status');
        $query = $this->db->get_where('user_bank_details', ['user_id' => $user_id]);

        if (!is_null($query->row())) {
        	$bank_verified = ( $query->row()->status == 1? TRUE : FALSE );
        } else {
        	$bank_verified = FALSE;
        }

        return ['tfa_enabled'=>$tfa_enabled, 'bank_verified' =>$bank_verified];
	}
}

?>