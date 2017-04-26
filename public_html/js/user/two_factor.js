function show_tfa()
  {
    $("#active_tfa").click(function(){
      $("#deactivate").hide();
      $("#activate1").show();
    });
  }

  $("#activate_form").validate({
    rules:{ one_code:{required:true,digits:true},
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
