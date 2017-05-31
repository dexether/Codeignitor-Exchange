<div id='container'>
<h2><?=$user->firstname . ' ' . $user->lastname . '-' . $user->email;?></h2>
<hr>
<?php echo form_open(); ?>
	<label for='amount'>Amount </label>
	<input type='number' name='amount'>
	
	<input type="radio" name='currency' value='eur'>
	<label>EUR</label>


	<input type='radio' name='currency' value='nlg'>
	<label>NLG</label>


	
	<input type='radio' name='currency' value='gts'>
	<label>GTS</label>

	<br>
	<button>Add</button>
<?php 
	echo form_close(); 
	echo ( isset($error)? $error: ''); 
?>	
</div>
