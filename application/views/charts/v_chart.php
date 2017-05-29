<?php  defined('BASEPATH') OR exit('No direct script access allowed'); 
if(isset($market))
{
    echo '<div class="container">
            <div class="row">';
            echo '<h1>Market ', $market, '</h1>';
    echo '</div></div>';
    echo '<div class="container">
    <div id="data-info" class="row" ', (isset($user_id)?'data-suid="'. $user_id.'"':''), ' data-market="', $market, '">';
}
?>

    <div class="cls_map_bg <?php echo (isset($currency_bid))?'chart_'.$currency_bid: '';?>">
        <div id="container_chart" style=" margin: 0 auto" class="cls_grap_box" >

        </div>
    </div>
 
<?php
if(isset($market))
{
    echo '   </div>
                </div>';
}