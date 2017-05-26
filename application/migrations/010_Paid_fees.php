<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Paid_fees extends CI_Migration {

    public function __construct()
    {
        $this->load->dbforge();
    }

    public function up() {
        
        $fields = [];
        $fields['id'] = ['type' => 'INT','constraint' => 11,'auto_increment' => true];
        $fields['dateofpayment'] = ['type' => 'DATE'];
        $fields['fee_amount'] = ['type' => 'DECIMAL','constraint' => 18,8];
        $fields['transaction'] = ['type' => 'TEXT'];
        $fields['origin'] = ['type' => 'TEXT'];
        
        $this->dbforge->add_field($fields);
        $this->dbforge->add_key('id', true);
        $this->dbforge->add_key('user_id', true);
        $this->dbforge->create_table('paid_fees', true);
    }

     public function down() {

    }
}
?>