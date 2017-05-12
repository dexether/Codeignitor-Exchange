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

        public function common_mail() 
        {
                $query = $this->db->get_where('users', ['id' => $this->session->user_id]);
                $user = $query->row();

                $tomail = $user->email;
                $vars['username'] = $user->firstname;
                $vars['amount'] = 'xxx';
                $vars['currency'] = 'EURY';
                $vars['purse'] = 'EURY';
                $vars['confirmlink'] = 'EURY';
                $vars['cancellink'] = 'EURY';
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
                    show_error($this->email->print_debugger());
                }   
        }
}

?>