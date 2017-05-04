;'use strict';

var registerBtn = $('#registerBtn'),
login_form = $('#login_form'),
errorMessage = $('#error_message');

// disable this till google recapatcha loaded
registerBtn.val('Loading...');
registerBtn.attr('disabled', true);

$(document).ready(function () {

    $.validator.addMethod("pwcheck", function (value) {
        return /[\@\#\$\%\^\&\*\(\)\_\+\!]/.test(value) && /[a-z]/.test(value) && /[0-9]/.test(value) && /[A-Z]/.test(value)
    }, "Provide at least one upper case , one lower case , one digit and one special character");

    /* register */
    $("#registering").validate({
        rules: {
            firstname: {required: true, minlength: 2},
            lastname: {required: true, minlength: 2},
            email: {required: true, email: true},
            password1: {
                required: true,
                pwcheck: true,
                minlength: 8,
            },
            password2: {required: true, equalTo: "#password1"},
            recaptcha: {required: true,},
            terms: {required: true}
        }
    });

    function refreshCaptcha() {
        var img = document.images['captchaimg'];
        img.src = img.src.substring(0, img.src.lastIndexOf("?")) + "?rand=" + Math.random() * 1000;
    }
});