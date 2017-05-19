<div class="container">

<div id='deposit_history_wrapper'>

	<ul id='switch'>
		<li>EUR</li>
		<li>NLG</li>
	</ul>

	<div id="deposit_history_list">
		<ul class="deposit_history_table">
			<li>Status</li>
			<li>Date</li>
			<li>Amount</li>
			<li>Transaction id</li>
		</ul>

		<?php if(!$status) { echo 'No history available'; } ?>
		<?php if($status): ?>
			<?php foreach($content as $li): ?>
			<ul class="deposit_history_records" type='EUR'>
				<li class="<?=($li['status']=='true'?'success': 'fail') ?>"> <?=($li['status']=='true'? 'success': 'fail');?> </li>
				<li> <?=$li['date'];?> </li>
				<li> <?=$li['amount'];?> </li>
				<li> <?=$li['transaction'];?> </li>
			</ul>
			<?php endforeach; ?>
		<?php endif; ?>
	</div>

</div>

</div>