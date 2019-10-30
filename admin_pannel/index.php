<?php
require 'credentials.php';

$url = "https://".$authstring."@".$dbhost."/".$dbname."/_all_docs?include_docs=true";

$headers = array("Content-Type:application/json");

$ch = curl_init();

curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_URL,$url);
curl_setopt($ch, CURLOPT_POST, 0);
//curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_NOBODY, 0);
//curl_setopt($ch, CURLOPT_FAILONERROR, 1);

$response = curl_exec($ch);
curl_close($ch);

//echo $response;
$response=json_decode($response,true);


$numberofdocs = $response['total_rows'];

$rows = $response['rows'];
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>CrewBot</title>
	<link href="css/bootstrap.min.css" rel="stylesheet">
	<link href="css/font-awesome.min.css" rel="stylesheet">
	<link href="css/styles.css" rel="stylesheet">
	<script src="https://cdn.jsdelivr.net/npm/sweetalert2@8"></script>


	<!--Custom Font-->
	<link href="https://fonts.googleapis.com/css?family=Montserrat:300,300i,400,400i,500,500i,600,600i,700,700i" rel="stylesheet">
	<!--[if lt IE 9]>
	<script src="js/html5shiv.js"></script>
	<script src="js/respond.min.js"></script>
	<![endif]-->
	<script>
    function marksolved(id,rev)
	{
		document.getElementById("preloader").style.display = "block";
		$.ajax({
             url:"marksolved.php?id=" +id+ "&rev=" + rev, //the page containing php script
             type: "get", //request type,
             success:function(){
							 document.getElementById("preloader").style.display = "none"
							 Swal.fire(
									'success!',
									'order marked as Delivered!',
									'success'
								)

							window.location.reload();
            }
          });
	}
	function markpending(id,rev)
	{
		document.getElementById("preloader").style.display="block";
		$.ajax({
             url:"markpending.php?id=" +id+ "&rev=" + rev, //the page containing php script
             type: "get", //request type,
             success:function(){

						 		document.getElementById("preloader").style.display="none";
								Swal.fire(
								   'success!',
								   'order marked as Pending!',
								   'success'
								 )

							window.location.reload();
            }
          });

	}
    </script>
    <!-- Javscript Auto Refresh-->
    <script type="text/JavaScript">
         <!--
            function AutoRefresh( t ) {
               setTimeout("location.reload(true);", t);
            }
         //-->
     </script>
</head>
<body onload="JavaScript:AutoRefresh(1500000);">
	<nav class="navbar navbar-custom navbar-fixed-top" role="navigation">
		<div class="container-fluid">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#sidebar-collapse"><span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span></button>
				<a class="navbar-brand" href="#"><span>Crew</span>Bot</a>
				<div class="pull-right">
					<a class="navbar-brand"><h4><i class="fa fa-plane color-blue"></i> <span>Flight Number :</span><span style="color:white"> 9W 2417</span></h4></a>
				</div>
			</div>
		</div><!-- /.container-fluid -->
	</nav>
	<div id="sidebar-collapse" class="col-sm-3 col-lg-2 sidebar">

		<ul class="nav menu">
			<li class="active"><a href="index.html"><em class="fa fa-dashboard">&nbsp;</em> Dashboard</a></li>

		<div class="divider"></div>
		<br>
			<li style="padding:2%;"><a href="#" class="btn btn-success"><em class="fa fa-plane">&nbsp;</em><strong> Plane Takeoff</strong></a></li>
			<li style="padding:2%;"><a href="#" class="btn btn-warning"><em class="fa fa-plane fa-flip-vertical">&nbsp;</em><strong> Plane Landing</strong></a></li>
			<li style="padding:2%;"><a href="#" class="btn btn-danger"><em class="fa fa-exclamation-triangle">&nbsp;</em><strong> Emergency</strong></a></li>

		</ul>
	</div><!--/.sidebar-->

	<div class="col-sm-9 col-sm-offset-3 col-lg-10 col-lg-offset-2 main">
		<div class="row">
			<ol class="breadcrumb">
				<li><a href="#">
					<em class="fa fa-home"></em>
				</a></li>
				<li class="active">Dashboard</li>
			</ol>
		</div><!--/.row-->

		<div class="row">
			<div class="col-lg-12">
				<h1 class="page-header">Passanger Orders</h1>
			</div>
		</div><!--/.row-->

		<div class="panel panel-container">
			<div class="row">
				<div class="col-xs-6 col-md-3 col-lg-3 no-padding">
					<div class="panel panel-teal panel-widget border-right">
						<div class="row no-padding"><em class="fa fa-xl fa-shopping-cart color-blue"></em>
							<div class="large"><?php echo $numberofdocs; ?></div>
							<div class="text-muted">Number of Total Orders</div>
						</div>
					</div>
				</div>
				<div class="col-xs-6 col-md-3 col-lg-3 no-padding">
					<div class="panel panel-blue panel-widget border-right">
						<div class="row no-padding"><em class="fa fa-xl fa-hourglass-half color-orange"></em>
							<div class="large"><span id="pendingorders"></span></div>
							<div class="text-muted">Pending Orders</div>
						</div>
					</div>
				</div>
				<div class="col-xs-6 col-md-3 col-lg-3 no-padding">
					<div class="panel panel-orange panel-widget border-right">
						<div class="row no-padding"><em class="fa fa-xl fa-users color-teal"></em>
							<div class="large"><span id="deliveredorders"></span></div>
							<div class="text-muted">Delivered Orders</div>
						</div>
					</div>
				</div>
				<div class="col-xs-6 col-md-3 col-lg-3 no-padding">
					<div class="panel panel-red panel-widget ">
						<div class="row no-padding"><em class="fa fa-xl fa-exclamation-triangle color-red"></em>
							<div class="large">2</div>
							<div class="text-muted">Special Requests</div>
						</div>
					</div>
				</div>
			</div><!--/.row-->
		</div>
	</div>	<!--/.main-->

	<!-- Table View Start -->

	<div class="container table-responsive pull-right col-sm-9 col-xs-10 col-md-10">
		<!--<h2 style="text-align:center">Manage Complains</h2>-->
	<table class="table table-hover">
		<thead>
			<tr>
				<th class="text-center">Sr. No.</th>
				<th>Name of User</th>
				<th class="text-center">Seat Number</th>
				<th class="text-center">Food Item</th>
				<th class="text-center">Status</th>
				<th class="text-center">Action</th>
			</tr>
		</thead>
		<tbody>

	<?php

	$deliveredorders = 0;
	$pendingorders = 0;

	for ($i=0; $i < $numberofdocs; $i++)
	{
		$doc[$i] = $rows[$i]['doc'];
		if(isset($doc[$i]["username"]))
		{

		echo '
			<tr>
				<td class="text-center">'.($i+1).'</td>
				<td>'.$doc[$i]['username'].'</td>
				<td class="text-center">'.$doc[$i]['seatnumber'].'</button></td>
				<td class="text-center">'.$doc[$i]['fooditem'].'</td>
				';
				if($doc[$i]['status'] == "True")
				{
					$deliveredorders++;
					echo '
					<td class="text-center"><button class="btn btn-success"><i class="fa fa-check-circle"></i> Delivered</button></td>
					<td class="text-center"><button class="btn btn-warning" onclick="markpending(\''.$doc[$i]['_id'].'\',\''.$doc[$i]['_rev'].'\')"><i class="fa fa-eye"></i> Mark as Pending</button></td>
					';
				}
				else
				{
					$pendingorders++;
					echo '
					<td class="text-center"><button class="btn btn-danger"><i class="fa fa-times-circle"></i> Pending</button></td>
					<td class="text-center"><button class="btn btn-warning" onclick="marksolved(\''.$doc[$i]['_id'].'\',\''.$doc[$i]['_rev'].'\')"><i class="fa fa-check"></i> Mark as Delivered</button></td>
					';

				}
				echo '

			</tr>

		';
		}
	}
	?>

	</tbody>
	</table>
	</div>

	<script type="text/javascript">
		document.getElementById("pendingorders").innerHTML = <?php echo $pendingorders; ?>;
		document.getElementById("deliveredorders").innerHTML = <?php echo $deliveredorders; ?>;
	</script>

	<!-- Table View End-->
	<script src="js/jquery-1.11.1.min.js"></script>
	<script src="js/bootstrap.min.js"></script>
	<script src="js/custom.js"></script>
<!-- preloader -->
		 	<div id="preloader" class="preloader">
         <div class="loader-circle"></div>
         <div class="loader-circle1"></div>
         <div class="loader-logo"></div>
			 </div>

</body>
</html>
