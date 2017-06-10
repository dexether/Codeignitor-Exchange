<div id="container">

	<div id="selectors">
		
		<div id="year_selector">
			<h3>Search By Year</h3>
			<form method="POST">
				<select name="param">
					<?php foreach($year_list as $key=>$value):?>
						<?php echo "<option value='$value'>$value</option>"; ?>
					<?php endforeach;?>
				</select>
				<button name='func' value="get_by_year">Search</button>
			</form>
		</div>

		<div id="month_selector">
			<h3>Search By Month</h3>
			<form method="POST">
				<select name="param_y">
					<?php foreach($year_list as $key=>$value):?>
						<?php echo "<option value='$value'>$value</option>"; ?>
					<?php endforeach;?>
				</select>

				<select name="param_m">
					<option value="01">Jan</option>
					<option value="02">Feb</option>
					<option value="03">Mar</option>
					<option value="04">Apr</option>
					<option value="05">May</option>
					<option value="06">Jun</option>
					<option value="07">Jul</option>
					<option value="08">Aug</option>
					<option value="09">Sept</option>
					<option value="10">Oct</option>
					<option value="11">Nov</option>
					<option value="12">Dec</option>
				</select>
				<button name='func' value="get_by_month">Search</button>
			</form>
		</div>

		<div id="day_selector">
			<h3>Search By Day</h3>
			<form method="POST">
				<input type="text" class="datepicker" name='from' placeholder="from">
				<input type="text" class="datepicker" name='to' placeholder="to">
				<button name='func' value="get_in_range">Search</button>
			</form>
		</div>

	</div>
	<br><br>
	<hr>


<script>
	$( function() {
    	$( ".datepicker" ).datepicker({ dateFormat: 'yy-mm-dd' }).val();
  	} );
</script>
</div>