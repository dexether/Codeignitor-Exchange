<?php defined('BASEPATH') OR exit('No direct script access allowed');
class Test extends MY_Controller{
    

    public function __construct() 
    {
        parent::__construct();
    }
    
    public function bid()
    {
        echo 'bid';
    }

    public function sell()
    {
        echo 'sell';
    }
}