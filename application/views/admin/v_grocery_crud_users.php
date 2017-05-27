<?php 
foreach($css_files as $file): ?>
<link type="text/css" rel="stylesheet" href="<?php echo $file; ?>" />
<?php endforeach; ?>
<?php foreach($js_files as $file): ?>
	<script src="<?php echo $file; ?>"></script>
<?php endforeach; ?>
<?php echo $output; ?>
<?php if(isset($_GET['r'])) { echo '<div class="alert alert-success"><i class="glyphicon glyphicon-ok"></i> ' . ucfirst($_GET['r']) . '</div>'; }?>

