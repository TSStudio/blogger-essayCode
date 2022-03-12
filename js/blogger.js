var response;
var curPage=1;
var blocked=0;
var totalpages;
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

function loadcontents(page=1){
    if(blocked){
        return;
    }
    passagelist=document.getElementById("passagelist");
    read=document.getElementById("read");
    try{
        passagelist.classList.remove("hidden");
    }catch(e){}
    try{
        read.classList.add("hidden");
    }catch(e){}
    pageinfo=document.getElementById("pageInfo");
    pageinfo.innerHTML="广场";
    curPage=page;
    if(page==1){
        blocked=1;
        getRemoteAssets("https://www.tmysam.top/blogger/apis/getContents.php?from=-1",loadcontentsStage2);
    }else{
        blocked=1;
        getRemoteAssets("https://www.tmysam.top/blogger/apis/getContents.php?from="+(10*(page-1)).toString(),loadcontentsStage2);
    }
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
function swpg(no=0){
    if(blocked){
        return;
    }
    if(no==0){
        //get value from input
        ipg=document.getElementById("pageno");
        no=parseInt(ipg.value);
        if(isNaN(no)){
            ipg.value=curPage;
            return;
        }
    }
    if(no<1||no>totalpages){
        ipg.value=curPage;
        return;
    }
    loadcontents(no);
}
function loadcontentsStage2(){
    passagelist=document.getElementById("passagelist");
    pageinfo=document.getElementById("pageInfo");
    pageinfo.innerHTML="广场";
    contents=JSON.parse(response);
    totalpages=Math.ceil(contents["total"]/10);
    str="<div class=\"pageselector\">"
    if(curPage>1){
        str=str+"<a href=\"#\" onclick=\"swpg("+(curPage-1).toString()+")\" class=\"back\">上一页</a>";
    }
    str=str+"第 <input id=\"pageno\" type=\"text\" style=\"width:20px\" onchange=\"swpg()\" value=\""+(curPage.toString())+"\"> 页，共 "+(totalpages.toString())+" 页";
    if(curPage<totalpages){
        str=str+"<a href=\"#\" onclick=\"swpg("+(curPage+1).toString()+")\" class=\"back\">下一页</a>";
    }
    str=str+"</div>";
    for(i=0;i<contents["articles"].length;i++){
        str=str+"<div class=\"passagebutton\" onclick=\"loadpassage("+(contents["articles"][i]["id"].toString())+")\"><p class=\"datetime\">"+datetimeparser(contents["articles"][i]["lastedit"])+"</p><p class=\"titlebutton\">"+contents["articles"][i]["title"]+"</p></div>";
    }
    passagelist.innerHTML=str;
    state={};
    state.name="contents";
    state.page=curPage;
    history.replaceState(state,"","https://www.tmysam.top/");
    blocked=0;
}
function loadpassage(id){
    if(blocked){
        return;
    }
    pageinfo=document.getElementById("pageInfo");
    pageinfo.innerHTML="<a href=\"#\" onclick=\"loadcontents("+curPage.toString()+")\" class=\"back\"><i class=\"iconfont\">&#xe600;</i>返回</a>";
    passagelist=document.getElementById("passagelist");
    read=document.getElementById("read");
    try{
        read.classList.remove("hidden");
    }catch(e){}
    try{
        passagelist.classList.add("hidden");
    }catch(e){}
    read.innerHTML="<div class=\"loading\">加载中</div>";
    blocked=1;
    curId=id;
    getRemoteAssets("https://www.tmysam.top/blogger/apis/getPassage.php?id="+id.toString(),loadpassageStage2);
}
function loadpassageStage2(){
    if(response["error"]==1){
        blocked=0;
        loadcontents();
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
    state={};
    state.name="passage";
    state.id=curId;
    history.replaceState(state,"","https://www.tmysam.top/?tid="+curId.toString());
    blocked=0;
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
            loadcontents();
        }
    }else{
        loadcontents();
    }
    window.addEventListener('popstate',function(evt){
        state=evt.state;
        if(state==null){
            history.back();
            return;
        }
        if(state.name=="passage"){
            loadpassage(state.id);
        }else{
            loadcontents(state.page);
        }
    },false);
}