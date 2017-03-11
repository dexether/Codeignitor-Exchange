<style type="text/css">
  .error{
    color:red !important;
  }
</style>

<?php  
if($this->session->flashdata('success')){
  echo '<div class="alert alert-info">'.$this->session->flashdata('success').'</div>';
}
?>

<div class="cls_main_top">
  <div class="cls_mid_con cls_comm_bg">
    <div class="container">
      <?php $this->load->view('user/v_balance'); ?> 

      <div class="row">

        <?php $this->load->view('user/v_aboutsidebar'); ?>
        <div class="col-md-9 col-sm-8">

          <div class="cls_comm_head"> Manage Bank Information </div>
          <div class="cls_change_pass">
            <form class="form-horizontal" name="bandetails_form" id="bandetails_form" method="post">

              <div class="form-group">
               <span id="bandetails_success" class="alert alert-info" style="display:none;"></span>
             </div>

             <div class="form-group">
              <label for="inputEmail3" class=" col-sm-4  col-sm-offset-2  col-md-3  col-md-offset-2 control-label">Bank Details</label>
              <div class="col-sm-6">
                <input type="text" placeholder="Bank Name" id="bankname" name="bankname" class="form-control alphavalid" value="<?php echo $bank->bank_name;?>" > 
              </div>
            </div>


            <div class="form-group">
              <label for="inputEmail3" class=" col-sm-4  col-sm-offset-2  col-md-3  col-md-offset-2 control-label">Bank account type</label>
              <div class="col-sm-6">
                <div class="limit_order">
                 <select class="form-control" name="accounttype" id="accounttype">

                   <option value="USD">EUR</option>
                   <!-- <option value="NGN">NGN</option> -->

                 </select>

               </div>
             </div>
           </div>

           <div class="form-group">
            <label for="inputEmail3" class=" col-sm-4  col-sm-offset-2  col-md-3  col-md-offset-2 control-label">Bank account number *</label>
            <div class="col-sm-6">
             <input type="text" class="form-control numvalid" name="iban" id="iban" placeholder="Bank account number "  value="<?php echo $bank->inter_banking_code; ?>"> 
           </div>
         </div> 

         <div class="form-group">
          <label for="inputEmail3" class=" col-sm-4  col-sm-offset-2  col-md-3  col-md-offset-2 control-label">&nbsp;</label>
          <div class="col-sm-6">
           <button type="submit" class="cls_dow_btn"  id="personal_update" name="personal_update"> UPDATE BANK DETAILS </button> 
         </div>
       </div>


     </form>
     </div>
 </div>
</div> 
</div>
<br>
<br>
</div>
</div>