<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Closed_Fees extends CI_Migration {

    public function __construct()
    {
        $this->load->dbforge();
    }

    public function up()
    {
        $fields = array(
                'payout_id' => array(
                    'name' => 'dividend_id',
                    'type' => 'INT',
                    'constraint' => '11'
                )
        );
        $this->dbforge->modify_column('closed_fees', $fields);
    }

    public function down()
    {
        $fields = array(
                'dividend_id' => array(
                    'name' => 'payout_id',
                    'type' => 'INT',
                    'constraint' => '11'
                )
        );
        $this->dbforge->modify_column('closed_fees', $fields);
    }
}
