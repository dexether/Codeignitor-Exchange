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
    
    public function deposit($fund='NLG') {

        $data = array();
        
        switch ($fund) {
            case 'NLG':
                //check if address exists,
                //if not create a new Gudlen address for this user.
                $this->data['content'] = $this->load->view('funds/v_nlg',$data, true);
                break;
            case 'EUR':

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
