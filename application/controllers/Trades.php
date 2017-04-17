<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Trades
 *
 * @author rogier
 */
class Trades  extends MY_Controller{
   public function __construct() 
    {
        parent::__construct();
        if(!$this->session->user_id > 0)
        {
            redirect('/');
        }
    }
    
    public function buylimit_order()
    {
        if(isset($_POST['amount']) && isset($_POST['price']) && isset($_POST['trade_pair']))
        {
            $this->load->model('mdl_trade');
            $status = $this->mdl_trade->buylimit_order($this->input->post('amount'),$this->input->post('price'),$this->input->post('trade_pair'));
            echo json_encode(['status'=>$status, 'csrf'=>$this->security->get_csrf_hash()]);
        }
        else
            redirect('/');
    }
}
