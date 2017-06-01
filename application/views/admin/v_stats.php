<div id="container">

	<div id="selectors">
		
		<div id="year_selector">
			<h3>Search By Year</h3>
			<select name="year">
				<option value="2017-05">2016</option>
				<option value="2017-05">2017</option>
				<option value="2017-05">2018</option>
			</select>
			<button>Search</button>
		</div>

		<div id="month_selector">
			<h3>Search By Month</h3>
			<select name="month">
				<option value="2017-05">2017-05</option>
				<option value="2017-05">2017-06</option>
				<option value="2017-05">2017-07</option>
			</select>
			<button>Search</button>
		</div>

		<div id="day_selector">
			<h3>Search By Day</h3>
			<input type="text" class="datepicker" name='from' placeholder="from">
			<input type="text" class="datepicker" name='to' placeholder="to">
			<button>Search</button>
		</div>

	</div>
	<br><br>
	<hr>

	<div id="stats">
		<div id="days">
			<h4>This Week</h4>
			<p>Today  we have <?= $today; ?> new users.</p>
			<p>Yesterday: <?= $yesterday; ?></p>
			<p>This Week: <?= $this_week; ?></p>
			<p>Last Week: <?= $last_week; ?></p>
		</div>

		<div id="month">
			<h4>This month</h4>
			<p>This month we have <?= $this_month; ?></p>
			<p>Last month: <?= $last_month; ?></p>
		</div>
<!--
		<div id='year'>
			<h4><?php echo (isset($yr_range)? $yr_range: 'This year'); ?></h4>
			<p>This year we have <?= $y_users; ?></p>
			<p>Last year we have <?= $ly_users; ?></p>
		</div>-->
	</div>
<script>
	$( function() {
    	$( ".datepicker" ).datepicker({ dateFormat: 'yy-mm-dd' }).val();
  	} );
</script>
</div>