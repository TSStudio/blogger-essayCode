<?php 
// POST PARAMS: (JSON)
// id -> 0 for new passage, other values for existing passage
// content -> essayCode String
// captcha -> captcha
// password -> password
// title -> title
include("db.php");
$con=new mysqli("127.0.0.1",$un,$pw,"apps");
$time=(string)time();
$title="测试文章#";
$s=$con->real_escape_string("这是测试翻页功能所用的占位文章");
for($i=0;$i<100;$i++){
    $con->query("INSERT INTO `blogger-articles` (title,content,createdTime,editedTime) VALUES (\"".$title.$i."\",\"".$s."\",".$time.",".$time.");");
}