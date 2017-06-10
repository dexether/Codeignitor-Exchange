<div class="container">
<div class="row">
    <div class="col-md-12 col-sm-12">
        <div class="cls_top_table table-responsive">
            <h4>My open orders</h4>
            <div class="table-responsive cls_trade_table">
                <table class="table table-striped" id="table-open">
                <thead>
                <tr>
                <th width="13%"> Date  </th>
                <th width="15%">       Buy/Sell</th>
                <th width="17%">           <?php echo $currency_bid; ?>   </th>
                <th width="17%">            Units filled            </th>
                <th width="17%">            Total Units            </th>
                <th width="15%">      Total Cost </th>
                <th width="20px">&nbsp;</th>
                </tr>
                </thead>
                    <?php
                    //Date 	Buy/Sell 	Bid/Ask 	Total Units (NLG) 	Total Cost (BTC) //
                            if(isset($my_open_orders) && $my_open_orders->num_rows()>0)
                            {
                                $rows = $my_open_orders ->result();

                                foreach ($rows as $row) 
                                {
                                   echo '<tr><td>', substr($row->order_date,0,16), '</td><td>',$row->bidsell,
                                    '</td><td>', $row->price, '</td><td>', 
                                    number_format($row->units_filled, 8),     
                                    '</td><td>', number_format($row->amount,8),
                                    '</td><td>', number_format($row->total,8), 
                                    '</td><td class="delete" data-mooid="' ,$row->id ,'">
                                        <img src="/images/cross.png" style="width: 20px;">',    
                                    '</td></tr>';
                                }
                                echo '</table>';
                            }
                            else {
                                echo '<tr><td colspan="7">No orders</td></tr>';
                            }
                            ?>
                </table>
            </div>
        </div>
    </div>
</div>
</div>