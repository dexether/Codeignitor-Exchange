<?php $uri = $this->uri->segment(2); ?> 

<div class="col-md-3 col-sm-4">
	<div class="cls_sidebr_sec">
		<ul class="list-unstyled">
			<li <?php if($uri=="two_factor") { ?> class="active" <?php } ?>> <a href="<?php echo base_url();?>gulden/two_factor"> 2 Factor Authentification </a></li> 
			<!-- <li <?php if($uri=="email_info") { ?> class="active" <?php } ?> > <a href="<?php echo base_url();?>gulden/email_info"> Update Email address </a></li>  -->
			<li <?php if($uri=="change_password") { ?> class="active" <?php } ?>> <a href="<?php echo base_url();?>user/change_password"> change password</a></li> 
			<!-- <li <?php if($uri=="api_info") { ?> class="active" <?php } ?>> <a href="<?php echo base_url();?>gulden/api_info"> api information </a></li>  -->
			<li <?php if($uri=="profile") { ?> class="active" <?php } ?>> <a href="<?php echo base_url();?>user/profile"> my profile </a></li> 
			<li <?php if($uri=="bank_info") { ?> class="active" <?php } ?>> <a href="<?php echo base_url();?>user/bank_info" class=""> bank details </a></li> 
			<li <?php if($uri=="trade_verification") { ?> class="active" <?php } ?>> <a href="<?php echo base_url();?>user/trade_verification" class=""> Trade verification </a></li> 
		</ul>
	</div>
</div>