<div class="modal fade cls_login_fn" id="forget" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><img src="<?php echo base_url(); ?>images/close_btn.png" alt=""> </span></button>
        <h4 class="modal-title" id="myModalLabel"> Password Recovery  </h4>
      </div>
      <div class="modal-body">
       <div class="">
         <?php echo form_open('', 'style="margin-top:20px;" class="form-horizontal" name="forget_form" id="forget_form" method="post"'); ?>
         <div class="form_type">
          <input type="text" class="form-control" id="forgetemail" name="forgetemail"placeholder="">
          <span class="cls_info_text"><i>Enter your registered email address!</i></span>
        </div>    
        <button class="cls_dow_btn btn-block" style="width:100%;"> Reset Password</button>
        <div class="clearfix">
        </div> 
        <div id="login_error" style="border-radius: 5px; margin-bottom: 12px;  color: green; font-size: 20px; margin-left: 40px; width: 470px;display:none"></div>
        <div id="login_success" style="border-radius: 5px;  margin-bottom: 12px;  color: green; font-size: 20px; margin-left: 40px; width: 470px;display:none">Please check your Email!</div>
        <?php echo form_close(); ?>
      </div>
    </div>

  </div>
</div>
</div>