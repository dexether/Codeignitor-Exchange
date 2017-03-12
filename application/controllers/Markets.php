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
        
        $this->data['menu'] = $this->load->view('markets/v_menu', array('uri'=>$this->uri->segment(1)), true);
    }
    
    public function index() {
        redirect('markets/EUR-NLG');
    }
    
    public function trade_page($market='EUR-NLG') {
        
        //todo, add these automatically or get from DB
        if(in_array($market, array('EUR-NLG', 'GTS-NLG')))
        {
            $data = array();
            $data['market'] = $market;
            $a = explode('-', $market);
            $data['currency_bid'] = $a[0];
            $data['currency_sell'] = $a[1];
            
            $this->data['content'] = $this->load->view('charts/v_chart_nlg', $data, true);
            
            //test data!
            $this->l_asset->add('//cdn.anychart.com/csv-data/csco-daily.js', 'js');

            $this->data['content'] .= $this->load->view('blocks/v_bid_ask', $data, true);

            $this->data['content'] .= $this->load->view('blocks/v_trade_history', $data, true);

            view($this->data);
        }
        else
            redirect('/');
        
        
    }
    
}
