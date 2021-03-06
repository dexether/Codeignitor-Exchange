<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mdl_user_bank_details extends CI_Model {

	public $table = 'user_bank_details';

	public function __construct()
	{
		parent::__construct();
	}

	function bank_details_update($data, $id)
	{
		$this->db->where('user_id', $id);
		$res = $this->db->get('user_bank_details');
		$data['status'] = '0'; 		// reset status
		$data['user_id'] = $id;
		if ($res->num_rows() > 0) { // updating of existed records
			$this->db->where('user_id', $id);
			$res = $this->db->update('user_bank_details', $data);
		} else { // adding a new record
			$res = $this->db->insert('user_bank_details', $data);
		}
		$msg = $res ? "Your Bank Details Are Successfully updated" :
					"Error while updating";
		$result = [
  	       "csrfTokenName" => $this->security->get_csrf_token_name(),
           "csrfHash"      => $this->security->get_csrf_hash(),
           "msg" => $msg
		];
		echo json_encode($result);
	}

	function acccount_details()
	{
		$id=$this->session->user_id;
		$this->db->where('user_id',$id);
		$res=$this->db->get('user_bank_details');
		if($res->num_rows()>0)
		{
			return $res->row();
		}
		else
		{
			return false;
		}
	}

	function admin_action ($action, $id, $admin_message = 'Bank information is rejected by admin.')
	{
		if ($action == 0) {

			$this->db->query("UPDATE `ciexcgt`.`user_bank_details` SET `status`='0' WHERE `id`=?;",  [$id]);
			$this->db->query("UPDATE `ciexcgt`.`user_bank_details` SET `message`=? WHERE `id`=?;",   [$admin_message, $id]);
			return;
		}

		$message = 'Your bank information is approved by admin.';

		$this->db->query("UPDATE `ciexcgt`.`user_bank_details` SET `status`='1' WHERE `id`=?;",  [$id]);
		$this->db->query("UPDATE `ciexcgt`.`user_bank_details` SET `message`=? WHERE `id`=?;",   [$message, $id]);
		return;
	}

}

/* End of file User_bank_details_model.php */
/* Location: ./application/models/User_bank_details_model.php */