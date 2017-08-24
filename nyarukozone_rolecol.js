//nyarukozone.js
//角色控制器
var nyarukozone_roles = [];
var nyarukozone_rolesid = [];
var nyarukozone_roledivs = [];
var zi = 0;
var nyarukozone_rolespeed_ani = 10;
var nyarukozone_rolespeed_anii = 0;

//清除當前場景所有角色
function nyarukozone_resetrole() {

}

//裝入一個角色
function nyarukozone_loadRole(url,uid) {
    var jsonurl = url + "/index.json";
    YSLog("Loading: "+jsonurl);
    try {
        $.getJSON(jsonurl,function(responseTxt,statusTxt,xhr,data){
            if(statusTxt == "error") {
                YSLog("E: Download configuration failed. "+xhr.status+": "+xhr.statusText);
            }
            if(statusTxt == "success") {
                var json = xhr.responseJSON;
                var info = json["info"];
                if (info["filevar"] != 1) {
                    YSLog("E: rolefilevar");
                    return
                }
                var css = url + "/" + info["css"];
                nyarukozone_addRole(json,css,info["id"],uid);
                YSLog("Load Role Config: " + info["name"]);
            }
        });
    } catch (ex) {
        YSLog("E: Data loading failed: "+ex);
    }
}

//添加角色到場景
function nyarukozone_addRole(json,css,id,uid) {
    if (nyarukozone_roles[uid]) {
        YSLog("E: Role uid");
    }
    nyarukozone_roles[uid] = json;
    if (!nyarukozone_contains(nyarukozone_rolesid,id)) {
        nyarukozone_rolesid[nyarukozone_rolesid.length] = id;
        loadjscssfile(css,"css");
    }
    var classname = 'nyarukozone_'+json["info"]["id"]+"_"+json["stand@1x"]["a"][0];
    var z = 300000 + zi;
    zi+=10;
    var idname = "sprite"+z;
    var framestr = "-1000_-1000";
    if (nyarukozone_mapinfo) {
        var door = nyarukozone_mapinfo["door"];
        var doorDefault = door[door["default"]];
        framestr = doorDefault.join("_");
    }
    var rolediv = '<div class="'+classname+' sprite" id="'+idname+'" ani="'+uid+'_'+json["info"]["id"]+'_stand_s_0" frame="'+framestr+'"></div>';
    nyarukozone_div.append(rolediv);
    var nowclass = $("."+classname);
    nowclass.css({"z-index":z,"top":"0px","left":"0px","position":"absolute"});
    nyarukozone_roledivs[nyarukozone_roledivs.length] = idname;
}

//角色每幀更新，根據設定的延遲做動畫。
function nyarukozone_frameupdate_role() {
    nyarukozone_selfroledir();
    nyarukozone_rolespeed_anii++;
    if (nyarukozone_rolespeed_anii < nyarukozone_rolespeed_ani) {
        return;
    }
    nyarukozone_rolespeed_anii = 0;
    for (var i in nyarukozone_roledivs) {
        var nowdiv = $("#"+nyarukozone_roledivs[i*10]);
        nyarukozone_newroleclass(nowdiv,"");
    }
    //nyarukozone_keyboard
}

//顯示角色到場景
function nyarukozone_newroleclass(nowdiv,nowroledir) {
    var nowstat = nowdiv.attr("ani").split('_');
    var nowuid = nowstat[0];
    var nowid = nowstat[1];
    var nowact = nowstat[2];
    var nowdir = nowstat[3];
    if (nowroledir.length > 2) {
        nowact = "stand";
    } else if (nowroledir != "") {
        nowdir = nowroledir;
        nowact = "walk";
    }
    var newani = parseInt(nowstat[4]) + 1;
    if (newani >= nyarukozone_roles[nowuid][nowact+"@1x"][nowdir].length) {
        newani = 0;
    }
    if (nowroledir == "") {
        var newclass = 'nyarukozone_'+nowid+"_"+nyarukozone_roles[nowuid][nowact+"@1x"][nowdir][newani]+' sprite';
    }
    var newani = nowuid+"_"+nowid+"_"+nowact+"_"+nowdir+"_"+newani;
    var frame = nowdiv.attr("frame").split('_'); //[0,0];
    nowdiv.attr({"ani":newani,"class":newclass});
    var newframe = nyarukozone_zerotocenter(frame[0],frame[1],nowdiv.width(),nowdiv.height());
    nowdiv.css({"left":newframe[0],"top":newframe[1]});
}

//獲取中心點
function nyarukozone_zerotocenter(x,y,w,h) {
    var x = parseFloat(x);
    var y = parseFloat(y);
    var w = parseFloat(w);
    var h = parseFloat(h);
    var nx = x - (w * 0.5);
    var ny = y - (h * 0.5);
    return [nx,ny];
}

//玩家角色
function nyarukozone_selfroledir() {
    var selfdiv = $("#sprite300000");
    var nowkeys = nyarukozone_keyboard;
    var nowroledir = "";
    if (nowkeys.length < 1 || nowkeys.length > 2) {
        nowroledir = "null";
    }
    for (i in nowkeys) {
        var nowkey = nowkeys[i];
        if (nowkey == 87 || nowkey == 38) {
            nowroledir += "w";
        } else if (nowkey == 83 || nowkey == 40) {
            nowroledir += "s";
        } else if (nowkey == 65 || nowkey == 37) {
            nowroledir += "a";
        } else if (nowkey == 68 || nowkey == 39) {
            nowroledir += "d";
        } else {
            nowroledir = "null";
        }
    }
    if (nowroledir == "ws" || nowroledir == "ad" || nowroledir == "sw" || nowroledir == "da") {
        nowroledir = "null";
    }
    nyarukozone_newroleclass(selfdiv,nyarukozone_keysort(nowroledir));
}
function nyarukozone_keysort(key) {
    if (key == "aw") {
        return "wa";
    } else if (key == "dw") {
        return "wd";
    } else if (key == "as") {
        return "sa";
    } else if (key == "ds") {
        return "sd";
    }
    return key;
}

function nyarukozone_contains(arr, obj) {
  var i = arr.length;
  while (i--) {
    if (arr[i] === obj) {
      return true;
    }
  }
  return false;
}