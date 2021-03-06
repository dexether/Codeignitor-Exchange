<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_DepositFee_Deposit extends CI_Migration {

    public function __construct()
    {
        $this->load->dbforge();
    }

    public function up()
    {
    }


    public function down()
    {

        $fields = [
            'deposit_fee' => [
                'type'          => 'FLOAT',
                'constraint'    => '5,2',
                'null'          => false,
            ],
        ];
        $this->dbforge->add_column('deposits', $fields);
    }
}
