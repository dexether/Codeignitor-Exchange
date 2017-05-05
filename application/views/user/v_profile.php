 <style type="text/css">
  .error{
    color:red !important;
  }
</style>
<div class="cls_main_top">
  <div class="cls_mid_con cls_comm_bg">
    <div class="container">
      <?php $this->load->view('user/v_balance'); ?>
      <div class="row">
        <?php $this->load->view('user/v_aboutsidebar'); ?>
        <div class="col-md-9 col-sm-8">
          <div class="cls_comm_head"> My Profile</div>
          <div class="cls_pro_sec">
            <h3>Personal Information</h3>
            <?php echo form_open('', 'class="form-horizontal" name="personal_form" id="personal_form" method="post"'); ?>
            <div class="form-group">
            </div>
            <div class="form-group">
              <label for="inputEmail3" class=" col-sm-4  col-sm-offset-1  col-md-3  control-label">Name *</label>
              <div class="col-sm-6">
               <div class="row">
                 <div class="col-md-6 col-sm-6">
                  <input type="text" class="form-control" id="firstname" name="firstname" value="<?php echo $profile->firstname; ?>" placeholder="First Name">
                </div>
                <div class="col-md-6 col-sm-6">
                  <input type="text" class="form-control alphavalid" id="lastname" name="lastname" value="<?php echo $profile->lastname; ?>" placeholder="Last Name">
                </div>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="inputEmail3" class=" col-sm-4  col-sm-offset-1  col-md-3  control-label">ID/Passport/SS Number * </label>
            <div class="col-sm-6">
              <input type="text" class="form-control numvalid" id="id_no" name="id_no" value="<?php echo $profile->identity_no; ?>" placeholder="ID / Passport / SS Number">
            </div>
          </div>
          <div class="form-group">
            <label for="inputEmail3" class=" col-sm-4  col-sm-offset-1  col-md-3  control-label">Alternative Phone Number </label>
            <div class="col-sm-6">
              <input type="text" class="form-control numvalid" id="alt_cellno" name="alt_cellno" value="<?php echo $profile->alt_cellno; ?>" placeholder="Alternative Phone Number">
            </div>
          </div>

          <div class="form-group">
            <label for="profilePicture" class=" col-sm-4  col-sm-offset-1  col-md-3  control-label">Profile picture</label>
            <div class="col-sm-6">
              <input type="file" class="form-control numvalid" id="profilePicture" name="profilepicture">
            </div>
          </div>

          <h3>Address</h3>
          <h4> Physical address </h4>
          <div class="form-group">
            <label for="inputEmail3" class=" col-sm-4  col-sm-offset-1  col-md-3  control-label">Street Line 1 * </label>
            <div class="col-sm-6">
             <input type="text" class="form-control" id="street1" name="street1" value="<?php echo $profile->street1; ?>" placeholder="Street Line">
           </div>
         </div>
         <div class="form-group">
          <label for="inputEmail3" class=" col-sm-4  col-sm-offset-1  col-md-3  control-label">Street Line 2</label>
          <div class="col-sm-6">
            <input type="text" class="form-control" id="street2" name="street2" value="<?php echo $profile->street2; ?>" placeholder="Street Line">
          </div>
        </div>
        <div class="form-group">
          <label for="inputEmail3" class=" col-sm-4  col-sm-offset-1  col-md-3  control-label">City * </label>
          <div class="col-sm-6">
            <input type="text" class="form-control" id="city" name="city" value="<?php echo $profile->city; ?>" placeholder="City">
          </div>
        </div>
        <div class="form-group">
          <label for="inputEmail3" class=" col-sm-4  col-sm-offset-1  col-md-3  control-label">Province / State * </label>
          <div class="col-sm-6">
            <input type="text" class="form-control" id="state" name="state" value="<?php echo $profile->state1; ?>" placeholder="Province / State *">
          </div>
        </div>
        <div class="form-group">
          <label for="inputEmail3" class=" col-sm-4  col-sm-offset-1  col-md-3  control-label">Country * </label>
          <div class="col-sm-6">
           <div class="limit_order">
            <select class="form-control" name="country" id="country">
              <option value="">Select country</option>
              <?php
              foreach($country_detail as $country)
              {

                $id = $country->id;
                $country_name = $country->country;
                ?>
                <option value="<?php echo $id; ?>" <?php if($profile->country1==$id) { ?> selected="selected" <?php } ?>><?php echo $country_name; ?></option>

                <?php
              } ?>
            </select>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label for="inputEmail3" class=" col-sm-4  col-sm-offset-1  col-md-3  control-label">Postal / zip code * </label>
        <div class="col-sm-6">
         <input type="text" class="form-control" id="code" name="code" value="<?php echo $profile->zipcode; ?>" placeholder="Postal / zip code">
       </div>
     </div>


     <h4> Postal address </h4>

     <div class="form-group">
      <label for="inputEmail3" class=" col-sm-4  col-sm-offset-1  col-md-3  control-label">Street Line 1 </label>
      <div class="col-sm-6">
       <input type="text" class="form-control" id="line1" name="line1" value="<?php echo $profile->postal_line1; ?>" placeholder="Street Line">
     </div>
   </div>
   <div class="form-group">
    <label for="inputEmail3" class=" col-sm-4  col-sm-offset-1  col-md-3  control-label">Street Line 2</label>
    <div class="col-sm-6">
      <input type="text" class="form-control" id="line2" name="line2" value="<?php echo $profile->postal_line2; ?>" placeholder="Street Line">
    </div>
  </div>
  <div class="form-group">
    <label for="inputEmail3" class=" col-sm-4  col-sm-offset-1  col-md-3  control-label">City  </label>
    <div class="col-sm-6">
      <input type="text" class="form-control" id="postal_city" name="postal_city" value="<?php echo $profile->postal_city; ?>" placeholder="City">
    </div>
  </div>
  <div class="form-group">
    <label for="inputEmail3" class=" col-sm-4  col-sm-offset-1  col-md-3  control-label">Province / State   </label>
    <div class="col-sm-6">
      <input type="text" class="form-control" id="postal_state" name="postal_state" value="<?php echo $profile->postal_state; ?>" placeholder="Province / State * ">
    </div>
  </div>
  <div class="form-group">
    <label for="inputEmail3" class=" col-sm-4  col-sm-offset-1  col-md-3  control-label">Country  </label>
    <div class="col-sm-6">
     <div class="limit_order">
       <select class="form-control" name="postal_country" id="postal_country">
        <option value="">Select country</option>
        <?php
        foreach($country_detail as $country)
        {
          $id = $country->id;
          $country_name = $country->country;
          ?>
          <option value="<?php echo $id; ?>" <?php if($profile->postal_country==$id) { ?> selected="selected" <?php } ?>><?php echo $country_name; ?></option>

          <?php
        } ?>
      </select>
    </div>
  </div>
</div>
<div class="form-group">
  <label for="inputEmail3" class=" col-sm-4  col-sm-offset-1  col-md-3  control-label">Postal / zip code </label>
  <div class="col-sm-6">
    <input type="text" class="form-control " id="postal_code" name="postal_code"
    placeholder="Postal / zip code" value="<?php echo $profile->postal_code; ?>">
  </div>
</div>
<div class="form-group">
  <label for="inputEmail3" class=" col-sm-4  col-sm-offset-2  col-md-3  col-md-offset-2 control-label">&nbsp;</label>
  <div class="col-sm-6">
   <!-- <button type="button" class="cls_dow_btn"> Update Profile </button> -->
   <button type="submit" class="cls_dow_btn" id="personal_update" name="personal_update"> Update Profile </button>
 </div>
</div>
<span id="personal_success" class="alert alert-info" style="display:none;"></span>
<?php echo form_close(); ?>
</div>
</div>
</div>
</div>
</div>
</div>