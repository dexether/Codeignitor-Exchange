<?php echo form_open(); ?>
	<label for='amount'>Amount </label>
	<input type='number' name='amount'>
	<br><br>
	
	<button>Add</button>
	<br>

<?php echo form_close(); 
echo $error; 
?>