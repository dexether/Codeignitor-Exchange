;'use strict';

var resetBtn = $('#resetBtn');

// disable this till google recapatcha loaded
resetBtn.text('Loading...');
resetBtn.attr('disabled', true);

$(document).ready(function () {

    resetBtn.text('reset password');
    resetBtn.removeAttr('disabled');

    // forgot password
    $('#forget_form').validate({
        rules: {
            forgetemail: {
                required: true,
                email: true
            },
        }
    });

});