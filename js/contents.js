var response;
var curPage = 1;
var blocked = 0;
var totalpages;
var curId = 0;
function getRemoteAssets(url, func) {
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            response = this.responseText;
            func();
        }
        if (this.readyState == 4 && this.status != 200) {
            errorHandler(
                "Failed to load remote assets 无法加载以下资源: " + url
            );
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}
window.addEventListener("error", (e) => {
    errorHandler(e.error, e.filename, e.lineno);
});
function errorHandler(errormsg, file = null, line = null) {
    let box = document.getElementById("error-holder");
    if (box) {
        box.innerText = box.innerText + "\n" + errormsg;
        if (file != null) {
            box.innerText = box.innerText + "\n" + file;
        }
        if (line != null) {
            box.innerText = box.innerText + " :" + line;
        }
        box.innerText = box.innerText + "\n\n";
    }
}
function loadcontents(page = 1) {
    curPage = page;
    if (page == 1) {
        getRemoteAssets(
            "https://www.tmysam.top/blogger/apis/getContents.php?from=-1",
            loadcontentsStage2
        );
    } else {
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
    if (no == 0) {
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
function loadpassage(id) {
    window.location.href = "read.html?tid=" + id.toString();
}
function loadcontentsStage2() {
    passagelist = document.getElementById("passagelist");
    contents = JSON.parse(response);
    totalpages = Math.ceil(contents["total"] / 10);
    str = '<div class="pageselector">';
    if (curPage > 1) {
        str =
            str +
            '<a onclick="swpg(' +
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
            '<a onclick="swpg(' +
            (curPage + 1).toString() +
            ')" class="back">下一页</a>';
    }
    str = str + "</div>";
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
    str = str + '<div class="pageselector">';
    if (curPage > 1) {
        str =
            str +
            '<a onclick="swpg(' +
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
            '<a onclick="swpg(' +
            (curPage + 1).toString() +
            ')" class="back">下一页</a>';
    }
    str = str + "</div>";
    passagelist.innerHTML = str;
}

window.onload = function () {
    loadcontents();
};
