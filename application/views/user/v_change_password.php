<style type="text/css">
  .error{
    color:red !important;
  }
</style>
<div class="cls_main_top">
  <div class="cls_mid_con cls_comm_bg">
    <div class="container">
      <div class="row">
        <?php $this->load->view('user/v_aboutsidebar'); ?>
        <div class="col-md-9 col-sm-8">
          <div class="cls_comm_head"> Change password </div>
          <div class="cls_change_pass">
            <?php echo form_open('', 'class="form-horizontal" name="password_form" id="password_form" method="post"'); ?>
              <div class="form-group">
               <span id="password_success" class="alert alert-info" style="display:none;margin:25px;"></span> 
             </div>
             <div class="form-group">
              <label for="inputEmail3" class=" col-sm-4  col-sm-offset-2  col-md-3  col-md-offset-2 control-label"> Your Current Password
              </label>
              <div class="col-sm-6">
                <input type="password" class="form-control" id="oldpassword" name="oldpassword" placeholder="">
              </div>
            </div>
            <div class="form-group">
              <label for="inputEmail3" class=" col-sm-4  col-sm-offset-2  col-md-3  col-md-offset-2 control-label">New Password</label>
              <div class="col-sm-6">
                <input type="password" class="form-control" id="newpassword" name="newpassword" placeholder="">
              </div>
            </div>
            <div class="form-group">
              <label for="inputEmail3" class=" col-sm-4  col-sm-offset-2  col-md-3  col-md-offset-2 control-label">Confirm New Password</label>
              <div class="col-sm-6">
                <input type="password" class="form-control" id="newpassword1" name="newpassword1" placeholder="">
              </div>
            </div> 
            <div class="form-group">
              <label for="inputEmail3" class=" col-sm-4  col-sm-offset-2  col-md-3  col-md-offset-2 control-label">&nbsp;</label>
              <div class="col-sm-6">
               <button type="submit" class="cls_dow_btn" id="password_update" name="password_update">  Update Password </button> 
             </div>
           </div>
         <?php echo form_close(); ?>
       </div>
     </div>
   </div>
 </div>
 <br>
 <br>
</div>
</div>