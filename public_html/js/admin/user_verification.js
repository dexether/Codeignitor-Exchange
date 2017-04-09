; 'use strict'; 

var deletePassportBTn = $('#deletePassportBTn');

deletePassportBTn.click(function(){
	alertify.prompt( 'Reason', 'Why you removed this data', '', clickPromptOk, clickPromptCancel);
});

function clickPromptOk(evt, value) { 
	if (value) {
		// save refuse passport reason on database
		$.ajax({
			url: base_url+'admin/clear_passport_data',
			type: 'POST',
			data: {refuse_reason: value,id: deletePassportBTn.data('primary-key'),csrf_gt:deletePassportBTn.data('csrf-gt')},
		})
		.done(function() {
			alertify.success('Data saved');
			$('#passportImg').after('<p class="text-danger"><b>Refused</b> ('+value+')</p>');
			$('#passportImg').remove();
			$('#deletePassportBTn').remove();
		})
		.fail(function() {
			console.log("error");
		});
	}
}

function clickPromptCancel(){
	alertify.error('Process Canceled');
}