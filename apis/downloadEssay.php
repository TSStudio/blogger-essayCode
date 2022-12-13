<?php 

// GET PARAMS:
// id


// RESPONSE FILE

if(!isset($_GET["id"])){
    die("");
}
$id=(int)$_GET["id"];
include("../blogger/apis/db.php");
$con=new mysqli("127.0.0.1",$un,$pw,"apps");
$result=$con->query("SELECT title,content,editedTime,createdTime FROM `blogger-articles` WHERE id=".(string)$id." LIMIT 1");
if($result->num_rows==0){
    header('HTTP/1.1 404 NOT FOUND'); 
    exit();
}
$file_name="essay-tid-".$id.".essay";
$row=$result->fetch_array();
$title=base64_encode($row["title"]);
$content=base64_encode($row["content"]);
$response= "#########################BEGIN OF TITLE#########################\n";
$title_64_split=str_split($title,64);
foreach($title_64_split as $title_64_split_part){//split into 64 char parts
    $response.=$title_64_split_part."\n";
}
$response.="##########################END OF TITLE##########################\n";
$response.="########################BEGIN OF CONTENT########################\n";
$content_64_split=str_split($content,64);
foreach($content_64_split as $content_64_split_part){
    $response.=$content_64_split_part."\n";
}
$response.="#########################END OF CONTENT#########################\n";
$response.="#########################   CHECKSUM   #########################\n";
$response.=hash("sha256",$title.$content);
$response.="\n";
header("Content-type: application/octet-stream");
header("Accept-Ranges: bytes");
header("Accept-Length: ".strlen($response));
header("Content-Disposition: attachment;filename=".$file_name);
echo $response;