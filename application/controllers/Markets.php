<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Markets extends MY_Controller{
    var $data = array();
    
    public function __construct() 
    {
        parent::__construct();
    }
    
    public function index() {
        redirect('markets/EUR-NLG');
    }
    public function trade_page($market='EUR-NLG') {
        var_dump($this->session->userdata());
        echo 'market '. $market;
    }
    
}
