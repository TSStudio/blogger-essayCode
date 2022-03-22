var response;
var curId=0;
function getRemoteAssets(url,func){
    xhttp=new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState==4&&this.status==200){
            response=this.responseText;
            func();
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
window.onload=function(){
    if(getQueryVariable("tid")){
        if(!isNaN(parseInt(getQueryVariable("tid")))){
            loadpassage(parseInt(getQueryVariable("tid")));
        }else{
        }
    }else{
    }
}