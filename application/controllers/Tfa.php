<?php defined('BASEPATH') OR exit('No direct script access allowed');

class TFA extends MY_Controller
{
    public $data;

    // 1. key is location from where it goes
    // 2. value is name of function that is to be called if TFA input was good
    // 3. function should do something and then redirect to other controller
    private $actions = [
        'login' => 'finish_login',
        'currency_withdraw' => 'finish_withdraw',
    ];


    public function __construct()
    {
        parent::__construct();

        // Checks if user is logged in : if not redirect to index
        if (isset($this->session->user_id) OR isset($this->session->pending_user_id)) {
            
        }else {
            $this->index();
        }

        $this->load->model('mdl_user');
        $this->data['menu'] = $this->load->view('markets/v_menu', array('uri' => $this->uri->segment(2)), true);
    }


    // Displays TFA form with route 
    public function display($route = 'login')
    {
        $action = base_url() . 'tfa/check_tfa/' . $route;
        $vars = ['action' => $action];
        $this->data['content'] = $this->load->view('user/v_tfa', $vars, true);
        view($this->data, 'site');
    }
    


    function check_tfa($route)
    {
        $this->load->model('mdl_user');
        $result = $this->mdl_user->check_tfa();

        if ($result === true) {
            $method = $this->actions[$route];
            $this->$method();
        }else{
            $this->session->set_flashdata('error', 'Wronge code number');
            redirect('tfa/display/' . $route);
        }
    }




    //=======================================================================
    // PRIVATE FUNCTIONS
    //=======================================================================

    private function finish_login()
    {
        $user = $this->mdl_user->get_userdetails($this->session->pending_user_id);
        $this->mdl_user->set_sesdata();
        redirect('markets/EUR-NLG');  
    }
    //after login set session data en redirect to tfa
    // check tfa against data in db. if correct, set role in sesson and redirect to market.
    // if not correct the error then go to tfa again.
    //  I think you can continue from here

    private function finish_withdraw()
    {
        if (!isset($this->session->pending_curr)) {
            $this->session->set_flashdata('error', 'Currency and amount not set.');
            redirect('tfa/display/' . $route);
        }

        $this->session->withdraw_conf = true;
        redirect('withdraw/accept_withdraw');
    }

    private function index() {
        redirect('/');
    }
}