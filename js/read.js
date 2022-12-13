var response;
var curId=0;
defaultfontstyle[5]="-apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif";
function getRemoteAssets(url,func){
    xhttp=new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState==4&&this.status==200){
            response=this.responseText;
            func();
        }
        if(this.readyState==2){
            read=document.getElementById("read");
            read.innerHTML="<div class=\"loading\">请求已发送</div>";
        }
        if(this.readyState==3){
            read=document.getElementById("read");
            read.innerHTML="<div class=\"loading\">请求响应完成，正在下载内容</div>";
        }
    };
    xhttp.open("GET",url,true);
    xhttp.send();
}
Date.prototype.format = function(fmt) { 
    var o = { 
       "M+" : this.getMonth()+1,                 //月份 
       "d+" : this.getDate(),                    //日 
       "h+" : this.getHours(),                   //小时 
       "m+" : this.getMinutes(),                 //分 
       "s+" : this.getSeconds(),                 //秒 
       "q+" : Math.floor((this.getMonth()+3)/3), //季度 
       "S"  : this.getMilliseconds()             //毫秒 
    }; 
    if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
    for(var k in o) {
       if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
   return fmt; 
}
function datetimeparser(timestamp){
    d=new Date();
    d.setTime(timestamp*1000);
    return d.format("yyyy-MM-dd hh:mm:ss");
}
function loadpassage(id){
    read=document.getElementById("read");
    read.innerHTML="<div class=\"loading\">加载中</div>";
    curId=id;
    getRemoteAssets("https://www.tmysam.top/blogger/apis/getPassage.php?id="+id.toString(),loadpassageStage2);
}
function loadpassageStage2(){
    if(response["error"]==1){
        return;
    }
    read=document.getElementById("read");
    try{
        //if prefers color scheme dark
        if(window.matchMedia('(prefers-color-scheme: dark)').matches){
            defaultfontstyle[2]="#FFFFFF";
        }
        document.title=JSON.parse(response)["title"]+" - BLOGGER";
        read.innerHTML=parse(JSON.parse(response)["content"]);
        if(existFunction("renderMathInElement")){
            renderMathInElement(read,{
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false}
            ],
            throwOnError : false
            });
        }
        if(existFunction("hljs.highlightAll")){
            hljs.highlightAll();
        }
    }catch(e){
        read.innerHTML="<h1>错误：</h1>"+e;
    }
    essayCodeButton=document.getElementById("essayCodeButton");
    ECJSPButton=document.getElementById("ECJSPButton");
    essayCodeButton.innerHTML="EssayCode "+essayCodeVersion;
    ECJSPButton.innerHTML="ECJsParser "+essayCodeParserVersion;
    topInfo=document.getElementById("topInfo");
    topInfo.innerHTML="BLOGGER TID "+curId.toString();
}
function getQueryVariable(variable){
    var query=window.location.search.substring(1);
    var vars=query.split("&");
    for(var i=0;i<vars.length;i++){
        var pair=vars[i].split("=");
        if(pair[0]==variable){return pair[1];}
    }
    return(false);
}
function downloadEssay(){
    window.location.href="https://www.tmysam.top/apis/downloadEssay.php?id="+curId.toString();
}
window.onload=function(){
    if(getQueryVariable("tid")){
        if(!isNaN(parseInt(getQueryVariable("tid")))){
            loadpassage(parseInt(getQueryVariable("tid")));

        }else{
        }
    }else{
    }
}