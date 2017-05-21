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
            'profilepicture_path' => [
                'type'          => 'VARCHAR',
                'constraint'    => 255,
                'null'          => false,
                'after'         => 'profilepicture'
            ],
            'profilepicture_mime' => [
                'type'          => 'VARCHAR',
                'constraint'    => 100,
                'null'          => false,
                'after'         => 'profilepicture_path'
            ],
            'profilepicture_remove_reason' => [
                'type'          => 'VARCHAR',
                'constraint'    => 255,
                'null'          => false,
                'after'         => 'profilepicture_mime'
            ]
        ];
        $this->dbforge->add_column('users', $fields);
    }


    public function down()
    {
        $this->dbforge->drop_column('users', 'profilepicture_path');
        $this->dbforge->drop_column('users', 'profilepicture_mime');
        $this->dbforge->drop_column('users', 'profilepicture_remove_reason');
    }
}
