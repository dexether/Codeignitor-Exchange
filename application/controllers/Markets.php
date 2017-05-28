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
            
            $this->load->model('mdl_user');
            $data['user_id'] = $this->mdl_user->get_salt();
            
            //$this->load->model('mdl_balance');
            //$data['balance'] = $this->mdl_balance->currency_balance();
            
            $this->data['content'] = $this->load->view('charts/v_chart', $data, true);
            
            //test data!
            //$this->l_asset->add('//cdn.anychart.com/csv-data/csco-daily.js', 'js');
            $this->l_asset->add('/js/trade/trade.js', 'js');

            $this->data['content'] .= $this->load->view('blocks/v_bid_ask', $data, true);

            $this->load->model('mdl_trade');
            //$data['bid_orders'] = $this->mdl_trade->get_bid_orders($data['currency_sell'], 20);
            //$data['sell_orders'] = $this->mdl_trade->get_sell_orders($data['currency_sell'], 20);

            $this->data['content'] .= $this->load->view('blocks/v_order_book', $data, true);

            //$data['trade_history'] = $this->mdl_trade->trade_history($data['currency_sell'], 20);
            $this->data['content'] .= $this->load->view('blocks/v_trade_history', $data, true);

            $user_id = $this->session->user_id;
            //$data['my_open_orders'] = $this->mdl_trade->get_my_orders($data['currency_sell'], 'open', $user_id , 50);
            $this->data['content'] .= $this->load->view('blocks/v_my_orders', $data, true);
                    
            //$data['order_history'] = $this->mdl_trade->get_my_orders($data['currency_sell'],'processed', $user_id , 50);
            $this->data['content'] .= $this->load->view('blocks/v_my_order_history', $data, true);

            view($this->data);
        }
        else
            redirect('/');
    
    }
    
    public function get_init_data($market=null, $salt=null)
    {
        if(in_array($market, MARKETS) && $salt == $this->session->salt)
        {
            $json = [];
            
            //get user data
            $this->load->model('mdl_balance');
            $balance = $this->mdl_balance->currency_balance();
            list($bid,$sell) = explode('-', $market);
            $available_bid = isset($balance->$bid)?$balance->$bid : 0;
            $available_sell = isset($balance->$sell)?$balance->$sell : 0;
               
            $json['user'] = array(
                        'user_id'=>$this->session->salt,
                        'room'=>$market,
                        'firstCurrency'=>number_format((float)$available_bid, 8, '.', ''),
                        'secondCurrency'=>number_format((float)$available_sell, 8, '.', '')
                    );
  
            $this->load->model('mdl_trade');
            $bid_orders = $this->mdl_trade->get_bid_orders($sell, 200);
            $sell_orders = $this->mdl_trade->get_sell_orders($sell, 200);
            
            $bid_orders_data = [];
            if(isset($bid_orders) && $bid_orders->num_rows()>0)
            {
                $rows = $bid_orders ->result();

                //Sum 	Total 	Size (NLG) 	Bid (BTC) 
                $sum = 0;
                $total = 0;
                foreach ($rows as $row) 
                {
                    $sum += $row->total;
                    $bid_orders_data[] = array(
                        'Sum'=> number_format($sum,8),
                        'Total'=>  $row->total,
                        'Size('.$sell. ')'=>  number_format($row->amount,8),
                        'Bid('.$bid. ')'=>  number_format($row->price,8)
                    );
                }
            }
            
            $json['tables']['table-bids'] = array (
                            'keys'=>array('Sum', 'Total', 'Size('.$sell. ')', 'Bid('.$bid. ')',),
                            'count'=> $bid_orders->num_rows(),
                            'first'=> $bid_orders_data
                                );
            
            $sell_orders_data = [];
            if(isset($sell_orders) && $sell_orders->num_rows()>0)
            {
                $rows = $sell_orders ->result();

                $sum = 0;
                $total = 0;
                foreach ($rows as $row) 
                {
                    $sum += ($row->amount) * $row->price;
                    $sell_orders_data[] = array(
                        'Ask ('. $bid.')'=> number_format($row->price,8),
                        'Size ('. $sell. ')'=>  number_format(($row->amount),8),
                        'Total'=>  number_format(($row->amount) * $row->price,8),
                        'Sum'=>  number_format($sum,8)
                    );
                    
                }
            }
            $json['tables']['table-ask'] = array (
                            'keys'=>array('Ask ('. $bid.')', 'Size ('. $sell. ')', 'Total', 'Sum'),
                            'count'=> $sell_orders->num_rows(),
                            'first'=> $sell_orders_data
                                );
            
            $trade_history = $this->mdl_trade->trade_history($sell, 200);
            $trade_history_data = [];
            
            if(isset($trade_history) && $trade_history->num_rows()>0)
            {
                $rows = $trade_history ->result();

                foreach ($rows as $row) 
                {
                    $trade_history_data[] = array(
                        'Date'=> substr($row->trade_datetime,0,16),
                        'Buy/Sell'=>  $row->bidsell,
                        $bid=>  number_format($row->price,8),
                        'Total Units'=>  number_format($row->amount,8),
                        'Total Cost'=>  number_format($row->total,8)
                    );
                }
            }
            
            $json['tables']['market-history'] = array (
                'keys'=>array('Date', 'Buy/Sell', $bid, 'Total Units', 'Total Cost'),
                'count'=> $trade_history->num_rows(),
                'first'=> $trade_history_data
                    );
            
            
            //table-open
            $user_id = $this->session->user_id;
            $my_open_orders = $this->mdl_trade->get_my_orders($sell, 'open', $user_id , 200);
            
            $my_open_orders_data = [];      
            if(isset($my_open_orders) && $my_open_orders->num_rows()>0)
            {
                $rows = $my_open_orders ->result();
                foreach ($rows as $row) 
                {
                    $my_open_orders_data[] = array(
                        'Date'=> substr($row->order_date,0,16),
                        'Buy/Sell'=>  $row->bidsell,
                        $bid=>  number_format($row->price,8),
                        'Units filled'=>  number_format($row->units_filled,8),
                        'Total Units'=>  number_format($row->amount,8),
                        'Total Cost'=>  number_format($row->total,8)
                    );
                }
            }
            $json['tables']['table-open'] = array (
                'keys'=>array('Date', 'Buy/Sell', $bid, 'Units filled' , 'Total Units', 'Total Cost'),
                'count'=> $my_open_orders->num_rows(),
                'first'=> $my_open_orders_data
                    );
            
            //order-history
            $order_history = $this->mdl_trade->get_my_orders($sell,'processed', $user_id , 50);
            $order_history_data = [];
     
            if(isset($order_history) && $order_history->num_rows()>0)
            {
                $rows = $order_history ->result();

                foreach ($rows as $row) 
                {
                    $order_history_data[] = array(
                        'Date'=> substr($row->order_date,0,16),
                        'Buy/Sell'=>  $row->bidsell,
                        $bid=>  number_format($row->$bid,8),
                        'Total Units'=>  number_format($row->amount,8),
                        'Total Cost'=>  number_format($row->amount * $row->price,8),
                        'Fee'=>  number_format($row->fee,8)
                    );
                }
            }
            
            $json['tables']['order-history'] = array (
                'keys'=>array('Date', 'Buy/Sell', $bid, 'Units filled' , 'Total Units', 'Total Cost'),
                'count'=> $order_history->num_rows(),
                'first'=> $order_history_data
                    );
            
            echo json_encode($json);
        }
        else
        {
            redirect('/');
        }
    }
}