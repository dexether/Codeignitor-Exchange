<div id="container">

	<div id="selectors">
		
		<div id="year_selector">
			<h3>Search By Year</h3>
			<form method="POST">
				<select name="param">
					<option value="2016">2016</option>
					<option value="2017">2017</option>
					<option value="2016">2018</option>
				</select>
				<button name='func' value="get_by_year">Search</button>
			</form>
		</div>

		<div id="month_selector">
			<h3>Search By Month</h3>
			<form method="POST">
				<select name="param">
					<option value="2017-05">2017-05</option>
					<option value="2017-04">2017-06</option>
					<option value="2017-06">2017-07</option>
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

</script>
</div>