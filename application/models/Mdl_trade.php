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
        echo $this->db->last_query();
        if($balance === false)
        {
            return 'balance';
        }
        else
        {
            $total = $amount;
            $bidprice = $price*$amount;
            if($bidprice <= $balance->$bid)
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
                            'total'=>$price*$amount,
                            'fee'=>$total / 100 * FEE,
                            'status'=>'open'
                            ]
                            );
                    $order_id = $this->db->insert_id();
                    echo 'order_id: ', $order_id;
                    //2: subtract from balance
                    
                    //$this->db->where('user_id',$this->session->user_id);
                    $this->db->query("UPDATE `balance` SET `$bid` = `$bid`- $bidprice , `pending_$bid` = `pending_$bid` + $bidprice WHERE `user_id` = " .$this->session->user_id);
                        
                    //3: check for open sell orders
                    $this->db->where('bidsell','sell');
                    $this->db->where('price <=',$price);
                    $this->db->where('status','open');
                    $this->db->order_by('order_date', 'desc');
                    $res = $this->db->get('order_'.$bid);
                    echo $this->db->last_query();
                    
                    if($res->num_rows() > 0)
                    {
                        $rows = $res->result();
                        $units_filled = 0;
                        $bidprice = 0;
                        //loop all matching sell records
                        foreach($rows as $row)
                        {
                            echo 'row:', $row->amount, ' p:', $row->price, ' f:', $row->units_filled, '|';
                            //process until order is filled or end of records
                            $units_left_to_fill = $total - $units_filled;
                            $unit_row = $row->amount - $row->units_filled;
                            
                            echo ' $units_left_to_fill:',$units_left_to_fill, ' $unit_row:',$unit_row, '|';
                            if($units_left_to_fill >= $unit_row) //full order
                            {
                                $units_filled += $unit_row;
                                
                                //set sell to processed
                                //$this->db->where('id',$row->id);
                                //$this->db->update('order_'.$bid, ['status'=>'processed', 'units_filled'=>$unit_processed]);
                                $this->db->query("UPDATE `order_".$bid."` SET `units_filled` = `units_filled` + $unit_row , `status`= 'processed' WHERE `id` = " .$row->id);
                                echo $this->db->last_query();
                                
                                
                                //take fee from both BID and SELL record.
                                $bidprice += ($unit_row * $row->price * (100 - FEE) / 100);
                                $tot_bid  = $unit_row * $row->price;
                                $fee = ($unit_row * $row->price) /100 * FEE;
                                echo 'bidprice = ', $bidprice, '| FEE ' , '|';
                                
                                //update both seller end bidden balance; Update them without the EUR fee.
                                $this->db->query("UPDATE `balance` SET `$sell` = `$sell`+ $unit_row, `pending_$bid` = `pending_$bid` - $tot_bid WHERE `user_id` = " .$this->session->user_id);
                                $this->db->query("UPDATE `balance` SET  `$bid` = `$bid` + $tot_bid - $fee, `pending_$sell` = `pending_$sell` - $unit_row WHERE `user_id` = " .$row->user_id);
                                
                                //insert trade record
                                // id 	user_id 	bid_id 	sell_id 	price 	amount 	total 	fee 	trade_datetime 	status
                                $this->db->insert('trades_'.$bid, 
                                    ['price'=>$price,
                                    'amount'=>$unit_row,
                                    'bidsell'=>'sell',
                                    'user_id'=>$this->session->user_id,
                                    'bid_id'=>$order_id,
                                    'sell_id'=>$row->id,
                                    'total'=>$bidprice,
                                    'status'=>1
                                    ]
                                    );
                                $trade_id = $this->db->insert_id();
                                echo $this->db->last_query();
                                
                                //buyer fee
                                $this->db->insert('open_fees',[
                                    'user_id' => $this->session->user_id,
                                    'table'=> 'order_'.$bid,
                                    'table_id' => $order_id,
                                    'trade_id' =>$trade_id,
                                    'fee' => $fee,
                                    'status' => 'open'
                                ]);
                                echo $this->db->last_query();
                                
                                //seller fee
                                $this->db->insert('open_fees',[
                                    'user_id' => $this->session->user_id,
                                    'table'=> 'order_'.$bid,
                                    'table_id' => $row->id,
                                    'trade_id' =>$trade_id,
                                    'fee' => $fee,
                                    'status' => 'open'
                                ]);
                                echo $this->db->last_query();
     
                                //TODO insert trade record sell???
                                //TODO units filled, fee filled etc.
                                //TODO insert FEE record. 
                            }
                            else // partial order
                            {
                                echo ' partial order';
                                $units = $total - $units_filled;
                                
                                $bidprice += ($units * $row->price * (100 - FEE) / 100); 
                                echo 'bidprice = ', $bidprice, '|';
                                $units_filled += $units;
                                $this->db->query("UPDATE `order_".$bid."` SET `units_filled` = `units_filled` + $units WHERE `id` = " .$row->id);
                                echo $this->db->last_query();
                                
                                //take fee from both BID and SELL record.
                                $bidprice += ($units * $row->price * (100 - FEE) / 100);
                                $tot_bid  = $units * $row->price;
                                $fee = ($units * $row->price) /100 * FEE;
                                echo 'bidprice = ', $bidprice, '| FEE ' ,$fee, '|';
                                
                                //update both seller end bidden balance;
                                $this->db->query("UPDATE `balance` SET `$sell` = `$sell`+ $units, `pending_$bid` = `pending_$bid` - $tot_bid WHERE `user_id` = " .$this->session->user_id);
                                $this->db->query("UPDATE `balance` SET  `$bid` = `$bid` + $tot_bid - $fee, `pending_$sell` = `pending_$sell` - $units WHERE `user_id` = " .$row->user_id);
                                
                                
                                 //insert trade record
                                // id 	user_id 	bid_id 	sell_id 	price 	amount 	total 	fee 	trade_datetime 	status
                                $this->db->insert('trades_'.$bid, 
                                    ['price'=>$price,
                                    'amount'=>$amount,
                                    'bidsell'=>'sell',
                                    'user_id'=>$this->session->user_id,
                                    'bid_id'=>$order_id,
                                    'sell_id'=>$row->id,
                                    'total'=>$units,
                                    'status'=>1
                                    ]
                                    );
                                $trade_id = $this->db->insert_id();
                                echo $this->db->last_query();
                                
                                //Buyer fee 
                               $this->db->insert('open_fees',[
                                    'user_id' => $this->session->user_id,
                                    'table'=> 'order_'.$bid,
                                    'table_id' => $order_id,
                                    'trade_id' =>$trade_id,
                                    'fee' => $fee,
                                    'status' => 'open'
                                ]);
                                echo $this->db->last_query();
                                
                                //seller fee
                                $this->db->insert('open_fees',[
                                    'user_id' => $this->session->user_id,
                                    'table'=> 'order_'.$bid,
                                    'table_id' => $row->id,
                                    'trade_id' =>$trade_id,
                                    'fee' => $fee,
                                    'status' => 'open'
                                ]);
                                echo $this->db->last_query();
                                
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
                                $this->db->query("UPDATE `order_".$bid."` SET `units_filled` = $units_filled , `status` = 'processed' WHERE `id` = " .$order_id);
                            }
                            else $this->db->query("UPDATE `order_".$bid."` SET `units_filled` = $units_filled WHERE `id` = " .$order_id);
                            
                            echo $this->db->last_query();
                            //update balance with units filled
                            //$this->db->where('user_id',$this->session->user_id);
                            //$this->db->query("UPDATE `balance` SET `$sell` = `$sell`+ $units_filled, `pending_$bid` = `pending_$bid` - $bidprice WHERE `user_id` = " .$this->session->user_id);
                            echo $this->db->last_query();
                        }

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
    
    public function selllimit_order($amount=0, $price=0, $trade_pair='EUR-NLG')
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
            $total = $amount;
            if($total <= $balance->$sell)
            {
                $this->db->trans_start();
                    //1: insert order into order table
                    $this->db->insert('order_'.$bid, 
                            ['price'=>$price,
                            'amount'=>$amount,
                            'type'=>'limit',
                            'bidsell'=>'sell',
                            'user_id'=>$this->session->user_id,
                            $bid => $price*$amount,
                            'total'=>$price*$amount,
                            'fee'=>$total /100 * FEE,
                            'status'=>'open'
                            ]
                            );
                    $order_id = $this->db->insert_id();
                    echo 'order_id: ', $order_id;
                    //2: subtract from balance
                    
                    //$this->db->where('user_id',$this->session->user_id);
                    $this->db->query("UPDATE `balance` SET `$sell` = `$sell`- $amount, `pending_$sell` = `pending_$sell` + $amount  WHERE `user_id` = " .$this->session->user_id);
                        
                    //3: check for open sell orders
                    $this->db->where('bidsell','bid');
                    $this->db->where('price <=',$price);
                    $this->db->where('status','open');
                    $this->db->order_by('order_date', 'desc');
                    $res = $this->db->get('order_'.$bid);
                    echo $this->db->last_query();
                    
                    if($res->num_rows() > 0)
                    {
                        $rows = $res->result();
                        $units_filled = 0;
                        $bidprice = 0;
                        foreach($rows as $row)
                        {
                            echo 'row:', $row->amount, ' p:', $row->price, ' f:', $row->units_filled, '|';
                            //process until order is filled or end of records
                            $units_left_to_fill = $total - $units_filled;
                            $unit_row = $row->amount - $row->units_filled;
                            
                            echo ' $units_left_to_fill:',$units_left_to_fill, ' $unit_row:',$unit_row, '|';
                            if($units_left_to_fill >= $unit_row) //full order
                            {
                                $units_filled += $unit_row;
                                
                                //set sell to processed
                                //$this->db->where('id',$row->id);
                                //$this->db->update('order_'.$bid, ['status'=>'processed', 'units_filled'=>$unit_processed]);
                                $this->db->query("UPDATE `order_".$bid."` SET `units_filled` = `units_filled` + $unit_row , `status`= 'processed' WHERE `id` = " .$row->id);
                                echo $this->db->last_query();
                                
                                //set fee record
                                
                                
                                $bidprice += ($unit_row * $row->price); 
                                echo 'bidprice = ', $bidprice, '|';
                                // update units filled

                                //insert trade record
                                // id 	user_id 	bid_id 	sell_id 	price 	amount 	total 	fee 	trade_datetime 	status
                                $this->db->insert('trades_'.$bid, 
                                    ['price'=>$price,
                                    'amount'=>$unit_row,
                                    'bidsell'=>'sell',
                                    'user_id'=>$this->session->user_id,
                                    'bid_id'=>$order_id,
                                    'sell_id'=>$row->id,
                                    'total'=>$bidprice,
                                    'status'=>1
                                    ]
                                    );
                                echo $this->db->last_query();
                                //TODO insert trade record sell???
                                //TODO units filled, fee filled etc.
                                //TODO insert FEE record. 
                            }
                            else // partial order
                            {
                                echo ' partial order';
                                $units = $total - $units_filled;
                                
                                $bidprice += ($units * $row->price); 
                                echo 'bidprice = ', $bidprice, '|';
                                $units_filled += $units;
                                $this->db->query("UPDATE `order_".$bid."` SET `units_filled` = `units_filled` + $units WHERE `id` = " .$row->id);
                                
                                echo $this->db->last_query();
                                
                                 //insert trade record
                                // id 	user_id 	bid_id 	sell_id 	price 	amount 	total 	fee 	trade_datetime 	status
                                $this->db->insert('trades_'.$bid, 
                                    ['price'=>$price,
                                    'amount'=>$amount,
                                    'bidsell'=>'sell',
                                    'user_id'=>$this->session->user_id,
                                    'bid_id'=>$order_id,
                                    'sell_id'=>$row->id,
                                    'total'=>$units,
                                    'status'=>1
                                    ]
                                    );
                                echo $this->db->last_query();
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
                                $this->db->query("UPDATE `order_".$bid."` SET `units_filled` = $units_filled , `status` = 'processed' WHERE `id` = " .$order_id);
                            }
                            else $this->db->query("UPDATE `order_".$bid."` SET `units_filled` = $units_filled WHERE `id` = " .$order_id);
                            
                            echo $this->db->last_query();
                            //update balance with units filled
                            //$this->db->where('user_id',$this->session->user_id);
                            $this->db->query("UPDATE `balance` SET `$bid` = `$bid`+ $bidprice, `pending_$bid` = `pending_$bid` - $bidprice , `pending_$sell` = `pending_$sell` - $units_filled WHERE `user_id` = " .$this->session->user_id);
                            echo $this->db->last_query();
                        }

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
    
    public function get_bid_orders($market='EUR', $limit=10, $user_id = null)
    {
        $this->db->limit($limit);
        $this->db->where('bidsell', 'bid');
        $this->db->where('status', 'open');
        return $this->db->get('order_'.$market);
    }
    
    public function get_sell_orders($market='EUR', $limit=10, $user_id = null)
    {
        $this->db->limit($limit);
        $this->db->where('bidsell', 'sell');
        $this->db->where('status', 'open');
        return $this->db->get('order_'.$market);
    }

    public function get_my_orders($market='EUR', $status ='open', $user_id = null,  $limit=10)
    {
        $this->db->limit($limit);
        $this->db->where('status', $status);
        $this->db->where('user_id', $user_id);
        return $this->db->get('order_'.$market);
    }

    public function trade_history($market='EUR', $limit=10, $user_id = null)
    {
        $this->db->limit($limit);
        if($user_id) $this->db->where('user_id', $user_id);
        $this->db->where('status', 'processed');
        return $this->db->get('trades_'.$market);
    }
}
