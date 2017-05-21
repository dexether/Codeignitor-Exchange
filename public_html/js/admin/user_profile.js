$(document).ready(function() {

    var delBtn;

    $('#profilepicture_delete_btn').on('click', function(e) {
        e.preventDefault();
        delBtn = $(this);

        alertify.prompt('Profile picture deleting dialog',
                        'Enter the reason for profile picture deleting',
                        '',
                        removeProfilePicture,
                        cancelRemoveProfilePicture);
    });


    function removeProfilePicture(e, val) {
        val = $.trim(val);
        if (!val) {
            alertify.error('You should enter the reason');
            e.cancel = true;
            return;
        }

        var profilepicture = delBtn.data('profilepicture'),
            csrf_token_name = delBtn.data('csrf'),
            csrf_token_hash = $('#crudForm input[name=' + csrf_token_name + ']').val(),
            data = {
                profilepicture_remove_reason: val
            };
        data[csrf_token_name] = csrf_token_hash;

        $.ajax({
            url: '/user/remove_profile_picture/' + profilepicture,
            type: 'post',
            data: data,
            dataType: 'json',
            success: function(data) {
                if (data.csrf_name && data.csrf_hash) {
                    $('#crudForm input[name=' + data.csrf_name + ']').val(data.csrf_hash);
                }
                if (data.profilepicture !== undefined && data.profilepicture === '') {
                    $('#profile_picture_img_block').hide();
                    $('#profile_picture_empty_block').show();
                }
                if (data.status === 'ok') {
                    alertify.success(data.msg);
                } else {
                    alertify.error(data.msg);
                }
            }
        });
    }

    function cancelRemoveProfilePicture() {
        alertify.error('Process Cancelled');
    }

});