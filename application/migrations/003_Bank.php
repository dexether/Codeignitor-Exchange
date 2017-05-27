<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Bank extends CI_Migration {

    public function __construct()
    {
        $this->load->dbforge();
        //$this->load->database();
    }

    public function up() {

        // user_bank_details
        $fields = [];
        $fields['id'] = ['type' => 'INT','constraint' => 11,'auto_increment' => true];
        $fields['user_id'] = ['type' => 'INT','constraint' => 11];
        $fields['bank_name'] = ['type' => 'VARCHAR','constraint' => 100];
        $fields['bank_account'] = ['type' => 'VARCHAR','constraint' => 10];
        $fields['inter_banking_code'] = ['type' => 'VARCHAR','constraint' => 45];
        $fields['verification_code'] = ['type' => 'VARCHAR','constraint' => 25];
        $fields['routing_number'] = ['type' => 'VARCHAR','constraint' => 35];
        $fields['status'] = ['type' => 'TINYINT','constraint' => 1];

        $this->dbforge->add_field($fields);
        $this->dbforge->add_key('id', true);
        $this->dbforge->add_key('user_id', true);
        $this->dbforge->create_table('user_bank_details', true);

        //Adresses
        $fields = [];
        $fields['id'] = ['type' => 'INT','constraint' => 11,'auto_increment' => true];
        $fields['user_id'] = ['type' => 'INT','constraint' => 11];
        $fields['NLG'] = ['type' => 'VARCHAR','constraint' => 110];
        $fields['date_added'] = ['type' => 'DATE'];
        $fields['status'] = ['type' => 'VARCHAR','constraint' => 10];

        $this->dbforge->add_field($fields);
        $this->dbforge->add_key('id', true);
        $this->dbforge->add_key('user_id', true);
        $this->dbforge->create_table('addresses', true);

        //Commission
        $fields = [];
        $fields['id'] = ['type' => 'INT','constraint' => 11,'auto_increment' => true];
        $fields['user_id'] = ['type' => 'INT','constraint' => 11];
        $fields['currency'] = ['type' => 'VARCHAR','constraint' => 4];
        $fields['type'] = ['type' => 'VARCHAR','constraint' => 10]; // deposit or witdrawal;
        $fields['amount'] = ['type' => 'DECIMAL','constraint' => '12,8'];
        $fields['sort'] = ['type' => 'VARCHAR','constraint' => 15]; // percentage or fixed
        $fields['date_added'] = ['type' => 'DATE'];
        $fields['status'] = ['type' => 'VARCHAR','constraint' => 10];

        $this->dbforge->add_field($fields);
        $this->dbforge->add_key('id', true);
        $this->dbforge->add_key('user_id', true);
        $this->dbforge->create_table('commission', true);
        
//Trades_NLG

        $fields = [];
        $fields['id'] = ['type' => 'INT','constraint' => 11,'auto_increment' => true];
        $fields['user_id'] = ['type' => 'INT','constraint' => 11];
        $fields['bid_id'] = ['type' => 'INT','constraint' => 11];
        $fields['sell_id'] = ['type' => 'INT','constraint' => 11];
        $fields['price'] = ['type' => 'DECIMAL','constraint' => '16,8'];

        $fields['amount'] = ['type' => 'DECIMAL','constraint' => '16,8'];
        $fields['total'] = ['type' => 'DECIMAL','constraint' => '16,8'];
        $fields['fee'] = ['type' => 'DECIMAL','constraint' => '12,8']; // percentage or fixed

        $fields['trade_datetime'] = ['type' => 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP'];
        $fields['status'] = ['type' => 'VARCHAR','constraint' => 10];

        $this->dbforge->add_field($fields);
        $this->dbforge->add_key('id', true);
        $this->dbforge->add_key('user_id', true);
        $this->dbforge->add_key('bid_id', true);
        $this->dbforge->add_key('sell_id', true);

        $this->dbforge->create_table('trades_NLG', true);

        //Trades_gts
        $fields = [];
        $fields['id'] = ['type' => 'INT','constraint' => 11,'auto_increment' => true];
        $fields['user_id'] = ['type' => 'INT','constraint' => 11];
        $fields['bid_id'] = ['type' => 'INT','constraint' => 11];
        $fields['sell_id'] = ['type' => 'INT','constraint' => 11];
        $fields['price'] = ['type' => 'DECIMAL','constraint' => '16,8'];
        $fields['amount'] = ['type' => 'DECIMAL','constraint' => '16,8'];
        $fields['total'] = ['type' => 'DECIMAL','constraint' => '16,8'];
        $fields['fee'] = ['type' => 'DECIMAL','constraint' => '12,8']; // percentage or fixed

        $fields['trade_datetime'] = ['type' => 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP'];
        $fields['status'] = ['type' => 'VARCHAR','constraint' => 10];

        $this->dbforge->add_field($fields);
        $this->dbforge->add_key('id', true);
        $this->dbforge->add_key('user_id', true);
        $this->dbforge->add_key('bid_id', true);
        $this->dbforge->add_key('sell_id', true);
        $this->dbforge->create_table('trades_GTS', true);

        // deposits
        $fields = [];
        $fields['id'] = ['type' => 'INT','constraint' => 11,'auto_increment' => true];
        $fields['user_id'] = ['type' => 'INT','constraint' => 11];
        $fields['EUR'] = ['type' => 'DECIMAL','constraint' => '18,8'];
        $fields['GTS'] = ['type' => 'DECIMAL','constraint' => '18,8'];
        $fields['NLG'] = ['type' => 'DECIMAL','constraint' => '18,8'];
        $fields['transaction'] = ['type' => 'VARCHAR','constraint' => 120];
        $fields['verified'] = ['type' => 'VARCHAR','constraint' => 10];
        $fields['deposit_date'] = ['type' => 'DATE'];
        $fields['last_update'] = ['type' => 'timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'];

        $this->dbforge->add_field($fields);
        $this->dbforge->add_key('id', true);
        $this->dbforge->add_key('user_id', true);
        $this->dbforge->create_table('deposits', true);

        //withdrawal
        $fields = [];
        $fields['id'] = ['type' => 'INT','constraint' => 11,'auto_increment' => true];
        $fields['user_id'] = ['type' => 'INT','constraint' => 11];
        $fields['EUR'] = ['type' => 'DECIMAL','constraint' => '18,8'];
        $fields['GTS'] = ['type' => 'DECIMAL','constraint' => '18,8'];
        $fields['NLG'] = ['type' => 'DECIMAL','constraint' => '18,8'];
        $fields['transaction'] = ['type' => 'VARCHAR','constraint' => 120];
        $fields['token'] = ['type' => 'VARCHAR','constraint' => 25];
        $fields['status'] = ['type' => 'VARCHAR','constraint' => 10];
        $fields['verified'] = ['type' => 'VARCHAR','constraint' => 10];
        $fields['withdrawal_date'] = ['type' => 'DATE'];
        $fields['last_update'] = ['type' => 'timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'];

        $this->dbforge->add_field($fields);
        $this->dbforge->add_key('id', true);
        $this->dbforge->add_key('user_id', true);
        $this->dbforge->create_table('withdrawal', true);

        // bank_deposit
        $fields = [];
        $fields['id'] = ['type' => 'INT','constraint' => 11,'auto_increment' => true];
        $fields['user_id'] = ['type' => 'INT','constraint' => 11];
        $fields['EUR'] = ['type' => 'DECIMAL','constraint' => '18,8'];
        $fields['deposit_code'] = ['type' => 'VARCHAR','constraint' => 10];
        $fields['status'] = ['type' => 'VARCHAR','constraint' => 10];
        $fields['verified'] = ['type' => 'VARCHAR','constraint' => 10];
        $fields['deposit_date'] = ['type' => 'DATE'];
        $fields['last_update'] = ['type' => 'timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'];

        $this->dbforge->add_field($fields);
        $this->dbforge->add_key('id', true);
        $this->dbforge->add_key('user_id', true);
        $this->dbforge->create_table('bank_deposit', true);

        
        //order_NLG

        $fields = [];
        $fields['id'] = ['type' => 'INT','constraint' => 11,'auto_increment' => true];
        $fields['user_id'] = ['type' => 'INT','constraint' => 11];
        $fields['type'] = ['type' => 'VARCHAR','constraint' => 10]; ///limit, stop
        $fields['bidsell'] = ['type' => 'VARCHAR','constraint' => 10]; ///bid, sell
        $fields['EUR'] = ['type' => 'DECIMAL','constraint' => '18,8'];
        $fields['price'] = ['type' => 'DECIMAL','constraint' => '16,8'];

        $fields['amount'] = ['type' => 'DECIMAL','constraint' => '16,8'];
        $fields['total'] = ['type' => 'DECIMAL','constraint' => '16,8'];
        $fields['fee'] = ['type' => 'DECIMAL','constraint' => '12,8']; // percentage or fixed

        $fields['order_date'] = ['type' => 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP'];
        $fields['status'] = ['type' => 'VARCHAR','constraint' => 10];
        $fields['stoporder_price'] = ['type' => 'DECIMAL','constraint' => '16,8'];
        $fields['trigger_price'] = ['type' => 'DECIMAL','constraint' => '16,8'];

        $this->dbforge->add_field($fields);
        $this->dbforge->add_key('id', true);
        $this->dbforge->add_key('user_id', true);
        $this->dbforge->add_key('bidsell', true);
        $this->dbforge->create_table('order_NLG', true);
        

        //order_GTS
        $fields = [];
        $fields['id'] = ['type' => 'INT','constraint' => 11,'auto_increment' => true];
        $fields['user_id'] = ['type' => 'INT','constraint' => 11];
        $fields['type'] = ['type' => 'VARCHAR','constraint' => 10]; ///limit, stop
        $fields['bidsell'] = ['type' => 'VARCHAR','constraint' => 10]; ///bid, sell
        $fields['GTS'] = ['type' => 'DECIMAL','constraint' => '18,8'];
        $fields['price'] = ['type' => 'DECIMAL','constraint' => '16,8'];
        $fields['amount'] = ['type' => 'DECIMAL','constraint' => '16,8'];
        $fields['total'] = ['type' => 'DECIMAL','constraint' => '16,8'];
        $fields['fee'] = ['type' => 'DECIMAL','constraint' => '12,8']; // percentage or fixed
        $fields['order_date'] = ['type' => 'TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP'];
        $fields['status'] = ['type' => 'VARCHAR','constraint' => 10];
        $fields['stoporder_price'] = ['type' => 'DECIMAL','constraint' => '16,8'];
        $fields['trigger_price'] = ['type' => 'DECIMAL','constraint' => '16,8'];
        $this->dbforge->add_field($fields);
        $this->dbforge->add_key('id', true);
        $this->dbforge->add_key('user_id', true);
        $this->dbforge->add_key('bidsell', true);
        $this->dbforge->create_table('order_GTS', true);

//        CREATE TABLE `coin_order` (
//  `trade_id` int(11) NOT NULL AUTO_INCREMENT,
//  `userId` int(11) NOT NULL,
//  `firstCurrency` varchar(111) NOT NULL,
//  `secondCurrency` varchar(111) NOT NULL,
//  `Amount` text NOT NULL,
//  `Price` double NOT NULL,
//  `Type` text NOT NULL,
//  `Process` varchar(111) NOT NULL DEFAULT '0',
//  `Fee` text NOT NULL,
//  `Total` text NOT NULL,
//  `orderDate` date NOT NULL,
//  `orderTime` time NOT NULL,
//  `datetime` datetime NOT NULL,
//  `pair` varchar(111) NOT NULL,
//  `sm_token` varchar(100) NOT NULL,
//  `sm_status` int(11) NOT NULL COMMENT '0-none, 1-buy, 2-sell, 3-both',
//  `status` varchar(111) NOT NULL,
//  `stoporderprice` float NOT NULL,
//  `trigger_price` float NOT NULL,
//  `tradetime` datetime NOT NULL,
//  PRIMARY KEY (`trade_id`)
//) ENGINE=MyISAM AUTO_INCREMENT=140 DEFAULT CHARSET=latin1;

    }

    public function down() {
        $this->dbforge->drop_table('user_bank_details');
        $this->dbforge->drop_table('deposits');
        $this->dbforge->drop_table('withdrawal');
        $this->dbforge->drop_table('bank_deposit');
        $this->dbforge->drop_table('addresses');
        $this->dbforge->drop_table('commission');
        $this->dbforge->drop_table('trades_NLG');
        $this->dbforge->drop_table('trades_GTS');
        $this->dbforge->drop_table('order_NLG');
        $this->dbforge->drop_table('order_GTS');
    }

}

/* End of file 003_Bank.php */
/* Location: ./application/migrations/003_Bank.php */