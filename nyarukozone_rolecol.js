//nyarukozone.js
//角色控制
var nyarukozone_roles = [];
var nyarukozone_rolesid = [];
var nyarukozone_roledivs = [];
var zi = 0;
var nyarukozone_rolespeed_ani = 10;
var nyarukozone_rolespeed_anii = 0;

function nyarukozone_resetrole() {

}

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
    var z = 300000 + (zi++);
    var idname = "sprite"+z;
    var rolediv = '<div class="'+classname+' sprite" id="'+idname+'" ani="'+uid+'_'+json["info"]["id"]+'_stand_s_0"></div>';
    nyarukozone_div.append(rolediv);
    var nowclass = $("."+classname);
    nowclass.css({"z-index":z,"top":"0px","left":"0px","position":"absolute"});
    nyarukozone_roledivs[nyarukozone_roledivs.length] = idname;
}

function nyarukozone_frameupdate_role() {
    nyarukozone_rolespeed_anii++;
    if (nyarukozone_rolespeed_anii < nyarukozone_rolespeed_ani) {
        return;
    }
    nyarukozone_rolespeed_anii = 0;
    for (var i in nyarukozone_roledivs) {
        var nowdiv = $("#"+nyarukozone_roledivs[i]);
        //.split(',');
        var nowstat = nowdiv.attr("ani").split('_');
        var nowuid = nowstat[0];
        var nowid = nowstat[1];
        var nowact = nowstat[2];
        var nowdir = nowstat[3];
        var newani = parseInt(nowstat[4]) + 1;
        if (newani >= nyarukozone_roles[nowuid][nowact+"@1x"][nowdir].length) {
            newani = 0;
        }
        // console.log(nyarukozone_roles[nowuid][nowact+"@1x"][nowdir][newani]);
        var newclass = 'nyarukozone_'+nowid+"_"+nyarukozone_roles[nowuid][nowact+"@1x"][nowdir][newani]+' sprite';
        var newani = nowuid+"_"+nowid+"_"+nowact+"_"+nowdir+"_"+newani;
        nowdiv.attr({"ani":newani,"class":newclass});
    }
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