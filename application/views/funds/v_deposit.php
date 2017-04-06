<?php defined('BASEPATH') OR exit('No direct script access allowed');

if(isset($header)) echo $header;

echo '<div class="container">
            <div class="row">';
echo '<h1>', $fund, '</h1>';
if($address)
{
    echo $this->lang->line('lng_u_your_address'),'<br/>', $address, '<br/>';
    
    $qr = $address;
    echo '<p><img src="https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=' .urlencode($qr) . '&choe=UTF-8" /></p>';
}
else
{
    //no address, please try later;
    echo $this->lang->line('lng_u_no_address');
}
echo '   </div>
                </div>';