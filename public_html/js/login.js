$(document).ready(function(){
  /* login */
  $("#login_form").validate({
    rules:{
     clientid:{ required:true},
     password:{ required:true},
     googleRechapatcha:{required:true}
  },
  errorPlacement: function (error, element) {
    if (element.val() === "") {
      element.attr("placeholder", error.text());
      element.addClass("place_holder_error");
    } else {
     element.removeClass("place_holder_error");
   }
 },
 submitHandler: function (form) {
  var data = $('#login_form').serialize();
  $.ajax({
    type:'POST',
    data:data,
    url:'/user/login',
    success:function(output) {
      var output = output.trim();
      var googleRechapatcha = $('#googleRechapatcha');
      if(output=="invalid")
      {
       $("#error_message").html("Your email or password is invalid");
     }
     else if(output=="blocked")
     {
      $("#error_message").html("You are blocked, please contact us");
    }
    else if(output=="deactive")
    {
      $("#error_message").html("Please Activate Your Account");
    }
    else if(output=="enable")
    {
      $("#myModal_tfa").modal('show');
      $("#login").modal('hide');
    }else if (googleRechapatcha.length){
       $("#error_message").html("Please confirm you not robot");
    }
    else if(output=="success")
    {
      location.href='/markets/EUR-NLG'
    }
    else
    {
      $("#error_message").html("Whoops, something happened, please try again");
    }
  }
});
}
});


  /* register */
  $.validator.addMethod("pwcheck", function (value) {
    return /[\@\#\$\%\^\&\*\(\)\_\+\!]/.test(value) && /[a-z]/.test(value) && /[0-9]/.test(value) && /[A-Z]/.test(value)
  },"Provide at least one upper case , one lower case , one digit and one special character");


  $("#registering").validate({
    rules:{
      firstname:{required:true,minlength: 2},
      lastname:{required:true,minlength: 2},

      email:{required:true,email:true},

      password1:{
        required:true,
        pwcheck: true,
        minlength:8,
      },

      password2:{required:true,equalTo:"#password1"},

      recaptcha:{required:true,},

      terms:{required:true}
    },
    submitHandler: function (form) {
      var data = $('#registering').serialize();
      $.ajax({
        type:'POST',
        data:data,
        url:'user/registration',
        success:function(output) { 
         var output = output.trim();

         if(output=="email")
         { 
          $("#register_error").show();
          $("#register_success").hide();
          $("#errorMessage").html("This e-mail address already exists");
        }
        else if(output=="success")
        { 
          $("#register_error").hide();
          $("#successMessage").html("Please Check Your Email and Activate Your Account");
          $("#register_success").show();
                            //$('#register').modal('hide');
                            $('#register').hide();
                            $('#registering')[0].reset();
                            //setTimeout(hide, 2000);
                          }
                          else if(output=="recaptcha")
                          { 
                            $("#register_error").show();
                            $("#register_success").hide();
                            $("#errorMessage").html("The captcha code does not match!");
                          //$('#registering')[0].reset();
                          //refreshCaptcha();

                        }
                        $('html, body').animate({ scrollTop: 400 }, 'slow');
                      },
                      beforeSend:function()
                      {
                        $("#login_loading").show();
                      }
                    });
      return false;
    }

  });
});

// forgot password
$('#forget_form').validate({
  rules: {

    forgetemail: {
      required: true,
      email:true

    },


  },
  submitHandler: function (form) {
    var data = $('#forget_form').serialize();
    $.ajax({
      type:'POST',
      data:data,
      url: base_url+'user/ajax_forgot_form',
      success:function(output) {
        var output= output.trim();
        if(output=="success"){
          $("#login_error").hide();
          $("#login_success").show();
          $("#login_loading").hide();
          $('#forget_form')[0].reset();
        }else{
          $("#login_loading").hide();
          $("#login_error").show();
          $("#login_error").html("Invalid Email");
          $('#forget_form')[0].reset();
        }
      },
      beforeSend:function()
      {
        $("#login_loading").show();
      }
    });
    return false;
  } 

});

function refreshCaptcha()
{
  var img = document.images['captchaimg'];
  img.src = img.src.substring(0,img.src.lastIndexOf("?"))+"?rand="+Math.random()*1000;
}

function forget()
{
  $('#forget').modal('show');
  $('#login').modal('hide');
}
