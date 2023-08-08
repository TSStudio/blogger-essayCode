var response;
var currentId;
var curPage = 1;
var blocked = 0;
var totalpages;
function getRemoteAssets(url, func) {
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            response = this.responseText;
            func();
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}
function loadcontents(page = 1) {
    if (blocked) {
        return;
    }
    passagelist = document.getElementById("passagelist");
    read = document.getElementById("read");
    submitter = document.getElementById("submitter");
    try {
        passagelist.classList.remove("hidden");
    } catch {}
    try {
        read.classList.add("hidden");
    } catch {}
    try {
        submitter.classList.add("hidden");
    } catch {}
    pageinfo = document.getElementById("pageInfo");
    pageinfo.innerHTML = "广场";
    curPage = page;
    if (page == 1) {
        blocked = 1;
        getRemoteAssets(
            "https://www.tmysam.top/blogger/apis/getContents.php?from=-1",
            loadcontentsStage2
        );
    } else {
        blocked = 1;
        getRemoteAssets(
            "https://www.tmysam.top/blogger/apis/getContents.php?from=" +
                (10 * (page - 1)).toString(),
            loadcontentsStage2
        );
    }
}
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds(), //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1
                    ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length)
            );
        }
    }
    return fmt;
};
function datetimeparser(timestamp) {
    d = new Date();
    d.setTime(timestamp * 1000);
    return d.format("yyyy-MM-dd hh:mm:ss");
}
function swpg(no = 0) {
    if (blocked) {
        return;
    }
    if (no == 0) {
        //get value from input
        ipg = document.getElementById("pageno");
        no = parseInt(ipg.value);
        if (isNaN(no)) {
            ipg.value = curPage;
            return;
        }
    }
    if (no < 1 || no > totalpages) {
        ipg.value = curPage;
        return;
    }
    loadcontents(no);
}
function loadcontentsStage2() {
    passagelist = document.getElementById("passagelist");
    pageinfo = document.getElementById("pageInfo");
    pageinfo.innerHTML = "广场";
    contents = JSON.parse(response);
    totalpages = Math.ceil(contents["total"] / 10);
    str = '<div class="pageselector">';
    if (curPage > 1) {
        str =
            str +
            '<a href="#" onclick="swpg(' +
            (curPage - 1).toString() +
            ')" class="back">上一页</a>';
    }
    str =
        str +
        '第 <input id="pageno" type="text" style="width:20px" onchange="swpg()" value="' +
        curPage.toString() +
        '"> 页，共 ' +
        totalpages.toString() +
        " 页";
    if (curPage < totalpages) {
        str =
            str +
            '<a href="#" onclick="swpg(' +
            (curPage + 1).toString() +
            ')" class="back">下一页</a>';
    }
    str = str + "</div>";
    str =
        str +
        '<div class="passagebutton" onclick="newpassage()"><p class="datetime">新文章</p><p class="titlebutton">点击创建文章</p></div>';
    for (i = 0; i < contents["articles"].length; i++) {
        str =
            str +
            '<div class="passagebutton" onclick="loadpassage(' +
            contents["articles"][i]["id"].toString() +
            ')"><p class="datetime">' +
            datetimeparser(contents["articles"][i]["lastedit"]) +
            '</p><p class="titlebutton">' +
            contents["articles"][i]["title"] +
            "</p></div>";
    }
    passagelist.innerHTML = str;
    blocked = 0;
}
function newpassage() {
    pageinfo = document.getElementById("pageInfo");
    pageinfo.innerHTML =
        '<a href="#" onclick="loadcontents()" class="back"><i class="iconfont">&#xe600;</i>返回</a>';
    passagelist = document.getElementById("passagelist");
    read = document.getElementById("read");
    essay = document.getElementById("essay");
    submitter = document.getElementById("submitter");
    try {
        read.classList.remove("hidden");
    } catch {}
    try {
        submitter.classList.remove("hidden");
    } catch {}
    try {
        passagelist.classList.add("hidden");
    } catch {}
    essay.innerHTML = "";
    input = document.getElementById("inputarea");
    input.value = "";
    currentId = 0;
    titleinput = document.getElementById("titleinput");
    titleinput.value = "";
}
function loadpassage(id) {
    if (blocked) {
        return;
    }
    pageinfo = document.getElementById("pageInfo");
    pageinfo.innerHTML =
        '<a href="#" onclick="loadcontents(' +
        curPage.toString() +
        ')" class="back"><i class="iconfont">&#xe600;</i>返回</a>';
    passagelist = document.getElementById("passagelist");
    read = document.getElementById("read");
    essay = document.getElementById("essay");
    submitter = document.getElementById("submitter");
    try {
        read.classList.remove("hidden");
    } catch {}
    try {
        submitter.classList.remove("hidden");
    } catch {}
    try {
        passagelist.classList.add("hidden");
    } catch {}
    essay.innerHTML = '<div class="loading">加载中</div>';
    input = document.getElementById("inputarea");
    input.value = "";
    blocked = 1;
    getRemoteAssets(
        "https://www.tmysam.top/blogger/apis/getPassage.php?id=" +
            id.toString(),
        loadpassageStage2
    );
    currentId = id;
}
function refreshEssay() {
    read = document.getElementById("essay");
    readbox = document.getElementById("read");
    input = document.getElementById("inputarea");
    read.innerHTML = parse(input.value);
    if (existFunction("renderMathInElement")) {
        renderMathInElement(read, {
            delimiters: [
                { left: "$$", right: "$$", display: true },
                { left: "$", right: "$", display: false },
            ],
            throwOnError: false,
        });
    }
    if (existFunction("hljs.highlightAll")) {
        hljs.highlightAll();
    }
    readbox.style.height = read.offsetHeight + "px";
}
function loadpassageStage2() {
    read = document.getElementById("essay");
    input = document.getElementById("inputarea");
    input.value = JSON.parse(response)["content"];
    titleinput = document.getElementById("titleinput");
    titleinput.value = JSON.parse(response)["title"];
    refreshEssay();
    blocked = 0;
}
window.onload = loadcontents();
function submit() {
    input = document.getElementById("inputarea");
    titleinput = document.getElementById("titleinput");
    captchai = document.getElementById("captcha");
    pwi = document.getElementById("password");

    content = input.value;
    title = titleinput.value;
    captcha = captchai.value;
    id = currentId;
    password = pwi.value;

    request = {};
    request.content = content;
    request.captcha = captcha;
    request.id = id;
    request.password = password;
    request.title = title;
    console.log(request);
    jsonreq = JSON.stringify(request);
    console.log(jsonreq);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://www.tmysam.top/blogger/apis/postEssay.php", true);
    xhr.setRequestHeader("content-type", "application/json");
    xhr.send(jsonreq);
    document.getElementById("captcha_img").src =
        "./captcha.php?r=" + Math.random();
}
