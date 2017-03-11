<?php  defined('BASEPATH') OR exit('No direct script access allowed');
echo '<div class="container">';
echo '<div class="row">';
echo '<div class="col-md-12 col-sm-12">';
echo '<h1>User verification</h1>';
if($status == 'ok')
{
    echo '<p>Thank you for your registering, your account is now activated and you can login.</p>';
}
else if($status == 'nok')
{
    echo '<p>Whoops! Something went wrong trying to verify you, please try again.</p>';
}
else echo '<p>There seems to be a problem with the verification process, please try again</p>';
echo '<p>&nbsp;</p>';

echo '</div>';
echo '</div>';
echo '</div>';