function show_tfa()
  {
    $("#active_tfa").click(function(){
      $("#deactivate").hide();
      $("#activate1").show();
    });
  }

  $("#activate_form").validate({
    rules:{ one_code:{required:true,digits:true},
  },
  submitHandler: function (form)
  {
    var data = $('#activate_form').serialize();
    $.ajax({
      type:'POST',
      data:data,
      url: base_url + 'user/enable_tfa',
      success:function(output) {
        var output  = output.trim();
        if(output=="Enable")
        {
          $("#activate").hide(); 
          $("#tfa_error").show();
          $("#tfa_error").html("Your TFA Activated");
          window.location.href= base_url + "user/two_factor";
          $("#active_tfa").show();
        }
        else
        { 
          $("#tfa_error").show();
          $("#tfa_error").html("Invalid TFA Code");
          $("#activate").hide();
        }

      }
    });
  }
});
  
  function tfa()
  {

    $.ajax({                                  
      type: "POST",   
      url: base_url + "user/disable_tfa" ,         
      success: function(output)
      {   
        window.location.reload();
      }
    });
    return false;
  }
