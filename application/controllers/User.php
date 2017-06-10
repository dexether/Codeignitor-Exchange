<?php defined('BASEPATH') OR exit('No direct script access allowed');

class User extends MY_Controller
{
    public $data;

    public function __construct()
    {
        parent::__construct();
        $this->load->model('mdl_user');
        $this->data['menu'] = $this->load->view('markets/v_menu', array('uri' => $this->uri->segment(2)), true);
    }

    function index()
    {
        redirect('/');
    }

    function register()
    {
        $password_regex = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#.])[A-Za-z\d$@$!%*?&#.]{8,}/';

        $this->form_validation->set_rules('email', 'Email', 'trim|required|min_length[3]|max_length[50]|valid_email|is_unique[users.email]');
        $this->form_validation->set_message('users.email', 'Email already exist please try to ' . anchor('login', 'login', 'class="text-info"') . ' or register with new email');
        $this->form_validation->set_rules('firstname', 'Firstname', 'trim|required|min_length[2]|max_length[12]');
        $this->form_validation->set_rules('password1', 'Password', "trim|required|min_length[8]|max_length[30]|matches[password2]|regex_match[{$password_regex}]");
        $this->form_validation->set_rules('password2', 'Confirm Password', 'trim|required|min_length[8]|max_length[30]|matches[password1]');
        $this->form_validation->set_rules('recaptcha', 'Recaptcha', "trim|required|callback_recaptcha");
        $this->form_validation->set_rules('terms', 'Terms', "trim|required");

        if ($this->form_validation->run() == true) {
            $vars['success'] = '<div class="alert alert-success"><i class="glyphicon glyphicon-ok"></i> User Registered Successfully. <br/>Please check your email and click activate link</div>';
            $vars['success'] .= '<meta http-equiv="refresh" content="3;url=/">';
            $this->mdl_user->add_user();
        } else {
            $vars['alert'] = validation_errors('<p class="alert alert-danger">', '</p>');
        }

        // assets
        $this->l_asset->add('js/user/register.js', 'js');

        $this->data['content'] = $this->load->view('user/v_register', $vars, true);
        view($this->data, 'site');
    }

    public function recaptcha()
    {
        $captcha_code = isset($_SESSION['6_letters_code']) ? $_SESSION['6_letters_code'] : '';
        $recaptcha = $this->input->post('recaptcha', true);

        if ($captcha_code != $recaptcha) {
            $this->form_validation->set_message('recaptcha', "recaptcha not matched, please try again");
            return false;
        } else {
            return true;
        }
    }

    function login()
    {
        $this->form_validation->set_rules('email', 'Email', 'trim|required|min_length[5]|max_length[50]|valid_email');
        $this->form_validation->set_rules('password', 'Password', 'trim|required|min_length[8]|max_length[30]');

        if ($this->form_validation->run() == true) {
            $login = $this->mdl_user->check_login();

            if ($login == "invalid") {
                $error_message = "Your email or password is invalid";
            } elseif ($login == "blocked") {
                $error_message = "You are blocked, please contact us";
            } elseif ($login == "deactive") {
                $error_message = "Please Activate Your Account";
            } elseif ($login == "enable") {
                redirect('tfa/display');
            } elseif ($login == "success") {
                redirect('markets/EUR-NLG');
            } else {
                $error_message = "Whoops, something happened, please try again";
            }

            $this->session->set_flashdata('error_message', $error_message);
            redirect('login');
        } else {
            $error_message = '';
        }

        $vars = [];
        $this->l_asset->add('plugins/alertifyjs/css/alertify.min.css', 'css');
        $this->l_asset->add('plugins/alertifyjs/css/themes/default.min.css', 'css');
        $this->l_asset->add('plugins/alertifyjs/alertify.min.js', 'js');
        $this->l_asset->add('js/user/login.js', 'js');
        $this->data['content'] = $this->load->view('user/v_login', $vars, true);
        view($this->data, 'site');
    }

    // returns login status
    function login_status()
    {
        $res_login = $this->mdl_user->check_login_details();
        echo $res_login;
    }

    /** just for test */
    public function preview_email()
    {
        $this->load->view('template/emails/v_header');
        $this->load->view('template/emails/v_forgot_password');
        $this->load->view('template/emails/v_footer');
    }

    public function user_verification($verifier = null)
    {

        $data = array();
        if (!is_null($verifier)) {

            $data['status'] = $this->mdl_user->verification($verifier);
            $this->data['content'] = $this->load->view('site/v_verified', $data, true);

            view($this->data, 'site');
        }
    }

    public function profile()
    {
        if (!$this->session->user_id > 0) {
            redirect('/');
        }

        $this->l_asset->add('plugins/alertifyjs/css/alertify.min.css','css');
        $this->l_asset->add('plugins/alertifyjs/css/themes/default.min.css','css');
        $this->l_asset->add('plugins/alertifyjs/alertify.min.js','js');
        $this->l_asset->add('js/ajaxfileupload.js', 'js');
        $this->l_asset->add('js/user/profile.js', 'js');
        $this->load->model('mdl_country');
        $vars['country_detail'] = $this->mdl_country->get_all();
        $vars['profile'] = $this->mdl_user->profile_details();
        $vars['csrf_token_name'] = $this->security->get_csrf_token_name();

        $this->data['content'] = $this->load->view('user/v_profile', $vars, true);

        view($this->data);
    }


    private function get_balance()
    {
        $data = array();
        $this->load->model('mdl_balance');
        $data['EUR'] = $this->mdl_balance->fetch_user_balance_by_id($this->session->user_id, 'EUR');
        $data['NLG'] = $this->mdl_balance->fetch_user_balance_by_id($this->session->user_id, 'NLG');
        $data['GTS'] = $this->mdl_balance->fetch_user_balance_by_id($this->session->user_id, 'GTS');

        return $this->load->view('user/v_balance', $data, true);
    }


    function bank_info()
    {
        if (!$this->session->user_id > 0) {
            redirect('/');
        }

        $customer_email_id = $this->session->userdata('customer_email_id');
        $customer_user_id = $this->session->user_id;
        if (($customer_email_id == "") && ($customer_user_id == "")) {
            redirect('user/login', 'refresh');
        } else {
            $this->l_asset->add('js/user/' . __FUNCTION__ . '.js', 'js');
            $this->load->model('mdl_user_bank_details');
            $vars['bank'] = $this->mdl_user_bank_details->acccount_details();
            $this->data['content'] = $this->load->view('user/v_bank_info', $vars, true);

            view($this->data);
        }
    }


    function bank_details_update()
    {
        $this->load->model('mdl_user_bank_details');
        $customer_email_id = $this->session->userdata('customer_email_id');
        $id = $this->session->user_id;
        $data = [
        'bank_name' => $this->input->post('bankname'),
        'bank_account' => $this->input->post('accounttype'),
        'inter_banking_code' => $this->input->post('iban'),
        'verification_code' => $this->input->post('verification_code'),
        'routing_number' => $this->input->post('routing_number'),
        'message' => 'Your bank details need to be approved.'
        ];
        $this->mdl_user_bank_details->bank_details_update($data, $id);
    }

    function change_password()
    {
        if (!$this->session->user_id > 0) {
            redirect('/');
        }
        $password_regex = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#.])[A-Za-z\d$@$!%*?&#.]{8,}/';
        $password = (isset($_POST['newpassword'])?$_POST['newpassword']:'');
        $vars = [];

        $this->load->model('mdl_balance', 'balance');
        $this->l_asset->add('js/user/change_password.js', 'js');
        $this->form_validation->set_rules('oldpassword', 'Old Password', 'required|trim');
        $this->form_validation->set_rules('newpassword', 'New Password', 'trim|required|min_length[8]|max_length[30]');

        if (!preg_match($password_regex, $password) && $this->form_validation->run() == true) {
            $vars['alert'] = '<p class="alert alert-danger">Password not in valid format</p>';
            $this->data['content'] = $this->load->view('user/v_change_password', $vars, true);
            view($this->data);
            return;
        } else {
            if ($this->form_validation->run() == true) {
                $return = $this->mdl_user->change_password();
                if (!$return) {
                    $vars['alert'] = '<p class="alert alert-danger">Wrong Old Password</p>';
                } else {
                    $vars['alert'] = '<p class="alert alert-success">Success</p>';
                }
            } else {
                $vars['alert'] = validation_errors('<p class="alert alert-danger">', '</p>');
            }
        }
        $this->data['content'] = $this->load->view('user/v_change_password', $vars, true);
        view($this->data);
    }

    function trade_verification()
    {

        $customer_email_id = $this->session->userdata('customer_email_id');
        $customer_user_id = $this->session->user_id;
        if (($customer_email_id == "") && ($customer_user_id == "")) {
            redirect('/', 'refresh');
        } else {
            $this->load->model('mdl_user_verification', 'user_verification');

            if (isset($_POST['submit'])) {

                if ($_FILES['passport']['name']) {
                    $this->user_verification->upload('passport');
                }

                if ($_FILES['selfie']['name']) {
                    $this->user_verification->upload('selfie');
                }

                if ($_FILES['backcard']['name']) {
                    $this->user_verification->upload('backcard');
                }

                redirect('user/trade_verification', 'refresh');
            }

            $vars['bank'] = $this->user_verification->get($customer_user_id);

            $this->data['content'] = $this->load->view('user/v_' . __FUNCTION__ . '.php', $vars, true);
            view($this->data);
        }
    }

    protected function save_profile_picture()
    {
        $config['upload_path'] = '../application/uploads/';
        $config['allowed_types'] = 'gif|jpg|png';
        $config['max_size']     = '300';
        $config['max_width'] = '1024';
        $config['max_height'] = '768';
        $config['encrypt_name'] = true;

        $this->load->library('upload', $config);

        return !$this->upload->do_upload('profilepicture') ?
            [
                'status' => 'error',
                'msg' => $this->upload->display_errors()
            ] :
            [
                'status' => 'ok',
                'data' => $this->upload->data()
            ];
    }


    public function logout()
    {
        $this->session->sess_destroy();
        redirect('/');
    }


    protected function make_json_result($status, $msg, $params = array())
    {
        $result = [
            'status'        => $status,
            'msg'           => $msg,
            'csrf_name'     => $this->security->get_csrf_token_name(),
            'csrf_hash'     => $this->security->get_csrf_hash()
        ];
        foreach($params as $k => $v) {
            $result[$k] = $v;
        };
        return json_encode($result);
    }


    function profile_update()
    {

        $id = $this->session->user_id;
        $data = array(
            'username' => $this->input->post('username'),
            'firstname' => $this->input->post('firstname'),
            'lastname' => $this->input->post('lastname'),
            'identity_no' => $this->input->post('id_no'),
            'cellno' => $this->input->post('cellno'),
            'alt_cellno' => $this->input->post('alt_cellno'),
            'street1' => $this->input->post('street1'),
            'street2' => $this->input->post('street2'),
            'city' => $this->input->post('city'),
            'state1' => $this->input->post('state'),
            'country1' => $this->input->post('country'),
            'zipcode' => $this->input->post('code'),
            'postal_line1' => $this->input->post('line1'),
            'postal_line2' => $this->input->post('line2'),
            'postal_city' => $this->input->post('postal_city'),
            'postal_state' => $this->input->post('postal_state'),
            'postal_country' => $this->input->post('postal_country'),
            'postal_code' => $this->input->post('postal_code')
        );

        $params = [];
        $current_profilepicture_path = '';
        if (isset($_FILES['profilepicture']) &&
           ($_FILES['profilepicture']['error'] !== 4)) {

            $result = $this->save_profile_picture();
            if ($result['status'] === 'error') {
                echo $this->make_json_result('error', strip_tags($result['msg']));
                return;
            }
            $data['profilepicture']      = $result['data']['raw_name'];
            $data['profilepicture_path'] = $result['data']['full_path'];
            $data['profilepicture_mime'] = $result['data']['file_type'];
            $data['profilepicture_remove_reason'] = '';
            $params['profilepicture']    = $data['profilepicture'];

            $current_data = $this->mdl_user->profile_details();
            if ($current_data && $current_data->profilepicture_path) {
                $current_profilepicture_path = $current_data->profilepicture_path;
            }
        }


        $result = $this->mdl_user->profile_update($data, $id);
        if ($result) {
            if ($current_profilepicture_path) {
                @unlink($current_profilepicture_path);
            }
            $status = 'ok';
            $msg = "Your Personal Information Successfully updated";
        } else {
            $status = 'error';
            $msg = "Error in Updation";
        }
        echo $this->make_json_result($status, $msg, $params);
    }


    public function remove_profile_picture($profilepicture = '')
    {
        if (!$profilepicture) {
            echo $this->make_json_result('error', 'Profile picture parameter is empty!');
            exit;
        }

        $user_id = $this->session->user_id;
        if (!$user_id) {
            echo $this->make_json_result('error', 'Only logged-in user has ability to remove profile picture!');
            exit;
        }

        $user = $this->mdl_user->get_by_profilepicture_id($profilepicture);
        if (!$user) {
            echo $this->make_json_result('error', 'Profile picture ID is not found!');
            exit;
        }

        $is_admin = is_admin();

        if ($user->id !== $user_id && !$is_admin) {
            echo $this->make_json_result('error', 'You have no rights to remove profile image!');
            exit;
        }

        $profilepicture_remove_reason = $this->input->post('profilepicture_remove_reason', true);
        $profilepicture_remove_reason = !$profilepicture_remove_reason ? '' : $profilepicture_remove_reason;

        // only admin is allowed to set profile picture remove reason
        if ($profilepicture_remove_reason && !$is_admin) {
            echo $this->make_json_result('error', 'You have no rights to set profile picture removing reason!');
            exit;
        }


        $params = [];
        if ($user->profilepicture_path) {
            @unlink($user->profilepicture_path);
            $data = [
                'profilepicture' => '',
                'profilepicture_path' => '',
                'profilepicture_mime' => ''
            ];
            if ($profilepicture_remove_reason) {
                $data['profilepicture_remove_reason'] = $profilepicture_remove_reason;
            }
            $this->mdl_user->profile_update($data, $user->id);
            $params['profilepicture'] = ''; // sign of removed profile picture
            $this->session->profile_picture = FALSE ;
        }

        echo $this->make_json_result('ok', 'Profile picture has been removed successfully', $params);
        exit;
    }

    function two_factor()
    {
        $this->load->model('mdl_user', 'user');
        $this->l_asset->add('js/user/two_factor.js', 'js');
        $customer_email_id = $this->session->userdata('customer_email_id');
        $customer_user_id = $this->session->user_id;
        if (($customer_email_id == "") && ($customer_user_id == "")) {
            redirect('/', 'refresh');
        } else {
            $user_result = $this->user->user_check_tfa();
            $user_secret = $this->user->get_secret($customer_user_id);
            if ($user_result == "enable" || $user_secret != "") {
                $secret_code = $this->user->get_secret($customer_user_id);
                $data['secret_code'] = $secret_code;

                require_once APPPATH . 'libraries/google/GoogleAuthenticator.php';
                $ga = new PHPGangsta_GoogleAuthenticator();
                $data['url'] = $ga->getQRCodeGoogleUrl('gulden', $secret_code);
            } else {

                $result = $this->user->get_tfacode();
                if ($result) {
                    $data['secret_code'] = $result['secret'];
                    $data['onecode'] = $result['oneCode'];
                    $data['url'] = $result['qrCodeUrl'];
                } else {
                    $data['secret_code'] = "";
                    $data['onecode'] = "";
                    $data['url'] = "";
                }
            }

            $data['user_details'] = $this->user->get_userstatus($this->session->user_id);
            $this->data['content'] = $this->get_balance(); // load view
            $this->data['content'] = $this->load->view('user/v_two_factor', $data, TRUE); // append view
            view($this->data);
        }
    }

    function enable_tfa()
    {
        $this->load->model('mdl_user');
        // this should be check TFA
        // in the backend TFA is enabled.
        // on the front TFA is checked against the value that is stored in the database.

    	$this->form_validation->set_rules('secret_code', 'Secret code', 'trim|required');
    	$this->form_validation->set_rules('one_code', 'Code', 'trim|required|numeric');

    	if ($this->form_validation->run() == true) {
         $result = $this->mdl_user->enable_tfa();
    		if($result === "Enable"){
    			$this->session->set_flashdata('success', "Your TFA Activated");
    		}else{
    			$this->session->set_flashdata('error', "Invalid TFA Code");
    		}
    	} else {
    		$this->session->set_flashdata('error', validation_errors());
    	}

    	redirect('user/two_factor','refresh');
    }
    

    function disable_tfa()
    {
        $this->load->model('mdl_user');
        $result = $this->mdl_user->disable_tfa();
    	if($result){
    	   $this->session->set_flashdata('success', 'tfa disabled');
    	}else{
    	   $this->session->set_flashdata('error', 'some error happen');
    	}
    	redirect('user/two_factor','refresh');
    }

    // to view forgot password page
    function forget(){

        $this->form_validation->set_error_delimiters('<p class="alert alert-danger">','</p>');
        $this->form_validation->set_rules('forgetemail', 'Email', 'trim|required|min_length[3]|max_length[50]|valid_email');

        if ($this->form_validation->run() == true) {
            $result = $this->mdl_user->forgot_passmail();
            if($result == 'success'){
                $vars['alert'] = '<div class="alert alert-success"><i class="glyphicon glyphicon-ok"></i> User Registered Successfully. <br/>Please check your email and click activate link</div>';
                $vars['alert'] .= '<meta http-equiv="refresh" content="3;url=/">';
            }else{
                $vars['alert'] = '<div class="alert alert-danger"><i class="glyphicon glyphicon-close"></i> Sorry this email not exist</div>';
            }
        }else{
            $vars = [];
        }

        $this->l_asset->add('js/user/forget.js', 'js');
        $this->data['content'] = $this->load->view('user/v_forget',$vars,true);
        view($this->data,'site');
    }

    // from mail to function
    function forgot($id) //step 2
    {
        $this->session->set_userdata('forgotid', $id);
        redirect('reset_password', 'refresh');
    }

    function reset_password()
    {
        $data['id'] = $this->session->userdata('forgotid');
        $this->load->view('front/resetpassword', $data);
    }

    // reset password form
    function ajaxreset_password()
    {
        $result = $this->gulden_model->reset_password_model();
        if ($result) {
            echo "success";
        } else {
            echo "failure";
        }
    }

}
