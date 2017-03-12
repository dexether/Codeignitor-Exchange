<?php
$customer_user_id = $this->session->user_id;
$eur_bal = $this->balance->fetch_user_balance_by_id($customer_user_id,'EUR');
$nlg_bal = $this->balance->fetch_user_balance_by_id($customer_user_id,'NLG');
$gts_bal = $this->balance->fetch_user_balance_by_id($customer_user_id,'GTS'); 
$value = $this->balance->currency_balance();
$valEUR = @$value->EUR;
$valNLG = @$value->NLG;
$valGTS = @$value->GTS; 
?>
<div class="row">
  <div class="col-lg-12 col-sm-12 col-lg-offset-0 col-md-12 col-sm-12 col-md-offset-0">
    <div class="cls_balce_box">
      <h3>Your Balance</h3>
      <div class="row">
       <div class="col-md-3 col-sm-3 col-xs-12">
        <div class="cls_hexa_bg"> EUR   </div>
        <div class="cls_hexa_vol"> <?php echo $valEUR; ?>  </div>
      </div>

      <div class="col-md-3 col-sm-3 col-xs-12">
        <div class="cls_hexa_bg"> NLG   </div>
        <div class="cls_hexa_vol"> <?php echo $valNLG; ?>  </div>
      </div>

      <div class="col-md-3 col-sm-3 col-xs-12">
        <div class="cls_hexa_bg"> GTS   </div>
        <div class="cls_hexa_vol"><?php echo $valGTS; ?> </div>
      </div>
    </div>
  </div>
</div>
</div>