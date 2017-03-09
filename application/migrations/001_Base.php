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
		$fields['modified_date timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'];
		$fields['status'] => ['type' => 'VARCHAR','constraint' => 20];
		$fields['loginstatus'] => ['type' => 'VARCHAR','constraint' => 111];
		$fields['activated_date'] => ['type' => 'DATE'];
		$fields['userip'] => ['type' => 'VARCHAR','constraint' => 50];
		$fields['userbrowser'] => ['type' => 'VARCHAR','constraint' => 200];
		$fields['randcode'] => ['type' => 'VARCHAR','constraint' => 200];
		$fields['secret'] => ['type' => 'VARCHAR','constraint' => 200];
		$fields['onecode'] => ['type' => 'VARCHAR','constraint' => 200];
		$fields['url'] => ['type' => 'VARCHAR','constraint' => 200];
		$fields['verfiyStatus'] => ['type' => 'VARCHAR','constraint' => 90];
		$fields['user_wallet'] => ['type' => 'VARCHAR','constraint' => 255];
		$fields['destination_tag'] => ['type' => 'VARCHAR','constraint' => 150];
		$fields['role'] => ['type' => 'VARCHAR','constraint' => 50];
        $this->dbforge->add_field($fields);
        $this->dbforge->add_key('id', true);
        $this->dbforge->create_table('users', true);
	}

	public function down() {
		
	}

}

/* End of file base.php */
/* Location: ./application/migrations/base.php */