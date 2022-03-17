<?php 

// GET PARAMS:
// from -> latest id. -1 for the newest
// limit -> count. 10 for default


// RESPONSE JSON
// passages:[]
//     ------{
//            title: //text
//            lastedit: //unix timestamp
//            id
// }
// total: //total count in database.
header('Content-type: application/json');
if(!isset($_GET["from"])){
    die("");
}
if(isset($_GET["limit"])){
    $limit=(int)($_GET["limit"]);
}else{
    $limit=10;
}
$from=(int)($_GET["from"]);
include("db.php");
$con=new mysqli("127.0.0.1",$un,$pw,"apps");
$result=$con->query("SELECT COUNT(*) FROM `blogger-articles`");
$row=$result->fetch_array();
$count=$row["COUNT(*)"];

$articles=array();
if($from==-1){
    $result=$con->query("SELECT title,createdTime,editedTime,id FROM `blogger-articles` ORDER BY createdTime DESC,id DESC LIMIT ".(string)$limit);
}else{
    $result=$con->query("SELECT title,createdTime,editedTime,id FROM `blogger-articles` ORDER BY createdTime DESC,id DESC LIMIT ".(string)$limit." OFFSET ".(string)$from);
}
while($row=$result->fetch_array()){
    $rowcontent=array();
    $rowcontent["title"]=$row["title"];
    $rowcontent["lastedit"]=(int)$row["editedTime"];
    $rowcontent["create"]=(int)$row["createdTime"];
    $rowcontent["id"]=(int)$row["id"];
    $articles[]=$rowcontent;
}
$res=array();
$res["total"]=$count;
$res["articles"]=$articles;
print(json_encode($res));