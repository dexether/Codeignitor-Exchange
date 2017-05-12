<div class="container">
<div class="row">
  <div class="col-lg-12 col-sm-12 col-lg-offset-0 col-md-12 col-sm-12 col-md-offset-0">
    <div class="cls_balce_box">
      <h3>Euro Withdraw</h3>
      <div class="row">
        <div class="col-md-3 col-sm-3 col-xs-12">
          <div class="cls_hexa_bg"> EUR   </div>
          <div class="cls_hexa_vol"> <?php echo $EUR; ?>  </div>
        </div>
    </div>
    <div class='widthdaw_form'>
        <?php echo form_open('', 'class="form-horizontal" name="login_form" id="login_form" method="post"'); ?>
          <label for='amount'>Withdraw Amount</label>
          <input type="number" name='amount' step='0.01' max='<?php echo $EUR; ?>' placeholder='0.00'>
          <button name='withdraw' value='1'>Withdraw</button>
        <?php echo form_close(); ?>
        <?php echo ( isset($alert)? $alert : '' ); ?>
    </div>
  </div>
</div>
</div>

</div>