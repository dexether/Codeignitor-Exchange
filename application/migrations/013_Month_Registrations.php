<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Month_Registrations extends CI_Migration {

    public function __construct()
    {
        $this->load->dbforge();
    }

    public function up() 
    {
        $fields = [];
        $fields['id'] = ['type' => 'INT','constraint' => 11,'auto_increment' => true];
        $fields['month-year'] = ['type' => 'TEXT'];
        $fields['users_num'] = ['type' => 'INT','constraint' => 11];
        
        $this->dbforge->add_field($fields);
        $this->dbforge->add_key('id', true);
        $this->dbforge->create_table('monthly_registrations', true);
    }

    public function down() 
    {

    }
}
?>