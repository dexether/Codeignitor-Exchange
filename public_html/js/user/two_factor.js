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
  
