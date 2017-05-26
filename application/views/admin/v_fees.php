<div id='container'>
	<div id='range'>
		<label for="from">From:</label>	
		<input type="text" class="datepicker" name='from'>

		<label>To:</label>
		<input type="text" class="datepicker" name='to:'>

		<button>Search</button>
	</div>
	<hr>
	<div id='fees'>
		
	<?php
		foreach($fees as $fee) {
			var_dump($fee);
			echo'<br>';
		}
	?>

	</div>
</div>
<script>
	$( function() {
    	$( ".datepicker" ).datepicker();
  	} );
</script>