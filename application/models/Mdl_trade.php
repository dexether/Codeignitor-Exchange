<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Model used for all trades
 */

class Mdl_trade  extends CI_Model {
    
    var $debug = false;
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
        if ($this->debug) echo $this->db->last_query();
        if($balance === false)
        {
            return 'balance';
        }
        else
        {
            //TODO add what is paid in total for all order > when buying up.
            $total = $amount;
            $bidprice = $price*$amount;
            $fee = $bidprice / 100 * FEE;
            if($bidprice <= $balance->$bid)
            {
                $this->db->trans_start();
                    //1: insert order into order table
                    $this->db->insert('order_'.$sell, 
                            ['price'=>$price,
                            'amount'=>$amount,
                            'type'=>'limit',
                            'bidsell'=>'bid',
                            'user_id'=>$this->session->user_id,
                            $bid => $total,
                            'total'=>$price*$amount,
                            'fee'=>$bidprice / 100 * FEE,
                            'status'=>'open'
                            ]
                            );
                    $order_id = $this->db->insert_id();
                    if ($this->debug) echo 'order_id: ', $order_id;
                    //2: subtract from balance
                    
                    //$this->db->where('user_id',$this->session->user_id);
                    $this->db->query("UPDATE `balance` SET `$bid` = `$bid`- $bidprice - $fee , `pending_$bid` = `pending_$bid` + $bidprice + $fee WHERE `user_id` = " .$this->session->user_id);
                    if ($this->debug) echo $this->db->last_query();
                        
                    //3: check for open sell orders
                    $this->db->where('bidsell','sell');
                    $this->db->where('price <=',$price);
                    $this->db->where('status','open');
                    $this->db->order_by('price', 'asc');
                    $this->db->order_by('order_date', 'desc');
                    $res = $this->db->get('order_'.$sell);
                    if ($this->debug) echo $this->db->last_query();
                    
                    if($res->num_rows() > 0)
                    {
                        $rows = $res->result();
                        $units_filled = 0;
                        $bidprice = 0;
                        //loop all matching sell records
                        foreach($rows as $row)
                        {
                            if ($this->debug) echo 'row:', $row->amount, ' p:', $row->price, ' f:', $row->units_filled, '|';
                            //process until order is filled or end of records
                            $units_left_to_fill = $total - $units_filled;
                            $unit_row = $row->amount - $row->units_filled;
                            
                            if ($this->debug) echo ' $units_left_to_fill:',$units_left_to_fill, ' $unit_row:',$unit_row, '|';
                            if($units_left_to_fill >= $unit_row) //full order
                            {
                                $units_filled += $unit_row;
                                
                                //set sell to processed
                                //$this->db->where('id',$row->id);
                                //$this->db->update('order_'.$sell, ['status'=>'processed', 'units_filled'=>$unit_processed]);
                                $this->db->query("UPDATE `order_".$sell."` SET `units_filled` = `units_filled` + $unit_row , `status`= 'processed' WHERE `id` = " .$row->id);
                                if ($this->debug) echo $this->db->last_query();
                                
                                
                                //take fee from both BID and SELL record.
                                //$bidprice += ($unit_row * $row->price * (100 - FEE) / 100);
                                $tot_bid  = $unit_row * $row->price;
                                $fee = ($unit_row * $row->price) /100 * FEE;
                                if ($this->debug) echo '$unit_row:', $unit_row, ' $tot_bid = ', $tot_bid, '| FEE ' ,$fee,  '|';
                                
                                //update both seller end bidden balance; Update them without the EUR fee.
                                $this->db->query("UPDATE `balance` SET `$sell` = `$sell`+ $unit_row, `pending_$bid` = `pending_$bid` - $tot_bid -$fee WHERE `user_id` = " .$this->session->user_id);
                                if ($this->debug) echo $this->db->last_query();
                                $this->db->query("UPDATE `balance` SET  `$bid` = `$bid` + $tot_bid, `pending_$sell` = `pending_$sell` - $unit_row WHERE `user_id` = " .$row->user_id);
                                if ($this->debug) echo $this->db->last_query();
                                
                                //insert trade record
                                // id 	user_id 	bid_id 	sell_id 	price 	amount 	total 	fee 	trade_datetime 	status
                                $this->db->insert('trades_'.$sell, 
                                    ['price'=>$price,
                                    'amount'=>$unit_row,
                                    'bidsell'=>'sell',
                                    'user_id'=>$this->session->user_id,
                                    'bid_id'=>$order_id,
                                    'sell_id'=>$row->id,
                                    'total'=>$tot_bid,
                                    'status'=>'processed'
                                    ]
                                    );
                                $trade_id = $this->db->insert_id();
                                if ($this->debug) echo $this->db->last_query();
                                
                                //buyer fee
                                $this->db->insert('open_fees',[
                                    'user_id' => $this->session->user_id,
                                    'table'=> 'order_'.$sell,
                                    'table_id' => $order_id,
                                    'trade_id' =>$trade_id,
                                    'fee' => $fee,
                                    'status' => 'open'
                                ]);
                                if ($this->debug) echo $this->db->last_query();
                                
                                //seller fee
                                $this->db->insert('open_fees',[
                                    'user_id' => $row->user_id,
                                    'table'=> 'order_'.$sell,
                                    'table_id' => $row->id,
                                    'trade_id' =>$trade_id,
                                    'fee' => $fee,
                                    'status' => 'open'
                                ]);
                                if ($this->debug) echo $this->db->last_query();
     
                                //TODO insert trade record sell???
                                //TODO units filled, fee filled etc.
                                //TODO insert FEE record. 
                            }
                            else // partial order
                            {
                                if ($this->debug) echo ' partial order';
                                $units = $total - $units_filled;
                                
                                //$bidprice += ($units * $row->price * (100 - FEE) / 100); 
                                if ($this->debug) echo 'bidprice = ', $bidprice, '|';
                                $units_filled += $units;
                                $this->db->query("UPDATE `order_".$sell."` SET `units_filled` = `units_filled` + $units WHERE `id` = " .$row->id);
                                if ($this->debug) echo $this->db->last_query();
                                
                                //take fee from both BID and SELL record.
                                //$bidprice += ($units * $row->price * (100 - FEE) / 100);
                                $tot_bid  = $units * $row->price;
                                $fee = ($units * $row->price) /100 * FEE;
                                if ($this->debug) echo 'bidprice = ', $bidprice, '| FEE ' ,$fee, '|';
                                
                                //update both seller end bidden balance;
                                $this->db->query("UPDATE `balance` SET `$sell` = `$sell`+ $units, `pending_$bid` = `pending_$bid` - $tot_bid - $fee WHERE `user_id` = " .$this->session->user_id);
                                if ($this->debug) echo $this->db->last_query();
                                $this->db->query("UPDATE `balance` SET  `$bid` = `$bid` + $tot_bid, `pending_$sell` = `pending_$sell` - $units WHERE `user_id` = " .$row->user_id);
                                if ($this->debug) echo $this->db->last_query();
                                
                                
                                 //insert trade record
                                // id 	user_id 	bid_id 	sell_id 	price 	amount 	total 	fee 	trade_datetime 	status
                                $this->db->insert('trades_'.$sell, 
                                    ['price'=>$price,
                                    'amount'=>$amount,
                                    'bidsell'=>'sell',
                                    'user_id'=>$this->session->user_id,
                                    'bid_id'=>$order_id,
                                    'sell_id'=>$row->id,
                                    'total'=>$tot_bid,
                                    'status'=>'processed'
                                    ]
                                    );
                                $trade_id = $this->db->insert_id();
                                if ($this->debug) echo $this->db->last_query();
                                
                                //Buyer fee 
                               $this->db->insert('open_fees',[
                                    'user_id' => $this->session->user_id,
                                    'table'=> 'order_'.$sell,
                                    'table_id' => $order_id,
                                    'trade_id' =>$trade_id,
                                    'fee' => $fee,
                                    'status' => 'open'
                                ]);
                                if ($this->debug) echo $this->db->last_query();
                                
                                //seller fee
                                $this->db->insert('open_fees',[
                                    'user_id' => $row->user_id,
                                    'table'=> 'order_'.$sell,
                                    'table_id' => $row->id,
                                    'trade_id' =>$trade_id,
                                    'fee' => $fee,
                                    'status' => 'open'
                                ]);
                                if ($this->debug) echo $this->db->last_query();
                                
                                //TODO insert trade record sell!
                                //TODO units filled, fee filled etc.
                                //TODO insert FEE record. 

                            }
                            
                            //exit loop if units_filled >= $total
                            if($units_filled >= $total)
                            {
                                break;
                            }
                        }

                        //update order record with units filled
                        if( $units_filled > 0 )
                        {
                            //TODO fully filled? set status!
                            if($units_filled >= $total)
                            {
                                $this->db->query("UPDATE `order_".$sell."` SET `units_filled` = $units_filled , `status` = 'processed' WHERE `id` = " .$order_id);
                            }
                            else $this->db->query("UPDATE `order_".$sell."` SET `units_filled` = $units_filled WHERE `id` = " .$order_id);
                            
                            echo $this->db->last_query();
                            //update balance with units filled
                            //$this->db->where('user_id',$this->session->user_id);
                            //$this->db->query("UPDATE `balance` SET `$sell` = `$sell`+ $units_filled, `pending_$bid` = `pending_$bid` - $bidprice WHERE `user_id` = " .$this->session->user_id);
                            //echo $this->db->last_query();
                        }

                        if ($this->debug) echo 'found order!';
                        
                    }
                    
                
                $this->db->trans_complete();
                
                if ($this->db->trans_status() === FALSE)
                {
                    return 'error';
                }
                else
                    if ($this->debug) return 'processing buy!';
                    return 'succes';
            }
            else 
                return 'balance';
        } 
        
        return 'succes';
    }
    
    
    public function selllimit_order($amount=0, $price=0, $trade_pair='EUR-NLG')
    {
        list($bid, $sell) = explode('-', $trade_pair);
        
        //get balance
        $this->load->model('mdl_balance');
        $balance = $this->mdl_balance->currency_balance();
        if ($this->debug) echo $this->db->last_query();
        if($balance === false)
        {
            return 'balance';
        }
        else
        {
            $total = $amount;
            $sellprice = $price*$amount;
            
            if($total <= $balance->$sell)
            {
                $this->db->trans_start();
                    //1: insert order into order table
                    $this->db->insert('order_'.$sell, 
                            ['price'=>$price,
                            'amount'=>$amount,
                            'type'=>'limit',
                            'bidsell'=>'sell',
                            'user_id'=>$this->session->user_id,
                            $bid=> $sellprice,
                            'total'=>$price*$amount,
                            'fee'=>$total / 100 * FEE,
                            'status'=>'open'
                            ]
                            );
                    $order_id = $this->db->insert_id();
                    if ($this->debug) echo ' sell order_id: ', $order_id;
                    //2: subtract from balance
                    
                    //$this->db->where('user_id',$this->session->user_id);
                    $this->db->query("UPDATE `balance` SET `$sell` = `$sell` - $amount , `pending_$sell` = `pending_$sell` + $amount WHERE `user_id` = " .$this->session->user_id);
                        
                    if ($this->debug) echo $this->db->last_query();
                    
                    
                    //3: check for open sell orders
                    $this->db->where('bidsell','bid');
                    $this->db->where('price >=',$price);
                    $this->db->where('status','open');
                    $this->db->order_by('price', 'asc');
                    $this->db->order_by('order_date', 'desc');
                    $res = $this->db->get('order_'.$sell);
                    if ($this->debug) echo $this->db->last_query();
                    
                    if($res->num_rows() > 0)
                    {
                        $rows = $res->result();
                        $units_filled = 0;
                        $bidprice = 0;
                        //loop all matching sell records
                        foreach($rows as $row)
                        {
                            if ($this->debug) echo 'row:', $row->amount, ' p:', $row->price, ' f:', $row->units_filled, '|';
                            //process until order is filled or end of records
                            $units_left_to_fill = $total - $units_filled;
                            $unit_row = $row->amount - $row->units_filled;
                            
                            if ($this->debug) echo ' $units_left_to_fill:',$units_left_to_fill, ' $unit_row:',$unit_row, '|';
                            if($units_left_to_fill >= $unit_row) //full order
                            {
                                $units_filled += $unit_row;
                                
                                //set sell to processed
                                //$this->db->where('id',$row->id);
                                //$this->db->update('order_'.$sell, ['status'=>'processed', 'units_filled'=>$unit_processed]);
                                $this->db->query("UPDATE `order_".$sell."` SET `units_filled` = `units_filled` + $unit_row , `status`= 'processed' WHERE `id` = " .$row->id);
                                if ($this->debug) echo $this->db->last_query();
                                
                                if ($this->debug) var_dump ($row);
                                //take fee from both BID and SELL record.
                                $bidprice += ($unit_row * $row->price * (100 - FEE) / 100);
                                $tot_bid  = $unit_row * $row->price;
                                $fee = ($unit_row * $row->price) / 100 * FEE;
                                if ($this->debug) echo 'bidprice = ', $bidprice, '| FEE ' , '|', $fee ;
                                
                                //update both seller end bidden balance; Update them without the EUR fee.
                                 //update both seller end bidden balance;
                                $this->db->query("UPDATE `balance` SET `$bid` = `$bid` + $tot_bid , `pending_$sell` = `pending_$sell` - $units WHERE `user_id` = " .$this->session->user_id);
                                if ($this->debug) echo $this->db->last_query();
                                $this->db->query("UPDATE `balance` SET  `$sell` = `$sell` + $units, `pending_$bid` = `pending_$bid` - $tot_bid - $fee WHERE `user_id` = " .$row->user_id);
                                if ($this->debug) echo $this->db->last_query();
                                //insert trade record
                                // id 	user_id 	bid_id 	sell_id 	price 	amount 	total 	fee 	trade_datetime 	status
                                $this->db->insert('trades_'.$sell, 
                                    ['price'=>$price,
                                    'amount'=>$unit_row,
                                    'bidsell'=>'sell',
                                    'user_id'=>$this->session->user_id,
                                    'bid_id'=>$order_id,
                                    'sell_id'=>$row->id,
                                    'total'=>$bidprice,
                                    'status'=>'processed'
                                    ]
                                    );
                                $trade_id = $this->db->insert_id();
                                if ($this->debug) echo $this->db->last_query();
                                
                                //buyer fee
                                $this->db->insert('open_fees',[
                                    'user_id' => $this->session->user_id,
                                    'table'=> 'order_'.$sell,
                                    'table_id' => $order_id,
                                    'trade_id' =>$trade_id,
                                    'fee' => $fee,
                                    'status' => 'open'
                                ]);
                                if ($this->debug) echo $this->db->last_query();
                                
                                //seller fee
                                $this->db->insert('open_fees',[
                                    'user_id' => $row->user_id,
                                    'table'=> 'order_'.$sell,
                                    'table_id' => $row->id,
                                    'trade_id' =>$trade_id,
                                    'fee' => $fee,
                                    'status' => 'open'
                                ]);
                                if ($this->debug) echo $this->db->last_query();
     
                                //TODO insert trade record sell???
                                //TODO units filled, fee filled etc.
                                //TODO insert FEE record. 
                            }
                            else // partial order
                            {
                                
                                $units = $units_left_to_fill;
                                if ($this->debug) echo ' partial order: units: ', $units, '| '; 
                                $bidprice += ($units * $row->price * (100 - FEE) / 100); 
                                if ($this->debug) echo 'bidprice = ', $bidprice, '|';
                                $units_filled += $units;
                                $this->db->query("UPDATE `order_".$sell."` SET `units_filled` = `units_filled` + $units WHERE `id` = " .$row->id);
                                if ($this->debug) echo $this->db->last_query();
                                
                                //take fee from both BID and SELL record.
                                //$bidprice += ($units * $row->price * (100 - FEE) / 100);
                                $tot_bid  = $units * $row->price;
                                $fee = ($units * $row->price) /100 * FEE;
                                
                                if ($this->debug) echo '$tot_bid = ', $tot_bid, '| FEE ' ,$fee, '|units: ', $units, '| ';
                                
                                //update both seller end bidder balance;
                                $this->db->query("UPDATE `balance` SET `$bid` = `$bid` + $tot_bid , `pending_$sell` = `pending_$sell` - $units WHERE `user_id` = " .$this->session->user_id);
                                if ($this->debug) echo $this->db->last_query();
                                $this->db->query("UPDATE `balance` SET  `$sell` = `$sell` + $units, `pending_$bid` = `pending_$bid` - $tot_bid - $fee WHERE `user_id` = " .$row->user_id);
                                if ($this->debug) echo $this->db->last_query();
                                
                                
                                 //insert trade record
                                // id 	user_id 	bid_id 	sell_id 	price 	amount 	total 	fee 	trade_datetime 	status
                                $this->db->insert('trades_'.$sell, 
                                    ['price'=>$price,
                                    'amount'=>$amount,
                                    'bidsell'=>'sell',
                                    'user_id'=>$this->session->user_id,
                                    'bid_id'=>$order_id,
                                    'sell_id'=>$row->id,
                                    'total'=>$tot_bid,
                                    'status'=>'processed'
                                    ]
                                    );
                                $trade_id = $this->db->insert_id();
                                if ($this->debug) echo $this->db->last_query();
                                
                                //Buyer fee 
                               $this->db->insert('open_fees',[
                                    'user_id' => $this->session->user_id,
                                    'table'=> 'order_'.$sell,
                                    'table_id' => $order_id,
                                    'trade_id' =>$trade_id,
                                    'fee' => $fee,
                                    'status' => 'open'
                                ]);
                                if ($this->debug) echo $this->db->last_query();
                                
                                //seller fee
                                $this->db->insert('open_fees',[
                                    'user_id' => $row->user_id,
                                    'table'=> 'order_'.$sell,
                                    'table_id' => $row->id,
                                    'trade_id' =>$trade_id,
                                    'fee' => $fee,
                                    'status' => 'open'
                                ]);
                                if ($this->debug) echo $this->db->last_query();
                                
                                //TODO insert trade record sell!
                                //TODO units filled, fee filled etc.
                                //TODO insert FEE record. 

                            }
                            
                            //exit loop if units_filled >= $total
                            if($units_filled >= $total)
                            {
                                break;
                            }
                        }

                        //update order record with units filled
                        if( $units_filled > 0 )
                        {
                            //TODO fully filled? set status!
                            if($units_filled >= $total)
                            {
                                $this->db->query("UPDATE `order_".$sell."` SET `units_filled` = $units_filled , `status` = 'processed' WHERE `id` = " .$order_id);
                            }
                            else $this->db->query("UPDATE `order_".$sell."` SET `units_filled` = $units_filled WHERE `id` = " .$order_id);
                            
                            if ($this->debug) echo $this->db->last_query();
                            //update balance with units filled
                            //$this->db->where('user_id',$this->session->user_id);
                            //$this->db->query("UPDATE `balance` SET `$sell` = `$sell`+ $units_filled, `pending_$bid` = `pending_$bid` - $bidprice WHERE `user_id` = " .$this->session->user_id);
                            //echo $this->db->last_query();
                        }

                        if ($this->debug) echo 'found sell order!';
                        
                    }
                    
                
                $this->db->trans_complete();
                
                if ($this->db->trans_status() === FALSE)
                {
                    return 'error';
                }
                else
                    //return 'processing sell!';
                    return 'succes';
            }
            else 
                return 'balance';
        } 
        
        return 'succes';
    }
    
   
    
    public function get_bid_orders($market='NLG', $limit=10, $user_id = null)
    {
        $this->db->limit($limit);
        $this->db->where('bidsell', 'bid');
        $this->db->where('status', 'open');
        $this->db->order_by('price', 'asc');
        //$this->db->group_by('price', 'asc');
        return $this->db->get('order_'.$market);
    }
    
    public function get_sell_orders($market='NLG', $limit=10, $user_id = null)
    {
        $this->db->limit($limit);
        $this->db->where('bidsell', 'sell');
        $this->db->where('status', 'open');
        $this->db->order_by('price', 'asc');
        return $this->db->get('order_'.$market);
    }

    public function get_my_orders($market='NLG', $status ='open', $user_id = null,  $limit=10)
    {
        $this->db->limit($limit);
        $this->db->where('status', $status);
        $this->db->where('user_id', $user_id);
        $this->db->order_by('order_date', 'desc');
        return $this->db->get('order_'.$market);
    }

    public function trade_history($market='NLG', $limit=10, $user_id = null)
    {
        $this->db->limit($limit);
        if($user_id) $this->db->where('user_id', $user_id);
        $this->db->where('status', 'processed');
        $this->db->order_by('trade_datetime', 'desc');
        return $this->db->get('trades_'.$market);
    }
}
