<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Trade extends CI_Migration {

    public function __construct()
    {
        $this->load->dbforge();
    }

    public function up()
    {
        $fields = [];
        //add bidsell to trades
        $fields['bidsell'] = ['type' => 'VARCHAR','constraint' => 10];
        $this->dbforge->add_column('trades_NLG', $fields);
        $this->dbforge->add_column('trades_GTS', $fields);
       
        $fields = [];
        //add pending to orders
        $fields['units_filled'] = ['type' => 'DECIMAL','constraint' => '16,8', 'default'=>'0.00000000'];
        $fields['EUR_filled'] = ['type' => 'DECIMAL','constraint' => '16,8', 'default'=>'0.00000000'];
        $fields['fee_filled'] = ['type' => 'DECIMAL','constraint' => '16,8', 'default'=>'0.00000000'];
        $this->dbforge->add_column('order_NLG', $fields);
        
        $fields = [];
        //add pending to orders
        $fields['units_filled'] = ['type' => 'DECIMAL','constraint' => '16,8', 'default'=>'0.00000000'];
        $fields['GTS_filled'] = ['type' => 'DECIMAL','constraint' => '16,8', 'default'=>'0.00000000'];
        $fields['fee_filled'] = ['type' => 'DECIMAL','constraint' => '16,8', 'default'=>'0.00000000'];
        $this->dbforge->add_column('order_GTS', $fields);
        
        //set description om deposits table
         $fields = [];
         $fields['description'] = ['type' => 'VARCHAR','constraint' => 100];
         $fields['dividend_id'] = ['type' => 'INT','constraint' => 11];
         $this->dbforge->add_column('deposits', $fields);
        
        
        //create FEE tables
        //open_fees
        //processed_fees
        //
        $fields = [];
        $fields['id'] = ['type' => 'INT','constraint' => 11,'auto_increment' => true];
        $fields['user_id'] = ['type' => 'INT','constraint' => 11];
        $fields['table'] = ['type' => 'VARCHAR','constraint' => 100];
        $fields['table_id'] = ['type' => 'INT','constraint' => 11];
        $fields['trade_id'] = ['type' => 'INT','constraint' => 11];
        $fields['fee'] = ['type' => 'DECIMAL','constraint' => '16,8', 'default'=>'0.00000000'];
        $fields['trade_datetime'] = ['type' => 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP'];
        $fields['status'] = ['type' => 'VARCHAR','constraint' => 10];
        
        $this->dbforge->add_field($fields);
        $this->dbforge->add_key('id', true);
        $this->dbforge->add_key('user_id', true);
        $this->dbforge->add_key('table', true);
        $this->dbforge->add_key('table_id', true);
        $this->dbforge->add_key('trade_id', true);
        $this->dbforge->create_table('open_fees', true);
        
        $fields = [];
        $fields['id'] = ['type' => 'INT','constraint' => 11,'auto_increment' => true];
        $fields['payout_id'] = ['type' => 'INT','constraint' => 11];
        $fields['open_fee_id'] = ['type' => 'INT','constraint' => 11];
        $fields['process_datetime'] = ['type' => 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP'];
        $fields['status'] = ['type' => 'VARCHAR','constraint' => 10];
        
        $this->dbforge->add_field($fields);
        $this->dbforge->add_key('id', true);
        $this->dbforge->add_key('open_fee_id', true);
        $this->dbforge->create_table('closed_fees', true);
        
        //dividend
        $fields = [];
        $fields['id'] = ['type' => 'INT','constraint' => 11,'auto_increment' => true];
        $fields['total_fee'] = ['type' => 'DECIMAL','constraint' => '16,8', 'default'=>'0.00000000'];
        $fields['dividend_datetime'] = ['type' => 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP'];
        $fields['status'] = ['type' => 'VARCHAR','constraint' => 10];
        
        $this->dbforge->add_field($fields);
        $this->dbforge->add_key('id', true);
        $this->dbforge->create_table('dividend', true);
        
        //add pending to balance
        $fields = [];
        $fields['pending_EUR'] = ['type' => 'DECIMAL','constraint' => '16,8', 'default'=>'0.00000000'];
        $fields['pending_NLG'] = ['type' => 'DECIMAL','constraint' => '16,8', 'default'=>'0.00000000'];
        $fields['pending_GTS'] = ['type' => 'DECIMAL','constraint' => '16,8', 'default'=>'0.00000000'];
        $this->dbforge->add_column('balance', $fields);
    }

    public function down()
    {

        $this->dbforge->drop_column('tradesNLG', 'bidsell');
        $this->dbforge->drop_column('trades_GTS', 'bidsell');
        
        $this->dbforge->drop_column('order_NLG', 'units_filled');
        $this->dbforge->drop_column('order_NLG', 'EUR_filled');
        $this->dbforge->drop_column('order_NLG', 'fee_filled');
        
        $this->dbforge->drop_column('order_GTS', 'units_filled');
        $this->dbforge->drop_column('order_GTS', 'GTS_filled');
        $this->dbforge->drop_column('order_GTS', 'fee_filled');
        
        $this->dbforge->drop_column('deposits', 'description');
        $this->dbforge->drop_column('deposits', 'dividend_id');
        
        $this->dbforge->drop_table('open_fees');
        $this->dbforge->drop_table('closed_fees');
        $this->dbforge->drop_table('dividend');
        
        $this->dbforge->drop_column('balance', 'pending_EUR');
        $this->dbforge->drop_column('balance', 'pending_GTS');
        $this->dbforge->drop_column('balance', 'pending_NLG');
    }
}