<div class="row">
    <div class="col-lg-5 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-offset-1 col-xs-10">
        <br>
        <div class="text-center">
            <h1 class="text-center"><i style="font-size: 2em" class="glyphicon glyphicon-user"></i></h1>
            <h4>Register</h4>
        </div>
        <hr/>
        <?php echo $alert; ?>
        <?php echo form_open('', 'name="registering" id="registering" method="post"'); ?>
        <div class="form-group">
            <input type="text" class="form-control" name="email" id="email" placeholder="Email">
        </div>
        <div class="form-group">
            <div class="row">
                <div class="col-md-6 col-sm-6 col-xs-6">
                    <input type="text" class="form-control" id="inputPassword3" name="firstname"
                           placeholder="Firstname">
                </div>
                <div class="col-md-6 col-sm-6 col-xs-6">
                    <input type="text" class="form-control" id="inputPassword3" name="lastname" id="last_name"
                           placeholder="Lastname">
                </div>
            </div>
        </div>
        <div class="form-group">
            <div class="row">
                <div class="col-md-6 col-sm-6 col-xs-6">
                    <input type="password" class="form-control" id="password1" name="password1"
                           placeholder="Password">
                </div>
                <div class="col-md-6 col-sm-6 col-xs-6">
                    <input type="password" class="form-control" id="password2" name="password2"
                           placeholder="Confirm Password">
                </div>
            </div>
            <div class="row">
                <div class="col-md-12 col-sm-12 col-xs-12">
                    <label>Provide at least one upper case , one lower case , one digit and one special
                        character</label>
                </div>
            </div>
        </div>
        <div class="form-group">
            <div class="row">
                <div class="col-md-6 col-sm-6 col-xs-6">
                    <div> Captcha
                        <img src="<?php echo base_url(); ?>site/captcha?rand=<?php echo rand(); ?>"
                             id='captchaimg'><a href='javascript: refreshCaptcha();'> <img
                                    src="<?php echo base_url(); ?>images/refresh.png" width="40" height="40">
                        </a></div>
                </div>
                <div class="col-md-6 col-sm-6 col-xs-6">
                    <input style="width:100%;" type="text" class="form-control" name="recaptcha"
                           placeholder="Enter the Captcha text" value=""/>
                </div>
            </div>
        </div>
        <div class="cont_list mar-top-10">
            <p class="cls_ar-40 ">
                <input type="checkbox" name="terms" id="checkboxG1" class="terms"/>
                <label for="checkboxG1" class="radGroup1">I accept the <a
                            href="<?php echo base_url(); ?>/terms"> terms and conditions. </a></label></p>
            <label for="terms" style="display:none;" class="error">This field is required.</label>
        </div>
        <button type="submit" class="cls_dow_btn btn-block" style="width:100%;"> Register</button>
        <br>
        </form>
        <br>
    </div>
</div>