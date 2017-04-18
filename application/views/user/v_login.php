    <div class="row">
     <div class="col-lg-3 col-lg-offset-4 text-center">
      <h1 class="glyphicon glyphicon-lock margin-top"></h1>
      <h4 > Login Details </h4>
      <hr>
      <?php echo form_open('', 'class="form-horizontal" name="login_form" id="login_form" method="post"'); ?>
      <div class="form_type">
        <input type="text" id="clientid" name="email" placeholder="Email address" for="email" class="form-control">
      </div>   
      <div class="form_type">
       <input type="password" class="form-control" placeholder="Password" name="password" id="password" for="password">
     </div>
     <input type="hidden" name="google_rechapatcha" id="googleRechapatcha" value="" />
     <div class="g-recaptcha" id="gRecaptcha" data-sitekey="6LcYRhoUAAAAAJb2AtcnWgf81NLxhDb7j7_TtKwv"></div>
     <button class="cls_dow_btn btn-block" id="loginBtn" style="width:100%;margin-top: 18px"> login</button>
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
      <?php echo form_close(); ?>
    </div>
  </div>