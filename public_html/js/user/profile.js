;'use strict';
$(document).ready(function() {
    $("#personal_form").validate({
        rules: {
            username: {required:true},
            account_no: {required:true,digits:true,minlength:12,maxlength:12},
            firstname: {required:true,nodigits:true},
            lastname: {required:true},
            id_no: {required:true},
            cellno: {required:true,digits:true,minlength:10},
            alt_cellno: {required:true,digits:true,minlength:10},
            street1: {required:true},
            city: {required:true},
            state: {required:true},
            country: {required:true},
            code: {required:true},
        },
        submitHandler: function (form)
        {
            var data = {};
            $('#personal_form input, #personal_form select').each(function() {
                data[$(this).attr('name')] = $(this).val()
            });
         // $('#personal_form').serialize();
            $.ajaxFileUpload({
                type: 'POST',
                dataType: 'json',
                data: data,
                secureuri: false,
                fileElementId: 'profile_picture',
                url: base_url+'user/profile_update',
                success: function(data, status) {
                    if (data.csrf_name && data.csrf_hash) {
                        $('#personal_form input[name=' + data.csrf_name + ']').val(data.csrf_hash);
                    }
                    if (data.profilepicture !== undefined) {
                        $('#profile_picture_remove_reason_block').hide();
                        if (data.profilepicture === '') {
                            $('#profile_picture_img_block').hide();
                        } else {
                            $('#profilepicture_delete_btn').data('profilepicture', data.profilepicture);
                            $('#profile_picture_img').attr('src', '/tools/show_profile_picture/' + data.profilepicture);
                            $('#profile_picture_img_block').show();
                        }
                    }
                    $("#personal_success").html(data.msg).show();
                }
            });
        }
    });


    var removePictureBtn;

    $('#profilepicture_block').on('click', '#profilepicture_delete_btn', function(e) {
        e.preventDefault();
        removePictureBtn = $(this);
        alertify.confirm('Remove profile picture dialog',
                         'Do you really wish to remove profile picture ?',
                         removeProfilePicture,
                         cancelRemoveProfilePicture)
                .set('labels', {ok: 'Yes', cancel: 'No'});
    });


    function removeProfilePicture() {
        var csrf_token_name = removePictureBtn.data('csrf'),
            profilepicture = removePictureBtn.data('profilepicture'),
            csrf_token_hash = $('#personal_form input[name=' + csrf_token_name + ']').val(),
            data = {};
        data[csrf_token_name] = csrf_token_hash;

        $.ajax({
            url: '/user/remove_profile_picture/' + profilepicture,
            type: 'post',
            data: data,
            dataType: 'json',
            success: function(data) {
                if (data.csrf_name && data.csrf_hash) {
                    $('#personal_form input[name=' + data.csrf_name + ']').val(data.csrf_hash);
                }
                if (data.profilepicture !== undefined && data.profilepicture === '') {
                    $('#profile_picture_remove_reason_block').hide();
                    $('#profile_picture_img_block').hide();
                }
                if (data.status === 'ok') {
                    alertify.success(data.msg);
                } else {
                    alertify.error(data.msg);
                }
                // $("#personal_success").html(data.msg).show();
            }
        })
    }


    function cancelRemoveProfilePicture() {
        alertify.error('Process Cancelled');
    }


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