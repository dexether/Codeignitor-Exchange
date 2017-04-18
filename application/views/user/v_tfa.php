<div class="modal fade cls_login_fn" id="myModal_tfa" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><img src="<?php echo base_url(); ?>images/close_btn.png" alt=""> </span></button>
        <h4 class="modal-title" id="myModalLabel"> TFA Confirmation </h4>
      </div>
      <div class="modal-body">
       <div class="">
         <?php echo form_open('', 'style="margin-top:20px;" class="form-horizontal" name="tfaform" id="tfaform" method="post"'); ?>
         <div class="form_type">
           <input type="text" class="form-control tfacode" id="tfacode" name="tfacode" placeholder="">
         </div>    
         <button class="cls_dow_btn btn-block tfa_check" style="width:100%;" > Submit</button>
         <div class="clearfix">
         </div> 
         <?php echo form_close(); ?>
       </div>
     </div>
   </div>
 </div>
</div>