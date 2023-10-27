<?php 
// POST PARAMS: (JSON)
// id -> 0 for new passage, other values for existing passage
// content -> essayCode String
// captcha -> captcha
// password -> password
// title -> title

$req=json_decode(file_get_contents('php://input'),true);
// RESPONSE blank
session_start();
if(isset($req['captcha'])){
    if(strtolower($req['captcha'])!=$_SESSION['authcode']){
        $_SESSION['authcode']=rand(1,100000);
        exit("captcha wrong, should be".$_SESSION['authcode']." but is ".$req['captcha']);
    }
}else{
    exit("no captcha");
}
$_SESSION['authcode']=rand(1,100000);
exit();
// password leaked, temporary disabled
$salt="likjmhnubygvt";
$hashed="3b11e91019d8eff6beee9d12172e776c55106b544a54974326d8344904cf4f97";
$processed=hash("sha256",hash("sha256",$req['password']).$salt);
if($processed!=$hashed){
    exit("password wrong");
}
include("db.php");
$con=new mysqli("127.0.0.1",$un,$pw,"apps");
$time=(string)time();
$title=$con->real_escape_string($req["title"]);
$s=$con->real_escape_string($req["content"]);
if($req["id"]==0){
    $con->query("INSERT INTO `blogger-articles` (title,content,createdTime,editedTime) VALUES (\"".$title."\",\"".$s."\",".$time.",".$time.");");
}else{
    $id=(int)$req["id"];
    $con->query("UPDATE `blogger-articles` SET title='{$title}',content='{$s}',editedTime='{$time}' WHERE id=".(string)$id.";");
}