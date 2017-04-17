<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Model used for all trades
 */

class Mdl_trade  extends CI_Model {
    
    public function __construct()
    {
        parent::__construct();
    }
    
    public function buylimit_order($amount=0, $price=0, $trade_pair='EUR-NLG')
    {
        list($bid, $sell) = explode('-', $trade_pair);
        
        //get balance
        $this->load->model('mdl_balance');
        $balance = $this->mdl_balance->currency_balance();
        if($balance === false)
        {
            return 'balance';
        }
        else
        {
            $total = $amount*$price;
            if($total <= $balance->$bid)
            {
                $this->db->trans_start();
                    //1: insert order into order table
                    $this->db->insert('order_'.$bid, 
                            ['price'=>$price,
                            'amount'=>$amount,
                            'type'=>'limit',
                            'bidsell'=>'bid',
                            'user_id'=>$this->session->user_id,
                            $bid => $total,
                            'total'=>$price*$amount * ((100 - FEE) / 100),
                            'fee'=>$total /100 * FEE,
                            'status'=>'open'
                            ]
                            );
                    $order_id = $this->db->insert_id();
                    //2: subtract from balance
                    
                    $this->db->where('user_id',$this->session->user_id);
                    $this->db->query("UPDATE `balance` SET `$bid` = `$bid`- $total WHERE `user_id` = " .$this->session->user_id);
                        
                    //3: check for open sell orders
                    $this->db->where('bidsell','sell');
                    $this->db->where('price <=',$price);
                    $this->db->where('status','open');
                    $this->db->order_by('order_date', 'desc');
                    $res = $this->db->get('order_'.$bid);
                    if($res->num_rows() > 0)
                    {
                        $rows = $res->result();
                        foreach($rows as $rows)
                        {
                            //process until order is filled or end of records
                            $units_filled = 0;
                            if(($total - $units_filled) >= $row->total) //full order
                            {
                                //set sell to processed
                                $this->db->where('is',$row->id);
                                $this->db->update('order_'.$bid, ['status'=>'processed']);
                                
                                $units_filled += $row->total; 
                                // update units filled
                                
                                //insert trade record
                                // id 	user_id 	bid_id 	sell_id 	price 	amount 	total 	fee 	trade_datetime 	status
                                $this->db->insert('trades_'.$bid, 
                                    ['price'=>$price,
                                    'amount'=>$amount,
                                    'bidsell'=>'bid',
                                    'user_id'=>$this->session->user_id,
                                    'bid_id'=>$order_id,
                                    'sell_id'=>$row->id,
                                    'total'=>$row->total,
                                    'status'=>1
                                    ]
                                    );
                            }
                            else // partial order
                            {
                                
                            }
                            
                        }
                        //update order record with units filled
                        
                        //update balance with units filled
                        
                        echo 'found order!';
                        
                    }
                    
                
                $this->db->trans_complete();
                
                if ($this->db->trans_status() === FALSE)
                {
                    return 'Error in transaction ';
                }
                else
                    return 'processing buy!';
                    return 'succes';
            }
            else 
                return 'balance';
        } 
        
        return 'succes';
    }
}
