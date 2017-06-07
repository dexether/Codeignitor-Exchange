<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Bank_Message extends CI_Migration {

    public function __construct()
    {
        $this->load->dbforge();
    }

    public function up() 
    {

    }

	public function down() 
	{
        $fields = array(
                'message' => array('type' => 'TEXT')
        );
     //   $this->dbforge->add_column('user_bank_details', $fields);
    }
}
?>
