<?php  defined('BASEPATH') OR exit('No direct script access allowed'); 
//unknown vars:

//to get csrf
echo form_open();
echo form_hidden('market', $market);
echo form_close();

$pro = 0;
$buy_rate = 0;
$trade_comm = 0.25;
list($bid,$sell) = explode('-', $market);
$available_bid = isset($balance->$bid)?$balance->$bid : 0;
$available_sell = isset($balance->$sell)?$balance->$sell : 0;
$sell_rate = 0;

echo '<script>FEE = \'', FEE , '\';</script>'
?>

<div class="container">
<div class="row">
<div class="cls_main_top">
    <div class="cls_mid_con cls_comm_bg">
        <div class="container">
            <div class="row">
                <div class="col-md-6 col-sm-6" id="">
                    <div class="cls_buy_coin">
                        <h4> Buy <?php echo $currency_sell; ?> </h4>
                            <?php 
                                echo form_hidden('currency_bid', $currency_bid);
                                echo form_hidden('currency_sell', $currency_sell);
                            ?>
                            <div class="cls_buy_coin_inn">
                                <div class="row">
                                    <div class="col-md-6 col-sm-6">
                                        <div class="limit_order">
                                            <select name="order" id="buyorder">
                                                <option value="limit"selected="selected">Limit Order</option>
                                                <option value="stop">Stop Order</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="cls_ac_ba"> Available <?php echo $currency_bid; ?>: 
                                            <b><?php echo number_format((float)$available_bid, 8, '.', ''); ?></b>
                                        </div>
                                    </div>
                                </div>
                                <div id="register_success_limit" class="alert alert-success alert-dismissible" role="alert" style="display:none; height:auto;">
                                    <button style="padding-top:10px;" type="button" class="close" data-dismiss="alert">
                                        <span aria-hidden="true">&times;</span>
                                        <span class="sr-only">Close</span>
                                    </button>
                                    <span id="successMessage_limit"></span>
                                </div>
                                <div id="register_error" class="alert alert-danger alert-dismissible" role="alert" style="display:none; height:auto;">
                                    <button style="padding-top:10px;" type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                                    <strong>Oops!</strong> <span id="errorMessage"><?php echo isset($error)?$error:''; ?></span>
                                </div>
                                <div id="buylimit_order">
                                    <div class="cls_line_sep"> </div>
                                    <div class="row">
                                        <div class="col-md-6 col-sm-6">
                                            <div class="form-group">
                                                <label for="exampleInputEmail1">Amount to Buy</label>
                                                    <input type="text" name="amount" class="form-control numvalid" id="b_btc" maxlength="20">
                                                    <small> <?php echo $currency_sell; ?>  </small>
                                            </div>
                                        </div>
                                        <div class="col-md-6 col-sm-6">
                                            <div class="form-group">
                                                <label for="exampleInputEmail1">Buy Price :</label>
                                                <input type="text" name="price" class="form-control numvalid"  id="b_price" maxlength="15" placeholder="" value="<?php echo $buy_rate; ?>">
                                                <small> <?php echo $currency_bid; ?> </small>
                                            </div>
                                        </div>
                                    </div>
                                    <form class="form-horizontal cls_as">
                                    <div class="form-group">
                                        <label for="inputEmail3" class="col-sm-4 control-label"> Total </label>
                                        <div class="col-sm-8">
                                            <span id="b_all" class="form-control cls_input_bal" style="padding:10.5px 12px; border:1px solid #dcdcdc; display:block;">0.00000000</span>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="inputEmail3" class="col-sm-4 control-label"> Fee </label>
                                        <div class="col-sm-8">
                                            <span id="" class="form-control cls_input_bal" style="padding:10.5px 12px; border:1px solid #dcdcdc; display:block;"><?php echo $trade_comm;?>%</span>
                                        </div>
                                    </div>
                                    <div class="form-group" style="display:none" id="buy_consecutive">
                                        <label for="inputEmail3" class="col-sm-5 control-label">Total Sell if executed price :</label><!-- <a href="#" class="pull-right"> (Advanced)</a> -->
                                        <div class="col-sm-5">
                                            <input type="text" <?php echo $pro; ?> class="form-control numvalid" id="buy_execute_price" name="buy_execute_price" maxlength="15" placeholder="" value="">
                                        </div>
                                        <div class="col-sm-2 pad-no"> <?php echo $currency_sell; ?></div>
                                    </div> 
                                    <div id="b_comm" class="click_sum" style="height: 35px;font-weight: bold; color:red"></div>
                                        <input type="hidden" name="b_fee" id="b_fee" value="" >
                                        <div class="cls_line_bot"> </div>
                                    <div align="center" class=""><button type="button" id="buy_button" class="cls_buy_btn"> Buy <?php echo $currency_sell; ?> </button> </div>
                                    </form>
                                </div>
                                <div id="buystop_order" style="display:none;">
                                    <div class="cls_line_sep"> </div>
                                    <div class="row">
                                        <div class="col-md-6 col-sm-6">
                                            <div class="form-group">
                                                <label for="exampleInputEmail1">Amount to BUY</label>
                                                <input type="text" <?php echo $pro; ?> class="form-control numvalid" maxlength="15"  id="bb_btc">
                                                <small> <?php echo $currency_sell; ?>  </small>
                                            </div>
                                        </div>
                                        <div class="col-md-6 col-sm-6">
                                            <div class="form-group">
                                                <label for="exampleInputEmail1">If price rises to <?php echo $currency_sell; ?></label>
                                                <input type="text"  <?php echo $pro; ?> class="form-control numvalid"  maxlength="15" value="<?php echo $buy_rate; ?>"  id="bb_price">
                                                <small> <?php echo $currency_bid; ?> </small>
                                            </div>
                                        </div>
                                    </div>
                                    <form class="form-horizontal cls_as">
                                    <div class="form-group">
                                        <div class="col-sm-8">
                                            <ul>
                                                <li>
                                                    <span class="name" style="font-size:12px;">Trailing stop</span>
                                                    <span class="pull-right" style="margin-top: -8px; text-align:right;">
                                                        <div class="checkbox">
                                                            <input type="checkbox" name="buytrailing_stop" id="buytrailing_stop" value="trailing_stop" >
                                                        </div>
                                                    </span>
                                                </li>
                                            </ul>
                                      </div>
                                    </div> 
                                    <div id="b_comm1" class="click_sum" style="height: 35px;font-weight: bold; color:red"></div>
                                    <input type="hidden" name="b_fee" id="b_fee" value="" >
                                    <div class="cls_line_bot"> </div>
                                    <div align="center" class=""><button type="button" id="buy_button_stop" class="cls_buy_btn" onclick="return rambo_calculate('buy');" > Buy <?php echo $currency_sell; ?> </button> </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                
                <!--         Sell Order     -->
                <div class="col-md-6 col-sm-6" id="">
                    <div class="cls_buy_coin">
                        <h4> Sell <?php echo $currency_sell; ?> </h4>
                        <div class="cls_buy_coin_inn">
                            <div class="row">
                                <div class="col-md-6 col-sm-6">
                                    <div class="limit_order"><select name="sellorder" id="sellorder"  ><option value="limit" selected="selected">Limit Order (Advanced)</option>
                                            <option value="stop">Stop Order (Advanced)</option></select> </div>
                                </div>
                                <div class="col-md-6 col-sm-6">
                                    <div class="cls_ac_ba"> Available <?php echo $currency_sell; ?>: <b><?php echo number_format((float) $available_sell, 8, '.', ''); ?>  </b> </div>
                                </div>
                            </div>

                            <div id="register_success1_limit" class="alert alert-success alert-dismissible" role="alert" style="display:none; height:auto;">
                                <button style="padding-top:10px;" type="button" class="close" data-dismiss="alert">
                                    <span aria-hidden="true">&times;</span>
                                    <span class="sr-only">Close</span>
                                </button>
                                <span id="successMessage1_limit"></span>
                            </div>

                            <div id="register_error" class="alert alert-danger alert-dismissible" role="alert" style="display:none; height:auto;">
                                <button style="padding-top:10px;" type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                                <strong>Oops!</strong> <span id="errorMessage"><?php echo $error; ?></span>
                            </div>

                            <div id="selllimit_order">
                                <div class="cls_line_sep"> </div>

                                <div class="row">
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Amount to Sell</label>
                                            <input type="text" <?php echo $pro; ?> class="form-control numvalid" id="s_btc" maxlength="20" >
                                            <small> <?php echo $currency_sell; ?>  </small>

                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Sell price :</label>
                                            <input type="text" <?php echo $pro; ?> class="form-control numvalid" id="s_price" maxlength="15" placeholder="" value="<?php echo $sell_rate; ?>" >
                                            <small> <?php echo $currency_bid; ?> </small>
                                        </div>
                                    </div>
                                </div>

                                <form class="form-horizontal cls_as">
                                    <div class="form-group">
                                        <label for="inputEmail3" class="col-sm-4 control-label"><?php echo $currency_bid; ?> to Receive </label>
                                        <div class="col-sm-8">
                                            <span id="s_all" class="form-control cls_input_bal" style="padding:10.5px 12px; border:1px solid #dcdcdc; display:block;">0.00000000</span>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="inputEmail3" class="col-sm-4 control-label"> Fee </label>
                                        <div class="col-sm-8">
                                            <span id="" class="form-control cls_input_bal" style="padding:10.5px 12px; border:1px solid #dcdcdc; display:block;"><?php echo $trade_comm; ?>%</span>
                                        </div>
                                    </div>

                                    <div class="form-group" style="display:none" id="sell_consecutive">
                                        <label for="inputEmail3" class="col-sm-5 control-label">Total Sell if executed price :</label><!-- <a href="#" class="pull-right"> (Advanced)</a> -->
                                        <div class="col-sm-5">
                                            <input type="text" <?php echo $pro; ?> class="form-control numvalid" id="sell_execute_price" name="buy_execute_price" maxlength="15" placeholder="" value="">
                                            <!-- <span class="amount">USD</span> -->
                                        </div>
                                        <div class="col-sm-2 pad-no"> <?php echo $currency_sell; ?></div>
                                    </div>

                                    <div id="s_comm" class="click_sum" style="height: 35px;font-weight: bold; color:red"></div>
                                    <input type="hidden" name="s_fee" id="s_fee" value="" >

                                    <div class="cls_line_bot"> </div>
                                    <div align="center" class=""><button type="button" id="sell_button" class="cls_buy_btn" onclick="return rambo_calculate_limit('sell');" > Sell <?php echo $currency_sell; ?> </button> </div>
                                </form>

                            </div>

                            <div id="sellstop_order" style="display:none;">
                                <div class="cls_line_sep"> </div>

                                <div class="row">
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Amount to Sell</label>
                                            <input type="text" <?php echo $pro; ?> class="form-control numvalid" maxlength="15"  id="ss_btc">
                                            <small> <?php echo $currency_sell; ?>  </small>

                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            <label for="exampleInputEmail1">Sell Price rises to :</label>
                                            <input type="text"  <?php echo $pro; ?> class="form-control numvalid"  maxlength="15" value="<?php echo $sell_rate; ?>"  id="ss_price">
                                            <small> <?php echo $currency_sell; ?> </small>
                                        </div>
                                    </div>
                                </div>

                                <form class="form-horizontal cls_as">
                                    <div class="form-group">
                                        <div class="col-sm-8">
                                            <ul ><li ><span class="name" style="font-size:12px;">Trailing stop</span><span class="pull-right" style="margin-top: -8px; text-align:right;"><div class="checkbox">
                                                            <input type="checkbox" value="trailing_stop" name="selltrailing_stop" id="selltrailing_stop">
                                                        </div></span></li></ul>
                                        </div>
                                    </div> 
                                    <div id="s_comm1" class="click_sum" style="height: 35px;font-weight: bold; color:red"></div>
                                    <input type="hidden" name="s_fee" id="s_fee" value="" >

                                    <div class="cls_line_bot"> </div>
                                    <div align="center" class=""><button type="button" id="stop_buy_button" class="cls_buy_btn" onclick="return rambo_calculate('sell');" > Sell <?php echo $currency_sell; ?> </button> </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <!--         Sell Order     -->
            </div>
        </div>
    </div>
</div>
</div>
</div>
