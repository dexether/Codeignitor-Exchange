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
    <!-- Morris chart -->
    <link rel="stylesheet" href="<?php echo base_url('adminLTE/plugins/morris/morris.css') ?>">
    <!-- jvectormap -->
    <link rel="stylesheet" href="<?php echo base_url('adminLTE/plugins/jvectormap/jquery-jvectormap-1.2.2.css') ?>">
    <!-- Date Picker -->
    <link rel="stylesheet" href="<?php echo base_url('adminLTE/plugins/datepicker/datepicker3.css') ?>">
    <!-- Daterange picker -->
    <link rel="stylesheet" href="<?php echo base_url('adminLTE/plugins/daterangepicker/daterangepicker.css') ?>">
    <!-- bootstrap wysihtml5 - text editor -->
    <link rel="stylesheet"
    href="<?php echo base_url('adminLTE/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.min.css') ?>">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>
<body class="hold-transition skin-blue sidebar-mini">
	<div class="wrapper">

		<header class="main-header">
			<!-- Logo -->
			<a href="index2.html" class="logo">
				<!-- mini logo for sidebar mini 50x50 pixels -->
				<span class="logo-mini"><b>A</b>LT</span>
				<!-- logo for regular state and mobile devices -->
				<span class="logo-lg"><b>Admin</b>LTE</span>
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
								<i class="fa fa-user-circle fa-2x"></i>
								<span class="hidden-xs">Admin</span>
							</a>
							<ul class="dropdown-menu">
								<!-- User image -->
								<li class="user-header">
									<i class="fa fa-user-circle fa-2x"></i>
									<p>
										Admin
										<small>Member since Nov. 2012</small>
									</p>
								</li>
								<!-- Menu Footer-->
								<li class="user-footer">
									<div class="pull-left">
										<a href="<?php echo site_url('user/profile') ?>" class="btn btn-default btn-flat">Profile</a>
									</div>
									<div class="pull-right">
										<a href="<?php echo site_url('user/logout') ?>" class="btn btn-default btn-flat">Sign
											out</a>
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
							<img src="<?php echo base_url('adminLTE') ?>/dist/img/user2-160x160.jpg" class="img-circle"
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
					<li class="active"><a href="<?php echo site_url('admin') ?>"><i class="fa fa-circle-o"></i>
						Dashboard</a></li>
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

		<!-- jQuery 2.2.3 -->
		<script src="<?php echo base_url('adminLTE') ?>/plugins/jQuery/jquery-2.2.3.min.js"></script>
		<!-- jQuery UI 1.11.4 -->
		<script src="https://code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>
		<!-- Resolve conflict in jQuery UI tooltip with Bootstrap tooltip -->
		<script>
			$.widget.bridge('uibutton', $.ui.button);
		</script>
		<!-- Bootstrap 3.3.6 -->
		<script src="<?php echo base_url('adminLTE') ?>/bootstrap/js/bootstrap.min.js"></script>
		<!-- Morris.js charts -->
		<script src="https://cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js"></script>
		<script src="<?php echo base_url('adminLTE') ?>/plugins/morris/morris.min.js"></script>
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
		<!-- datepicker -->
		<script src="<?php echo base_url('adminLTE') ?>/plugins/datepicker/bootstrap-datepicker.js"></script>
		<!-- Bootstrap WYSIHTML5 -->
		<script src="<?php echo base_url('adminLTE') ?>/plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.all.min.js"></script>
		<!-- Slimscroll -->
		<script src="<?php echo base_url('adminLTE') ?>/plugins/slimScroll/jquery.slimscroll.min.js"></script>
		<!-- FastClick -->
		<script src="<?php echo base_url('adminLTE') ?>/plugins/fastclick/fastclick.js"></script>
		<!-- AdminLTE App -->
		<script src="<?php echo base_url('adminLTE') ?>/dist/js/app.min.js"></script>
		<!-- AdminLTE dashboard demo (This is only for demo purposes) -->
		<script src="<?php echo base_url('adminLTE') ?>/dist/js/pages/dashboard.js"></script>
		<!-- AdminLTE for demo purposes -->
		<script src="<?php echo base_url('adminLTE') ?>/dist/js/demo.js"></script>
	</body>
	</html>