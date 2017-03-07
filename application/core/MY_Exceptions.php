<?php

/**
 * Description of MY_Exceptions
 *
 * @author rogier
 */
class MY_Exceptions extends CI_Exceptions {
    //put your code here
    public function __construct()
    {
        $this->ob_level = ob_get_level();
        // Note: Do not log messages from this constructor.
        //header('Location: '.config_item('base_url'). 'errors/');
        //exit();
    }
}
