<script src="<?php echo base_url();?>js/jquery-1.8.3.min.js"></script>
<script src="<?php echo base_url();?>js/jquery.ufvalidator-1.0.4.js"></script>

<!-- BEGIN CONTAINER -->
<div id="container" class="row-fluid">
	<div id="main-content">
		<!-- BEGIN PAGE CONTAINER-->
		<div class="container-fluid">
			<!-- BEGIN PAGE HEADER-->
			<div class="row-fluid">
				<div class="span12">
					<h3 class="page-title">

						<strong>Customer Accounts</strong>
					</h3>
					<ul class="breadcrumb">
						<li>
							<a href="#"><i class="icon-home"></i></a><span class="divider">&nbsp;</span>
						</li>
						<li>
							<a href="<?php echo base_url()?>admin/dashboard">Dashboard</a> <span class="divider">&nbsp;</span>
						</li>
						<li><a href="<?php echo base_url()?>admin/userdetails">Customer Accounts</a><span class="divider-last">&nbsp;</span></li>
					</ul>
					<!-- END PAGE TITLE & BREADCRUMB -->
				</div>

			</div>
			<!-- BEGIN ADVANCED TABLE widget-->

			<div class="alert alert-info tac">
				<strong>Date: <?php echo date('d.m.Y'); ?></strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				<strong>No of Customers: <?php echo $this->admin_model->userscount(); ?></strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
				<strong>New Customers: <?php echo $this->admin_model->newuserscount(); ?></strong><br>
			</div>
			<div class="row-fluid">

				<?php 
				$success = $this->session->flashdata('success');									
				if($success)	{	?> 
				<div class="alert alert-success">
					<button type="button" class="close" data-dismiss="alert">&times;</button>
					<strong>Success! </strong> <?php echo $success;?>.
				</div><?php }

				?>  
				<div class="span12">  		
					<!-- BEGIN EXAMPLE TABLE widget-->
					<div class="widget">
						<div class="widget-title">
							<h4><i class="icon-reorder"></i>List of Customers </h4>
							<span class="tools">
								<a href="javascript:;" class="icon-chevron-down"></a>
								<!-- <a href="javascript:;" class="icon-remove"></a>-->
							</span>
						</div>
						<div class="widget-body">
							<div><a href="<?php echo base_url(); ?>admin/ExportuserdetailsCSV" class="btn btn-success" style="float:right;margin-bottom:3px;">Excel Sheet</a></div>
							<div class="clearfix"></div>
							<table class="table table-striped table-bordered" id="sample_1">
								<thead>
									<tr>
										<th style="width:8px;">S.No</th>
										<th style="width:8px;">Registered on</th>
										<th style='text-align:center'>Name</th>
										<th style='text-align:center' class="hidden-phone">Email Id</th>			
										<th style='text-align:center' class="hidden-phone">Country</th>

										<th style='text-align:center' class="hidden-phone">Status</th>
										<th style='text-align:center' class="hidden-phone">Option</th>
									</tr>
								</thead>
								<tbody>
									<?php 
									$i=0;
									foreach($result as $row)
									{
										$id = $row->id;
										$status = $row->status;
										//$verifiedstatus	= $this->admin_model->getuserverificationrow($id);

										$country = $row->country;
										//$countryname = $this->admin_model->fetchparticularcountry($country);
										//$user_verificationstatus = $verifiedstatus->user_verificationstatus;
										// if($user_verificationstatus == 1) { $user_verificationstatus = "Approved"; }
										// else if($user_verificationstatus==2) { $user_verificationstatus = "Awaiting"; }
										// else if($user_verificationstatus==3) { $user_verificationstatus = "Rejected"; }
										// else { $user_verificationstatus = "Not Uploading"; }
										echo "<tr>";
										$l=" ";
										$i=$i+1;
										echo "<td>".($i+1)."</td>";
										echo "<td>".$row->dateofreg."</td>";
										echo "<td>".$row->username."</td>";
										echo "<td>".$row->email."</td>";	
										echo "<td>".$country."</td>";

										if($status=="active") { ?>
										<td><span class="label label-success"><?php echo "Active"; ?></span></td>
										<?php } else { ?>
										<td><span class="label label-info"><?php echo "Deactive"; ?></span></td>
										<?php } 
										if($row->status=="active"){ $title="Deactivate"; }else { $title="Activate";}  
										echo "<td style='text-align:center'>". anchor('admin/changestatus_userdetails/'.$row->id,$l,$attr=array('title'=>$title,'class'=>"icon-refresh")).					
										anchor('admin/edit_userdetails/'.$row->id,$l,$attr=array('title'=>"Edit",'class'=>"icon-edit")).
										anchor('admin/delete_userdetails/'.$row->id,$l,$delete=array('title'=>"Delete",'class'=>"icon-remove",'onclick'=>"return confirm('Do you want to delete this admin user ?');")).anchor('admin/view_userdetails/'.$row->id,$l,$attr=array('title'=>'View Details','class'=>'icon-eye-open') )."</td>";
										echo "</tr>";			
									}

									?>					
								</tbody>
							</table>

						</form>
					</div>
				</div>
				<!-- END EXAMPLE TABLE widget -->
			</div>
			<?php

if(isset($edit)) { ?> 

<div class="row-fluid">
	<div class="span12">
		<div class="widget box blue" id="form_wizard_1">
			<div class="widget-title">
				<h4>
					<i class="icon-reorder"></i>Edit User details - <span class="step-title"></span>
				</h4>
				<span class="tools">
					<a href="javascript:;" class="icon-chevron-down"></a>
					<!-- <a href="javascript:;" class="icon-remove"></a>-->
				</span>
			</div>
			<div class="widget-body form">	  
				<h4><?php //echo anchor('admin/manage_admin','Admin Users List'); ?></h4>
				<?php $attributes=array('class'=>'form form-horizontal','id'=>'editadmin');
				echo  form_open_multipart('admin/edit_user_detail',$attributes); ?>   
				<input type="hidden" name="id" value="<?php echo $id;?>">                   
				<div class="form-wizard">
					<div class="navbar steps">
						<div class="navbar-inner">
							<ul class="row-fluid">
								<li class="span3">
									<a href="#" class="step active">
										<span class="number">1</span>
										<span class="desc"><i class="icon-ok"></i>Edit User details</span>
									</a>
								</li>
							</ul>
						</div>
					</div>
					<div id="bar" class="progress progress-striped">
						<div class="bar"></div>
					</div>
					<div class="tab-content">
						<div class="tab-pane active" id="tab1">
							<div class="control-group">
								<label class="control-label">Login Name</label>
								<div class="controls">
									<input type="text" class="input req-min span8" minlength="3" maxlength="40" name="username" value="<?php echo $username;?>"  />
								</div>
							</div>
							<div class="control-group">
								<label class="control-label">Email Id</label>
								<div class="controls">
									<input type="text" class="input req-email span8"  name="emailid" value="<?php echo $emailid;?>"  />
									<input type="hidden" name="oldemail" value="<?php echo $emailid;?>" >

	<!-- </div>
	</div>
	<div class="control-group">
	<label class="control-label">DNI Number</label>
	<div class="controls">
	<input type="text" class="input req-min span8" minlength="4" maxlength="40" name="dni" value="<?php echo $dni;?>"  />
	</div>
</div> -->
	<!-- <div class="control-group">
	<label class="control-label">Password</label>
	<div class="controls">
	<input type="password" class="input req-email span8"  name="password" value="<?php echo $password;?>"  />

	</div>
</div> -->
	<!--<div class="control-group">
	<label class="control-label">Profile image</label>
	<div class="controls">

	<div class="fileupload fileupload-new" data-provides="fileupload">
	<div class="fileupload-new thumbnail" style="width: 200px; height: 150px;">
	<img src="<?php echo base_url();?>/uploader/customers/profilepicture/<?php echo $profilepicture;?>" alt="" />
	</div>
	<div class="fileupload-preview fileupload-exists thumbnail" style="max-width: 200px; max-height: 150px; line-height: 20px;"></div>
	<div>
	<span class="btn btn-file"><span class="fileupload-new">Select image</span>
	<span class="fileupload-exists">Change</span>
	<input type="file" id="admin_image" name="admin_image" class="default" /></span>
	<a href="#"  class="btn fileupload-exists" data-dismiss="fileupload">Remove</a>
	</div>
	</div>
	</div>
	</div>
	<input type="hidden" id="old_admin_image" name="old_admin_image" value="<?php echo $profilepicture;?>">-->


	<!-- </div> -->
	<input type="hidden" name="admin_new_img" id="admin_new_img" />
	<!-- <div class="control-group">
	<label class="control-label">Profile image</label>
	<div class="controls">
	<input type="hidden" name="oldprofile_picture" value="<?php echo $profilepicture;?>" >
	<input type="file" name="profile_image" id="file" />

	</div>
</div> -->
	<!-- <div class="control-group">
	<label class="control-label">Picture</label>
	<div class="controls" id="old_image">
		<img src="<?php echo base_url();?>/uploader/customers/profilepicture/<?php echo $profilepicture;?>" height="50" width="100" class='img-rounded'> -->


	<!-- </div>
	<input type="submit" id="submitBtn1" name="submit" class="btn btn-success" value="Save" />
	<div id="errorDiv1" class="error-div" style="float:left"></div>
	<Submit <i class="icon-ok"></i> -->


	</div>
	<div class="form-actions clearfix">
		<input type="submit" id="submitBtn1" name="submit" class="btn btn-success" value="Save" />
		<div id="errorDiv1" class="error-div" style="float:left"></div>
		<Submit <i class="icon-ok"></i>
		</a>
	</div>
</div>
</form>
</div>
</div>
</div>
</div>
</div>
<?php
}
?>			
</div>
</div>
</div>
<script>
	$(function () {
		$('#admin_new_img').val("");
		$('#submitBtn1').formValidator({
			onSuccess	: function() { $('#editadmin').submit();
		},
		scope		: '#editadmin',
		errorDiv	: '#errorDiv1'
	});
		$('#addbutton').formValidator({
			onSuccess	: function() { $('#addadmin').submit();
		},
		scope		: '#addadmin',
		errorDiv	: '#errorDiv1'
	});
	});

</script>			