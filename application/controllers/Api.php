<?php (defined('BASEPATH')) OR exit('No direct script access allowed');


class api_v10 extends MX_Controller {

    var $dev = false;
    public function  __construct()
    {
        parent::__construct();
        
        //remove this!
        if(ENVIRONMENT == ' development')
        {
            ini_set('display_errors',1);
            ini_set('display_startup_errors',1);
            error_reporting(-1);
        }
        
        if($this->testkeys() === false) redirect('/');
    }

    //we us remap so this should never be called
    public function index()
    {
        	redirect('/');
    }
    
    public function _remap($method=null, $params = array())
    {
        if(!is_null($method) && $method != 'index')
        {
            if(method_exists(__CLASS__, 'api_' .$method))
            {
                //see if there are any methods to be found
                if(count($params) == 0)
                {
                    echo json_encode(array('success'=>'error','error_message'=>'cannot find method'));
                    exit();
                }
                
                if($this->dev) echo '<br />found method: '. 'api_' .$method. "<br />";
                
                $method = 'api_' .$method;
                echo self::$method($params);
            }
            else
            {
                echo json_encode(array('success'=>'error','error_message'=>'cannot find group'));
                if($this->dev)  echo '<br />CANNOT find method: api_' .$method. "<br />";
            }
        }
    }
    
    private function testkeys()
    {
        $query_string = $_SERVER['QUERY_STRING'];
        //$this->load->model('mdl_api');
        //$apisecret = $this->mdl_api->get_secret($this->input->get('apikey');)
        
        $apisecret = 'abcdefg' ;
        
        $expected = hash_hmac ('sha512','http://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'],$apisecret);
        
        //catch header
        $posted = isset($_SERVER['HTTP_APISIGN'])?$_SERVER['HTTP_APISIGN']:'';
        
        if( hash_equals($expected, $posted))
        {
            return true;
        }
        else return false;
        
    }
    
    public function api_public($params)
    {
        switch($params[0])
        {
            case 'getmarkets':
                echo $this->public_get_markets();
                break;
            default:
                echo json_encode(array('success'=>'error','error_message'=>'cannot find method'));
                exit();
                break;
        }
    }

    private function public_get_markets()
    {
        return json_encode(array('success'=>'true','result'=>array('marketname'=>'EUR-NLG')));
    }
}