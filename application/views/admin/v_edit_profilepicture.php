<div id="profile_picture_img_block" <?php echo $imgStyle;?>>
    <img id="profilepicture_img" src="<?php echo $imgUrl;?>"
         class="img-responsive">
    <div style="margin-top:10px;">
        <a id="profilepicture_delete_btn" class="btn btn-danger"
           data-csrf="<?php echo $csrf_token_name; ?>"
           data-profilepicture="<?php echo $profilepicture;?>">
           Delete profile picture
        </a>
    </div>
</div>
<div id="profile_picture_empty_block" <?php echo $emptyStyle;?>>
   #No image loaded#
</div>
