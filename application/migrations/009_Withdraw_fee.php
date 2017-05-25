<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Withdraw_fee extends CI_Migration {

    public function __construct()
    {
        $this->load->dbforge();
    }

    public function up() {

        // balance
        $fields = [];
        $fields['id'] = ['type' => 'INT','constraint' => 11,'auto_increment' => true];
        $fields['user_id'] = ['type' => 'INT','constraint' => 11];
        $fields['dateoffee'] = ['type' => 'DATE'];
        $fields['fee_amount'] = ['type' => 'DECIMAL','constraint' => 18,8];
        $fields['status'] = ['type' => 'TEXT'];

        $this->dbforge->add_field($fields);
        $this->dbforge->add_key('id', true);
        $this->dbforge->add_key('user_id', true);
        $this->dbforge->create_table('withdraw_fee', true);
    }

     public function down() {

    }
}
?>