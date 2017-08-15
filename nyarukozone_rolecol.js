//nyarukozone.js
//角色控制
var nyarukozone_roles = [];
var nyarukozone_rolesid = [];
var zi = 0;

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
        var classname = 'nyarukozone_'+json["info"]["id"]+"_"+json["stand@1x"]["a"][0];
        var rolediv = '<div class="'+classname+' sprite"></div>';
        nyarukozone_div.append(rolediv);
        var z = 300000 + (zi++);
        $("."+classname).css({"z-index":z,"top":"0px","left":"0px","position":"absolute"});
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