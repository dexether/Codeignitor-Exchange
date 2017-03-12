;'use strict';
$(document).ready(function() {	
	$("#password_form").validate({
		rules:{ oldpassword:{required:true},
		newpassword:{required:true},
		newpassword1:{required:true,equalTo:"#newpassword"}
	},

	submitHandler: function (form)
	{
		var data = $('#password_form').serialize();
		$.ajax({
			type:'POST',
			data:data,
			url: base_url+'user/change_pass',
			success:function(output) {
				var output = output.trim(); 
				$("#password_success").show();
				$("#password_success").html(output); 
                          //alert(output);

                            //$("#oldpassword").val("");
                            //$("#newpassword").val("");
                            //$("#newpassword1").val("");
                        }
                    });
	}
    });
});