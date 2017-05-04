;'use strict';

$(document).ready(function() {

  $("#bandetails_form").validate({
    rules:{ bankname:{required:true},
    accounttype:{required:true},
    iban:{required:true,digits:true},

  },
  submitHandler: function (form)
  {
    var data = $('#bandetails_form').serialize();
    $.ajax({
      type: 'POST',
      data: data,
      dataType: 'json',
      url: base_url + 'user/bank_details_update',
      success: function(output) {
        // see discussion https://forum.codeigniter.com/thread-61278.html
        if (output.csrfTokenName) {
          $('input[name=' + output.csrfTokenName + ']').val(output.csrfHash);
        }
        $("#bandetails_success").show();
        $("#bandetails_success").html(output.msg);
      }
    });
  }

});

  $(".alphavalid").blur(function(evt) {
    var inputtxt = $(this).val();
    var letters = /^[A-Za-z]+$/;
    if(inputtxt.match(letters))
    {
      return true;
    }
    else
    {
      $(this).val('');
      return false;
    }
  });

  $(".numvalid").keypress(function(evt) {

    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  });

});