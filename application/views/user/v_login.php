<div class="row">
    <div class="col-lg-3 col-md-5 col-sm-5 col-xs-10 col-xs-offset-1 col-sm-offset-4 col-md-offset-4 col-lg-offset-4 text-center">
    <br class="clearfix" />
    <br class="clearfix" />
        <h1 class="glyphicon glyphicon-lock margin-top"></h1>
        <h4> Login Details </h4>
        <hr>
        <?php echo form_open('', 'class="form-horizontal" name="login_form" id="login_form" method="post"'); ?>
        <div class="form_type">
            <small class="text-danger"><?php echo form_error('email') ?></small>
            <input type="text" id="email" name="email" placeholder="Email address" for="email" class="form-control">
        </div>
        <div class="form_type">
            <small class="text-danger"><?php echo form_error('password') ?></small>
            <input type="password" class="form-control" placeholder="Password" name="password" id="password"
                   for="password">
        </div>
        <input type="hidden" name="google_rechapatcha" id="googleRechapatcha" value=""/>
        <div class="g-recaptcha" id="gRecaptcha" data-sitekey="6LcYRhoUAAAAAJb2AtcnWgf81NLxhDb7j7_TtKwv"></div>
        <input type='submit' class="cls_dow_btn btn-block" id="loginBtn" style="width:100%;margin-top: 18px" value="Login" /> 
        <div class="clearfix">
        </div>
        <span id="error_message" style="color:red;font-size:14px;"><?php echo $this->session->flashdata('error_message'); ?></span>
        <div class="pull-left cont_list mar-top-10">
            <p class="cls_ar-40 "><input type="checkbox" name="checkboxG1" id="checkboxG1" class="css-checkbox"/>
                <label for="checkboxG1" class="css-label radGroup1">Remember Me </label></p>
        </div>
        <div class="pull-right cont_list mar-top-10">
            <a href="#"> forgot password ? </a>
        </div>
        <div class="clearfix"></div>
        <?php echo form_close(); ?>
        <br class="clearfix" />
        <br class="clearfix" />
    </div>
</div>