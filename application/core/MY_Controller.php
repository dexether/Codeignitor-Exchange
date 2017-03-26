<?php (defined('BASEPATH')) OR exit('No direct script access allowed');

/**
 * Description of base_controller
 *
 * @author rogier
 */
class MY_Controller extends CI_Controller
{
    /**
     * base array for storing view strings
     *
     * @var array
     */
    public $data;

    /**
     * Contructor, used to reference to the parents constructor.
     */
    public function  __construct()
    {
        parent::__construct();

        //preset the variables needed in the templates
        $this->data = base_vars();
        
        $this->config->load('app');
    }

}