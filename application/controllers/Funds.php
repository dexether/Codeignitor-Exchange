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
        switch ($fund) {
            case 'NLG':
                //check if address exists,
                //if not create a new Gudlen address for this user.

                $data['address'] = $this->mdl_deposit->get_address($this->session->user_id, 'NLG');
                $this->data['content'] = $this->load->view('funds/v_deposit',$data, true);
                break;
            case 'EUR':
                //create deposit code
                //start ideal

                $data['deposit_code'] = $this->mdl_deposit->get_deposit_code($this->session->user_id);
                Paynl\Config::setApiToken(PAYAPITOKEN);
                Paynl\Config::setServiceId(PAYSERVICEID);

                $data['banklist'] = Paynl\Paymentmethods::getBanks();

                $this->data['content'] = $this->load->view('funds/v_eur',$data, true);
                break;

            default:
                break;
        }

       
        view($this->data);
    }
    
    public function withdraw($fund='NLG') {
        
        $this->data['content'] = $fund;
        view($this->data);
    }
    
}
