$(document).ready(function() {
   $('#profilepicture_delete_btn').on('click', function(e) {
        e.preventDefault();
        var profilepicture = $(this).data('profilepicture'),
            csrf_token_name = $(this).data('csrf'),
            csrf_token_hash = $('#crudForm input[name=' + csrf_token_name + ']').val(),
            data = {};
        data[csrf_token_name] = csrf_token_hash;

        $.ajax({
            url: '/user/remove_profile_picture/' + profilepicture,
            type: 'post',
            data: data,
            dataType: 'json',
            success: function(data) {

                console.log('data', data);

                if (data.csrf_name && data.csrf_hash) {
                    $('#crudForm input[name=' + data.csrf_name + ']').val(data.csrf_hash);
                }

                if (data.profilepicture !== undefined && data.profilepicture === '') {
//                    $('#profile_picture_img_block').hide();
                }
                if (data.status === 'ok') {
                    alert(data.msg);
//                    alertify.success(data.msg);
                } else {
                    alert(data.msg);
//                    alertify.error(data.msg);
                }
            }
        });
   });
});