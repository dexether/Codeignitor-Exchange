<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Fixes extends CI_Migration {

    public function __construct()
    {
        $this->load->dbforge();
        // $this->load->database();
    }


    public function up()
    {
        $fields = [
            'email' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
                'unique'     => true
            ]
        ];
        $this->dbforge->modify_column('users', $fields);
    }

    public function down()
    {
        $fields = [
            'email' => [
                'type'       => 'VARCHAR',
                'constraint' => 50
            ]
        ];
        $this->dbforge->modify_column('users', $fields);
    }

}

