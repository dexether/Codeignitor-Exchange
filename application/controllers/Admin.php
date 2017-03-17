<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Admin extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();

        $this->output->set_header("Cache-Control: no-store, no-cache, must-revalidate, no-transform, max-age=0, post-check=0, pre-check=0");
        $this->output->set_header("Pragma: no-cache");
        $this->load->model('admin_model');
        $this->load->model('mdl_user');

    }

    function check_default($post_string)
    {
        return $post_string == '0' ? FALSE : TRUE;
    }

    function index()
    {
    	auth(['admin','superadmin']);

        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $sessionvar = $this->session->userdata('loggeduser');

        if (!$this->session->user_id > 0) {
            redirect('/');
        }

        $this->data['content'] = $this->load->view('admin/v_index', $data, true);
        view($this->data, 'admin');
    }

    function langu_maintainance($lan)
    {

        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $sessionvar = $this->session->userdata('loggeduser');

        if ($sessionvar == "") {
            $this->load->view('admin/admin_index', $data);
        } else {
            $data['lan'] = $lan;
            $this->load->view('admin/language_maintanance', $data);
        }
    }

    function down($lan)
    {
        $this->load->helper('download');
        if ($lan == "English") {
            $file = realpath("application/language/english/app_lang.php");
        } else {
            $file = realpath("application/language/spanish/app_lang.php");
        }
        if (file_exists($file)) {
            header('Content-Description: File Transfer');
            header('Content-Type: application/octet-stream');
            header('Content-Disposition: attachment; filename=' . basename($file));
            header('Content-Transfer-Encoding: binary');
            header('Expires: 0');
            header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
            header('Pragma: public');
            header('Content-Length: ' . filesize($file));
            ob_clean();
            flush();
            readfile($file);
            exit;
        } else {
            echo "File not found";
        }
    }

    function ajaxfileup_english()
    {

        $extension = end(explode('.', $_FILES['file_input']['name']));
        if ($extension != "php") {
            echo "2";
            exit;
        }
        //@unlink(base_url()."application/language/english/app_lang.php");
        $filepath = base_url() . "application/language/english/app_lang.php";
        $phpfile = $_FILES['file_input']['name'];
        move_uploaded_file($_FILES["file_input"]["tmp_name"], $filepath);
        echo "1";
    }

    function ajaxfileup_spanish()
    {

        $extension = end(explode('.', $_FILES['file_input']['name']));
        if ($extension != "php") {
            echo "2";
            exit;
        }
        //@unlink(base_url()."application/language/spanish/app_lang.php");
        $phpfile = $_FILES['file_input']['name'];
        move_uploaded_file($_FILES["file_input"]["tmp_name"], "application/language/spanish/app_lang.php");
        echo "1";
    }

    function subadminlogin()
    {

        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $sessionvar = $this->session->userdata('loggeduser');
        if ($sessionvar != "") {
            $this->load->view('admin/admin_index', $data);
        } else {
            $this->form_validation->set_rules('username', 'User Name', 'required');
            $this->form_validation->set_rules('password', 'Password', 'required');
            $this->form_validation->set_message('required', "Enter %s ");
            if ($this->form_validation->run() == FALSE) {
                $this->load->view('admin/subadmin_login');
            } else {
                if ($this->input->post('submit')) {
                    $result = $this->admin_model->loginsubadmincheck();
                    if (!$result) {
                        $data['invalid'] = "Invalid User name or Password";
                        $this->load->view('admin/subadmin_login');
                    } else {
                        $this->load->view('admin/admin_index');
                    }
                }
            }
        }
    }

    function dashboard()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $this->load->view('admin/admin_index', $data);
        }
    }

//admin logout
    function adminlogout()
    {


        $sessionvar = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $this->session->sess_destroy();
            redirect('admin/index', 'refresh');
        }
    }

    function subadminlogout()
    {


        $sessionvar = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/subadminlogin', 'refresh');
        } else {
            $this->session->sess_destroy();
            redirect('admin/subadminlogin', 'refresh');
        }
    }

    //admin forget password
    function admin_forgetpswd()
    {


        $result = $this->admin_model->get_forgetpswd();
        if (!$result) {
            echo "invalid";
        } else {
            echo "success";
        }
    }

    function subadmin_forgetpswd()
    {


        $result = $this->admin_model->get_subforgetpswd();
        if (!$result) {
            echo "invalid";
        } else {
            echo "success";
        }
    }

    //admin change Password
    function admin_change_password()
    {


        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $sessionvar = $this->session->userdata('loggeduser');
        $subId = $this->session->userdata('subId');
        if ($subId != "") {
            redirect('admin/index', 'refresh');
        }
        if ($sessionvar == "") {
            //$this->load->view('admin_login',$data);
            redirect('admin/index', 'refresh');
        } else {
            $this->form_validation->set_rules('password', 'Current Password', 'required');
            $this->form_validation->set_rules('newpassword', 'New password', 'required');
            $this->form_validation->set_rules('repassword', "re-enter password", 'required|matches[newpassword]');
            $this->form_validation->set_message('required', "%s  Required");
            $this->form_validation->set_message('matches', "Missmatching Password");
            if ($this->form_validation->run() == FALSE) {
                $this->load->view('admin/admin_account', $data);
            } else {
                $result = $this->admin_model->admin_change_pswd();
                if (!$result) {
                    $this->session->set_flashdata('error', 'Sorry Wrong Password details');
                    redirect('admin/admin_change_password', 'refresh');
                } else {
                    $this->session->set_flashdata('success', ' Details has been Edited Successfully');
                    redirect('admin/admin_change_password', 'refresh');
                }
            }
        }
    }

    function subadmin_change_password()
    {


        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $sessionvar = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            //$this->load->view('admin_login',$data);
            redirect('admin/index', 'refresh');
        } else {
            $this->form_validation->set_rules('password', 'Current Password', 'required');
            $this->form_validation->set_rules('newpassword', 'New password', 'required');
            $this->form_validation->set_rules('repassword', "re-enter password", 'required|matches[newpassword]');
            $this->form_validation->set_message('required', "%s  Required");
            $this->form_validation->set_message('matches', "Missmatching Password");
            if ($this->form_validation->run() == FALSE) {
                $this->load->view('admin/subadmin_changepwd', $data);
            } else {
                $result = $this->admin_model->subadmin_change_pswd();
                if (!$result) {
                    $this->session->set_flashdata('error', 'Sorry Wrong Password details');
                    redirect('admin/subadmin_change_password', 'refresh');
                } else {
                    $this->session->set_flashdata('success', ' Details has been Edited Successfully');
                    redirect('admin/subadmin_change_password', 'refresh');
                }
            }
        }
    }

    //country name
    function getcountryname($country)
    {


        if ($country > 0) {
            $q = $this->admin_model->getcountry($country);
            foreach ($q as $qq) {
                $country = $qq->country_name;
            }
        } else {
            $country = "";
        }
        return $country;
    }

    function getstatename($state)
    {


        if ($state > 0) {
            $q1 = $this->admin_model->getstate($state);
            foreach ($q1 as $qq) {
                $state = $qq->state_name;
            }
        } else {
            $state = "";
        }
        return $state;
    }

    function getcityname($city)
    {


        if ($city != 0) {
            $q2 = $this->admin_model->getcity($city);
            foreach ($q2 as $qw) {
                $city = $qw->city_name;
            }
        } else {
            $city = "";
        }
        return $city;
    }

    function ajax_statedetails()
    {

        $countryid = $this->input->post('countryid');
        $id = $this->input->post('id');
        $state = $this->admin_model->getdetailsofstate($countryid);
        $query = $this->admin_model->getcompanydetails($id);
        foreach ($query as $row) {
            $data['id'] = $row->id;
            $data['state'] = $row->state;
            $statedetail = $row->state;
        }
        echo "	<select  name='state'  onChange='getcity(this.value);'>";
        echo "			<option value='0' selected='selected'>Select</option>";
        foreach ($state as $record) {
            echo "<option value='" . $record->id . "'>" . $record->state_name . "</option>";
        }
        echo "	</select>
	</td>";
        echo "<td>";
        if (form_error('state')) {
            echo "	<div class='error-left'></div>";
            echo "<div class='error-inner'>" . form_error('state') . "</div>";
        }
    }

    function ajax_citydetails()
    {

        $stateid = $this->input->post('stateid');
        $id = $this->input->post('id');
        $state = $this->admin_model->getdetailsofcity($stateid);
        $query = $this->admin_model->getcompanydetails($id);
        foreach ($query as $row) {
            $data['id'] = $row->id;
            $data['city'] = $row->city;
            $citydetail = $row->city;
        }
        echo "	<select  name='city'   >";
        echo "			<option value='0' selected='selected'>Select</option>";
        foreach ($state as $record) {
            echo "<option value='" . $record->id . "'>" . $record->city_name . "</option>";
        }
        echo "	</select>
</td>";
        echo "<td>";
        if (form_error('city')) {
            echo "	<div class='error-left'></div>";
            echo "<div class='error-inner'>" . form_error('city') . "</div>";
        }
    }

//site config
    function admin_settings()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $subId = $this->session->userdata('subId');
        if ($subId != "") {
            redirect('admin/subadminlogin', 'refresh');
        }
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $getquery = $this->admin_model->getadmindetails();
            if ($getquery) {
                $query = $this->admin_model->getadmindetails();
                foreach ($query as $adminrow) {
                    $data['id'] = $adminrow->id;
                    $data['companyname'] = $adminrow->company_name;
                    $data['contactperson'] = $adminrow->contact_person;
                    $data['emailid'] = $adminrow->email_id;
                    $data['address'] = $adminrow->address;
                    $data['city'] = $adminrow->city;
                    $data['state'] = $adminrow->state;
                    $data['phone'] = $adminrow->phno;
                    $data['fax_no'] = $adminrow->fax_no;
                    $data['paypal_mode'] = $adminrow->paypal_mode;
                    $data['paypal_emailid'] = $adminrow->paypal_emailid;
                    $data['intRows'] = $adminrow->intRows;
                    $data['facebook_url'] = $adminrow->facebook_url;
                    $data['twitter_url'] = $adminrow->twitter_url;
                    $data['google_plus'] = $adminrow->google_plus;
                    $data['pinterest'] = $adminrow->pinterest;
                    $data['TFA'] = $adminrow->TFA;
                    $data['ripple_name'] = $adminrow->ripple_name;
                    $data['secret'] = $adminrow->secret;
                    $data['ripple_address'] = $adminrow->ripple_address;
                }
                $this->load->view('admin/admin_settings', $data);
            }
        }
    }

    function admin_setting()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $subId = $this->session->userdata('subId');
        if ($subId != "") {
            redirect('admin/subadminlogin', 'refresh');
        }
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $id = $this->input->post('id');
            $result = $this->admin_model->general_settings();
            if ($result) {
                $this->session->set_flashdata('success', ' Details has been Edited Successfully');
                redirect('admin/admin_settings', 'refresh');
            } else {
                $this->session->set_flashdata('error', ' Details has not been Edited ');
                redirect('admin/admin_settings', 'refresh');
            }
        }
    }

    function sendmoney_settings()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $ad_id = $this->session->userdata('id');
        $subId = $this->session->userdata('subId');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } elseif ($ad_id != "") {
            $getquery = $this->admin_model->getsendmoneydetails();
            if ($getquery) {
                $settingsRow = $this->admin_model->getsendmoneydetails();
                $data['id'] = $settingsRow->id;
                $data['commission'] = $settingsRow->commission;
                $data['btc_min'] = $settingsRow->btc_min;
                $data['usd_min'] = $settingsRow->usd_min;
                $data['ars_min'] = $settingsRow->ars_min;
                $data['bsf_min'] = $settingsRow->bsf_min;
                $data['pen_min'] = $settingsRow->pen_min;
                $data['clp_min'] = $settingsRow->clp_min;
                $data['bob_min'] = $settingsRow->bob_min;
                $data['modified_date'] = $settingsRow->modified_date;
                $this->load->view('admin/sendmoney_settings', $data);
            }
        } elseif ($subId != "") {
            $getsubadmindetail = $this->admin_model->getsubadmin_details();
            if ($getsubadmindetail) {
                foreach ($getsubadmindetail as $permision) {
                    $permission = $permision->permission;
                }
            }
            $cats = explode(",", $permission);
            $inc = 0;
            foreach ($cats as $sidebar) {
                if ($sidebar == 3) {
                    $getquery = $this->admin_model->getsendmoneydetails();
                    if ($getquery) {
                        $settingsRow = $this->admin_model->getsendmoneydetails();
                        $data['id'] = $settingsRow->id;
                        $data['commission'] = $settingsRow->commission;
                        $data['btc_min'] = $settingsRow->btc_min;
                        $data['usd_min'] = $settingsRow->usd_min;
                        $data['ars_min'] = $settingsRow->ars_min;
                        $data['bsf_min'] = $settingsRow->bsf_min;
                        $data['pen_min'] = $settingsRow->pen_min;
                        $data['clp_min'] = $settingsRow->clp_min;
                        $data['bob_min'] = $settingsRow->bob_min;
                        $data['modified_date'] = $settingsRow->modified_date;
                        $this->load->view('admin/sendmoney_settings', $data);
                    }
                    $inc++;
                }

            }
            if ($inc == 0) {
                redirect('admin/subadminlogin', 'refresh');
            }
        }

    }

    function getapiqstndetails()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $ad_id = $this->session->userdata('id');
        $subId = $this->session->userdata('subId');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } elseif ($ad_id != "") {
            $data['view'] = "view";
            $data['result'] = $this->admin_model->getapidetails();
            $this->load->view('admin/pages2', $data);
        } elseif ($subId != "") {
            $getsubadmindetail = $this->admin_model->getsubadmin_details();
            if ($getsubadmindetail) {
                foreach ($getsubadmindetail as $permision) {
                    $permission = $permision->permission;
                }
            }
            $cats = explode(",", $permission);
            $inc = 0;
            foreach ($cats as $sidebar) {
                if ($sidebar == 15) {
                    $data['view'] = "view";
                    $data['result'] = $this->admin_model->getapidetails();
                    $this->load->view('admin/pages2', $data);
                    $inc++;
                }
            }
            if ($inc == 0) {
                redirect('admin/subadminlogin', 'refresh');
            }
        }
    }

    function getqstndetails()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $ad_id = $this->session->userdata('id');
        $subId = $this->session->userdata('subId');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } elseif ($ad_id != "") {
            $data['view'] = "view";
            $data['result'] = $this->admin_model->getgendetail();
            $this->load->view('admin/pages1', $data);
        } elseif ($subId != "") {
            $getsubadmindetail = $this->admin_model->getsubadmin_details();
            if ($getsubadmindetail) {
                foreach ($getsubadmindetail as $permision) {
                    $permission = $permision->permission;
                }
            }
            $cats = explode(",", $permission);
            $inc = 0;
            foreach ($cats as $sidebar) {
                if ($sidebar == 15) {
                    $data['view'] = "view";
                    $data['result'] = $this->admin_model->getgendetail();
                    $this->load->view('admin/pages1', $data);
                    $inc++;
                }
            }
            if ($inc == 0) {
                redirect('admin/subadminlogin', 'refresh');
            }
        }
    }

    function ticketview()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $ad_id = $this->session->userdata('id');
        $subId = $this->session->userdata('subId');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } elseif ($ad_id != "") {
            $data['view'] = "View";
            $data['result'] = $this->admin_model->get_ticket_details();
            $this->load->view('admin/admin_ticket', $data);
        } elseif ($subId != "") {

            $data['view'] = "View";
            $data['result'] = $this->admin_model->get_ticket_details();
            $this->load->view('admin/admin_ticket', $data);
            $inc++;

        }


    }

    function profit()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $ad_id = $this->session->userdata('id');
        $subId = $this->session->userdata('subId');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } elseif ($ad_id != "") {
            $perpage = $this->admin_model->getrowsperpage();
            $urisegment = $this->uri->segment(3);
            $result = $this->admin_model->profit_model($perpage, $urisegment);
            if (!$result) {
                $data['notfound'] = "No Deposits Found";
                $data['result'] = "View";
                $this->load->view('admin/admin_profit', $data);
            } else {

                $total_rows = $this->admin_model->profit_modelcount();
                $base = "profit";
                //$this->pageconfig($total_rows,$base);
                $data['result'] = $this->admin_model->profit_model($perpage, $urisegment);

                $this->load->view('admin/admin_profit', $data);
            }
        } elseif ($subId != "") {
            $getsubadmindetail = $this->admin_model->getsubadmin_details();
            if ($getsubadmindetail) {
                foreach ($getsubadmindetail as $permision) {
                    $permission = $permision->permission;
                }
            }
            $cats = explode(",", $permission);
            $inc = 0;
            foreach ($cats as $sidebar) {
                if ($sidebar == 14) {
                    $perpage = $this->admin_model->getrowsperpage();
                    $urisegment = $this->uri->segment(3);
                    $result = $this->admin_model->profit_model($perpage, $urisegment);
                    if (!$result) {
                        $data['notfound'] = "No Deposits Found";
                        $data['result'] = "View";
                        $this->load->view('admin/admin_profit', $data);
                    } else {

                        $total_rows = $this->admin_model->profit_modelcount();
                        $base = "profit";
                        //$this->pageconfig($total_rows,$base);
                        $data['result'] = $this->admin_model->profit_model($perpage, $urisegment);

                        $this->load->view('admin/admin_profit', $data);
                    }
                    $inc++;
                }
            }
            if ($inc == 0) {
                redirect('admin/subadminlogin', 'refresh');
            }
        }
    }

    function email_templates()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $ad_id = $this->session->userdata('id');
        $subId = $this->session->userdata('subId');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } elseif ($ad_id != "") {
            $data['result'] = $this->admin_model->email_templates();
            $data['view'] = "View details";
            $this->load->view('admin/admin_emailtemplates', $data);
        } elseif ($subId != "") {
            $getsubadmindetail = $this->admin_model->getsubadmin_details();
            if ($getsubadmindetail) {
                foreach ($getsubadmindetail as $permision) {
                    $permission = $permision->permission;
                }
            }
            $cats = explode(",", $permission);
            $inc = 0;
            foreach ($cats as $sidebar) {
                if ($sidebar == 13) {
                    $data['result'] = $this->admin_model->email_templates();
                    $data['view'] = "View details";
                    $this->load->view('admin/admin_emailtemplates', $data);
                    $inc++;
                }
            }
            if ($inc == 0) {
                redirect('admin/subadminlogin', 'refresh');
            }
        }
    }

    function pages()
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $ad_id = $this->session->userdata('id');
        $subId = $this->session->userdata('subId');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } elseif ($ad_id != "") {
            $perpage = $this->admin_model->getrowsperpage();
            $urisegment = $this->uri->segment(3);
            $result = $this->admin_model->getpage_details($perpage, $urisegment);
            if (!$result) {
                $data['notfound'] = "No Pages Found";
                $data['view'] = "View details";
                $this->load->view('admin/pages', $data);
            } else {
                $data['found'] = "Pages Found";
                $perpage = $this->admin_model->getrowsperpage();
                $urisegment = $this->uri->segment(3);
                $total_rows = $this->admin_model->getpagescount();
                $base = "pages";
                //$this->pageconfig($total_rows,$base);
                $data['result'] = $this->admin_model->getpage_details($perpage, $urisegment);
                $data['view'] = "View details";
                $data['langcms'] = "English";
                $this->load->view('admin/pages', $data);
            }
        } elseif ($subId != "") {
            $getsubadmindetail = $this->admin_model->getsubadmin_details();
            if ($getsubadmindetail) {
                foreach ($getsubadmindetail as $permision) {
                    $permission = $permision->permission;
                }
            }
            $cats = explode(",", $permission);
            $inc = 0;
            foreach ($cats as $sidebar) {
                if ($sidebar == 12) {
                    $perpage = $this->admin_model->getrowsperpage();
                    $urisegment = $this->uri->segment(3);
                    $result = $this->admin_model->getpage_details($perpage, $urisegment);
                    if (!$result) {
                        $data['notfound'] = "No Pages Found";
                        $data['view'] = "View details";
                        $this->load->view('admin/pages', $data);
                    } else {
                        $data['found'] = " Pages Found";
                        $perpage = $this->admin_model->getrowsperpage();
                        $urisegment = $this->uri->segment(3);
                        $total_rows = $this->admin_model->getpagescount();
                        $base = "pages";
                        //$this->pageconfig($total_rows,$base);
                        $data['result'] = $this->admin_model->getpage_details($perpage, $urisegment);
                        $data['view'] = "View details";
                        $data['langcms'] = "English";
                        $this->load->view('admin/pages', $data);
                    }
                    $inc++;
                }
            }
            if ($inc == 0) {
                redirect('admin/subadminlogin', 'refresh');
            }
        }
    }

    function pages_spanish()
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $ad_id = $this->session->userdata('id');
        $subId = $this->session->userdata('subId');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } elseif ($ad_id != "") {
            $perpage = $this->admin_model->getrowsperpage();
            $urisegment = $this->uri->segment(3);
            $result = $this->admin_model->getpage_details_spanish($perpage, $urisegment);
            if (!$result) {
                $data['notfound'] = "No Pages Found";
                $data['view'] = "View details";
                $this->load->view('admin/pages', $data);
            } else {
                $data['found'] = "Pages Found";
                $perpage = $this->admin_model->getrowsperpage();
                $urisegment = $this->uri->segment(3);
                $total_rows = $this->admin_model->getpagescount_spanish();
                $base = "pages";
                //$this->pageconfig($total_rows,$base);
                $data['result'] = $this->admin_model->getpage_details_spanish($perpage, $urisegment);
                $data['view'] = "View details";
                $data['langcms'] = "Spanish";
                $this->load->view('admin/pages', $data);
            }
        } elseif ($subId != "") {
            $getsubadmindetail = $this->admin_model->getsubadmin_details();
            if ($getsubadmindetail) {
                foreach ($getsubadmindetail as $permision) {
                    $permission = $permision->permission;
                }
            }
            $cats = explode(",", $permission);
            $inc = 0;
            foreach ($cats as $sidebar) {
                if ($sidebar == 12) {
                    $perpage = $this->admin_model->getrowsperpage();
                    $urisegment = $this->uri->segment(3);
                    $result = $this->admin_model->getpage_details_spanish($perpage, $urisegment);
                    if (!$result) {
                        $data['notfound'] = "No Pages Found";
                        $data['view'] = "View details";
                        $this->load->view('admin/pages', $data);
                    } else {
                        $data['found'] = " Pages Found";
                        $perpage = $this->admin_model->getrowsperpage();
                        $urisegment = $this->uri->segment(3);
                        $total_rows = $this->admin_model->getpagescount_spanish();
                        $base = "pages";
                        //$this->pageconfig($total_rows,$base);
                        $data['result'] = $this->admin_model->getpage_details_spanish($perpage, $urisegment);
                        $data['view'] = "View details";
                        $data['langcms'] = "Spanish";
                        $this->load->view('admin/pages', $data);
                    }
                    $inc++;
                }
            }
            if ($inc == 0) {
                redirect('admin/subadminlogin', 'refresh');
            }
        }
    }

    function get_faq_detail()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $ad_id = $this->session->userdata('id');
        $subId = $this->session->userdata('subId');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } elseif ($ad_id != "") {
            $data['view'] = "view";
            $data['langfaq'] = "English";
            $data['result'] = $this->admin_model->getfaq_details();
            $this->load->view('admin/admin_faq', $data);
        } elseif ($subId != "") {
            $getsubadmindetail = $this->admin_model->getsubadmin_details();
            if ($getsubadmindetail) {
                foreach ($getsubadmindetail as $permision) {
                    $permission = $permision->permission;
                }
            }
            $cats = explode(",", $permission);
            $inc = 0;
            foreach ($cats as $sidebar) {
                if ($sidebar == 11) {
                    $data['view'] = "view";
                    $data['langfaq'] = "English";
                    $data['result'] = $this->admin_model->getfaq_details();
                    $this->load->view('admin/admin_faq', $data);
                    $inc++;
                }
            }
            if ($inc == 0) {
                redirect('admin/subadminlogin', 'refresh');
            }
        }
    }

    function get_faq_detail_spanish()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $ad_id = $this->session->userdata('id');
        $subId = $this->session->userdata('subId');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } elseif ($ad_id != "") {
            $data['view'] = "view";
            $data['langfaq'] = "Spanish";
            $data['result'] = $this->admin_model->getfaq_details_spanish();
            $this->load->view('admin/admin_faq', $data);
        } elseif ($subId != "") {
            $getsubadmindetail = $this->admin_model->getsubadmin_details();
            if ($getsubadmindetail) {
                foreach ($getsubadmindetail as $permision) {
                    $permission = $permision->permission;
                }
            }
            $cats = explode(",", $permission);
            $inc = 0;
            foreach ($cats as $sidebar) {
                if ($sidebar == 11) {
                    $data['view'] = "view";
                    $data['langfaq'] = "Spanish";
                    $data['result'] = $this->admin_model->getfaq_details_spanish();
                    $this->load->view('admin/admin_faq', $data);
                    $inc++;
                }
            }
            if ($inc == 0) {
                redirect('admin/subadminlogin', 'refresh');
            }
        }
    }

    function check_default_option($post_string)
    {

        return $post_string == '0' ? FALSE : TRUE;
    }

    function addfaq_details()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $ad_id = $this->session->userdata('id');
        $subId = $this->session->userdata('subId');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } elseif ($ad_id != "") {
            //$this->form_validation->set_rules('language','Language', 'required|callback_check_default_option');
            $this->form_validation->set_rules('question', 'Question', 'required');
            $this->form_validation->set_rules('answer', 'Answer', 'required');
            $this->form_validation->set_message('required', "%s  Required");
            $this->form_validation->set_message('check_default_option', 'You need to select something other than the default');
            if ($this->form_validation->run() == FALSE) {
                $data['add'] = "Add";
                $this->load->view('admin/admin_faq', $data);
            } else {
                if ($this->input->post('submit')) {
                    $question = $this->input->post('question');
                    $this->admin_model->addfaq_details();
                    $this->session->set_flashdata('success', "New Question  " . $question . " Has Been Added");
                    redirect('admin/addfaq_details', 'referesh');
                }
            }
        } elseif ($subId != "") {
            $getsubadmindetail = $this->admin_model->getsubadmin_details();
            if ($getsubadmindetail) {
                foreach ($getsubadmindetail as $permision) {
                    $permission = $permision->permission;
                }
            }
            $cats = explode(",", $permission);
            $inc = 0;
            foreach ($cats as $sidebar) {
                if ($sidebar == 11) {
                    $this->form_validation->set_rules('question', 'Question', 'required');
                    $this->form_validation->set_rules('answer', 'Answer', 'required');
                    $this->form_validation->set_message('required', "%s  Required");
                    if ($this->form_validation->run() == FALSE) {
                        $data['add'] = "Add";
                        $this->load->view('admin/admin_faq', $data);
                    } else {
                        if ($this->input->post('submit')) {
                            $question = $this->input->post('question');
                            $this->admin_model->addfaq_details();
                            $this->session->set_flashdata('success', "New Question  " . $question . " Has Been Added");
                            redirect('admin/get_faq_detail', 'referesh');
                        }
                    }
                    $inc++;
                }
            }
            if ($inc == 0) {
                redirect('admin/subadminlogin', 'refresh');
            }
        }
    }

    function blog()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $ad_id = $this->session->userdata('id');
        $subId = $this->session->userdata('subId');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } elseif ($ad_id != "") {
            $data['result'] = $this->admin_model->getblog_details();
            $data['view'] = "View";
            $this->load->view('admin/admin_blog', $data);
        } elseif ($subId != "") {
            $getsubadmindetail = $this->admin_model->getsubadmin_details();
            if ($getsubadmindetail) {
                foreach ($getsubadmindetail as $permision) {
                    $permission = $permision->permission;
                }
            }
            $cats = explode(",", $permission);
            $inc = 0;
            foreach ($cats as $sidebar) {
                if ($sidebar == 10) {
                    $data['result'] = $this->admin_model->getblog_details();
                    $data['view'] = "View";
                    $this->load->view('admin/admin_blog', $data);
                    $inc++;
                }
            }
            if ($inc == 0) {
                redirect('admin/subadminlogin', 'refresh');
            }
        }
    }


    function managedetails()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');

        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $data['result'] = $this->admin_model->displaybankdetails();
            $this->load->view('admin/manage_bankdetails', $data);
        }
    }


    function addblog()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $ad_id = $this->session->userdata('id');
        $subId = $this->session->userdata('subId');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } elseif ($ad_id != "") {
            $this->form_validation->set_rules('title', 'Post Title', 'required');
            $this->form_validation->set_rules('description', 'Post Description', 'required');
            $this->form_validation->set_message('required', "%s  Required");
            if ($this->form_validation->run() == FALSE) {
                $data['add'] = "Add";
                $this->load->view('admin/admin_blog', $data);
            } else {
                if ($this->input->post('submit')) {
                    $title = $this->input->post('title');
                    $description = $this->input->post('description');
                    if ($this->admin_model->getblogdetails($title)) {
                        $data['add'] = "Add";
                        $this->session->set_flashdata('error', " Post  " . $title . "  already  exist .");
                        $this->load->view('admin/admin_blog', $data);
                    } else {
                        $title = $this->input->post('title');
                        $description = $this->input->post('description');
                        $this->admin_model->addblogdetails();
                        //$data['success']="New Category  ".$category." Has Been Added";
                        $this->session->set_flashdata('success', "New post  " . $title . " has been added");
                        redirect('admin/blog', 'referesh');
                    }
                }
            }
        } elseif ($subId != "") {
            $getsubadmindetail = $this->admin_model->getsubadmin_details();
            if ($getsubadmindetail) {
                foreach ($getsubadmindetail as $permision) {
                    $permission = $permision->permission;
                }
            }
            $cats = explode(",", $permission);
            $inc = 0;
            foreach ($cats as $sidebar) {
                if ($sidebar == 10) {
                    $this->form_validation->set_rules('title', 'Post Title', 'required');
                    $this->form_validation->set_rules('description', 'Post Description', 'required');
                    $this->form_validation->set_message('required', "%s  Required");
                    if ($this->form_validation->run() == FALSE) {
                        $data['add'] = "Add";
                        $this->load->view('admin/admin_blog', $data);
                    } else {
                        if ($this->input->post('submit')) {
                            $title = $this->input->post('title');
                            $description = $this->input->post('description');
                            if ($this->admin_model->getblogdetails($title)) {
                                $data['add'] = "Add";
                                $this->session->set_flashdata('error', " Post  " . $title . "  already  exist .");
                                $this->load->view('admin/admin_blog', $data);
                            } else {
                                $title = $this->input->post('title');
                                $description = $this->input->post('description');
                                $this->admin_model->addblogdetails();
                                //$data['success']="New Category  ".$category." Has Been Added";
                                $this->session->set_flashdata('success', "New post  " . $title . " has been added");
                                redirect('admin/blog', 'referesh');
                            }
                        }
                    }
                }
                $inc++;
            }
            if ($inc == 0) {
                redirect('admin/subadminlogin', 'refresh');
            }
        }
    }

    function trade()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $ad_id = $this->session->userdata('id');
        $subId = $this->session->userdata('subId');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } elseif ($ad_id != "") {
            $data['result'] = $this->admin_model->trade_details();
            $this->load->view('admin/trade_history', $data);
        } elseif ($subId != "") {
            $getsubadmindetail = $this->admin_model->getsubadmin_details();

            if ($getsubadmindetail) {
                foreach ($getsubadmindetail as $permision) {
                    $permission = $permision->permission;
                }
            }
            $cats = explode(",", $permission);
            $inc = 0;
            foreach ($cats as $sidebar) {
                if ($sidebar == 9) {
                    $data['result'] = $this->admin_model->trade_details();
                    $this->load->view('admin/trade_history', $data);
                    $inc++;
                }
            }
            if ($inc == 0) {
                redirect('admin/subadminlogin', 'refresh');
            }
        }
    }

    function orders()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $ad_id = $this->session->userdata('id');
        $subId = $this->session->userdata('subId');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } elseif ($ad_id != "") {
            $data['result'] = $this->admin_model->order_details();
            $this->load->view('admin/order_history', $data);
        } elseif ($subId != "") {
            $getsubadmindetail = $this->admin_model->getsubadmin_details();
            if ($getsubadmindetail) {
                foreach ($getsubadmindetail as $permision) {
                    $permission = $permision->permission;
                }
            }
            $cats = explode(",", $permission);
            $inc = 0;
            foreach ($cats as $sidebar) {
                if ($sidebar == 9) {
                    $data['result'] = $this->admin_model->order_details();
                    $this->load->view('admin/order_history', $data);
                    $inc++;
                }
            }
            if ($inc == 0) {
                redirect('admin/subadminlogin', 'refresh');
            }
        }
    }

    function extra_amounts()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $ad_id = $this->session->userdata('id');
        $subId = $this->session->userdata('subId');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } elseif ($ad_id != "") {
            $this->load->library("parser");
            if ($this->input->post("save")) {
                $idata = $this->input->post();
                unset($idata["save"]);
                if (update_data("offer_amounts", $idata, array("id" => 1)))
                    redirect("admin/extra_amounts");

            } else {
                $data = get_data("offer_amounts", array("id" => 1))->row();
                $this->parser->parse('admin/offer_amounts', $data);
            }
        } elseif ($subId != "") {
            $getsubadmindetail = $this->admin_model->getsubadmin_details();
            if ($getsubadmindetail) {
                foreach ($getsubadmindetail as $permision) {
                    $permission = $permision->permission;
                }
            }
            $cats = explode(",", $permission);
            $inc = 0;
            foreach ($cats as $sidebar) {
                if ($sidebar == 8) {
                    $data = get_data("offer_amounts", array("id" => 1))->row();
                    $this->parser->parse('admin/offer_amounts', $data);
                    $inc++;
                }
            }
            if ($inc == 0) {
                redirect('admin/subadminlogin', 'refresh');
            }
        }
    }

    function validate_address()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $ad_id = $this->session->userdata('id');
        $subId = $this->session->userdata('subId');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } elseif ($ad_id != "") {
            if ($this->input->post('submit')) {
                $address = $this->input->post('address');
                $bitcoin_row = $this->admin_model->fetchWallet('bitcoin');    // fetch bitcoin wallet credentials
                $bitcoin_username = $bitcoin_row->username;
                $bitcoin_password = $bitcoin_row->password;
                $bitcoin_portnumber = $bitcoin_row->portnumber;
                $bitcoin = new jsonRPCClient("http://$bitcoin_username:$bitcoin_password@127.0.0.1:$bitcoin_portnumber/");
                $data['isvalid'] = $bitcoin->validateaddress($address);
                $data['view'] = "View Address Details";
                $this->load->view('admin/bc_validateaddress', $data);
            } else {
                $this->load->view('admin/bc_validateaddress');
            }
        } elseif ($subId != "") {
            $getsubadmindetail = $this->admin_model->getsubadmin_details();
            if ($getsubadmindetail) {
                foreach ($getsubadmindetail as $permision) {
                    $permission = $permision->permission;
                }
            }
            $cats = explode(",", $permission);
            $inc = 0;
            foreach ($cats as $sidebar) {
                if ($sidebar == 8) {
                    if ($this->input->post('submit')) {
                        $address = $this->input->post('address');
                        $bitcoin_row = $this->admin_model->fetchWallet('bitcoin');    // fetch bitcoin wallet credentials
                        $bitcoin_username = $bitcoin_row->username;
                        $bitcoin_password = $bitcoin_row->password;
                        $bitcoin_portnumber = $bitcoin_row->portnumber;
                        $bitcoin = new jsonRPCClient("http://$bitcoin_username:$bitcoin_password@127.0.0.1:$bitcoin_portnumber/");
                        $data['isvalid'] = $bitcoin->validateaddress($address);
                        $data['view'] = "View Address Details";
                        $this->load->view('admin/bc_validateaddress', $data);
                    } else {
                        $this->load->view('admin/bc_validateaddress');
                    }
                    $inc++;
                }
            }
            if ($inc == 0) {
                redirect('admin/subadminlogin', 'refresh');
            }
        }
    }

    function get_transaction()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $ad_id = $this->session->userdata('id');
        $subId = $this->session->userdata('subId');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } elseif ($ad_id != "") {
            if ($this->input->post('submit')) {
                $txid = $this->input->post('txid');
                $bitcoin_row = $this->admin_model->fetchWallet('bitcoin');    // fetch bitinka wallet credentials
                $bitcoin_username = $bitcoin_row->username;
                $bitcoin_password = $bitcoin_row->password;
                $bitcoin_portnumber = $bitcoin_row->portnumber;
                $bitcoin = new jsonRPCClient("http://$bitcoin_username:$bitcoin_password@127.0.0.1:$bitcoin_portnumber/");
                $data['isvalid'] = $bitcoin->gettransaction($txid);
                $data['view_address'] = "View Transaction Details";
                $this->load->view('admin/transaction_details', $data);
            } else {
                $this->load->view('admin/transaction_details');
            }
        } elseif ($subId != "") {
            $getsubadmindetail = $this->admin_model->getsubadmin_details();
            if ($getsubadmindetail) {
                foreach ($getsubadmindetail as $permision) {
                    $permission = $permision->permission;
                }
            }
            $cats = explode(",", $permission);
            $inc = 0;
            foreach ($cats as $sidebar) {
                if ($sidebar == 8) {
                    if ($this->input->post('submit')) {
                        $txid = $this->input->post('txid');
                        $bitcoin_row = $this->admin_model->fetchWallet('bitcoin');    // fetch bitinka wallet credentials
                        $bitcoin_username = $bitcoin_row->username;
                        $bitcoin_password = $bitcoin_row->password;
                        $bitcoin_portnumber = $bitcoin_row->portnumber;
                        $bitcoin = new jsonRPCClient("http://$bitcoin_username:$bitcoin_password@127.0.0.1:$bitcoin_portnumber/");
                        $data['isvalid'] = $bitcoin->gettransaction($txid);
                        $data['view_address'] = "View Transaction Details";
                        $this->load->view('admin/transaction_details', $data);
                    } else {
                        $this->load->view('admin/transaction_details');
                    }
                    $inc++;
                }
            }
            if ($inc == 0) {
                redirect('admin/subadminlogin', 'refresh');
            }
        }
    }

    function received_bitcoins()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $ad_id = $this->session->userdata('id');
        $subId = $this->session->userdata('subId');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } elseif ($ad_id != "") {
            $bitcoin_row = $this->admin_model->fetchWallet('bitcoin');    // fetch bitinka wallet credentials
            $bitcoin_username = $bitcoin_row->username;
            $bitcoin_password = $bitcoin_row->password;
            $bitcoin_portnumber = $bitcoin_row->portnumber;
            $bitcoin = new jsonRPCClient("http://$bitcoin_username:$bitcoin_password@127.0.0.1:$bitcoin_portnumber/");
            $data['isvalid'] = $bitcoin->listreceivedbyaddress(0, true); // main functionality
            // 0,true means displays full records
            // 1,false means displays only coin received
            $this->load->view('admin/received_bitcoins', $data);
        } elseif ($subId != "") {
            $getsubadmindetail = $this->admin_model->getsubadmin_details();
            if ($getsubadmindetail) {
                foreach ($getsubadmindetail as $permision) {
                    $permission = $permision->permission;
                }
            }
            $cats = explode(",", $permission);
            $inc = 0;
            foreach ($cats as $sidebar) {
                if ($sidebar == 8) {
                    $bitcoin_row = $this->admin_model->fetchWallet('bitcoin');    // fetch bitinka wallet credentials
                    $bitcoin_username = $bitcoin_row->username;
                    $bitcoin_password = $bitcoin_row->password;
                    $bitcoin_portnumber = $bitcoin_row->portnumber;
                    $bitcoin = new jsonRPCClient("http://$bitcoin_username:$bitcoin_password@127.0.0.1:$bitcoin_portnumber/");
                    $data['isvalid'] = $bitcoin->listreceivedbyaddress(0, true); // main functionality
                    // 0,true means displays full records
                    // 1,false means displays only coin received
                    $this->load->view('admin/received_bitcoins', $data);
                    $inc++;
                }
            }
            if ($inc == 0) {
                redirect('admin/subadminlogin', 'refresh');
            }
        }
    }

    function list_accounts()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $ad_id = $this->session->userdata('id');
        $subId = $this->session->userdata('subId');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } elseif ($ad_id != "") {
            $bitcoin_row = $this->admin_model->fetchWallet('bitcoin');    // fetch bitinka wallet credentials
            $bitcoin_username = $bitcoin_row->username;
            $bitcoin_password = $bitcoin_row->password;
            $bitcoin_portnumber = $bitcoin_row->portnumber;
            $bitcoin = new jsonRPCClient("http://$bitcoin_username:$bitcoin_password@127.0.0.1:$bitcoin_portnumber/");
            //$bitcoin = new jsonRPCClient('http://bitcoin:Bitcoin@127.0.0.1:9666/');
            $data['isvalid'] = $bitcoin->listaccounts(); // list accounts with received money
            $data['view'] = "View";
            $this->load->view('admin/list_accounts', $data);
        } elseif ($subId != "") {
            $getsubadmindetail = $this->admin_model->getsubadmin_details();
            if ($getsubadmindetail) {
                foreach ($getsubadmindetail as $permision) {
                    $permission = $permision->permission;
                }
            }
            $cats = explode(",", $permission);
            $inc = 0;
            foreach ($cats as $sidebar) {
                if ($sidebar == 8) {
                    $bitcoin_row = $this->admin_model->fetchWallet('bitcoin');    // fetch bitinka wallet credentials
                    $bitcoin_username = $bitcoin_row->username;
                    $bitcoin_password = $bitcoin_row->password;
                    $bitcoin_portnumber = $bitcoin_row->portnumber;
                    $bitcoin = new jsonRPCClient("http://$bitcoin_username:$bitcoin_password@127.0.0.1:$bitcoin_portnumber/");
                    //$bitcoin = new jsonRPCClient('http://bitcoin:Bitcoin@127.0.0.1:9666/');
                    $data['isvalid'] = $bitcoin->listaccounts(); // list accounts with received money
                    $data['view'] = "View";
                    $this->load->view('admin/list_accounts', $data);
                    $inc++;
                }
            }
            if ($inc == 0) {
                redirect('admin/subadminlogin', 'refresh');
            }
        }
    }

    function withdraw_Ecurrency()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $ad_id = $this->session->userdata('id');
        $subId = $this->session->userdata('subId');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } elseif ($ad_id != "") {
            $data['result'] = $this->admin_model->withdraw_Ecur('confirmed');
            $data['type'] = "Processing";
            $data['view'] = "View";
            $this->load->view('admin/admin_withdraw_ecurrency', $data);
        } elseif ($subId != "") {
            $getsubadmindetail = $this->admin_model->getsubadmin_details();
            if ($getsubadmindetail) {
                foreach ($getsubadmindetail as $permision) {
                    $permission = $permision->permission;
                }
            }
            $cats = explode(",", $permission);
            $inc = 0;
            foreach ($cats as $sidebar) {
                if ($sidebar == 5) {
                    $data['result'] = $this->admin_model->withdraw_Ecur('confirmed');
                    $data['type'] = "Processing";
                    $data['view'] = "View";
                    $this->load->view('admin/admin_withdraw_ecurrency', $data);
                    $inc++;
                }
            }
            if ($inc == 0) {
                redirect('admin/subadminlogin', 'refresh');
            }
        }
    }

    function update_sendmoney_settings()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $id = $this->input->post('id');
            $result = $this->admin_model->updatesend_settings($id);
            if ($result) {
                $this->session->set_flashdata('success', ' Details has been Edited Successfully');
                redirect('admin/sendmoney_settings', 'refresh');
            } else {
                $this->session->set_flashdata('error', ' Details has not been Edited ');
                redirect('admin/sendmoney_settings', 'refresh');
            }
        }
    }

    //user details
    function userdetails()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $ad_id = $this->session->userdata('id');
        $subId = $this->session->userdata('subId');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } elseif ($ad_id != "") {
            $data['view'] = "View";
            $data['result'] = $this->admin_model->getuser_details();
            $this->load->view('admin/manage_admin', $data);
        } elseif ($subId != "") {
            $getsubadmindetail = $this->admin_model->getsubadmin_details();
            if ($getsubadmindetail) {
                foreach ($getsubadmindetail as $permision) {
                    $permission = $permision->permission;
                }
            }
            $cats = explode(",", $permission);
            $inc = 0;
            foreach ($cats as $sidebar) {
                if ($sidebar == "1") {
                    $data['view'] = "View";
                    $data['result'] = $this->admin_model->getuser_details();
                    $this->load->view('admin/manage_admin', $data);
                    $inc++;
                }
            }
            if ($inc == "0") {
                redirect('admin/subadminlogin', 'refresh');
            }
        }
    }

    function changestatus_userdetails($id)
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if ($this->admin_model->changestatus_userdetails($id)) {
                $queryy = $this->admin_model->getuserdetails($id);
                foreach ($queryy as $row) {
                    $id = $row->user_id;
                    $emailid = $row->emailid;
                    $status = $row->status;
                }
                $this->session->set_flashdata('success', $emailid . " is  " . $status . "  now");
                redirect('admin/userdetails', 'referesh');
            }
        }
    }

    function edit_userdetails($id)
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $this->session->set_userdata('userdetailsid', $id);
            redirect('admin/edit_userdetail', 'referesh');
        }
    }

    function add_user_detail()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $ad_id = $this->session->userdata('id');
        $subId = $this->session->userdata('subId');

        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } elseif ($ad_id != "") {
            if ($this->input->post('submit')) {
                $this->form_validation->set_rules('username', 'First Name', 'required|is_unique[userdetails.username]');
                $this->form_validation->set_rules('emailid', 'Email Id', 'required|valid_email|is_unique[userdetails.emailid]');
                $this->form_validation->set_rules('password', 'Password', 'required');
                $this->form_validation->set_rules('cpassword', 'Confirm Password', 'matches[password]	');
                $this->form_validation->set_message('required', "%s Required");
                $this->form_validation->set_message('valid_email', "%s Should be valid");
                if ($this->form_validation->run() == FALSE) {
                    $data['add'] = "add ";
                    $this->load->view('admin/manage_admin', $data);
                } else {
                    $queryy = $this->admin_model->adduserdetails();
                    if ($queryy) {
                        $this->session->set_flashdata('success', "Customer has been added");

                    } else {
                        $this->session->set_flashdata('error', "Customer has not been added");
                    }
                    redirect("admin/userdetails");
                }
            } else {
                $data['add'] = "add ";
                $this->load->view('admin/manage_admin', $data);
            }
        } elseif ($subId != "") {
            $getsubadmindetail = $this->admin_model->getsubadmin_details();
            if ($getsubadmindetail) {
                foreach ($getsubadmindetail as $permision) {
                    $permission = $permision->permission;
                }
            }
            $cats = explode(",", $permission);
            $inc = 0;
            foreach ($cats as $sidebar) {
                if ($sidebar == "1") {
                    if ($this->input->post('submit')) {
                        $this->form_validation->set_rules('username', 'First Name', 'required|is_unique[userdetails.username]');
                        $this->form_validation->set_rules('emailid', 'Email Id', 'required|valid_email|is_unique[userdetails.emailid]');
                        $this->form_validation->set_rules('password', 'Password', 'required');
                        $this->form_validation->set_rules('cpassword', 'Confirm Password', 'matches[password]	');
                        $this->form_validation->set_message('required', "%s Required");
                        $this->form_validation->set_message('valid_email', "%s Should be valid");
                        if ($this->form_validation->run() == FALSE) {
                            $data['add'] = "add ";
                            $this->load->view('admin/manage_admin', $data);
                        } else {
                            $queryy = $this->admin_model->adduserdetails();
                            if ($queryy) {
                                $this->session->set_flashdata('success', "Customer has been added");

                            } else {
                                $this->session->set_flashdata('error', "Customer has not been added");
                            }
                            redirect("admin/userdetails");
                        }
                    } else {
                        $data['add'] = "add ";
                        $this->load->view('admin/manage_admin', $data);
                    }
                    $inc++;
                }

            }
            if ($inc == "0") {
                redirect('admin/subadminlogin', 'refresh');
            }
        }
    }


    function edit_userdetail()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $id = $this->session->userdata('userdetailsid');
            $fetchdata = $this->admin_model->getuserdetails($id);
            if ($fetchdata) {
                $query = $this->admin_model->getuserdetails($id);
                foreach ($query as $row) {
                    $data['id'] = $row->user_id;
                    $data['username'] = $row->username;
                    $data['emailid'] = $row->emailid;
                    $data['password'] = $row->password;
                    $data['profilepicture'] = $row->profilepicture;
                    $data['status'] = $row->status;
                    $data['dni'] = $row->dninumber;
                }
                $data['edit'] = "Edit ";
                $this->load->view('admin/manage_admin', $data);
            }
        }
    }

    function edit_user_detail()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if ($this->input->post('submit')) {
                $this->form_validation->set_rules('username', 'First Name', 'required');
                $this->form_validation->set_rules('emailid', 'Email Id', 'required|valid_email');
                // $this->form_validation->set_rules('password','Password', 'required');
                $this->form_validation->set_message('required', "%s Required");
                $this->form_validation->set_message('valid_email', "%s Should be valid");
                if ($this->form_validation->run() == FALSE) {
                    $id = $this->input->post('id');
                    $queryy = $this->admin_model->getuserdetails($id);
                    foreach ($queryy as $row) {
                        $data['id'] = $row->user_id;
                        $data['username'] = $row->username;
                        $data['emailid'] = $row->emailid;
                        $data['password'] = $row->password;
                        $data['profilepicture'] = $row->profilepicture;
                        $data['status'] = $row->status;
                        $data['dni'] = $row->dninumber;
                    }
                    $data['edit'] = "Edit Category";
                    $this->load->view('admin/manage_admin', $data);
                } else {
                    $exist = "";
                    $id = $this->input->post('id');
                    $emailid = $this->input->post('emailid');
                    $oldemail = $this->input->post('oldemail');
                    if ($oldemail != $emailid) {
                        if ($this->admin_model->getuser_available($emailid)) {
                            $exist = "exist";
                            $query = $this->admin_model->getuserdetails($id);
                            foreach ($query as $row) {
                                $data['id'] = $row->user_id;
                                $data['username'] = $row->username;
                                $data['emailid'] = $row->emailid;
                                $data['password'] = $row->password;
                                $data['profilepicture'] = $row->profilepicture;
                                $data['status'] = $row->status;
                                $data['dni'] = $row->dninumber;
                            }
                            $data['edit'] = "Edit ";
                            $data['error'] = " Email of of customer  " . $emailid . "  Already Exist .";
                            $this->load->view('admin/manage_admin', $data);
                        }
                    }
                    if ($exist == "") {
                        $id = $this->input->post('id');
                        $emailid = $this->input->post('emailid');
                        $username = $this->input->post('username');
                        $profile_image = $_FILES['profile_image']['name'];
                        $random = rand(0, 99999);
                        $filename = $random . "_" . $username;
                        $config['upload_path'] = 'uploader/customers/profilepicture';
                        $config['allowed_types'] = 'gif|jpg|jpeg|png';
                        $config['file_name'] = $filename;
                        //$config['max_size'] = '1000';
                        //$config['max_width'] = '1920';
                        //$config['max_height'] = '1280';
                        $this->load->library('upload', $config);
                        $this->upload->initialize($config);
                        if (($_FILES['profile_image']['name'] != "") & (!$this->upload->do_upload('profile_image'))) {
                            //$this->session->set_flashdata('error',$this->upload->display_errors());
                            $id = $this->input->post('id');
                            $queryy = $this->admin_model->getuserdetails($id);
                            foreach ($queryy as $row) {
                                $data['id'] = $row->user_id;
                                $data['username'] = $row->username;
                                $data['emailid'] = $row->emailid;
                                $data['password'] = $row->password;
                                $data['profilepicture'] = $row->profilepicture;
                                $data['status'] = $row->status;
                                $data['dni'] = $row->dninumber;
                            }
                            $data['edit'] = "Edit Category";
                            $data['error'] = $this->upload->display_errors();
                            $this->load->view('admin/manage_admin', $data);
                        } else {
                            $id = $this->input->post('id');
                            $profileimage = $_FILES['profile_image']['name'];
                            @list($imagename, $ext) = explode(".", $profileimage);
                            $filename = $random . "_" . $username . "." . $ext;
                            if ($this->admin_model->edit_userdetails($id, $filename)) {
                                $this->session->set_flashdata('success', "Details of the Customer  " . $emailid . "  Has been Edited Successfully");
                                redirect('admin/userdetails', 'referesh');
                            }
                        }
                    }
                }
            }
        }
    }

    function delete_userdetails($id)
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if ($this->admin_model->remove_userdetails($id)) {
                $this->session->set_flashdata('success', "Userdetail Has been Deleted");
                redirect('admin/userdetails', 'referesh');
            }
        }
    }

    function view_userdetails($id)
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $fetchdata = $this->admin_model->getuserdetails($id);
            if ($fetchdata) {
                $query = $this->admin_model->getuserdetails($id);
                foreach ($query as $row) {
                    $data['id'] = $row->user_id;
                    $id = $row->user_id;
                    $data['emailid'] = $row->emailid;
                    $data['username'] = $row->username;
                    $emailid = $row->emailid;
                    $data['profilepicture'] = $row->profilepicture;
                    $data['dateofreg'] = $row->dateofreg;
                    $data['status'] = $row->status;
                    $data['acountno'] = $row->account_no;
                    $data['cellno'] = $row->cellno;
                    $data['identity_no'] = $row->identity_no;


                }

                $result = $this->admin_model->userbank($id);


                if ($result) {
                    foreach ($result as $row) {
                        $data['bankname'] = $row->bank_name;
                        $data['account'] = $row->inter_banking_code;
                    }
                }


                $result2 = $this->admin_model->userverficationdetails1($id);

                $data['userstatus'] = $result2->verification_status;


                $data['view'] = "View details";
                $this->load->view('admin/admin_customeraccounts_details', $data);
            }
        }
    }

//pages

    function addpage()
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            //$this->form_validation->set_rules('language','Language', 'required|callback_check_default');
            $this->form_validation->set_rules('pagetitle', 'Title', 'required');
            $this->form_validation->set_rules('description', 'Description ', 'required');
            $this->form_validation->set_rules('displaytitle', 'Display Title', 'required');
            $this->form_validation->set_rules('content', 'Content', 'required');
            $this->form_validation->set_message('required', "%s of The Page Required");
            $this->form_validation->set_message('check_default', "%s canot be default");
            if ($this->form_validation->run() == FALSE) {
                $data['add'] = "Add";
                //$data['result1']=$this->admin_model->getactive_language();
                $this->load->view('admin/admin_pages', $data);
            } else {
                if ($this->input->post('add')) {
                    if (!$this->admin_model->addpagedetails()) {
                        $this->session->set_flashdata('error', "Page Cannot be added right Now");
                        redirect('admin/pages', 'referesh');
                    } else {
                        $this->session->set_flashdata('success', "New Page Has Been Added");
                        redirect('admin/pages', 'referesh');
                    }
                }
            }
        }
    }

    function page_changestatus($id)
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $data['admin_logged'] = $this->session->userdata('loggeduser');
            if ($this->admin_model->changestatus_page($id)) {
                $query = $this->admin_model->getpage($id);
                foreach ($query as $row) {
                    $data['pageid'] = $row->pageid;
                    $data['title'] = $row->pagetitle;
                    $data['content'] = $row->pagecontent;
                    $data['description'] = $row->description;
                    $data['displaytitle'] = $row->displaytitle;
                    $language_id = $row->language_id;
                    $status = $row->status;
                    $title = $row->displaytitle;
                }
                $this->session->set_flashdata('success', $title . " is  " . $status . "  now");
                if ($language_id == "1") {
                    redirect('admin/pages', 'referesh');
                } else {
                    redirect('admin/pages_spanish', 'referesh');
                }
            }
        }
    }

    function edit_page($id)
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $this->session->set_userdata('paged_id', $id);
            redirect('admin/edit_pages', 'refresh');
        }
    }

    function edit_pages()
    {


        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $sessionvar = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $id = $this->session->userdata('paged_id');
            $fetchdata = $this->admin_model->getpage($id);
            if ($fetchdata) {
                $queryy = $this->admin_model->getpage($id);
                foreach ($queryy as $row) {
                    $data['language_id'] = $row->language_id;
                    $data['pageid'] = $row->pageid;
                    $data['pagetitle'] = $row->pagetitle;
                    $data['content'] = $row->pagecontent;
                    $data['description'] = $row->description;
                    $data['displaytitle'] = $row->displaytitle;
                }
                $data['edit'] = "Edit";
                $data['found'] = " Pages Found";
                $perpage = $this->admin_model->getrowsperpage();
                $urisegment = $this->uri->segment(3);
                $total_rows = $this->admin_model->getpagescount();
                $base = "pages";
                //$this->pageconfig($total_rows,$base);
                //$data['result1']=$this->admin_model->getactive_language();
                $data['result'] = $this->admin_model->getpage_details($perpage, $urisegment);
                $this->load->view('admin/pages', $data);
            }
        }
    }

    function editpage()
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {

            if ($this->input->post('submit')) {

                //$this->form_validation->set_rules('language','Language', 'required|callback_check_default');
                $this->form_validation->set_rules('pagetitle', 'Title', 'required');
                $this->form_validation->set_rules('description', 'Description ', 'required');
                $this->form_validation->set_rules('displaytitle', 'Display Title', 'required');
                $this->form_validation->set_rules('content', 'Content', 'required');
                $this->form_validation->set_message('required', "%s of The Page Required");
                $this->form_validation->set_message('check_default', "%s canot be default");
                if ($this->form_validation->run() == FALSE) {

                    $id = $this->input->post('pageid');

                    $queryy = $this->admin_model->getpage($id);
                    foreach ($queryy as $row) {
                        $data['language_id'] = $row->language_id;
                        $lang_idd = $row->language_id;
                        $data['pageid'] = $row->pageid;
                        $data['pagetitle'] = $row->pagetitle;
                        $data['content'] = $row->pagecontent;
                        $data['description'] = $row->description;
                        $data['displaytitle'] = $row->displaytitle;
                    }
                    $data['edit'] = "Edit";
                    $data['found'] = " Pages Found";
                    $perpage = $this->admin_model->getrowsperpage();
                    $urisegment = $this->uri->segment(3);
                    $total_rows = $this->admin_model->getpagescount();
                    $base = "pages";
                    //$this->pageconfig($total_rows,$base);
                    //$data['result']=$this->admin_model->getpage_details($perpage,$urisegment);
                    //$data['result1']=$this->admin_model->getactive_language();
                    $this->load->view('admin/pages', $data);
                } else {

                    $id = $this->input->post('pageid');
                    $displaytitle = $this->input->post('displaytitle');
                    if ($this->admin_model->edit_pagedetails($id)) {
                        $this->session->set_flashdata('success', "Details of the Page  " . $displaytitle . "  Has been Edited Successfully");

                        redirect('admin/pages', 'referesh');


                    }
                }
            }
        }
    }

    function delete_page($id)
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {

            $queryy = $this->admin_model->getpage($id);
            foreach ($queryy as $row) {
                $lang_idd = $row->language_id;
            }
            if ($this->admin_model->remove_pagedetails($id)) {
                $this->session->set_flashdata('success', "Page has been Deleted ");
                if ($lang_idd == "1") {
                    redirect('admin/pages', 'referesh');
                } else {
                    redirect('admin/pages_spanish', 'referesh');
                }
            }
        }
    }

    function withdraw_coins()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $ad_id = $this->session->userdata('id');
        $subId = $this->session->userdata('subId');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } elseif ($ad_id != "") {
            $perpage = $this->admin_model->getrowsperpage();
            $urisegment = $this->uri->segment(3);
            $result = $this->admin_model->withdraw_coins($perpage, $urisegment);
            if (!$result) {
                $data['notfound'] = "No Deposits Found";
                $data['view'] = "View";
                $this->load->view('admin/admin_userWithdraws', $data);
            } else {
                $total_rows = $this->admin_model->withdraw_coinscount();
                $base = "withdraw_coins";
                //$this->pageconfig($total_rows,$base);
                $data['result'] = $this->admin_model->withdraw_coins($perpage, $urisegment);
                $data['view'] = "View";
                $this->load->view('admin/admin_userWithdraws', $data);
            }
        } elseif ($subId != "") {
            $getsubadmindetail = $this->admin_model->getsubadmin_details();
            if ($getsubadmindetail) {
                foreach ($getsubadmindetail as $permision) {
                    $permission = $permision->permission;
                }
            }
            $cats = explode(",", $permission);
            $inc = 0;
            foreach ($cats as $sidebar) {
                if ($sidebar == "4") {
                    $perpage = $this->admin_model->getrowsperpage();
                    $urisegment = $this->uri->segment(3);
                    $result = $this->admin_model->withdraw_coins($perpage, $urisegment);
                    if (!$result) {
                        $data['notfound'] = "No Deposits Found";
                        $data['view'] = "View";
                        $this->load->view('admin/admin_userWithdraws', $data);
                    } else {
                        $total_rows = $this->admin_model->withdraw_coinscount();
                        $base = "withdraw_coins";
                        //$this->pageconfig($total_rows,$base);
                        $data['result'] = $this->admin_model->withdraw_coins($perpage, $urisegment);
                        $data['view'] = "View";
                        $this->load->view('admin/admin_userWithdraws', $data);
                    }
                    $inc++;
                }
            }
            if ($inc == "0") {
                redirect('admin/subadminlogin', 'refresh');
            }
        }
    }

    function credit_customers()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $perpage = $this->admin_model->getrowsperpage();
            $urisegment = $this->uri->segment(3);
            $result = $this->admin_model->credit_customers($perpage, $urisegment);
            if (!$result) {
                $data['notfound'] = "No Credits are Found";
                $data['view'] = "View";
                $this->load->view('admin/admin_credit_customers', $data);
            } else {
                $total_rows = $this->admin_model->credit_customerscount();
                $base = "credit_customers";
                $this->pageconfig($total_rows, $base);
                $data['result'] = $this->admin_model->credit_customers($perpage, $urisegment);
                $data['view'] = "View";
                $this->load->view('admin/admin_credit_customers', $data);
            }
        }
    }

// view form
    function credittoCustomers($depositId)
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $fetchdata = $this->admin_model->getUserid_userDeposits($depositId);
            if ($fetchdata) {
                $row = $this->admin_model->getUserid_userDeposits($depositId);
                $data['depositId'] = $row->depositId;
                $data['userId'] = $row->userId;
                $data['coinAddress'] = $row->coinAddress;
                $data['depositAmount'] = $row->depositAmount;
                $data['cryptoCurrency'] = $row->cryptoCurrency;
                $data['status'] = $row->status;
                $data['edit'] = "Edit ";
                $this->load->view('admin/admin_credit_customers', $data);
            }
        }
    }

// update credit to customers
    function updatecredittoCustomers()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $this->form_validation->set_rules('depositAmount', 'Deposit Amount', 'required');
            $this->form_validation->set_message('required', "%s Required");
            if ($this->form_validation->run() == FALSE) {
                $depositId = $this->input->post('id');
                $fetchdata = $this->admin_model->getUserid_userDeposits($depositId);
                if ($fetchdata) {
                    $row = $this->admin_model->getUserid_userDeposits($depositId);
                    $data['depositId'] = $row->depositId;
                    $data['userId'] = $row->userId;
                    $data['coinAddress'] = $row->coinAddress;
                    $data['depositAmount'] = $row->depositAmount;
                    $data['cryptoCurrency'] = $row->cryptoCurrency;
                    $data['status'] = $row->status;
                    $data['edit'] = "Edit ";
                    $this->load->view('admin/admin_credit_customers', $data);
                }
            } else {
                $depositId = $this->input->post('id');
                if ($this->admin_model->updatecredittoCustomers($depositId)) {
                    $this->session->set_flashdata('success', "Details of the Process Has been Edited Successfully");
                    redirect('admin/credit_customers', 'referesh');
                } else {
                    $this->session->set_flashdata('error', "Oops! Could not saved");
                    redirect('admin/credit_customers', 'referesh');
                }
            }
        }
    }

    function customers_coinBalance()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $perpage = $this->admin_model->getrowsperpage();
            $urisegment = $this->uri->segment(3);
            $result = $this->admin_model->customers_coinBalance($perpage, $urisegment);
            if (!$result) {
                $data['notfound'] = "No Credits are Found";
                $data['view'] = "View";
                $this->load->view('admin/admin_customer_coinbalance', $data);
            } else {
                $total_rows = $this->admin_model->customers_coinBalancecount();
                $base = "customers_coinBalance";
                $this->pageconfig($total_rows, $base);
                $data['result'] = $this->admin_model->customers_coinBalance($perpage, $urisegment);
                $data['view'] = "View";
                $this->load->view('admin/admin_customer_coinbalance', $data);
            }
        }
    }

    function deletecredits($id)
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if ($this->admin_model->deletecredits($id)) {
                $this->session->set_flashdata('success', "Order has been Deleted");
                redirect('admin/orders', 'referesh');
            }
        }
    }

    function test()
    {

        // $litecoin 	= new jsonRPCClient('http://litecoinrpc:2vNmtT4ovkcszfReGkLeXPUJdfunXWgBqNjQa9hubEPf@127.0.0.1:8332/');
        // $isvalid	=	$litecoin->listreceivedbyaddress(0,true); // main functionality
        // echo "Result";
        // echo "<pre>\n";
        // print_r($isvalid);
        // echo "</pre>";
        $user = $this->admin_model->get_user_details();
        print_r($user);
    }

    function withdrawUser($id)
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $this->session->set_userdata('withdrawwithid', $id);
            redirect('admin/withdrawtoCustomers', 'referesh');
        }
    }

    function withdrawtoCustomers()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $id = $this->session->userdata('withdrawwithid');
            $result = $this->admin_model->fetchwithdrawcoins($id);
            if ($result) {
                $tobitcoinaddress = $result->purse;
                //$amount 	= $result->amount;
                $amount = 1;
                $currency = $result->currency;
                $bitcoin_row = $this->admin_model->fetchWallet('bitcoin');    // fetch bitinka wallet credentials
                $bitcoin_username = $bitcoin_row->username;
                $bitcoin_password = $bitcoin_row->password;
                $bitcoin_portnumber = $bitcoin_row->portnumber;
                $bitcoin = new jsonRPCClient("http://$bitcoin_username:$bitcoin_password@127.0.0.1:$bitcoin_portnumber/");
                $fromaccount = "RameshOsiz";
                $isvalid = $bitcoin->sendfrom($fromaccount, $tobitcoinaddress, $amount, 1);
                //$isvalid = $bitcoin->sendtoaddress($tobitcoinaddress,$amount);
                echo "Result";
                echo "<pre>\n";
                print_r($isvalid);
                echo "</pre>";
            }
        }
    }

    function withdraw($withId)
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $this->session->set_userdata('userWithdrawid', $withId);
            redirect('admin/withdraw_tousers', 'referesh');
        }
    }

// view form
    function withdraw_tousers()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $userWithdrawid = $this->session->userdata('userWithdrawid');
            $data['row'] = $this->admin_model->getUserid_userWithdraws($userWithdrawid);
            $data['view'] = "View";
            $this->load->view('admin/admin_withdraw_tousers', $data);
        }
    }

    function sendAmount()
    {

        $from_account = $this->input->post('from_account');
        $to_address = $this->input->post('to_address');
        $amount = $this->input->post('amount');
        $comment = $this->input->post('comment');
        $adminAddress = "13UUZjZp1mZSPxQ9KW4ZeAhMnHBLcCwFit";
        //$attribute	=	"{$to_address:$amount,$adminAddress:0.001}";
        $attribute = array($to_address => $amount, $adminAddress => "0.001");
        $bitcoin_row = $this->admin_model->fetchWallet('bitcoin');    // fetch bitinka wallet credentials
        $bitcoin_username = $bitcoin_row->username;
        $bitcoin_password = $bitcoin_row->password;
        $bitcoin_portnumber = $bitcoin_row->portnumber;
        $bitcoin = new jsonRPCClient("http://$bitcoin_username:$bitcoin_password@127.0.0.1:$bitcoin_portnumber/");
        $isvalid = $bitcoin->sendmany($from_account, $attribute, 1, $comment);
        echo "Result";
        echo "<pre>\n";
        print_r($isvalid);
        echo "</pre>";
    }

    function truncate_trading()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $data['view'] = "View";
            $this->load->view('admin/admin_truncate', $data);
        }
    }

    function truncate()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $result = $this->admin_model->truncateModel();
            $data['success'] = "Trading has been truncated successfully";
            $this->load->view('admin/admin_truncate', $data);
        }
    }

    function list_accounts_btc()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $bitcoin_row = $this->admin_model->fetchWallet('bitcoin');    // fetch bitinka wallet credentials
            $bitcoin_username = $bitcoin_row->username;
            $bitcoin_password = $bitcoin_row->password;
            $bitcoin_portnumber = $bitcoin_row->portnumber;
            $bitcoin = new jsonRPCClient("http://$bitcoin_username:$bitcoin_password@127.0.0.1:$bitcoin_portnumber/");
            $data['isvalid'] = $bitcoin->listaccounts(); // list accounts with received money
            $data['view'] = "View";
            $data['currency'] = "BTC";
            $this->load->view('admin/list_accounts', $data);
        }
    }

    function list_accounts_ltc()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $litecoin = new jsonRPCClient('http://litecoinrpc:2vNmtT4ovkcszfReGkLeXPUJdfunXWgBqNjQa9hubEPf@127.0.0.1:9332/');
            $data['isvalid'] = $litecoin->listaccounts(); // list accounts with received money
            $data['view'] = "View";
            $data['currency'] = "LTC";
            $this->load->view('admin/list_accounts', $data);
        }
    }

    function list_accounts_nmc()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $namecoin = new jsonRPCClient('http://namecoinrpc:Ramesh@127.0.0.1:9345/');
            $data['isvalid'] = $namecoin->listaccounts(); // list accounts with received money
            $data['view'] = "View";
            $data['currency'] = "NMC";
            $this->load->view('admin/list_accounts', $data);
        }
    }

    function list_accounts_nvc()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $novacoin = new jsonRPCClient('http://novacoinrpc:Ramesh@127.0.0.1:9355/');
            $data['isvalid'] = $novacoin->listaccounts(); // list accounts with received money
            $data['view'] = "View";
            $data['currency'] = "NVC";
            $this->load->view('admin/list_accounts', $data);
        }
    }

    function list_accounts_ppc()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $peercoin = new jsonRPCClient('http://peercoinrpc:Ramesh@127.0.0.1:9340/');
            $data['isvalid'] = $peercoin->listaccounts(); // list accounts with received money
            $data['view'] = "View";
            $data['currency'] = "PPC";
            $this->load->view('admin/list_accounts', $data);
        }
    }

    function list_accounts_xpm()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $primecoin = new jsonRPCClient('http://primecoinrpc:Ramesh@127.0.0.1:9341/');
            $data['isvalid'] = $primecoin->listaccounts(); // list accounts with received money
            $data['view'] = "View";
            $data['currency'] = "PPC";
            $this->load->view('admin/list_accounts', $data);
        }
    }


    function changeStatus_ebalance($id)
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if ($this->admin_model->changeStatus_ebalanceModel($id)) {
                $row = $this->admin_model->getwithdrawrequest($id);
                $payment = $row->payment;
                $status = $row->status;
                $this->session->set_flashdata('success', $payment . " is  " . $status . "  now");
                redirect('admin/withdraw_Ecurrency', 'referesh');
            }
        }
    }

// emailid Templates
    function edit_emailtemplates($id)
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $this->session->set_userdata('email_template_id', $id);
            redirect('admin/edit_emailtemplate', 'refresh');
        }
    }

    function edit_emailtemplate()
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $id = $this->session->userdata('email_template_id');
            $fetchdata = $this->admin_model->get_emailtemplate($id);
            if ($fetchdata) {
                $query = $this->admin_model->get_emailtemplate($id);
                foreach ($query as $row) {
                    $data['id'] = $row->id;
                    $data['templatetitle'] = $row->title;
                    $data['subject'] = $row->subject;
                    $data['message'] = $row->message;
                }
            }
            $data['edit'] = "Edit";
            $this->load->view('admin/admin_emailtemplates', $data);
        }
    }

    function edit_email_template()
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if ($this->input->post('submit')) {
                $this->form_validation->set_rules('subject', 'Subject', 'required');
                $this->form_validation->set_rules('message', 'Message', 'required');
                $this->form_validation->set_rules('templatetitle', 'templatetitle', 'required');
                //$this->form_validation->set_rules('refid','Reference ID', 'required');
                $this->form_validation->set_message('required', "%s required");
                if ($this->form_validation->run() == FALSE) {
                    $id = $this->input->post('id');
                    $query = $this->admin_model->get_emailtemplate($id);
                    foreach ($query as $row) {
                        $data['id'] = $row->id;
                        $data['templatetitle'] = $row->title;
                        $data['subject'] = $row->subject;
                        $data['message'] = $row->message;
                    }
                    $data['edit'] = "Edit";
                    $this->load->view('admin/admin_emailtemplates', $data);
                } else {
                    $id = $this->input->post('id');
                    $title = $this->input->post('templatetitle');
                    if ($this->admin_model->edit_emailtemplate($id)) {
                        $this->session->set_flashdata('success', "Details of Email Template Edited Successfully");
                        redirect('admin/email_templates', 'referesh');
                    }
                }
            }
        }
    }

//faqcategory
    function faqcategory()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $perpage = $this->admin_model->getrowsperpage();
            $urisegment = $this->uri->segment(3);
            $result = $this->admin_model->getfaqcategory_details($perpage, $urisegment);
            if (!$result) {
                $data['notfound'] = "No Categories Found";
                $this->load->view('admin/admin_faq_category', $data);
            } else {
                $total_rows = $this->admin_model->getfaqcategorycount();
                $base = "faqcategory";
                $this->pageconfig($total_rows, $base);
                $data['result'] = $this->admin_model->getfaqcategory_details($perpage, $urisegment);
                $this->load->view('admin/admin_faq_category', $data);
            }
        }
    }

    function changestatus_faqcategory($id)
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if ($this->admin_model->changestatus_faqcategorydetails($id)) {
                $queryy = $this->admin_model->getfaqcategory($id);
                foreach ($queryy as $row) {
                    $id = $row->cat_id;
                    $categoryname = $row->cat_name;
                    $status = $row->status;
                }
                //$data['status']=$categoryname." is  ".$catstatus."  now";
                $this->session->set_flashdata('success', $categoryname . " is  " . $status . "  now");
                redirect('admin/faqcategory', 'referesh');
            }
        }
    }

    function edit_faqcategory($id)
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $this->session->set_userdata('categoryid', $id);
            redirect('admin/edit_faqcategory_details', 'referesh');
        }
    }

    function edit_faqcategory_details()
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $id = $this->session->userdata('categoryid');
            $fetchdata = $this->admin_model->getfaqcategory($id);
            if ($fetchdata) {
                $query = $this->admin_model->getfaqcategory($id);
                foreach ($query as $row) {
                    $data['id'] = $row->cat_id;
                    $data['categoryname'] = $row->cat_name;
                    $data['status'] = $row->status;
                }
                $data['edit'] = "Edit Category";
                $perpage = $this->admin_model->getrowsperpage();
                $urisegment = $this->uri->segment(3);
                $total_rows = $this->admin_model->getfaqcategorycount();
                $base = "faqcategory";
                $this->pageconfig($total_rows, $base);
                $data['result'] = $this->admin_model->getfaqcategory_details($perpage, $urisegment);
                $this->load->view('admin/admin_faq_category', $data);
            }
        }
    }

    function edit_faqcategorydetails()
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if ($this->input->post('submit')) {
                $this->form_validation->set_rules('categoryname', 'Category Name', 'required');
                $this->form_validation->set_message('required', "%s Required");
                if ($this->form_validation->run() == FALSE) {
                    $id = $this->input->post('id');
                    $queryy = $this->admin_model->getfaqcategory($id);
                    foreach ($queryy as $row) {
                        $data['id'] = $row->cat_id;
                        $data['categoryname'] = $row->cat_name;
                    }
                    $data['edit'] = "Edit Category";
                    $perpage = $this->admin_model->getrowsperpage();
                    $urisegment = $this->uri->segment(3);
                    $total_rows = $this->admin_model->getfaqcategorycount();
                    $base = "faqcategory";
                    $this->pageconfig($total_rows, $base);
                    $data['result'] = $this->admin_model->getfaqcategory_details($perpage, $urisegment);
                    $this->load->view('admin/admin_faq_category', $data);
                } else {
                    $id = $this->input->post('id');
                    $category = $this->input->post('categoryname');
                    if ($this->admin_model->edit_faqcategorydetails($id)) {
                        // $data['editsuccess']="Details of the Category  ".$category."  Has been Edited Successfully";
                        $this->session->set_flashdata('success', "Details of the Category  " . $category . "  Has been Edited Successfully");
                        redirect('admin/faqcategory', 'referesh');
                    }
                }
            }
        }
    }

    function delete_faqcategory($id)
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if ($this->admin_model->remove_faqcategorydetails($id)) {
                //$data['deletesuccess']="Category Has been Deleted";
                $this->session->set_flashdata('success', "Category Has been Deleted");
                redirect('admin/category', 'referesh');
            }
        }
    }

    function addfaqcategory()
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $this->form_validation->set_rules('addcategoryname', 'Category Name', 'required');
            $this->form_validation->set_message('required', "%s  Required");
            if ($this->form_validation->run() == FALSE) {
                $data['addcategory'] = "Add New Category";
                $perpage = $this->admin_model->getrowsperpage();
                $urisegment = $this->uri->segment(3);
                $total_rows = $this->admin_model->getfaqcategorycount();
                $base = "faqcategory";
                $this->pageconfig($total_rows, $base);
                $data['result'] = $this->admin_model->getfaqcategory_details($perpage, $urisegment);
                $this->load->view('admin/admin_faq_category', $data);
            } else {
                if ($this->input->post('add')) {
                    $category = $this->input->post('addcategoryname');
                    if ($this->admin_model->getfaqcategorydetails($category)) {
                        $data['error'] = " Category  " . $category . "  Already Exist .You Can Add only Sub Category For This Category";
                        $perpage = $this->admin_model->getrowsperpage();
                        $urisegment = $this->uri->segment(3);
                        $total_rows = $this->admin_model->getfaqcategorycount();
                        $base = "faqcategory";
                        $this->pageconfig($total_rows, $base);
                        $data['result'] = $this->admin_model->getfaqcategory_details($perpage, $urisegment);
                        $this->load->view('admin/admin_faq_category', $data);
                    } else {
                        $category = $this->input->post('addcategoryname');
                        $this->admin_model->addfaqcategorydetails();
                        //$data['success']="New Category  ".$category." Has Been Added";
                        $this->session->set_flashdata('success', "New Category  " . $category . " Has Been Added");
                        redirect('admin/category', 'referesh');
                    }
                }
            }
        }
    }

//faq question answers
    function faq_details()
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $result = $this->admin_model->getactivefaqcategory_details();
            if (!$result) {
                $data['notfound'] = "No Questions Found";
                $this->load->view('admin/admin_faq_details', $data);
            } else {
                $data['result'] = $this->admin_model->getactivefaqcategory_details();
                $this->load->view('admin/admin_faq_details', $data);
            }
        }
    }

    function get_faq_details($catid)
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $this->session->set_userdata('catid', $catid);
            redirect('admin/get_faq_detail', 'refresh');
        }
    }


    function changestatus_faq_details($id)
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if ($this->admin_model->changestatus_faq_details($id)) {
                $qr = $this->admin_model->get_faq_details($id);
                foreach ($qr as $row) {
                    $data['id'] = $row->faqid;
                    $data['questions'] = $row->question;
                    $data['answer'] = $row->answer;
                    $question = $row->question;
                    $lang = $row->language;
                    $status = $row->status;
                }
                $this->session->set_flashdata('success', $question . "  of status is " . $status . "  now");
                if ($lang == "1") {
                    redirect('admin/get_faq_detail', 'referesh');
                } else {
                    redirect('admin/get_faq_detail_spanish', 'referesh');
                }
            }
        }
    }

    function edit_faq_details($id)
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $this->session->set_userdata('faq_id', $id);
            redirect('admin/edit_faqdetails', 'referesh');
        }
    }

    function edit_faqdetails()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $id = $this->session->userdata('faq_id');
            $fetchdata = $this->admin_model->get_faq_details($id);
            if ($fetchdata) {
                $query = $this->admin_model->get_faq_details($id);
                foreach ($query as $row) {
                    $data['faqid'] = $row->faqid;
                    $data['question'] = $row->question;
                    $data['answer'] = $row->answer;
                    $data['langg'] = $row->language;
                    $question = $row->question;
                    $status = $row->status;
                }
                $data['edit'] = "Edit subcategory";
                $this->load->view('admin/admin_faq', $data);
            }
            if ($this->input->post('submit')) {
                $this->form_validation->set_rules('question', 'Question', 'required');
                $this->form_validation->set_rules('answer', 'Answer', 'required');
                $this->form_validation->set_message('required', "%s Required");
                if ($this->form_validation->run() == FALSE) {
                    $id = $this->input->post('faqid');
                    $queryy = $this->admin_model->get_faq_details($id);
                    foreach ($queryy as $row) {
                        $data['faqid'] = $row->faqid;
                        $data['question'] = $row->question;
                        $data['answer'] = $row->answer;
                        $data['langg'] = $row->language;
                        $langg = $row->language;
                        $question = $row->question;
                        $status = $row->status;
                    }

                    $data['edit'] = "Edit subcategory";
                    $this->load->view('admin/admin_faq', $data);
                } else {
                    $id = $this->input->post('faqid');
                    $question = $this->input->post('question');
                    $currentLang = $this->input->post('currentLang');
                    if ($this->admin_model->edit_faq_details($id)) {
                        $this->session->set_flashdata('success', "Details of Question " . $question . " Has been Edited Successfully");
                        if ($currentLang == 1) {
                            redirect('admin/get_faq_detail', 'referesh');
                        } else {
                            redirect('admin/get_faq_detail_spanish', 'referesh');
                        }
                    }
                }
            }
        }
    }

    function delete_faq_details($id)
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $queryy = $this->admin_model->get_faq_details($id);
            foreach ($queryy as $row) {
                $langg = $row->language;
            }
            if ($this->admin_model->remove_faq_details($id)) {
                $this->session->set_flashdata('success', "Question Has been Deleted");
                if ($langg == "1") {
                    redirect('admin/get_faq_detail', 'referesh');
                } else {
                    redirect('admin/get_faq_detail_spanish', 'referesh');
                }
            }
        }
    }

    /* News Section Starts Here */

    function changestatus_blog($id)
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if ($this->admin_model->changestatus_blogdetails($id)) {
                $queryy = $this->admin_model->getblog($id);
                foreach ($queryy as $row) {
                    $bid = $row->bid;
                    $title = $row->title;
                    $description = $row->description;
                    $status = $row->status;
                }
                //$data['status']=$categoryname." is  ".$catstatus."  now";
                $this->session->set_flashdata('success', $title . " is  " . $status . "  now");
                redirect('admin/blog', 'referesh');
            }
        }
    }

    function edit_blog($id)
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $this->session->set_userdata('blogid', $id);
            redirect('admin/edit_blog_details', 'referesh');
        }
    }

    function edit_blog_details()
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $id = $this->session->userdata('blogid');
            $fetchdata = $this->admin_model->getblog($id);
            if ($fetchdata) {
                $query = $this->admin_model->getblog($id);
                foreach ($query as $row) {
                    $data['bid'] = $row->bid;
                    $data['title'] = $row->title;
                    $data['description'] = $row->description;
                    $data['description'] = $row->description;
                    $data['blog_image'] = $row->blog_image;
                    $data['status'] = $row->status;
                }
                $data['edit'] = "Edit ";
                $this->load->view('admin/admin_blog', $data);
            }
        }
    }

    function edit_blogdetails()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $error = "";
            if ($this->input->post('submit')) {

                $this->form_validation->set_rules('title', 'Post Title', 'required');
                $this->form_validation->set_rules('description', 'Post Description', 'required');
                $this->form_validation->set_message('required', "%s Required");
                if ($this->form_validation->run() == FALSE) {
                    $id = $this->input->post('id');
                    $queryy = $this->admin_model->getblog($id);
                    foreach ($queryy as $row) {
                        $data['bid'] = $row->bid;
                        $data['title'] = $row->title;
                        $data['description'] = $row->description;
                        $data['status'] = $row->status;
                    }
                    $data['edit'] = "Edit Post";
                    $this->load->view('admin/admin_blog', $data);
                } else {
                    $id = $this->input->post('id');
                    $title = $this->input->post('title');
                    $description = $this->input->post('description');
                    if ($this->admin_model->edit_blogdetails($id)) {
                        $this->session->set_flashdata('success', "Details of the Post  " . $title . "  has been edited successfully");
                    } else {
                        $this->session->set_flashdata('error', "Details of the Post can't be edited successfully.");
                    }
                    redirect('admin/blog', 'referesh');
                }
            }
        }
    }

    /* News Section Ends Here */
    function delete_blog($id)
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if ($this->admin_model->remove_blogdetails($id)) {
                $this->session->set_flashdata('success', "Post has been deleted");
                redirect('admin/blog', 'referesh');
            }
        }
    }

    function blog_comments($id)
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $this->session->set_userdata('blog_cmt', $id);
            redirect('admin/comments', 'referesh');
        }
    }

    function comments()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $data['view'] = "View";
            $data['result'] = $this->admin_model->getcomments_details();
            $this->load->view('admin/admin_comments', $data);
        }
    }

    function changestatus_comments($id)
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if ($this->admin_model->changestatus_commentsdetails($id)) {
                $queryy = $this->admin_model->getcomments($id);
                foreach ($queryy as $row) {
                    $status = $row->status;
                }
                //$data['status']=$categoryname." is  ".$catstatus."  now";
                $this->session->set_flashdata('success', "Comments " . $status . " successfully");
                redirect('admin/comments', 'referesh');
            }
        }
    }

    function edit_comments($id)
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $this->session->set_userdata('commentid', $id);
            redirect('admin/edit_comments_details', 'referesh');
        }
    }

    function edit_comments_details()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $id = $this->session->userdata('commentid');
            $fetchdata = $this->admin_model->getcomments($id);
            if ($fetchdata) {
                $query = $this->admin_model->getcomments($id);
                foreach ($query as $row) {
                    $data['cid'] = $row->cid;
                    $data['bid'] = $row->bid;
                    $data['user_id'] = $row->user_id;
                    $data['comments'] = $row->comments;
                    $data['status'] = $row->status;
                }
                $data['edit'] = "Edit ";
                $this->load->view('admin/admin_comments', $data);
            }
        }
    }

    function edit_commentsdetails()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if ($this->input->post('submit')) {
                $this->form_validation->set_rules('comments', 'Comments', 'required');
                $this->form_validation->set_message('required', "%s Required");
                if ($this->form_validation->run() == FALSE) {
                    $id = $this->input->post('id');
                    $queryy = $this->admin_model->getcomments($id);
                    foreach ($queryy as $row) {
                        $data['cid'] = $row->cid;
                        $data['bid'] = $row->bid;
                        $data['comments'] = $row->comments;
                        $data['user_id'] = $row->user_id;
                        $data['status'] = $row->status;
                    }
                    $data['edit'] = "Edit Comments";
                    $this->load->view('admin/admin_comments', $data);
                } else {
                    $id = $this->input->post('id');
                    $comments = $this->input->post('comments');
                    if ($this->admin_model->edit_commentsdetails($id)) {
                        $this->session->set_flashdata('success', "Comments has been edited successfully");
                        redirect('admin/comments', 'referesh');
                    }
                }
            }
        }
    }

    function delete_comments($id)
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if ($this->admin_model->remove_commentsdetails($id)) {
                $this->session->set_flashdata('success', "comments has been deleted");
                redirect('admin/comments', 'referesh');
            }
        }
    }

    function chatcommisionupdate()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if ($this->input->post('submit')) {
                $this->form_validation->set_rules('rur_com', 'RUR', 'required|decimal');
                $this->form_validation->set_rules('eur_com', 'EUR', 'required|decimal');
                $this->form_validation->set_rules('btc_com', 'BTC', 'required|decimal');
                $this->form_validation->set_rules('ltc_com', 'LTC', 'required|decimal');
                $this->form_validation->set_rules('nmc_com', 'NMC', 'required|decimal');
                $this->form_validation->set_rules('nvc_com', 'NVC', 'required|decimal');
                $this->form_validation->set_rules('ppc_com', 'PPC', 'required|decimal');
                $this->form_validation->set_rules('ftc_com', 'FTC', 'required|decimal');
                $this->form_validation->set_rules('xpm_com', 'XPM', 'required|decimal');
                $this->form_validation->set_message('required', "%s Required|decimal");

                if ($this->form_validation->run() == FALSE) {
                    $queryy = $this->admin_model->getchatcommsion();
                    foreach ($queryy as $row) {
                        $data['rur_com'] = $row->rur_com;
                        $data['eur_com'] = $row->eur_com;
                        $data['btc_com'] = $row->btc_com;
                        $data['ltc_com'] = $row->ltc_com;
                        $data['nmc_com'] = $row->nmc_com;
                        $data['nvc_com'] = $row->nvc_com;
                        $data['ppc_com'] = $row->ppc_com;
                        $data['ftc_com'] = $row->ftc_com;
                        $data['xpm_com'] = $row->xpm_com;
                    }

                    $this->load->view('admin/admin_chatcommision', $data);
                } else {
                    if ($this->admin_model->updatechatcomission()) {
                        $queryy = $this->admin_model->getchatcommsion();
                        foreach ($queryy as $row) {
                            $data['rur_com'] = $row->rur_com;
                            $data['eur_com'] = $row->eur_com;
                            $data['btc_com'] = $row->btc_com;
                            $data['ltc_com'] = $row->ltc_com;
                            $data['nmc_com'] = $row->nmc_com;
                            $data['nvc_com'] = $row->nvc_com;
                            $data['ppc_com'] = $row->ppc_com;
                            $data['ftc_com'] = $row->ftc_com;
                            $data['xpm_com'] = $row->xpm_com;
                        }
                        $this->session->set_flashdata('success', "Details of Chat Commission Upadated Successfully");
                        $this->load->view('admin/admin_chatcommision', $data);
                    }

                }
            }
        }
    }//chat commsion update starts

//chat commsion detail starts
    function chatcommissiondetail()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $queryy = $this->admin_model->getchatcommsion();
            foreach ($queryy as $row) {
                $data['rur_com'] = $row->rur_com;
                $data['eur_com'] = $row->eur_com;
                $data['btc_com'] = $row->btc_com;
                $data['ltc_com'] = $row->ltc_com;
                $data['nmc_com'] = $row->nmc_com;
                $data['nvc_com'] = $row->nvc_com;
                $data['ppc_com'] = $row->ppc_com;
                $data['ftc_com'] = $row->ftc_com;
                $data['xpm_com'] = $row->xpm_com;
            }

            $this->load->view('admin/admin_chatcommision', $data);

        }
    }//chat commsion detail ends

    function two_factor_auth()
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $perpage = $this->admin_model->getrowsperpage();
            $urisegment = $this->uri->segment(3);
            $result = $this->admin_model->get_two_auth_details($perpage, $urisegment);
            if (!$result) {
                $data['notfound'] = "No Customers Found";
                $data['view'] = "View";
                $this->load->view('admin/admin_twofactor', $data);
            } else {
                $data['view'] = "View";
                $total_rows = $this->admin_model->get_two_auth_detailscount();
                $base = "two_factor_auth";
                $this->pageconfig($total_rows, $base);
                $data['result'] = $this->admin_model->get_two_auth_details($perpage, $urisegment);
                $this->load->view('admin/admin_twofactor', $data);
            }
        }

    }//two factor authentication details ends

    //two factor authentication detailed view starts
    function view_two_factoruserdetail($id)
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {

            $fetchdata = $this->admin_model->get_twofactoruserdetail($id);
            if ($fetchdata) {
                $query = $this->admin_model->get_twofactoruserdetail($id);
                foreach ($query as $row) {
                    $data['factor_id'] = $row->factor_id;
                    $data['usre_id'] = $row->usre_id;
                    $data['cell_number'] = $row->cell_number;
                    $data['email_id'] = $row->email_id;
                    $data['timeout'] = $row->timeout;
                    $data['auth_code'] = $row->auth_code;
                    $data['created_date'] = $row->created_date;
                    $data['status'] = $row->status;
                }
                $data['detailview'] = "detailview";
                $this->load->view('admin/admin_twofactor', $data);
            }
        }
    }//two factor authentication detailed view ends

    /* Trade History Starts Here */
    function tradespecified()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $this->form_validation->set_rules('fromdate', 'From Date', 'required');
            $this->form_validation->set_rules('todate', 'To Date', 'required');
            $this->form_validation->set_message('required', "%s required");
            if ($this->form_validation->run() == FALSE) {
                $perpage = $this->admin_model->getrowsperpage();
                $urisegment = $this->uri->segment(3);
                $total_rows = $this->admin_model->gettradecount();
                $base = "trade";
                $this->pageconfig($total_rows, $base);
                $data['result'] = $this->admin_model->trade_details($perpage, $urisegment);
                $data['view'] = "View";
                $this->load->view('admin/admin_trade', $data);
            } else {
                if ($this->input->post('submit')) {
                    $perpage = $this->admin_model->getrowsperpage();
                    $urisegment = $this->uri->segment(3);
                    $result = $this->admin_model->tradedetails_specified($perpage, $urisegment);
                    if (!$result) {
                        $data['errors'] = "No Trade History found with specified date";
                        $perpage = $this->admin_model->getrowsperpage();
                        $urisegment = $this->uri->segment(3);
                        $total_rows = $this->admin_model->gettradecount();
                        $base = "trade";
                        $this->pageconfig($total_rows, $base);
                        $data['result'] = $this->admin_model->trade_details($perpage, $urisegment);
                        $data['view'] = "View";
                        $this->load->view('admin/admin_trade', $data);
                    } else {
                        $fromdate = $this->input->post('fromdate');
                        $todate = $this->input->post('todate');
                        $data['msg'] = "Trade details from " . $fromdate . " to " . $todate;
                        $total_rows = $this->admin_model->tradedetails_specifiedcount();
                        $base = "tradespecified";
                        $this->pageconfig($total_rows, $base);
                        $data['result'] = $this->admin_model->tradedetails_specified($perpage, $urisegment);
                        $data['view'] = "View";
                        $this->load->view('admin/admin_trade', $data);
                    }
                }
            }
        }
    }

    function edittradedetails($id)
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $this->session->set_userdata('orderid', $id);
            redirect('admin/editorderdetail', 'refresh');
        }
    }

    function edittradedetail()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $id = $this->session->userdata('orderid');
            $fetchdata = $this->admin_model->getorderdetails($id);
            if ($fetchdata) {
                $query = $this->admin_model->getorderdetails($id);
                foreach ($query as $row) {
                    $data['order_id'] = $row->order_id;
                    $data['user_id'] = $row->user_id;
                    $data['pair'] = $row->pair;
                    $data['price'] = $row->price;
                    $data['amount'] = $row->amount;
                    $data['total'] = $row->total;
                    $data['type'] = $row->type;
                    $data['ordered_date'] = $row->ordered_date;
                    $data['ordered_time'] = $row->ordered_time;
                    $data['modified_date'] = $row->modified_date;
                    $data['status'] = $row->status;
                }
                $data['edit'] = "edit";
                $data['country_details'] = $this->admin_model->getcountry_detail();
                $this->load->view('admin/admin_order', $data);
            }
        }
    }

    function edit_tradedetails()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if ($this->input->post('submit')) {
                $this->form_validation->set_rules('status', 'Status ', 'required|callbac_check_default');
                $status = $this->input->post('status');
                if ($status == "Completed") {
                    $this->form_validation->set_rules('delivery_date', 'Delivery Date', 'required');
                }
                $this->form_validation->set_message('required', "%s required");
                $this->form_validation->set_message('check_default', "%s canot be default");
                if ($this->form_validation->run() == FALSE) {
                    $id = $this->input->post('id');
                    $queryy = $this->admin_model->getorderdetails($id);
                    foreach ($queryy as $row) {
                        $data['order_id'] = $row->order_id;
                        $data['user_id'] = $row->user_id;
                        $data['pair'] = $row->pair;
                        $data['price'] = $row->price;
                        $data['amount'] = $row->amount;
                        $data['total'] = $row->total;
                        $data['type'] = $row->type;
                        $data['ordered_date'] = $row->ordered_date;
                        $data['ordered_time'] = $row->ordered_time;
                        $data['modified_date'] = $row->modified_date;
                        $data['status'] = $row->status;
                    }
                    $data['edit'] = "edit";
                    $data['country_details'] = $this->admin_model->getcountry_detail();
                    $this->load->view('admin/admin_order', $data);
                } else {
                    $id = $this->input->post('id');
                    if ($this->admin_model->edit_orderdetails($id)) {
                        $this->session->set_flashdata('success', "Details of the Order Id " . $id . " Has been Edited Successfully");
                        redirect('admin/orders', 'referesh');
                    }
                }
            }
        }
    }

    function deletetradedetails($id)
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if ($this->admin_model->removetradedetails($id)) {
                $this->session->set_flashdata('success', "Trade History has been Deleted");
                redirect('admin/trade', 'referesh');
            }
        }
    }

    function view_tradedetails($id)
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $this->session->set_userdata('tradeid', $id);
            redirect('admin/viewtradedetail', 'refresh');
        }
    }

    function viewtradedetail()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $id = $this->session->userdata('tradeid');
            $fetchdata = $this->admin_model->gettradedetails($id);
            if ($fetchdata) {
                $query = $fetchdata;
                foreach ($query as $row) {
                    $data['trade_id'] = $row->trade_id;
                    $data['user_id'] = $row->user_id;
                    $data['price'] = $row->price;
                    $data['amount'] = $row->amount;
                    $data['total'] = $row->total;
                    $data['type'] = $row->type;
                    $data['created_date'] = $row->created_date;
                    $data['modified_date'] = $row->modified_date;
                    $data['status'] = $row->status;
                }
                $data['view'] = "view";
                $this->load->view('admin/admin_tradedetails', $data);
            }
        }
    }
    /* Trade History Ends Here */
    /* Order History Starts Here */
    function ordersspecified()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $this->form_validation->set_rules('fromdate', 'From Date', 'required');
            $this->form_validation->set_rules('todate', 'To Date', 'required');
            $this->form_validation->set_message('required', "%s required");
            if ($this->form_validation->run() == FALSE) {
                $perpage = $this->admin_model->getrowsperpage();
                $urisegment = $this->uri->segment(3);
                $total_rows = $this->admin_model->getorderscount();
                $base = "orders";
                $this->pageconfig($total_rows, $base);
                $data['result'] = $this->admin_model->order_details($perpage, $urisegment);
                $data['view'] = "View";
                $this->load->view('admin/admin_order', $data);
            } else {
                if ($this->input->post('submit')) {
                    $perpage = $this->admin_model->getrowsperpage();
                    $urisegment = $this->uri->segment(3);
                    $result = $this->admin_model->orderdetails_specified($perpage, $urisegment);
                    if (!$result) {
                        //$this->session->set_userdata('error','No Orders found with specified date');
                        $data['errors'] = "No Orders found with specified date";
                        $perpage = $this->admin_model->getrowsperpage();
                        $urisegment = $this->uri->segment(3);
                        $total_rows = $this->admin_model->getorderscount();
                        $base = "orders";
                        $this->pageconfig($total_rows, $base);
                        $data['result'] = $this->admin_model->order_details($perpage, $urisegment);
                        $data['view'] = "View";
                        $this->load->view('admin/admin_order', $data);
                    } else {
                        $fromdate = $this->input->post('fromdate');
                        $todate = $this->input->post('todate');
                        $data['msg'] = "Order details from " . $fromdate . " to " . $todate;
                        $total_rows = $this->admin_model->orderdetails_specifiedcount();
                        $base = "ordersspecified";
                        $this->pageconfig($total_rows, $base);
                        $data['result'] = $this->admin_model->orderdetails_specified($perpage, $urisegment);
                        $data['view'] = "View";
                        $this->load->view('admin/admin_order', $data);
                    }
                }
            }
        }
    }

    function editorderdetails($id)
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $this->session->set_userdata('orderid', $id);
            redirect('admin/editorderdetail', 'refresh');
        }
    }

    function editorderdetail()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $id = $this->session->userdata('orderid');
            $fetchdata = $this->admin_model->getorderdetails($id);
            if ($fetchdata) {
                $query = $this->admin_model->getorderdetails($id);
                foreach ($query as $row) {
                    $data['order_id'] = $row->order_id;
                    $data['user_id'] = $row->user_id;
                    $data['pair'] = $row->pair;
                    $data['price'] = $row->price;
                    $data['amount'] = $row->amount;
                    $data['total'] = $row->total;
                    $data['type'] = $row->type;
                    $data['ordered_date'] = $row->ordered_date;
                    $data['ordered_time'] = $row->ordered_time;
                    $data['modified_date'] = $row->modified_date;
                    $data['status'] = $row->status;
                }
                $data['edit'] = "edit";
                $data['country_details'] = $this->admin_model->getcountry_detail();
                $this->load->view('admin/admin_order', $data);
            }
        }
    }

    function edit_orderdetails()
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if ($this->input->post('submit')) {
                $this->form_validation->set_rules('status', 'Status ', 'required|callbac_check_default');
                $status = $this->input->post('status');
                if ($status == "Completed") {
                    $this->form_validation->set_rules('delivery_date', 'Delivery Date', 'required');
                }
                $this->form_validation->set_message('required', "%s required");
                $this->form_validation->set_message('check_default', "%s canot be default");
                if ($this->form_validation->run() == FALSE) {
                    $id = $this->input->post('id');
                    $queryy = $this->admin_model->getorderdetails($id);
                    foreach ($queryy as $row) {
                        $data['order_id'] = $row->order_id;
                        $data['user_id'] = $row->user_id;
                        $data['pair'] = $row->pair;
                        $data['price'] = $row->price;
                        $data['amount'] = $row->amount;
                        $data['total'] = $row->total;
                        $data['type'] = $row->type;
                        $data['ordered_date'] = $row->ordered_date;
                        $data['ordered_time'] = $row->ordered_time;
                        $data['modified_date'] = $row->modified_date;
                        $data['status'] = $row->status;
                    }
                    $data['edit'] = "edit";
                    $data['country_details'] = $this->admin_model->getcountry_detail();
                    $this->load->view('admin/admin_order', $data);
                } else {
                    $id = $this->input->post('id');
                    if ($this->admin_model->edit_orderdetails($id)) {
                        $this->session->set_flashdata('success', "Details of the Order Id " . $id . " Has been Edited Successfully");
                        redirect('admin/orders', 'referesh');
                        /* $data['editsuccess']="Details of the Order Id ".$id." Has been Edited Successfully";
						$data['result']=$this->admin_model->order_details();
						$this->load->view('admin_order',$data);*/
                    }
                }
            }
        }
    }

    function deleteorderdetails($id)
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if ($this->admin_model->removeorderdetails($id)) {
                $this->session->set_flashdata('success', "Order has been Deleted");
                redirect('admin/orders', 'referesh');
            }
        }
    }

    function view_orderdetails($id)
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $this->session->set_userdata('orderid', $id);
            redirect('admin/vieworderdetail', 'refresh');
        }
    }

    function vieworderdetail()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $id = $this->session->userdata('orderid');
            $fetchdata = $this->admin_model->getorderdetails($id);
            if ($fetchdata) {
                $query = $this->admin_model->getorderdetails($id);
                foreach ($query as $row) {
                    $data['order_id'] = $row->order_id;
                    $data['user_id'] = $row->user_id;
                    $data['pair'] = $row->pair;
                    $data['price'] = $row->price;
                    $data['amount'] = $row->amount;
                    $data['total'] = $row->total;
                    $data['type'] = $row->type;
                    $data['ordered_date'] = $row->ordered_date;
                    $data['ordered_time'] = $row->ordered_time;
                    $data['modified_date'] = $row->modified_date;
                    $data['status'] = $row->status;
                }
                $data['view'] = "view";
                $this->load->view('admin/admin_orderdetails', $data);
            }
        }
    }

    /* Order History Ends Here */
    function depositcommision()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $queryy = $this->admin_model->getdepositcommsion();
            foreach ($queryy as $row) {
                $data['btc_com'] = $row->btc_com;
                $data['ltc_com'] = $row->ltc_com;
                $data['nmc_com'] = $row->nmc_com;
                $data['nvc_com'] = $row->nvc_com;
                $data['trc_com'] = $row->trc_com;
                $data['ppc_com'] = $row->ppc_com;
                $data['ftc_com'] = $row->ftc_com;
                $data['xpm_com'] = $row->xpm_com;
                $data['usd_com'] = $row->usd_com;
                $data['rur_com'] = $row->rur_com;
                $data['eur_com'] = $row->eur_com;
            }

            $this->load->view('admin/admin_depositcommission', $data);

        }
    }

    function depositcommisionupdate()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if ($this->input->post('submit')) {
                $this->form_validation->set_rules('btc_com', 'BTC', 'required|numeric');
                $this->form_validation->set_rules('ltc_com', 'LTC', 'required|numeric');
                $this->form_validation->set_rules('nmc_com', 'NMC', 'required|numeric');
                $this->form_validation->set_rules('nvc_com', 'NVC', 'required|numeric');
                $this->form_validation->set_rules('trc_com', 'TRC', 'required|numeric');
                $this->form_validation->set_rules('ppc_com', 'PPC', 'required|numeric');
                $this->form_validation->set_rules('ftc_com', 'FTC', 'required|numeric');
                $this->form_validation->set_rules('xpm_com', 'XPM', 'required|numeric');
                $this->form_validation->set_rules('usd_com', 'USD', 'required|numeric');
                $this->form_validation->set_rules('rur_com', 'RUR', 'required|numeric');
                $this->form_validation->set_rules('eur_com', 'EUR', 'required|numeric');
                $this->form_validation->set_message('required', "%s Required");

                if ($this->form_validation->run() == FALSE) {
                    $queryy = $this->admin_model->getdepositcommsion();
                    foreach ($queryy as $row) {
                        $data['btc_com'] = $row->btc_com;
                        $data['ltc_com'] = $row->ltc_com;
                        $data['nmc_com'] = $row->nmc_com;
                        $data['nvc_com'] = $row->nvc_com;
                        $data['trc_com'] = $row->trc_com;
                        $data['ppc_com'] = $row->ppc_com;
                        $data['ftc_com'] = $row->ftc_com;
                        $data['xpm_com'] = $row->xpm_com;
                        $data['usd_com'] = $row->usd_com;
                        $data['rur_com'] = $row->rur_com;
                        $data['eur_com'] = $row->eur_com;
                    }

                    $this->load->view('admin/admin_depositcommission', $data);
                } else {
                    if ($this->admin_model->updatedepositcomission()) {
                        $queryy = $this->admin_model->getdepositcommsion();
                        foreach ($queryy as $row) {
                            $data['btc_com'] = $row->btc_com;
                            $data['ltc_com'] = $row->ltc_com;
                            $data['nmc_com'] = $row->nmc_com;
                            $data['nvc_com'] = $row->nvc_com;
                            $data['trc_com'] = $row->trc_com;
                            $data['ppc_com'] = $row->ppc_com;
                            $data['ftc_com'] = $row->ftc_com;
                            $data['xpm_com'] = $row->xpm_com;
                            $data['usd_com'] = $row->usd_com;
                            $data['rur_com'] = $row->rur_com;
                            $data['eur_com'] = $row->eur_com;
                        }
                        //$this->session->set_flashdata('success', "Details of Deposit Commission Upadated Successfully");
                        $this->load->view('admin/admin_depositcommission', $data);
                    }

                }
            }
        }
    }//deposit commsion update ends


    function user_verification()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $ad_id = $this->session->userdata('id');
        $subId = $this->session->userdata('subId');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $data['result'] = $this->admin_model->getuserverificationstatus();
            $data['view'] = "View Details";
            $this->load->view('admin/userverification', $data);
        }


    }

    function view_usr_verify($id)
    {

        $this->session->set_userdata('userVerifyId', $id);
        redirect('admin/viewuser_verification', 'referesh');
    }

    function viewuser_verification()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $userVerifyId = $this->session->userdata('userVerifyId');
            $data['row'] = $this->admin_model->getuserverification($userVerifyId);
            $data['display'] = "Display Details";
            $this->load->view('admin/userverification', $data);
        }
    }

    function download_userverification($num, $id)
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $this->load->helper('download');
            //$this->load->library('zip');
            $row = $this->admin_model->getuserverification($id);
            if ($num == 1) {
                $document = $row->user_verification1;
            } else if ($num == 2) {
                $document = $row->user_verification2;
            } else if ($num == 3) {
                $document = $row->user_verification3;
            } else if ($num == 4) {
                $document = $row->user_verification4;
            } else if ($num == 5) {
                $document = $row->user_verification5;
            } else {
                $document = $row->user_verification6;
            }
            //echo base_url()."uploader/customers/documents/".$document; die;
            $path = file_get_contents("uploader/customers/documents/" . $document);
            force_download($document, $path);
//echo $document;
// exit;
        }
    }

    function update_userverificationstatus($str, $id)
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $field = "verification_status";
            $updata = array($field => $str);
            $result = update_data('user_verification', $updata, array("verifyId" => $id));
            if ($result) {
                if ($str == 'verified') {
                    $this->session->set_flashdata('success', 'Approved Successfully');
                    $this->admin_model->sendemailuser($id);
                } else {
                    $this->session->set_flashdata('success', 'Verification Rejected.');
                    $this->admin_model->sendemailuser1($id);
                }
            } else {
                $this->session->set_flashdata('error', 'Oops! try again later.');
            }

            $this->session->set_userdata('userVerifyId', $id);
            redirect('admin/viewuser_verification', 'referesh');

            //redirect('admin/view_usr_verify/'.$id,'referesh');
        }
    }

    function changestatus_userverification()
    {

        $id = $this->input->post('id');
        $val = $this->input->post('val');

        $result = $this->admin_model->changestatus_userverification($id, $val);
        $row = $this->admin_model->getuserverification($id);
        $user_verificationstatus = $row->user_verificationstatus;
        if ($user_verificationstatus == 1) {
            $user_verificationstatus = "Approved";
        } else if ($user_verificationstatus == 2) {
            $user_verificationstatus = "Awaiting";
        } else if ($user_verificationstatus == 3) {
            $user_verificationstatus = "Rejected";
        } else {
            $user_verificationstatus = "Not Uploading";
        }
        if ($result) {
            $this->session->set_flashdata('success', "You can $user_verificationstatus the user successfully.");
        } else {
            $this->session->set_flashdata('error', "Oops! Try again later.");
        }
        //redirect('admin/user_verification','referesh');
    }

    function view_ticket_detail($id)
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');

        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if (!$this->input->post("post_ticket_reply")) {
                $fetchdata = $this->admin_model->get_ticketdetail($id);
                if ($fetchdata) {

                    //make read ticket
                    $this->admin_model->read_ticket($id);
                    $data['result'] = $this->admin_model->get_ticketdetail($id);
                    $data['detailview'] = "detailview";
                    $this->load->view('admin/admin_ticket', $data);
                }
            } else {

                $this->form_validation->set_rules('message', 'messgae', 'required');
                if ($this->form_validation->run() != FALSE) {

                    if ($this->admin_model->reply_to_ticket($id)) {
                        redirect('admin/ticketview', 'refresh');
                    }
                } else {

                    unset($_POST);
                    $this->view_ticket_detail($id);
                }
            }
        }
    }//ticket detailed view ends

//reply ticket starts
    function reply_ticket()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');

        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $data['email_id'] = $this->session->userdata('ticketemailid');
            $data['replyview'] = "replyview";
            $this->load->view('admin/admin_ticket', $data);
        }
    }//reply ticket ends

//send mail starts
    function sendmail()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');

        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $result = $this->admin_model->send_mail();
            if ($result) {
                $this->session->set_flashdata('success', "Message has been sent successfully.");
                redirect('admin/ticketview', 'referesh');
            } else {
                $this->session->set_flashdata('success', "Oops! Try again later.");
                redirect('admin/ticketview', 'referesh');
            }
        }
    }//send mail ends

// delete ticket starts
    function delete_ticket($id)
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if ($this->admin_model->remove_ticketdetails($id)) {
                $this->session->set_flashdata('success', "Ticket has been deleted");
                redirect('admin/ticketview', 'referesh');
            }
        }
    }// delete ticket ends

    function admin_faq()
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $perpage = $this->admin_model->getrowsperpage();
            $urisegment = $this->uri->segment(3);
            $result = $this->admin_model->admin_get_faq_details($perpage, $urisegment);
            if (!$result) {
                $data['notfound'] = "No faq Found";
                $data['view'] = "View";
                $this->load->view('admin/admin_faq_details', $data);
            } else {
                $data['view'] = "View";
                $total_rows = $this->admin_model->get_faq_count();
                $base = "admin_faq";
                $this->pageconfig($total_rows, $base);
                $data['result'] = $this->admin_model->admin_get_faq_details($perpage, $urisegment);
                $this->load->view('admin/admin_faq_details', $data);
            }
        }
    }

    function edit_faq_admin($id)
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $queryy = $this->admin_model->getfaq_edit_details($id);
            foreach ($queryy as $row) {
                $data['question'] = $row->question;
                $data['answer'] = $row->answer;

            }
            $data['faq_id'] = $id;
            $data['edit'] = "edit";
            $this->load->view('admin/admin_faq', $data);

        }
    }

    function update_faq()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if ($this->input->post('submit')) {
                $this->form_validation->set_rules('question', 'Question', 'required');
                $this->form_validation->set_rules('answer', 'Answer', 'required');
                $this->form_validation->set_message('required', "%s Required");
                if ($this->form_validation->run() == FALSE) {
                    $queryy = $this->admin_model->getfaq_edit_details($id);
                    foreach ($queryy as $row) {
                        $data['question'] = $row->question;
                        $data['answer'] = $row->answer;

                    }
                    $data['faq_id'] = $id;
                    $data['edit'] = "edit";
                    $this->load->view('admin/admin_faq', $data);
                } else {
                    $id = $this->input->post('faq_id');
                    $queryy = $this->admin_model->updatefaq_admin($id);
                    $this->session->set_flashdata('success', "Details of Faq Upadated Successfully");
                    redirect('admin/admin_faq', 'refresh');
                }
            }
        }
    }

    function changestatus_faq($id)
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if ($this->admin_model->changestatus_faqdetail($id)) {

                $this->session->set_flashdata('success', "Sucessly done");
                redirect('admin/admin_faq', 'referesh');
            }
        }
    }

    function delete_faq($id)
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if ($this->admin_model->remove_faqdetails($id)) {
                $this->session->set_flashdata('success', "Faq has been deleted");
                redirect('admin/admin_faq', 'referesh');
            }
        }
    }

    function redeem_codes()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $perpage = $this->admin_model->getrowsperpage();
            $urisegment = $this->uri->segment(3);
            $result = $this->admin_model->order_details($perpage, $urisegment);
            if (!$result) {
                $data['notfound'] = "No Order Found";
                $data['view'] = "View";
                $this->load->view('admin/admin_order', $data);
            } else {
                $total_rows = $this->admin_model->getorderscount();
                $base = "orders";
                $this->pageconfig($total_rows, $base);
                $data['result'] = $this->admin_model->order_details($perpage, $urisegment);
                $data['view'] = "View";
                $this->load->view('admin/admin_order', $data);
            }
        }
    }

    function received_byltc()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $litecoin = new jsonRPCClient('http://litecoinrpc:2vNmtT4ovkcszfReGkLeXPUJdfunXWgBqNjQa9hubEPf@127.0.0.1:9332/');
            $data['isvalid'] = $litecoin->listreceivedbyaddress(1, false); // main functionality
            $data['view'] = "View";
            $this->load->view('admin/bc_receivedbyaddress', $data);
        }
    }

    function received_bynmc()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $namecoin = new jsonRPCClient('http://namecoinrpc:Ramesh@127.0.0.1:9345/');
            $data['isvalid'] = $namecoin->listreceivedbyaddress(1, false); // main functionality
            $data['view'] = "View";
            $this->load->view('admin/bc_receivedbyaddress', $data);
        }
    }

    function received_bynvc()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $novacoin = new jsonRPCClient('http://novacoinrpc:Ramesh@127.0.0.1:9355/');
            $data['isvalid'] = $novacoin->listreceivedbyaddress(1, false); // main functionality
            $data['view'] = "View";
            $this->load->view('admin/bc_receivedbyaddress', $data);
        }
    }

    function received_byppc()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $peercoin = new jsonRPCClient('http://peercoinrpc:Ramesh@127.0.0.1:9340/');
            $data['isvalid'] = $peercoin->listreceivedbyaddress(1, false); // main functionality
            $data['view'] = "View";
            $this->load->view('admin/bc_receivedbyaddress', $data);
        }
    }

    function received_byxpm()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $primecoin = new jsonRPCClient('http://primecoinrpc:Ramesh@127.0.0.1:9341/');
            $data['isvalid'] = $primecoin->listreceivedbyaddress(1, false); // main functionality
            $data['view'] = "View";
            $this->load->view('admin/bc_receivedbyaddress', $data);
        }
    }

    /*function validate_address()
{
	$sessionvar				=$this->session->userdata('loggeduser');
	$data['admin_logged']	=$this->session->userdata('loggeduser');
	if($sessionvar=="")
	{
		redirect('admin/index','refresh');
	}
	else
	{
		$this->form_validation->set_rules('address','Customer Address', 'required');
		$this->form_validation->set_message('required',"%s Required");
		if ($this->form_validation->run() == FALSE)
		{
			$data['view']="View";
			$this->load->view('admin/bc_validateaddress',$data);
		}
		else
		{
			$address = $this->input->post('address');
			$bitcoin_row = $this->admin_model->fetchWallet('bitcoin');    // fetch bitcoin wallet credentials
				$bitcoin_username	=	$bitcoin_row->username;
				$bitcoin_password	=	$bitcoin_row->password;
				$bitcoin_portnumber = 	$bitcoin_row->portnumber;
				$bitcoin 	= new jsonRPCClient("http://$bitcoin_username:$bitcoin_password@127.0.0.1:$bitcoin_portnumber/");
				$data['isvalid'] = $bitcoin->validateaddress($address);
				$data['view']="View";
				$data['view_address']="View Address Details";
			$this->load->view('admin/bc_validateaddress',$data);
		}
	}
}*/

    function deposit_coins()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $perpage = $this->admin_model->getrowsperpage();
            $urisegment = $this->uri->segment(3);
            $result = $this->admin_model->deposit_coins($perpage, $urisegment);
            if (!$result) {
                $data['notfound'] = "No Deposits Found";
                $data['view'] = "View";
                $this->load->view('admin/admin_userDeposits', $data);
            } else {
                $total_rows = $this->admin_model->deposit_coinscount();
                $base = "deposit_coins";
                $this->pageconfig($total_rows, $base);
                $data['result'] = $this->admin_model->deposit_coins($perpage, $urisegment);
                $data['view'] = "View";
                $this->load->view('admin/admin_userDeposits', $data);
            }
        }
    }

    function ticketAttachment($attachment)
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $this->load->helper('download');
            $path = file_get_contents("uploads/" . $attachment);
            force_download($attachment, $path);
        }
    }

// Sivakami Codes Starts Here

//generalqstn
    function addgeneralqstn()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $this->form_validation->set_rules('question', 'Question', 'required');
            $this->form_validation->set_rules('answer', 'Answer', 'required');
            $this->form_validation->set_message('required', "%s  Required");
            if ($this->form_validation->run() == FALSE) {
                $data['add'] = "Add";
                $this->load->view('admin/pages1', $data);
            } else {
                if ($this->input->post('submit')) {
                    $question = $this->input->post('question');
                    $this->admin_model->addqstndetails();
                    $this->session->set_flashdata('success', "New Question Added Successfully");
                    redirect('admin/getqstndetails', 'referesh');
                }
            }
        }

    }

    function changestatusgeneral($g_id)
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if ($this->admin_model->changestatusgeneraldetails($g_id)) {
                $qr = $this->admin_model->getgeneraldet($g_id);
                foreach ($qr as $row) {
                    $data['g-id'] = $row->g_id;
                    $data['questions'] = $row->qstn;
                    $data['answer'] = $row->ans;
                    $question = $row->qstn;
                    $g_id = $row->g_id;
                    $status = $row->status;
                }
                $this->session->set_flashdata('success', $g_id . "th status is " . $status . "  now");
                redirect('admin/getqstndetails', 'referesh');
            }
        }
    }

//edit
    function editgeneraldetails($g_id)
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $this->session->set_userdata('g_id', $g_id);
            redirect('admin/editgeneraldet', 'referesh');
        }
    }

    function editgeneraldet()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $g_id = $this->session->userdata('g_id');
            $fetchdata = $this->admin_model->getgeneraldet($g_id);
            if ($fetchdata) {
                $query = $this->admin_model->getgeneraldet($g_id);
                foreach ($query as $row) {
                    $data['g_id'] = $row->g_id;
                    $data['question'] = $row->qstn;
                    $data['answer'] = $row->ans;
                    $question = $row->qstn;
                    $status = $row->status;
                }
                $data['edit'] = "Edit subcategory";
                $this->load->view('admin/pages1', $data);
            }
            if ($this->input->post('submit')) {
                $this->form_validation->set_rules('question', 'Question', 'required');
                $this->form_validation->set_rules('answer', 'Answer', 'required');
                $this->form_validation->set_message('required', "%s Required");
                if ($this->form_validation->run() == FALSE) {
                    $g_id = $this->input->post('g_id');
                    $queryy = $this->admin_model->getgeneraldet($g_id);
                    foreach ($queryy as $row) {
                        $data['g_id'] = $row->g_id;
                        $data['question'] = $row->qstn;
                        $data['answer'] = $row->ans;
                        $question = $row->qstn;
                        $status = $row->status;
                    }

                    $data['edit'] = "Edit subcategory";
                    $this->load->view('admin/pages1', $data);
                } else {
                    $g_id = $this->input->post('g_id');
                    $question = $this->input->post('question');
                    if ($this->admin_model->editgeneralqstndetails($g_id)) {
                        $this->session->set_flashdata('success', "Edited Successfully");
                        redirect('admin/getqstndetails', 'referesh');
                    }
                }
            }
        }
    }

    function deletegenedetails($g_id)
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if ($this->admin_model->deletedetails($g_id)) {
                $this->session->set_flashdata('success', "Deleted successfully");
                redirect('admin/getqstndetails', 'referesh');
            }
        }
    }

//api
    function addapiqstn()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $this->form_validation->set_rules('question', 'Question', 'required');
            $this->form_validation->set_rules('answer', 'Answer', 'required');
            $this->form_validation->set_message('required', "%s  Required");
            if ($this->form_validation->run() == FALSE) {
                $data['add'] = "Add";
                $this->load->view('admin/pages2', $data);
            } else {
                if ($this->input->post('submit')) {
                    $question = $this->input->post('question');
                    $this->admin_model->addapidetails();
                    $this->session->set_flashdata('success', "New Question Added Successfully");
                    redirect('admin/getapiqstndetails', 'referesh');
                }
            }
        }

    }

    function chngapistatus($api_id)
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if ($this->admin_model->chngstatus($api_id)) {
                $qr = $this->admin_model->getapi($api_id);
                foreach ($qr as $row) {
                    $data['api_id'] = $row->api - id;
                    $data['questions'] = $row->qstn;
                    $data['answer'] = $row->ans;
                    $question = $row->qstn;
                    $api_id = $row->api_id;
                    $status = $row->status;
                }
                $this->session->set_flashdata('success', $api_id . "th status is " . $status . "  now");
                redirect('admin/getapiqstndetails', 'referesh');
            }
        }
    }

//edit
    function editapidetails($api_id)
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $this->session->set_userdata('api_id', $api_id);
            redirect('admin/editapiqstndetails', 'referesh');
        }
    }

    function editapiqstndetails()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $api_id = $this->session->userdata('api_id');
            $fetchdata = $this->admin_model->getapi($api_id);
            if ($fetchdata) {
                $query = $this->admin_model->getapi($api_id);
                foreach ($query as $row) {
                    $data['api_id'] = $row->api_id;
                    $data['question'] = $row->qstn;
                    $data['answer'] = $row->ans;
                    $status = $row->status;
                }
                $data['edit'] = "Edit subcategory";
                $this->load->view('admin/pages2', $data);
            }
            if ($this->input->post('submit')) {
                $this->form_validation->set_rules('question', 'Question', 'required');
                $this->form_validation->set_rules('answer', 'Answer', 'required');
                $this->form_validation->set_message('required', "%s Required");
                if ($this->form_validation->run() == FALSE) {
                    $api_id = $this->input->post('api_id');
                    $queryy = $this->admin_model->getapi($api_id);
                    foreach ($queryy as $row) {
                        $data['api_id'] = $row->api_id;
                        $data['question'] = $row->qstn;
                        $data['answer'] = $row->ans;
                        $question = $row->qstn;
                        $status = $row->status;
                    }

                    $data['edit'] = "Edit subcategory";
                    $this->load->view('admin/pages2', $data);
                } else {
                    $api_id = $this->input->post('api_id');
                    $question = $this->input->post('question');
                    if ($this->admin_model->editapindetails($api_id)) {
                        $this->session->set_flashdata('success', "Edited Successfully");
                        redirect('admin/getapiqstndetails', 'referesh');
                    }
                }
            }
        }
    }

    function delapi($api_id)
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if ($this->admin_model->delapidetails($api_id)) {
                $this->session->set_flashdata('success', "Deleted successfully");
                redirect('admin/getapiqstndetails', 'referesh');
            }
        }
    }
// Sivakami Codes Ends Here
//Vivek

    function finance($mode, $id = "")
    {

        ini_set('display_errors', "1");
        $this->load->library("parser");
        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        }
        switch ($mode) {
            case "view":
                $data['view'] = "View";
                $this->db->join("userdetails U", "U.user_id=CU.userId");
                $data['result'] = get_data("coin_userbalance CU", array("U.status" => "active"), "U.username,CU.*")->result();
                break;
            case "edit":
                if (!$id)
                    die("Id is missing");
                if ($this->input->post("update")) {
                    $idata = $this->input->post();
                    unset($idata["update"]);
                    if (update_data("coin_userbalance", $idata, array("userId" => $id)))
                        $this->session->set_flashdata('success', "Finance has been updated successfully");
                    else
                        $this->session->set_flashdata('error', "Finance has not been updated");
                    redirect("admin/finance/edit/$id");
                } else {
                    $data['edit'] = "edit";
                    $this->db->join("userdetails U", "U.user_id=CU.userId");
                    $udata = get_data("coin_userbalance CU", array("U.status" => "active", "CU.userId" => $id), "U.username,CU.*")->row_array();
                    $data = array_merge($data, $udata);
                }
                break;
        }
        $this->parser->parse('admin/finance', $data);
    }

    function bcpdeposit($mode, $currency, $id = "")
    {

        ini_set('display_errors', "1");
        $this->load->library("parser");
        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        }
        switch ($mode) {
            case "view":
                $data['currency'] = $currency;
                $data['view'] = "View";
                $data['getvalue'] = $this->admin_model->bcpdeposit($currency);
                break;
        }
        $this->parser->parse('admin/pendeposit', $data);
    }

    function deposit($mode, $id = "")
    {

        ini_set('display_errors', "1");
        $this->load->library("parser");
        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        }
        switch ($mode) {
            case "view":
                $data['view'] = "View";
                $select = "U.username as name, DATE_FORMAT(PD.payment_date,'%d-%b-%Y') as date,PD.payment_method  as method,
		PD.amount,PD.status,PD.currency";
                $this->db->join("userdetails U", "U.user_id=PD.user_id");
                $data['result'] = get_data("payment_details PD", array("U.status" => "active"), $select)->result();
                break;
            case "edit":
                if (!$id)
                    die("Id is missing");
                if ($this->input->post("update")) {
                    $idata = $this->input->post();
                    unset($idata["update"]);
                    if (update_data("coin_userbalance", $idata, array("userId" => $id)))
                        $this->session->set_flashdata('success', "Finance has been updated successfully");
                    else
                        $this->session->set_flashdata('error', "Finance has not been updated");
                    redirect("admin/finance/edit/$id");
                } else {
                    $data['edit'] = "edit";
                    $this->db->join("userdetails U", "U.user_id=CU.userId");
                    $udata = get_data("coin_userbalance CU", array("U.status" => "active", "CU.userId" => $id), "U.username,CU.*")->row_array();
                    $data = array_merge($data, $udata);
                }
                break;
        }
        $this->parser->parse('admin/deposit', $data);
    }

    function update_viabcp_status($autoid, $status, $currency)
    {

        $result = $this->admin_model->update_viabcp_status($autoid, $status);
        $this->session->set_flashdata('success', "The Status has been updated successfully");
        redirect('admin/bcpdeposit/view/' . $currency, 'referesh');
    }

// Sub admin management

    function subadmin($mode, $id = "")
    {

        ini_set('display_errors', "1");
        $this->load->library("parser");
        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        }
        switch ($mode) {
            case "add":
                $data['add'] = "add";
                break;
            case "view":
                $data['view'] = "View";
                $data['result'] = get_data("sub_admin", array("status" => "active"))->result();
                break;
            case "edit":
                if (!$id)
                    die("Id is missing");
                if ($this->input->post("update")) {
                    $idata = $this->input->post();
                    $idata["permission"] = implode(',', $idata["permission"]);
                    unset($idata["update"]);
                    if (update_data("sub_admin", $idata, array("subId" => $id)))
                        $this->session->set_flashdata('success', "Sub admin information has been updated successfully");
                    else
                        $this->session->set_flashdata('error', "Sub admin information has not been updated");
                    redirect("admin/subadmin/edit/$id");
                } else {
                    $data['edit'] = "edit";
                    $udata = get_data("sub_admin", array("subId" => $id))->row_array();
                    $data = array_merge($data, $udata);
                }
                break;
        }
        $this->parser->parse('admin/subadmin', $data);
    }

    function add_subadmin()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if ($this->input->post('submit')) {
                $this->form_validation->set_rules('sub_username', 'User Name', 'required|is_unique[sub_admin.sub_username]');
                $this->form_validation->set_rules('sub_emailid', 'Email Id', 'required|valid_email|is_unique[sub_admin.sub_emailid]');
                $this->form_validation->set_rules('sub_password', 'Password', 'required');
                $this->form_validation->set_rules('permission', 'Permission', 'required');
                $this->form_validation->set_message('required', "%s Required");
                $this->form_validation->set_message('valid_email', "%s Should be valid");
                if ($this->form_validation->run() == FALSE) {
                    $data['add'] = "add ";
                    $this->load->view('admin/subadmin', $data);
                } else {
                    $queryy = $this->admin_model->add_subadmindetails();
                    if ($queryy) {
                        $this->session->set_flashdata('success', "Sub Admin has been added");

                    } else {
                        $this->session->set_flashdata('error', "Sub Admin has not been added");
                    }
                    redirect("admin/subadmin/view");
                }
            } else {
                $data['add'] = "add ";
                $this->load->view('admin/subadmin', $data);
            }
        }
    }

    function checkusername($str)
    {

        echo $row = count_fun('sub_admin', array('sub_username' => $str));
    }

    function generatedni($id)
    {

        $uid = $this->session->set_userdata('uid', $id);
        redirect("admin/generatednii");
    }

    function generatednii()
    {

        $uid = $this->session->userdata('uid');
        if ($uid == "") {
            redirect('admin/index', 'refresh');
        } else {
            $queryy = $this->admin_model->generatedni();
            if ($queryy) {
                redirect('admin/edit_userdetails/' . $uid);
            } else {
                redirect('admin/index', 'refresh');
            }
        }
    }
// Sub admin management

//Create Ticket Section Starts here......

    function createticket($id)
    {

        $userrow = $this->admin_model->getuserdetailsrow($id);
        $emailid = $userrow->emailid;
        $this->session->set_userdata('sessionTickEmailid', $emailid);
        redirect('admin/Create_Ticket', 'referesh');
    }

    function Create_Ticket()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $ad_id = $this->session->userdata('id');
        $subId = $this->session->userdata('subId');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else if ($ad_id != "") {
            if ($this->input->post('submit')) {
                $this->admin_model->create_ticket();
                $this->session->set_flashdata('success', "Ticket has been sent successfully");
                redirect('admin/Create_Ticket', 'refresh');
            } else {
                $data['add'] = "Add";
                $this->load->view('admin/admin_createticket', $data);
            }
        } elseif ($subId != "") {
            $getsubadmindetail = $this->admin_model->getsubadmin_details();
            if ($getsubadmindetail) {
                foreach ($getsubadmindetail as $permision) {
                    $permission = $permision->permission;
                }
            }
            $cats = explode(",", $permission);
            $inc = 0;
            foreach ($cats as $sidebar) {
                if ($sidebar == 15) {
                    $this->form_validation->set_rules('emailid', 'User Email', 'required');
                    $this->form_validation->set_rules('message', 'Message', 'required');
                    $this->form_validation->set_message('required', "%s  Required");
                    if ($this->form_validation->run() == FALSE) {
                        $data['add'] = "Add";
                        $this->load->view('admin/Create_Ticket', $data);
                    } else {
                        if ($this->input->post('submit')) {
                            $this->admin_model->create_ticket();
                            $this->session->set_flashdata('success', "Ticket has been sent successfully");
                            redirect('admin/Create_Ticket', 'refresh');
                        }
                    }
                    $inc++;
                }
            }
            if ($inc == 0) {
                redirect('admin/subadminlogin', 'refresh');
            }
        }
    }
//Create Ticket Section Ends here......
//BTC Values Section Starts here.....
    function btc_value()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $subId = $this->session->userdata('subId');
        if ($subId != "") {
            redirect('admin/subadminlogin', 'refresh');
        }
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $btcrow = $this->admin_model->get_btcvalues();
            $data['id'] = $btcrow->id;
            $data['btcusd_low'] = $btcrow->btcusd_low;
            $data['btcusd_high'] = $btcrow->btcusd_high;
            $data['btcars_low'] = $btcrow->btcars_low;
            $data['btcars_high'] = $btcrow->btcars_high;
            $data['btcpen_low'] = $btcrow->btcpen_low;
            $data['btcpen_high'] = $btcrow->btcpen_high;
            $data['btcbob_low'] = $btcrow->btcbob_low;
            $data['btcbob_high'] = $btcrow->btcbob_high;
            $data['btcbsf_low'] = $btcrow->btcbsf_low;
            $data['btcbsf_high'] = $btcrow->btcbsf_high;
            $data['btcclp_low'] = $btcrow->btcclp_low;
            $data['btcclp_high'] = $btcrow->btcclp_high;
            $this->load->view('admin/btc_values', $data);
        }
    }

    function update_btcvalues()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $subId = $this->session->userdata('subId');
        if ($subId != "") {
            redirect('admin/subadminlogin', 'refresh');
        }
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $result = $this->admin_model->update_btcvalues($id);
            if ($result) {
                $this->session->set_flashdata('success', ' BTC Values has been Updated Successfully');
                redirect('admin/btc_value', 'refresh');
            } else {
                $this->session->set_flashdata('error', ' BTC Values has not been Updated ');
                redirect('admin/btc_value', 'refresh');
            }
        }
    }

//BTC Values Section Starts here.....

    function verificationContent($mode, $lang)
    {

        ini_set('display_errors', "1");
        $this->load->library("parser");
        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        }
        switch ($mode) {
            case "view":
                $data['view'] = "View";
                $udata = get_data("verification_content", array("type" => $lang))->row_array();
                $data = array_merge($udata, $data);
                break;
            case "edit":
                if (!$lang)
                    die("Language is missing");
                $idata = $this->input->post();
                unset($idata["update"]);
                if (update_data("verification_content", $idata, array("type" => $lang)))
                    $this->session->set_flashdata('success', "Content has been updated successfully");
                else
                    $this->session->set_flashdata('error', "Content has not been updated");
                redirect("admin/verificationContent/view/$lang");
                break;
        }
        $this->parser->parse('admin/verificationContent', $data);
    }

    function meta_content($mode, $id = "")
    {

        ini_set('display_errors', "1");
        $this->load->library("parser");
        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        }
        switch ($mode) {
            case "view":
                $data['view'] = "View";
                $data['result'] = get_data("meta_content")->result();
                break;
            case "edit":
                if (!$id)
                    die("Id is missing");
                if ($this->input->post("update")) {
                    $idata = $this->input->post();
                    unset($idata["update"]);
                    if (update_data("meta_content", $idata, array("meta_id" => $id)))
                        $this->session->set_flashdata('success', "Finance has been updated successfully");
                    else
                        $this->session->set_flashdata('error', "Finance has not been updated");
                    redirect("admin/meta_content/edit/$id");
                } else {
                    $data['edit'] = "edit";
                    // $this->db->join("userdetails U","U.user_id=CU.userId");
                    $udata = get_data("meta_content", array("meta_id" => $id))->row_array();
                    $data = array_merge($data, $udata);
                }
                break;
        }
        $this->parser->parse('admin/meta_content', $data);
    }

//International banking deposit
    function international_depositreq()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $ad_id = $this->session->userdata('id');
        $subId = $this->session->userdata('subId');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $data['result'] = $this->admin_model->international_deposit();
            /*	echo "<pre>"; print_r($data);*/
            /*$data['type']="Processing";*/
            // $data['view']	="View";
            $this->load->view('admin/international_deposit', $data);
        }

    }

    function deposit_confirm($id)
    {

        $result = $this->admin_model->deposit_confirm($id);
        $this->session->set_flashdata('success', "The Processing Successfully completed");
        redirect('admin/international_depositreq', 'refresh');
    }

//International banking withdraw
    function international_withdraw()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        $ad_id = $this->session->userdata('id');
        $subId = $this->session->userdata('subId');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $data['result'] = $this->admin_model->international_withdraw();
            $data['type'] = "Processing";
            $data['view'] = "View";
            $this->load->view('admin/international_withdraw', $data);
        }

    }

    function request_confirm($id)
    {

        $result = $this->admin_model->request_confirm($id);
        $this->session->set_flashdata('success', "request is confirmed");
        redirect('admin/international_withdraw', 'refresh');
    }

    /*function viewwithdraw_details($id)
{

	$sessionvar				=$this->session->userdata('loggeduser');
	$data['admin_logged']	=$this->session->userdata('loggeduser');
	if($sessionvar=="")
	{
		redirect('admin/index','refresh');
	}
	else
	{

		// $userVerifyId	=	$this->session->userdata('userVerifyId');
		$data['row'] = $this->admin_model->get_requestdetail($id);
		$data['display'] = "Display Details";
		$this->load->view('admin/international_withdraw',$data);
	}
}
*/

    function viewwithdraw_details($id)
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {

            // $userVerifyId	=	$this->session->userdata('userVerifyId');
            $data['row'] = $this->admin_model->get_requestdetail($id);
            $data['result'] = $this->admin_model->get_userbankdetails($id);
            $data['userdetails'] = $this->admin_model->get_userpdfdetails($id);

            /*$data['display'] = "Display Details";*/
            $this->load->view('admin/download', $data);
        }
    }


    function trading_fee()
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $row = $this->admin_model->gettrading_fee();
            if ($row) {
                $data['lessthan_20000'] = $row->lessthan_20000;
                $data['lessthan_100000'] = $row->lessthan_100000;
                $data['lessthan_200000'] = $row->lessthan_200000;
                $data['lessthan_400000'] = $row->lessthan_400000;
                $data['lessthan_600000'] = $row->lessthan_600000;
                $data['lessthan_1000000'] = $row->lessthan_1000000;
                $data['lessthan_2000000'] = $row->lessthan_2000000;
                $data['lessthan_4000000'] = $row->lessthan_4000000;
                $data['lessthan_20000000'] = $row->lessthan_20000000;
                $data['greaterthan_20000000'] = $row->greaterthan_20000000;
                $this->load->view('admin/trading_fee', $data);
            }
        }
    }

    function edit_trading_fee()
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $error = "";
            if ($this->input->post('submit')) {
                $this->form_validation->set_rules('lessthan_20000', 'Less than 20,000', 'required');
                $this->form_validation->set_rules('lessthan_100000', 'Less than 1,00,000', 'required');
                $this->form_validation->set_rules('lessthan_200000', 'Less than 2,00,000', 'required');
                $this->form_validation->set_rules('lessthan_400000', 'Less than 4,00,000', 'required');
                $this->form_validation->set_rules('lessthan_600000', 'Less than 6,00,000', 'required');
                $this->form_validation->set_rules('lessthan_1000000', 'Less than 10,00,000', 'required');
                $this->form_validation->set_rules('lessthan_2000000', 'Less than 20,00,000', 'required');
                $this->form_validation->set_rules('lessthan_4000000', 'Less than 40,00,000', 'required');
                $this->form_validation->set_rules('lessthan_20000000', 'Less than 2,00,00,000', 'required');
                $this->form_validation->set_rules('greaterthan_20000000', 'Greater than 2,00,00,000', 'required|numeric');
                $this->form_validation->set_message('required', "%s Required");
                if ($this->form_validation->run() == FALSE) {
                    $row = $this->admin_model->gettrading_fee();
                    $data['lessthan_20000'] = $row->lessthan_20000;
                    $data['lessthan_100000'] = $row->lessthan_100000;
                    $data['lessthan_200000'] = $row->lessthan_200000;
                    $data['lessthan_400000'] = $row->lessthan_400000;
                    $data['lessthan_600000'] = $row->lessthan_600000;
                    $data['lessthan_1000000'] = $row->lessthan_1000000;
                    $data['lessthan_2000000'] = $row->lessthan_2000000;
                    $data['lessthan_4000000'] = $row->lessthan_4000000;
                    $data['lessthan_20000000'] = $row->lessthan_20000000;
                    $data['greaterthan_20000000'] = $row->greaterthan_20000000;
                    // }
                    $this->load->view('admin/trading_fee', $data);
                } else {
                    if ($this->admin_model->edit_tradefee()) {
                        $this->session->set_flashdata('success', "Details has been edited successfully");
                    } else {
                        $this->session->set_flashdata('error', "Details of the Post can't be edited successfully.");
                    }
                    redirect('admin/trading_fee', 'referesh');
                }
            } else {
                redirect('admin/trading_fee', 'referesh');
            }
        }
    }

    function bitgo_control()
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $row = $this->admin_model->bitgo_control();
            if ($row) {
                $data['access_token'] = $row->access_token;
                $data['wallet_passphrase'] = $row->wallet_passphrase;
                $this->load->view('admin/bitgo_control', $data);
            }
        }
    }

    function edit_bitgo_control()
    {
        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        /*$dbvalue = $this->input->post('wallet_passphrase');
		$dbvalue = $this->input->post('wallet_passphrase');

		$formvalue = htmlspecialchars($dbvalue, ENT_COMPAT,"UTF-8");  */

        /*

		$sessionvar=$this->session->userdata('loggeduser');
		$data['admin_logged']=$this->session->userdata('loggeduser');*/
        // echo $a = htmlentities($this->input->post('val'));
        //       $b = html_entity_decode($a);
        // mysql_real_escape_string($this->input->post('val'));
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $error = "";
            if ($this->input->post('submit')) {
                $this->form_validation->set_rules('access_token', 'Token', 'required');
                $this->form_validation->set_rules('wallet_passphrase', 'Wallet Phrase', 'required');
                $this->form_validation->set_message('required', "Required");
                if ($this->form_validation->run() == FALSE) {
                    $row = $this->admin_model->bitgo_control();
                    $data['access_token'] = $row->access_token;
                    $data['wallet_passphrase'] = $row->wallet_passphrase;
                    // }
                    $this->load->view('admin/bitgo_control', $data);
                } else {
                    //echo $c = $this->input->post('wallet_passphrase');exit;
                    if ($this->admin_model->edit_bitgo_control()) {

                        $this->session->set_flashdata('success', "Details has been edited successfully");
                    } else {
                        $this->session->set_flashdata('error', "Details of the Post can't be edited successfully.");
                    }
                    redirect('admin/bitgo_control', 'referesh');
                }
            } else {
                redirect('admin/bitgo_control', 'referesh');
            }
        }
    }

    function feeconfig()
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $row = $this->admin_model->feeconfig();
            if ($row) {
                $data['inational_deposit_fee'] = $row->inational_deposit_fee;
                $data['inational_withdraw_fee'] = $row->inational_withdraw_fee;
                $data['buy_ripple'] = $row->buy_ripple;
                $data['high_withdraw_fee'] = $row->high_withdraw_fee;
                $data['high_deposit_fee'] = $row->high_deposit_fee;
                $data['withdraw_fee_btc'] = $row->withdraw_fee_btc;
                $data['withdraw_fee_ltc'] = $row->withdraw_fee_ltc;
                $data['withdraw_fee_eth'] = $row->withdraw_fee_eth;
                $data['withdraw_fee_wcn'] = $row->withdraw_fee_wcn;
                $data['ripple_deposit'] = $row->ripple_deposit;
                $data['ripple_withdraw'] = $row->ripple_withdraw;
                $this->load->view('admin/feeconfig', $data);
            }
        }
    }

    function edit_feeconfig()
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $error = "";
            if ($this->input->post('submit')) {
                $this->form_validation->set_rules('inational_deposit_fee', 'International Deposit', 'required');
                $this->form_validation->set_rules('inational_withdraw_fee', 'International Withdraw', 'required');
                //$this->form_validation->set_rules('buy_ripple','Buy Ripple', 'required');
                $this->form_validation->set_rules('high_withdraw_fee', 'High Withdraw', 'required');
                $this->form_validation->set_rules('high_deposit_fee', 'High Deposit', 'required');
                $this->form_validation->set_rules('withdraw_fee_btc', 'BTC Withdraw', 'required');
                //$this->form_validation->set_rules('withdraw_fee_ltc','LTC Withdraw', 'required');
                //$this->form_validation->set_rules('withdraw_fee_eth','ETH Withdraw', 'required');
                //$this->form_validation->set_rules('withdraw_fee_wcn','wcn Withdraw', 'required');

                //$this->form_validation->set_rules('ripple_deposit','Ripple Deposit', 'required');
                //$this->form_validation->set_rules('ripple_withdraw','Ripple Withdraw', 'required');
                $this->form_validation->set_message('required', "%s Required");
                if ($this->form_validation->run() == FALSE) {

                    $row = $this->admin_model->feeconfig();
                    $data['inational_deposit_fee'] = $row->inational_deposit_fee;
                    $data['inational_withdraw_fee'] = $row->inational_withdraw_fee;
                    //$data['buy_ripple']=$row->buy_ripple;
                    $data['high_withdraw_fee'] = $row->high_withdraw_fee;
                    $data['high_deposit_fee'] = $row->high_deposit_fee;
                    $data['withdraw_fee_btc'] = $row->withdraw_fee_btc;
                    //$data['withdraw_fee_ltc']=$row->withdraw_fee_ltc;
                    //$data['withdraw_fee_eth']=$row->withdraw_fee_eth;
                    //$data['ripple_deposit']=$row->ripple_deposit;
                    //$data['ripple_withdraw']=$row->ripple_withdraw;
                    $this->load->view('admin/feeconfig', $data);
                } else {

                    if ($this->admin_model->edit_feeconfig()) {
                        $this->session->set_flashdata('success', "Details has been edited successfully");
                    } else {
                        $this->session->set_flashdata('error', "Details of the Post can't be edited successfully.");
                    }
                    redirect('admin/feeconfig', 'referesh');
                }
            } else {
                redirect('admin/feeconfig', 'referesh');
            }
        }
    }
    /*function international_bank()
	{


		$sessionvar=$this->session->userdata('loggeduser');
		$data['admin_logged']=$this->session->userdata('loggeduser');
		if($sessionvar=="")
		{
		redirect('admin/index','refresh');
		}
		else
		{
		$error="";
		if($this->input->post('submit'))
		{
			$this->form_validation->set_rules('acc_number','Account number', 'required');
			$this->form_validation->set_rules('deposit_amount','Deposit amount', 'required');

			$this->form_validation->set_message('required',"%s Required");
		if ($this->form_validation->run() == FALSE)
		{
			$this->load->view('admin/international_deposit',$data);
		}
		else
		{
			if($this->admin_model->submit_bank_deposit())
			{
				$this->session->set_flashdata('success', "Details has been edited successfully");
			}
			else
			{
				$this->session->set_flashdata('error', "Please provide the correct account number.");
			}
				redirect('admin/international_depositreq','referesh');
			}
		}
		else
		{
			redirect('admin/international_depositreq','referesh');
		}
		}
	}
*/
    //Padmashree 23/4/2015
    function bankdetail()
    {
        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        }
        if ($this->input->post('submit')) {
            $this->form_validation->set_rules('account_owner', 'Owner Name', 'required');
            $this->form_validation->set_rules('acc_number', 'Account Number', 'required');
            $this->form_validation->set_rules('bank_name', 'Bank Name', 'required');
            $this->form_validation->set_rules('branch_code', 'Branch Code', 'required');
            $this->form_validation->set_rules('acc_type', 'Account type', 'required');
            $this->form_validation->set_message('required', "%s Required");
            if ($this->form_validation->run() == FALSE) {
                $row = $this->admin_model->bankdetail();
                $data['account_owner'] = $this->input->post('account_owner');
                $data['admin_address'] = $this->input->post('admin_address');
                $data['acc_number'] = $this->input->post('acc_number');
                $data['bank_name'] = $this->input->post('bank_name');
                $data['branch_code'] = $this->input->post('branch_code');
                $data['acc_type'] = $this->input->post('acc_type');
                $data['add'] = "ADD";
                $this->load->view('admin/bankdetail', $data);
            } else {
                if ($this->admin_model->add_bankdetail()) {
                    $this->session->set_flashdata('success', "Details has been Added successfully");
                } else {
                    $this->session->set_flashdata('error', "Details of the Post can't be edited successfully.");
                }
                redirect('admin/bankdetail', 'referesh');
            }
        } else {
            $row = $this->admin_model->bankdetail();

            $data['add'] = "ADD";
            $this->load->view('admin/bankdetail', $data);
        }
    }

    function add_bankdetail()
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $error = "";
            if ($this->input->post('submit')) {
                $this->form_validation->set_rules('account_owner', 'Owner Name', 'required');
                $this->form_validation->set_rules('acc_number', 'Account Number', 'required');
                $this->form_validation->set_rules('bank_name', 'Bank Name', 'required');
                $this->form_validation->set_rules('branch_code', 'Branch Code', 'required');
                $this->form_validation->set_rules('acc_type', 'Account type', 'required');

                /*$this->form_validation->set_rules('admin_address','Address', 'required');
		$this->form_validation->set_rules('admin_city','City', 'required');
		$this->form_validation->set_rules('country','Country', 'required');
		$this->form_validation->set_rules('iban','IBAN', 'required');
		$this->form_validation->set_rules('message','Message', 'required');
		$this->form_validation->set_rules('bank_address','Bank Address', 'required');
		$this->form_validation->set_rules('bank_city','Bank City', 'required');
		$this->form_validation->set_rules('bank_country','Bank Country', 'required');
		$this->form_validation->set_rules('BIC','BIC', 'required');*/
                $this->form_validation->set_message('required', "%s Required");
                if ($this->form_validation->run() == FALSE) {
                    $row = $this->admin_model->bankdetail();

                    $data['account_owner'] = $row->account_owner;
                    $data['admin_address'] = $row->admin_address;
                    //$data['admin_city']=$row->admin_city;
                    //$data['country']=$row->country;
                    $data['acc_number'] = $row->acc_number;
                    //$data['iban']=$row->iban;
                    //$data['message']=$row->message;
                    $data['bank_name'] = $row->bank_name;
                    //$data['bank_address']=$row->bank_address;
                    //$data['bank_city']=$row->bank_city;
                    //$data['bank_country']=$row->bank_country;
                    //$data['BIC']=$row->BIC;
                    $data['branch_code'] = $row->branch_code;
                    $data['acc_type'] = $row->acc_type;
                    $data['add'] = "ADD";
                    $this->load->view('admin/bankdetail', $data);
                    //$this->load->view('admin/bankdetail',$data);
                } else {
                    if ($this->admin_model->add_bankdetail()) {
                        $this->session->set_flashdata('success', "Details has been edited successfully");
                    } else {
                        $this->session->set_flashdata('error', "Details of the Post can't be edited successfully.");
                    }
                    redirect('admin/bankdetail', 'referesh');
                }
            } else {
                redirect('admin/bankdetail', 'referesh');
            }
        }
    }


    function twofactorstatus($mode, $id = "")
    {

        ini_set('display_errors', "1");
        $this->load->library("parser");
        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');


        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        }
        //$uid=insep_decode($id);
        $uid = $id;
        switch ($mode) {
            case "view":
                $data['result'] = get_data("userdetails", array("status" => "active"))->result_array();
                break;
            case 'status':
                if ($data = get_data("userdetails", array("user_id" => $uid))->row()) {
                    if ($data->randcode == "disable") {
                        $ran = "Enable";
                        update_data("userdetails", array("randcode" => "enable"), array("user_id" => $uid));
                    } else {
                        $ran = "Disable";
                        update_data("userdetails", array("randcode" => "disable"), array("user_id" => $uid));
                    }
                    $this->session->set_flashdata("success", "Twofactor authentication status has been " . $ran . " successfully!!!");
                    redirect('admin/twofactorstatus/view');
                }
                break;

        }
        //$this->parser->parse('admin/twofactorstatus',$data);
        $this->load->view('admin/twofactorstatus', $data);
    }

    function coinprofit($mode)
    {

        ini_set('display_errors', "1");
        $this->load->library("parser");
        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        }
        //$uid=insep_decode($id);
        switch ($mode) {
            case "view":
                $this->db->order_by('theft_id', 'desc');
                $data['result'] = get_data("coin_theft")->result_array();
                break;

        }
        //$this->parser->parse('admin/twofactorstatus',$data);
        $this->load->view('admin/coinprofit', $data);
    }

    function chart_data_month()
    {


        $end_date = date("Y-m-d H:i:s");
        $start_date = date('Y-m-d H:i:s', strtotime($end_date . ' - 30 days'));
        //$start_date = '20-07-2012';
        //$end_date = '22-07-2012';
        $start = strtotime($start_date);
        $end = strtotime($end_date);
        $interval = 1;
        $out = '';
        $int = 24 * 60 * 60 * $interval;
        for ($i = $start; $i <= $end; $i += $int) {
            $test[] = date('Y-m-d H:i:s', $i);
        }
        $chart = "";
        foreach ($test as $taken) {
            //echo $taken;
            $exp = explode(' ', $taken);
            $curdate = $exp[0];
            $time = $exp[1];
            // echo $taken;
            $datetime = strtotime($taken) * 1000;
            //echo $datetime = $curdate." ".$time;*
            //echo $date = 1147651200000;
            //1147651200000
            //echo $tidme = date("m/d/Y h:i:s",$date);

            $value = $this->admin_model->get_chart_details($taken, $interval);

            if ($value == '') {
                $value = 0;
            }


            $chart .= '[' . $datetime . ',' . $value . '],';
        }

        echo "[" . trim($chart, ",") . "]";
    }

    function chart_data_yearly()
    {


        $end_date = date("Y-m-d H:i:s");
        $start_date = date('Y-m-d H:i:s', strtotime($end_date . ' - 1 years'));
        //$start_date = '20-07-2012';
        //$end_date = '22-07-2012';
        $start = strtotime($start_date);
        $end = strtotime($end_date);
        $interval = 1;
        $out = '';
        $int = 30 * 24 * 60 * 60 * $interval;
        for ($i = $start; $i <= $end; $i += $int) {
            $test[] = date('Y-m-d H:i:s', $i);
        }
        $chart = "";
        foreach ($test as $taken) {
            //echo $taken;
            $exp = explode(' ', $taken);
            $curdate = $exp[0];
            $time = $exp[1];
            // echo $taken;
            $datetime = strtotime($taken) * 1000;
            //echo $datetime = $curdate." ".$time;*
            //echo $date = 1147651200000;
            //1147651200000
            //echo $tidme = date("m/d/Y h:i:s",$date);

            $value = $this->admin_model->get_chart_details($taken, 'month');

            if ($value == '') {
                $value = 0;
            }


            $chart .= '[' . $datetime . ',' . $value . '],';
        }

        echo "[" . trim($chart, ",") . "]";
    }


    function chart_data_month1()
    {


        $end_date = date("Y-m-d H:i:s");
        $start_date = date('Y-m-d H:i:s', strtotime($end_date . ' - 30 days'));
        //$start_date = '20-07-2012';
        //$end_date = '22-07-2012';
        $start = strtotime($start_date);
        $end = strtotime($end_date);
        $interval = 1;
        $out = '';
        $int = 24 * 60 * 60 * $interval;
        for ($i = $start; $i <= $end; $i += $int) {
            $test[] = date('Y-m-d H:i:s', $i);
        }
        $chart = "";
        foreach ($test as $taken) {
            //echo $taken;
            $exp = explode(' ', $taken);
            $curdate = $exp[0];
            $time = $exp[1];
            // echo $taken;
            $datetime = strtotime($taken) * 1000;
            //echo $datetime = $curdate." ".$time;*
            //echo $date = 1147651200000;
            //1147651200000
            //echo $tidme = date("m/d/Y h:i:s",$date);

            $value = $this->admin_model->get_chart_details1($taken, $interval);

            if ($value == '') {
                $value = 0;
            }


            $chart .= '[' . $datetime . ',' . $value . '],';
        }

        echo "[" . trim($chart, ",") . "]";
    }

    function chart_data_yearly1()
    {


        $end_date = date("Y-m-d H:i:s");
        $start_date = date('Y-m-d H:i:s', strtotime($end_date . ' - 1 years'));
        //$start_date = '20-07-2012';
        //$end_date = '22-07-2012';
        $start = strtotime($start_date);
        $end = strtotime($end_date);
        $interval = 1;
        $out = '';
        $int = 30 * 24 * 60 * 60 * $interval;
        for ($i = $start; $i <= $end; $i += $int) {
            $test[] = date('Y-m-d H:i:s', $i);
        }
        $chart = "";
        foreach ($test as $taken) {
            //echo $taken;
            $exp = explode(' ', $taken);
            $curdate = $exp[0];
            $time = $exp[1];
            // echo $taken;
            $datetime = strtotime($taken) * 1000;
            //echo $datetime = $curdate." ".$time;*
            //echo $date = 1147651200000;
            //1147651200000
            //echo $tidme = date("m/d/Y h:i:s",$date);

            $value = $this->admin_model->get_chart_details1($taken, 'month');

            if ($value == '') {
                $value = 0;
            }


            $chart .= '[' . $datetime . ',' . $value . '],';
        }

        echo "[" . trim($chart, ",") . "]";
    }

    function chart()
    {


        $this->load->view('admin/chart');
    }

    function chart_dataone()
    {


        $this->load->view('admin/chart_dataone');
    }

    function chart_datayearly()
    {


        $this->load->view('admin/yearchart');
    }

    function chart_datamonth()
    {


        $this->load->view('admin/monthdata');
    }

    function user_data()
    {


        $end_date = date("Y-m-d");
        $start_date = date('Y-m-d', strtotime($end_date . ' - 30 days'));
        //$start_date = '20-07-2012';
        //$end_date = '22-07-2012';
        $start = strtotime($start_date);
        $end = strtotime($end_date);
        $interval = 1;
        $out = '';
        $int = 24 * 60 * 60 * $interval;
        for ($i = $start; $i <= $end; $i += $int) {
            $test[] = date('Y-m-d', $i);
        }
        $chart = "";
        foreach ($test as $taken) {
            //echo $taken;
            $exp = explode(' ', $taken);
            $curdate = $exp[0];
            // $time 	= $exp[1];
            // echo $taken;
            $datetime = strtotime($taken) * 1000;
            //echo $datetime = $curdate." ".$time;*
            //echo $date = 1147651200000;
            //1147651200000
            //echo $tidme = date("m/d/Y h:i:s",$date);

            $value = $this->admin_model->get_userdata($taken, $interval);

            if ($value == '') {
                $value = 0;
            }


            $chart .= '[' . $datetime . ',' . $value . '],';
        }

        echo "[" . trim($chart, ",") . "]";
    }

    function chart_data()
    {


        $end_date = date("Y-m-d H:i:s");
        $start_date = date('Y-m-d H:i:s', strtotime($end_date . ' - 24 hours'));
        $start = strtotime($start_date);
        $end = strtotime($end_date);
        $interval = 0.5;

        $int = 60 * 60 * $interval;
        for ($i = $start; $i <= $end; $i += $int) {

            $test[] = date('d-m-Y H:i:s', $i);
        }
        $chart = "";
        foreach ($test as $taken) {
            //echo $taken;
            $exp = explode(' ', $taken);
            $curdate = $exp[0];
            $time = $exp[1];
            // echo $taken;
            $datetime = strtotime($taken) * 1000;
            //echo $datetime = $curdate." ".$time;*
            //echo $date = 1147651200000;
            //1147651200000
            //echo $tidme = date("m/d/Y h:i:s",$date);

            $value = $this->admin_model->get_chart_details($taken, $interval);

            if ($value == '') {
                $value = 0;
            }


            $chart .= '[' . $datetime . ',' . $value . '],';

        }

        echo "[" . trim($chart, ",") . "]";

    }

    function chart1()
    {
        $this->load->view('admin/chart1');
    }

    function chart_dataone1()
    {
        $this->load->view('admin/chart_dataone1');
    }

    function chart_datayearly1()
    {
        $this->load->view('admin/yearchart1');
    }

    function chart_datamonth1()
    {
        $this->load->view('admin/monthdata1');
    }

    function user_data1()
    {


        $end_date = date("Y-m-d");
        $start_date = date('Y-m-d', strtotime($end_date . ' - 30 days'));
        //$start_date = '20-07-2012';
        //$end_date = '22-07-2012';
        $start = strtotime($start_date);
        $end = strtotime($end_date);
        $interval = 1;
        $out = '';
        $int = 24 * 60 * 60 * $interval;
        for ($i = $start; $i <= $end; $i += $int) {
            $test[] = date('Y-m-d', $i);
        }
        $chart = "";
        foreach ($test as $taken) {
            //echo $taken;
            $exp = explode(' ', $taken);
            $curdate = $exp[0];
            // $time 	= $exp[1];
            // echo $taken;
            $datetime = strtotime($taken) * 1000;
            //echo $datetime = $curdate." ".$time;*
            //echo $date = 1147651200000;
            //1147651200000
            //echo $tidme = date("m/d/Y h:i:s",$date);

            $value = $this->admin_model->get_userdata($taken, $interval);

            if ($value == '') {
                $value = 0;
            }


            $chart .= '[' . $datetime . ',' . $value . '],';
        }

        echo "[" . trim($chart, ",") . "]";
    }

    function chart_data1()
    {


        $end_date = date("Y-m-d H:i:s");
        $start_date = date('Y-m-d H:i:s', strtotime($end_date . ' - 24 hours'));
        $start = strtotime($start_date);
        $end = strtotime($end_date);
        $interval = 0.5;

        $int = 60 * 60 * $interval;
        for ($i = $start; $i <= $end; $i += $int) {

            $test[] = date('d-m-Y H:i:s', $i);
        }
        $chart = "";
        foreach ($test as $taken) {
            //echo $taken;
            $exp = explode(' ', $taken);
            $curdate = $exp[0];
            $time = $exp[1];
            // echo $taken;
            $datetime = strtotime($taken) * 1000;
            //echo $datetime = $curdate." ".$time;*
            //echo $date = 1147651200000;
            //1147651200000
            //echo $tidme = date("m/d/Y h:i:s",$date);

            $value = $this->admin_model->get_chart_details1($taken, $interval);

            if ($value == '') {
                $value = 0;
            }


            $chart .= '[' . $datetime . ',' . $value . '],';

        }

        echo "[" . trim($chart, ",") . "]";

    }

    function edit_bankdetails($id)
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $this->session->set_userdata('accid', $id);
            redirect('admin/edit_bank_details', 'referesh');
        }
    }

    function edit_bank_details()
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $id = $this->session->userdata('accid');
            $fetchdata = $this->admin_model->getbank($id);
            if ($fetchdata) {
                $query = $this->admin_model->getbank($id);
                foreach ($query as $row) {
                    $data['account_id'] = $row->acc_id;
                    $data['account_owner'] = $row->account_owner;
                    $data['admin_address'] = $row->admin_address;
                    $data['admin_city'] = $row->admin_city;
                    $data['country'] = $row->country;
                    $data['acc_number'] = $row->acc_number;
                    $data['iban'] = $row->iban;
                    $data['message'] = $row->message;
                    $data['bank_name'] = $row->bank_name;
                    $data['bank_address'] = $row->bank_address;
                    $data['bank_city'] = $row->bank_city;
                    $data['bank_country'] = $row->bank_country;
                    $data['BIC'] = $row->BIC;
                    $data['branch_code'] = $row->branch_code;
                    $data['acc_type'] = $row->acc_type;
                }
                $data['edit'] = "Edit";
                $this->load->view('admin/bankdetail', $data);
            }
        }
    }

    function edit_bankdetail()
    {

        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            $error = "";
            if ($this->input->post('submit')) {


                $id = $this->input->post('id');

                if ($this->admin_model->edit_blankdetails($id)) {
                    $this->session->set_flashdata('success', "Details of the Post  " . $title . "  has been edited successfully");
                } else {
                    $this->session->set_flashdata('error', "Details of the Post can't be edited successfully.");
                }
                redirect('admin/managedetails', 'referesh');
            }
        }
    }

    function delete_bank($id)
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if ($this->admin_model->remove_bankdetails($id)) {
                $this->session->set_flashdata('success', "Post has been deleted");
                redirect('admin/managedetails', 'referesh');
            }
        }
    }

    function withdrawresquestform()
    {
        $this->load->view('admin/withdrawrequestform');
    }


    function ExportCSV()
    {
        $this->load->dbutil();
        $this->load->helper('file');
        $this->load->helper('download');
        $delimiter = ",";
        $newline = "\r\n";
        $filename = "withdraw.csv";
        $query = "SELECT `b`.`username`,`a`.`currency`,`a`.`amount`,`a`.`status` FROM (`international_withdraw` AS a) JOIN  (`userdetails` AS b) ON  `a`.`user_id`=`b`.`user_id`  where `a`.`status`='pending' OR `a`.`status`='finished' and `a`.`currency`='EUR' ";
        $result = $this->db->query($query);
        $data = $this->dbutil->csv_from_result($result, $delimiter, $newline);
        force_download($filename, $data);
    }


    function ExportdepositCSV()
    {
        $this->load->dbutil();
        $this->load->helper('file');
        $this->load->helper('download');
        $delimiter = ",";
        $newline = "\r\n";
        $filename = "deposit.csv";
        $query = "SELECT `b`.`username`,`b`.`account_no`,`a`.`currency`,`a`.`amount`,`a`.`status` FROM (`deposit_payment` AS a) JOIN  (`userdetails` AS b) ON  `a`.`user_id`=`b`.`user_id`  where  `a`.`currency`='EUR'  ";
        $result = $this->db->query($query);
        $data = $this->dbutil->csv_from_result($result, $delimiter, $newline);
        force_download($filename, $data);
    }


    function ExportuserdetailsCSV()
    {
        $this->load->dbutil();
        $this->load->helper('file');
        $this->load->helper('download');
        $delimiter = ",";
        $newline = "\r\n";
        $filename = "user.csv";
        $query = "SELECT emailid,username FROM userdetails";
        $result = $this->db->query($query);
        $data = $this->dbutil->csv_from_result($result, $delimiter, $newline);
        force_download($filename, $data);
    }

    function testbigo()
    {
        $this->load->view('admin/testbigo');
    }

    function delete_userverification($id)
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if ($this->admin_model->remove_userverificationdetails($id)) {
                $this->session->set_flashdata('success', "user verification has been deleted");
                redirect('admin/user_verification', 'referesh');
            }
        }

    }

    function adminconfirmation()
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {
            if ($this->admin_model->adminconfirmationmodel()) {
                $this->session->set_flashdata('success', "user verification has been Confirmed");
                redirect('admin/userdetails', 'referesh');
            }
        }

    }


    function chart_data2()
    {


        $end_date = date("Y-m-d H:i:s");
        $start_date = date('Y-m-d H:i:s', strtotime($end_date . ' - 24 hours'));
        $start = strtotime($start_date);
        $end = strtotime($end_date);
        $interval = 0.5;

        $int = 60 * 60 * $interval;
        for ($i = $start; $i <= $end; $i += $int) {

            $test[] = date('d-m-Y H:i:s', $i);
        }
        $chart = "";
        foreach ($test as $taken) {
            //echo $taken;
            $exp = explode(' ', $taken);
            $curdate = $exp[0];
            $time = $exp[1];
            // echo $taken;
            $datetime = strtotime($taken) * 1000;
            //echo $datetime = $curdate." ".$time;*
            //echo $date = 1147651200000;
            //1147651200000
            //echo $tidme = date("m/d/Y h:i:s",$date);

            $value = $this->admin_model->get_chart_details2($taken, $interval);

            if ($value == '') {
                $value = 0;
            }


            $chart .= '[' . $datetime . ',' . $value . '],';

        }

        echo "[" . trim($chart, ",") . "]";

    }

    function chart2()
    {
        $this->load->view('admin/chart2');
    }

    function chart_dataone2()
    {
        $this->load->view('admin/chart_dataone2');
    }

    function chart_datayearly2()
    {
        $this->load->view('admin/yearchart2');
    }

    function chart_datamonth2()
    {
        $this->load->view('admin/monthdata2');
    }


    function chart_data_month2()
    {


        $end_date = date("Y-m-d H:i:s");
        $start_date = date('Y-m-d H:i:s', strtotime($end_date . ' - 30 days'));
        //$start_date = '20-07-2012';
        //$end_date = '22-07-2012';
        $start = strtotime($start_date);
        $end = strtotime($end_date);
        $interval = 1;
        $out = '';
        $int = 24 * 60 * 60 * $interval;
        for ($i = $start; $i <= $end; $i += $int) {
            $test[] = date('Y-m-d H:i:s', $i);
        }
        $chart = "";
        foreach ($test as $taken) {
            //echo $taken;
            $exp = explode(' ', $taken);
            $curdate = $exp[0];
            $time = $exp[1];
            // echo $taken;
            $datetime = strtotime($taken) * 1000;
            //echo $datetime = $curdate." ".$time;*
            //echo $date = 1147651200000;
            //1147651200000
            //echo $tidme = date("m/d/Y h:i:s",$date);

            $value = $this->admin_model->get_chart_details2($taken, $interval);

            if ($value == '') {
                $value = 0;
            }


            $chart .= '[' . $datetime . ',' . $value . '],';
        }

        echo "[" . trim($chart, ",") . "]";
    }

    function chart_data_yearly2()
    {


        $end_date = date("Y-m-d H:i:s");
        $start_date = date('Y-m-d H:i:s', strtotime($end_date . ' - 1 years'));
        //$start_date = '20-07-2012';
        //$end_date = '22-07-2012';
        $start = strtotime($start_date);
        $end = strtotime($end_date);
        $interval = 1;
        $out = '';
        $int = 30 * 24 * 60 * 60 * $interval;
        for ($i = $start; $i <= $end; $i += $int) {
            $test[] = date('Y-m-d H:i:s', $i);
        }
        $chart = "";
        foreach ($test as $taken) {
            //echo $taken;
            $exp = explode(' ', $taken);
            $curdate = $exp[0];
            $time = $exp[1];
            // echo $taken;
            $datetime = strtotime($taken) * 1000;
            //echo $datetime = $curdate." ".$time;*
            //echo $date = 1147651200000;
            //1147651200000
            //echo $tidme = date("m/d/Y h:i:s",$date);

            $value = $this->admin_model->get_chart_details2($taken, 'month');

            if ($value == '') {
                $value = 0;
            }


            $chart .= '[' . $datetime . ',' . $value . '],';
        }

        echo "[" . trim($chart, ",") . "]";
    }


    function chart_data3()
    {


        $end_date = date("Y-m-d H:i:s");
        $start_date = date('Y-m-d H:i:s', strtotime($end_date . ' - 24 hours'));
        $start = strtotime($start_date);
        $end = strtotime($end_date);
        $interval = 0.5;

        $int = 60 * 60 * $interval;
        for ($i = $start; $i <= $end; $i += $int) {

            $test[] = date('d-m-Y H:i:s', $i);
        }
        $chart = "";
        foreach ($test as $taken) {
            //echo $taken;
            $exp = explode(' ', $taken);
            $curdate = $exp[0];
            $time = $exp[1];
            // echo $taken;
            $datetime = strtotime($taken) * 1000;
            //echo $datetime = $curdate." ".$time;*
            //echo $date = 1147651200000;
            //1147651200000
            //echo $tidme = date("m/d/Y h:i:s",$date);

            $value = $this->admin_model->get_chart_details3($taken, $interval);

            if ($value == '') {
                $value = 0;
            }


            $chart .= '[' . $datetime . ',' . $value . '],';

        }

        echo "[" . trim($chart, ",") . "]";

    }

    function chart3()
    {
        $this->load->view('admin/chart3');
    }

    function chart_dataone3()
    {
        $this->load->view('admin/chart_dataone3');
    }

    function chart_datayearly3()
    {
        $this->load->view('admin/yearchart3');
    }

    function chart_datamonth3()
    {
        $this->load->view('admin/monthdata3');
    }


    function chart_data_month3()
    {


        $end_date = date("Y-m-d H:i:s");
        $start_date = date('Y-m-d H:i:s', strtotime($end_date . ' - 30 days'));
        //$start_date = '20-07-2012';
        //$end_date = '22-07-2012';
        $start = strtotime($start_date);
        $end = strtotime($end_date);
        $interval = 1;
        $out = '';
        $int = 24 * 60 * 60 * $interval;
        for ($i = $start; $i <= $end; $i += $int) {
            $test[] = date('Y-m-d H:i:s', $i);
        }
        $chart = "";
        foreach ($test as $taken) {
            //echo $taken;
            $exp = explode(' ', $taken);
            $curdate = $exp[0];
            $time = $exp[1];
            // echo $taken;
            $datetime = strtotime($taken) * 1000;
            //echo $datetime = $curdate." ".$time;*
            //echo $date = 1147651200000;
            //1147651200000
            //echo $tidme = date("m/d/Y h:i:s",$date);

            $value = $this->admin_model->get_chart_details3($taken, $interval);

            if ($value == '') {
                $value = 0;
            }


            $chart .= '[' . $datetime . ',' . $value . '],';
        }

        echo "[" . trim($chart, ",") . "]";
    }

    function chart_data_yearly3()
    {


        $end_date = date("Y-m-d H:i:s");
        $start_date = date('Y-m-d H:i:s', strtotime($end_date . ' - 1 years'));
        //$start_date = '20-07-2012';
        //$end_date = '22-07-2012';
        $start = strtotime($start_date);
        $end = strtotime($end_date);
        $interval = 1;
        $out = '';
        $int = 30 * 24 * 60 * 60 * $interval;
        for ($i = $start; $i <= $end; $i += $int) {
            $test[] = date('Y-m-d H:i:s', $i);
        }
        $chart = "";
        foreach ($test as $taken) {
            //echo $taken;
            $exp = explode(' ', $taken);
            $curdate = $exp[0];
            $time = $exp[1];
            // echo $taken;
            $datetime = strtotime($taken) * 1000;
            //echo $datetime = $curdate." ".$time;*
            //echo $date = 1147651200000;
            //1147651200000
            //echo $tidme = date("m/d/Y h:i:s",$date);

            $value = $this->admin_model->get_chart_details3($taken, 'month');

            if ($value == '') {
                $value = 0;
            }


            $chart .= '[' . $datetime . ',' . $value . '],';
        }

        echo "[" . trim($chart, ",") . "]";
    }


    function verifiedstatus($id)
    {


        $sessionvar = $this->session->userdata('loggeduser');
        $data['admin_logged'] = $this->session->userdata('loggeduser');
        if ($sessionvar == "") {
            redirect('admin/index', 'refresh');
        } else {

            $result = $this->admin_model->userverficationdetails($id);

            redirect('admin/view_userdetails/' . $id, 'refresh');


        }
    }


//admin_settings
}

?>
