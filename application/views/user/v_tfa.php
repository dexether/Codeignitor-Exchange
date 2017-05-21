<div class="row">
    <div class="col-md-4 col-md-offset-4">
        <br /><br/><br/><br/><br/>        
        <div class="clearfix"></div>
        <h4> TFA Confirmation </h4>
        <?php
            if($this->session->flashdata('error')){
               echo '<div class="alert alert-danger">'.$this->session->flashdata('error').'</div>';
            }
        ?>
        <?php echo form_open($action, 'style="margin-top:20px;" class="form-horizontal" name="tfaform" id="tfaform" method="post"'); ?>
        <div class="form_type">
            <?php //dump($this->session->all_userdata()); ?>
            <input type="text" class="form-control tfacode" id="tfacode" name="tfacode" placeholder="">
        </div>
        <button class="cls_dow_btn btn-block tfa_check" style="width:100%;"> Submit</button>
        <div class="clearfix"></div>
        <?php echo form_close(); ?>
        <br/>
        <br/>   
        <br/>
    </div>
</div>