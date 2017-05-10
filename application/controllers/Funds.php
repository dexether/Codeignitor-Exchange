<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Funds extends MY_Controller{
    var $data = array();
    
    public function __construct() 
    {
        parent::__construct();
        if(!$this->session->user_id > 0)
        {
            redirect('/');
        }
        
        $this->data['menu'] = $this->load->view('markets/v_menu', array('uri'=>$this->uri->segment(2)), true);
    }
    
    public function index() {
        redirect('funds/deposit');
    }
    
    public function deposit($fund='NLG', $type=null) {


        $data = array();
        $data['fund'] = $fund;
        $data['header'] = $this->load->view('funds/v_header',$data, true);

        $this->load->model('mdl_deposit');
        $this->data['content'] = $this->get_balance();
        
        Paynl\Config::setApiToken(PAYAPITOKEN);
        Paynl\Config::setServiceId(PAYSERVICEID);

        switch ($fund) {
            case 'NLG':
                //check if address exists,
                //if not create a new Gudlen address for this user.

                $data['address'] = $this->mdl_deposit->get_address($this->session->user_id, 'NLG');
                $this->data['content'] .= $this->load->view('funds/v_deposit',$data, true);
                break;
            case 'EUR':
                //create deposit code
                //start ideal
                 $this->form_validation->set_rules('bank', 'Bank', 'trim|required');
                 $this->form_validation->set_rules('amount', 'Amount', 'trim|required|min_length[1]');
                 if ($this->form_validation->run() == true) {
                    //redirect to iDeal
                     
                    $i['amount'] = number_format($this->input->post('amount'),2);

                    $result = Paynl\Transaction::start(array(
    
                        'amount' => $i['amount'],
                        'returnUrl' => APP_BASE_URL."/tools/deposit/".$this->session->user_id,
                        'paymentMethod' => 10,
                        'bank'=>$this->input->post('bank')
                    ));
                     # Save this transactionid and link it to your order
                     $transactionId = $result->getTransactionId();

                     # Redirect the customer to this url to complete the payment
                     $redirect = $result->getRedirectUrl();

                     $i['deposit_code'] = $transactionId;

                     /*
                     $fields = [];
                    $fields['id'] = ['type' => 'INT','constraint' => 11,'auto_increment' => true];
                    $fields['user_id'] = ['type' => 'INT','constraint' => 11];
                    $fields['EUR'] = ['type' => 'DECIMAL','constraint' => 18,8];
                    $fields['deposit_code'] = ['type' => 'VARCHAR','constraint' => 10];
                    $fields['status'] = ['type' => 'VARCHAR','constraint' => 10];
                    $fields['verified'] = ['type' => 'VARCHAR','constraint' => 10];
                    $fields['deposit_date'] = ['type' => 'DATE'];
                    $fields['last_update'] = ['type' => 'timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'];
                    */
                     //insert into 
                     $mdl_gc -> insert($i);

                     redirect($redirect);
                     exit();

                 } else {
                     $data['alert'] = validation_errors('<p class="alert alert-danger">', '</p>');
                 }

                $data['deposit_code'] = $this->mdl_deposit->get_deposit_code($this->session->user_id);
                $data['banklist'] = Paynl\Paymentmethods::getBanks();

                $this->data['content'] .= $this->load->view('funds/v_eur',$data, true);
                break;

            default:
                break;
        }

       
        view($this->data);
    }

    public function withdraw($fund='NLG') {
        
        
        $this->data['content'] = $this->get_balance();
        $this->data['content'] .= $fund;
        view($this->data);
    }
    
        
    private function get_balance()
    {
        $data = array();
        $this->load->model('mdl_balance');
        $data['EUR'] = number_format($this->mdl_balance->fetch_user_balance_by_id($this->session->user_id,'EUR'), 2);
        $data['NLG'] = number_format($this->mdl_balance->fetch_user_balance_by_id($this->session->user_id,'NLG'), 8);
        $data['GTS'] = number_format($this->mdl_balance->fetch_user_balance_by_id($this->session->user_id,'GTS'), 8);
        
        return $this->load->view('user/v_balance',$data,true);
    }
    
}
