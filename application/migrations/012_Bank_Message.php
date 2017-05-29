<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Bank_Message extends CI_Migration {

    public function __construct()
    {
        $this->load->dbforge();
    }

    public function up() 
    {

		$fields = array(
		        'message' => array('type' => 'TEXT')
		);
		$this->dbforge->add_column('user_bank_details', $fields);
    }

	public function down() 
	{
    }
}
?>
