//nyarukozone.js
//地图控制
var nyarukozone_mapbackgrounds = [];
var nyarukozone_mapprospects = [];
var nyarukozone_collider = "";
var nyarukozone_mapimageall = 0;
var nyarukozone_mapimagearrlen = [0,0];
var nyarukozone_mapimagecache = [];
var nyarukozone_mapinfo = null;

function nyarukozone_resetmap() {
    $(".nyarukozone_map").remove();
    nyarukozone_mapbackgrounds = [];
    nyarukozone_mapprospects = [];
    nyarukozone_collider = "";
    nyarukozone_mapimageall = 0;
    nyarukozone_mapimagearrlen = [0,0];
    nyarukozone_mapimagecache = [];
    nyarukozone_mapinfo = null;
}

function nyarukozone_loadMap(url) {
    nyarukozone_resetmap();
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
                    YSLog("E: filevar");
                    return
                }
                nyarukozone_loadMapImage(url,json["background"],json["prospect"],json["collider"]);
                YSLog("Load Map Config: " + info["name"]);
            }
        });
    } catch (ex) {
        YSLog("E: Data loading failed: "+ex);
    }
}
function nyarukozone_loadMapImage(url,backgrounds,prospects,collider) {
    nyarukozone_mapimagearrlen = [backgrounds.length,prospects.length];
    nyarukozone_mapimageall = nyarukozone_mapimagearrlen[0] + nyarukozone_mapimagearrlen[1] + 1;
    $.each(backgrounds, function(i, item) {
        nyarukozone_loadMapImage2(1,url,item);
    });
    $.each(prospects, function(i, item) {
        nyarukozone_loadMapImage2(2,url,item);
    });
    nyarukozone_loadMapImage2(3,url,collider);
}
function nyarukozone_loadMapImage2(type,url,item) {
    var nowurl = url + "/" + item;
    YSLog("Loading: "+nowurl);
    var nowimg = new Image();
    nowimg.src = nowurl;
    nowimg.onload = function() {
        nyarukozone_mapimagecache[nyarukozone_mapimagecache.length] = [type,$(this)];
        if (nyarukozone_mapimagecache.length >= nyarukozone_mapimageall) {
            nyarukozone_loadMapImage3();
        }
    };
}
function nyarukozone_loadMapImage3() {
    var nowbackgrounds = [];
    var nowprospects = [];
    var nowcollider = null;
    $.each(nyarukozone_mapimagecache, function(i, nowimginfo) {
        if (nowimginfo[0] == 1) {
            nowbackgrounds[nowbackgrounds.length] = nowimginfo[1];
        } else if (nowimginfo[0] == 2) {
            nowprospects[nowprospects.length] = nowimginfo[1];
        } else if (nowimginfo[0] == 3) {
            nowcollider = nowimginfo[1];
        }
    });
    $.each(nowbackgrounds, function(i, nimg) {
        nyarukozone_loadMapImage4(100000+i,nimg);
    });
    $.each(nowprospects, function(i, nimg) {
        nyarukozone_loadMapImage4(800000+i,nimg);
    });
    //nyarukozone_loadMapImage4(900000,nowcollider);

    YSLog("Load Map Img.");
}
function nyarukozone_loadMapImage4(z,img) {
    img.addClass("nyarukozone_spirit");
    img.addClass("nyarukozone_map");
    img.css({"z-index":z,"top":"0px","left":"0px"});
    // var html = '<img class="nyarukozone_spirit nyarukozone_map" style="top:0px;left:0px;" src="'+img+'">';
    // nyarukozone_div.append(html);
    nyarukozone_div.append(img);
}