;'use strict';
$(document).ready(function() {	

	$.validator.addMethod("regex", function(value, element, regexpr) {          
	    return regexpr.test(value);
	}, 'Provide at least 1 upper case, 1 lower case, 1 digit and 1 special character.');

	$("#password_form").validate({
		rules:{ oldpassword:{required:true},
		newpassword:{required:true, minlength: 8,regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]/},
		newpassword1:{required:true,equalTo:"#newpassword"}
	},


	// DELETE IN PRODUCTION
	/*
	submitHandler: function (form)
	{
		var data = $('#password_form').serialize();
		$.ajax({
			type:'POST',
			data:data,
			url: base_url+'user/change_password',
			success:function(output) {
				var output = output.trim(); 
				$("#password_success").show();
				$("#password_success").html(output); 
				//window.location = base_url+'user/logout';
			}
		});
	}*/
});
});