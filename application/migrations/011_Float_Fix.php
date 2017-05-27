<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Float_Fix extends CI_Migration {

    public function __construct()
    {
        $this->load->dbforge();
    }

    public function up() {

    }

     public function down() {

		$fields = array(
		        'NLG' => array(
		        	'name' => 'NLG',
		        	'type' => 'DOUBLE',
		        	'constraint' => '18,8',
		        ),
		        'EUR' => array(
		        	'name' => 'EUR',
		        	'type' => 'DOUBLE',
		        	'constraint' => '18,8',
		        ),
		        'GTS' => array(
		        	'name' => 'GTS',
		        	'type' => 'DOUBLE',
		        	'constraint' => '18,8',
		        ),
		);
		$this->dbforge->modify_column('balance', $fields);
		$this->dbforge->modify_column('deposits', $fields);
		$this->dbforge->modify_column('withdrawal', $fields);
    }
}
?>
