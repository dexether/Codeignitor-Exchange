<div class="container">
<div class="row">
    <div class="col-md-12 col-sm-12">
        <div class="cls_top_table table-responsive" id="market-history">
            <h4>Market History</h4>
            <div class="table-responsive cls_trade_table" >
                <table class="table table-striped">
                <thead>
                <tr>
                <th width="13%"> Date  </th>
                <th width="23%">       Buy/Sell</th>
                <th width="17%">           <?php echo $currency_bid; ?>    </th>
                <th width="17%">            Total Units            </th>
                <th width="15%">      Total Cost </th>
                </tr>
                </thead>

                    <?php
                            if(isset($trade_history) && $trade_history->num_rows()>0)
                            {
                                $rows = $trade_history ->result();

                                foreach ($rows as $row) 
                                {

                                    echo '<tr><td>', substr($row->trade_datetime,0,16), '</td><th>',$row->bidsell,
                                    '</th><th>', number_format($row->price,8), '</th><th>', number_format($row->amount,8),
                                    '</th><th>', number_format($row->total,8), '</th></tr>';
                                }
                                echo '</table>';
                            }
                            else {


                                echo '<tr><td colspan="6" >No trade history</td></tr>';

                            }
                            ?>
                </table>

            </div>
        </div>
    </div>
</div>
</div>