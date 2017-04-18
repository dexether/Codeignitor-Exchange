<div class="container">
<div class="row">
    <h1>Order book</h1>
<div class="cls_main_top">
    <div class="cls_mid_con cls_comm_bg">
        <div class="container">
            <div class="row">
                <div class="col-md-6 col-sm-6" id="">
                    <h4>Bids</h4>
                    <?php
                    if(isset($bid_orders) && $bid_orders->num_rows()>0)
                    {
                        $rows = $bid_orders ->result();
                        echo '<table>';
                        echo '<tr><th>Sum</th><th>Total</th><th>Size (', $currency_sell, ')</th><th>Bid (', $currency_bid,')</th></tr>';
                        //Sum 	Total 	Size (NLG) 	Bid (BTC) 
                        $sum = 0;
                        $total = 0;
                        foreach ($rows as $row) 
                        {
                            $sum += $row->$currency_bid;
                            echo '<tr><td>', $sum, '</td><th>',$row->$currency_bid,'</th><th>', $row->amount, '</th><th>', $row->price,')</th></tr>';
                        }
                        echo '</table>';
                    }
                    else {
                        echo 'No open bids';
                    }
                    ?>
                </div>
            </div>
        </div>
    </div>
    
    <div class="cls_mid_con cls_comm_bg">
        <div class="container">
            <div class="row">
                <div class="col-md-6 col-sm-6" id="">
                    <h4>Bids</h4>
                </div>
            </div>
        </div>
    </div>
</div>
</div>
</div>
