<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>AdminLTE 2</title>
	<!-- Tell the browser to be responsive to screen width -->
	<meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
	<!-- Bootstrap 3.3.6 -->
	<link rel="stylesheet" href="<?php echo base_url('adminLTE/bootstrap/css/bootstrap.min.css') ?>">
	<!-- Font Awesome -->
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css">
	<!-- Ionicons -->
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css">
	<!-- Theme style -->
	<link rel="stylesheet" href="<?php echo base_url('adminLTE/dist/css/AdminLTE.min.css') ?>">
    <!-- AdminLTE Skins. Choose a skin from the css/skins
    folder instead of downloading all of them to reduce the load. -->
    <link rel="stylesheet" href="<?php echo base_url('adminLTE/dist/css/skins/_all-skins.min.css') ?>">
    <!-- iCheck -->
    <link rel="stylesheet" href="<?php echo base_url('adminLTE/plugins/iCheck/flat/blue.css') ?>">
    <!-- Date Picker -->
    <link rel="stylesheet" href="<?php echo base_url('adminLTE/plugins/datepicker/datepicker3.css') ?>">
    <!-- Daterange picker -->
    <link rel="stylesheet" href="<?php echo base_url('adminLTE/plugins/daterangepicker/daterangepicker.css') ?>">
    <!-- bootstrap wysihtml5 - text editor -->
    <link rel="stylesheet"
    href="<?php echo base_url('adminLTE/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.min.css') ?>">
    <!-- jQuery 2.2.3 -->
    <script src="<?php echo base_url('adminLTE') ?>/plugins/jQuery/jquery-2.2.3.min.js"></script>
    <!-- jQuery UI 1.11.4 -->
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
    <?php if(isset($head_css)) echo $head_css; ?>
</head>
<body class="hold-transition skin-blue sidebar-mini">
	<div class="wrapper">

		<header class="main-header">
			<!-- Logo -->
			<a href="<?php echo site_url() ?>" class="logo">
				<!-- mini logo for sidebar mini 50x50 pixels -->
				<span class="logo-mini"><b>G</b></span>
				<!-- logo for regular state and mobile devices -->
				<span class="logo-lg"><b>Gulden Trader</b></span>
			</a>
			<!-- Header Navbar: style can be found in header.less -->
			<nav class="navbar navbar-static-top">
				<!-- Sidebar toggle button-->
				<a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">
					<span class="sr-only">Toggle navigation</span>
				</a>

				<div class="navbar-custom-menu">
					<ul class="nav navbar-nav">
						<!-- User Account: style can be found in dropdown.less -->
						<li class="dropdown user user-menu">
							<a href="#" class="dropdown-toggle" data-toggle="dropdown">
								<img src="<?php echo site_url('images/user_icon.png') ?>" class="user-image" alt="User Image">
								<span class="hidden-xs">Admin</span>
							</a>
							<ul class="dropdown-menu">
								<!-- User image -->
								<li class="user-header">
									<i class="fa fa-user-circle fa-2x"></i>
									<p>
										Admin
									</p>
								</li>
								<!-- Menu Footer-->
								<li class="user-footer">
									<div class="pull-left">
										<a href="<?php echo site_url('user/profile') ?>" class="btn btn-default btn-flat">Profile</a>
									</div>
									<div class="pull-right">
										<a href="<?php echo site_url('user/logout') ?>" class="btn btn-default btn-flat">Sign out</a>
									</div>
								</li>
							</ul>
						</li>
					</ul>
				</div>
			</nav>
		</header>
		<!-- Left side column. contains the logo and sidebar -->
		<aside class="main-sidebar">
			<!-- sidebar: style can be found in sidebar.less -->
			<section class="sidebar">
				<!-- Sidebar user panel -->
				<div class="user-panel">
					<div class="pull-left image">
						<img src="<?php echo base_url('images/user_icon.png') ?>" class="img-circle"
						alt="User Image">
					</div>
					<div class="pull-left info">
						<p>Admin</p>
						<a href="#"><i class="fa fa-circle text-success"></i> Online</a>
					</div>
				</div>
				<!-- search form -->
				<form action="#" method="get" class="sidebar-form">
					<div class="input-group">
						<input type="text" name="q" class="form-control" placeholder="Search...">
						<span class="input-group-btn">
							<button type="submit" name="search" id="search-btn" class="btn btn-flat"><i
								class="fa fa-search"></i>
							</button>
						</span>
					</div>
				</form>
				<!-- /.search form -->
				<!-- sidebar menu: : style can be found in sidebar.less -->
				<ul class="sidebar-menu">
					<li><a href="<?php echo site_url() ?>"> Visite Website</a></li>
					<li><a href="<?php echo site_url('admin') ?>"><i class="fa fa-dashboard"></i> Dashboard</a></li>
					<li><a href="<?php echo site_url('admin/users') ?>"><i class="fa fa-users"></i> Manager Users</a></li>
					<li><a href="<?php echo site_url('admin/withdraw') ?>"><i class="fa fa-users"></i> Withdraw</a></li>
					<li><a href="<?php echo site_url('admin/bank_details') ?>"><i class="fa fa-users"></i> Bank details</a></li>
					<li class="treeview">
						<a href="<?php echo site_url('admin/fees');?>" style="">
							<i class="fa fa fa-eur"></i>
							<span>Fees</span>
							<span class="pull-right-container">
								<i class="fa fa-angle-left pull-right"></i>
							</span>
						</a>
						<ul class="treeview-menu">
							<li><a href="<?php echo site_url('admin/fees/open_fees');?>">
								<i class="fa fa-circle"></i>
								Open fees
							</a></li>
							<li><a href="<?php echo site_url('admin/fees/closed_fees');?>">
								<i class="fa fa-circle"></i>
								Closed fees
							</a></li>
							<li><a href="<?php echo site_url('admin/fees/dividends');?>">
								<i class="fa fa-circle"></i>
								Dividends
							</a></li>
						</ul>
					</li>

>>>>>>> fees_feature
				</ul>
			</section>
			<!-- /.sidebar -->
		</aside>

		<!-- Content Wrapper. Contains page content -->
		<div class="content-wrapper">

			<!-- Main content -->
			<section class="content">
				<!-- /.row -->
				<!-- Main row -->
				<div class="row">
					<!-- right col (We are only adding the ID to make the widgets sortable)-->
					<section class="col-lg-12 connectedSortable">
						<?php echo (isset($content)) ? $content : ''; ?>
					</section>
					<!-- right col -->
				</div>
				<!-- /.row (main row) -->
			</section>
			<!-- /.content -->
		</div>
		<!-- /.content-wrapper -->
		<footer class="main-footer">
			<div class="pull-right hidden-xs">
				<b>Version</b> 2.3.8
			</div>
			<strong>Copyright &copy; <?php echo date('Y'); ?> <a href="<?php echo base_url() ?>">Gulden Trader</a>.</strong> All rights
			reserved.
		</footer>

	</div>
	<!-- ./wrapper -->


	<!-- Bootstrap 3.3.6 -->
	<script src="<?php echo base_url('adminLTE') ?>/bootstrap/js/bootstrap.min.js"></script>
	<!-- Morris.js charts -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js"></script>
	<script src="<?php echo base_url('adminLTE') ?>/plugins/morris/morris.min.js"></script>
	<!-- AdminLTE App -->
	<script src="<?php echo base_url('adminLTE') ?>/dist/js/app.min.js"></script>
	<!-- Sparkline -->
	<script src="<?php echo base_url('adminLTE') ?>/plugins/sparkline/jquery.sparkline.min.js"></script>
	<!-- jvectormap -->
	<script src="<?php echo base_url('adminLTE') ?>/plugins/jvectormap/jquery-jvectormap-1.2.2.min.js"></script>
	<script src="<?php echo base_url('adminLTE') ?>/plugins/jvectormap/jquery-jvectormap-world-mill-en.js"></script>
	<!-- jQuery Knob Chart -->
	<script src="<?php echo base_url('adminLTE') ?>/plugins/knob/jquery.knob.js"></script>
	<!-- daterangepicker -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.11.2/moment.min.js"></script>
	<script src="<?php echo base_url('adminLTE') ?>/plugins/daterangepicker/daterangepicker.js"></script>
	<!-- Slimscroll -->
	<script src="<?php echo base_url('adminLTE') ?>/plugins/slimScroll/jquery.slimscroll.min.js"></script>
	<!-- FastClick -->
	<script src="<?php echo base_url('adminLTE') ?>/plugins/fastclick/fastclick.js"></script>
	<?php if(isset($head_js)) echo $head_js; ?>
</body>
</html>