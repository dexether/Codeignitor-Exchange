
<div class="modal fade cls_login_fn" id="login" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><img src="<?php echo base_url(); ?>images/close_btn.png" alt=""> </span></button>
        <h4 class="modal-title" id="myModalLabel"> Login Details </h4>
      </div>
      <div class="modal-body">
       <div class="">
       
          <form class="form-horizontal" name="login_form" id="login_form" method="post">
        <div class="form_type">
            <input type="text" id="clientid" name="clientid" placeholder="Email address" for="clientid" class="form-control">
            </div>   
            <div class="form_type">
       <input type="password" class="form-control" placeholder="Password" name="password" id="password" for="password">
            </div>
            <button class="cls_dow_btn btn-block" style="width:100%;"> login</button>
            <div class="clearfix">
            </div>
            
             <span id="error_message" style="color:red;font-size:14px;"></span> 

            <div class="pull-left cont_list mar-top-10">
             <p class="cls_ar-40 "><input type="checkbox" name="checkboxG1" id="checkboxG1" class="css-checkbox" />
<label for="checkboxG1" class="css-label radGroup1">Remember Me </label></p>

            </div>
            
            <div class="pull-right cont_list mar-top-10">
            <a href="#" onclick="forget();">  forgot password ?  </a> 
            </div>
              <div class="clearfix"> </div>
              
        </form>
    </div>
      </div>
     
    </div>
  </div>
</div>
 
<div class="modal fade cls_login_fn" id="myModal_tfa" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><img src="<?php echo base_url(); ?>images/close_btn.png" alt=""> </span></button>
        <h4 class="modal-title" id="myModalLabel"> TFA Confirmation </h4>
      </div>
      <div class="modal-body">
       <div class="">
       
         <form style="margin-top:20px;" class="form-horizontal" name="tfaform" id="tfaform" method="post">
            <div class="form_type">
           <input type="text" class="form-control tfacode" id="tfacode" name="tfacode" placeholder="">
             </div>    
            <button class="cls_dow_btn btn-block tfa_check" style="width:100%;" > Submit</button>
            <div class="clearfix">
            </div> 
        </form>
    </div>
      </div>
     
    </div>
  </div>
</div>


<div class="modal fade cls_login_fn" id="forget" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"><img src="<?php echo base_url(); ?>images/close_btn.png" alt=""> </span></button>
        <h4 class="modal-title" id="myModalLabel"> Password Recovery  </h4>
      </div>
      <div class="modal-body">
       <div class="">
       
         <form style="margin-top:20px;" class="form-horizontal" name="forget_form" id="forget_form" method="post">
        <div class="form_type">
            <input type="text" class="form-control" id="forgetemail" name="forgetemail"placeholder="">
     <span class="cls_info_text"><i>Enter your registered email address!</i></span>
            </div>    
            <button class="cls_dow_btn btn-block" style="width:100%;"> Reset Password</button>
            <div class="clearfix">
            </div> 

             <div id="login_error" style="border-radius: 5px; margin-bottom: 12px;  color: green; font-size: 20px; margin-left: 40px; width: 470px;display:none"></div>
<div id="login_success" style="border-radius: 5px;  margin-bottom: 12px;  color: green; font-size: 20px; margin-left: 40px; width: 470px;display:none">Please check your Email!</div>

        </form>
    </div>
      </div>
     
    </div>
  </div>
</div>
 
