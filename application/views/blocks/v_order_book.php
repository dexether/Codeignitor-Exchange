<div class="container">
<div class="row">
    <h1>Order book</h1>
<div class="cls_main_top">
    <div class="cls_mid_con cls_comm_bg">
        <div class="container">
            <div class="row">
                <div class="col-md-6 col-sm-6" id="">
                    <div class="cls_top_table cls_trade_table" id="">
                    <h4>Bids</h4>
                        <div class="cls_trade_table">
                            <?php
                            if(isset($bid_orders) && $bid_orders->num_rows()>0)
                            {
                                $rows = $bid_orders ->result();
                                echo '<table class="table table-striped">';
                                echo '<tr><th>Sum</th><th>Total</th><th>Size (', $currency_sell, ')</th><th>Bid (', $currency_bid,')</th></tr>';
                                //Sum 	Total 	Size (NLG) 	Bid (BTC) 
                                $sum = 0;
                                $total = 0;
                                foreach ($rows as $row) 
                                {
                                    $sum += $row->$currency_bid;
                                    echo '<tr><td>', number_format($sum,8), '</td><td>',$row->total,'</td><td>',
                                            number_format($row->amount,8), '</td><td>', 
                                            number_format($row->price,8),'</td></tr>';
                                }
                                echo '</table>';
                            }
                            else {

                                echo '<table class="table table-striped">';
                                echo '<tr><td>No open bids</td></tr>';
                                echo '</table>';
                            }
                            ?>
                        </div>
                        </div>
                </div>


                <div class="col-md-6 col-sm-6" id="">
                    <div class="cls_top_table" id="">
                    <h4>Asks</h4>
                        <div class="cls_trade_table">
                            <?php
                            //ASK (BTC)	SIZE (NLG)	TOTAL	SUM
                            if(isset($sell_orders) && $sell_orders->num_rows()>0)
                            {
                                $rows = $sell_orders ->result();
                                echo '<table class="table table-striped">';
                                echo '<tr><th>Ask (', $currency_bid,')</th><th>Size (', $currency_sell, ')</th><th>Total</th><th>Sum</th></tr>';

                                $sum = 0;
                                $total = 0;
                                foreach ($rows as $row) 
                                {
                                    $sum += ($row->amount) * $row->price;
                                    echo '<tr><td>', number_format($row->price,8), '</td><td>',
                                            number_format(($row->amount),8),'</td><td>', 
                                            number_format(($row->amount) * $row->price,8), '</td><td>', 
                                            number_format($sum,8),'</td></tr>';
                                }
                                echo '</table>';
                            }
                            else {
                                echo '<table class="table table-striped">';
                                echo '<tr><td>No open asks</td></tr>';
                                echo '</table>';
                            }
                            ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</div>
</div>
