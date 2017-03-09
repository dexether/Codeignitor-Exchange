<?php  defined('BASEPATH') OR exit('No direct script access allowed'); ?>
<div class="cls_inn_bg">
  <div class="container">
    <div class="row">
      <div class="col-md-12 col-sm-12">
        <nav class="navbar navbar-default  cbp-af-header">
          <div class="container pad-no">
            <div class="navbar-header">
              <button type="button" class="collapsed navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button>
                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav"> 
                    <li class="dropdown  <?php if($uri=="tradeorder") { echo 'active'; } ?> " ><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"> Trade   </a>
                    <ul class="dropdown-menu">

                        <li role="separator" class="divider"></li>
                        <li><a href="javascript:;" onclick="testing('EUR_NLG');">EUR_NLG</a></li>
                        <li role="separator" class="divider"></li>
                        <li><a href="javascript:;" onclick="testing('GTS_NLG');">GTS_NLG</a></li> 

                    </ul>
              </li>

                <li <?php if($uri=="transactions") { ?> class="active" <?php } ?> ><a href="<?php echo base_url();?>gulden/transactions"> My Trade History   </a></li>
               

                <li class="dropdown  <?php if($uri=="deposit" || $uri=="withdrawal" || $uri=="loginhistory") { echo 'active'; } ?> " ><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"> Transaction   </a>
                 <ul class="dropdown-menu">
		            <li><a href="<?php echo base_url(); ?>funds/deposit">Deposits</a></li>
		            <li role="separator" class="divider"></li>
		            <li><a href="<?php echo base_url(); ?>funds/withdrawal">Withdrawals</a></li> 
		            <li role="separator" class="divider"></li>
		            <li><a href="<?php echo base_url(); ?>user/loginhistory">Login History</a></li>
		          </ul>
		          </li>
                <li <?php if($uri=="withdraw_coin") { ?> class="active" <?php } ?>><a href="<?php echo base_url();?>funds/withdraw_coin"> Withdraw Funds/Coins    </a></li>
                <li <?php if($uri=="deposit_coin") { ?> class="active" <?php } ?> ><a href="<?php echo base_url();?>funds/deposit_coin"> Deposit Funds/Coins   </a></li>
                <li <?php if($uri=="two_factor" || $uri=="email_info" || $uri=="change_password" || $uri=="api_info" || $uri=="profile" || $uri=="bank_info") { ?> class="active" <?php } ?>><a href="<?php echo base_url(); ?>user/profile"> Profile   </a></li>

              </ul>
             
            </div>
          </div>
          </div>
        </nav>
      </div>
            </div>
    </div>
  </div>