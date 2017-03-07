<?php  defined('BASEPATH') OR exit('No direct script access allowed');
echo '<div class="container">';
echo '<div class="row">';
echo '<div class="col-md-12 col-sm-12">';
if($status == 'ok')
{
    echo 'Thank you for your registering, your account is now activated and you can login.';
}
else if($status == 'nok')
{
    echo 'Whoops! Something went wrong trying to verify you, please try again.';
}
else echo 'There seems to be a problem with the verification process, please try again';
echo '</div>';
echo '</div>';
echo '</div>';