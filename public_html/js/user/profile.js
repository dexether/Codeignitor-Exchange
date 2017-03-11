;'use strict';
$(document).ready(function() {
  $("#personal_form").validate({
    rules:{ username:{required:true},
    account_no:{required:true,digits:true,minlength:12,maxlength:12},
    firstname:{required:true,nodigits:true},
    lastname:{required:true},
    id_no:{required:true},
    cellno:{required:true,digits:true,minlength:10},
    alt_cellno:{required:true,digits:true,minlength:10},
    street1:{required:true},
    city:{required:true},
    state:{required:true},
    country:{required:true},
    code:{required:true},
  },
  submitHandler: function (form)
  {
    var data = $('#personal_form').serialize();
    $.ajax({
      type:'POST',
      data:data,
      url: base_url+'gulden/profile_update',
      success:function(output) {
        $("#personal_success").show();
        $("#personal_success").html(output);
                            //$("#email").val("");
                          }
                        });
  }

});
  $(".numvalid").keypress(function(e) { 
    if(e.which >= 58 || e.shiftKey || e.which == 43 || e.which == 45 || e.which == 42 || e.which == 47)  {
      e.preventDefault();
    }
    if(e.which == 46 && $(this).val().indexOf('.') != -1) {
      this.value = '' ;
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

  jQuery.validator.addMethod("nodigits", function(value, element) {
    return this.optional( element ) || /^[a-zA-Z]/.test( value );
  }, 'Please enter a characters only.');

});