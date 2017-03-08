<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Markets extends MY_Controller{
    var $data = array();
    
    public function __construct() 
    {
        parent::__construct();
        if(!$this->session->user_id > 0)
        {
            redirect('/');
        }
    }
    
    public function index() {
        redirect('markets/EUR-NLG');
    }
    
    public function trade_page($market='EUR-NLG') {
        var_dump($this->session->userdata());
        echo 'market '. $market;
        
        view($this->data);
    }
    
}
