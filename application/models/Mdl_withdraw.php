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


    // Sends mail for confirmation
    public function common_mail($info) 
    {
        $vars = $this->get_vars($info);
        $tomail = $vars['tomail'];
        unset($vars['tomail']);

        $this->set_pending();

        $content = $this->load->view('template/emails/v_header', [], TRUE);
        $content .= $this->load->view('template/emails/v_withdrawal_confirmation.php', $vars['vars'], TRUE);
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


    // Inserts data in database
    public function withdraw_record () 
    {       
        $currency = [
                'EUR' => 0,
                'GTS' => 0,
                'NLG' => 0,
        ];

        $currency[$this->session->pending_curr['type']] = $this->session->pending_curr['amount']; 
        $token = $this->getToken(rand(20,24));
        $transaction = $this->session->user_id . $token;

        $params = [
                $this->session->user_id,
                (int)$currency['EUR'],
                (int)$currency['GTS'],
                (int)$currency['NLG'],
                $transaction,
                $token,
                'activate',
                0,
                date('Y-m-d', time()),
                date('Y-m-d', time()),
        ];

        $sql = "INSERT INTO `withdrawal` (`user_id`, `EUR`, `GTS`, `NLG`, `transaction`, `token`, `status`, `verified`, `withdrawal_date`, `last_update`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
        $this->db->query($sql, $params);

        $sql = "INSERT INTO `withdraw_fee`(`user_id`, `dateoffee`, `fee_amount`, `status`) VALUES (?, NOW(), ?, ?);";
        $this->db->query($sql, [$this->session->user_id, TAXSEPA, 'open']);

        return ['token' => $token, 'transaction' => $transaction];
    }

    public function cancel_withdraw($transaction)
    {
        $query = $this->db->query('SELECT * FROM `withdrawal` WHERE `transaction` = ? AND `user_id` = ? AND status = "activate"', [$transaction, $this->session->user_id]);
        $row = $query->row(); 

        if (!$row) {
            return FALSE;
        }

        $currency = [
            'EUR' => $row->EUR,
            'NLG' => $row->NLG,
        ];

        $amount = ( $currency['EUR'] != 0 ? ['EUR', $currency['EUR']]: ['NLG', $currency['NLG']] );

        $pending_currency = 'pending_' . $amount[0];
        $currency = $amount[0];
        $update_amount = $amount[1];
        
        $query = $this->db->query("UPDATE `withdrawal` SET `status`='cancel' WHERE `id` = ? and`user_id` = ?", [$query->row()->id, $this->session->user_id]);

        $query = $this->db->get_where('balance', ['user_id' => $this->session->user_id]);
        $pending = $query->row()->$pending_currency;
        $amount = $query->row()->$currency;

        $update_pending = (float)$pending - (float)$update_amount;
        $update_amount = (float)$amount + (float)$update_amount;

        $params = [ 
            $currency => $update_amount, 
            $pending_currency => $update_pending 
        ];

        $this->db->where('user_id', $this->session->user_id);
        $query = $this->db->update('balance', $params); 

        return TRUE;
    }

    public function confirm_withdraw($transaction)
    {
        $query = $this->db->query('SELECT * FROM `withdrawal` WHERE `transaction` = ? AND `user_id` = ? AND status = "activate"', [$transaction, $this->session->user_id]);
        
        if (!$query->row()) {
            return FALSE;
        }

        $query = $this->db->query("UPDATE `withdrawal` SET `status`='pending' WHERE `id` = ? and`user_id` = ?", [$query->row()->id, $this->session->user_id]);
        return TRUE;
    } 

    //=======================================================================
    // PRIVATE FUNCTIONS
    //=======================================================================
    

    // creates random token and returns it
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


    // for getToken
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


    // Vars for email template
    private function get_vars($info)
    {
        $query = $this->db->get_where('users', ['id' => $this->session->user_id]);
        $user = $query->row();

        $tomail = $user->email;

        $vars['username'] = $user->firstname;
        $vars['amount'] = $this->session->pending_curr['amount'];
        $vars['currency'] = $this->session->pending_curr['type'];
        $vars['purse'] = '--PURSE NAME--';
        $vars['confirmlink'] = base_url() . '/withdraw/confirm_withdraw/' . $info['transaction'];
        $vars['cancellink'] = base_url() . '/withdraw/cancel_withdraw/' . $info['transaction'];
        $vars['ip'] = 'ip num';
        $vars['login'] = $tomail;

        return ['vars'=>$vars, 'tomail'=>$tomail];
    }


    // Set from amount to pending
    private function set_pending()
    {
        $currency = $this->session->pending_curr['type']; 
        $pending_currency = 'pending_' . $this->session->pending_curr['type']; 

        $query = $this->db->get_where('balance', ['user_id' => $this->session->user_id]);
        $pending = $query->row()->$pending_currency;
        $amount = $query->row()->$currency;

        $update_pending = (float)$pending + (float)$this->session->pending_curr['amount'];
        $update_amount = (float)$amount - (float)$this->session->pending_curr['amount'];

        $params = [ 
            $currency => $update_amount, 
            $pending_currency => $update_pending 
        ];

        $this->db->where('user_id', $this->session->user_id);
        $query = $this->db->update('balance', $params); 
    }

    

}

?>