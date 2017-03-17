  <!DOCTYPE html>
  <html lang="en"> 
  <head>
    <meta charset="utf-8" />
    <?php $admin = $this->admin_model->get_admindetails(); 
    if($admin)
    {
      $company_name = $admin->company_name;
    }
    else
    {
      $company_name = "";
    }

    ?>
    <link rel="shortcut icon" type="image/x-icon" href="<?php echo base_url(); ?>assets/images/fav.ico">
    <title><?php echo $company_name; ?> Admin</title>
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <meta content="" name="description" />
    <meta content="" name="author" />
    <link href="<?php echo base_url();?>css/bootstrap.min.css" rel="stylesheet" />
    <link href="<?php echo base_url();?>css/font-awesome.css" rel="stylesheet" />
    <link href="<?php echo base_url();?>css/login/style.css" rel="stylesheet" />
    <link href="<?php echo base_url();?>css/style_responsive.css" rel="stylesheet" />
    <link href="<?php echo base_url();?>css/style_default.css" rel="stylesheet" id="style_color" />
    <script src="<?php echo base_url();?>js/jquery.min.js"></script>
    <script src="<?php echo base_url();?>js/jquery.ufvalidator-1.0.4.js"></script>
  </head>
  <body id="login-body">
    <div class="login-header">
      <div id="logo" class="center">
        <h2><?php echo $company_name; ?></h2>
      </div>
    </div>
    <div id="login">
      <!-- BEGIN LOGIN FORM -->
      <?php $attribute = array('class'=>'form','id' => 'loginform','name' => 'loginform'); ?>
      <?php echo form_open_multipart('admin/index',$attribute); ?>
      <?php $cookie_uname = $this->input->cookie('remember_uname'); 	
      $cookie_passwd = $this->input->cookie('remember_passwd'); 	
      $cookie_remember = $this->input->cookie('rememberme'); 	
      ?>
      <div class="lock">
        <i class="icon-lock"></i>
      </div>
      <div class="control-wrap">
        <h4>Admin Login</h4>
        <div class="control-group">
          <div class="controls">
            <div class="input-prepend">
              <span class="add-on"><i class=" icon-user"></i></span><input name="username" type="text" placeholder="Username" style="width:187px" class="" minlength="" maxlength="" />
            </div>
          </div>
          <div><font color="#CC0000"><?php echo form_error('username'); ?></font></div>
        </div>

        <div class="control-group">
          <div class="controls">
            <div class="input-prepend">
              <span class="add-on"><i class="icon-key"></i></span><input id="input-password" type="password" style="width:187px" name="password" class="input req-both"  placeholder="Password" />
            </div>
            <?php if(isset($invalid)) { echo $invalid; } ?>
            <div><font color="#CC0000"><?php echo form_error('password'); ?></font></div> 


            <div class="mtop10"> 
              <div class="block-hint pull-right">
                <a href="javascript:;" class="input req-both" id="forget-password">Forgot Password?</a>
              </div>
            </div>
            <div class="clearfix space5"></div>
          </div>

        </div>
      </div>
      <div id="errorDiv1" class="error-div"></div>
      <?php 
      $pwd=$this->session->flashdata('pwd');									
      if($pwd)	{	?> 
      <div class="alert alert-success">
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        <strong>Success! </strong> <?php echo $pwd;?>.
      </div><?php }?>
      <input type="submit" id="submitBtn1" name="submit" class="btn btn-block" value="Login" />

    </form>
    <!-- END LOGIN FORM -->        
    <!-- BEGIN FORGOT PASSWORD FORM -->
    <?php $attribute=array('class'=>'form hide','id' => 'forgotform','name' => 'forgotform'); ?>
    <?php echo form_open_multipart('',$attribute); ?>
    <p class="center">Enter your e-mail address below to reset your password.</p>
    <div class="control-group">
      <div class="controls">
        <div class="input-prepend">
          <span class="add-on"><i class="icon-envelope"></i></span>
          <input id="forgotemail" type="text" name="emailid"  placeholder="Email"  class="input req-email"/>
        </div>
      </div>
      <div class="block-hint pull-right">
        <a href="<?php echo base_url();?>admin/index" class="input req-both" id="forget-password">Admin Login</a>
      </div>
      <div class="space20"></div>
    </div>
    <div id="errorDiv2" class="error-div"></div>
    <span id="ajaxerror" style="color:red"></span>
    <span id="ajaxsuccess" style="color:green"></span>
    <input type="button" id="forgot"  class="btn btn-block login-btn" value="Submit" />
  </form>
</div>
<div id="login-copyright">
  <?php echo date('Y');?> &copy; <?php echo $company_name; ?> Admin Dashboard.
</div>

<script src="<?php echo base_url();?>js/bootstrap.min.js"></script>
<script>
  jQuery(document).ready(function() {     
    App.initLogin();
  });
  // $(function () {
  // $('#submitBtn1').formValidator({
  // onSuccess	: function() { $('#loginform').submit(); },
  // scope		: '#loginform',
  // errorDiv	: '#errorDiv1'
  // });
  // });
  $(function () {

  // forgot function
  $('#forgot').formValidator({

    onSuccess	: function() 
    { 
      var value=$('#forgotemail').val();
      var dataString='emailid='+value;
      $.ajax({
        type: 'POST',
        url: '<?php echo base_url(); ?>admin/admin_forgetpswd', 
        data: dataString,
        success: function(res)
        {
          $('#forgotemail').val('');
          if(res.trim()=="invalid")
          {
            $('#ajaxsuccess').hide();
            $('#ajaxerror').show();
            $('#ajaxerror').html("Invalid Email id");
          }
          else
          {
            $('#ajaxerror').hide();
            $('#ajaxsuccess').show();
            $('#ajaxsuccess').html("Admin credentials were sent to your email");
          }
        }
      });
      return false;
    },
    scope		: '#forgotform',
    errorDiv	: '#errorDiv2'
  });

});

</script>
<!-- END JAVASCRIPTS -->
</body>
<!-- END BODY -->
</html>