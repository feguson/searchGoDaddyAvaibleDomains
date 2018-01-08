<?php
header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');

$api_access_key = 'YOUR ACCESS KEY HERE';
$api_secret_key = 'YOUR SECRET KEY HERE';

$data_string = $_POST['domains'];

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "https://api.godaddy.com/v1/domains/available?checkType=FULL");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
	'Content-Type:application/json',
	'Accept:application/json',
	'Authorization:sso-key '.$api_access_key.':'.$api_secret_key
]);

$server_output = curl_exec($ch);
$http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

http_response_code($http_status);
echo $server_output;

?>