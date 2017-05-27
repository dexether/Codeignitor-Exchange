<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Chart extends MY_Controller{
    var $data = array();

    public function __construct() 
    {
        parent::__construct();
    }
    
    public function index()
    {
        redirect('/');
    }
    
    //TODO add date range!
    
//'open': 1,
//        'high': 2,
//        'low': 3,
//        'close': 4,
    public function candle($bid='NLG', $time = '30minutes')
    {
        $this->load->model('mdl_chart');
        $chart_result = $this->mdl_chart->chart($bid, $time);
        if($chart_result->num_rows() > 0)
        {
            $json = [];
            $json['data'] = [];
            $rows = $chart_result->result();
            foreach ($rows as $row) 
            {
                $json['data'][] = ["$row->timeslice", $row->open, $row->highest, $row->low, $row->close];
            }
            
            echo json_encode($json);
        }
    }
}