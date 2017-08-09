//nyarukozone.js
//地图控制
function nyarukozone_loadMap(url) {
    var jsonurl = url + "/index.json";
    YSLog("Load Map Config...");
    try {
        $.getJSON(jsonurl,function(responseTxt,statusTxt,xhr,data){
            if(statusTxt == "error") {
                YSLog("E: Download configuration failed. "+xhr.status+": "+xhr.statusText);
            }
            if(statusTxt == "success") {
                YSLog("Load Map Config... OK");
            }
        });
    } catch (ex) {
        YSLog("E: Data loading failed: "+ex);
    }
}