; 'use strict'; 

var deleteuploadsBTn = $('.deleteuploadsBTn');

deleteuploadsBTn.click(function(){
	window.fieldName = $(this).data('fieldname');
	window.primaryKey = $(this).data('primary-key');
	window.csrf_gt = $(this).data('csrf-gt');
	window.delteBtn = $(this);
	window.imageID = $('#'+$(this).data('image-id'));
	alertify.prompt( 'Reason', 'Why you removed this data', '', clickPromptOk, clickPromptCancel);
});

function clickPromptOk(evt, value) { 

	if (value) {
		// save refuse uploads reason on database
		$.ajax({
			url: base_url+'admin/clear_uploads_data',
			type: 'POST',
			data: {refuse_reason: value,id: window.primaryKey,csrf_gt:window.csrf_gt,field_name:window.fieldName},
		})
		.done(function() {
			alertify.success('Data saved');
			window.imageID.after('<p class="text-danger"><b>Refused</b> ('+value+')</p>');
			window.imageID.remove();
			window.delteBtn.remove();
			window.location.reload();
		})
		.fail(function() {
			console.log("error");
		});
	}
}

function clickPromptCancel(){
	alertify.error('Process Canceled');
}