<div id='container'>
<h3>SEPA Files</h3>
<br>
<ul class="table_header">
	<li>Name</li>
	<li>Date</li>
	<li>No. Of Transactions</li>
	<li>Amount</li>
	<li>Download</li>	
</ul>

<?php
foreach ($names as $key => $value) {
	echo '<ul  class="table">';
	echo '<li style="font-size:16px;">'. $key .'</li>';
	foreach ($value as $info) {
		echo '<li>' . $info . '</li>';
	}
	echo "<li><a href='http://exchange-dev/admin/sepa_files/".$key."'>DOWNLOAD</a></li>";
	echo '</ul>';
}
?>
</div>