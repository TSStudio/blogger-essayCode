<?php 

// GET PARAMS:
// id


// RESPONSE JSON
// title
// create
// lastedit
// content
header('Content-type: application/json');
if(!isset($_GET["id"])){
    die("");
}
$id=(int)$_GET["id"];
include("db.php");
$con=new mysqli("127.0.0.1",$un,$pw,"apps");
$result=$con->query("SELECT title,content,editedTime,createdTime FROM `blogger-articles` WHERE id=".(string)$id." LIMIT 1");
if($result->num_rows==0){
    $row=$result->fetch_array();
    $rowcontent["error"]=1;
    print(json_encode($rowcontent));
    exit();
}
$row=$result->fetch_array();
$rowcontent=array();
$rowcontent["error"]=0;
$rowcontent["title"]=$row["title"];
$rowcontent["content"]=$row["content"];
$rowcontent["create"]=(int)$row["createdTime"];
$rowcontent["lastedit"]=(int)$row["editedTime"];
print(json_encode($rowcontent));