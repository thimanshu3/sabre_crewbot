<?php
require 'credentials.php';

$id = $_GET['id'];
$rev = $_GET['rev'];



$url = "https://".$authstring."@".$dbhost."/".$dbname."/".$id;


$headers = array("Content-Type:application/json");

$ch = curl_init();

curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_URL,$url);
curl_setopt($ch, CURLOPT_POST, 0);
//curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
//curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_NOBODY, 0);
//curl_setopt($ch, CURLOPT_FAILONERROR, 1);

$response = curl_exec($ch);
curl_close($ch);

//echo $response;
$response=json_decode($response,true);

$response['status'] = "False";

$response = json_encode($response);



$url = "https://".$authstring."@".$dbhost."/".$dbname;

//echo $data;

$headers = array("Content-Type:application/json");

$ch = curl_init();

curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_URL,$url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $response);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_NOBODY, 0);
//curl_setopt($ch, CURLOPT_FAILONERROR, 1);

$response = curl_exec($ch);
curl_close($ch);

//echo '<script>console.log("Response is : '.$response.'")</script>';
//echo $response;
$response=json_decode($response,true);


if ($response['ok']==true) {

	echo '
	<script>
	console.log("Complain Status Updated Successfully");
	alert("Complain Status Updated Successfully");
	window.location="index.php";
	</script>';


}
else
{
	echo '
	<script>
	console.log("Error Updating Complain Status!");
	alert("Error Updating Complain Status!");
	window.location="index.php";
	</script>';

}

?>
