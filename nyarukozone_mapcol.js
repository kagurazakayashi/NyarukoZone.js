//nyarukozone.js
//場景控制器
var nyarukozone_mapbackgrounds = [];
var nyarukozone_mapprospects = [];
var nyarukozone_collider = "";
var nyarukozone_mapimageall = 0;
var nyarukozone_mapimagearrlen = [0,0];
var nyarukozone_mapimagecache = [];
var nyarukozone_mapinfo = null;
var nyarukozone_mapsize = [];

//清除當前場景
function nyarukozone_resetmap() {
    $(".nyarukozone_map").remove();
    nyarukozone_mapbackgrounds = [];
    nyarukozone_mapprospects = [];
    nyarukozone_collider = "";
    nyarukozone_mapimageall = 0;
    nyarukozone_mapimagearrlen = [0,0];
    nyarukozone_mapimagecache = [];
    nyarukozone_mapinfo = null;
    nyarukozone_mapsize = [];
}

//裝入一個場景
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
                nyarukozone_mapinfo = xhr.responseJSON;
                var info = nyarukozone_mapinfo["info"];
                if (info["filevar"] != 1) {
                    YSLog("E: mapfilevar");
                    return
                }
                nyarukozone_loadMapImage(url,nyarukozone_mapinfo["background"],nyarukozone_mapinfo["prospect"],nyarukozone_mapinfo["collider"]);
                YSLog("Load Map Config: " + info["name"]);
            }
        });
    } catch (ex) {
        YSLog("E: Data loading failed: "+ex);
    }
}

//裝入場景圖片設定
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
//下載場景圖片
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
//設定圖片z軸
function nyarukozone_loadMapImage3() {
    // var nyarukozone_mapbackgrounds = [];
    // var nyarukozone_mapprospects = [];
    var nowcollider = null;
    $.each(nyarukozone_mapimagecache, function(i, nowimginfo) {
        if (nowimginfo[0] == 1) {
            nyarukozone_mapbackgrounds[nyarukozone_mapbackgrounds.length] = nowimginfo[1];
        } else if (nowimginfo[0] == 2) {
            nyarukozone_mapprospects[nyarukozone_mapprospects.length] = nowimginfo[1];
        } else if (nowimginfo[0] == 3) {
            nowcollider = nowimginfo[1];
        }
    });
    $.each(nyarukozone_mapbackgrounds, function(i, nimg) {
        nyarukozone_loadMapImage4(100000+i,nimg);
    });
    $.each(nyarukozone_mapprospects, function(i, nimg) {
        nyarukozone_loadMapImage4(600000+i,nimg);
    });
    YSLog("Load Map OK.");
}
//呈現場景
function nyarukozone_loadMapImage4(z,img) {
    if (nyarukozone_mapsize.length == 0) {
        nyarukozone_mapsize = [img[0].width,img[0].height];
        YSLog("Map Size: "+nyarukozone_mapsize[0]+" x "+nyarukozone_mapsize[1]);
    }
    img.addClass("nyarukozone_spirit");
    img.addClass("nyarukozone_map");
    img.css({"z-index":z,"top":"0px","left":"0px"});
    nyarukozone_div.append(img);
}

//演算地圖移動位置，防止超出。返回負數用角色移動補償。
function nyarukozone_mapmove(x,y) {
    var windoww = nyarukozone_div.width() / 2;
    var windowh = nyarukozone_div.height() / 2;
    var mx = windoww - x;
    var mxx = nyarukozone_div.width() - nyarukozone_mapsize[0];
    var my = windowh - y;
    var myy = nyarukozone_div.height() - nyarukozone_mapsize[1];
    var rolex = windoww;
    var roley = windowh;
    
    if (mx > 0) {
        mx = 0;
        rolex = x;
    } else if (mx < mxx) {
        mx = mxx;
        rolex = nyarukozone_div.width() - (nyarukozone_mapsize[0] - x);
    }
    if (my > 0) {
        my = 0;
        roley = y;
    } else if (my < myy) {
        my = myy;
        roley = nyarukozone_div.height() - (nyarukozone_mapsize[1] - y);
    }
    $.each(nyarukozone_mapbackgrounds, function(i) {
        nyarukozone_mapbackgrounds[i].css({"top":my+"px","left":mx+"px"});
    });
    $.each(nyarukozone_mapprospects, function(i) {
        nyarukozone_mapprospects[i].css({"top":my+"px","left":mx+"px"});
    });
    var nmbool = [rolex,roley];
    return nmbool;
}