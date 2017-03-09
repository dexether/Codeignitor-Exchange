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

        // insert users data
        $sql = "INSERT INTO `users` (`id`, `salt`, `client_id`, `firstname`, `lastname`, `username`, `email`, `password`, `profilepicture`, `account_no`, `identity_no`, `cellno`, `alt_cellno`, `street1`, `street2`, `city`, `country`, `country1`, `state`, `state1`, `zipcode`, `recaptcha`, `postal_line1`, `postal_line2`, `postal_city`, `postal_state`, `postal_country`, `postal_code`, `apiKey`, `apiAccessKey`, `keyname`, `dateofreg`, `modified_date`, `timeofreg`, `status`, `loginstatus`, `activated_date`, `userip`, `userbrowser`, `randcode`, `secret`, `onecode`, `url`, `verfiyStatus`, `user_wallet`, `destination_tag`, `role`) VALUES
				(1, '9ec685c3b57064e248f9a867be41dfcb', 0, 'PHP', 'ARTS', '', 'php.power.arts@gmail.com', '$2y$10$yDhga3/pPEaOXDOZVRmUoOEGPwoBB5FaS5phA8ZTL8ECjVPBvedPi', '', '', 0, 0, 0, '', '', '', 0, '', NULL, '', 0, '9v5s9n', '', '', '', '', '', 0, '', '', '', '2017-03-09', '2017-03-09 14:03:16', '00:00:00', 'active', '', '0000-00-00', '127.0.0.1', 'Chrome', 'disable', '', '', '', 'unverified', '', '', 'member'),
				(2, '99b4f40cd1eff753c8bec9092d0a5f60', 0, 'Rog', 'Burger', '', 'rog.burgerman@gmail.com', '$2y$10$tfrZI4l.EW/33GxEqjMkI.YKHpzTxP4kx.Zf3sSRSSS8CezXhb3Sy', '', '', 0, 0, 0, '', '', '', 0, '', NULL, '', 0, '496ytg', '', '', '', '', '', 0, '', '', '', '2017-03-09', '2017-03-09 13:32:26', '00:00:00', 'active', '', '0000-00-00', '127.0.0.1', 'Chrome', 'disable', '', '', '', 'verified', '', '', 'superadmin'),
				(3, '0cb73ddba0c026828d7e8350f54de107', 0, 'Admin', 'Rog', '', 'admin@admin.com', '$2y$10$JFICDF4pWd6TPYldB9uZxOaFChd/SH/BSuCfdaI7T7KxI2oso.9Wy', '', '', 0, 0, 0, '', '', '', 0, '', NULL, '', 0, '496ytg', '', '', '', '', '', 0, '', '', '', '2017-03-09', '2017-03-09 13:32:32', '00:00:00', 'active', '', '0000-00-00', '127.0.0.1', 'Chrome', 'disable', '', '', '', 'verified', '', '', 'admin')";
        $this->db->query($sql);
	}

	public function down() {
		$this->dbforge->drop_table('users');
	}

}

/* End of file base.php */
/* Location: ./application/migrations/base.php */