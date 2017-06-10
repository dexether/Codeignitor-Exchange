<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Mdl_user extends CI_Model
{

    public $table = "users";

    public function __construct()
    {
        parent::__construct();
    }

    public function is_user($email = null)
    {
        if (!is_null($email)) {
            $this->db->where('email', $email);
            $query = $this->db->get('users');
            if ($query->num_rows() >= 1) {
                return true;
            } else {
                return false;
            }
        }
    }


    function get_userstatus($user_id)
    {
        $this->db->where('id', $user_id);
        $query = $this->db->get('users');
        if ($query->num_rows() == 1) {
            $row = $query->row();
            return $row->randcode;
        } else {
            return false;
        }
    }

    function get_username($user_id)
    {
        $this->db->where('user_id', $user_id);
        $query = $this->db->get('userdetails');
        if ($query->num_rows()) {
            $row = $query->row();
            return $row->username;
        } else {
            return false;
        }
    }

    function check_login()
    {
        $res_loguser = $this->db->query("SELECT id, firstname, role, salt, randcode, secret, status, password FROM `users` where email=?", array($this->input->post('email', true)));

        if ($res_loguser->num_rows() == 1) {
            $row = $res_loguser->row();

            if ($row->status === 'deactive') {
                return 'deactive';
            }

            if (password_verify($this->input->post('password', true), $row->password) === true) {

                if ($row->randcode == "enable") {
                    $show_picture = '/tools/show_profile_picture/';
                    $profilepicture = $row->profilepicture;
                    $profile_picture = (!empty(trim($profilepicture))?$show_picture . $row->profilepicture: FALSE);

                    //save some session data, so we know he is already logged in.
                    $sessiondata = array(
                        'pending_user_id' => $row->id,
                        'secret' => $row->secret,
                        'role' => 'empty',
                        'profile_picture' => $profile_picture

                    );
                    $this->session->set_userdata($sessiondata);

                    return 'enable';
                } 
                    
                $sessiondata = array(
                    'user_id' => $row->id,
                    'firstname' => $row->firstname,
                    'tfa' => $row->randcode,
                    'randcode' => $row->secret,
                    'status' => $row->status,
                    'salt' => $row->salt,
                    'role' => $row->role
                );
                $this->session->set_userdata($sessiondata);

                // send email
                $data = ['username' => $row->firstname];
                $message = $this->load->view('template/emails/v_success_login', $data, TRUE);
                $this->common_mail($this->input->post('email'), 'Login success', $message);
                return 'success';
                
            
            } else {
                return 'invalid';
            }
        } else {
            return "invalid";
        }
    }


    public function set_sesdata() 
    {
        $res_loguser = $this->db->query("SELECT id, firstname, role, salt, randcode, secret, status, password FROM `users` where id=?", array($this->session->pending_user_id));
        $row = $res_loguser->row();
        $this->session->pending_user_id = NULL;

        $tfa = ($row->randcode==='enable'?TRUE:FALSE);
        $sessiondata = array(
            'user_id' => $row->id,
            'firstname' => $row->firstname,
            'tfa' => $tfa,
            'secret' => $row->secret,
            'status' => $row->status,
            'salt' => $row->salt,
            'role' => $row->role
        );

        $verification_trade = $this->db->query("SELECT `verification_status` FROM `user_verification` WHERE `user_id` = {$sessiondata['user_id']}");
        $row = $verification_trade->row();
        if ($row) {
            $sessiondata['trade_verification'] = ( $row->verification_status === 'verified'? 'verified': 'pending' );
        } else {
            $sessiondata['trade_verification'] = 'open';
        }

        $verification_bank = $this->db->query("SELECT `status` FROM `user_bank_details` WHERE `user_id` = {$sessiondata['user_id']}");
        $row = $verification_trade->row();
        if ($row) {
            $sessiondata['bank_verification'] = ( $row->user_bank_details === 1? 'verified': 'pending' );
        } else {
            $sessiondata['bank_verification'] = 'open';
        }

        $this->session->set_userdata([]);
        $this->session->set_userdata($sessiondata);
        return;
    }

    //TODO - make sure SALT is unique, its use to obscure user_id
    public function add_user()
    {
        $query = $this->db->query('SELECT `users_num` FROM `monthly_registrations` WHERE `month-year` = ?', [date('Y-m')]);
        if (!$query->row()) {
            $this->db->query('INSERT INTO `monthly_registrations` (`month-year`, `users_num`) VALUES (?, ?);', [date('Y-m'), 1]);
        } else {
            $increment = (int)$query->row()->users_num;
            $increment++;
            $this->db->query('UPDATE `monthly_registrations` SET `users_num`=? WHERE `month-year`=?',[$increment, date('Y-m')]);
        }

        $dateofreg = date('Y-m-d');
        $user_ip = $this->input->ip_address();
        $this->load->library('user_agent');
        $user_browser = $this->agent->browser();
        $data = array(
            'firstname' => $this->input->post('firstname', true),
            'lastname' => $this->input->post('lastname', true),
            'email' => $this->input->post('email', true),
            'password' => password_hash($this->input->post('password1', true), PASSWORD_DEFAULT),
            'salt' => md5(random_string()),
            'dateofreg' => $dateofreg,
            'userip' => $user_ip,
            'userbrowser' => $user_browser,
            'status' => 'deactive',
            'randcode' => 'disable',
            'recaptcha' => $this->input->post('recaptcha', true),
            'verfiyStatus' => 'unverified',
            'role' => 'member'
        );
        $this->db->insert('users', $data);
        $last_userinsid = $this->db->insert_id();
        if ($last_userinsid != "") {
            $verifydata = array(
                'user_id' => $last_userinsid,
                'verification_trade' => 'unverified',
                'verification_status' => 'unverified',
                'verifier' => random_string(25, false)
            );
            $this->db->insert('user_verification', $verifydata);
            $email = $this->input->post('email', true);

            $email_subject1 = 'Please confirm your registration';
            $email_content1 = $this->load->view('template/emails/v_registration_success', null, true);
            $link = base_url() . 'user/user_verification/' . $verifydata['verifier'];
            $a = array('##USERNAME##' => $this->input->post('firstname', true), '##USERID##' => base64_encode($last_userinsid), '##CLIENTID##' => $email, '##PASSWORD##' => $this->input->post('password1'), '##FROM_EMAIL##' => 'exchange@guldentrader.com', '##COMPANYNAME##' => 'exchange.guldentrader.com', '##EMAIL##' => $email, '##SITEURL##' => base_url(), '##ADMIN_EMAIL##' => 'exchange@guldentrader.com', '##LINK##' => $link);
            $email_content = strtr($email_content1, $a);
            $this->common_mail($email, $email_subject1, $email_content);
            return true;
        }

    }



    function common_mail($tomail = null, $email_subject = null, $email_content = null)
    {
        $content = $this->load->view('template/emails/v_header', [], TRUE);
        $content .= $email_content;
        $content .= $this->load->view('template/emails/v_footer', [], TRUE);
        $this->load->library('email');
        $config['protocol'] = "smtp";
        $config['smtp_host'] = APP_SMTP_HOST;
        $config['smtp_port'] = APP_SMTP_PORT;
        $config['smtp_user'] = APP_SMTP_USER;
        $config['smtp_pass'] = APP_SMTP_PASS;
        $config['charset'] = APP_CHARSET;
        $config['mailtype'] = "html";
        $config['useragent'] = "guldentrader.com";
        $config['newline'] = "\r\n";
        $this->email->initialize($config);
        $this->email->from(APP_SMTP_USER, 'Guldentrader Exchange');
        $this->email->to($tomail);
        $this->email->reply_to(APP_SMTP_USER, APP_SMTP_HOST);
        $this->email->subject($email_subject);
        $this->email->message($content);
        $send = $this->email->send();
        if ($send) {
            return true;
        } else {
            //show_error($this->email->print_debugger());
        }
    }

    function check_login_details()
    {
        $login_date = date('Y-m-d');
        $login_time = date("h:i:s");
        $datetime = $login_date . " " . $login_time;
        $clientid = $this->input->post('clientid');
        $password = $this->input->post('password');

        $encpassword = password_hash($password, PASSWORD_DEFAULT);

        $res_loguser = $this->db->query("SELECT * FROM `users` where (client_id='$clientid' OR email='$clientid') AND password='$encpassword' ");

        $row = $res_loguser->row();

        if ($row) {

            $db_user_id = $row->user_id;
            $db_email = $row->emailid;

            $db_client_id = $row->client_id;
            $firstname = $row->firstname;
            $lastname = $row->lastname;
            $db_name = $firstname . " " . $lastname;
            $db_name1 = $row->firstname;
            $username = $row->username;
            $db_status = $row->status;

            if ($db_status == "active") {
                // set session
                $sessiondata = array(
                    'customer_email_id' => $db_email,
                    'customer_user_id' => $db_user_id,
                    'customer_client_id' => $db_client_id,
                    'customer_name' => $db_name,
                    'user_name' => $db_name1
                );

                $this->session->set_userdata($sessiondata);
                if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
                    $ip = $_SERVER['HTTP_CLIENT_IP'];
                } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
                    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
                } else {
                    $ip = $_SERVER['REMOTE_ADDR'];
                }

                $this->load->library('user_agent');
                $user_browser = $this->agent->browser();
                $historydata = array(
                    'userId' => $db_user_id,
                    'ipAddress' => $ip,
                    'Browser' => $user_browser,
                    'Action' => "Logged in",
                    'datetime' => $datetime
                );
                $this->db->insert('history', $historydata);
                $data['loginstatus'] = "1";
                $this->db->where('id', $db_user_id);
                $this->db->update($this->table, $data);

                $this->db->where('id', 1);
                $query = $this->db->get('site_config');
                if ($query->num_rows() == 1) {
                    $row = $query->row();
                    $admin_email = $row->email_id;
                    $companyname = $row->company_name;
                    $siteurl = $row->siteurl;
                }

                $this->db->where('userId', $db_user_id);
                $query = $this->db->get('history');
                if ($query->num_rows() == 1) {
                    $row = $query->row();
                    $datetime = strtotime('d-m-Y h:i:s', $row->datetime);

                }

                if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
                    $ip = $_SERVER['HTTP_CLIENT_IP'];
                } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
                    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
                } else {
                    $ip = $_SERVER['REMOTE_ADDR'];
                }

                return "active";
            }
            if ($db_status == "deactive") {
                return "deactive";
            }
        } else {
            return "invalid";
        }
    }

    function verification($verifier)
    {

        $where = array('verifier' => xss_clean($verifier), 'verification_status' => "unverified");
        $this->db->where($where);
        $query = $this->db->get('user_verification');

        if ($query->num_rows() == 1) {
            $cur_date = date('Y-m-d');
            $row = $query->row();
            //update user
            $data = array('status' => "active", 'verfiyStatus' => "verified", 'activated_date' => $cur_date);
            $this->db->where('id', $row->user_id);
            $this->db->update('users', $data);

            //update
            $this->db->where('user_id', $row->user_id);
            $this->db->update('user_verification', array('verification_status' => 'verified'));

            $this->db->query("INSERT INTO `balance` (`user_id`, `NLG`, `EUR`, `GTS`, `pending_EUR`, `pending_NLG`, `pending_GTS`) VALUES (?, '0', '0', '0', '0', '0', '0');", [$row->user_id]);

            return "ok";
        } else {
            return "nok";
        }
    }

    function profile_update($data, $id)
    {
        $this->db->where('id', $id);
        return $this->db->update('users', $data);
    }

    public function profile_details()
    {
        $id = $this->session->user_id;
        $this->db->where('id', $id);
        $query = $this->db->get('users');
        if ($query->num_rows() == 1) {
            return $query->row();
        }
    }

    public function get_by_profilepicture_id($profilepicture)
    {
        $this->db->where('profilepicture', $profilepicture);
        $res = $this->db->get('users');
        return $res ? $res->row() : false;
    }

    function check_tfa()
    {
        //get TFA code from user;
        //use session user id
        require_once APPPATH . 'libraries/google/GoogleAuthenticator.php';
        $ga = new PHPGangsta_GoogleAuthenticator();

        $secret = $this->session->secret;
        return  $ga->verifyCode($secret, $this->input->post('tfacode'),2);
    }

    function get_userdetails($user_id)
	{
		$this->db->where('id',$user_id);
		$query=$this->db->get('users');
		if($query->num_rows() >= 1){
		   return $query->row();
		}else{
		   return false;
		}
	}

    function enable_tfa()
    {
        require_once APPPATH . 'libraries/google/GoogleAuthenticator.php';
        $ga = new PHPGangsta_GoogleAuthenticator();
        $customer_user_id = $this->session->user_id;
        $onecode = $this->input->post("one_code");
        $secret_code = $this->input->post("secret_code");
        //$onecode = "867345";
        //$secret_code = "XW7GPIMHICSKWL2P";$discrepancy = 1
        $code = $ga->verifyCode($secret_code, $onecode, $discrepancy = 1);
        $user_details = $this->get_userstatus($customer_user_id);

        //dump_exit($code);

        if ($user_details != "enable") {
            if ($code == 1) {
                $this->db->where('id', $customer_user_id);
                $data = array(
                    'secret' => $secret_code,
                    'onecode' => $onecode,
                    //'url'     => $url,
                    'randcode' => "enable"
                );
                $this->db->update($this->table, $data);

                $userdetails = $this->get_userdetails($customer_user_id);
                if ($userdetails) {
                    $vars['username'] = $userdetails->username;
                    $vars['secret'] = $userdetails->secret;
                    $vars['email'] = $userdetails->email;
                    $vars['status'] = 'Enable';
                } else {
                    $vars['username'] = '';
                    $vars['secret'] = '';
                    $vars['email'] = '';
                    $vars['status'] = '';
                }

                $message = $this->load->view('template/emails/v_tfa_secret_code_for_gulden',$vars,true);
                $this->common_mail($userdetails->email,'TFA Enabled',$message);
                return "Enable";
            } else {
                return 0;
            }
        } else {
            if ($code == 1) {
                $this->db->where('id', $customer_user_id);
                $data = array(
                    'secret' => $secret_code,
                    'onecode' => $onecode,
                    //'url'     => $url,
                    'randcode' => "disable"
                );
                $this->db->update($this->table, $data);
                $userdetails = $this->get_userdetails($customer_user_id);
                if ($userdetails) {
                    $username = $userdetails->username;
                    $secret = $userdetails->secret;
                    $email = $userdetails->email;
                    $status = 'Disable';
                } else {
                    $username = "";
                    $secret = "";
                    $status = '';
                    $email = '';
                }
                /*    Get Admin Details Start    */
                $this->db->where('id', 1);
                $admin_email = APP_ADMIN_EMAIL;
                $companyname = APP_COMPANY_NAME;
                $siteurl = site_url();

                /*  GET EMAIL TEMPLATE  START */
                $dis_get_email_info = $this->load->view('template/emails/v_tfa_secret_code_for_gulden',[],true);
                $email_from1 = $dis_get_email_info->from_id;
                $email_subject1 = '';
                $email_content1 = $dis_get_email_info->message;
                $a = array('##USERNAME##' => $username, '##STATUS##' => $status, '##SECRET##' => $secret, '##FROM_EMAIL##' => $admin_email, '##COMPANYNAME##' => $companyname, '##SITEURL##' => $siteurl, '##ADMIN_EMAIL##' => $admin_email);
                $email_from = strtr($email_from1, $a);
                $email_content = strtr($email_content1, $a);
                /*  GET EMAIL TEMPLATE  END */
                $this->common_mail($admin_email, $companyname, $email, $email_subject1, $email_content);
                return "disable";
            } else {
                return "0";
            }
        }

    }

    function get_tfacode()
    {
        require_once APPPATH . 'libraries/google/GoogleAuthenticator.php';
        $ga = new PHPGangsta_GoogleAuthenticator();
        $data['secret'] = $ga->createSecret();
        $data['qrCodeUrl'] = $ga->getQRCodeGoogleUrl('gulden', $data['secret']);
        $data['oneCode'] = $ga->getCode($data['secret']);
        return $data;
    }

    function disable_tfa()
    {
        $customer_user_id = $this->session->userdata('user_id');
        $data = array('randcode' => 'disable');
        $this->db->where('id', $customer_user_id);
        $this->db->update('users', $data);
        return true;
    }

    function user_check_tfa()
    {
        $customer_user_id = $this->session->userdata('user_id');
        $this->db->where('id', $customer_user_id);
        $query = $this->db->get('users');
        if ($query->num_rows() >= 1) {
            $row = $query->row();
            return $row->randcode;
        } else {
            return false;
        }
    }

    function get_secret($clientid)
    {
        $this->db->where('id', $clientid);
        $query = $this->db->get('users');
        if ($query->num_rows() == 1) {
            $row = $query->row();
            return $row->secret;
        }
    }


    /**
     * @return one row if user_id eist else return all
     */
    public function get($user_id = 0)
    {
        $row = $this->db->get_where($this->table, ['id' => $user_id])->row();
        return $row;
    }

    public function delete($primary_key)
    {
        $this->db->delete($this->table, ['id' => $primary_key]);
        $this->db->delete('user_verification', ['user_id' => $primary_key]);
    }

    function forgot_passmail()
    {
        $email = $this->input->post('forgetemail');
        $this->db->where('email', $email);
        $query_pass = $this->db->get($this->table);

        if ($query_pass->num_rows() == 1) {
            $row_pass = $query_pass->row();
            $getuser_id = $row_pass->id;
            $firstname = $row_pass->firstname;
            $lastname = $row_pass->lastname;
            $password = $this->generatepassword();
            $encpassword = password_hash($password, PASSWORD_DEFAULT);
            $vars['password'] = $password;
            $vars['username'] = $firstname . " " . $lastname;

            $this->db->where('id', $getuser_id);
            $this->db->update('users', array('password' => $encpassword));

            $message = $this->load->view('template/emails/v_forgot_password', $vars, TRUE);
            $this->common_mail($email, 'Forgot Password', $message);
            return "success";
        }

    }

    function change_password()
    {   
        $oldpass = $this->input->post('oldpassword');
        $newpass = $this->input->post('newpassword');
        $newpass1 = $this->input->post('newpassword1');

        $pass_check = $this->valid_password($newpass, $newpass1);
        if (!$pass_check['is_valid']) {
            echo '<script>setTimeout("location.reload();", 1600)</script>';
            echo $pass_check['error'];
            return;
        } 

        $new = password_hash($newpass, PASSWORD_DEFAULT);
        $custome_user_id = $this->session->user_id;
        $old = password_hash($oldpass, PASSWORD_DEFAULT);
        $this->db->where('id', $custome_user_id);
        $user = $this->db->get($this->table)->row();

        if (password_verify($oldpass, $user->password) == true) {
            $this->db->where('id', $custome_user_id);
            if ($this->db->update($this->table, ['password' => $new]) == true) {
                echo "Your password changed Successfully";

                $this->db->where('id', $this->session->user_id);
                $query = $this->db->get('users');
                $email = $query->row()->email;

                $vars = ['username' => $this->session->firstname, 'password' => $newpass];
                $email_content = $this->load->view('template/emails/v_change_password', $vars, TRUE);
                $this->common_mail($email, 'Password change', $email_content);

            } else {
                return FALSE;
            }
        } else {
            return FALSE;
        }
    }


    function generatepassword($length = 8)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, strlen($characters) - 1)];
        }
        return $randomString;
    }


    private function valid_password($new_pass, $conf_new_pass) 
    {
        $password_regex = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/';

        if ($new_pass != $conf_new_pass) {
            return ['is_valid'=>FALSE, 'error'=>'Passwords don\'t match.'];
        }

        if (strlen($new_pass) < 8) {
            return ['is_valid'=>FALSE, 'error'=>'Password must be at least 8 characters long.'];
        }

        if (!preg_match($password_regex, $new_pass)) {
            return ['is_valid'=>FALSE, 'error'=>'Provide at least 1 upper case, 1 lower case, 1 digit and 1 special character.'];
        }

        return ['is_valid'=>TRUE];
    }


    public function get_salt()
    {
        $this->db->select('salt');
        $this->db->where('id', $this->session->user_id);
        return $this->db->get('users')->row()->salt;
    }
}