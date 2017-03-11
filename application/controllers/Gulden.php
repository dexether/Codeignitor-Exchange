<?php class Gulden extends MY_Controller 
{
    public function __construct() 
    {
        parent::__construct();      
        
    }  
    public function language($lang) 
    {
        $uri="/Test/index";
        if($lang == 'english' || $lang == 'chinese_sim'|| $lang == 'chinese_tra')
        {
            $this->session->set_userdata('language', $lang);
            echo "success";
        }
        else
        {
        //redirect('/');
        //$this->load->view('index');
            redirect('','refresh');
        }
    }

    function test_mul()
    {


        $this->load->view('index'); 
    }
    function currency($cur)
    {   


        $customer_email_id      =   $this->session->userdata('customer_email_id'); 
        $customer_user_id       =   $this->session->user_id; 
        if(($customer_email_id=="") && ($customer_user_id=="") )
        {   
            redirect(' ','refresh');     
        }
        else
        {
            if($cur=="ltc_usd")
            {
                $currency="ltc_usd";
            }
            else if($cur=="btc_usd")
            {
                $currency="btc_usd";
            }
            $this->session->set_userdata('gulden_currency',$currency);  
            $this->load->view('front/limit_market');
        }
    }
//chocklaingam
    function order()
    {

        $customer_email_id      =   $this->session->userdata('customer_email_id'); 
        $customer_user_id       =   $this->session->user_id; 
        if(($customer_email_id=="") && ($customer_user_id=="") )
        {   
            redirect(' ','refresh');     
        }
    /*else
    {*/
        //$this->load->view('front/instant_order');
        //$this->load->view('front/instant_order1');
        //$this->load->view('front/limit_order1');
        //$this->load->view('front/stop_order1');
        $data['currency']   =   $this->input->post('currency');
        $this->load->view('front/order',$data);
        //redirect(' ','refresh'); 
    //}
    }
    function tradeorder()
    {

        $customer_email_id      =   $this->session->userdata('customer_email_id'); 
        $customer_user_id       =   $this->session->user_id; 
        if(($customer_email_id=="") && ($customer_user_id=="") )
        {   
            redirect(' ','refresh');     
        }
        else
        {
        //$this->load->view('front/instant_order');
        //$this->load->view('front/instant_order1');
        //$this->load->view('front/limit_order1');
        //$this->load->view('front/stop_order1');

            $this->load->view('front/orderslist');



        }
    }
    function tradeordern()
    {

        $customer_email_id      =   $this->session->userdata('customer_email_id'); 
        $customer_user_id       =   $this->session->user_id; 
        if(($customer_email_id=="") && ($customer_user_id=="") )
        {   
            redirect(' ','refresh');     
        }
    /*else
    {*/
        //$this->load->view('front/instant_order');
        //$this->load->view('front/instant_order1');
        //$this->load->view('front/limit_order1');
        //$this->load->view('front/stop_order1');
        $data['currency']='BTC_NGN';
        $this->load->view('front/orderslist1',$data);
    //}
    }
//chocklaingam
    function limit_order()
    {

        $customer_email_id      =   $this->session->userdata('customer_email_id'); 
        $customer_user_id       =   $this->session->user_id; 
        if(($customer_email_id=="") && ($customer_user_id=="") )
        {   
            redirect(' ','refresh');     
        }
        else
        {
            $this->load->view('front/limit_order');
        }
    }
    function login_index()
    {

// echo $currency; die;


        $customer_email_id      =   $this->session->userdata('customer_email_id'); 
        $customer_user_id       =   $this->session->user_id; 
        if(($customer_email_id=="") && ($customer_user_id=="") )
        {   
            redirect(' ','refresh');     
        }

        $this->load->view('front/login_index');
    }
    function testing()
    {   

        $this->session->unset_userdata('currency');

        $currency = $this->input->post('val');
        $cur = array("EUR_NLG","GTS_NLG");
        //$cur = array("BTC_USD","LTC_USD","ETH_USD","BTC_WCN","BTC_LTC","BTC_ETH");
        if (in_array($currency, $cur)) {
            $this->session->set_userdata('currency',$currency); 
        }

    }
    function buy_ripple()
    {

        $customer_email_id      =   $this->session->userdata('customer_email_id'); 
        $customer_user_id       =   $this->session->user_id; 
        if(($customer_email_id=="") && ($customer_user_id=="") )
        {   
            redirect(' ','refresh');     
        }
        else
        {
            $this->load->view('front/buy_ripple');
        }
    }
    function change_chart()
    {

        $currency=$this->input->post('btc_usd');
        $this->session->set_userdata('gulden_currency',$currency);  
        echo "success";
    }
    function cms_pages($id)
    {

        if($id==4)
        {
            $this->session->set_userdata('fees',$id);   
            redirect('fees','referesh');  
        }
        else if($id==6)
        {
            $this->session->set_userdata('con',$id);   
            redirect('content2','referesh');  
        }
        else if($id==3)
        {
            $this->session->set_userdata('terms',$id);   
            redirect('terms','referesh');  
        }
        else if($id==2)
        {
            $this->session->set_userdata('contactus',$id);   
            redirect('contactus','referesh');  
        }
        else if($id==5)
        {
            $this->session->set_userdata('privacy',$id);   
            redirect('privacy','referesh');  
        }
        else if($id==8)
        {
            $this->session->set_userdata('about_us',$id);   
            redirect('about_us','referesh');  
        }
        else if($id==10)
        {
            $this->session->set_userdata('wht_is_btc',$id);   
            redirect('account_balance','referesh');  
        }
        else if($id==11)
        {
            $this->session->set_userdata('hw_buy_btc',$id);   
            redirect('cms_dep','referesh');  
        }
        else if($id==12)
        {
            $this->session->set_userdata('hw_sell_btc',$id);   
            redirect('cms_with','referesh');  
        }
        else if($id==23)
        {
            $this->session->set_userdata('cms_limit_order',$id);   
            redirect('cms_limit_order','referesh');  
        }
    }
    function content2()
    {

        $id     =   $this->session->userdata('con'); 
        $result = $this->gulden_model->pages_model($id);
        if($result)
        {
            foreach($result as $list)
            {
                $data['pagetitle']      =   $list->pagetitle;
                $data['pagecontent']    =   $list->pagecontent;         
            }
            $this->load->view('front/cms_page',$data);
        }   
    }
    function fees()
    {

    /*$id       =   $this->session->userdata('fees'); 
    $result = $this->gulden_model->pages_model($id);
    if($result)
    {
        foreach($result as $list)
        {
            $data['pagetitle']      =   $list->pagetitle;
            $data['pagecontent']    =   $list->pagecontent;         
        }*/
        $this->load->view('front/fees');
    //} 
    }
    function contactus()
    {

    /*$id           =   $this->session->userdata('contactus'); 
    $result     =   $this->gulden_model->pages_model($id);
    if($result)
    {
        foreach($result as $list)
        {
            $data['pagetitle']=$list->pagetitle;
            $data['pagecontent']=$list->pagecontent;            
        }*/
        $this->load->view('front/contact_us');
    //} 
    }
    function privacy()
    {

    /*$id       =   $this->session->userdata('privacy'); 
    $result = $this->gulden_model->pages_model($id);
    if($result)
    {
        foreach($result as $list)
        {
            $data['pagetitle']      =   $list->pagetitle;
            $data['pagecontent']    =   $list->pagecontent;         
        }*/
        $data['privacy']=$this->gulden_model->get_terms('5');
        $this->load->view('front/privacy_policy',$data);
    //} 
    }
    function cms_with()
    {

        $id     =   $this->session->userdata('hw_sell_btc'); 
        $result = $this->gulden_model->pages_model($id);
        if($result)
        {
            foreach($result as $list)
            {
                $data['pagetitle']      =   $list->pagetitle;
                $data['pagecontent']    =   $list->pagecontent;         
            }
            $this->load->view('front/cms_page1',$data);
        }
    }
    function cms_limit_order()
    {

        $id     =   $this->session->userdata('cms_limit_order'); 
        $result = $this->gulden_model->pages_model($id);
        if($result)
        {
            foreach($result as $list)
            {
                $data['pagetitle']      =   $list->pagetitle;
                $data['pagecontent']    =   $list->pagecontent;         
            }
            $this->load->view('front/cms_page1',$data);
        }
    }
    function cms_dep()
    {

        $id         =   $this->session->userdata('hw_buy_btc'); 
        $result     =   $this->gulden_model->pages_model($id);
        if($result)
        {
            foreach($result as $list)
            {
                $data['pagetitle']      =   $list->pagetitle;
                $data['pagecontent']    =   $list->pagecontent;         
            }
            $this->load->view('front/cms_page1',$data);
        }
    }
    function account_balance()
    {

        $id     =   $this->session->userdata('wht_is_btc'); 
        $result = $this->gulden_model->pages_model($id);
        if($result)
        {
            foreach($result as $list)
            {
                $data['pagetitle']      =   $list->pagetitle;
                $data['pagecontent']    =   $list->pagecontent;         
            }
            $this->load->view('front/cms_page1',$data);
        }

    }
    function terms()
    {

    /*$id       =   $this->session->userdata('terms'); 
    $result = $this->gulden_model->pages_model($id);
    if($result)
    {
        foreach($result as $list)
        {
            $data['pagetitle']=$list->pagetitle;
            $data['pagecontent']=$list->pagecontent;            
        }*/
        $data['terms']=$this->gulden_model->get_terms('3');
        $this->load->view('front/terms',$data);
    //}
    } 
    function about_us()
    {

        $id         =   $this->session->userdata('about_us'); 
        $result     =   $this->gulden_model->pages_model($id);
        if($result)
        {
            foreach($result as $list)
            {
                $data['pagetitle']      =   $list->pagetitle;
                $data['pagecontent']    =   $list->pagecontent;         
            }
            $this->load->view('front/cms_page',$data);
        }
    } 
/* function pages($id)
{
    $result=$this->gulden_model->pages_model($id);
    if($result)
    {
        foreach($result as $list)
        {
            $data['pagetitle']=$list->pagetitle;
            $data['pagecontent']=$list->pagecontent;            
        }
        $this->load->view('front/cms_page',$data);
    }
} */
function pageconfig($total_rows,$base)
{   
    //$controller="gulden";

    $perpage                    =   $this->gulden_model->getrowsperpage();
    $urisegment                 =   $this->uri->segment(2);
    $this->load->library('pagination');
    $config['base_url'] = base_url().$base.'/';   

    $config['total_rows']       = $total_rows;   
    $config['per_page']         = $perpage;
    $config['num_links']        =  2; // Number of "digit" links to show before/after the currently viewed page
    $config['full_tag_open']    = '';
    $config['full_tag_close']   = '';
    $config['cur_tag_open']     = '<b class="this-page">&nbsp;<b>';
    $config['cur_tag_close']    = '&nbsp;</b></b>'; 
    $config['first_link']       = 'First';
    $config['last_link']        = 'Last';
    $config['prev_link']        = '<<';
    $config['next_link']        = '>>';
    $config['last_tag_open']    = '';
    $config['last_tag_close']   = '';
    $config['next_tag_open']    = '&nbsp;';
    $config['next_tag_close']   = '&nbsp;';
    $config['prev_tag_open']    = '&nbsp;';
    $this->pagination->initialize($config);
    $data['pagination']=$this->pagination->create_links();
}   

function index()  
{  
    $uid='';
    $uid = $this->session->user_id;
    if($uid==''){ 
        $cur = array("EUR_NLG","GTS_NLG");
        if (in_array($currency, $cur)) {

            $this->session->set_userdata('currency',$currency); 
            $data['currency']=$currency;
            $this->load->view('front/index',$data); 

        }   
        else
        {
            $data['currency']="EUR_NLG";

            $this->session->set_userdata('currency','EUR_NLG'); 
            $this->load->view('front/index',$data); 
        }
    }else{
      $this->load->view('front/orderslist');
  }

    // $data['news_result'] =   $this->gulden_model->fetchtopnews();

}
function getTable(){
    $currencyPair       =   $this->input->post('currencyPair');
    $cur = array("EUR_NLG","GTS_NLG");
    if (in_array($currencyPair, $cur)) {

        $this->session->set_userdata('currencyPair',$currencyPair); 
        $data['currencyPair']=$currencyPair;
        $this->load->view('front/getTable',$data); 

    }
}

function gettransactionTable(){
   $currencyPair      =   $this->input->post('currencyPair1');
   $currency = explode("_", $currencyPair);
   $firstcurrency=$currency[0];
   $secondcurrency=$currency[1];
   $result =$this->gulden_model->fetchtransactionhistory1($firstcurrency,$secondcurrency);    
   $data['transaction_result'] =   $result;
   $data['firstcurrency']=$firstcurrency;
   $data['secondcurrency']=$secondcurrency;

   $this->load->view('front/gettransactiontable',$data); 




}


/*
function index($currency)  
{  
  
    $cur = array("BTC_USD","BTC_NGN");
    if (in_array($currency, $cur)) {
     
        $this->session->set_userdata('currency',$currency); 
        $data['currency']=$currency;
        $this->load->view('front/index',$data); 
   
}
else
{
    $data['currency']="BTC_USD";

     $this->session->set_userdata('currency','BTC_USD'); 
        $this->load->view('front/index',$data); 
}

    // $data['news_result'] =   $this->gulden_model->fetchtopnews();
         
} */

function registratdion()
{

    $this->load->library('native_session');
    $captcha_code   =   $this->native_session->get('6_letters_code');
    $recaptcha      =   $this->input->post('recaptcha');
    if($captcha_code!=$recaptcha)
    {
        echo "wrong";
    }
    else
    {
        echo $result    =   $this->gulden_model->add_userdetails();
    }   
}
function register()
{

    //$data['country_detail']   =   $this->gulden_model->fetchcountry();        
    $this->load->view('front/register');                    
}
function registration()  
{            

    $email      =   $this->input->post('email');
    $this->load->library('nativesession');

    $already    =   $this->gulden_model->get_alreadyuserdeatils($email);
    if($already=="already")
    {
        echo "email";
    }
    else
    {
        $captcha_code   =   $this->nativesession->get('6_letters_code');
        $recaptcha      =   $this->input->post('recaptcha');
        if($captcha_code!=$recaptcha)
        {
            echo "recaptcha";       
        }
        else
        {
            $result = $this->gulden_model->add_userdetails();                   
            echo "success";
        }
    }

} 
//returns username is exist or not  
function ajax_checkuserid() 
{    

    $search_data    =   $this->input->post('string');          
    $message    =   $this->gulden_model->ajax_checkuserid_model($search_data);         
    if($message)
    {         
        echo "<span style='color:red;font-weight:bold;font-size:13px;'>Someone already has that username. Try another?</span>"; 
    }
    else
    {   
        echo "nothing";
    }
}
//returns email id is exist or not      
function ajax_erralreadyemailid() 
{    

    $es_emailid =   $this->input->post('emailid');              
    $email_err  =   $this->gulden_model->ajaxget_alreadyuserdeatils($es_emailid);         
    if($email_err)
    {         
        echo "Email ID already exist";
    }
}
// send activation link to user
function activationlink($id1)
{   
    $id = base64_decode($id1);

    $result =$this->gulden_model->activatedlink($id);
    if($result)
    {
        $error  =   $this->session->set_flashdata('success',"Your Account Has Been Activated Successfully");    
        redirect('','refresh');
    }
    else
    {   
        $error  =   $this->session->set_flashdata('error',"Your account has been activated successfully Please Check Your Email and login into Your Account");      
        redirect('','refresh'); 
    }
}
function login()     
{   

    $this->load->view('front/index');
} 

function login_check()
{
    $useremail=$this->input->post('useremail');
    if($this->gulden_model->logincheck($useremail)==true)
    {
        echo "success";
    }
    else
    {
        echo "error";
    }
}
// returns login status
function login_status()  
{   

    $res_login  =   $this->gulden_model->check_logindetails();      
    echo $res_login;
}
function login_status1()  
{ 

    $this->session->set_userdata('currency','BTC_USD');

    $code="";
    $res_config= $this->gulden_model->check_tfa_siteconfig();

    if($res_config=="enable")
    {
        $res_user   =   $this->gulden_model->check_tfa_user();

        if($res_user=="enable")
        {
            $res_login  =   $this->gulden_model->check_logindetails1();  

            if($res_login=="active")
            {
                echo "enable";

            }
            else
            {
                echo $res_login; 
            }
        }
        else
        {
            $res_login  =   $this->gulden_model->check_logindetails();      
                //redirect('gulden/instant_order','refresh');
            echo $res_login;
        }
    }
    else
    {
        $res_login  =   $this->gulden_model->check_logindetails();      
        echo $res_login;
            //redirect('','refresh');
    }

}
// to view forgot password page
function forget()     
{   

    $this->load->view('front/forget_password'); 
}  
// ajax form for forgot password
function ajaxforgotform()  
{ 

    $res_login  =   $this->gulden_model->forgot_passmail();     
    echo $res_login;
}
// from mail to function
function forgot($id) //step 2
{

    $this->session->set_userdata('forgotid',$id);
    redirect('reset_password','refresh');   
} 
function reset_password()
{

    $data['id'] =   $this->session->userdata('forgotid');
    // $data['id']  =   $this->gulden_model->simple_decrypt($forgotid);
    $this->load->view('front/resetpassword',$data);
}
// reset password form
function ajaxreset_password()
{

    $result =   $this->gulden_model->reset_password_model();   
    if($result)
    {
        echo "success";
    }
    else
    {
        echo "failure";
    }
}
function news()     
{   

    $data['news_result']    =   $this->gulden_model->fetchtotalnews();
    $this->load->view('front/news',$data); 
} 

function single($id)
{

    $this->session->set_userdata('sess_newsid',$id);
    redirect('single_news','refresh');
}
function single_news()
{

    $newsid     =   $this->session->userdata('sess_newsid');
    $perpage    =   $this->gulden_model->getrowsperpage(); 
    $urisegment =   $this->uri->segment(2);
    $result     =   $this->gulden_model->fetchparticularnewscomments($perpage,$urisegment,$newsid);    
    if($result)  
    {     
        $total_rows =   $this->gulden_model->fetchparticularnewscommentscount($newsid);   
        $base       =   "single_news";            
        $this->pageconfig($total_rows,$base);         
        $data['singlenews_result']  =   $result;
        $data['top_news']           =   $this->gulden_model->fetchtopnews();
        $data['news_row']           =   $this->gulden_model->fetchparticularnews($newsid);
        $news_result        =   $this->gulden_model->fetchparticularnewscomments($perpage,$urisegment,$newsid);    
        
    }   
    else
    {   
        $data['singlenews_result']  = "";
        $data['top_news']           =   $this->gulden_model->fetchtopnews();
        $data['news_row']           =   $this->gulden_model->fetchparticularnews($newsid);
        $data['notfound']="No Comments are found";        
        $this->load->view('front/single_news',$data);         
    }
}
function faq()     
{   

    $data['question']=$this->gulden_model->viewfaq();
    
    $this->load->view('front/faq',$data); 
}  

function faq_general()     
{   

    $data['general']=$this->gulden_model->viewfaq_general();
    $this->load->view('front/faq_general',$data); 
}  

function faq_trade()     
{   

    $data['trade']=$this->gulden_model->viewfaq_trade();
    $this->load->view('front/faq_trade',$data);
}  

function logout() 
{

    $data['customer_user_id']   =   $this->session->user_id;    
    $customer_user_id   =   $this->session->user_id;   
    $sessionvar     =   $this->session->userdata('customer_email_id');  
    $statuslogout=$this->gulden_model->logoutstatus($customer_user_id); 
    if($sessionvar=="") 
    {   
        $data['customer_user_id']='';   
        $this->session->sess_destroy();
        redirect('','refresh');
    }  
    else 
    {  
        $this->session->sess_destroy();       
        $data['customer_user_id']='';  
        redirect('','refresh');
    }
    echo "fdfd";
}
// returns login status
function changepwd_status()  
{  

    $result =   $this->gulden_model->changepwd_statusdetails();     
    echo $result;
}
function profile()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id;
    $customer_client_id     =   $this->session->userdata('customer_client_id');

    if(($customer_client_id=="") && ($customer_user_id=="") )
    {   
        redirect('','refresh');      
    }
    else
    {  
        $data['country_detail'] =   $this->gulden_model->fetchcountry();    
        $this->load->view('front/profile',$data);
    }

}
function funds()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect('','refresh');      
    }
    else
    { 
        $this->load->view('front/funds');
    }
}
function edit($id=null)
{

    $id1 = base64_decode($id);
    $customer_mail_id       =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_mail_id=="") && ($customer_user_id=="") )
    {   
        redirect('','refresh');      
    }
    else
    { 
        if($id1 == 1)
        {
            $data['value']='Change of E-Mail address successfully confirmed. Now click on the link, which came on the second E-mail. ';
            $this->gulden_model->change_mail_model1();
            $this->load->view('front/status',$data);
        }
        else if($id1 == 2)
        {
            $data['value']='E-mail successfully changed';
            $this->gulden_model->update();
            $this->load->view('front/status',$data);
            
        }
        else
        {
            $data['value']="";
        }
        if($id=="")
        {
            $this->load->view('front/edit');
        }
    }
}
function change_mail()
{
    echo $message   =   $this->gulden_model->change_mail_model();         
}
/* function edit()
{
    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect('','refresh');      
    }
    else
    { 
        $this->load->view('front/edit');
    }
} */
function security()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect('','refresh');      
    }
    else
    { 
        $this->load->view('front/security');
    }
}
function trade_history()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect('','refresh');      
    }
    else
    { 
        //$this->load->view('front/trade_history');
        $perpage    =   $this->gulden_model->getrowsperpage(); 
        $urisegment =   $this->uri->segment(2);
        //$result       =   $this->gulden_model->fetchtradehistory($perpage);
        $result     =   $this->gulden_model->fetchtradehistory($perpage,$urisegment);  
        if($result)  
        {     
            $total_rows = $this->gulden_model->fetchtradehistorycount(); 
            $base="trade_history";            
            $this->pageconfig($total_rows,$base);
            $data['trade_result']    =   $this->gulden_model->fetchtradehistory($perpage,$urisegment);
            //$data['trade_result'] =   $result;
            $this->load->view('front/trade_history',$data);
        }   
        else
        {   
            $data['trade_result']   = "";
            $data['notfound']="No Trade History are found";        
            $this->load->view('front/trade_history',$data);       
        }
    }
}

function trade_history_type() //added by Jegan
{
    $this->gulden_model->trade_history_type();  
}

function transaction_history()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect('','refresh');      
    }
    else
    { 
        $perpage    =   $this->gulden_model->getrowsperpage(); 
        $urisegment =   $this->uri->segment(2);
        $result     =   $this->gulden_model->fetchtransactionhistory();    
        if($result)  
        {     
            $total_rows = $this->gulden_model->fetchtransactionhistorycount();   
            $base="transaction_history";            
            $this->pageconfig($total_rows,$base);         
            $data['transaction_result'] =   $result;
            $this->load->view('front/transaction_history',$data);       
        }   
        else
        {   
            $data['transaction_result'] = "";
            $data['notfound']="No Transaction History at the moment.";        
            $this->load->view('front/transaction_history',$data);         
        }
    }
}
function orders_history()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect('','refresh');      
    }
    else
    { 
        $perpage    =   $this->gulden_model->getrowsperpage(); 
        $urisegment =   $this->uri->segment(2);
        $result     =   $this->gulden_model->fetchorderhistory($perpage,$urisegment);    
        if($result)  
        {     
            $total_rows = $this->gulden_model->fetchorderhistorycount();   
            $base="orders_history";            
            $this->pageconfig($total_rows,$base);         
            $data['order_result']   =   $result;
            $this->load->view('front/orders_history',$data);        
        }   
        else
        {   
            $data['order_result']   = "";
            $data['notfound']="No Order History are found";        
            $this->load->view('front/orders_history',$data);          
        }
    }
}
function ajaxpairfororder()
{   

    $keyword    =   $this->input->post('keyword');
    $pairs  =   strtoupper($keyword);
    $result =   $this->gulden_model->ajaxpairforordermodel();
    if($result)
    {
        ?><table class="table-bordered">
        <tr align="center" class="clsRes_th">
            <th>Pair</th>
            <th>Type</th>
            <th>Price</th>
            <th>Amount</th>
            <th>Total</th>
            <th>Filled %</th>
            <th>Status</th>
            <th>Actions</th>
        </tr>
        <?php    foreach($result as $trade)  
        {       
            $tradetradeId           = $trade->trade_id;
            $tradeuserId            = $trade->userId;
            $tradePrice             = $trade->Price;
            $tradeAmount            = $trade->Amount;
            $tradeType              = $trade->Type;
            $tradeTotal             = $trade->Total;
            $tradefirstCurrency     = $trade->firstCurrency;
            $tradesecondCurrency    = $trade->secondCurrency;
            $tradestatus            = $trade->status;
            $orderDate              = $trade->orderDate;
            $orderTime              = $trade->orderTime;
            $pair = $tradefirstCurrency."/".$tradesecondCurrency;
            
            $activefilledAmount = $this->gulden_model->checkOrdertempdetails($tradetradeId,$tradeType);
            if($activefilledAmount)
            {
                $activefilledAmount = $tradeAmount-$activefilledAmount;
            }
            else
            {
                $activefilledAmount = $tradeAmount;
            }
            $activeCalcTotal = $activefilledAmount*$tradePrice;
            $filled = $activefilledAmount/$tradeAmount*100;
            $activefilledAmount=number_format((float)$activefilledAmount, 8, '.', '');
            $tradePrice=number_format((float)$tradePrice, 8, '.', '');
            $activeCalcTotal=number_format((float)$activeCalcTotal, 8, '.', '');
            ?>
            <tr>
                <td><b><?php echo $pair; ?></b></td>
                <?php if($tradeType=="Buy") { ?>
                <td><span style='color:#008000;font-weight:bold;'><?php echo $tradeType; ?></span></td>
                <?php   }   else    {   ?>
                <td><span style='color:#FF0000;font-weight:bold;'><?php echo $tradeType; ?></span></td>
                <?php } ?>
                <td><?php echo $activefilledAmount; ?></td>
                <td><?php echo $tradePrice; ?></td>
                <td><?php echo $activeCalcTotal; ?></td>
                <td><?php echo $filled."%"; ?></td>
                <td><?php echo "Active"; ?></td>
                <td><?php echo anchor('close_active_order1/'.$tradetradeId,'Cancel',array('onclick'=>"return confirm('Are you sure you want to delete this?');",'style'=>"color: red;")); ?></td>
            </tr>
            <?php   }   ?>
        </table>
        <?php
    }
    else
    {
        echo "<span style='color:red;font-weight: bold;font-size: 15px;'>No order history at the moment for $pairs pair</span>";
    }
}
function delete_userticket($id)
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect('','refresh');      
    }
    else
    {
        if($this->gulden_model->remove_userticketdetails($id))      
        {       
            $this->session->set_flashdata('success', "Ticket has been Deleted ");
            redirect('support','referesh');         
        }
        else
        {
            $this->session->set_flashdata('error', "There is some problem");
            redirect('support','referesh');         
        }
    }
}
function ajaxtypefororder()
{   

    $keyword    =   $this->input->post('keyword');
    //$types    =   strtoupper($keyword);
    $withdraw_result = $this->gulden_model->ajaxtypeforordermodel(); 
    if($withdraw_result)
        { ?>
    <table class="responsive">
      <tbody>
        <tr align="center" class="clsRes_th">
          <th width="14%" style="">ID</th>
          <th width="22%">Date</th>
          <th width="28%">Description</th>
          <th width="19%" style="">Amount</th>
          <th width="17%">Status</th>
      </tr>
      <?php
      foreach($withdraw_result as $row)
      {
        ?>
        <tr align="center">
          <td style=""><?php echo $row->with_id; ?></td>
          <td><?php echo $row->request_date ; ?></td>
          <td><?php echo $row->payment; ?></td>
          <td style=""><?php echo $row->amount; ?></td>
          <td><?php echo $row->status; ?></td>
      </tr>
      <?php } ?> 

  </tbody>
</table>
<?php
}
else
{
    echo "<span style='color:red;font-weight: bold;font-size: 15px;'>withdraws not found at the moment for $keyword</span>";
}
}
function deposit_order()
{

    $keyword    =   $this->input->post('keyword');
    //$types    =   strtoupper($keyword);
    $deposit_result = $this->gulden_model->deposit_order(); 
    if($deposit_result)
        { ?>
    <table class="responsive">
      <tbody>
        <tr align="center" class="clsRes_th">
          <th width="14%" style=""><?php echo $this->lang->line('ID');?></th>
          <th width="22%"><?php echo $this->lang->line('Date');?></th>
          <th width="28%"><?php echo $this->lang->line('Description');?></th>
          <th width="19%" style=""><?php echo $this->lang->line('Amount');?></th>
          <th width="17%"><?php echo $this->lang->line('Status');?></th>
      </tr>
      <?php
      foreach($deposit_result as $row)
      {
        ?>
        <tr align="center">
          <td style=""><?php echo $row->deposit_id; ?></td>
          <td><?php echo $row->request_date ; ?></td>
          <td><?php echo $row->type; ?></td>
          <td style=""><?php echo $row->amount; ?></td>
          <td><?php if($row->status=='cancel') { echo "Cancelled"; } else { echo $row->status; } ?></td>
      </tr>
      <?php } ?> 

  </tbody>
</table>
<?php
}
else
{
    echo "<span style='color:red;font-weight: bold;font-size: 15px;'>Deposits not found at the moment for $keyword</span>";
}
}
function deposit_orderstatus()
{

    $keyword    =   $this->input->post('keyword');
    //$types    =   strtoupper($keyword);
    $deposit_result = $this->gulden_model->deposit_orderstatus_model(); 
    if($deposit_result)
        { ?>
    <table class="responsive">
      <tbody>
        <tr align="center" class="clsRes_th">
          <th width="14%" style=""><?php echo $this->lang->line('ID');?></th>
          <th width="22%"><?php echo $this->lang->line('Date');?></th>
          <th width="28%"><?php echo $this->lang->line('Description');?></th>
          <th width="19%" style=""><?php echo $this->lang->line('Amount');?></th>
          <th width="17%"><?php echo $this->lang->line('Status');?></th>
      </tr>
      <?php
      foreach($deposit_result as $row)
      {
        ?>
        <tr align="center">
          <td style=""><?php echo $row->deposit_id; ?></td>
          <td><?php echo $row->request_date ; ?></td>
          <td><?php echo $row->type; ?></td>
          <td style=""><?php echo $row->amount; ?></td>
          <td><?php if($row->status=='cancel') { echo "Cancelled"; } else { echo $row->status; } ?></td>
      </tr>
      <?php } ?> 

  </tbody>
</table>
<?php
}
else
{
    echo "<span style='color:red;font-weight: bold;font-size: 15px;'>Deposits not found at the moment for $keyword</span>";
}

}
function ajaxstatusfororder()
{   

    $keyword    =   $this->input->post('keyword');
    //$result   =   $this->gulden_model->ajaxstatusforordermodel();
    $withdraw_result = $this->gulden_model->ajaxstatusforordermodel(); 
    if($withdraw_result)
        { ?>
    <table class="responsive">
      <tbody>
        <tr align="center" class="clsRes_th">
          <th width="14%" style="">ID</th>
          <th width="22%">Date</th>
          <th width="28%">Description</th>
          <th width="19%" style="">Amount</th>
          <th width="17%">Status</th>
      </tr>
      <?php
      foreach($withdraw_result as $row)
      {
        ?>
        <tr align="center">
          <td style=""><?php echo $row->with_id; ?></td>
          <td><?php echo $row->request_date ; ?></td>
          <td><?php echo $row->payment; ?></td>
          <td style=""><?php echo $row->amount; ?></td>
          <td><?php echo $row->status; ?></td>
      </tr>
      <?php } ?> 

  </tbody>
</table>
<?php
}
else
{
    echo "<span style='color:red;font-weight: bold;font-size: 15px;'>No withdraws at the moment for $keyword status</span>";
}
}
function ajaximageupload()
{

    $rnumber    =   mt_rand(0,999999); 
    $image      =   $rnumber."_".$_FILES['profile_image']['name'];
    move_uploaded_file($_FILES["profile_image"]["tmp_name"],"uploader/customers/profilepicture/".$image);
    $this->gulden_model->uploadprofilepicture($image);
    ?>  
    <img src="<?php echo base_url();?>uploader/customers/profilepicture/<?php echo $image; ?>" width="128" height="128" class="img-polaroid">
    <?php
}
function api_key()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect('','refresh');      
    }
    else
    { 
        $this->load->view('front/keys');
    }
}
function meta_trader()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect('','refresh');      
    }
    else
    { 
        $this->load->view('front/meta_trader');
    }
}

/* Message Section Starts Here  */
function compose()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect('','refresh');      
    }
    else
    { 
        $this->load->view('front/compose');
    }
} 
function inbox()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect('','refresh');      
    }
    else
    { 
        $perpage    =   $this->gulden_model->getrowsperpage(); 
        $urisegment =   $this->uri->segment(2);
        $result     =   $this->gulden_model->fetchinboxmessages($perpage,$urisegment);    
        if($result)  
        {     
            $total_rows = $this->gulden_model->fetchinboxmessagescount();   
            $base="inbox";            
            $this->pageconfig($total_rows,$base);         
            $data['inbox_result']   =   $result;
            $this->load->view('front/inbox',$data);     
        }   
        else
        {   
            $data['inbox_result']   = "";
            $data['notfound']="No Message are found";        
            $this->load->view('front/inbox',$data);       
        }
    }
} 
function outbox()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect('','refresh');      
    }
    else
    { 
        $perpage    =   $this->gulden_model->getrowsperpage(); 
        $urisegment =   $this->uri->segment(2);
        $result     =   $this->gulden_model->fetchoutboxmessages($perpage,$urisegment);    
        if($result)  
        {     
            $total_rows = $this->gulden_model->fetchoutboxmessagescount();   
            $base="outbox";            
            $this->pageconfig($total_rows,$base);         
            $data['outbox_result']  =   $result;
            $this->load->view('front/outbox',$data);        
        }   
        else
        {   
            $data['outbox_result']  = "";
            $data['notfound']="No Message are found";        
            $this->load->view('front/outbox',$data);          
        }
    }
} 
function suggest_users()
{

    $term = $this->input->post('term',TRUE);
    //if (strlen($term) < 2) break;
    $rows   =   $this->gulden_model->suggest_users_model(array('keyword' => $term));
    $json_array = array();
    foreach ($rows as $row)
    {
        array_push($json_array, $row->emailid);
        echo json_encode($json_array);
    }
}
function ajaxcompose()
{

    echo $result    =   $this->gulden_model->ajaxcomposemodel();
}
function deleteinboxmessage($id)
{

    $result =   $this->gulden_model->deleteinboxmessagemodel($id);
    if($result)
    {
        redirect('inbox','referesh');
    }
}
function deleteoutboxmessage($id)
{

    $result =   $this->gulden_model->deleteoutboxmessagemodel($id);
    if($result)
    {
        redirect('outbox','referesh');
    }
}
function view_msg($id)
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect('','refresh');      
    }
    else
    { 
        $this->session->set_userdata('ses_view_msg',$id);   
        redirect('view_message','referesh');  
    }
}
function view_message()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        $this->session->set_userdata('login_error','Please login here.');      
        redirect('butade/index','refresh');   
    }
    else
    {
        $id =   $this->session->userdata('ses_view_msg'); 
        $fetchdata  =   $this->gulden_model->get_individual_message($id);
        if($fetchdata)
        {
            $read_data  =   $this->gulden_model->assign_read_mail($id);
            if($read_data)
            {
                $data['view_result']    =   $fetchdata;  
                $this->load->view('front/view_message',$data);  
            }
        } 
    }
}
/* function notifications()
{
    $this->load->view('front/notifications');   
} */
/* Message Section Ends Here  */
function refreshmarketprice()
{

    $this->load->view('front/manage_currency');
}
function exchange($cur)
{   

    if($cur=="btc_usd")
    {
        $currency="btc_usd";
    }    
    else if($cur=="btc_rur")
    {
        $currency="btc_rur";
    }
    else if($cur=="btc_eur")
    {
        $currency="btc_eur";
    }
    else if($cur=="ltc_btc")
    {
        $currency="ltc_btc";
    }
    else if($cur=="ltc_usd")
    {
        $currency="ltc_usd";
    }
    else if($cur=="ltc_rur")
    {
        $currency="ltc_rur";
    }
    else if($cur=="ltc_eur")
    {
        $currency="ltc_eur";
    }
    else if($cur=="nmc_btc")
    {
        $currency="nmc_btc";
    }
    else if($cur=="nmc_usd")
    {
        $currency="nmc_usd";
    }
    else if($cur=="nvc_btc")
    {
        $currency="nvc_btc";
    }
    else if($cur=="nvc_usd")
    {
        $currency="nvc_usd";
    }
    else if($cur=="usd_rur")
    {
        $currency="usd_rur";
    }
    else if($cur=="eur_usd")
    {
        $currency="eur_usd";
    }
    else if($cur=="trc_btc")
    {
        $currency="trc_btc";
    }
    else if($cur=="ppc_btc")
    {
        $currency="ppc_btc";
    }
    else if($cur=="ppc_usd")
    {
        $currency="ppc_usd";
    }
    else if($cur=="ftc_btc")
    {
        $currency="ftc_btc";
    }
    else
    {
        $currency="xpm_btc";
    }
    $this->session->set_userdata('btc_currency_session',$currency);  
    redirect('','referesh');
}
function deposit_usd()
{
    ?>
    <div class="cls_main_block">
        <div class="row-fluid">
            <h3>Deposit USD</h3>
            <div class="span9 offset2">
                <div class="cls_steps">
                    <div class="payusdform" id="payusd" style="">
                        <form method="POST" action="paypal.php">
                            <p>
                                <input type="hidden" value="U2433593" name="PAYEE_ACCOUNT">
                                <input type="hidden" value="BTC-e" name="PAYEE_NAME">
                                <input type="text" value="0" style="width: 70px;" name="PAYMENT_AMOUNT">
                                <input type="hidden" value="USD" name="PAYMENT_UNITS">
                                <input type="hidden" value="https://btc-e.com/pm/status" name="STATUS_URL">
                                <input type="hidden" value="https://btc-e.com/pm/success" name="PAYMENT_URL">
                                <input type="hidden" value="https://btc-e.com/pm/fail" name="NOPAYMENT_URL">
                                <input type="hidden" value="UID" name="BAGGAGE_FIELDS">
                                <input type="hidden" value="300622" name="UID">
                                <input type="submit" value="Payment" class="btn btn-success" name="PAYMENT_METHOD">
                            </p><p>The Fee is 2%</p>
                            <p></p>
                        </form>
                    </div>

                    <div style="display: none;" class="payusdform" id="money">
                        <form id="egopay_form" method="post" action="https://www.egopay.com/payments/pay/form">
                            <input type="hidden" name="store_id" value="BBZN4JFYILHS">
                            <input type="text" style="width: 70px" id="egopay_amount" name="amount" value="0">
                            <input type="hidden" id="egopay_currency" name="currency" value="USD">
                            <input type="hidden" name="description" value="BTC-e deposit">
                            <input type="hidden" name="cf_1" value="300622">
                            <input type="hidden" id="egopay_sign" name="verify" value="">
                            <input type="submit" class="btn btn-success"  value="Payment">
                            <p class="gray">The Fee is  4%</p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php   
}
function deposit_eur()
{
    ?>
    <div class="cls_main_block">
        <div class="row-fluid">
            <h3>Deposit EUR</h3>
            <div class="span9 offset2">
                <div class="cls_steps">
                    <h4><img alt="" src="<?php echo base_url(); ?>assets/images/one.png"> Select Payment Method</h4>
                    <select onchange="switch_payeur(this.value)">
                        <option value="1">QIWI</option>
                        <option value="6">OKPAY</option>
                        <option value="7">Payeer.com</option>
                    </select>
                    <h4><img alt="" src="<?php echo base_url(); ?>assets/images/two.png"> Amount to pay</h4>
                    <div style="" class="payrurform" id="payrur1">
                        <h3>Выставление счета</h3>
                        <table style="margin-bottom: 5px" class="tabla2">
                            <tbody><tr>
                                <td style="width: 100px">Ваш номер:</td><td><input type="text" maxlength="13" placeholder="формат 9123456789" value="" id="qiwi_to"></td>
                            </tr>
                            <tr>
                                <td>Сумма:</td><td><input type="text" value="0" id="qiwi_amount"> руб. (макс 15 000 руб.)</td>
                            </tr>
                        </tbody></table>
                        <p style="margin-bottom: 5px" class="gray">Срок жизни счета - 3 дня. <b class="red">Комиссия - 5%</b></p>
                        <input type="submit" onclick="qiwi_deposit()" value="Payment" class="btn btn-success">
                    </div>

                    <div class="payrurform" style="display: none;" id="payrur6">
                        <p class="gray">The Fee is  2%</p>
                        <form action="https://www.okpay.com/process.html" method="post">
                            <input type="hidden" value="OK847848324" name="ok_receiver">
                            <input type="hidden" value="Deposit to BTC-E#300622" name="ok_item_1_name">
                            <input type="hidden" value="donation" name="ok_item_1_type">
                            <input type="hidden" value="rub" name="ok_currency">
                            <input type="image" src="https://btc-e.com/images/okpay_deposit_button.png" alt="OKPAY Payment" style="border: 0" name="submit">
                        </form>
                    </div>

                    <div style="display: none;" class="payrurform" id="payrur7">

                        <form id="payeer_form" action="//payeer.com/api/merchant/m.php" method="GET">
                            <input type="hidden" value="434246" name="m_shop">
                            <input type="hidden" value="" name="m_orderid">
                            <input type="text" value="0" style="width: 70px;" id="m_amount" name="m_amount">
                            <input type="hidden" value="RUB" id="m_curr" name="m_curr">
                            <input type="hidden" value="YnRjLWUgZGVwb3NpdCAjMzAwNjIy" name="m_desc">
                            <input type="hidden" value="" id="m_sign" name="m_sign">
                            <input type="submit" onclick="payeer_deposit(); return false;" value="Payment" class="btn btn-success" name="m_process">
                            <p class="gray">The Fee is  3% + payeer %</p>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    </div>
    <?php
}
function deposit_rur()
{
    ?>
    <div class="cls_main_block">
        <div class="row-fluid">
            <h3>Deposit RUR</h3>
            <div class="span9 offset2">
                <div class="cls_steps">
                    <h4><img alt="" src="<?php echo base_url(); ?>assets/images/one.png"> Select Payment Method</h4>
                    <select onchange="switch_payrur(this.value)">
                        <option value="22">OKPAY</option>
                        <option value="2">Perfect Money</option>
                        <option value="4">Payeer.com</option>
                        <option value="1">SEPA</option>
                    </select>
                    <h4><img alt="" src="<?php echo base_url(); ?>assets/images/two.png"> Amount to pay</h4>
                    <div class="payeurform" style="" id="payeur22">
                        <p class="gray">The Fee is  2%</p>
                        <form action="https://www.okpay.com/process.html" method="post">
                            <input type="hidden" value="OK847848324" name="ok_receiver">
                            <input type="hidden" value="Deposit to BTC-E#300622" name="ok_item_1_name">
                            <input type="hidden" value="donation" name="ok_item_1_type">
                            <input type="hidden" value="eur" name="ok_currency">
                            <input type="image" src="https://btc-e.com/images/okpay_deposit_button.png" alt="OKPAY Payment" style="border: 0" name="submit">
                        </form>
                    </div>

                    <div class="payeurform" id="payeur2" style="display: none;">
                        <form method="POST" action="https://perfectmoney.is/api/step1.asp">
                            <p>
                                <input type="hidden" value="E2503352" name="PAYEE_ACCOUNT">
                                <input type="hidden" value="BTC-e" name="PAYEE_NAME">
                                <input type="text" value="0" style="width: 70px;" name="PAYMENT_AMOUNT">
                                <input type="hidden" value="EUR" name="PAYMENT_UNITS">
                                <input type="hidden" value="https://btc-e.com/pm/status" name="STATUS_URL">
                                <input type="hidden" value="https://btc-e.com/pm/success" name="PAYMENT_URL">
                                <input type="hidden" value="https://btc-e.com/pm/fail" name="NOPAYMENT_URL">
                                <input type="hidden" value="UID" name="BAGGAGE_FIELDS">
                                <input type="hidden" value="300622" name="UID">
                                <input type="submit" value="Payment" class="btn btn-success" name="PAYMENT_METHOD">
                            </p><p class="gray">The Fee is  1%</p>
                            <p></p>
                        </form>
                    </div>

                    <div style="display: none;" class="payeurform" id="payeur4">
                        <form id="payeer_form" action="//payeer.com/api/merchant/m.php" method="GET">
                            <input type="hidden" value="434246" name="m_shop">
                            <input type="hidden" value="" name="m_orderid">
                            <input type="text" value="0" style="width: 70px;" id="m_amount" name="m_amount">
                            <input type="hidden" value="EUR" id="m_curr" name="m_curr">
                            <input type="hidden" value="YnRjLWUgZGVwb3NpdCAjMzAwNjIy" name="m_desc">
                            <input type="hidden" value="" id="m_sign" name="m_sign">
                            <input type="submit" onclick="payeer_deposit(); return false;" value="Payment" class="btn btn-success" name="m_process">
                            <p class="gray">The Fee is  3% + payeer %</p>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    </div>
    <?php
}
function btcecode()
{
    ?>
    <div class="cls_main_block">
        <div class="row-fluid">
            <h3 style="margin-bottom:5px;">Enter your Redeem Code here :</h3>
            <div class="span10 ">
                <input type="text" id="cryptocode" placeholder="Enter your Redeem Code here" class="span12">
            </div>
            <button class="btn btn-success pull-right" type="button" onclick="redeemFun();">Redeem</button>
        </div>
    </div>
    <?php
}
function makeredeemfun($btkcode)
{

    echo $result = $this->gulden_model->makeredeemfun($btkcode);
}
function fundwithdraw()
{

    $currency   =   $this->input->post('str');
    if($currency=="USD")
    {
        $num =  $this->input->post('num');
        if($num=='1')
        {
            $paymentname    =   "Perfect Money";
        }
        else if($num=='2')
        {
            $paymentname    =   "LiqPAY";
        }
        else if($num=='3')
        {
            $paymentname    =   "Paypal";
        }
        else if($num=='4')
        {
            $paymentname    =   "BTC-E Code";
        }
        else if($num=='5')
        {
            $paymentname    =   "QIWI";
        }
        else if($num=='6')
        {
            $paymentname    =   "Epese.com";
        }
        else if($num=='7')
        {
            $paymentname    =   "Ecoin.cc";
        }
        else if($num=='8')
        {
            $paymentname    =   "OKpay";
        }
        else if($num=='9')
        {
            $paymentname    =   "Paxum.com";
        }
        else if($num=='10')
        {
            $paymentname    =   "Payeer.com";
        }
        else if($num=='11')
        {
            $paymentname    =   "Egopay.com";
        }
        else
        {
            $paymentname    =   "Payza.com";
        }
        ?>
        <input type="hidden" value="<?php echo $currency; ?>" id="selected_currency">
        <input type="hidden" value="<?php echo $num; ?>" id="selected_num">
        <input type="hidden" value="0.5" id="system_1_fee">
        <input type="hidden" value="1.5" id="system_2_fee">
        <input type="hidden" value="1.8" id="system_3_fee">
        <input type="hidden" value="0.5" id="system_4_fee">
        <input type="hidden" value="2.5" id="system_5_fee">
        <input type="hidden" value="5" id="system_6_fee">
        <input type="hidden" value="5" id="system_7_fee">
        <input type="hidden" value="4" id="system_8_fee">
        <input type="hidden" value="0" id="system_9_fee">
        <input type="hidden" value="3" id="system_10_fee">
        <input type="hidden" value="2.5" id="system_11_fee">
        <input type="hidden" value="2" id="system_12_fee">
        
        <div class="cls_main_block">
            <div class="row-fluid">
                <h3>Withdrawal <?php echo $paymentname;?> <?php echo $currency;?><span style="font-size:12px;text-transform:capitalize;" class="pull-right">* USD Withdrawal within 72 hours</span></h3>
                <div class="span10 offset2">
                    <form class="bs-docs-example form-horizontal">
                        <div class="control-group">
                            <label class="control-label" for="inputEmail">Available funds :</label>
                            <div class="controls">
                                <a onclick="all_money('w_amount','sum');withdraw_calc()" href="javascript:void(0)"><span id="w_amount">418.20893609</span></a> <?php echo $currency;?>
                            </div>
                        </div>
                        <div class="control-group">
                            <label class="control-label" for="inputPassword" >Purse :</label>
                            <div class="controls">
                                <textarea rows="3" id="purse"></textarea>
                            </div>
                        </div>
                        <div class="control-group">
                            <label class="control-label" for="inputPassword">Amount to withdrawal :</label>
                            <div class="controls">
                                <input type="text" onchange="withdraw_calc(0)" onkeyup="withdraw_calc()" id="sum"> <span class="help-inline"><?php echo $currency;?></span>
                            </div>
                        </div>
                        <div class="control-group">
                            <label class="control-label" for="inputPassword">You will receive :</label>
                            <div class="controls">
                                <input type="text" onchange="withdraw_calc(1)" onkeyup="withdraw_calc(1)" id="wd_sum">  <span class="help-inline"><?php echo $currency;?></span>
                            </div>
                        </div>
                        <div class="control-group">
                            <label class="control-label" for="inputPassword">&nbsp;</label>
                            <div class="controls">
                                <button type="button" class="btn btn-success" onclick="withdraw(0);">Withdraw</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <?php         
    }
    else if($currency=="EUR")
    {
        $num =  $this->input->post('num');
        if($num=='1')
        {
            $paymentname    =   "Perfect Money";
        }
        else if($num=='2')
        {
            $paymentname    =   "OKpay";
        }
        else if($num=='3')
        {
            $paymentname    =   "Payeer.com";
        }
        else
        {
            $paymentname    =   "BTC-E Code";
        }
        ?>
        <input type="hidden" value="<?php echo $currency; ?>" id="selected_currency">
        <input type="hidden" value="<?php echo $num; ?>" id="selected_num">
        <input type="hidden" value="0.5" id="system_1_fee">
        <input type="hidden" value="1.5" id="system_2_fee">
        <input type="hidden" value="1.8" id="system_3_fee">
        <input type="hidden" value="0.5" id="system_4_fee">
        
        <div class="cls_main_block">
            <div class="row-fluid">
                <h3>Withdrawal <?php echo $paymentname;?> <?php echo $currency;?><span style="font-size:12px;text-transform:capitalize;" class="pull-right">* USD Withdrawal within 72 hours</span></h3>
                <div class="span10 offset2">
                    <form class="bs-docs-example form-horizontal">
                        <div class="control-group">
                            <label class="control-label" for="inputEmail">Available funds :</label>
                            <div class="controls">
                                <a onclick="all_money('w_amount','sum');withdraw_calc()" href="javascript:void(0)"><span id="w_amount">418.20893609</span></a> <?php echo $currency;?>
                            </div>
                        </div>
                        <div class="control-group">
                            <label class="control-label" for="inputPassword" >Purse :</label>
                            <div class="controls">
                                <textarea rows="3" id="purse"></textarea>
                            </div>
                        </div>
                        <div class="control-group">
                            <label class="control-label" for="inputPassword">Amount to withdrawal :</label>
                            <div class="controls">
                                <input type="text" onchange="withdraw_calc(0)" onkeyup="withdraw_calc()" id="sum"> <span class="help-inline"><?php echo $currency;?></span>
                            </div>
                        </div>
                        <div class="control-group">
                            <label class="control-label" for="inputPassword">You will receive :</label>
                            <div class="controls">
                                <input type="text" onchange="withdraw_calc(1)" onkeyup="withdraw_calc(1)" id="wd_sum">  <span class="help-inline"><?php echo $currency;?></span>
                            </div>
                        </div>
                        <div class="control-group">
                            <label class="control-label" for="inputPassword">&nbsp;</label>
                            <div class="controls">
                                <button type="button" class="btn btn-success" onclick="withdraw(0);">Withdraw</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <?php         
    }
    else if($currency=="RUR")
    {
        $num =  $this->input->post('num');
        if($num=='1')
        {
            $paymentname    =   "Qiwi";
        }
        else if($num=='2')
        {
            $paymentname    =   "BTC-E Code";
        }
        else if($num=='3')
        {
            $paymentname    =   "OKpay";
        }
        else
        {
            $paymentname    =   "Payeer.com";
        }
        ?>
        <input type="hidden" value="<?php echo $currency; ?>" id="selected_currency">
        <input type="hidden" value="<?php echo $num; ?>" id="selected_num">
        <input type="hidden" value="4" id="system_1_fee">
        <input type="hidden" value="2.5" id="system_2_fee">
        <input type="hidden" value="0.5" id="system_3_fee">
        <input type="hidden" value="5" id="system_4_fee">
        
        <div class="cls_main_block">
            <div class="row-fluid">
                <h3>Withdrawal <?php echo $paymentname;?> <?php echo $currency;?><span style="font-size:12px;text-transform:capitalize;" class="pull-right">* USD Withdrawal within 72 hours</span></h3>
                <div class="span10 offset2">
                    <form class="bs-docs-example form-horizontal">
                        <div class="control-group">
                            <label class="control-label" for="inputEmail">Available funds :</label>
                            <div class="controls">
                                <a onclick="all_money('w_amount','sum');withdraw_calc()" href="javascript:void(0)"><span id="w_amount">418.20893609</span></a> <?php echo $currency;?>
                            </div>
                        </div>
                        <div class="control-group">
                            <label class="control-label" for="inputPassword" >Purse :</label>
                            <div class="controls">
                                <textarea rows="3" id="purse"></textarea>
                            </div>
                        </div>
                        <div class="control-group">
                            <label class="control-label" for="inputPassword">Amount to withdrawal :</label>
                            <div class="controls">
                                <input type="text" onchange="withdraw_calc(0)" onkeyup="withdraw_calc()" id="sum"> <span class="help-inline"><?php echo $currency;?></span>
                            </div>
                        </div>
                        <div class="control-group">
                            <label class="control-label" for="inputPassword">You will receive :</label>
                            <div class="controls">
                                <input type="text" onchange="withdraw_calc(1)" onkeyup="withdraw_calc(1)" id="wd_sum">  <span class="help-inline"><?php echo $currency;?></span>
                            </div>
                        </div>
                        <div class="control-group">
                            <label class="control-label" for="inputPassword">&nbsp;</label>
                            <div class="controls">
                                <button type="button" class="btn btn-success" onclick="withdraw(0);">Withdraw</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <?php         
    }
}
function withdrawrequest()
{

    echo $result    =   $this->gulden_model->withdrawrequestmodel();
}

function getCurrencyname($currency)
{

    if($currency=="BTC")
    { 
        $currency_name = "Bitcoin"; 
    }
    else if($currency=="XRP")
    { 
        $currency_name = "Ripplecoin"; 
    }
    return $currency_name;
}

function depositnlgcoin()
{       

    $currency = "NLG";
    /* $litecoin = new jsonRPCClient('http://litecoinrpc:2vNmtT4ovkcszfReGkLeXPUJdfunXWgBqNjQa9hubEPf@127.0.0.1:9332/');
    $bitcoin = new jsonRPCClient('http://ramesh:Ramesh!@127.0.0.1:8332/'); */
    $customer_email_id      = $this->session->userdata('customer_email_id'); 
    // $data['currency_name']   = $this->getCurrencyname($currency);
    $data['currency']       = $currency;
    
    $checkAddress   = $this->gulden_model->checkdepositAddress($currency);
    if($checkAddress)
    { 
        $data['rootUrl'] = "https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=$checkAddress&choe=UTF-8&chld=L"; 
        $data['checkAddress'] = $checkAddress;
    }
    else
    {

        $createAddress="";
        
            $litecoin_row = $this->gulden_model->fetchWallet('nlgcoin');    // fetch litecoin wallet credentials
            /* echo $litecoin_username  =   $litecoin_row->username; 
            echo $litecoin_password  =   $litecoin_row->password;
            echo $litecoin_portnumber =  $litecoin_row->portnumber; */
            $litecoin_username  ='gulden'; 
            $litecoin_password  ='Gulden';
            $litecoin_portnumber ='9888';
            $litecoin   = new jsonRPCClient("http://$litecoin_username:$litecoin_password@127.0.0.1:$litecoin_portnumber/");
            $createAddress = $litecoin->getnewaddress(); 
            $updated = $this->gulden_model->updatecreatedAddress($createAddress,$currency,$xpub=NULL);
            if($updated)
            {       
                $data['rootUrl'] = "https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=$createAddress&choe=UTF-8&chld=L";
                $data['checkAddress'] = $createAddress;
            }
        }

        $this->load->view('front/bitcoin_deposit',$data);
    }
    function deposit_address($currency,$id)
    {

        $checkAddress   = $this->gulden_model->checkdepositAddress($currency,$id);
        if($checkAddress)
        { 
            return $checkAddress;
        }
        else
        {
            $customer_emailid = $this->gulden_model->get_useremailid($id);
            if($customer_emailid)
            {
                $customer_email_id = $customer_emailid;
            }
            else
            {
                $customer_email_id = "";
            }
            $createAddress="";
            if($currency=="BTC")
            { 
            $bitcoin_row = $this->gulden_model->fetchWallet('bitcoin');    // fetch bitcoin wallet credentials
            $bitcoin_username   =   $bitcoin_row->username;
            $bitcoin_password   =   $bitcoin_row->password;
            $bitcoin_portnumber =   $bitcoin_row->portnumber;
            $bitcoin    = new jsonRPCClient("http://$bitcoin_username:$bitcoin_password@127.0.0.1:$bitcoin_portnumber/");
            $createAddress = $bitcoin->getaccountaddress($customer_email_id);
        }
        else if($currency=="LTC")
        { 
            $litecoin_row = $this->gulden_model->fetchWallet('litecoin');    // fetch litecoin wallet credentials
            $litecoin_username  =   $litecoin_row->username;
            $litecoin_password  =   $litecoin_row->password;
            $litecoin_portnumber =  $litecoin_row->portnumber;
            $litecoin   = new jsonRPCClient("http://$litecoin_username:$litecoin_password@127.0.0.1:$litecoin_portnumber/");
            $createAddress = $litecoin->getaccountaddress($customer_email_id);
        } 
        $updated = $this->gulden_model->updatecreatedAddress($createAddress,$currency);
        if($updated)
        {       
            return $createAddress;
        }
    }
}
function generateAddress()
{

    $currency = "BTC";
    $customer_email_id  =   $this->session->userdata('customer_email_id'); 
    $result = $this->gulden_model->checkAddress($currency);
    $currency_name = $this->getCurrencyname($currency);
    
    $access_token   = $this->gulden_model->get_access_token();
    $user_wallet    = $this->gulden_model->get_userwallet();
        //$xpub     = $this->gulden_model->get_xpub();


    if($user_wallet)
    {



        $output = shell_exec('cd /var/www/html; /usr/bin/node new_add.js "'.trim($access_token).'" "'.trim($user_wallet).'"');

        $output = str_replace("running without secp256k1 acceleration", " ", $output);

        $output=json_decode($output);

        $createAddress = $output->address;


    }
    else
    {

        $createAddress = '';
    }

    
    $data['rootUrl'] = "https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=$createAddress&choe=UTF-8&chld=L";
    $rootUrl = "https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=$createAddress&choe=UTF-8&chld=L";

    $query = $this->gulden_model->updateAddress($createAddress,$currency);
    redirect('gulden/depositcoin');
    
}

function withdraw_coin() 
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect('','refresh');      
    }
    else
    { 
        $withdraw_fee = $this->gulden_model->get_withdrawfee();
        if($withdraw_fee)
        {
            $with_fee = $withdraw_fee->withdraw_fee_btc;
            $ltc_fee = $withdraw_fee->withdraw_fee_ltc;
            $eth_fee = $withdraw_fee->withdraw_fee_eth;
            $wcn_fee = $withdraw_fee->withdraw_fee_wcn;
            $hit_fee = $withdraw_fee->withdraw_fee_hit;  
        }
        else
        {
            $with_fee = 0;
            $ltc_fee = 0;
            $eth_fee = 0;
        }
        $data['with_fee'] = $with_fee;
        $data['ltc_fee'] = $ltc_fee;
        $data['eth_fee'] = $eth_fee;
        $data['wcn_fee'] = $wcn_fee;
        $data['hit_fee'] = $hit_fee;
        
        $this->load->view('front/withdraw_coin',$data);
    }
}


function withdrawcoin($currency)
{

    $pearlet_client_username    =   $this->session->userdata('pearlet_client_username');   
    if($currency=="BTC")
    {
        //$balance =    $this->gulden_model->getbalanceBTC();
        $balance =  $this->gulden_model->fetchCurrencyBalance('BTC');
        $data['min'] = "0.01";
        $data['fees'] = "0.001";
        $data['max'] = "100";
    }
    else if($currency=="LTC")
    {
        //$balance =    $this->gulden_model->getbalanceLTC();
        $balance =  $this->gulden_model->fetchCurrencyBalance('LTC');
        $data['min'] = "0.5";
        $data['fees'] = "0.01";
        $data['max'] = "5000";
    }
    else if($currency=="NMC")
    {
        //$balance =    $this->gulden_model->getbalanceNMC();
        $balance =  $this->gulden_model->fetchCurrencyBalance('NMC');
        $data['min'] = "0.2";
        $data['fees'] = "0.1";
        $data['max'] = "5000";
    }
    else if($currency=="WDC")
    {
        $balance =  $this->gulden_model->fetchCurrencyBalance('WDC');
        $data['min'] = "0.2";
        $data['fees'] = "0.1";
        $data['max'] = "50000";
    }
    else
    {
        //$data['balance'] =    $this->gulden_model->getbalanceXPM();
        $balance =  $this->gulden_model->fetchCurrencyBalance('DOGE');
        $data['min'] = "0.2";
        $data['fees'] = "0.1";
        $data['max'] = "50000";
    }
    if($balance)
    {
        $data['balance']=$balance;
    }
    else
    {
        $data['balance']=0;
    }
    $data['currency'] = $currency;
    $this->load->view('front/withdrawcoins',$data);
}
function withdraw_paypal()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id==""))
    {   
        redirect(' ','refresh');     
    }
    else
    {
        $data['currency']="USD";
        $this->load->view('front/withdraw_paypal',$data);
    }
}
function numeric_wcomma ($str)
{


        //echo preg_match('/^[0-9,]+$/', $str); exit;
    if(is_numeric($str) && $str!=0) 
    {
        return true;
    }
    else
    {
        return false;
    }
}
function international_withdraw()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id==""))
    {   
        redirect(' ','refresh');     
    }
    else
    {
        if (!$this->input->post('submit'))
        {

           $available_usd = $this->gulden_model->fetchuserbalancebyId($customer_user_id,'EUR');

           $result = $this->gulden_model->get_iwuserdata();
           if($result)
           {
            $data['acc_name']       = $result->acc_name;
            $data['acc_address']    = $result->acc_address;
            $data['city']           = $result->city;
            $data['postal_code']    = $result->postal_code;
            $data['iban']           = $result->iban;
            $data['country']        = $result->country;
            $data['bank_country']   = $result->bank_country;
            $data['swift']          = $result->swift;
            $data['bank_name']      = $result->bank_name;
            $data['bank_address']   = $result->bank_address;
            $data['bank_postalcode']= $result->bank_postalcode;
            $data['bank_city']      = $result->bank_city;
            $data['bank_address']   = $result->bank_address;
        }
        else
        {
            $data['acc_name']       = "";
            $data['acc_address']    = "";
            $data['city']           = "";
            $data['postal_code']    = "";
            $data['iban']           = "";
            $data['country']        = "";
            $data['bank_country']   = "";
            $data['swift']          = "";
            $data['bank_name']      = "";
            $data['bank_address']   = "";
            $data['bank_postalcode']= "";
            $data['bank_city']      = "";
            $data['bank_address']   = "";
        }
        $data['currency']="USD";
        $withdraw_fee = $this->gulden_model->get_withdrawfee();
        if($withdraw_fee)
        {
            $with_fee = $withdraw_fee->withdraw_fee_btc;
            $ltc_fee = $withdraw_fee->withdraw_fee_ltc;
            $eth_fee = $withdraw_fee->withdraw_fee_eth;
        }
        else
        {
            $with_fee = 0;
            $ltc_fee = 0;
            $eth_fee = 0;
        }
        $data['with_fee'] = $with_fee;
        $data['ltc_fee'] = $ltc_fee;
        $data['eth_fee'] = $eth_fee;
        $this->load->view('front/withdraw_coin',$data);
    }
    else
    {
        $result = $this->gulden_model->international_withdraw_req();
        if($result)
        {
            $this->session->set_flashdata('success',"Your withdraw confirmation sent your mail!");
            redirect('gulden/withdraw_coin','referesh');        
        }
        else
        {
            $this->session->set_flashdata('error',"Your request is failed! you dont have a enough balance");
            redirect('gulden/withdraw_coin','referesh');        
        }

    }
}
}
function withdrawecurrencyrequest()
{

    echo $result = $this->gulden_model->withdrawrequestmodel();
}
function paypal_litecoin()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id==""))
    {   
        redirect(' ','refresh');     
    }
    else
    {
        $data['currency']="LTC";
        $this->load->view('front/withdraw_paypal',$data);
    }
}
function coinwithdrawrequest()
{

    $amount = $this->input->post('btc_amount'); 
    $customer_email_id        =        $this->session->userdata('customer_email_id'); 
    $customer_user_id        =        $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") || $amount==0 || $amount=="")
    {   
     echo "login";
 }
 else
 {
    $balance = $this->gulden_model->fetchuserbalancebyId($customer_user_id,'BTC');
    if($amount <= $balance)
    {
        echo $result    =   $this->gulden_model->withdrawcoinrequestmodel();
    }
    else
    {
        echo "balance";
    }
}

}
function ltccoinwithdrawrequest()
{

    $amount = $this->input->post('ltc_amount'); 
    $customer_email_id        =        $this->session->userdata('customer_email_id'); 
    $customer_user_id        =        $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") || $amount==0 || $amount=="")
    {   
     echo "login";
 }
 else
 {
    $balance = $this->gulden_model->fetchuserbalancebyId($customer_user_id,'LTC');
    if($amount <= $balance)
    {
        echo $result    =   $this->gulden_model->withdrawlcoinrequestmodel();
    }
    else
    {
        echo "balance";
    }
}

}

function wcncoinwithdrawrequest()
{

    $amount = $this->input->post('wcn_amount'); 
    $customer_email_id        =        $this->session->userdata('customer_email_id'); 
    $customer_user_id        =        $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") || $amount==0 || $amount=="")
    {   
     echo "login";
 }
 else
 {
    $balance = $this->gulden_model->fetchuserbalancebyId($customer_user_id,'WCN');
    if($amount <= $balance)
    {
        echo $result    =   $this->gulden_model->withdrawlwcncoinrequestmodel();
    }
    else
    {
        echo "balance";
    }
}

}
function hitcoinwithdrawrequest()
{

    $amount = $this->input->post('hit_amount'); 
    $customer_email_id        =        $this->session->userdata('customer_email_id'); 
    $customer_user_id        =        $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") || $amount==0 || $amount=="")
    {   
     echo "login";
 }
 else
 {
    $balance = $this->gulden_model->fetchuserbalancebyId($customer_user_id,'HIT');
    if($amount <= $balance)
    {
        echo $result    =   $this->gulden_model->withdrawlhitcoinrequestmodel();
    }
    else
    {
        echo "balance";
    }
}

}

function ecoinwithdrawrequest()
{

    $amount = $this->input->post('nlg_amount'); 
    $customer_email_id        =        $this->session->userdata('customer_email_id'); 
    $customer_user_id        =        $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") || $amount==0 || $amount=="")
    {   
     echo "login";
 }
 else
 {
    $balance = $this->gulden_model->fetchuserbalancebyId($customer_user_id,'NLG');
    if($amount <= $balance)
    {
        echo $result    =   $this->gulden_model->withdrawecoinrequestmodel();
    }
    else
    {
        echo "balance";
    }
}

}


function checkbtcAddress($address)
{

    $origbase58 = $address;
    $dec = "0";

    for ($i = 0; $i < strlen($address); $i++)
    {

        $dec = bcadd(bcmul($dec,"58",0),strpos("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",substr($address,$i,1)),0);
    }

    $address = "";

    while (bccomp($dec,0) == 1)
    {
        $dv = bcdiv($dec,"16",0);
        $rem = (integer)bcmod($dec,"16");
        $dec = $dv;
        $address = $address.substr("0123456789ABCDEF",$rem,1);
    }

    $address = strrev($address);

    for ($i = 0; $i < strlen($origbase58) && substr($origbase58,$i,1) == "1"; $i++)
    {
        $address = "00".$address;
    }

    if (strlen($address)%2 != 0)
    {
        $address = "0".$address;
    }

    if (strlen($address) != 50)
    {
        return false;
    }
// echo hexdec(substr($address,0,2));
    if (hexdec(substr($address,0,2)) > 0 )
    {
        // echo "test";
        return false;
    }

    return substr(strtoupper(hash("sha256",hash("sha256",pack("H*",substr($address,0,strlen($address)-8)),true))),0,8) == substr($address,strlen($address)-8);
}
function withdraw()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id==""))
    {   
        redirect('gulden/login','refresh');      
    }
    else
    {
        $this->load->view('front/withdraw');
    }
}
function bitcoin_withdraw()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id==""))
    {   
        redirect(' ','refresh');     
    }
    else
    {
        $withdraw_fee = $this->gulden_model->get_withdrawfee();
        if($withdraw_fee)
        {
            $with_fee = $withdraw_fee->withdraw_fee_btc;
        }
        else
        {
            $with_fee = 0;
        }
        $data['with_fee'] = $with_fee;
        $this->load->view('front/bitcoin_withdraw',$data);
    }
}
function redeemrequest()
{

    echo $result    =   $this->gulden_model->redeemrequestmodel();
}
function redeem_confirm($token)
{

    $check_userid   =   $this->session->user_id; 
    $row            = $this->gulden_model->checkredeemToken($token);
    $redeemUserid   =   $row->userId;
    $currency   =   $row->currency;
    $redeemstatus   =   $row->status;
    if($check_userid==$redeemUserid)
    {
        if($redeemstatus=="cancelled" || $redeemstatus=="sentcode")
        {
            $data['value'] = "Warning: Application has already been confirmed or canceled earlier";
        }
        else
        {
            $code1 = $this->gulden_model->generateredeemString();
            $code2 = $this->gulden_model->generateredeemString();
            $code3 = $this->gulden_model->generateredeemString();
            $code4 = $this->gulden_model->generateredeemString();
            $code5 = $this->gulden_model->generateredeemString();
            //BTCE-BTC-UMBQW2OU-KHBMG42V-FE0ROVSU-IGJ2F9KA-IU8N7GUB
            $redeemcode = "Redeem".$currency."-".$code1."-".$code2."-".$code3."-".$code4."-".$code5;
            $updated = $this->gulden_model->updateRedeemcode($redeemcode,$token);
            if($updated)
            {
                $data['value'] = "Your Redeem Code: ".$redeemcode;
            }
        }
    }
    else
    {
        $data['value']  =   "Error: you need to be logged in";
    }
    $this->load->view('front/status',$data);
}
function redeem_cancel($token)
{

    $row = $this->gulden_model->checkredeemToken($token);
    $redeemUserid   =   $row->userId;
    $redeemstatus   =   $row->status;
    $customer_user_id   =   $this->session->user_id;  
    if($customer_user_id==$redeemUserid)
    {
        if($redeemstatus=="cancelled" || $redeemstatus=="sentcode")
        {
            $data['value'] = "Warning: Application has already been confirmed or canceled earlier";
        }
        else
        {
            $updated = $this->gulden_model->cancelRedeem($token);
            if($updated)
            {
                $data['value'] = "Success: Your application has been cancelled successfully.";
            }
        }
    }
    else
    {
        $data['value']  =   "Warning: you need to be logged in";
    }
    $this->load->view('front/status',$data);
}
function status()
{

    $this->load->view('front/status');
}
function cancelRedeem($token)
{

    $result = $this->gulden_model->cancelRedeem($token);
    if($result)
    {
        echo "success";
    }
    else
    {
        echo "failure";
    }
}
function resendRedeem($token)
{

    echo $result = $this->gulden_model->resendRedeem($token);
}
function withdraw_confirm($token)
{

    $row        =   $this->gulden_model->checkconfirmation($token);
    $Userid     =   $row->userId;
    $Status     =   $row->status;
    $customer_user_id   =   $this->session->user_id;  
    if($customer_user_id==$Userid)
    {
        if($Status=="cancelled" || $Status=="finished" || $Status=="confirmed")
        {
            $data['value'] = "Warning: Application has already been confirmed or canceled earlier";
        }
        else
        {
           $confirmResult     =   $this->gulden_model->updateconfirmation($token);
           $taken          =   $this->gulden_model->withdraw_confirmmodel($token);
           $ant            =   $taken->amount;
           $amount         =   (float)$ant;
           $purse          =   $taken->purse;
           $currency       =   $taken->currency;

           if($currency=="BTC")
           {

            $btc_amount         = $amount;
            $user_wallet        = $this->gulden_model->get_adminpurse();
            $access_token       = $this->gulden_model->get_access_token();
            $wallet_passphrase  = $this->gulden_model->get_walletpass();

            $output = shell_exec('cd /var/www/html; /usr/bin/node with.js "'.trim($access_token).'" "'.$user_wallet.'" "'.$wallet_passphrase.'" "'.$purse.'" "'.$btc_amount.'"');
                /*echo "<pre>"; 
                print_r($output);*/
                $output = str_replace("running without secp256k1 acceleration", " ", $output);
                $abc = json_decode($output);
                      /*echo "<pre>";
                      print_r($abc);*/ 
                      $isvalid = $abc->hash; 

                  }
                  else if($currency=='NLG')
                  {
                $litecoin_row = $this->gulden_model->fetchWallet('litecoin');    // fetch litecoin wallet credentials
                /*$litecoin_username  =   $litecoin_row->username;
                $litecoin_password  =   $litecoin_row->password;
                $litecoin_portnumber =  $litecoin_row->portnumber;*/
                $litecoin_username  ='gulden'; 
                $litecoin_password  ='Gulden';
                $litecoin_portnumber ='9888';
                $litecoin   = new jsonRPCClient("http://$litecoin_username:$litecoin_password@127.0.0.1:$litecoin_portnumber/");
                $isvalid = $litecoin->sendtoaddress($purse,$amount);
                
            }
            else if($currency=='WCN')
            {
                $litecoin_row = $this->gulden_model->fetchWallet('wcn');    // fetch litecoin wallet credentials
                $litecoin_username  =   $litecoin_row->username;
                $litecoin_password  =   $litecoin_row->password;
                $litecoin_portnumber =  $litecoin_row->portnumber;
                $litecoin   = new jsonRPCClient("http://$litecoin_username:$litecoin_password@127.0.0.1:$litecoin_portnumber/");
                $isvalid = $litecoin->sendtoaddress($purse,$amount);
                
            }
            else if($currency=='HIT')
            {
                $litecoin_row = $this->gulden_model->fetchWallet('hitcoin');    // fetch litecoin wallet credentials
                $litecoin_username  =   $litecoin_row->username;
                $litecoin_password  =   $litecoin_row->password;
                $litecoin_portnumber =  $litecoin_row->portnumber;
                $litecoin   = new jsonRPCClient("http://$litecoin_username:$litecoin_password@127.0.0.1:$litecoin_portnumber/");
                $isvalid = $litecoin->sendtoaddress($purse,$amount);
                
            }
            else
            {
               $from_address = $this->gulden_model->get_eth_address();
               echo $address = '"'.trim($from_address).'"';
               echo $to = '"'.trim($purse).'"';
               $amounts = $amount * 1000000000000000000; 

               $amount1 =  rtrim(sprintf("%u", $amounts), ".");

                //  $amounts = str.replace()
               $lastnumber = exec('curl -X POST --data \'{"jsonrpc":"2.0","method":"personal_unlockAccount","params":['.$address.',"password",null],"id":1}\' "http://localhost:8545"');

               /* echo 'curl -X POST --data \'{"jsonrpc":"2.0","method":"eth_sendTransaction","params":[{"from":'.$address.',"to":'.$to.',"value":'.$amounts.'}],"id":22}\' "http://localhost:8565"';*/

               $output = exec('curl -X POST --data \'{"jsonrpc":"2.0","method":"eth_sendTransaction","params":[{"from":'.$address.',"to":'.$to.',"value":'.$amount1.'}],"id":22}\' "http://localhost:8545"');

               print_r($output);

               $abc = json_decode($output);

               $isvalid = $abc->result;  


           }
           if(!isset($isvalid))
           {
            $isvalid = "";
        }
        $result     = $this->gulden_model->updateTransaction($isvalid,$token);
        if($result)
        {
                // echo "fdskjfdsjfk";
            $data['value']  =   "Application successfully validated.";
        }
    }
}
else
{
    $data['value']  =   "Warning: you need to be logged in";
}
    // echo "fdsfdsfddddd";
$this->load->view('front/status',$data);
}
function withdraw_cancel($token)
{

    $row = $this->gulden_model->checkconfirmation($token);
    $Userid     =   $row->userId;
    $Status     =   $row->status;
    $askamount  =   $row->askamount;
    $currency   =   $row->currency;
    $customer_user_id   =   $this->session->user_id;  
    if($customer_user_id==$Userid)
    {

        if($Status=="cancelled" || $Status=="confirmed" || $Status=="finished")
        {
            $data['value'] = "Warning: Application has already been confirmed or canceled earlier";
        }
        else
        {
            $updated = $this->gulden_model->updatecancellation($token,$Userid,$currency,$askamount);
            if($updated)
            {
                $data['value'] = "Your application successfully cancelled.";
            }
        }
    }
    else
    {
        $data['value']  =   "Warning: you need to be logged in";
    }
    $this->load->view('front/status',$data);
}
function ewithdraw_confirm($token)
{

    $row        = $this->gulden_model->checkEconfirmation($token);
    $Userid     =   $row->user_id; 
    $Status     =   $row->status;
    $customer_user_id   =   $this->session->user_id;  
    //if($customer_user_id==$Userid)
    //{
    if($Status=="cancelled" || $Status=="pending" || $Status=="confirmed" || $Status=="filled")
    {
        $data['value'] = "Warning: Application has already been confirmed or cancelled earlier";
    }
    else
    {
        $confirmResult  = $this->gulden_model->updateEconfirmation($token);
        if($confirmResult==1)
        {
            $data['value']  =   "Application successfully validated.";
        }else{
            $data['value']  =   "Application not validated Some Errors are occured.";
        }
    }
    /*}
    else
    {
        $data['value']  =   "Error: you need to be logged in";
    }*/
    $this->load->view('front/status',$data);
}
function ewithdraw_cancel($token)
{

    $row        = $this->gulden_model->checkEconfirmation($token);
    $Userid     =   $row->user_id;
    $Status     =   $row->status;
    $currency   =   $row->currency;
    $askamount  =   $row->askamount;
    $orderid    =   $row->orderid;
    $payment    =   $row->payment;
    $customer_user_id   =   $this->session->user_id;  
    if($customer_user_id==$Userid)
    {
        if($Status=="cancelled" || $Status=="pending" || $Status=="confirmed" || $Status=="filled")
        {
            $data['value'] = "Warning: Application has already been confirmed or cancelled earlier";
        }
        else
        {
            $updated = $this->gulden_model->updateEcancellation($token,$Userid,$currency,$askamount,$orderid,$payment);
            if($updated)
            {
                $data['value'] = "Your application successfully cancelled.";
            }
        }
    }
    else
    {
        $data['value']  =   "Warning: you need to be logged in";
    }
    $this->load->view('front/status',$data);
}
function cronupdateReceivedamount() // cronjob for deposit
{

    $result = $this->gulden_model->updateReceivedamount();
}
function cronforOrders() // cronjob for orders
{

    $result = $this->gulden_model->cronforOrdersmodel();
}
function mapping() 
{

    $type = $this->input->post('type');
    $result = $this->gulden_model->mapping($type); 
    if($result=="empty")
    {
        echo "failure";
    }
    else
    {
        echo "success_".$result;
    }  
}
function cancel_stop_order($id)
{

    $result = $this->gulden_model->cancel_stop_order($id);
    if($result='NGN'){
        $currency = 'BTC_NGN';
    }else{
        $currency = 'BTC_USD';
    }
    $data['currency']=$currency;
    redirect('gulden/tradeorder',$data);
}
function createBuyorder()
{

    $amount = $this->input->post('amount');
    $price  = $this->input->post('price');
    $total  = $this->input->post('total');
    $firstCurrency  = $this->input->post('firstCurrency');
    $secondCurrency     = $this->input->post('secondCurrency');
    $customer_email_id        =        $this->session->userdata('customer_email_id'); 
    $customer_user_id        =        $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") || $amount==0 || $price==0 || $amount=="" || $price=="")
    {   
     echo "login";
 }
 else
 {
    $balance = $this->gulden_model->fetchuserbalancebyId($customer_user_id,$secondCurrency);
    if($total <= $balance)
    {
        echo $result = $this->gulden_model->createBuyordermodel();
    }
    else
    {
        echo "balance";
    }
}
}
function createSellorder()
{

    $amount = $this->input->post('amount');
    $price = $this->input->post('price');
    $total = $this->input->post('total');
    $firstCurrency = $this->input->post('firstCurrency');
    $customer_email_id        =        $this->session->userdata('customer_email_id'); 
    $customer_user_id        =        $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") || $amount==0 || $price==0 || $amount=="" || $price=="")
    {   
     echo "login";
 }
 else
 {
    $balance = $this->gulden_model->fetchuserbalancebyId($customer_user_id,$firstCurrency);
    if($amount<=$balance)
    {
            // echo $result = $this->gulden_model->createBuyordermodel();
        echo $result = $this->gulden_model->createSellordermodel();
    }
    else
    {
        echo "balance";
    }
}
}
function createBuystoporder()
{
    echo $result = $this->gulden_model->createBuystopordermodel();
}
function createSellstoporder()
{
    echo $result = $this->gulden_model->createSellstopordermodel();
}
function createconSellorder()
{
    echo $result = $this->gulden_model->createconSellordermodel();
}
function createTrades()
{
    $result = $this->gulden_model->createTradesmodel();
}
function postComment()
{

    $inputpost  = trim($this->input->post('inputpost'));
    $disallowed = array('damn','bull','bullshit','suck','fuck','shit','fucking','sucking','idiot','stupid','f-u-c-k','s-u-c-k','fu-ck','su-ck');
    $string     = word_censor($inputpost, $disallowed, 'Beep!');
    if (strstr($string, 'Beep!') !== false)
    { 
        echo "error";   
    }
    else
    {
        $result = $this->gulden_model->postCommentmodel();
    }
}

function refreshChat()
{

    $result =   $this->gulden_model->refreshChatmodel();
    $userid                     = $this->session->userdata('customer_client_id');
    foreach($result as $chaty)
    {
        $chat_id   = $chaty->chat_id;
        $userId1   = $chaty->userId;
        $username   = $chaty->username;
        $message    = $chaty->message;
        $datetime   = $chaty->datetime;
        $datetime = date('Y-m-d H:i', strtotime($datetime));
        ?>
        <li class="list_val">
            <div class="cls_blu_text"> <?php echo $username; ?>: </div>
            <div class="cls_gray_text"> <?php echo $message; ?><?php if($userid==$userId1){ ?><a onclick="return confirm('Do you want to delete this news ?');" class="icon-remove" title="Delete" href="<?php echo base_url();?>gulden/delete_chat/<?php echo $chat_id;?>"> X </a> <?php }else{?><a  class="icon-remove" disabled title="Delete" href="#"></a> <?php } ?> </div>
        </li>

        <!-- <li class="list_val"><a href=""><?php echo $username; ?>:</a><em><?php echo $message; ?></em></li>  -->
        <?php   }   
    }

    function insertPMdetails()
    {

        echo $this->gulden_model->insertPMdetails();
    }
    function notification()
    {

     $customer_email_id        =        $this->session->userdata('customer_email_id'); 
     $customer_user_id        =        $this->session->user_id; 
     if(($customer_email_id=="") && ($customer_user_id=="") )
     {   
         $this->session->set_userdata('login_error','Please login here.');      
         redirect('','refresh');   
     }
     else
     {

         $this->load->view('front/notification');        
     }
 }
 function remove_notif($notif_id)
 {

    $remove = $this->gulden_model->remove_notif_model($notif_id);
    redirect('notification','refresh');    
}
//active orders
function close_active_order($id)
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect('','refresh');      
    }
    else
    { 
        $this->session->set_userdata('sessionCloseorder',$id);   
        redirect('gulden/closeActiveorder','referesh');  
    }
}
function closeActiveorder()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        $this->session->set_userdata('login_error','Please login here.');      
        redirect('','refresh');   
    }
    else
    {   
        $id =   $this->session->userdata('sessionCloseorder'); 
        $res_order = $this->gulden_model->remove_active_model($id);
        redirect('gulden/tradeorder','refresh');    
    }
}
function close_active_order1($id)
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect('','refresh');      
    }
    else
    { 
        $this->session->set_userdata('sessionCloseorder',$id);   
        redirect('closeActiveorder1','referesh');  
    }
}
function closeActiveorder1()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        $this->session->set_userdata('login_error','Please login here.');      
        redirect('','refresh');   
    }
    else
    {   
        $id =   $this->session->userdata('sessionCloseorder'); 
        $res_order = $this->gulden_model->remove_active_model($id);
        redirect('openOrders_ltcmarket','refresh');    
    }
}
function chatlog()
{

    $this->load->view('front/chatlog');
}
function api_documentation()
{

    $this->load->view('front/api');
}
function search()
{

    $array = $this->uri->uri_to_assoc(2);
    $empty = "";
    //api key empty or not
    if(isset($array['api'],$array))
    {
        $api_key    = $array['api'];
    }
    else
    {
        echo "<h3 align='center'><font color='red'>Please Provide API Key</font></h3>";
        
    }
    if(isset($array['secret'],$array))
    {
        $secret = $array['secret'];
    }
    else
    {
        echo "<h3 align='center'><font color='red'>Please Provide Secret Key</font></h3>";
        $empty = "fsdfdsfsdf";
    }
    if(isset($array['method'],$array))
    {
        $method = $array['method'];
    }
    else
    {
        echo "<h3 align='center'><font color='red'>Please Provide Any Method</font></h3>";
        $empty = "fsdddddddd";
    }
    if(isset($array['currency'],$array))
    {
        $deposit_currency   = $array['currency'];
    }
    if(isset($array['address'],$array))
    {
        $address    = $array['address'];
    }
    if(isset($array['amount'],$array))
    {
        $amount = $array['amount'];
    }
    if(isset($array['price'],$array))
    {
        $price  = $array['price'];
    }
    if(isset($array['currency_pair'],$array))
    {
        $currency_pair  = $array['currency_pair'];
    }
    //checking whether the api is assigned for the user
    if(isset($api_key) && isset($secret) && isset($method))
    {
        if(!$this->gulden_model->checkapi($api_key,$secret))
        {
            echo "<h3 align='center'><font color='red'>Invalid API Key or Secret Key</font></h3>";
        }
        else
        {   
            $getUserid = $this->gulden_model->getUserdetailbyapi($api_key);
            if($method=="getInfo")
            {
                $checkedMethod = $this->gulden_model->checkinfoMethod($api_key);
                if($checkedMethod)
                {
                    $fetchresult = $this->gulden_model->fetchapibalance($getUserid);
                    $ordercount  = $this->gulden_model->getActiveorders($getUserid);
                    $btc = $fetchresult->BTC;
                    $ltc = $fetchresult->LTC;
                    
                    $test[]= array(     
                        'LTC'=>trim($ltc),                                      
                        'BTC'=>trim($btc),
                        'open_orders'=>trim($ordercount),
                        );
                }
                else
                {
                    $test[]=array('1'=>'error');
                    echo "Access Denied.";
                }
            }
            else if($method=="TransHistory")
            {
                $checkedMethod = $this->gulden_model->checktradeMethod($api_key);
                if($checkedMethod)
                {
                    $TransHistory = $this->gulden_model->getTranshistorys($getUserid);
                    if($TransHistory)
                    {
                        foreach($TransHistory as $trans)
                        {   
                            $transtype      = $trans->type;
                            $transcomment   = $trans->comment;
                            $transdate      = $trans->date;
                            $transtime      = $trans->time;
                            $transstatus    = $trans->status;
                            $test[]=array(  'Type'=>trim($transtype),
                                'Comment'=>trim($transcomment),
                                'Date'=>trim($transdate),
                                'Time'=>trim($transtime),
                                'Status'=>trim($transstatus),
                                );
                        }
                    }
                    else
                    {
                     $test[]=array('1'=>'error');
                     echo "No Orders";
                 }
             }
             else
             {
                $test[]=array('1'=>'error');
                echo "Access Denied.";
            }
        }
        else if($method=="TradeHistory")
        {
            $checkedMethod = $this->gulden_model->checktradeMethod($api_key);
            if($checkedMethod)
            {
                $TradeHistory = $this->gulden_model->getTradehistory($getUserid);
                if($TradeHistory)
                {
                    foreach($TradeHistory as $trade)
                    {   
                        $trade_orderId      = $trade->trade_id;
                        $trade_type             = $trade->Type;
                        $trade_firstCurrency    = $trade->firstCurrency;
                        $trade_secondCurrency   = $trade->secondCurrency;
                        $trade_amount           = $trade->Amount;
                        $trade_date             = $trade->orderDate;
                        $trade_time             = $trade->orderTime;
                        $trade_status           = $trade->status;
                        $pair = $trade_firstCurrency."_".$trade_secondCurrency;
                        $test[]=array(  'Order Id'=>trim($trade_orderId),
                            'Type'=>trim($trade_type),
                            'Pair'=>trim($pair),
                            'Amount'=>trim($trade_amount),
                            'Date'=>trim($trade_date),
                            'Time'=>trim($trade_time),
                            'Status'=>trim($trade_status),
                            );
                    }
                }
                else
                {
                 $test[]=array('1'=>'error');
                 echo "No Orders";
             }
         }
         else
         {
             $test[]=array('1'=>'error');
             echo "Access Denied.";
         }
     }
     else if($method=="CancelOrder")
     {
        $checkedMethod = $this->gulden_model->checktradeMethod($api_key);
        if($checkedMethod)
        {
            $CancelOrder = $this->gulden_model->getCancelorders($getUserid);
            if($CancelOrder)
            {
                foreach($CancelOrder as $cancel)
                {   
                    $cancel_orderId         = $cancel->trade_id;
                    $cancel_type            = $cancel->Type;
                    $cancel_firstCurrency   = $cancel->firstCurrency;
                    $cancel_secondCurrency  = $cancel->secondCurrency;
                    $cancel_date            = $cancel->orderDate;
                    $cancel_time            = $cancel->orderTime;
                    $cancel_status          = $cancel->status;

                    $test[]=array(  'Order Id'=>trim($cancel_orderId),
                        'Type'=>trim($cancel_type),
                        'Buy Currency'=>trim($cancel_firstCurrency),
                        'Sell Currency'=>trim($cancel_secondCurrency),
                        'Date'=>trim($cancel_date),
                        'Time'=>trim($cancel_time),
                        'Status'=>trim($cancel_status),
                        );
                }
            }
            else
            {
             $test[]=array('1'=>'error');
             echo "No Orders";
         }
     }
     else
     {
         $test[]=array('1'=>'error');
         echo "Access Denied.";
     }
 }
 else if($method=="OpenOrder")
 {
    $checkedMethod = $this->gulden_model->checktradeMethod($api_key);
    if($checkedMethod)
    {
        $OpenOrder = $this->gulden_model->getOpenOrder($getUserid);
        if($OpenOrder)
        {
            foreach($OpenOrder as $open)
            {   
                $open_orderId       = $open->trade_id;
                $open_type          = $open->Type;
                $open_firstCurrency     = $open->firstCurrency;
                $open_secondCurrency    = $open->secondCurrency;
                $open_date          = $open->orderDate;
                $open_time          = $open->orderTime;
                $open_status            = $open->status;

                $test[]=array(  'Order Id'=>trim($open_orderId),
                    'Type'=>trim($open_type),
                    'Buy Currency'=>trim($open_firstCurrency),
                    'Sell Currency'=>trim($open_secondCurrency),
                    'Date'=>trim($open_date),
                    'Time'=>trim($open_time),
                    'Status'=>trim($open_status),
                    );
            }
        }
        else
        {
         $test[]=array('1'=>'error');
         echo "No Orders";
     }
 }
 else
 {
     $test[]=array('1'=>'error');
     echo "Access Denied.";
 }
}
else if($method=="Order_book")
{
    $checkedMethod = $this->gulden_model->checktradeMethod($api_key);
    if($checkedMethod)
    {
        $Order_book = $this->gulden_model->getOrderbook($getUserid);
        if($Order_book)
        {
            foreach($Order_book as $open)
            {   
                $open_orderId           = $open->trade_id;
                $open_type              = $open->Type;
                $open_firstCurrency     = $open->firstCurrency;
                $open_secondCurrency    = $open->secondCurrency;
                $open_date              = $open->orderDate;
                $open_time              = $open->orderTime;
                $open_status            = $open->status;

                $test[]=array(  'Order Id'  => trim($open_orderId),
                    'Type'          => trim($open_type),
                    'Buy Currency'  => trim($open_firstCurrency),
                    'Sell Currency' => trim($open_secondCurrency),
                    'Date'          => trim($open_date),
                    'Time'          => trim($open_time),
                    'Status'        => trim($open_status),
                    );
            }
        }
        else
        {
         $test[]=array('1'=>'error');
         echo "No Orders";
     }
 }
 else
 {
     $test[]=array('1'=>'error');
     echo "Access Denied.";
 }
}
else if($method=="withdrawal_requests")
{
    $checkedMethod = $this->gulden_model->checktradeMethod($api_key);
    if($checkedMethod)
    {
        $withdrawal_requests = $this->gulden_model->getapi_withdraw_details($getUserid);
        if($withdrawal_requests)
        {
            foreach($withdrawal_requests as $withdraw)
            {   
                $withdraw_Id        = $withdraw->with_id;
                $withdraw_type      = $withdraw->description;
                $withdraw_amount    = $withdraw->amount;
                $withdraw_date      = $withdraw->request_date;
                $withdraw_status    = $withdraw->status;

                $test[]=array(  'Id'    => trim($withdraw_Id),
                    'Type'      => trim($withdraw_type),
                    'Amount'    => trim($withdraw_amount),
                    'Date'      => trim($withdraw_date),
                    'Status'    => trim($withdraw_status),
                    );
            }
        }
        else
        {
         $test[]=array('1'=>'error');
         echo "No Orders";
     }
 }
 else
 {
     $test[]=array('1'=>'error');
     echo "Access Denied.";
 }
}
else if($method=="coin_deposit_address")
{
    $checkedMethod = $this->gulden_model->checktradeMethod($api_key);
    if($checkedMethod)
    {
                    //echo "lkdfhskdlhf"; exit;
        $bitcoin_deposit_address = $this->gulden_model->deposit_address($deposit_currency,$getUserid);
        if($bitcoin_deposit_address)
        { 
            $test[]=array(  'Deposit Address:'  => trim($bitcoin_deposit_address),
                );
        }
        else
        {
         $test[]=array('1'=>'error');
         echo "No Orders";
     }
 }
 else
 {
     $test[]=array('1'=>'error');
     echo "Access Denied.";
 }
}
else if($method=="buy")
{
    $checkedMethod = $this->gulden_model->checktradeMethod($api_key);
    if($checkedMethod)
    {
        if($amount=="" || $price=="" || $amount==0 || $price=="")
        {
            $test[]=array('1'=>'error');
            echo "Please provide the valid values";
        }
        else
        {
            $result = $this->gulden_model->create_buy_order($amount,$price,$currency_pair,$getUserid);
            if($result)
            {
                foreach($result as $withdraw)
                {   
                    $trade_id       = $withdraw->trade_id;
                    $orderDate      = $withdraw->orderDate;
                    $orderTime      = $withdraw->orderTime;
                    $Amount         = $withdraw->Amount;
                    $Price          = $withdraw->Price;

                    $test[]=array(  'Id'    => trim($trade_id),
                        'Price'     => trim($Price),
                        'Amount'    => trim($Amount),
                        'Date'      => trim($orderDate),
                        'Time'      => trim($orderTime),
                        );
                }
            }
            else
            {
             $test[]=array('1'=>'error');
             echo "No Orders";
         }
     }
 }
 else
 {
   $test[]=array('1'=>'error');
   echo "Access Denied.";
}
}
else if($method=="sell")
{
    $checkedMethod = $this->gulden_model->checktradeMethod($api_key);
    if($checkedMethod)
    {
        if($amount=="" || $price=="" || $amount==0 || $price=="")
        {
            $test[]=array('1'=>'error');
            echo "Please provide the valid values";
        }
        else
        {
            $result = $this->gulden_model->create_buy_order($amount,$price,$currency_pair,$getUserid);
            if($result)
            {
                foreach($result as $withdraw)
                {   
                    $trade_id       = $withdraw->trade_id;
                    $orderDate      = $withdraw->orderDate;
                    $orderTime      = $withdraw->orderTime;
                    $Amount         = $withdraw->Amount;
                    $Price          = $withdraw->Price;

                    $test[]=array(  'Id'    => trim($trade_id),
                        'Price'     => trim($Price),
                        'Amount'    => trim($Amount),
                        'Date'      => trim($orderDate),
                        'Time'      => trim($orderTime),
                        );
                }
            }
            else
            {
             $test[]=array('1'=>'error');
             echo "No Orders";
         }
     }
 }
 else
 {
   $test[]=array('1'=>'error');
   echo "Access Denied.";
}
}


else
{
    $test[]=array('2'=>'error');
    echo "Method is not correct";

}
$json=json_encode($test);
echo "<pre>";
print_r(json_decode($json));
echo "</pre>";
}
}
else
{
    if($empty=="")
    {
        echo "No data found";
    }
}
} 
function createkeyName()
{

    $code1 = $this->gulden_model->generateredeemString();
    $code2 = $this->gulden_model->generateredeemString();
    $code3 = $this->gulden_model->generateredeemString();
    $code4 = $this->gulden_model->generateredeemString();
    $code5 = $this->gulden_model->generateredeemString();
    $secret = $this->gulden_model->generatesecretString();
    $api_key = $code1."-".$code2."-".$code3."-".$code4."-".$code5;
    $keyname = $this->input->post('keyname');
    $created = $this->gulden_model->createApikey($api_key,$secret);
    if($created)
    {
        $this->load->view('front/keys_page'); 
    }   
}
function enableApikey()
{

    $result = $this->gulden_model->enableApikey();
    if($result)
    {
        $this->load->view('front/keys_page'); 
    }
}
function disableApikey($id)
{

    $result = $this->gulden_model->disableApikey($id);
    if($result)
    {
        $this->load->view('front/keys_page'); 
    }
}
function refreshUSdbal()
{

    $customer_user_id       =   $this->session->user_id;
    $value = $this->gulden_model->fetchuserbalancebyId($customer_user_id,"USD");
    echo $value." USD";
}
function refreshBtcbal()
{

    $customer_user_id       =   $this->session->user_id;
    $value = $this->gulden_model->fetchuserbalancebyId($customer_user_id,"BTC");
    echo $value." BTC";
}
function refresh()
{

    $customer_user_id       =   $this->session->user_id;



    $currency_pair  =$this->input->post('pair');
    
    $exp = explode('_',$currency_pair);
    $firstCurrency  = strtoupper($exp[0]);
    $secondCurrency = strtoupper($exp[1]);

    $usdBalance = $this->gulden_model->fetchuserbalancebyId($customer_user_id,$secondCurrency);
    $btcBalance = $this->gulden_model->fetchuserbalancebyId($customer_user_id,"BTC");
    // $ltcBalance = $this->gulden_model->fetchuserbalancebyId($customer_user_id,"LTC");

     // $usd_pending = $this->gulden_model->pendingusdamount(); 
  //    $available_usd = $usdBalance-$usd_pending;

  //    $btc_pending = $this->gulden_model->pendingbtcamount(); 
  //    $available_btc = $btcBalance-$btc_pending;

    $lowAsk = $this->gulden_model->lowestaskprice('BTC',$secondCurrency);
    if($lowAsk=="")
    {
        $lowAsk = 235;
    }
    $highBid = $this->gulden_model->highestbidprice('BTC',$secondCurrency);
    if($highBid=="")
    {
        $highBid = 236;
    }

    $lowestprice = $this->gulden_model->lowestprice('BTC',$secondCurrency);
    if(!$lowestprice)
    {
        $lowestprice = 222;
    }

    $highestprice = $this->gulden_model->highestprice('BTC',$secondCurrency);
    if(!$highestprice)
    {
        $highestprice = 236;
    }
    
    
    echo number_format($btcBalance,8)." ".$firstCurrency."-".number_format($usdBalance,8)." ".$secondCurrency."-".$lowAsk." ".$secondCurrency."-".$highBid." ".$secondCurrency."-".number_format($usdBalance,8).$secondCurrency.number_format($btcBalance,8)." BTC";
}
function refreshbidask()
{

    $this->load->view('front/bid_ask');
}
function refreshindexbidask()
{

    $this->load->view('front/index_bid_ask');
}
function litecoin_refresh()
{

    $btc_currency_session   =   "ltc_usd";
    $exp = explode('_',$btc_currency_session);
    $firstCurrency  = strtoupper($exp[0]);
    $secondCurrency = strtoupper($exp[1]);
    $last_price     = $this->gulden_model->highestbidprice($firstCurrency,$secondCurrency);
    if($last_price=="")
    {
        $last_price=8.52;
    }
    $low_price  = $this->gulden_model->lowestprice($firstCurrency,$secondCurrency);
    if($low_price=="")
    {
        $low_price=0;
    }
    $high_price     = $this->gulden_model->highestprice($firstCurrency,$secondCurrency);
    if($high_price=="")
    {
        $high_price=0;
    }
    $today_open     = $this->gulden_model->get_todays_open($firstCurrency,$secondCurrency);
    if(!$today_open)
    {
        $today_open = 0;
    }
    $volume = $this->gulden_model->get_tradingvolume($firstCurrency,$secondCurrency);
    if(!$volume)
    {
        $volume =0;
    }
    $volume=number_format((float)$volume, 8, '.', '');
    echo number_format($last_price,2)."-".number_format($low_price,2)."-".number_format($high_price,2)."-".number_format($today_open,2)."-".$volume;
}
function bitcoin_refresh()
{

    $btc_currency_session   =   "btc_usd";
    $exp = explode('_',$btc_currency_session);
    $firstCurrency  = strtoupper($exp[0]);
    $secondCurrency = strtoupper($exp[1]);
    $last_price     = $this->gulden_model->lowestaskprice($firstCurrency,$secondCurrency);
    if($last_price=="")
    {
        $last_price = 235;
    }

    $sell_price     = $this->gulden_model->highestbidprice($firstCurrency,$secondCurrency);
    if($sell_price=="")
    {
        $sell_price = 236;
    }
    $lowestprice = $this->gulden_model->lowestprice('BTC','USD');
    if(!$lowestprice)
    {
      $lowestprice = 222;
  }

  $highestprice = $this->gulden_model->highestprice('BTC','USD');
  if(!$highestprice)
  {
      $highestprice = 236;
  }
  $today_open     = $this->gulden_model->get_todays_open($firstCurrency,$secondCurrency);
  if(!$today_open)
  {
    $today_open = 234;
}
$volume = $this->gulden_model->get_totalvolume($firstCurrency,$secondCurrency);
if(!$volume)
{
    $volume =0;
}
$volume = number_format((float)$volume, 8, '.', '');
echo number_format($last_price,2)."-".number_format($sell_price,2)."-".number_format($lowestprice,2)."-".number_format($highestprice,2)."-".number_format($today_open,2)."-".$volume;
}
function refreshprice()
{

    $btc_currency_session   =   $this->session->userdata('btc_currency_session');  
    if($btc_currency_session=="")
    {
        $btc_currency_session   =   "btc_usd";
    }
    $exp = explode('_',$btc_currency_session);
    $firstCurrency  = strtoupper($exp[0]);
    $secondCurrency = strtoupper($exp[1]);
    $lowAsk = $this->gulden_model->lowestaskprice($firstCurrency,$secondCurrency);
    if($lowAsk=="")
    {
        if($btc_currency_session=="btc_usd")
        {
            $lowAsk=600;
        }
        else if($btc_currency_session=="btc_rur")
        {
            $lowAsk=21500.107;
        }
        else if($btc_currency_session=="btc_eur")
        {
            $lowAsk=412.90413;
        }
        else if($btc_currency_session=="ltc_btc")
        {
            $lowAsk=0.02725;
        }
        else if($btc_currency_session=="ltc_usd")
        {
            $lowAsk=16.7;
        }
        else if($btc_currency_session=="ltc_rur")
        {
            $lowAsk=587;
        }
        else if($btc_currency_session=="ltc_eur")
        {
            $lowAsk=11.4;
        }
        else if($btc_currency_session=="nmc_btc")
        {
            $lowAsk=0.00484;
        }
        else if($btc_currency_session=="nmc_usd")
        {
            $lowAsk=2.792;
        }
        else if($btc_currency_session=="nvc_btc")
        {
            $lowAsk=0.01086;
        }
        else if($btc_currency_session=="nvc_usd")
        {
            $lowAsk=6.25;
        }
        else if($btc_currency_session=="usd_rur")
        {
            $lowAsk=37.32;
        }
        else if($btc_currency_session=="eur_usd")
        {
            $lowAsk=1.37422;
        }
        else if($btc_currency_session=="ppc_btc")
        {
            $lowAsk=0.00472;
        }
        else if($btc_currency_session=="ppc_usd")
        {  
            $lowAsk=2.719;
        }
        else
        {
            $lowAsk=0.00166;
        }
    }
    $highBid = $this->gulden_model->highestbidprice($firstCurrency,$secondCurrency);
    if($highBid=="")
    {
        if($btc_currency_session=="btc_usd")
        {
            $highBid=598;
        }
        else if($btc_currency_session=="btc_rur")
        {
            $highBid=21300.107;
        }
        else if($btc_currency_session=="btc_eur")
        {
            $highBid=410.90413;
        }
        else if($btc_currency_session=="ltc_btc")
        {
            $highBid=0.01725;
        }
        else if($btc_currency_session=="ltc_usd")
        {
            $highBid=14.7;
        }
        else if($btc_currency_session=="ltc_rur")
        {
            $highBid=585;
        }
        else if($btc_currency_session=="ltc_eur")
        {
            $highBid=10.4;
        }
        else if($btc_currency_session=="nmc_btc")
        {
            $highBid=0.00284;
        }
        else if($btc_currency_session=="nmc_usd")
        {
            $highBid=1.792;
        }
        else if($btc_currency_session=="nvc_btc")
        {
            $highBid=0.01072;
        }
        else if($btc_currency_session=="nvc_usd")
        {
            $highBid=4.25;
        }
        else if($btc_currency_session=="usd_rur")
        {
            $highBid=35.32;
        }
        else if($btc_currency_session=="eur_usd")
        {
            $highBid=1.27422;
        }
        else if($btc_currency_session=="ppc_btc")
        {
            $highBid=0.00252;
        }
        else if($btc_currency_session=="ppc_usd")
        {
            $highBid=1.719;
        }
        else
        {
            $highBid=0.00160;
        }
    }
    echo $lowAsk.",".$highBid;
}
function refreshsellbuyorders()
{   

    $this->load->view('front/order');
}
function refresh_chart()
{

    $this->load->view('front/chart');
}
function temp()
{

    //$conscutive = $this->gulden_model->fetch_active_buyorder();
    //$this->gulden_model->get_gulden_buyorders();
    $this->load->view('front/temp');
}
function change_pass()
{
    $this->load->database();
    $this->load->model('gulden_model');
    $msg = $this->gulden_model->change_pass_model();
    echo $msg;
    //redirect('edit','referesh');
}
function change_picture()
{

    $this->gulden_model->change_picture_model();
    redirect('edit','referesh');
}
function ajaxprocess()
{   

    $emailid=$this->input->post('emailid');
    $this->load->model('gulden_model');
    $result=$this->gulden_model->ajax_check($emailid);
    if($result!="")
    {         
        echo "<span style='color:red;font-weight:bold;font-size:13px;'>Someone already has that username. Try another?</span>"; 
    }
    else
    {   
        echo "nothing";
    }
}
function ajax_uname_process()
{   

    $cookiehandlers = $this->security->cookie_handlers();
    $uname=$this->input->post('username');
    $this->load->model('gulden_model');
    $result=$this->gulden_model->ajax_check_uname($uname);
    if($result!="")
    {         
        echo "<span style='color:red;font-weight:bold;font-size:13px;'>Someone already has that username. Try another?</span>"; 
    }
    else
    {   
        echo "nothing";
    }
}
function get_detail()
{

    $bitcoin    = new jsonRPCClient('http://nameecoin:Namecoin@@127.0.0.1:9338/');
    $add="veerasarma@osiztechnologies.com";
    //$get_address = $Dogecoin->getbalance($add);
    $get_address=$bitcoin->getinfo();
    
    echo "<pre>";
    print_r($get_address);
    echo "</pre>";
}
//TFA coding starts here
function checktfa()
{

    echo $tfa_result=$this->gulden_model->checktfa();
}
function set_session()
{

    echo $tfa_result=$this->gulden_model->set_session();
}
function codegenerating()
{

    echo $result=$this->gulden_model->codegenerating_update();
}
function tfaconfirmation()
{
    echo $result=$this->gulden_model->tfa_cofirmation();
}
function two_factor_authendication()
{
    require_once 'GoogleAuthenticator.php';
    $ga = new PHPGangsta_GoogleAuthenticator();
    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    $customer_client_id     =   $this->session->userdata('customer_client_id'); 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    { 
        redirect('','refresh');      
    }
    else
    {
        $user_result = $this->gulden_model->user_check_tfa();
        $user_secret = $this->gulden_model->get_secret($customer_client_id);
        if($user_result=="enable" || $user_secret!="")
        {
            $secret_code = $this->gulden_model->get_secret($customer_client_id); 
            $data['secret_code'] = $secret_code;
            $data['url'] = $ga->getQRCodeGoogleUrl('gulden', $secret_code);
        }
        else
        {
           $result                =   $this->gulden_model->get_tfacode();
           if($result)
           {
            $data['secret_code']    =   $result['secret'];
            $data['onecode']        =   $result['oneCode'];
            $data['url']            =   $result['qrCodeUrl'];
        }
        else
        {
            $data['secret_code']    =   "";
            $data['onecode']        =   "";
            $data['url']            =   "";
        }
    }
    $this->load->view('front/tfa',$data);
}
}
function enable_tfa()
{
    //echo "sarma";
    echo $result = $this->gulden_model->enable_tfa();
}
function disable_tfa()
{
    //echo "sarma";
    echo $result = $this->gulden_model->disable_tfa();
}
//TFA coding ends here
function get_comment()
{
    echo $result = $this->gulden_model->insert_comment();
}
function account()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customers_email_id=="") && ($customer_user_id=="") )
    {   
        redirect('gulden/login','refresh');      
    }
    else
    { 
        // $data['userdetails'] = $this->gulden_model->get_userdetails($customer_user_id);
        $this->load->view('front/account');
    }
}
function email_confirmations()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect(' ','refresh');     
    }
    else
    {   
        $this->load->view('front/email_confirmation');
    }
}
function confirmationFun()
{

    echo $result = $this->gulden_model->email_confirmation_complete();
}
function settings()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id');
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect(' ','refresh');     
    }
    else
    { 
        $data['verfiyStatus']   = $this->gulden_model->verficationStatus($customer_user_id);
        $data['userDetail']     = $this->gulden_model->get_currentuserdetils($customer_email_id);
        $result                 = $this->gulden_model->get_bankacc_details();
        if($result)
        {
            foreach($result as $row)
            {
                $data['iban']               =   $row->iban; 
                $data['account_id']         =   $row->account_id; 
                $data['bank_swift']         =   $row->bank_swift; 
                $data['bank_name']          =   $row->bank_name; 
                $data['bank_address']       =   $row->bank_address; 
                $data['bank_postal_code']   =   $row->bank_postal_code; 
                $data['bank_city']          =   $row->bank_city; 
                $data['country']        =   $row->bank_country; 
            }
        }
        else
        {
            $data['iban']               = ''; 
            $data['bank_swift']         = ''; 
            $data['bank_name']          = ''; 
            $data['bank_address']       = ''; 
            $data['bank_postal_code']   = ''; 
            $data['bank_city']          = ''; 
            $data['bank_country']       = ''; 
        }
        //$data['bankDetail']   = $this->gulden_model->getBankdetails($customer_user_id);
        $this->load->view('front/settings',$data);
    }
}
function settings_complete()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect(' ','refresh');     
    }
    else
    { 
        $result = $this->gulden_model->settings_complete();
        $this->session->set_flashdata('success', "Information has been saved successfully");
        redirect('settings','referesh');
    }
}
function support()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect(' ','refresh');     
    }
    else
    { 
        $this->load->view('front/support');
    }
}
function particular_support()
{


    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect('gulden/index','refresh');      
    }
    else
    { 
        $error="";
        $rnumber = mt_rand(0,999999);   
        $this->session->set_userdata('supportfileSession',$rnumber);   
        $support_file   = $_FILES['support_file']['name']; 
        if($support_file!="")  
        { 
            @list($support_file,$ext)=explode(".",$support_file);                       
            $support_file=$rnumber.$support_file;       
            $config['upload_path'] ='uploads/';    
            $config['allowed_types'] = 'gif|jpg|jpeg|png';      
            $config['file_name']=$support_file;      
            $this->load->library('upload', $config);
            $this->upload->initialize($config);   
            if(!$this->upload->do_upload('support_file')) 
            {
                $error = "Support File ".$this->upload->display_errors();  
            }  
            else
            { 
                $error="";
            }
        }
        if($error!="") 
        {
            $this->session->set_flashdata('error',$error);     
            redirect('gulden/support','referesh');
            //redirect('gulden/contactus','referesh');
        }  
        else
        {
            $result = $this->gulden_model->particular_support(); 
            $this->session->set_flashdata('success', "Information has been saved successfully");
            
            redirect('gulden/support_conversation','referesh');
            //redirect('gulden/contactus','referesh');
        }
    }
}
function support_complete()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect(' ','refresh');     
    }
    else
    { 
        $error="";
        $rnumber = mt_rand(0,999999);   
        $this->session->set_userdata('supportfileSession',$rnumber);   
        $support_file   = $_FILES['support_file']['name']; 
        if($support_file!="")  
        { 
            @list($support_file,$ext)=explode(".",$support_file);                       
            $support_file=$rnumber.$support_file;       
            $config['upload_path'] ='uploads/';    
            $config['allowed_types'] = 'gif|jpg|jpeg|png';      
            $config['file_name']=$support_file;      
            $this->load->library('upload', $config);
            $this->upload->initialize($config);   
            if(!$this->upload->do_upload('support_file')) 
            {
                $error = "Support File ".$this->upload->display_errors();  
            }  
            else
            { 
                $error="";
            }
        }
        if($error!="") 
        {
            $this->session->set_flashdata('error',$error);     
            redirect('gulden/support','referesh');    
        }  
        else
        {
            $result = $this->gulden_model->support_complete();
            $this->session->set_flashdata('success', "Information has been saved successfully");
            redirect('gulden/support','referesh');
        }
    }
}
function conversation($id)
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect(' ','refresh');     
    }
    else
    { 
        $this->session->set_userdata('sessionSupportid',$id);
        redirect('gulden/support_conversation','refresh');   
    }
}
function support_conversation()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect(' ','refresh');     
    }
    else
    {   
        $id = $this->session->userdata('sessionSupportid');
        $data['details'] = $this->gulden_model->getSupportrecords($id);
        $this->load->view('front/support_conversation',$data);
    }
}
function verification()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect(' ','refresh');     
    }
    else
    { 
        $data['country_detail'] =   $this->gulden_model->fetchcountry();        
        $this->load->view('front/verification',$data);
    }
}
function verification_complete()
{



    $currentDate = date('Y-m-d');
    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect(' ','refresh');     
    }
    else
    { 


        $rnumber1 = mt_rand(0,999999); 
        $rnumber2 = mt_rand(0,999999); 
        $rnumber3 = mt_rand(0,999999); 
        $rnumber4 = mt_rand(0,999999); 
        $this->session->set_userdata('rnumber1',$rnumber1);
        $this->session->set_userdata('rnumber2',$rnumber2);
        $this->session->set_userdata('rnumber3',$rnumber3);

        $document1 = $_FILES['document1']['name'];            
        $document2 = $_FILES['document2']['name'];            
        $document3 = $_FILES['document3']['name']; 
        if($document1!="")     
        {          

            $config['upload_path']      =   'uploader/customers/documents';
            $config['allowed_types']    =   'gif|jpg|jpeg|png';
            $config['max_size']         =   '2048';
            $config['file_name']        =   $document1;    
            $this->load->library('upload', $config);
            $this->upload->initialize($config);   
            if(!$this->upload->do_upload('document1')) 
            {
                $error="Photo ID document".$this->upload->display_errors();  
            }
        } 

        if($document2!="")     
        {                                       
            $config['upload_path']      =   'uploader/customers/documents';
            $config['allowed_types']    =   'gif|jpg|jpeg|png';
            $config['file_name']        =   $document2;
            $config['max_size']         =   '2048';    
            $this->load->library('upload', $config);
            $this->upload->initialize($config);   
            if(!$this->upload->do_upload('document2')) 
            {
                $error="Photo ID Back document".$this->upload->display_errors();  
            }
        } 

        if($document3!="")     
        {                                   
            $config['upload_path']      =   'uploader/customers/documents';
            $config['allowed_types']    =   'gif|jpg|jpeg|png';
            $config['file_name']        =   $document3;    
            $config['max_size']         =   '2048';
            $this->load->library('upload', $config);
            $this->upload->initialize($config);   
            if(!$this->upload->do_upload('document3')) 
            {
                $error="Proof of residence document".$this->upload->display_errors();  
            }
        } 
        
        if($error!='')
        {
            $this->session->set_flashdata('error',$error);  

        }
        else
        {

            if($this->input->post('submit'))
            {
            $result = $this->gulden_model->verification_complete();    // update details
            if($result)
            {
                $this->session->set_flashdata('success', "information has been saved successfully");
                // redirect('gulden/verification','referesh');
            }
            else
            {
                $this->session->set_flashdata('error', "Oops! Your information could not saved");
                // redirect('gulden/verification','referesh');
            }
        }

    }
    redirect('gulden/verification','referesh');
}
}
function history()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id==""))
    {   
        redirect(' ','refresh');     
    }
    else
    { 
        $data['history_details'] = $this->gulden_model->fetchHistorydetails();
        $this->load->view('front/history',$data);
    }
}


function deposit_bitcoinold()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id==""))
    {   
        redirect(' ','refresh');     
    }
    else
    { 
        /* $KEY = 'oQiZz8ibE1BfjuenZRNOjiFPN3q2VJ2g';
        $SECRET = 'iUVIzmdDTNFeluz4If0ZEqb8ValZXAxG';
        $CLIENT_ID = '122588';
        $bapi = new guldenAPI($KEY,$SECRET,$CLIENT_ID); */
        $data['address'] = $bapi->depositBitcoin();
        $this->load->view('front/deposit_bitcoin',$data);
    }
}
function deposit_coin()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id==""))
    {   
        redirect(' ','refresh');     
    }
    else
    { 
        $data['cointype']="eurcoin";
        $data['currencyt']="EUR";       
        $this->load->view('front/deposit_coin',$data);
        
    }
}
function deposit_paypal()
{

    $this->load->library('paypal_class');
    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id==""))
    {   
        redirect(' ','refresh');     
    }
    else
    {
        if($this->session->flashdata('txn_id')!="")
        {
            $data['txid'] = $this->session->flashdata('txn_id');
            $this->load->view('front/deposit_paypal',$data);
        }
        else
        {
            $this->load->view('front/deposit_paypal');
        }
    }
}
function depositzcoin()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id==""))
    {   
        redirect(' ','refresh');     
    }
    else
    {
        $deposit_pending = $this->gulden_model->check_pendingdeposit();
        if(!$deposit_pending)
        {                   
            if (!$this->input->post('submit'))
            {
                $data['currency']="USD";
                //$this->load->view('front/international_deposit',$data);
                $this->load->view('front/deposit_form',$data);
            }
            else
            {
                $result = $this->gulden_model->international_deposit_req();
                if($result)
                {
                    $this->session->set_userdata('last_id',$result);
                    redirect('gulden/account_details','referesh');      
                }
                else
                {
                    $this->session->set_flashdata('error',"Your request is failed !");
                    redirect('gulden/international_deposit','referesh');        
                }
            }
        }
        else
        {
            $this->session->set_userdata('last_id',$deposit_pending);
            redirect('gulden/account_details','refresh');
        }
    }
}


function deposit_ltccoin()
{        
    $currency = "LTC";
    $customer_email_id      = $this->session->userdata('customer_email_id'); 
    if($currency=="LTC")
    { 
                $litecoin_row = $this->gulden_model->fetchWallet('litecoin');    // fetch litecoin wallet credentials
                $litecoin_username =   $litecoin_row->username;
                $litecoin_password =   $litecoin_row->password;
                $litecoin_portnumber =    $litecoin_row->portnumber;
                $litecoin  = new jsonRPCClient("http://$litecoin_username:$litecoin_password@127.0.0.1:$litecoin_portnumber/");
                $createAddress = $litecoin->getnewaddress($customer_email_id);
                $data['createAddress'] = $createAddress;
            } 


            $updated = $this->gulden_model->updatecreatedAddress($createAddress,$currency,$xpub=NULL);
            if($updated)
            {       
                $rootUrl = "https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=$createAddress&choe=UTF-8&chld=L";    

            } 
            redirect('gulden/depositlcoin','refresh');
        }
        function international_deposit()
        {

            $customer_email_id      =   $this->session->userdata('customer_email_id'); 
            $customer_user_id       =   $this->session->user_id; 
            if(($customer_email_id=="") && ($customer_user_id==""))
            {   
                redirect(' ','refresh');     
            }
            else
            {
                $deposit_pending = $this->gulden_model->check_pendingdeposit();
                if(!$deposit_pending)
                {                   
                    if (!$this->input->post('submit'))
                    {
                        $data['cointype']="eurcoin";
                        $data['currencyt']="EUR";
                //$this->load->view('front/international_deposit',$data);
                        $this->load->view('front/deposit_form',$data);
                    }
                    else
                    {
                        $result = $this->gulden_model->international_deposit_req();
                        if($result)
                        {
                            $this->session->set_userdata('last_id',$result);
                            redirect('gulden/deposit_coin','referesh');     
                        }
                        else
                        {
                            $this->session->set_flashdata('error',"Your request is failed !");
                            redirect('gulden/deposit_coin','referesh');       
                        }
                    }
                }
                else
                { 
                    redirect('gulden/deposit_coin','refresh');
                }
            }
        }

        function deposit_wcncoin()
        {        
            $currency = "WCN";
            $customer_email_id      = $this->session->userdata('customer_email_id'); 
            if($currency=="WCN")
            { 
                $litecoin_row = $this->gulden_model->fetchWallet('wcn');    // fetch litecoin wallet credentials
                $litecoin_username =   $litecoin_row->username;
                $litecoin_password =   $litecoin_row->password;
                $litecoin_portnumber =    $litecoin_row->portnumber;
                $litecoin  = new jsonRPCClient("http://$litecoin_username:$litecoin_password@127.0.0.1:$litecoin_portnumber/");
                $createAddress = $litecoin->getnewaddress($customer_email_id);

                $data['createAddress'] = $createAddress;
            } 


            $updated = $this->gulden_model->updatecreatedAddress($createAddress,$currency,$xpub=NULL);
            if($updated)
            {       
                $rootUrl = "https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=$createAddress&choe=UTF-8&chld=L";    

            } 
            redirect('gulden/depositwcncoin','refresh');
        }
        function deposit_hitcoin()
        {        
            $currency = "HIT";
            $customer_email_id      = $this->session->userdata('customer_email_id'); 
            if($currency=="HIT")
            { 
                $litecoin_row = $this->gulden_model->fetchWallet('hitcoin');    // fetch litecoin wallet credentials
                $litecoin_username =   $litecoin_row->username;
                $litecoin_password =   $litecoin_row->password;
                $litecoin_portnumber =    $litecoin_row->portnumber;
                $litecoin  = new jsonRPCClient("http://$litecoin_username:$litecoin_password@127.0.0.1:$litecoin_portnumber/");
                $createAddress = $litecoin->getnewaddress($customer_email_id);

                $data['createAddress'] = $createAddress;
            } 


            $updated = $this->gulden_model->updatecreatedAddress($createAddress,$currency,$xpub=NULL);
            if($updated)
            {       
                $rootUrl = "https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=$createAddress&choe=UTF-8&chld=L";    

            } 
            redirect('gulden/deposithitcoin','refresh');
        }

        function deposit_ethcoin()
        {        
            $currency = $this->input->post('currency');
            $data['currency']  = $currency;
            $customer_email_id      = $this->session->userdata('customer_email_id'); 
            if($currency=="ETH")
            { 
                $litecoin_row = $this->gulden_model->fetchWallet('ethcoin');    // fetch litecoin wallet credentials
                $litecoin_username  =   $litecoin_row->username;
                $litecoin_password  =   $litecoin_row->password;
                $litecoin_portnumber =  $litecoin_row->portnumber;
                $litecoin   = new jsonRPCClient("http://$litecoin_username:$litecoin_password@127.0.0.1:$litecoin_portnumber/");
                $createAddress = $litecoin->getnewaddress($customer_email_id);
                $data['createAddress'] = $createAddress;
            } 

            $updated = $this->gulden_model->updatecreatedAddress($createAddress,$currency);
            if($updated)
            {       
                $rootUrl = "https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=$createAddress&choe=UTF-8&chld=L";    
                $data['rootUrl'] = $rootUrl;
            } 

            ?>

            <div class="cls_main_block depositframe">
              <h3>Your address for deposit <?php echo $currency; ?>:</h3>
              <div class="row">
                  <div class="col-md-6">
                      <img src="<?php echo $rootUrl; ?>">
                      <p><b><?php echo $createAddress; ?></b></p>
                      <a href="javascript:void(0);">
                          <button class="btn btn-warning" onclick="generateAddress();">Generate new address</button>
                      </a>

                  </div>
                  <div class="col-md-6 pull-right">
                      <ul class="deposit_rht_lst">
                          <li>We do not have fee on <?php echo $currency; ?> deposits.</li>
                          <li>Minimal amount for deposit is - <b>0.0001 <?php echo $currency; ?></b>.</li>
                          <li>Your deposit will be credited in few minutes after <b>3 confirmations</b> on the <?php echo $currency_name; ?> network.</li>
                          <li>Transaction confirmation on the <?php echo $currency_name; ?> network can take <b>from 1 hour</b> and <b>up to 3 days</b> if you send it without fee.</li>
                          <li>Address can be used for further deposits.</li>
                          <li>We do not support <i>generated</i> transactions from pools like Eligius, P2Pool etc.</li>
                      </ul>
                  </div>
              </div>
          </div> 

          <?php

      }
      function depositlcoin()
      {

        $currency = "LTC";
    /* $litecoin = new jsonRPCClient('http://litecoinrpc:2vNmtT4ovkcszfReGkLeXPUJdfunXWgBqNjQa9hubEPf@127.0.0.1:9332/');
    $bitcoin = new jsonRPCClient('http://ramesh:Ramesh!@127.0.0.1:8332/'); */
    $customer_email_id      = $this->session->userdata('customer_email_id'); 
    // $data['currency_name']   = $this->getCurrencyname($currency);
    $data['currency']       = $currency;
    
    $checkAddress   = $this->gulden_model->checkdepositAddress($currency);
    if($checkAddress)
    { 
        $data['rootUrl'] = "https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=$checkAddress&choe=UTF-8&chld=L"; 
        $data['checkAddress'] = $checkAddress;
    }
    else
    {

        $createAddress="";
        
            $litecoin_row = $this->gulden_model->fetchWallet('litecoin');    // fetch litecoin wallet credentials
            $litecoin_username  =   $litecoin_row->username;
            $litecoin_password  =   $litecoin_row->password;
            $litecoin_portnumber =  $litecoin_row->portnumber;
            $litecoin   = new jsonRPCClient("http://$litecoin_username:$litecoin_password@127.0.0.1:$litecoin_portnumber/");
            $createAddress = $litecoin->getaccountaddress($customer_email_id); 
            // $xpub        = $abc->backupKeychain->xpub;

            $updated = $this->gulden_model->updatecreatedAddress($createAddress,$currency,$xpub=NULL);
            if($updated)
            {       
                $data['rootUrl'] = "https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=$createAddress&choe=UTF-8&chld=L";
                $data['checkAddress'] = $createAddress;
            }
        }   
    // print_r($data); exit;
        $this->load->view('front/ltc_deposit',$data);
    }

    function depositecoin()
    {   

        $currency = "ETH";
    /* $litecoin = new jsonRPCClient('http://litecoinrpc:2vNmtT4ovkcszfReGkLeXPUJdfunXWgBqNjQa9hubEPf@127.0.0.1:9332/');
    $bitcoin = new jsonRPCClient('http://ramesh:Ramesh!@127.0.0.1:8332/'); */
    $customer_email_id      = $this->session->userdata('customer_email_id'); 
    // $data['currency_name']   = $this->getCurrencyname($currency);
    $data['currency']       = $currency;
    
    $checkAddress   = $this->gulden_model->checkdepositAddress($currency); 
    if($checkAddress)
    { 

        $data['rootUrl'] = "https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=$checkAddress&choe=UTF-8&chld=L"; 
        $data['checkAddress'] = $checkAddress;
    }
    else
    {
        $createAddress="";
        
        $access_token = $this->gulden_model->get_access_token();
        $wallet_passphrase = $this->gulden_model->get_walletpass();
        
        $output = shell_exec('curl -X POST --data \'{"jsonrpc":"2.0","method":"personal_newAccount","params":["password"],"id":1}\' localhost:8545');

        $abc = json_decode($output);
        $createAddress = $abc->result;

        /*$output = shell_exec('cd /var/www/html; /usr/bin/node eth_deposit.js ');
        echo "dddd";
        print_r($output);*/ 
        
        $updated = $this->gulden_model->updatecreatedAddress($createAddress,$currency,$xpub=NULL);
        if($updated)
        {       
            $data['rootUrl'] = "https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=$createAddress&choe=UTF-8&chld=L";
            $data['checkAddress'] = $createAddress;
        }
    }
    
    $this->load->view('front/eth_deposit',$data);
}

function coindeposit()
{   

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id==""))
    {   
        redirect(' ','refresh');     
    }
    else
    {
        $deposit_pending = $this->gulden_model->check_pendingdeposit_ngn(); 
        if(!$deposit_pending)
        {               
            if (!$this->input->post('submit'))
            {
                $data['currency']="NGN"; 
                //$this->load->view('front/international_deposit',$data);
                $this->load->view('front/deposit_form',$data);
            }
            else
            {
                $result = $this->gulden_model->international_deposit_req();
                if($result)
                {
                    $this->session->set_userdata('last_id',$result);
                    redirect('gulden/account_details','referesh');      
                }
                else
                {
                    $this->session->set_flashdata('error',"Your request is failed !");
                    redirect('gulden/coindeposit','referesh');      
                }
            }
        }
        else
        {
            $this->session->set_userdata('last_id',$deposit_pending);
            redirect('gulden/account_details','refresh');
        }
    }
}
function moneypolo_deposit()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id==""))
    {   
        redirect(' ','refresh');     
    }
    else
    {
        $this->form_validation->set_rules('first_name', 'First name', 'required');
        $this->form_validation->set_rules('last_name','Last name','required');      
        $this->form_validation->set_rules('amount','Amount','required|callback_numeric_wcomma');                        
        $this->form_validation->set_rules('currency','Currency', 'required');       
        $this->form_validation->set_rules('mp_user_name','Moneypolo User Name', 'required');    
        $this->form_validation->set_message('required',"%s  is Required");  
        $this->form_validation->set_message('check_default', '%s cannot be default');
        $this->form_validation->set_message('valid_email',"%s  Should be valid");   
        $this->form_validation->set_message('numeric',"%s  Should be numeric"); 

        if ($this->form_validation->run() == FALSE)
        {
            $data['currency']="USD";
            $this->load->view('front/moneypolo_deposit',$data);
        }
        else
        {
            $result = $this->gulden_model->moneypolo_deposit_req();
            if($result)
            {
                $this->session->set_flashdata('last_id',$result);
                redirect('mpaccount_details','referesh');       
            }
            else
            {
                $this->session->set_flashdata('error',"Your request is failed !");
                redirect('moneypolo_deposit','referesh');       
            }
        }
    }
}
function mpaccount_details()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id==""))
    {   
        redirect(' ','refresh');     
    }
    else
    {
        $result = $this->gulden_model->mpaccount_details();
        if($result)
        {
            foreach($result as $row)
            {
                $data['mpacc_id']           =   $row->mpacc_id;                 
                $data['mp_acc_name']    =   $row->mp_acc_name;
                $data['mp_acc_number']      =   $row->mp_acc_number;
                $data['mp_acc_type']        =   $row->mp_acc_type;

            }
        }
        $this->load->view('front/mpaccount_details',$data);
    }
}
function account_details()
{


    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id==""))
    {   
        redirect(' ','refresh');     
    }
    else
    {  
        $result = $this->gulden_model->account_details();
        if($result)
        {
            foreach($result as $row)
            {
                $data['acc_id']         =   $row->acc_id;                   
                $data['admin_address']  =   $row->admin_address;
                $data['admin_city']     =   $row->admin_city;
                $data['country']        =   $row->country;
                $data['acc_number']     =   $row->acc_number;
                $data['iban']           =   $row->iban;
                $data['message']        =   $row->message;
                $data['bank_name']      =   $row->bank_name;
                $data['bank_address']   =   $row->bank_address;
                $data['bank_city']      =   $row->bank_city;
                $data['bank_country']   =   $row->bank_country;                 
                $data['BIC']            =   $row->BIC;
            }
        }
        $this->load->view('front/account_details',$data);
    }
}
function cancel_deposit($id)
{

    $result =  $this->gulden_model->cancel_deposit($id);
    redirect('gulden/deposit_coin','referesh');      
}
function withdrawal()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id==""))
    {   
        redirect(' ','refresh');     
    }
    /*else
    { */
        //$data['history_details'] = $this->gulden_model->fetchHistorydetails();
        $this->load->view('front/withdrawal');
    //}
    }

function withdraw_type()//added by Jegan
{
  $this->gulden_model->withdraw_type();
}

function withdraw_bitcoin()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id==""))
    {   
        redirect(' ','refresh');     
    }
    else
    { 
        //$data['history_details'] = $this->gulden_model->fetchHistorydetails();
        $this->load->view('front/withdraw_bitcoin');
    }
}
function moneypolo_withdraw()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id==""))
    {   
        redirect(' ','refresh');     
    }
    else
    {
        $this->form_validation->set_rules('mp_acc_name', 'Moneypolo Account name', 'required');
        $this->form_validation->set_rules('mp_user_name', 'Moneypolo User name', 'required');
        $this->form_validation->set_rules('amount','Amount','required|callback_numeric_wcomma');        
        $this->form_validation->set_rules('mp_acc_number','Moneyplo Account Number', 'required');       
        $this->form_validation->set_rules('currency','Currency', 'required');       
        $this->form_validation->set_rules('mp_acc_type','Moneyplo Account Type', 'required');       

        $this->form_validation->set_message('required',"%s  is Required");  
        $this->form_validation->set_message('check_default', '%s cannot be default');
        $this->form_validation->set_message('valid_email',"%s  Should be valid");   

        if ($this->form_validation->run() == FALSE)
        {
            $data['currency']="USD";
            $this->load->view('front/moneypolo_withdraw',$data);
        }
        else
        {
            $result = $this->gulden_model->moneypolo_withdraw_req();
            if($result)
            {
                $this->session->set_flashdata('success',"Your request was successfully submited!");
                redirect('moneypolo_withdraw','referesh');      
            }
            else
            {
                $this->session->set_flashdata('error',"You don't have suffient balance!");
                redirect('moneypolo_withdraw','referesh');      
            }
        }
    }
}
function change_password()
{
    $this->load->database();
    $this->load->model('gulden_model');
    $this->l_asset->add('js/user/change_password.js','js');
    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect('user/login','refresh');      
    }
    else
    { 
        $this->data['content'] = $this->load->view('user/v_change_password',[],true);
        view($this->data);
    }
}
/*function api_info()
{
  
    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect('gulden/login','refresh');      
    }
    else
    { 
        $this->load->view('front/api_info');
    }
}*/
function bank_info()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect('user/login','refresh');      
    }
    else
    {
        $this->l_asset->add('js/user/'.__FUNCTION__.'.js','js');
        $this->load->database();
        $this->load->model('gulden_model');
        $vars['bank'] = $this->gulden_model->acccount_details();  
        $this->data['content'] = $this->load->view('user/v_bank_info',$vars,true);
        view($this->data);
    }
}
/*function email_info()
{
  
    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect('gulden/login','refresh');      
    }
    else
    { 
        $this->load->view('front/email_info');
    }
}*/
function two_factor()
{
    $this->load->model('gulden_model');
    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        //redirect('gulden/login','refresh');      
    }
    else
    { 
       $user_result = $this->gulden_model->user_check_tfa();
       $user_secret = $this->gulden_model->get_secret($customer_user_id);
       if($user_result=="enable" || $user_secret!="")
       {
        $secret_code = $this->gulden_model->get_secret($customer_user_id); 
        $data['secret_code'] = $secret_code;
        require_once 'GoogleAuthenticator.php';
        $ga = new PHPGangsta_GoogleAuthenticator();
        $data['url'] = $ga->getQRCodeGoogleUrl('gulden', $secret_code);
    }
    else
    {
       $result                =   $this->gulden_model->get_tfacode(); 
             //print_r($result);
       if($result)
       {
        $data['secret_code']    =   $result['secret'];
        $data['onecode']        =   $result['oneCode'];
        $data['url']            =   $result['qrCodeUrl'];
    }
    else
    {
        $data['secret_code']    =   "";
        $data['onecode']        =   "";
        $data['url']            =   "";
    }
}

$this->load->view('front/two_factor',$data);
}
}
function change_password_complete()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect(' ','refresh');     
    }
    else
    { 
       $result = $this->gulden_model->changepwd_statusdetails();

       if($result)
       {
        echo "success";
    }
    else
    {
        echo "error";
    }
}
}

function deactivate_account()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect(' ','refresh');     
    }
    else
    { 
        $this->load->view('front/deactivate');
    }
}

function transactions()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect(' ','refresh');     
    }
    else
    { 
        $perpage    =   $this->gulden_model->getrowsperpage(); 
        $urisegment =   $this->uri->segment(3);
        $result     =   $this->gulden_model->fetchtransactionhistory1($perpage,$urisegment);    
        if($result)  
        {     
            $total_rows = $this->gulden_model->fetchtransactionhistorycount();   
            $base="gulden/transactions";            
            $this->pageconfig($total_rows,$base);         
            $data['transaction_result'] =   $result;
            $this->load->view('front/transactions',$data);      
        }   
        else
        {   
            $data['transaction_result'] = "";
            $data['notfound']="No Transaction History at the moment.";        
            $this->load->view('front/transactions',$data);        
        }
    }
}
function openOrders()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect(' ','refresh');     
    }
    else
    { 
        $this->load->view('front/openOrders');
    }
}
function open_orders()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect('gulden/login','refresh');      
    }
    else
    { 
        $this->load->view('front/open_order');
    }
}
function closeallopenorders()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect('gulden/login','refresh');      
    }
    else
    { 
       $activeResult =  $this->gulden_model->get_active_order("BTC","USD"); 

       if($activeResult) {
        foreach($activeResult as $active)
        {
            $activeTradeid    = $active->trade_id;
            $res_order = $this->gulden_model->remove_active_model($activeTradeid);
        }
    }
    redirect('gulden/open_orders','refresh');    
}
}
function openOrders_ltcmarket()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect(' ','refresh');     
    }
    else
    { 
        $this->load->view('front/openOrdersltc');
    }
}
/* function forget()  
{   
    $res_login  =   $this->gulden_model->forgot_passmail();     
    echo $res_login;
}
 */
function notificationFun()  
{   

    echo $result    =   $this->gulden_model->notificationFun();     
}
function deactivate_account_complete()  
{   

    echo $result    =   $this->gulden_model->deactivate_account();      
}
function refreshOrders()
{

    $this->load->view('front/limit_orders');
}

function test2()
{

    $this->gulden_model->updateReceivedamount();
}
function cronDeposit()   // first stage
{

    $result = $this->gulden_model->updateReceivedamount();
    if($result)
    {
        echo "success";
    }
    else
    {
        echo "failure";
    }
}
function cronJob()   // second stage
{

    $result = $this->gulden_model->cronJobModel();
    if($result)
    {
        echo "success";
    }
    else
    {
        echo "failure";
    }
}
function cronJobtwo()   // third stage
{

    $result = $this->gulden_model->cronJobtwoModel();
    if($result)
    {
        echo "success";
    }
    else
    {
        echo "failure";
    }
}
function unconfirmed()
{

    $KEY = 'oQiZz8ibE1BfjuenZRNOjiFPN3q2VJ2g';    // STEP 2
    $SECRET = 'iUVIzmdDTNFeluz4If0ZEqb8ValZXAxG';
    $CLIENT_ID = '122588';
    $bapi = new guldenAPI($KEY,$SECRET,$CLIENT_ID);
    $getBalance = $bapi->unconfirmedDeposits();
    echo "<pre>";
    print_r($getBalance);
    echo "</pre>";
}
function thanks($txnid)
{

  // Get info form paypal API
 $paypal_info = $_POST;

   //$mc_gross=$paypal_info['mc_gross']; 
   //$payment_status=$paypal_info['payment_status']; 

 $bill_id=$this->session->userdata('bill_id');

 $result= $this->gulden_model->paypal_update($txnid);
 $this->session->set_flashdata('txn_id', 'Process Successfully completed');
 redirect('deposit_paypal','refresh'); 

}
function paypal_update()
{

    $result = $this->gulden_model->addpaypal();
    echo "success";
}
function payment_done()
{

    $this->load->view('front/thanks_page');
}
function user_acc_details()
{


    $this->form_validation->set_rules('iban', 'IBAN/Bank account', 'required');
    $this->form_validation->set_rules('bank_swift','Bank SWIFT /BIC','required');       
    $this->form_validation->set_rules('bank_name','Bank name', 'required');                         
    $this->form_validation->set_rules('bank_address','Bank Address', 'required');       
    $this->form_validation->set_rules('bank_postal_code','Bank Postal Code', 'required');       
    $this->form_validation->set_rules('bank_city','Bank City', 'required');     
    $this->form_validation->set_rules('bank_country','Bank Country', 'required');       
    $this->form_validation->set_message('required',"%s  is Required");  
    $this->form_validation->set_message('check_default', '%s cannot be default');
    $this->form_validation->set_message('valid_email',"%s  Should be valid");   
    
    if ($this->form_validation->run() == FALSE)
    {
        $result                 = $this->gulden_model->get_bankacc_details();
        if($result)
        {
            foreach($result as $row)
            {
                $data['iban']               =   $row->iban; 
                $data['bank_swift']         =   $row->bank_swift; 
                $data['bank_name']          =   $row->bank_name; 
                $data['bank_address']       =   $row->bank_address; 
                $data['bank_postal_code']   =   $row->bank_postal_code; 
                $data['bank_city']          =   $row->bank_city; 
                $data['bank_country']       =   $row->bank_country; 
            }
        }
        else
        {
            $data['iban']               = ''; 
            $data['bank_swift']         = ''; 
            $data['bank_name']          = ''; 
            $data['bank_address']       = ''; 
            $data['bank_postal_code']   = ''; 
            $data['bank_city']          = ''; 
            $data['bank_country']       = ''; 
        }
        $data['currency']="USD";
        $this->load->view('front/settings',$data);
    }
    else
    {
        $result = $this->gulden_model->user_acc_details();
        if($result)
        {
            $this->session->set_flashdata('success', "Information has been saved successfully");
            redirect('settings','refresh');      
        }
        else
        {
            $this->session->set_flashdata('error', "Pls Try again");
            redirect('settings','refresh');      
        }   
    }
}
function edituser_acc_details()
{


    $this->form_validation->set_rules('iban', 'IBAN/Bank account', 'required');
    $this->form_validation->set_rules('bank_swift','Bank SWIFT /BIC','required');       
    $this->form_validation->set_rules('bank_name','Bank name', 'required');                         
    $this->form_validation->set_rules('bank_address','Bank Address', 'required');       
    $this->form_validation->set_rules('bank_postal_code','Bank Postal Code', 'required');       
    $this->form_validation->set_rules('bank_city','Bank City', 'required');     
    $this->form_validation->set_rules('bank_country','Bank Country', 'required');       
    $this->form_validation->set_message('required',"%s  is Required");  
    $this->form_validation->set_message('check_default', '%s cannot be default');
    $this->form_validation->set_message('valid_email',"%s  Should be valid");   
    
    if ($this->form_validation->run() == FALSE)
    {

        $result                 = $this->gulden_model->get_bankacc_details();
        if($result)
        {
            foreach($result as $row)
            {
                $data['iban']               =   $row->iban; 
                $data['bank_swift']         =   $row->bank_swift; 
                $data['bank_name']          =   $row->bank_name; 
                $data['bank_address']       =   $row->bank_address; 
                $data['bank_postal_code']   =   $row->bank_postal_code; 
                $data['bank_city']          =   $row->bank_city; 
                $data['country']        =   $row->bank_country; 
            }
        }
        else
        {
            $data['iban']               = ''; 
            $data['bank_swift']         = ''; 
            $data['bank_name']          = ''; 
            $data['bank_address']       = ''; 
            $data['bank_postal_code']   = ''; 
            $data['bank_city']          = ''; 
            $data['bank_country']       = ''; 
        }
        $data['currency']="USD";
        $this->load->view('front/settings',$data);
    }
    else
    {
        $result = $this->gulden_model->edituser_acc_details();
        if($result)
        {
            $this->session->set_flashdata('success', "Information has been edited successfully");
            redirect('settings','refresh');      
        }
        else
        {
            $this->session->set_flashdata('error', "Pls Try again");
            redirect('settings','refresh');      
        }   
    }
}
function order_book()
{

    $this->load->view('front/order_book');
}
function order_bookltc()
{

    $this->load->view('front/order_bookltc');
}
function fee_schedule()
{

    $this->load->view('front/fee_schedule'); 
}
function consecutive_order($cur)
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect(' ','refresh');     
    }
    else
    {
        $this->load->view('front/consucutive_order');
    }
}
function generateRandomString($length = 10) {

    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $randomString;
}
//change order starts here
function change_createBuyorder()
{

    echo $result = $this->gulden_model->change_createBuyordermodel();
}
function change_order($id)
{

    $this->session->set_userdata('change_order',$id);
    $currency='btc_usd';
    redirect('change_orders/'.$currency,'refresh');
}
function change_orders()
{

    //$this->session->set_userdata('gulden_currency',$currency);  
    $id=$this->session->userdata('change_order');
    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect(' ','refresh');     
    }
    else
    {
        $data['trade_id'] = $id;
        $this->load->view('front/change_order',$data);
    }
}
function change_orderltc($id)
{

    $currency='ltc_usd';
    $this->session->set_userdata('change_order',$id);
    redirect('change_ordersltc/'.$currency,'refresh');
}
function change_ordersltc()
{

    //$this->session->set_userdata('gulden_currency',$currency);  
    $id=$this->session->userdata('change_order');
    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect(' ','refresh');     
    }
    else
    {
        $data['trade_id'] = $id;
        $this->load->view('front/change_order',$data);
    }
}
function change_createSellorder()
{


    echo $result = $this->gulden_model->change_createSellordermodel();
}
function ajaxtypefortrans()
{   

    $keyword    =   $this->input->post('keyword');
    $this->session->set_userdata('type',$keyword);
    //$types    =   strtoupper($keyword);
     //$transaction_result = $this->gulden_model->ajaxtypefortransmodel(); 
    $transaction_result = $this->gulden_model->sortingmodel(); 
    if($transaction_result)
        { ?>
    <table class="responsive">
      <tbody>
        <tr align="center" class="clsRes_th">
          <th width="14%" style=""><?php echo $this->lang->line('Type');?></th>
          <th width="22%"><?php echo $this->lang->line('Date and Time');?></th>
          <th width="19%" style=""><?php echo $this->lang->line('BTC or LTC Amount');?></th>
          <th width="19%" style=""><?php echo $this->lang->line('USD Amount');?></th>
          <th width="19%" style=""><?php echo $this->lang->line('BTC or LTC Price');?></th>
          <th width="17%"><?php echo $this->lang->line('Fee');?></th>
      </tr>
      <?php
      foreach($transaction_result as $row)
      {
        ?>
        <tr align="center">
          <td style=""><?php echo $row->type; ?></td>
          <td><?php echo $row->date." ".$row->time ; ?></td>
          <td style=""><?php if($row->type=='Buy' || $row->type=='Sell' ) { echo $row->amount.' '.$row->currency; } ?></td>
          <td style=""><?php if($row->type=='Buy' || $row->type=='Sell') {  echo $row->total; } else {  echo $row->amount; } ?></td>
          <td style=""><?php if(isset($row->price)) { echo $row->price; } ?></td>
          <td><?php //if($row->status=='Cancel') { echo "Canceled"; } else { echo $row->status; } ?> <?php if(isset($row->fee)) { echo $row->fee; } ?></td>
      </tr>
      <?php } ?>
  </tbody>
</table> 
<?php
}
else
{
    echo "<span style='color:red;font-weight: bold;font-size: 15px;'>Transactions not found at the moment for $keyword</span>";
}
}
function typeopenorders()
{

    $keyword    =   $this->input->post('keyword');
    ?>
    <table class="table-bordered" width="100%">
        <tbody>
            <tr><th>Type</th>
                <th>Date and Time</th>
                <th>BTC Amount</th>
                <th>USD Amount</th>
                <th>BTC Price</th>
                <th>Action</th>
            </tr>
            <?php  $activeResult =  $this->gulden_model->get_type_order("BTC","USD"); 

            if($activeResult) {
              foreach($activeResult as $active)
              {
               $activeTradeid    = $active->trade_id;
               $activePrice   = $active->Price;
               $activeAmount  = $active->Amount;
               $activeType    = $active->Type;
               $activeTotal   = $active->Total;
               $activeDate    = $active->orderDate;
               $activeTime    = $active->orderTime;
               $status     = $active->status;
               $activets      = $activeDate." ".$activeTime;
               $activefilledAmount = $this->gulden_model->checkOrdertempdetails($activeTradeid,$activeType);
               if($activefilledAmount)
               {
                $activefilledAmount = $activeAmount-$activefilledAmount;
            }
            else
            {
                $activefilledAmount = $activeAmount;
            }
            $activeCalcTotal = $activefilledAmount*$activePrice;
            $activefilledAmount=number_format((float)$activefilledAmount, 8, '.', '');
            $activePrice=number_format((float)$activePrice, 2, '.', '');
            $activeCalcTotal=number_format((float)$activeCalcTotal, 2, '.', '');
            ?>
            <tr class="">
                <td><?php echo $activeType; ?></td>
                <td><?php echo $activets; ?></td>
                <td><?php echo $activefilledAmount; ?></td>
                <td><?php echo number_format($activeCalcTotal,2); ?></td>
                <td><?php echo $activePrice; ?></td>
                <td>
                    <a onclick="return confirm('Are you sure you want to delete this?');" href="<?php echo base_url(); ?>gulden/close_active_order/<?php echo $activeTradeid; ?>"><i class="fa fa-times-circle pad-rht"></i></a>
                </td>
            </tr>
            <?php } }else {?>
            <tr><td colspan="6"><center><h5>No <?php echo $keyword; ?> orders at the moment</h5></center></td></tr>
            <?php } ?>


        </tbody>
    </table>
    <?php
}
function typeopenordersltc()
{

    $keyword    =   $this->input->post('keyword');
    ?>
    <table class="responsive">
      <tbody>
        <tr align="center" class="clsRes_th">
          <th width="13%" style=""><?php echo $this->lang->line('Type'); ?></th>
          <th width="22%"><?php echo $this->lang->line('Date and time'); ?></th>
          <th width="17%"><?php echo $this->lang->line('LTC Amount'); ?></th>
          <th width="17%" style=""><?php echo $this->lang->line('USD Amount'); ?></th>
          <th width="17%"><?php echo $this->lang->line('LTC Price'); ?></th>
          <th width="14%"><?php echo $this->lang->line('Action'); ?></th>
      </tr>
      <?php  $activeResult =  $this->gulden_model->get_type_order("LTC","USD"); 
      if($activeResult) {
        foreach($activeResult as $active)
        {
            $activeTradeid  = $active->trade_id;
            $activePrice    = $active->Price;
            $activeAmount   = $active->Amount;
            $activeType     = $active->Type;
            $activeTotal    = $active->Total;
            $activeDate     = $active->orderDate;
            $activeTime     = $active->orderTime;
            $status         = $active->status;
            $activets       = $activeDate." ".$activeTime;
            $activefilledAmount = $this->gulden_model->checkOrdertempdetails($activeTradeid,$activeType);
            if($activefilledAmount)
            {
                $activefilledAmount = $activeAmount-$activefilledAmount;
            }
            else
            {
                $activefilledAmount = $activeAmount;
            }
            $activeCalcTotal = $activefilledAmount*$activePrice;
            $activefilledAmount=number_format((float)$activefilledAmount, 8, '.', '');
            $activePrice=number_format((float)$activePrice, 2, '.', '');
            $activeCalcTotal=number_format((float)$activeCalcTotal, 2, '.', '');
            ?>
            <tr class="">
                <td><?php echo $activeType; ?></td>
                <td><?php echo $activets; ?></td>
                <td><?php echo $activefilledAmount?></td>
                <td><?php echo number_format($activeCalcTotal,2) ?></td>
                <td><?php echo $activePrice ?></td>
                <td><?php echo anchor('close_active_order/'.$activeTradeid,'Cancel',array('onclick'=>"return confirm('Are you sure you want to delete this?');",'style'=>"color: red;")); ?><?php if($status=='active') { echo anchor('change_order/'.$activeTradeid,'Edit',array('style'=>"color: red; margin-left:20px;")); } ?></td>
            </tr>
            <?php } }else {?>
            <tr><td colspan="6"><center><h5>No active <?php if($keyword!='all') { echo $keyword; } ?> orders at the moment</h5></center></td></tr>
            <?php } ?>
        </tbody>
    </table>
    <?php
}
function ajaxstatusfortrans()
{   


    $keyword    =   $this->input->post('keyword');
    $this->session->set_userdata('status',$keyword);
    //$result   =   $this->gulden_model->ajaxstatusforordermodel();
    $transaction_result = $this->gulden_model->ajaxstatusfortransmodel(); 
    if($transaction_result)
        { ?>
    <table class="responsive">
      <tbody>
         <tr align="center" class="clsRes_th">
          <th width="14%" style=""><?php echo $this->lang->line('Type');?></th>
          <th width="22%"><?php echo $this->lang->line('Date and Time');?></th>
          <th width="19%" style=""><?php echo $this->lang->line('BTC or LTC Amount');?></th>
          <th width="19%" style=""><?php echo $this->lang->line('USD Amount');?></th>
          <th width="19%" style=""><?php echo $this->lang->line('BTC or LTC Price');?></th>
          <th width="17%"><?php echo $this->lang->line('Fee');?></th>
      </tr>
      <?php
      foreach($transaction_result as $row)
      {
        ?>
        <tr align="center">
          <td style=""><?php echo $row->type; ?></td>
          <td><?php echo $row->date." ".$row->time ; ?></td>
          <td style=""><?php if($row->type=='Buy' || $row->type=='Sell' ) { echo $row->amount.' '.$row->currency; } ?></td>
          <td style=""><?php if($row->type=='Buy' || $row->type=='Sell') {  echo $row->total; } else {  echo $row->amount; } ?></td>
          <td style=""><?php if(isset($row->price)) { echo $row->price; } ?></td>
          <td><?php //if($row->status=='Cancel') { echo "Canceled"; } else { echo $row->status; } ?> <?php if(isset($row->fee)) { echo $row->fee; } ?></td>
      </tr>
      <?php } ?>
  </tbody>
</table> 
<?php
}
else
{
    echo "<span style='color:red;font-weight: bold;font-size: 15px;'>No transaction at the moment for $keyword status</span>";
}
}
function sorting()
{   

    $keyword    =   $this->input->post('keyword');
    $this->session->set_userdata('sorting',$keyword);
    //$types    =   strtoupper($keyword);
    $transaction_result = $this->gulden_model->sortingmodel(); 
    if($transaction_result)
        { ?>
    <table class="responsive">
      <tbody>
        <tr align="center" class="clsRes_th">
          <th width="14%" style=""><?php echo $this->lang->line('Type');?></th>
          <th width="22%"><?php echo $this->lang->line('Date and Time');?></th>
          <th width="19%" style=""><?php echo $this->lang->line('BTC or LTC Amount');?></th>
          <th width="19%" style=""><?php echo $this->lang->line('USD Amount');?></th>
          <th width="19%" style=""><?php echo $this->lang->line('BTC or LTC Price');?></th>
          <th width="17%"><?php echo $this->lang->line('Fee');?></th>
      </tr>
      <?php
      foreach($transaction_result as $row)
      {
        ?>
        <tr align="center">
          <td style=""><?php echo $row->type; ?></td>
          <td><?php echo $row->date." ".$row->time ; ?></td>
          <td style=""><?php if($row->type=='Buy' || $row->type=='Sell' ) { echo $row->amount.' '.$row->currency; } ?></td>
          <td style=""><?php if($row->type=='Buy' || $row->type=='Sell') {  echo $row->total; } else {  echo $row->amount; } ?></td>
          <td style=""><?php if(isset($row->price)) { echo $row->price; } ?></td>
          <td><?php //if($row->status=='Cancel') { echo "Canceled"; } else { echo $row->status; } ?> <?php if(isset($row->fee)) { echo $row->fee; } ?></td>
      </tr>
      <?php } ?>
  </tbody>
</table> 
<?php
}
else
{
    echo "<span style='color:red;font-weight: bold;font-size: 15px;'>Transactions not found at the moment for $keyword</span>";
}
}
function ajaxanytimepast24hour()
{   

    $keyword    =   $this->input->post('keyword');
    $this->session->set_userdata('time',$keyword);
    //$types    =   strtoupper($keyword);
    // $transaction_result = $this->gulden_model->ajaxanytimepast24hour(); 
    $transaction_result = $this->gulden_model->sortingmodel();
    if($transaction_result)
        { ?>
    <table class="responsive">
      <tbody>
         <tr align="center" class="clsRes_th">
          <th width="14%" style=""><?php echo $this->lang->line('Type');?></th>
          <th width="22%"><?php echo $this->lang->line('Date and Time');?></th>
          <th width="19%" style=""><?php echo $this->lang->line('BTC or LTC Amount');?></th>
          <th width="19%" style=""><?php echo $this->lang->line('USD Amount');?></th>
          <th width="19%" style=""><?php echo $this->lang->line('BTC or LTC Price');?></th>
          <th width="17%"><?php echo $this->lang->line('Fee');?></th>
      </tr>
      <?php
      foreach($transaction_result as $row)
      {
        ?>
        <tr align="center">
          <td style=""><?php echo $row->type; ?></td>
          <td><?php echo $row->date." ".$row->time ; ?></td>
          <td style=""><?php if($row->type=='Buy' || $row->type=='Sell' ) { echo $row->amount.' '.$row->currency; } ?></td>
          <td style=""><?php if($row->type=='Buy' || $row->type=='Sell') {  echo $row->total; } else {  echo $row->amount; } ?></td>
          <td style=""><?php if(isset($row->price)) { echo $row->price; } ?></td>
          <td><?php //if($row->status=='Cancel') { echo "Canceled"; } else { echo $row->status; } ?> <?php if(isset($row->fee)) { echo $row->fee; } ?></td>
      </tr>
      <?php } ?>
  </tbody>
</table> 
<?php
}
else
{
    echo "<span style='color:red;font-weight: bold;font-size: 15px;'>Transactions not found at the moment for $keyword</span>";
}
}
//gulden mapping in cronDeposit
function gulden_cron_mapping()
{

    echo $result = $this->gulden_model->cron_mapping_model();
    //$result = $this->gulden_model->insert();
}
function encryptIt( $q ) {

    $cryptKey  = 'qJB0rGtIn5UB1xG03efyCp';
    $qEncoded      = base64_encode( mcrypt_encrypt( MCRYPT_RIJNDAEL_256, md5( $cryptKey ), $q, MCRYPT_MODE_CBC, md5( md5( $cryptKey ) ) ) );
    echo $qEncoded;
}
function stop_order()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id=="") )
    {   
        redirect('gulden/login','refresh');      
    }
    else
    {
        $this->load->view('front/stop_order');
    }
    
}
function buy_xrp()
{

    echo $result = $this->gulden_model->create_buy_xrp();
}
function simple_decrypt()
{

    echo $result = $this->gulden_model->simple_decrypt('L+YZtvmTEDuNkQAVfryPy71GlDYbs2QsIRD8XqkTpYk=');
}
function bitgo_deposit_process()
{

    echo "ddd";

    echo $result = $this->gulden_model->bitgo_deposit_process(); 
}
function listWalletAddresses()
{

    $access_token = $this->gulden_model->get_access_token();
    $user_wallet = "2N4AusBHhQJX78pSwUsrxeSUqW5LKCXtZe5";
    $output = exec('ACCESS_TOKEN="'.$access_token.'";
        BITGO_EXPRESS_HOST="localhost";
        WALLET="'.$user_wallet.'";
        curl -X GET \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        https://test.bitgo.com/api/v1/wallet/$WALLET/addresses');
    $abc = json_decode($output);
    echo "<pre>";
    print_r($abc);
}
function listWalletTransactions()
{

    // $access_token = $this->gulden_model->get_access_token();
    // $user_wallet = "2N4AusBHhQJX78pSwUsrxeSUqW5LKCXtZe5";
    // $txid = "361bb7035a416cf65a3fd6af185216d228bf4f6d676870409c62cc7b6016607b";
    // $output = exec('ACCESS_TOKEN="'.$access_token.'";
    //          BITGO_EXPRESS_HOST="localhost";
    //          WALLET="'.$user_wallet.'";
    //          TXID="'.$txid.'";
    //          curl -X GET \
    //          -H "Content-Type: application/json" \
    //          -H "Authorization: Bearer $ACCESS_TOKEN" \
    //          https://test.bitgo.com/api/v1/wallet/$WALLET/tx/$TXID');
    // $abc = json_decode($output);
    // echo "<pre>";
    // print_r($abc);
    $access_token = $this->gulden_model->get_access_token();
    $user_wallet = "2N3sCXoAaTqemD8sYqibzSMmJmu3ggwEjj1";
    $txid = "361bb7035a416cf65a3fd6af185216d228bf4f6d676870409c62cc7b6016607b";
    $output = exec('ACCESS_TOKEN="'.$access_token.'";
        BITGO_EXPRESS_HOST="localhost";
        WALLETID="'.$user_wallet.'";
        DESTINATIONADDRESS="2Mx4keyP8gvQqwraEGRVKFDVJVvECfgadik"
        AMOUNT=10000000
        WALLETPASSPHRASE="Sarmaravi1616"

        curl -X POST \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -d "{ \"address\": \"$DESTINATIONADDRESS\", \"amount\": $AMOUNT, \"walletPassphrase\": \"$WALLETPASSPHRASE\" }" \
        http://$BITGO_EXPRESS_HOST:3080/api/v1/wallet/$WALLETID/sendcoins');
    $abc = json_decode($output);
    echo "<pre>";
    print_r($abc);
}
function withdraw_ripple()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id==""))
    {   
        redirect('gulden/login','refresh');      
    }
    else
    {
        $withdraw_fee = $this->gulden_model->get_withdrawfee();
        if($withdraw_fee)
        {
            $data['with_fee'] = $withdraw_fee->ripple_withdraw;
        }
        else
        {
            $data['with_fee'] = 0;
        }

        $this->load->view('front/withdraw_ripple',$data); 
    }
}
function xrpwithdrawrequest()
{

    echo $result    =   $this->gulden_model->xrpcoinrequestmodel();
    
    
    redirect('gulden/withdraw_confirm/'.$result,'refresh');
    
}
function ripple_deposit()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id==""))
    {   
        redirect('gulden/login','refresh');      
    }
    else
    {
        $currency = "XRP";

        $customer_email_id      = $this->session->userdata('customer_email_id'); 
        $data['currency_name']  = $this->getCurrencyname($currency);
        $data['currency']       = $currency;
        $random_string = $this->gulden_model->get_destinationtag();
        if(!$random_string)
        {
            $random_string = $this->gulden_model->generateredeemString();
            $res = $this->gulden_model->add_destination_tag($random_string);
        }
        $checkAddress   = $this->gulden_model->get_ripple_address();
        if($checkAddress)
        { 
            $ripple_address = $checkAddress->ripple_address;
            $ripple_name    = $checkAddress->ripple_name;
            $data['checkAddress'] = $ripple_address."?dt=".$random_string;
            $data['dt'] = $random_string;
            $link = 'https://ripple.com//send?to='.$ripple_address.'&dt='.$random_string.'&name='.$ripple_name.'&label=Deposit to '.$ripple_name.' account';
            $data['link'] = $link;
            $data['rootUrl'] = "https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=$link&choe=UTF-8&chld=L"; 
        }
        else
        {
            $checkAddress = "";
            $data['rootUrl'] = "https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=$checkAddress&choe=UTF-8&chld=L"; 
            $data['checkAddress'] = $checkAddress."?dt=".$random_string;
            $data['dt'] = $random_string;

        }
        $this->load->view('front/deposit_ripple',$data);
    }

}

function singlenews($bid)
{

    // $bid=insep_decode($id);
    $data['singlenewss']=$this->gulden_model->singlenewss($bid);
    //print_r($data['singlenewss']); die;
    $this->load->view('front/singlenews',$data);
}
function allnews()
{

    $perpage = $this->gulden_model->getrowsperpage();
    $urisegment=$this->uri->segment(3);
    $total_rows = $this->gulden_model->getallnewscount1();
    $base="gulden/allnews";
    $this->pageconfig($total_rows,$base);
    $data['allnews']=$this->gulden_model->allnews($perpage,$urisegment);
    $this->load->view('front/allnews',$data);
}
function feecms()
{

    $this->load->view('front/feecms');
}
function termm()
{

    $data['pages3']=$this->gulden_model->get_terms('3');
    $this->load->view('front/terms',$data);
}

function privacys()
{

    $data['pages3']=$this->gulden_model->get_terms('5');
    $this->load->view('front/terms',$data);
    //$this->load->view('front/privacy');
}
function aml()
{

    $data['pages3']=$this->gulden_model->get_terms('30');
    $this->load->view('front/terms',$data);
    //$this->load->view('front/aml');
}
function cookie()
{

    $data['pages3']=$this->gulden_model->get_terms('32');
    $this->load->view('front/terms',$data);
    //$this->load->view('front/cookie');
}
function risk()
{

    $data['pages3']=$this->gulden_model->get_terms('31');
    $this->load->view('front/terms',$data);
    //$this->load->view('front/risk');
}
function bitcoin()
{

    $data['pages3']=$this->gulden_model->get_terms('1');
    $this->load->view('front/bitcoin',$data);
}
function buycoin()
{

    $data['pages3']=$this->gulden_model->get_terms('33');
    $this->load->view('front/bitcoin',$data);
    //$this->load->view('front/buycoin');
}
function sellcoin()
{

    $data['pages3']=$this->gulden_model->get_terms('34');
    $this->load->view('front/bitcoin',$data);
    //$this->load->view('front/sellcoin');
}
function ajaxtypesearch()
{

    $type=$this->input->post('typenumber');
    $statusvalue=$this->input->post('statusvalue');
    $withdraw_result=$this->gulden_model->gettypevalue($type,$statusvalue);
    if($withdraw_result) 
    {
        ?>
        <table width="100%" class="table-bordered table table-hover table-striped">
            <tbody>
                <tr><th>ID</th><th>Date</th><th>Description</th><th>Amount</th><th>Status</th></tr>
            </tr>
            <?php
            $i=1;
            foreach($withdraw_result as $row)
            {
                ?>
                <tr align="center">
                  <td style=""><?php 
                //  echo $row->with_id; 
                      echo $i; 
                      ?>
                  </td>
                  <td><?php echo $row->request_date ; ?></td>
                  <td><?php echo $row->payment; ?></td>
                  <td style=""><?php if($row->currency!='USD') { echo number_format($row->askamount,4); } else { echo number_format($row->askamount,2); }?></td>
                  <td><?php echo $row->status; ?></td>
              </tr>
              <?php $i++; } ?>
              <!-- <tr><td>123456</td><td>25-03-15</td><td>Lorem</td><td>$500</td><td><div class="label label-danger"> Pending </div></td></tr> -->
          </tbody>
      </table>
      <?php
  }
  else
  {
    ?>
    <table width="100%" class="table-bordered table table-hover table-striped">
        <tbody>
            <tr><th>ID</th><th>Date</th><th>Description</th><th>Amount</th><th>Status</th></tr>
            <tr >
                <th colspan="5" style="color:red;">No Record's Found At The Moment</th>
            </tr>

            <!-- <tr><td>123456</td><td>25-03-15</td><td>Lorem</td><td>$500</td><td><div class="label label-danger"> Pending </div></td></tr> -->
        </tbody>
    </table>
    <?php   
}
}
function ajaxstatussearch()
{

    $type=$this->input->post('typenumber');
    $ori_type=$this->input->post('ori_type');
    $withdraw_result=$this->gulden_model->getstatusvalue($type,$ori_type);
    if($withdraw_result) 
    {
        ?>
        <table width="100%" class="table-bordered table table-hover table-striped">
            <tbody>
                <tr><th>ID</th><th>Date</th><th>Description</th><th>Amount</th><th>Status</th></tr>
            </tr>
            <?php
            $i=1;
            foreach($withdraw_result as $row)
            {
                ?>
                <tr align="center">
                  <td style=""><?php 
                //  echo $row->with_id; 
                      echo $i; 
                      ?>
                  </td>
                  <td><?php echo $row->request_date ; ?></td>
                  <td><?php echo $row->payment; ?></td>
                  <td style=""><?php if($row->currency!='USD') { echo number_format($row->askamount,4); } else { echo number_format($row->askamount,2); }?></td>
                  <td><?php echo $row->status; ?></td>
              </tr>
              <?php $i++; } ?>
              <!-- <tr><td>123456</td><td>25-03-15</td><td>Lorem</td><td>$500</td><td><div class="label label-danger"> Pending </div></td></tr> -->
          </tbody>
      </table>
      <?php
  }
  else
  {
    ?>
    <table width="100%" class="table-bordered table table-hover table-striped">
        <tbody>
            <tr><th>ID</th><th>Date</th><th>Description</th><th>Amount</th><th>Status</th></tr>
            <tr >
                <th colspan="5" style="color:red;">No Record's Found At The Moment</th>
            </tr>

            <!-- <tr><td>123456</td><td>25-03-15</td><td>Lorem</td><td>$500</td><td><div class="label label-danger"> Pending </div></td></tr> -->
        </tbody>
    </table>
    <?php   
}
}

function ajaxdeposittypesearch()
{

    $type=$this->input->post('typenumber');
    $statusvalue=$this->input->post('statusvalue');
    $withdraw_result=$this->gulden_model->ajaxdeposittypesearch($type,$statusvalue);
    if($withdraw_result) 
    {
        ?>
        <table width="100%" class="table-bordered table table-hover table-striped">
            <tbody>
                <tr><th>ID</th><th>Date</th><th>Description</th><th>Amount</th><th>Status</th></tr>
            </tr>
            <?php
            $i=1;
            foreach($withdraw_result as $row)
            {
                ?>
                <tr align="center">
                  <td style=""><?php 
                //  echo $row->with_id; 
                      echo $i; 
                      ?>
                  </td>
                  <td><?php echo $row->request_date ; ?></td>
                  <td><?php echo $row->type; ?></td>
                  <td ><?php echo $row->amount; ?></td>
                  <td><?php echo $row->status; ?></td>
              </tr>
              <?php $i++; } ?>
              <!-- <tr><td>123456</td><td>25-03-15</td><td>Lorem</td><td>$500</td><td><div class="label label-danger"> Pending </div></td></tr> -->
          </tbody>
      </table>
      <?php
  }
  else
  {
    ?>
    <table width="100%" class="table-bordered table table-hover table-striped">
        <tbody>
            <tr><th>ID</th><th>Date</th><th>Description</th><th>Amount</th><th>Status</th></tr>
            <tr >
                <td colspan="5" style="color:red;">No Record's Found At The Moment</td>
            </tr>

            <!-- <tr><td>123456</td><td>25-03-15</td><td>Lorem</td><td>$500</td><td><div class="label label-danger"> Pending </div></td></tr> -->
        </tbody>
    </table>
    <?php   
}
}

function ajaxdepositstatussearch()
{

    $type=$this->input->post('typenumber');
    $ori_type=$this->input->post('ori_type');
    $withdraw_result=$this->gulden_model->ajaxdepositstatussearch($type,$ori_type);
    if($withdraw_result) 
    {
        ?>
        <table width="100%" class="table-bordered table table-hover table-striped">
            <tbody>
                <tr><th>ID</th><th>Date</th><th>Description</th><th>Amount</th><th>Status</th></tr>
            </tr>
            <?php
            $i=1;
            foreach($withdraw_result as $row)
            {
                ?>
                <tr align="center">
                  <td style=""><?php 
                //  echo $row->with_id; 
                      echo $i; 
                      ?>
                  </td>
                  <td><?php echo $row->request_date ; ?></td>
                  <td><?php echo $row->type; ?></td>
                  <td ><?php echo $row->amount; ?></td>
                  <td><?php echo $row->status; ?></td>
              </tr>
              <?php $i++; } ?>
              <!-- <tr><td>123456</td><td>25-03-15</td><td>Lorem</td><td>$500</td><td><div class="label label-danger"> Pending </div></td></tr> -->
          </tbody>
      </table>
      <?php
  }
  else
  {
    ?>
    <table width="100%" class="table-bordered table table-hover table-striped">
        <tbody>
            <tr><th>ID</th><th>Date</th><th>Description</th><th>Amount</th><th>Status</th></tr>
            <tr >
                <th colspan="5" style="color:red;">No Record's Found At The Moment</th>
            </tr>

            <!-- <tr><td>123456</td><td>25-03-15</td><td>Lorem</td><td>$500</td><td><div class="label label-danger"> Pending </div></td></tr> -->
        </tbody>
    </table>
    <?php   
}
}
function deposit()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id==""))
    {   
        redirect('','refresh');      
    }
    /*else
    { */
        //$data['history_details'] = $this->gulden_model->fetchTransactionHistorydetails();
        /*$deposit_pending = $this->gulden_model->check_pendingdeposit();
        if(!$deposit_pending)
        {*/
            $this->load->view('front/deposit');
        /*}
        else
        {
            $this->session->set_userdata('last_id',$deposit_pending);
            redirect('gulden/account_details','refresh');
        }*/
    //}
    }

function deposit_type() //added by Jegan
{
    $this->gulden_model->deposit_type();
}

function deposit_status_type() //added by Jegan
{
    $this->gulden_model->deposit_status_type();
}

//padmashree
function verifysetting()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id==""))
    {   
        redirect(' ','refresh');     
    }
    else
    {
        if (!$this->input->post('submit'))
        {
           $available_usd = $this->gulden_model->fetchuserbalancebyId($customer_user_id,'USD');

           $result = $this->gulden_model->get_iwuserdata();
           if($result)
           {
            $data['acc_name']       = $result->acc_name;
            $data['acc_address']    = $result->acc_address;
            $data['city']           = $result->city;
            $data['postal_code']    = $result->postal_code;
            $data['iban']           = $result->iban;
            $data['country']        = $result->country;
            $data['bank_country']   = $result->bank_country;
            $data['swift']          = $result->swift;
            $data['bank_name']      = $result->bank_name;
            $data['bank_address']   = $result->bank_address;
            $data['bank_postalcode']= $result->bank_postalcode;
            $data['bank_city']      = $result->bank_city;
            $data['bank_address']   = $result->bank_address;
            $data['currency']       = $result->currency;
        }
        else
        {
            $data['acc_name']       = "";
            $data['acc_address']    = "";
            $data['city']           = "";
            $data['postal_code']    = "";
            $data['iban']           = "";
            $data['country']        = "";
            $data['bank_country']   = "";
            $data['swift']          = "";
            $data['bank_name']      = "";
            $data['bank_address']   = "";
            $data['bank_postalcode']= "";
            $data['bank_city']      = "";
            $data['bank_address']   = "";
            $data['currency']   = "";
        }
            //$this->load->view('front/international_withdraw',$data);
        $this->load->view('front/verifysettings',$data);
    }
    else
    {

        $result = $this->gulden_model->verifysetting();
        if($result)
        {
            $this->session->set_flashdata('success',"Your request was successfully submited!");
            redirect('gulden/verifysetting','referesh');        
        }
        else
        {
            $this->session->set_flashdata('error',"Your request is failed! you dont have a enough balance");
            redirect('gulden/verifysetting','referesh');        
        }
    }
}

}
function indexpagecms()
{

    $data['pages3']=$this->gulden_model->get_terms('36');
    $this->load->view('front/indexpagecms',$data);
}
function readmore($id)
{

    $data['pages3']=$this->gulden_model->get_terms($id);
    $this->load->view('front/readmore',$data);
}
function loginhistory()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id==""))
    {   
        redirect(' ','refresh');     
    }
    else
    {

        $perpage = $this->gulden_model->getrowsperpage();
        $urisegment=$this->uri->segment(3);
        $total_rows = $this->gulden_model->loginhistorycount();
        $base="gulden/loginhistory";
        $this->pageconfig($total_rows,$base);

        $data['loginhistory']=$this->gulden_model->loginhistory($perpage,$urisegment);
        $this->load->view('front/loginhistory',$data);
    }
}




function ajaxtiming1()
{

    $this->session->userdata('sortss'); 
    $currency=$this->session->userdata('currency');
    $currency = explode("_", $currency);
    $firstcurrency=$currency[0];
    $secondcurrency=$currency[1]; 

    $time1=$this->input->post('time1');
    $time2=$this->input->post('time2');
    $time3=$this->input->post('time3');
    $sortt=$this->input->post('sortt');
    $transaction_result=$this->gulden_model->ajaxtiming1($time1,$time2,$time3,$sortt); 

    ?>
    <div class="table-responsive" id="trass">
        <table class="table-bordered" width="100%" id="transactiontbl" name="transactiontbl">
            <tbody>
                <tr>
                    <th>Type</th>
                    <th>Date and Time</th>
                    <th><?php echo $firstcurrency;?> amount</th>
                    <th><?php echo $secondcurrency; ?> amount</th>
                    <th><?php echo $firstcurrency;?> price</th>
                    <th>Fee</th>
                </tr>
                <?php 
                if($transaction_result) 
                {
                    foreach($transaction_result as $active)
                    { 
                        ?>
                        <tr class="">
                            <td><?php echo $active->type; ?></td>
                            <td><?php echo $active->date." ".$active->time; ?></td>
                            <td><?php echo $active->amount; ?></td>
                            <td><?php echo $active->total; ?></td>
                            <td><?php echo $active->price; ?></td>
                            <td><?php echo $active->fee; ?></td>
                        </tr>
                        <?php 
// $i++;
                    } }
                    else {?>
                    <tr><td colspan="6"><center><h5>No active orders at the moment</h5></center></td></tr>
                    <?php } ?>



                </tbody>

            </table>
<!--<div class="center">
  <div class="holder" >
      <?php 
      echo $this->pagination->create_links();
      ?>
  </div>
</div>-->



</div>
<?php   
}
function listWallets()
{

    $access_token = $this->gulden_model->get_access_token();
    $output = exec('ACCESS_TOKEN="'.$access_token.'";
        curl -X GET \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        https://test.bitgo.com/api/v1/wallet
        ');
    $abc = json_decode($output);
    echo "<pre>";
    print_r($abc);
    //echo "test";
}
function overview()
{

    $this->load->view('front/overview'); 
}
function threemonth()
{

    $this->load->view('front/threemonth'); 
}
function sixmonth()
{

    $this->load->view('front/sixmonth'); 
}
function oneyear()
{

    $this->load->view('front/oneyear'); 
}
function ytd()
{

    $this->load->view('front/ytd'); 
}
function chart_all()
{

    $this->load->view('front/chart_all'); 
}
function onemonth()
{

    $this->load->view('front/onemonth'); 
}
function chart_alldata()
{

    $end_date = date("Y-m-d");
    $trading_start_date = $this->gulden_model->trading_start_date();
    $start_date = date('Y-m-d', strtotime($trading_start_date));
    //$start_date = '20-07-2012';
    //$end_date = '22-07-2012';
    $start = strtotime($start_date);
    $end = strtotime($end_date);
    $interval = 1;
    $out = '';
    $int = 24*60*60*$interval;
    for($i= $start;$i<= $end; $i += $int ){

        $test[] = date('d-m-Y',$i);
    }
    $chart="";
    foreach($test as $taken)     {
        $exp = explode(' ',$taken);
        $datetime = strtotime($taken)*1000;                     
        $rate   = $this->gulden_model->sixmonth_chart_data($taken);                     
        if($rate=='') { $rate = 0; } 
        $chart.='['.$datetime.','.$rate.'],';
    }
    
    echo "[".trim($chart,",")."]";
}
function oneyearchart_data()
{

    $end_date = date("Y-m-d H:i:s");
    $start_date = date('Y-m-d H:i:s', strtotime($end_date . ' - 1 year'));
    //$start_date = '20-07-2012';
    //$end_date = '22-07-2012';
    $start = strtotime($start_date);
    $end = strtotime($end_date);
    $interval = 1;
    $out = '';
    $int = 24*60*60*$interval;
    for($i= $start;$i<= $end; $i += $int ){

        $test[] = date('d-m-Y',$i);
    }
    $chart="";
    foreach($test as $taken)     {
        $exp = explode(' ',$taken);
        $datetime = strtotime($taken)*1000;                     
        $rate   = $this->gulden_model->sixmonth_chart_data($taken);                     
        if($rate=='') { $rate = 0; } 
        $chart.='['.$datetime.','.$rate.'],';
    }
    
    echo "[".trim($chart,",")."]";
}
function ytd_data()
{

    $end_date = date("Y-m-d H:i:s");
    $start_date = date('Y-01-01 H:i:s');
    //$start_date = '20-07-2012';
    //$end_date = '22-07-2012';
    $start = strtotime($start_date);
    $end = strtotime($end_date);
    $interval = 1;
    $out = '';
    $int = 24*60*60*$interval;
    for($i= $start;$i<= $end; $i += $int ){

        $test[] = date('d-m-Y',$i);
    }
    $chart="";
    foreach($test as $taken)     {
        $exp = explode(' ',$taken);
        $datetime = strtotime($taken)*1000;                     
        $rate   = $this->gulden_model->sixmonth_chart_data($taken);                     
        if($rate=='') { $rate = 0; } 
        $chart.='['.$datetime.','.$rate.'],';
    }
    
    echo "[".trim($chart,",")."]";
}
function sixmonthchart_data()
{

    $end_date = date("Y-m-d H:i:s");
    $start_date = date('Y-m-d H:i:s', strtotime($end_date . ' - 6 months'));
    //$start_date = '20-07-2012';
    //$end_date = '22-07-2012';
    $start = strtotime($start_date);
    $end = strtotime($end_date);
    $interval = 1;
    $out = '';
    $int = 24*60*60*$interval;
    for($i= $start;$i<= $end; $i += $int ){

        $test[] = date('d-m-Y',$i);
    }
    $chart="";
    foreach($test as $taken)     {
        $exp = explode(' ',$taken);
        $datetime = strtotime($taken)*1000;                     
        $rate   = $this->gulden_model->sixmonth_chart_data($taken);                     
        if($rate=='') { $rate = 0; } 
        $chart.='['.$datetime.','.$rate.'],';
    }
    
    echo "[".trim($chart,",")."]";
}
function threemonthschart()
{

    $end_date = date("Y-m-d H:i:s");
    $start_date = date('Y-m-d H:i:s', strtotime($end_date . ' - 3 months'));
    //$start_date = '20-07-2012';
    //$end_date = '22-07-2012';
    $start = strtotime($start_date);
    $end = strtotime($end_date);
    $interval = 1;
    $out = '';
    $int = 24*60*60*$interval;
    for($i= $start;$i<= $end; $i += $int ){

        $test[] = date('d-m-Y',$i);
    }
    $chart="";
    foreach($test as $taken)     {
        $exp = explode(' ',$taken);
        $datetime = strtotime($taken)*1000;                     
        $rate   = $this->gulden_model->threemonth_chart_data($taken);                       
        if($rate=='') { $rate = 0; } 
        $chart.='['.$datetime.','.$rate.'],';
    }
    
    echo "[".trim($chart,",")."]";

}
function chart_data()
{

    $end_date = date("Y-m-d H:i:s");
    $start_date = date('Y-m-d H:i:s', strtotime($end_date . ' - 30 days'));
    //$start_date = '20-07-2012';
    //$end_date = '22-07-2012';
    $start = strtotime($start_date);
    $end = strtotime($end_date);
    $interval = 1;
    $out = '';
    $int = 24*60*60*$interval;
    for($i= $start;$i<= $end; $i += $int ){

        $test[] = date('d-m-Y',$i);
    }
    $chart="";
    foreach($test as $taken)     {
        $exp = explode(' ',$taken);
        $datetime = strtotime($taken)*1000;                     
        $rate   = $this->gulden_model->chart_data($taken);                      
        if($rate=='') { $rate = 0; } 
        $chart.='['.$datetime.','.$rate.'],';
    }
    
    echo "[".trim($chart,",")."]";

}
function chart_data_zar()
{
    $type = "day";
    $end_date = date("Y-m-d H:i:s");
    $start_date = date('Y-m-d H:i:s', strtotime($end_date . '- 7 days'));
    $start     = strtotime($start_date);
    $end     = strtotime($end_date);
    $interval = 1;
    $int = 24*60*60*$interval;
    for($i= $start;$i<= $end; $i += $int ){

        $test[] = date('Y-m-d H:i:s',$i);
    }
    $chart="";
    foreach($test as $taken) {
         // echo $taken.":";
      /*  date_default_timezone_set('UTC');*/
      $exp         = explode(' ',$taken);
                        //$curdate     = $exp[0];
                        //$time         = $exp[1];
                        // $tdtime     = date("H:i",strtotime($taken));
      $datetime     = strtotime($taken)*1000;

      $chartResult     = $this->gulden_model->forLowHighchart_zar($taken,$interval,$type); 

      $low     = $chartResult->low; 
      $high     = $chartResult->high;
      $open     = $chartResult->open;
      $close     = $chartResult->close; 
      if($low=='') { $low = 0; } 
      if($high=='') { $high = 0; } 
      if($open=='') { $open = 0; } 
      if($close=='') { $close = 0; } 

      $chart.='['.$datetime.','.$open.','.$high.','.$low.','.$close.'],';
  }

  echo "[".trim($chart,",")."]";

}
function chart_data_gts()
{


    $type = "day";
    $end_date = date("Y-m-d H:i:s");
    $start_date = date('Y-m-d H:i:s', strtotime($end_date . '- 7 days'));
    $start     = strtotime($start_date);
    $end     = strtotime($end_date);
    $interval = 1;
    $int = 24*60*60*$interval;
    for($i= $start;$i<= $end; $i += $int ){

        $test[] = date('Y-m-d H:i:s',$i);
    }
    $chart="";
    foreach($test as $taken) {
         // echo $taken.":";
     /* date_default_timezone_set('UTC');*/
     $exp         = explode(' ',$taken);
                        //$curdate     = $exp[0];
                        //$time         = $exp[1];
                        // $tdtime     = date("H:i",strtotime($taken));
     $datetime     = strtotime($taken)*1000;

     $chartResult     = $this->gulden_model->forLowHighchart_gts($taken,$interval,$type); 

     $low     = $chartResult->low; 
     $high     = $chartResult->high;
     $open     = $chartResult->open;
     $close     = $chartResult->close; 
     if($low=='') { $low = 0; } 
     if($high=='') { $high = 0; } 
     if($open=='') { $open = 0; } 
     if($close=='') { $close = 0; } 

     $chart.='['.$datetime.','.$open.','.$high.','.$low.','.$close.'],';
 }

 echo "[".trim($chart,",")."]";

}

function chart_data_ltc()
{


    $type = "day";
    $end_date = date("Y-m-d H:i:s");
    $start_date = date('Y-m-d H:i:s', strtotime($end_date . '- 7 days'));
    $start     = strtotime($start_date);
    $end     = strtotime($end_date);
    $interval = 1;
    $int = 24*60*60*$interval;
    for($i= $start;$i<= $end; $i += $int ){

        $test[] = date('Y-m-d H:i:s',$i);
    }
    $chart="";
    foreach($test as $taken) {
         // echo $taken.":";
       /*   date_default_timezone_set('UTC');*/
       $exp         = explode(' ',$taken);
                        //$curdate     = $exp[0];
                        //$time         = $exp[1];
                        // $tdtime     = date("H:i",strtotime($taken));
       $datetime     = strtotime($taken)*1000;

       $chartResult     = $this->gulden_model->forLowHighchart_ltc($taken,$interval,$type); 

       $low     = $chartResult->low; 
       $high     = $chartResult->high;
       $open     = $chartResult->open;
       $close     = $chartResult->close; 
       if($low=='') { $low = 0; } 
       if($high=='') { $high = 0; } 
       if($open=='') { $open = 0; } 
       if($close=='') { $close = 0; } 

       $chart.='['.$datetime.','.$open.','.$high.','.$low.','.$close.'],';
   }

   echo "[".trim($chart,",")."]";

}

function chart_data_eth()
{


    $type = "day";
    $end_date = date("Y-m-d H:i:s");
    $start_date = date('Y-m-d H:i:s', strtotime($end_date . '- 7 days'));
    $start     = strtotime($start_date);
    $end     = strtotime($end_date);
    $interval = 1;
    $int = 24*60*60*$interval;
    for($i= $start;$i<= $end; $i += $int ){

        $test[] = date('Y-m-d H:i:s',$i);
    }
    $chart="";
    foreach($test as $taken) {
         // echo $taken.":";
     /* date_default_timezone_set('UTC');*/
     $exp         = explode(' ',$taken);
                        //$curdate     = $exp[0];
                        //$time         = $exp[1];
                        // $tdtime     = date("H:i",strtotime($taken));
     $datetime     = strtotime($taken)*1000;

     $chartResult     = $this->gulden_model->forLowHighchart_eth($taken,$interval,$type); 

     $low     = $chartResult->low; 
     $high     = $chartResult->high;
     $open     = $chartResult->open;
     $close     = $chartResult->close; 
     if($low=='') { $low = 0; } 
     if($high=='') { $high = 0; } 
     if($open=='') { $open = 0; } 
     if($close=='') { $close = 0; } 

     $chart.='['.$datetime.','.$open.','.$high.','.$low.','.$close.'],';
 }

 echo "[".trim($chart,",")."]";

}

function simple_encrypt()
{

    echo $this->gulden_model->simple_encrypt('charan88');
}
function get_access_token()
{

    $this->gulden_model->get_access_token();
}
function sohr_csv()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id==""))
    {   
        redirect(' ','refresh');     
    }
    else
    {
        $this->load->helper('csv_helper');
        $uid=$this->session->userdata('userid');
        $result =$this->gulden_model->get_transactions();
        $t_date=date('Y-m-d');
        $filename="transactions-".$t_date.".xls";
        
        $test="Type \t Date and Time \t BTC amount \t USD amount \t BTC Price \t Fee ";
        $test.="\n";

        $totsoh="";
        $totrpvssoh="";
        $totrpvsicp="";
        $toticpvssoh="";
        if(isset($result) && $result!=""){
          foreach($result as $active){
              $type = $active->type; 
              $datetime = $active->date." ".$active->time;
              $amount = $active->amount;
              $total = $active->total; 
              $price = $active->price;
              $fee = $active->fee;
              $test.=$type."\t".$datetime."\t".$amount."\t".$total."\t".$price."\t".$fee."\n";
          }} else
          {
           $test.= "No record found";
       }

       header("Content-type: application/csv");
        //header("Content-type: application/vnd.ms-word");
        //header("Content-type: text/plain");
       header("Content-Disposition: attachment; filename=".$filename);
       header("Pragma: no-cache");
       header("Expires: 2");
       $this->load->helper('file');
       write_file('./uploader/'.$filename, $test);
       $data = file_get_contents("./uploader/".$filename);
        //echo $data;
        //die;
       $urfile="Your_transactions.csv";
       $this->load->helper('download');
       force_download($urfile, $data); 
   }

}
function download()
{

    $customer_email_id      =   $this->session->userdata('customer_email_id'); 
    $customer_user_id       =   $this->session->user_id; 
    if(($customer_email_id=="") && ($customer_user_id==""))
    {   
        redirect(' ','refresh');     
    }
    else
    {
        $this->load->helper('csv_helper');
        $uid = $this->session->userdata('userid');
        $result =$this->gulden_model->fetchHistorydetails();
        $t_date=date('Y-m-d');
        $filename="transactions-".$t_date.".xls";
        
        $test="IP Address \t Browser  \t Action\t Date and Time";
        $test.="\n";

        $totsoh="";
        $totrpvssoh="";
        $totrpvsicp="";
        $toticpvssoh="";
        if(isset($result) && $result!=""){
          foreach($result as $active){
              $ipAddress = $active->ipAddress;
              $Browser = $active->Browser;

              $Action = $active->Action; 
              $datetime = $active->datetime;

              $test.=$ipAddress."\t".$Browser."\t".$Action."\t".$datetime."\n";
          }} else
          {
           $test.= "No record found";
       }

       header("Content-type: application/csv");
        //header("Content-type: application/vnd.ms-word");
        //header("Content-type: text/plain");
       header("Content-Disposition: attachment; filename=".$filename);
       header("Pragma: no-cache");
       header("Expires: 2");
       $this->load->helper('file');
       write_file('./uploader/'.$filename, $test);
       $data = file_get_contents("./uploader/".$filename);
        //echo $data;
        //die;
       $urfile="history.csv";
       $this->load->helper('download');
       force_download($urfile, $data); 

        /*$this->load->dbutil();
        $this->load->helper('file');
        $this->load->helper('download');
        $delimiter = ",";
        $newline = "\r\n";
        $filename = "history.csv";
        $query = "SELECT * FROM `history`   where `userId`=".$customer_user_id." ORDER BY historyId DESC ";
        $result = $this->db->query($query);
        $data = $this->dbutil->csv_from_result($result, $delimiter, $newline);
        force_download($filename, $data);*/
    }
    
} 
//tradeview chart section starts here
function tradeview()
{

    $this->load->view('front/tradeviewchart');
}
function tradeview_data()
{

    $end_date = date("Y-m-d H:i:s");
// $start_date = date('Y-m-d H:i:s', strtotime($end_date . ' - 24 hours'));
    $start_date = $this->gulden_model->getstart_date();
    if(!$start_date)
    {
        $start_date = date("Y-m-d H:i:s");
    }

    $start  = strtotime($start_date);
    $end    = strtotime($end_date);
    $interval = 1440;
    $out='';
    $int = 60*$interval;
    for($i = $start;$i<= $end; $i += $int )
    {
        $test[] = date('Y-m-d H:i:s',$i);
    }
// print_r($test);
    $chart="";
    $chart_datetime="";
    $chart_open="";
    $chart_high="";
    $chart_low="";
    $chart_close="";
    $chart_volume="";
    foreach($test as $taken) {
     /* date_default_timezone_set('UTC');*/
     $exp        = explode(' ',$taken);
     $curdate    = $exp[0];
     $time       = $exp[1];
     $tdtime     = date("H:i",strtotime($taken));
     $datetime   = strtotime($taken);

     $chartResult    = $this->gulden_model->forLowHigh($taken,$interval);
     $volume = $chartResult->volume;
     $low    = $chartResult->low; 
     $high   = $chartResult->high;
     $open   = $chartResult->open;
     $close  = $chartResult->close;
     if($volume=='') { $volume = 0; } 
     if($low=='') { $low = 0; } 
     if($high=='') { $high = 0; } 
     if($open=='') { $open = 0; } 
     if($close=='') { $close = 0; } 

    // $chart.='['.$datetime.','.$open.','.$high.','.$low.','.$close.','.$volume.'],';
     $chart_datetime.=$datetime.','; 
     $chart_open.=$open.','; 
     $chart_high.=$high.','; 
     $chart_low.=$low.','; 
     $chart_close.=$close.','; 
     $chart_volume.=$volume.','; 
 }
 $chart.='{'.'"t"'.':['.trim($chart_datetime,',').'],'.'"c"'.':['.trim($chart_close,',').'],'.'"o"'.':['.trim($chart_open,',').'],'.'"h"'.':['.trim($chart_high,',').'],'.'"l"'.':['.trim($chart_low,',').'],'.'"v"'.':['.trim($chart_volume,',').'],'.'"s"'.':'.'"ok"'.'}';
 echo $chart;

    // echo "[".trim($chart,",")."]";
      // echo '</br></br>'.'{"t":[1441670400,1441756800,1441843200,1441929600,1442188800,1442275200,1442361600,1442448000],"c":[9.72,9.57,9.63,9.65,9.38,9.63,9.86,9.95],"o":[9.87,9.92,9.56,9.6,9.58,9.39,9.7,9.81],"h":[9.87,9.94,9.72,9.75,9.61,9.71,9.88,10.16],"l":[9.6,9.53,9.51,9.54,9.32,9.37,9.7,9.75],"v":[17975500,29318000,29476300,19493400,31110300,17928800,19872400,24427200],"s":"ok"}';

} 
function change_tradeview($val)
{

    $data['value'] = $val;
    $this->load->view('front/change_tradeview',$data);
}
function changing_tradeview_data($interval)
{

    $end_date = date("Y-m-d H:i:s");
// $start_date = date('Y-m-d H:i:s', strtotime($end_date . ' - 24 hours'));
    $start_date = $this->gulden_model->getstart_date();
    if(!$start_date)
    {
        $start_date = date("Y-m-d H:i:s");
    }

    $start  = strtotime($start_date);
    $end    = strtotime($end_date);

    $out='';
    $int = 60*$interval;
    for($i = $start;$i<= $end; $i += $int )
    {
        $test[] = date('Y-m-d H:i:s',$i);
    }
// print_r($test);
    $chart="";
    foreach($test as $taken) {
        /*date_default_timezone_set('UTC');*/
        $exp        = explode(' ',$taken);
        $curdate    = $exp[0];
        $time       = $exp[1];
        $tdtime     = date("H:i",strtotime($taken));
        $datetime   = strtotime($taken)*1000;

        $chartResult    = $this->gulden_model->forLowHigh($taken,$interval);
        $volume = $chartResult->volume;
        $low    = $chartResult->low; 
        $high   = $chartResult->high;
        $open   = $chartResult->open;
        $close  = $chartResult->close;
        if($volume=='') { $volume = 0; } 
        if($low=='') { $low = 0; } 
        if($high=='') { $high = 0; } 
        if($open=='') { $open = 0; } 
        if($close=='') { $close = 0; } 

        $chart.='['.$datetime.','.number_format((float)$open, 2, '.', '').','.number_format((float)$high, 2, '.', '').','.number_format((float)$low, 2, '.', '').','.number_format((float)$close, 2, '.', '').','.$volume.'],';
    }

    echo "[".trim($chart,",")."]";
    // echo "[[1437388200000, 278.02, 278.50, 277.61, 277.64, 160.61], [1437390000000, 277.64, 277.66, 277.46, 277.47, 104.39], [1437391800000, 277.55, 278.68, 277.23, 277.77, 411.27], [1437393600000, 278.08, 278.67, 277.68, 278.05, 368.22], [1437395400000, 278.05, 279.16, 277.81, 278.03, 624.11]]";

}   
function user_balances()
{

    $customer_user_id   = $this->session->user_id; 
    $available_usd      = $this->gulden_model->fetchuserbalancebyId($customer_user_id,'USD');
    $available_btc      = $this->gulden_model->fetchuserbalancebyId($customer_user_id,'BTC'); 
    $current_price      = $this->gulden_model->lowestaskprice('BTC','USD');
    if($current_price=="")
    {
        $current_price = 235;
    }
    $account = $available_btc*$buy_btcrate;
    $account_value = $available_usd+$account;
    echo $available_btc."_".$available_usd."_".$account_value;
}
function order_book_data()
{

    $buyResult = $this->gulden_model->fetchCoinorder('Buy','BTC','USD');   
    if($buyResult)  { 
     $k=0;
     $chart =array();
     foreach($buyResult as $buys)
     {
      $k++;
      $buyorderid   = $buys->trade_id;
      $buyType  = $buys->Type;
      $buyPrice   = $buys->Price;
      $buyAmount  = $buys->amount;
      $buyTotal   = $buys->Total;
      $buyfilledAmount = $this->gulden_model->checkOrdertempdetails($buyorderid,$buyType);
      if($buyfilledAmount)
      {
        $buyfilledAmount = $buyAmount-$buyfilledAmount;
    }
    else
    {
        $buyfilledAmount = $buyAmount;
    }
    $buyCalcTotal = $buyfilledAmount*$buyPrice;
    $buyCalcTotal=number_format((float)$buyCalcTotal, 2, '.', '');
    $buyfilledAmount=number_format((float)$buyfilledAmount, 8, '.', '');
    $buyPrice=number_format((float)$buyPrice, 2, '.', '');

    $chart[]=$buyPrice;
    $chart[]=$buyfilledAmount;
    $chart[]=$buyCalcTotal;
        //$chart.='{"price":'.$buyPrice.',"amount":'.$buyfilledAmount.','.'"total":'.$buyCalcTotal.'},';
}


}
$sellResult = $this->gulden_model->fetchCoinorder('Sell','BTC','USD');  

if($sellResult) { 
    $k=0;
    $chart1 =array();
    foreach($sellResult as $sells)
    {
        $k++;
        $sellorderid  = $sells->trade_id;
        $sellType     = $sells->Type;
        $sellPrice    = $sells->Price;
        $sellAmount   = $sells->amount;
        $sellTotal    = $sells->Total;
        $sellTotal    = $sells->status;
        $sellfilledAmount = $this->gulden_model->checkOrdertempdetails($sellorderid,$sellType);
        if($sellfilledAmount)
        {
            $sellfilledAmount = $sellAmount-$sellfilledAmount;
        }
        else
        {
            $sellfilledAmount = $sellAmount;
        }
        $sellCalcTotal = $sellfilledAmount*$sellPrice;
        $sellPrice=number_format((float)$sellPrice, 2, '.', '');              
        $sellfilledAmount=number_format((float)$sellfilledAmount, 8, '.', '');              
        $sellCalcTotal=number_format((float)$sellCalcTotal,2, '.', '');    

        $chart1[]=$sellPrice;
        $chart1[]=$sellfilledAmount;
        $chart1[]=$sellCalcTotal;  
        //$chart .= "]}";
        // echo "<pre>";

    }
}
$bits=array();
$bits['bids']=array_chunk($chart,3,false);
$bits['asks']=array_chunk($chart1,3,false);

    echo json_encode($bits);        //echo "[".trim($chart,",")."]";

        // echo "[[1437388200000, 278.02, 278.50, 277.61, 277.64, 160.61], [1437390000000, 277.64, 277.66, 277.46, 277.47, 104.39], [1437391800000, 277.55, 278.68, 277.23, 277.77, 411.27], [1437393600000, 278.08, 278.67, 277.68, 278.05, 368.22], [1437395400000, 278.05, 279.16, 277.81, 278.03, 624.11]]";

}

function safe_secure()     
{   

    //$data['question']=$this->gulden_model->viewfaq();
    $data['safety']=$this->gulden_model->get_safety('39');
    $this->load->view('front/safe_secure',$data); 
}

function email_update()
{
    $id=$this->session->user_id;
    $email=$this->input->post('email');
    $this->gulden_model->emailupdate($email,$id);
}

function profile_update()
{
    $id=$this->session->user_id;


    $data=array('username'=>$this->input->post('username'),'firstname'=>$this->input->post('firstname'),'lastname'=>$this->input->post('lastname'),'identity_no'=>$this->input->post('id_no'),'cellno'=>$this->input->post('cellno'),'alt_cellno'=>$this->input->post('alt_cellno'),'street1'=>$this->input->post('street1'),'street2'=>$this->input->post('street2'),'city'=>$this->input->post('city'),'state1'=>$this->input->post('state'),'country1'=>$this->input->post('country'),'zipcode'=>$this->input->post('code'),'postal_line1'=>$this->input->post('line1'),'postal_line2'=>$this->input->post('line2'),'postal_city'=>$this->input->post('postal_city'),'postal_state'=>$this->input->post('postal_state'),'postal_country'=>$this->input->post('postal_country'),'postal_code'=>$this->input->post('postal_code'));
    /*print_r($data);
    die;*/
    /*echo $this->input->post('username');
    echo $this->input->post('account_no');
    echo $this->input->post('firstname');
              echo $this->input->post('lastname');
              echo $this->input->post('id_no');
              echo $this->input->post('cellno');
              echo $this->input->post('alt_cellno');
              echo $this->input->post('street1');
              echo $this->input->post('street2');
              echo $this->input->post('city');
              echo $this->input->post('state');
              echo $this->input->post('country');
              echo $this->input->post('code');
              echo $this->input->post('line1');
              echo $this->input->post('line2');
              echo $this->input->post('postal_city');
              echo $this->input->post('postal_state');
              echo $this->input->post('postal_country');
              echo $this->input->post('postal_code');*/

              $this->gulden_model->profileupdate($data,$id); 

          }

          function enquiry()
          {

            $customer_email_id      =   $this->session->userdata('customer_email_id'); 
            $customer_user_id       =   $this->session->user_id;
            $this->load->library('nativesession');

            $mdate=date('Y-m-d');
            $status="processing";
            $data=array('user_id'=>$customer_user_id,'name'=>$this->input->post('contact_name'),'email'=>$this->input->post('contact_email'),'message'=>$this->input->post('contact_message'),'created_date'=>$mdate,'status'=>$status,'recaptcha'=>$this->input->post('recaptcha'));

            $captcha_code   =   $this->nativesession->get('6_letters_code');
            $recaptcha      =   $this->input->post('recaptcha');
            if($captcha_code!=$recaptcha)
            {
                echo "<strong>Error!</strong> The captcha code does not match!";        
            }
            else
            {
                if($this->gulden_model->addenquiry($data)==true)
                {
                    echo "<strong>Success!</strong>Your Message has been Sent";
                }
                else
                {
                    echo "<strong>Error!</strong> Message not Sent";
                }
            }
        }


        function header_test()
        {
    //$this->load->view('front/header_all');
    //$this->load->view('front/safe_secure');
         echo "hello";
       //$res=$this->gulden_model->profile_details();
       //echo $res->username;
       //echo $res->row->user_id;

       //$result=$this->gulden_model->get_loginhistory()
       //print_r($result);

     }

     function mailsettings()
     {   
        $this->load->library('email');
    $config['wrapchars'] = 76; // Character count to wrap at.
    $config['mailtype'] = 'html'; // text or html Type of mail. If you send HTML email you must send it as a complete web page. Make sure you don't have any relative links or relative image paths otherwise they will not work.
    $config['charset'] = 'utf-8'; // Character set (utf-8, iso-8859-1, etc.).
    $this->email->initialize($config);  
}

function generateaccountno($length = 12) {
    $str="jega";
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, strlen($characters) - 1)];
    }
    echo $str.$randomString;
}

function bankdetails_update()
{
    $this->load->model('gulden_model');
    $customer_email_id= $this->session->userdata('customer_email_id'); 
    $id=$this->session->user_id;
    $data= [
            'bank_name' => $this->input->post('bankname') , 
            'bank_account'=>$this->input->post('accounttype'),
            'inter_banking_code'=>$this->input->post('iban'),
            'verification_code'=>$this->input->post('verification_code'),
            'routing_number'=>$this->input->post('routing_number')
            ];
    $this->gulden_model->bankdetailsupdate($data,$id);

}

function usercount_ajax()
{

//      header('Content-Type: text/event-stream');
// header('Cache-Control: no-cache');
   $result=$this->gulden_model->onlineuserchat();
   echo $result;
// flush();
}

function usercount_ajax_count()
{

    $data=$this->gulden_model->onlineuserchat();
    
//  header('Content-Type: text/event-stream');
// header('Cache-Control: no-cache');
    echo $data;
// flush();
}
function eth_deposit_process()
{
    $this->gulden_model->eth_deposit_process();
}

function nlg_deposit_process()
{
    $this->gulden_model->nlg_deposit_process();
}
function wcn_deposit_process()
{
    $this->gulden_model->wcn_deposit_process();
}

function getChart()
{


    $currencyPair       =   $this->input->post('currencyPair');
    $cur = array("BTC_USD","LTC_USD","ETH_USD");
    if (in_array($currencyPair, $cur)) {

        $this->session->set_userdata('currencyPair',$currencyPair); 
        $data['currencyPair']=$currencyPair;
        $this->load->view('front/getChart',$data);  
    }
}

function aboutus()     
{   

    //$data['question']=$this->gulden_model->viewfaq();
    $data['about']=$this->gulden_model->get_safety('8');
    $this->load->view('front/about_us',$data); 
}

function api()     
{   

    //$data['about']=$this->gulden_model->get_safety('8');
    $this->load->view('front/api'); 
}

function test1()
{
    // $this->gulden_model->test123();
    /*echo shell_exec('ACCESS_TOKEN="692c059228b534717d31c4be0ffacbf028866fec8f351c166c6a7bf3f28065fb"
        curl -X GET \
-H "Authorization: Bearer $ACCESS_TOKEN" \
https://www.bitgo.com/api/v1/wallet');*/
  /*echo "<pre>";
    print_r( shell_exec('ACCESS_TOKEN="692c059228b534717d31c4be0ffacbf028866fec8f351c166c6a7bf3f28065fb"
        WALLET="3QAbjoGECjd2BVQRVEHm3WodZoFbWyn2Q7"

curl -X GET \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $ACCESS_TOKEN" \
https://www.bitgo.com/api/v1/wallet/$WALLET/tx'));*/


               /* $user_wallet="3DejD2my3c4fcYAAMch84S8fKT9tCVngQ7";
                $purse="3QAbjoGECjd2BVQRVEHm3WodZoFbWyn2Q7";

                $btc_amount         = 0.002;
                $user_wallet        = $this->gulden_model->get_adminpurse();
                $access_token       = $this->gulden_model->get_access_token();
                $wallet_passphrase  = $this->gulden_model->get_walletpass();
                
                $output = shell_exec('cd /var/www/html; /usr/bin/node with.js "'.trim($access_token).'" "'.$user_wallet.'" "'.$wallet_passphrase.'" "'.$purse.'" "'.$btc_amount.'"');
                echo "<pre>"; 
                 print_r($output);
                $output = str_replace("running without secp256k1 acceleration", " ", $output);
                $abc = json_decode($output);*/

                echo "test";

                $lastnumber = exec('cd /var/www/html; /usr/bin/node ethstart_transactions.js ');

                echo "test1";

                print_r($lastnumber);
/*
                 echo "test";
                $return_var = -1;
                $output = array();
                 $lastnumber = exec('cd /var/www/html; /usr/bin/node ethstart_transactions.js 2>&1',$output, $return_var);

                 echo "test1";
                 print_r($output); 
                 print_r($lastnumber);*/ exit;


             }

             function emailresend($id)
             {
                $resendresult = $this->gulden_model->resendmail($id); 
                if($resendresult)
                {
                    $this->session->set_flashdata('success',"Your withdraw confirmation resent your mail!");

                }
                else
                {
                    $this->session->set_flashdata('error',"Your request is failed! you dont have a enough balance");

                }
                redirect('gulden/withdrawal','referesh');
            }

            function blocknumber()
            {

                echo "hai";


    //$lastnumber = shell_exec('curl -X POST --data \'{"jsonrpc":"2.0","method":"personal_unlockAccount","params":["0x0da17856e6514a20a58d2e621e5ce0f1d5899665","password",null],"id":1}\' "http://localhost:8565"');


    //$lastnumber1 = shell_exec('curl -X POST --data \'{"jsonrpc":"2.0","method":"eth_sendTransaction","params":[{"from":"0x0da17856e6514a20a58d2e621e5ce0f1d5899665","to":"0xd61dda48d6d2be5ca9cfebaca3d48923141ca38f","value":10000000000000}],"id":22}\' "http://localhost:8565"');

                $lastnumber1 = shell_exec('curl -X POST --data \'{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}\' "http://localhost:8565"');

 //$lastnumber = shell_exec('curl -X POST --data \'{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}\' "http://localhost:8565"');
 //$createAddress = exec('curl -X POST --data \'{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}\' "http://localhost:8565" 2>&1', $output, $return_var);

                echo "test1";
                print_r($lastnumber1);
            }
            function user_verification()
            { 

                $user_id = $this->input->get('user');
                $user = base64_decode($user_id); 
                $result =$this->gulden_model->activated_verifiedlink($user); 
                if($result=='ok')
                {   
                    $data['value'] = "Success: Thanks for your registration, your account is now activated.";
        //$this->session->set_userdata('activesuccess',"successoutput");  
        //redirect('gulden/index','refresh');
                }
                else
                {   
                    $data['value'] = "Warning: Application has already been activated or cancelled earlier";
        //$this->session->set_userdata('activesuccess',"successerror");
       // redirect('gulden/index','refresh'); 

                }
                $this->load->view('front/status',$data);
            }
            function delete_chat($id)
            {


                $customer_email_id      =   $this->session->userdata('customer_email_id'); 
                $customer_user_id       =   $this->session->user_id; 
                if(($customer_email_id=="") && ($customer_user_id=="") )
                {   
                    redirect(' ','refresh');     
                }
                else
                {        
                    $res = $this->gulden_model->delete_chat($id);   
                    if($res)        
                    {               
                        $this->session->set_flashdata('success', "Post has been deleted");
                        redirect('gulden/tradeorder','referesh');           
                    }
                }
            }

            /* punitha bavani start WCN coin integration 19.11.2016 */



            function depositwcncoin()
            {
    //echo "asdas";exit;

                $currency = "WCN";
    /* $litecoin = new jsonRPCClient('http://litecoinrpc:2vNmtT4ovkcszfReGkLeXPUJdfunXWgBqNjQa9hubEPf@127.0.0.1:9332/');
    $bitcoin = new jsonRPCClient('http://ramesh:Ramesh!@127.0.0.1:8332/'); */
    $customer_email_id      = $this->session->userdata('customer_email_id'); 
    // $data['currency_name']   = $this->getCurrencyname($currency);
    $data['currency']       = $currency;
    
    $checkAddress   = $this->gulden_model->checkdepositAddress($currency);
    if($checkAddress)
    { 

        $data['rootUrl'] = "https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=$checkAddress&choe=UTF-8&chld=L"; 
        $data['checkAddress'] = $checkAddress;

    }
    else
    {
        //echo "atm";exit;

        $createAddress="";
        
            $litecoin_row = $this->gulden_model->fetchWallet('wcn');    // fetch litecoin wallet credentials
            $litecoin_username =   $litecoin_row->username;
            $litecoin_password =   $litecoin_row->password;
            $litecoin_portnumber =     $litecoin_row->portnumber;

            // echo "http://$litecoin_username:$litecoin_password@127.0.0.1:$litecoin_portnumber/";
            $litecoin   = new jsonRPCClient("http://$litecoin_username:$litecoin_password@127.0.0.1:$litecoin_portnumber/");
            $createAddress = $litecoin->getaccountaddress($customer_email_id); 
            //print_r($createAddress);exit;
            // $xpub        = $abc->backupKeychain->xpub;

            $updated = $this->gulden_model->updatecreatedAddress($createAddress,$currency,$xpub=NULL);
            if($updated)
            {       
                $data['rootUrl'] = "https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=$createAddress&choe=UTF-8&chld=L";
                $data['checkAddress'] = $createAddress;
            }
        }   
    // print_r($data); exit;
        $this->load->view('front/wnc_deposit',$data);

    }
    function deposithitcoin()
    {
    //echo "asdas";exit;

        $currency = "HIT";
    /* $litecoin = new jsonRPCClient('http://litecoinrpc:2vNmtT4ovkcszfReGkLeXPUJdfunXWgBqNjQa9hubEPf@127.0.0.1:9332/');
    $bitcoin = new jsonRPCClient('http://ramesh:Ramesh!@127.0.0.1:8332/'); */
    $customer_email_id      = $this->session->userdata('customer_email_id'); 
    // $data['currency_name']   = $this->getCurrencyname($currency);
    $data['currency']       = $currency;
    
    $checkAddress   = $this->gulden_model->checkdepositAddress($currency);
    if($checkAddress)
    { 

        $data['rootUrl'] = "https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=$checkAddress&choe=UTF-8&chld=L"; 
        $data['checkAddress'] = $checkAddress;

    }
    else
    {
        //echo "atm";exit;

        $createAddress="";
        
            $litecoin_row = $this->gulden_model->fetchWallet('hitcoin');    // fetch litecoin wallet credentials
            $litecoin_username =   $litecoin_row->username;
            $litecoin_password =   $litecoin_row->password;
            $litecoin_portnumber =     $litecoin_row->portnumber;

            // echo "http://$litecoin_username:$litecoin_password@127.0.0.1:$litecoin_portnumber/";
            $litecoin   = new jsonRPCClient("http://$litecoin_username:$litecoin_password@127.0.0.1:$litecoin_portnumber/");
            $createAddress = $litecoin->getaccountaddress($customer_email_id); 
            //print_r($createAddress);exit;
            // $xpub        = $abc->backupKeychain->xpub;

            $updated = $this->gulden_model->updatecreatedAddress($createAddress,$currency,$xpub=NULL);
            if($updated)
            {       
                $data['rootUrl'] = "https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=$createAddress&choe=UTF-8&chld=L";
                $data['checkAddress'] = $createAddress;
            }
        }   
    // print_r($data); exit;
        $this->load->view('front/hit_deposit',$data);

    }

// anand 

    function create_apiKey(){

        $customer_user_id       =   $this->session->user_id; 

        if($customer_user_id==""){
            redirect('','refresh');
        }

        $api_key        = strtoupper(md5(uniqid(rand(), true)));
        $api_access_key = implode('-', str_split(substr(strtolower(md5(microtime().rand(1000, 9999))), 0, 30), 6));
        $data = array(
            'apiKey'        => $api_key,
            'apiAccessKey'  => $api_access_key
            );

        $this->db->where('user_id',$customer_user_id);  
        $this->db->update('userdetails',$data);
    //return "success";
        $success    =   $this->session->set_flashdata('success',"Your API Key has been created Successfully");  
        redirect('gulden/api_info','referesh');
    }

} // end of class
?>
