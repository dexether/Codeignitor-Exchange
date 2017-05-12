<?php defined('BASEPATH') OR exit('No direct script access allowed');

class TFA extends MY_Controller
{
    public $data;

    private $actions = [
        'login' => 'markets/EUR-NLG',
        'eur_withdraw' => 'x',
    ];

    public function __construct()
    {
        parent::__construct();
        $this->load->model('mdl_user');
        $this->data['menu'] = $this->load->view('markets/v_menu', array('uri' => $this->uri->segment(2)), true);
    }

    function display($route = 'login'){
        $action = base_url() . 'tfa/check_tfa/' . $route;
        $vars = ['action' => $action];
        $this->data['content'] = $this->load->view('user/v_tfa', $vars, true);
        view($this->data, 'site');
    }
    

    function check_tfa($route)
    {
        $this->load->model('mdl_user');
        $result = $this->mdl_user->check_tfa();

        if($result === true){
            $user = $this->mdl_user->get_userdetails($this->session->pending_user_id);
            $this->mdl_user->set_sesdata();
            redirect($this->actions[$route]);
        }else{
            $this->session->set_flashdata('error', 'Wronge code number');
            redirect('tfa/display');
        }
    }
    //after login set session data en redirevt to tfa
    // check tfa against data in db. if correct, set role in sesson and redirect to market.
    // if not correct the error then go to tfa again.
    //  I think you can continue from here
}