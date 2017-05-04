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
        if(in_array($market, MARKETS))
        {
            $data = array();
            $data['market'] = $market;
            $a = explode('-', $market);
            $data['currency_bid'] = $a[0];
            $data['currency_sell'] = $a[1];
            
            $this->load->model('mdl_balance');
            $data['balance'] = $this->mdl_balance->currency_balance();
            
            //$this->data['content'] = $this->load->view('charts/v_chart_nlg', $data, true);
            
            //test data!
            //$this->l_asset->add('//cdn.anychart.com/csv-data/csco-daily.js', 'js');
            $this->l_asset->add('/js/trade/trade.js', 'js');

            $this->data['content'] .= $this->load->view('blocks/v_bid_ask', $data, true);

            $this->load->model('mdl_trade');
            $data['bid_orders'] = $this->mdl_trade->get_bid_orders($data['currency_bid'], 20);
            $data['sell_orders'] = $this->mdl_trade->get_sell_orders($data['currency_bid'], 20);

            $this->data['content'] .= $this->load->view('blocks/v_order_book', $data, true);

            $data['trade_history'] = $this->mdl_trade->trade_history($data['currency_bid'], 20);
            $this->data['content'] .= $this->load->view('blocks/v_trade_history', $data, true);

            $user_id = $this->session->user_id;
            $data['my_open_orders'] = $this->mdl_trade->get_my_orders($data['currency_bid'], 'open', $user_id , 50);
            $this->data['content'] .= $this->load->view('blocks/v_my_orders', $data, true);        
                    
            $data['order_history'] = $this->mdl_trade->get_my_orders($data['currency_bid'],'processed', $user_id , 50);
            $this->data['content'] .= $this->load->view('blocks/v_my_order_history', $data, true);

            view($this->data);
        }
        else
            redirect('/');
        
    }
    
    public function add_trade()
    {
        $order = isset($_POST['order'])?$this->input->post('order'):null;
        $currency_sell=isset($_POST['currency_sell'])?$this->input->post('currency_sell'):null;
        $currency_bid=isset($_POST['currency_bid'])?$this->input->post('currency_bid'):null;
        $amount=isset($_POST['amount'])?$this->input->post('amount'):null;
        $price=isset($_POST['price'])?$this->input->post('price'):null;
        
        $total = $amount * $price;
        if(!is_null($from_currency) && !is_null($to_currency) &&!is_null($amount) &&!is_null($price))
        {
            //get balance for both currencies
            $this->load->model('mdl_balance');
            $balance = $this->mdl_balance->currency_balance();
            if($balance === false)
            {
                redirect('markets/EUR-NLG');
            }
            else
            {
                if($balance->$$currency_sell <= $currency_bid)
                {
                    
                }
                else
                {
                    
                }
            }
            
        }
        
        redirect('markets/EUR-NLG');
    }
    
}
