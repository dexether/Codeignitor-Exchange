<?php 
foreach($css_files as $file): ?>
<link type="text/css" rel="stylesheet" href="<?php echo $file; ?>" />
<?php endforeach; ?>
<?php foreach($js_files as $file): ?>
	<script src="<?php echo $file; ?>"></script>
<?php endforeach; ?>
<?php echo $output; ?>


<?php
	$admin_roles = ['superadmin'];
	if(in_array($this->session->userdata('role'), $admin_roles))
	{
		?>
		<script type="text/javascript">
			$(document).ready(function(){
			  $('.tDiv3').append('<a class="export-anchor btn btn-info btn-flat" id="my_button" href="/Create_Sepa"><i class="fa fa-file-excel-o"></i> SEPA</a>');
			});
		</script>
		<?php
	}
?>