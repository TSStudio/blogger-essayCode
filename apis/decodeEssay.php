<?php
// method: post
// params: encoded data string
// response: decoded data string
// Path: apis\decodeEssay.php
// Compare this snippet from apis\downloadEssay.php:
// GNU GPLv3 License
$encoded_data=$_POST["data"];
$encoded_data_split=explode("\n",$encoded_data);
$data_full="";
foreach($encoded_data_split as $encoded_data_piece){
    $data_full.=$encoded_data_piece;
}
$decoded_data=base64_decode($data_full);
header("Content-type: text/plain");
echo $decoded_data;