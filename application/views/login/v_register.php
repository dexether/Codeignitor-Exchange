<div class="modal fade cls_deposit" id="register" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <?php
    $error=$this->session->flashdata('error');
    if($error!="")  { ?>
    <div class="alert alert-block alert-error fade in">
      <button data-dismiss="alert" class="close" type="button">×</button>
      <h4 class="alert-heading"><?php echo $error;?></h4>
    </div>
    <?php } ?>
    <?php $success=$this->session->flashdata('success');
    if($success!="")  { ?>
    <div class="alert alert-success">
     <button data-dismiss="alert" class="close" type="button">×</button>
     <strong><?php echo $this->lang->line('Well done')?>!</strong> <?php echo $success;?>
   </div>
   <?php } ?>

   <div id="register_success" class="alert alert-success alert-dismissible" role="alert" style="display:none; height:auto;margin-top: 2%;">
    <button style="padding-top:10px;" type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
    <strong>Success!</strong> <span id="successMessage"></span>
  </div>

  <div id="register_error" class="alert alert-danger alert-dismissible" role="alert" style="display:none; height:auto;margin-top: 2%;">
    <button style="padding-top:10px;" type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
    <strong>Oops!</strong> <span id="errorMessage"><?php echo $error; ?></span>
  </div>

  <div class="modal-content">
    <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><img src="<?php echo base_url(); ?>images/close_btn.png" alt=""></span></button>
      <h4 class="modal-title" id="myModalLabel"> Register </h4>
    </div>
    <div class="modal-body">
      <?php echo form_open('', 'name="registering" id="registering" method="post"'); ?>
      <div class="form-group"> 
        <input type="text" class="form-control"  name="email" id="email" placeholder="Email"> 
      </div>
      <div class="form-group">
       <div class="row">
        <div class="col-md-6 col-sm-6">
         <input type="text" class="form-control" id="inputPassword3" name="firstname" placeholder="Firstname">
       </div>
       <div class="col-md-6 col-sm-6">
        <input type="text" class="form-control" id="inputPassword3" name="lastname" id="last_name" placeholder="Lastname">
      </div>
    </div>
  </div> 
  <div class="form-group">
   <div class="row">
     <div class="col-md-6 col-sm-6">
      <input type="password" class="form-control" id="password1" name="password1" placeholder="Password">
    </div>
    <div class="col-md-6 col-sm-6"> 
     <input type="password" class="form-control" id="password2" name="password2" placeholder="Confirm Password">
   </div>
 </div>
 <div class="row">
  <div class="col-md-12 col-sm-12">
    <label>Provide at least one upper case , one lower case , one digit and one special character</label>
  </div>
</div>
</div>
<div class="form-group">
 <div class="row">
   <div class="col-md-6 col-sm-6">
     <div>  Captcha 
       <img src="<?php echo base_url(); ?>site/captcha?rand=<?php echo rand(); ?>" id='captchaimg' ><a href='javascript: refreshCaptcha();' > <img src="<?php echo base_url(); ?>images/refresh.png" width="40" height="40" > </a>  </div>
     </div>
     <div class="col-md-6 col-sm-6"> 
       <input style="width:100%;" type="text" class="form-control" name="recaptcha" placeholder="Enter the Captcha text" value=""/>
       <?php if(form_error('recaptcha')) {?><font color="#CC0000"><?php echo form_error('recaptcha'); ?></font><?php } ?>
     </div>
   </div>
 </div>
 <div class="cont_list mar-top-10">
   <p class="cls_ar-40 ">
     <input type="checkbox" name="terms" id="checkboxG1" class="terms" /> 
     <label for="checkboxG1" class="radGroup1">I accept the <a href="<?php echo base_url();?>/terms"> terms and conditions. </a></label></p>
     <label for="terms" style="display:none;" class="error">This field is required.</label>
   </div>
   <button type="submit" class="cls_dow_btn btn-block" style="width:100%;"> Register </button>
 </form>
</div>
</div>
</div>
</div>
</div>