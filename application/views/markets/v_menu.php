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
                    <li class="dropdown  <?php if($uri=="markets") { echo 'active'; } ?> " ><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"> Markets   </a>
                    <ul class="dropdown-menu">

                        <li role="separator" class="divider"></li>
                        <li><a href="/markets/EUR-NLG">EUR-NLG</a></li>
                        <li role="separator" class="divider"></li>
                        <li><a href="/markets/GTS-NLG" >GTS-NLG</a></li> 

                    </ul>
              </li>

               <li <?php if($uri=="transactions") { ?> class="active" <?php } ?> ><a href="<?php echo base_url();?>market/history"> My Trade History   </a></li>
               

<!--                 <li class="dropdown  <?php if($uri=="deposit" || $uri=="withdrawal" || $uri=="loginhistory") { echo 'active'; } ?> " ><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"> Transaction   </a>
                 <ul class="dropdown-menu">
		            <li><a href="<?php echo base_url(); ?>funds/deposit">Deposits</a></li>
		            <li role="separator" class="divider"></li>
		            <li><a href="<?php echo base_url(); ?>funds/withdrawal">Withdrawals</a></li> 
		            <li role="separator" class="divider"></li>
		            <li><a href="<?php echo base_url(); ?>user/loginhistory">Login History</a></li>
		          </ul>
		          </li>-->
                <li <?php if($uri=="withdraw") { ?> class="active" <?php } ?>><a href="<?php echo base_url();?>funds/withdraw"> Withdraw Funds/Coins    </a></li>
                <li <?php if($uri=="deposit") { ?> class="active" <?php } ?> ><a href="<?php echo base_url();?>funds/deposit"> Deposit Funds/Coins   </a></li>

              </ul>
             
            </div>
          </div>
          </div>
        </nav>
      </div>
            </div>
    </div>
  </div>