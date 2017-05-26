<div id='container'>
	<div id='range'>
		<label for="from">From:</label>	
		<input type="text" class="datepicker" name='from'>

		<label>To:</label>
		<input type="text" class="datepicker" name='to:'>
	</div>
</div>
<script>
	$( function() {
    	$( ".datepicker" ).datepicker();
  	} );
</script>