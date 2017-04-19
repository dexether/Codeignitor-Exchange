<div class="row">
	<div class="col-lg-3 col-md-5 col-sm-5 col-xs-10 col-xs-offset-1 col-sm-offset-4 col-md-offset-4 col-lg-offset-4 text-center">
		<br>
		<div class="text-center">
			<h1 class="glyphicon glyphicon-lock"></h1>
			<h4> Password Recovery </h4>
			<hr>
			<?php echo isset($alert)?$alert:'' ?>
		</div>
		<?php echo form_open('forget', 'style="margin-top:20px;" class="form-horizontal" name="forget_form" id="forget_form" method="post"'); ?>
		<div class="form_type">
			<?php echo form_error('forgetemail') ?>
			<span class="cls_info_text"><i>Enter your registered email address!</i></span>
			<input type="text" class="form-control" id="forgetemail" name="forgetemail" placeholder="">
		</div>
		<button class="cls_dow_btn btn-block" id="resetBtn" style="width:100%;"> Reset Password</button>
		<div class="clearfix"></div>
		<?php echo form_close(); ?>
		<br>
		<br>
	</div>
</div>