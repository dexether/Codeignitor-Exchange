<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Base extends CI_Migration {

	public function __construct()
	{
		$this->load->dbforge();
		$this->load->database();
	}

	public function up() {

		// users
		$fields = [];
		$fields['id'] = ['type' => 'INT','constraint' => 20,'auto_increment' => true];
		$fields['client_id'] = ['type' => 'INT','constraint' => 11];
		$fields['firstname'] = ['type' => 'VARCHAR','constraint' => 255];
		$fields['lastname'] = ['type' => 'VARCHAR','constraint' => 255];
		$fields['username'] = ['type' => 'VARCHAR','constraint' => 50];
		$fields['email'] = ['type' => 'VARCHAR','constraint' => 50];
		$fields['password'] = ['type' => 'VARCHAR','constraint' => 255];
		$fields['profilepicture'] = ['type' => 'VARCHAR','constraint' => 255];
		$fields['account_no'] = ['type' => 'VARCHAR','constraint' => 200];
		$fields['identity_no'] = ['type' => 'BIGINT','constraint' => 25];
		$fields['cellno'] = ['type' => 'BIGINT','constraint' => 100];
		$fields['alt_cellno'] = ['type' => 'BIGINT','constraint' => 100];
		$fields['street1'] = ['type' => 'VARCHAR','constraint' => 200];
		$fields['street2'] = ['type' => 'VARCHAR','constraint' => 200];
		$fields['city'] = ['type' => 'VARCHAR','constraint' => 200];
		$fields['country'] = ['type' => 'INT','constraint' => 11];
		$fields['country1'] = ['type' => 'VARCHAR','constraint' => 200];
		$fields['state'] = ['type' => 'INT','constraint' => 11,'DEFAULT' => NULL];
		$fields['state1'] = ['type' => 'VARCHAR','constraint' => 100];
		$fields['zipcode'] = ['type' => 'INT','constraint' => 11];
		$fields['recaptcha'] = ['type' => 'VARCHAR','constraint' => 250];
		$fields['postal_line1'] = ['type' => 'VARCHAR','constraint' => 500];
		$fields['postal_line2'] = ['type' => 'VARCHAR','constraint' => 500];
		$fields['postal_city'] = ['type' => 'VARCHAR','constraint' => 200];
		$fields['postal_state'] = ['type' => 'VARCHAR','constraint' => 500];
		$fields['postal_country'] = ['type' => 'VARCHAR','constraint' => 500];
		$fields['postal_code'] = ['type' => 'INT','constraint' => 11];
		$fields['apiKey'] = ['type' => 'INT','constraint' => 11];
		$fields['apiAccessKey'] = ['type' => 'VARCHAR','constraint' => 111];
		$fields['keyname'] = ['type' => 'VARCHAR','constraint' => 111];
		$fields['dateofreg'] = ['type' => 'DATE'];
		$fields['modified_date'] = ['type' => 'timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'];
		$fields['status'] = ['type' => 'VARCHAR','constraint' => 20];
		$fields['loginstatus'] = ['type' => 'VARCHAR','constraint' => 111];
		$fields['activated_date'] = ['type' => 'DATE'];
		$fields['timeofreg'] = ['type' => 'timestamp','DEFAULT' => 0];
		$fields['userip'] = ['type' => 'VARCHAR','constraint' => 50];
		$fields['userbrowser'] = ['type' => 'VARCHAR','constraint' => 200];
		$fields['randcode'] = ['type' => 'VARCHAR','constraint' => 200];
		$fields['secret'] = ['type' => 'VARCHAR','constraint' => 200];
		$fields['onecode'] = ['type' => 'VARCHAR','constraint' => 200];
		$fields['url'] = ['type' => 'VARCHAR','constraint' => 200];
		$fields['verfiyStatus'] = ['type' => 'ENUM("verified","unverified")','NULL' => false,'default' => 'unverified'];
		$fields['user_wallet'] = ['type' => 'VARCHAR','constraint' => 255];
		$fields['salt'] = ['type' => 'VARCHAR','constraint' => 255];
		$fields['destination_tag'] = ['type' => 'VARCHAR','constraint' => 150];
		$fields['role'] = ['type' => 'VARCHAR','constraint' => 50];
		$this->dbforge->add_field($fields);
		$this->dbforge->add_key('id', true);
		$this->dbforge->create_table('users', true);

        // insert users data
		$users = array(
			array('id' => '1','client_id' => '0','firstname' => 'PHP','lastname' => 'ARTS','username' => '','email' => 'php.power.arts@gmail.com','password' => '$2y$10/pPEaOXDOZVRmUoOEGPwoBB5FaS5phA8ZTL8ECjVPBvedPi','profilepicture' => '','account_no' => '','identity_no' => '0','cellno' => '0','alt_cellno' => '0','street1' => '','street2' => '','city' => '','country' => '0','country1' => '','state' => NULL,'state1' => '','zipcode' => '0','recaptcha' => '9v5s9n','postal_line1' => '','postal_line2' => '','postal_city' => '','postal_state' => '','postal_country' => '','postal_code' => '0','apiKey' => '0','apiAccessKey' => '','keyname' => '','dateofreg' => '2017-03-09','modified_date' => '2017-03-09 14:03:16','status' => 'active','loginstatus' => '','activated_date' => '0000-00-00','timeofreg' => '0000-00-00 00:00:00','userip' => '127.0.0.1','userbrowser' => 'Chrome','randcode' => 'disable','secret' => '','onecode' => '','url' => '','verfiyStatus' => 'unverified','user_wallet' => '','salt' => '9ec685c3b57064e248f9a867be41dfcb','destination_tag' => '','role' => 'member'),
			array('id' => '2','client_id' => '0','firstname' => 'Rog','lastname' => 'Burger','username' => '','email' => 'rog.burgerman@gmail.com','password' => '$2y$10.EW/33GxEqjMkI.YKHpzTxP4kx.Zf3sSRSSS8CezXhb3Sy','profilepicture' => '','account_no' => '','identity_no' => '0','cellno' => '0','alt_cellno' => '0','street1' => '','street2' => '','city' => '','country' => '0','country1' => '','state' => NULL,'state1' => '','zipcode' => '0','recaptcha' => '496ytg','postal_line1' => '','postal_line2' => '','postal_city' => '','postal_state' => '','postal_country' => '','postal_code' => '0','apiKey' => '0','apiAccessKey' => '','keyname' => '','dateofreg' => '2017-03-09','modified_date' => '2017-03-09 13:32:26','status' => 'active','loginstatus' => '','activated_date' => '0000-00-00','timeofreg' => '0000-00-00 00:00:00','userip' => '127.0.0.1','userbrowser' => 'Chrome','randcode' => 'disable','secret' => '','onecode' => '','url' => '','verfiyStatus' => 'verified','user_wallet' => '','salt' => '99b4f40cd1eff753c8bec9092d0a5f60','destination_tag' => '','role' => 'superadmin'),
			array('id' => '3','client_id' => '0','firstname' => 'Admin','lastname' => 'Rog','username' => '','email' => 'admin@admin.com','password' => '$2y$10/SH/BSuCfdaI7T7KxI2oso.9Wy','profilepicture' => '','account_no' => '','identity_no' => '0','cellno' => '0','alt_cellno' => '0','street1' => '','street2' => '','city' => '','country' => '0','country1' => '','state' => NULL,'state1' => '','zipcode' => '0','recaptcha' => '496ytg','postal_line1' => '','postal_line2' => '','postal_city' => '','postal_state' => '','postal_country' => '','postal_code' => '0','apiKey' => '0','apiAccessKey' => '','keyname' => '','dateofreg' => '2017-03-09','modified_date' => '2017-03-09 13:32:32','status' => 'active','loginstatus' => '','activated_date' => '0000-00-00','timeofreg' => '0000-00-00 00:00:00','userip' => '127.0.0.1','userbrowser' => 'Chrome','randcode' => 'disable','secret' => '','onecode' => '','url' => '','verfiyStatus' => 'verified','user_wallet' => '','salt' => '0cb73ddba0c026828d7e8350f54de107','destination_tag' => '','role' => 'admin')
			);
		$this->db->insert_batch('users',$users);

	    // user_verification
		$fields = [];
		$fields['id'] = ['type' => 'INT','constraint'=>'11','auto_increment'=>true];
		$fields['user_id'] = ['type' => 'INT','constraint'=>'11'];
		$fields['verifier'] = ['type' => 'VARCHAR','constraint'=>'200'];
		$fields['verification_status'] = ['type' => 'ENUM("verified","unverified")','NULL' => false,'default' => 'unverified'];
		$fields['created_date'] = ['type' => 'DATE'];
		$this->dbforge->add_field($fields);
		$this->dbforge->add_key('id', true);
		$this->dbforge->create_table('user_verification', true);
		$sql = "CREATE INDEX verifier ON user_verification(verifier)";
		$this->db->query($sql);
	}

	public function down() {
		$this->dbforge->drop_table('users');
		$this->dbforge->drop_table('user_verification');
	}

}

/* End of file base.php */
/* Location: ./application/migrations/base.php */