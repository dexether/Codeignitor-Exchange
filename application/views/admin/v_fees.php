<div id='container'>

	<div id='range'>
		<?php echo form_open(); ?>
			<label for="from">From:</label>	
			<input type="text" class="datepicker" name='from'>

			<label>To:</label>
			<input type="text" class="datepicker" name='to'>

			<button>Search</button>
		<?php echo form_close(); ?>
		<br>
		<p><?php 
			if(isset($from) AND isset($to)) {
				echo "From $from - $to";
			} 
		?></p>
	</div>
	<hr>

	<div id='fees'>
		<ul class="table_header">
			<li>User</li>
			<li>Transaction</li>
			<li>Amount</li>
			<li>Date</li>
			<li>Origin</li>
		</ul>
			<?php
				if(is_array($fees)) {
					$amount = 0;
					foreach($fees as $fee) {
						echo '<ul class="table">';
						echo "<li>{$fee['user']}</li>";
						echo "<li>{$fee['transaction_id']}</li>";
						echo "<li>{$fee['amount']}</li>";
						echo "<li>{$fee['date']}</li>";
						echo "<li>{$fee['origin']}</li>";
						echo '</ul>';
						$amount += (float)$fee['amount'];
					}
				} else {
					echo $fees;
				}
			?>
		<ul>
		<br><br>
		<h3>Amount: <?=$amount; ?></h3>
	</div>
</div>


<?php echo ( isset($error)? $error: ''); ?>

<script>
	$( function() {
    	$( ".datepicker" ).datepicker({ dateFormat: 'yy-mm-dd' }).val();
  	} );
</script>
=======

<div class="row">
    <div class="col-md-4">
        <h4 class="text-center">Open fees chart</h4>
    </div>
    <div class="col-md-2">
        <select id="period">
            <option value="0" selected="selected">Current Day</option>
            <option value="14">Two weeks ago from the current day</option>
            <option value="30">A month ago from the current day</option>
        </select>
    </div>
</div>
<div>
    <div class="col-md-6">
        <canvas id="open-fees-chart"></canvas>
    </div>
</div>
