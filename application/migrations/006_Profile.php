<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Profile extends CI_Migration {

    public function __construct()
    {
        $this->load->dbforge();
    }

    public function up()
    {
        $fields = [
            'profilepicture_mime' => [
                'type'          => 'VARCHAR',
                'constraint'    => 100,
                'null'          => false,
                'after'         => 'profilepicture'
            ]
        ];
        $this->dbforge->add_column('users', $fields);
    }


    public function down()
    {
        $this->dbforge->drop_column('users', 'profilepictire_mime');
    }
}
