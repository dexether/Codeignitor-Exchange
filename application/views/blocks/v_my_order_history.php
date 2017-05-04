<div class="container">
<div class="row">
    <div class="col-md-12 col-sm-12">
        <div class="cls_top_table table-responsive">
            <h4>My order history</h4>
            <div class="table-responsive cls_trade_table">
                <table class="table table-striped">
                <thead>
                <tr>
                <th width="13%"> Date  </th>
                <th width="15%">       Buy/Sell</th>
                <th width="20%">           <?php echo $currency_bid; ?>   </th>
                <th width="20%">            Total Units            </th>
                <th width="15%">      Total Cost </th>
                <th width="15%">      Fee </th>
                </tr>
                </thead>
                    <?php
                    //Date 	Buy/Sell 	Bid/Ask 	Total Units (NLG) 	Total Cost (BTC) //
                            if(isset($order_history) && $order_history->num_rows()>0)
                            {
                                $rows = $order_history ->result();

                                foreach ($rows as $row) 
                                {
                                   echo '<tr><td>', substr($row->order_date,0,16), '</td><td>',$row->bidsell,
                                    '</td><td>', $row->$currency_bid,  
                                    '</td><td>', number_format($row->amount,8),
                                    '</td><td>', number_format($row->amount * $row->price, 8),
                                    '</td><td>-', number_format($row->fee, 8),
                                    '</td></tr>';
                                }
                                echo '</table>';
                            }
                            else {


                                echo '<tr><td colspan="6">No orders</td></tr>';

                            }
                            ?>
                </table>
            </div>
        </div>
    </div>
</div>
</div>