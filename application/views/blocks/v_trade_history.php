<div class="container">
<div class="row">
    <div class="col-md-12 col-sm-12">
        <div class="cls_top_table table-responsive">
            <h4>Market History</h4>
            <div class="table-responsive cls_trade_table">
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

                                    echo '<tr><td>', $row->creationdate, '</td><th>',$row->bidsell,
                                    '</th><th>', $row->$currency_bid, '</th><th>', $row->amount,
                                    '</th><th>', $row->total, '</th><th>', $row->amount * $row->price,
                                    '</th></tr>';
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