<?php defined('BASEPATH') OR exit('No direct script access allowed');


class Page extends MY_Controller{
    var $data = array();
    
    public function __construct() 
    {
        parent::__construct();
    }
    
    public function terms() 
    {
        $this->data['content'] = $this->load->view('page/v_terms', null, true);
        view($this->data);
    }
}