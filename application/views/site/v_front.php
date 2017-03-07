<?php defined('BASEPATH') OR exit('No direct script access allowed');



?>
  <div class="cls_hea_sec"></div>

  <div class="cls_banner_con">
  <div class="container">
  <div class="col-md-4 col-sm-6 col-md-offset-2">
  <div class="cls_blu_bg">
  <h4> EUR - NLG <span> <img src="<?php echo base_url(); ?>images/up_arrow.png" alt=""> <?php echo (isset($buy_rate_eur)?$buy_rate_eur:''); ?>  </span></h4>
  
  </div>
  </div>
   <div class="col-md-4 col-sm-6">
   <div class="cls_blu_bg">
  <h4>GTS - NLG <span> <img src="<?php echo base_url(); ?>images/down_arrow.png" alt=""><?php echo (isset($buy_rate_gts)?$buy_rate_gts:''); ?> </span></h4>
  
  </div>
  </div>
    
  </div>
  </div>
  
  <div class="cls_comm_bg">
  <div class="container">
  <div class="row">
  <div class="col-lg-10 col-sm-12 col-lg-offset-1 col-md-10 col-sm-12 col-md-offset-0">
      <?php if(isset($chart)) echo $chart;?>
  
  </div>
  </div>
  </div>
  </div>
  <?php if(isset($trade_history)) echo $trade_history; ?>
  
<script src="//cdn.anychart.com/csv-data/csco-daily.js"></script>
<div class="cls_start_bg">
<div class="container">
<div class="col-md-7 col-sm-7 col-lg-7">
    <div class="cls_tra_us">  Start Trading with Us </div>
</div>
 
   <div class="col-md-4 col-lg-3 col-sm-5">
  <ul class="list-inline list-unstyled cls_top_login cls_mar_topd">
      <li><a href="#" data-toggle="modal" data-target="#login"> Login </a> </li>
       <li><a href="#" class="active" data-toggle="modal" data-target="#register"> Register </a> </li>
       </ul>
  </div>
  </div>
  
  
  </div>