;'use strict';

var loginBtn = $('#loginBtn'),
    login_form = $('#login_form'),
    errorMessage = $('#error_message');

// disable this till google recapatcha loaded
loginBtn.val('Loading...');
loginBtn.attr('disabled', true);

$(document).ready(function () {

    $.validator.addMethod("pwcheck", function (value) {
        return /[\@\#\$\%\^\&\*\(\)\_\+\!]/.test(value) && /[a-z]/.test(value) && /[0-9]/.test(value) && /[A-Z]/.test(value)
    }, "Provide at least one upper case , one lower case , one digit and one special character");

    loginBtn.val('Login');
    loginBtn.removeAttr('disabled');

    loginBtn.click(function () {
        loginBtn.val('Loading...');
        loginBtn.attr('disabled', true);
        var response = grecaptcha.getResponse();
        if (response.length == 0) {
            //recaptcha failed validation
            alertify.alert("Gulden Trader Alert: ", "please check I'm not a robot box");
            loginBtn.val('Login');
            loginBtn.removeAttr('disabled');
            return false;
        } else {
            $('#error_message').html('');
            loginBtn.val('Loading...');
            login_form.submit();
        }
    });

    /* login */
    $('#login_form').validate({
        rules: {
            email: {required: true, email: true},
            //pwcheck disabled - reason: reset password doesnt have 1uppercase 1lowercase 1number and 1special-char for now  
            password: {required: true/*, pwcheck: true*/},
            googleRechapatcha: {required: true}
        }
    });

});

// forgot password
$('#forget_form').validate({
    rules: {
        forgetemail: {
            required: true,
            email: true
        },
    },
    submitHandler: function (form) {
        var data = $('#forget_form').serialize();
        $.ajax({
            type: 'POST',
            data: data,
            url: base_url + 'user/ajax_forgot_form',
            success: function (output) {
                var output = output.trim();
                if (output == "success") {
                    $("#login_error").hide();
                    $("#login_success").show();
                    $("#login_loading").hide();
                    $('#forget_form')[0].reset();
                } else {
                    $("#login_loading").hide();
                    $("#login_error").show();
                    $("#login_error").html("Invalid Email");
                    $('#forget_form')[0].reset();
                }
            },
            beforeSend: function () {
                $("#login_loading").show();
            }
        });
        return false;
    }
});

function refreshCaptcha() {
    var img = document.images['captchaimg'];
    img.src = img.src.substring(0, img.src.lastIndexOf("?")) + "?rand=" + Math.random() * 1000;
}

function forget() {
    $('#forget').modal('show');
    $('#login').modal('hide');
}