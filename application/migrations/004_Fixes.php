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

        // add unique index for email field
        $fields = [
            'email' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
                'unique'     => true
            ]
        ];
        $this->dbforge->modify_column('users', $fields);

        // rename column 'slefie_path' into 'selfie_path' in user_verification table
       // $fields = [
       //     'slefie_path' => [
       //         'name'       => 'selfie_path',
       //         'type'       => 'VARCHAR',
       //         'constraint' => 100
       //     ]
      //  ];
       // $this->dbforge->modify_column('user_verification', $fields);
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

        $fields = [
            'selfie_path' => [
                'name'       => 'slefie_path',
                'type'       => 'VARCHAR',
                'constraint' => 100

            ]
        ];
        $this->dbforge->modify_column('user_verification', $fields);



    }

}

