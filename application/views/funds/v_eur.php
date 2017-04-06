<?php defined('BASEPATH') OR exit('No direct script access allowed');

if(isset($header)) echo $header;

echo '<div class="container">
            <div class="row">';
echo '<h1>',$this->lang->line('lng_u_deposit'),' ', $fund, '</h1>';

//Ideal
echo '<div class="col-md-6 col-sm-6">';
echo '<h2>iDeal</h2>';

echo '<select name="bank" required>';
        foreach($banklist as $k=>$bank) {
                echo "<option value='".$bank['id']."'>";
                echo $bank['visibleName'];
                echo "</option>";
        }
       echo '</select>';

echo '</div>';

//DEPOSIT SEPA
echo '<div class="col-md-6 col-sm-6">';
echo '<h2>', $this->lang->line('lng_u_transfer'), '</h2>';
echo 'All EUR transfers are subject to a €1.00 bank fee.</p>';
echo '<p>Please transfer funds to NL58 ABNA 0216 1974 81</p>';
echo '<p>Guldentrader B.V.</p>';
echo '<p>Please use the following description: <strong>',  $deposit_code . '</strong></p>';
echo '<h3>Non IBAN users</h3>';
echo '<p>The most economic way to transfer funds is to use a service like <a href="https://transferwise.com/u/rogierb3">Transferwise</a></p>';
echo '<p>When selecting International payment, make sure you pay all the costs. When We have to pay the cost of international transfer, an administrative fee of € 20.00 will de deducted from your balance aswell as the international transfer fee.</p>';
echo '<p>Please use the following data:</p>';
echo '<p>Accountholder: Guldentrader B.V.</p>';
echo '<p>Email: payments@guldentrader.com</p>';
echo '<p>Address: Mergelsweg 78</p>';
echo '<p>Postalcode: 6411EM</p>';
echo '<p>City: Heerlen</p>';
echo '<p>Country: The Netherlands</p>';
echo '<p>Please use the following description if possible: <strong>',  $deposit_code . '</strong></p>';

echo '</div>';

echo '   </div>
                </div>';