<style type="text/css">
	.error{
		color:red !important;
	}
</style>

<?php  
if($this->session->flashdata('success')){
	echo '<div class="alert alert-success">'.$this->session->flashdata('success').'</div>';
}
?>
<?php  
if($this->session->flashdata('errors')){
	echo '<div class="alert alert-danger">'.$this->session->flashdata('errors').'</div>';
}
?>
<div class="cls_main_top">
	<div class="cls_mid_con cls_comm_bg">
		<div class="container">

			<div class="row">

				<?php $this->load->view('user/v_aboutsidebar'); ?>
				<div class="col-md-9 col-sm-8">
					<div class="cls_comm_head"> Trade verification </div>
					<div class="cls_change_pass">
						<?php echo form_open_multipart('','class="form-horizontal" name="bandetails_form" id="bandetails_form" enctype="multipart/form-data" method="post"') ?>
						<div class="form-group">
							<span id="bandetails_success" class="alert alert-info" style="display:none;"></span>
						</div>
						<div class="form-group">
							<label for="Status" class=" col-sm-4  col-sm-offset-2  col-md-3  col-md-offset-2 control-label">Status</label>
							<div class="col-sm-6">
								<?php if (isset($bank->verification_trade)): ?>
									<?php if ($bank->verification_trade == 'unverified' OR $bank->verification_trade == 'in_progress'): ?>
										<?php echo $bank->verification_trade ?>
									<?php else: ?>
										<b class="text-success">
											<?php echo $bank->verification_trade ?>
										</b>
									<?php endif; ?>
								<?php else: ?>
									unverified
								<?php endif; ?>
							</div>
						</div>
						<div class="form-group">
							<label for="passport" class=" col-sm-4  col-sm-offset-2  col-md-3  col-md-offset-2 control-label">Passport</label>
							<div class="col-sm-6">
								<?php if (isset($bank->passport)): ?>
									<img src="<?php echo $bank->passport ?>" class='img-responsive'>
								<?php endif ?>
								<input type="file" id="passport" name="passport" class="form-control" > 
							</div>
						</div>
						<div class="form-group">
							<label for="selfie" class=" col-sm-4  col-sm-offset-2  col-md-3  col-md-offset-2 control-label">Selfie</label>
							<div class="col-sm-6">
								<?php if (isset($bank->selfie)): ?>
									<img src="<?php echo $bank->selfie ?>" class='img-responsive'>
								<?php endif ?>
								<input type="file" id="selfie" name="selfie" class="form-control" > 
							</div>
						</div>
						<div class="form-group">
							<label for="backcard" class=" col-sm-4  col-sm-offset-2  col-md-3  col-md-offset-2 control-label">Backcard</label>
							<div class="col-sm-6">
								<?php if (isset($bank->backcard)): ?>
									<img src="<?php echo $bank->backcard ?>" class='img-responsive' />
								<?php endif ?>
								<input type="file" id="backcard" name="backcard" class="form-control" > 
							</div>
						</div>
						<div class="form-group">
							<label for="inputEmail3" class=" col-sm-4  col-sm-offset-2  col-md-3  col-md-offset-2 control-label">&nbsp;</label>
							<div class="col-sm-6">
								<button type="submit" class="cls_dow_btn"  name="submit"> UPDATE INFORMATION </button> 
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