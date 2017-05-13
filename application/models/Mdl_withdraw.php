<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mdl_withdraw extends CI_Model {

	public function tfa_bank_status() 
        {
                $user_id = $this->session->user_id;
                $this->db->select('randcode');
                $query = $this->db->get_where('users', ['id' => $user_id]);

                $tfa_enabled = ( $query->row()->randcode == 'enable'? TRUE : FALSE );
                

                $this->db->select('status');
                $query = $this->db->get_where('user_bank_details', ['user_id' => $user_id]);

                if (!is_null($query->row())) {
                	$bank_verified = ( $query->row()->status == 1? TRUE : FALSE );
                } else {
                	$bank_verified = FALSE;
                }

                return ['tfa_enabled'=>$tfa_enabled, 'bank_verified' =>$bank_verified];
	}

        public function common_mail($info) 
        {
                $query = $this->db->get_where('users', ['id' => $this->session->user_id]);
                $user = $query->row();

                $tomail = $user->email;
                $vars['username'] = $user->firstname;
                $vars['amount'] = $this->session->amount;
                $vars['currency'] = $this->session->currency;
                $vars['purse'] = '--PURSE NAME--';
                $vars['confirmlink'] = base_url() . '/withdraw/confirm_withdraw/' . $info['transaction'];
                $vars['cancellink'] = base_url() . '/withdraw/cancel_withdraw/' . $info['transaction'];
                $vars['ip'] = 'ip num';
                $vars['login'] = $tomail;

                $content = $this->load->view('template/emails/v_header', [], TRUE);
                $content .= $this->load->view('template/emails/v_withdrawal_confirmation.php', $vars, TRUE);
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
                $this->email->subject('Withdraw conformation');
                $this->email->message($content);
                $send = $this->email->send(); 

                if ($send) {
                    return true;
                } else {
                    //show_error($this->email->print_debugger());
                }   
        }

        public function withdraw_record () 
        {       
                $currency = [
                        'EUR' => $this->session->userdata('pending_eur'),
                        'GTS' => $this->session->userdata('pending_gts'),
                        'NLG' => $this->session->userdata('pending_nlg'),
                ];

                $token = $this->getToken(rand(20,24));
                $transaction = md5($this->session->firstname) . $token;

                $params = [
                        $this->session->user_id,
                        (int)$currency['EUR'],
                        (int)$currency['GTS'],
                        (int)$currency['NLG'],
                        $transaction,
                        $token,
                        0,
                        0,
                        date('Y-m-d', time()),
                        date('Y-m-d', time()),
                ];

                var_dump($params);
                $sql = "INSERT INTO `ciexcgt`.`withdrawal` (`user_id`, `EUR`, `GTS`, `NLG`, `transaction`, `token`, `status`, `verified`, `withdrawal_date`, `last_update`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
                $this->db->query($sql, $params);

                return ['token' => $token, 'transaction' => $transaction];
        }

        private function getToken($length)
        {
            $token = "";
            $codeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            $codeAlphabet.= "abcdefghijklmnopqrstuvwxyz";
            $codeAlphabet.= "0123456789";
            $max = strlen($codeAlphabet);

            for ($i=0; $i < $length; $i++) {
                $token .= $codeAlphabet[$this->crypto_rand_secure(0, $max-1)];
            }

            return $token;
        }

        private function crypto_rand_secure($min, $max)
        {
            $range = $max - $min;
            if ($range < 1) return $min; // not so random...
            $log = ceil(log($range, 2));
            $bytes = (int) ($log / 8) + 1; // length in bytes
            $bits = (int) $log + 1; // length in bits
            $filter = (int) (1 << $bits) - 1; // set all lower bits to 1
            do {
                $rnd = hexdec(bin2hex(openssl_random_pseudo_bytes($bytes)));
                $rnd = $rnd & $filter; // discard irrelevant bits
            } while ($rnd > $range);
            return $min + $rnd;
        }
}

?>