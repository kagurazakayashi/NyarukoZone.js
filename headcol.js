//动态加载一个js/css文件
function loadjscssfile(filename, filetype){
if (filetype=="js"){
var fileref=document.createElement('script')
fileref.setAttribute("type","text/javascript")
fileref.setAttribute("src", filename)
}
else if (filetype=="css"){
var fileref=document.createElement("link")
fileref.setAttribute("rel", "stylesheet")
fileref.setAttribute("type", "text/css")
fileref.setAttribute("href", filename)
}
if (typeof fileref!="undefined")
document.getElementsByTagName("head")[0].appendChild(fileref)
}
// loadjscssfile("myscript.js", "js")
// loadjscssfile("javascript.PHP", "js")
// loadjscssfile("mystyle.css", "css")


//移动已经加载过的js/css
function removejscssfile(filename, filetype){
var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none"
var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none"
var allsuspects=document.getElementsByTagName(targetelement)
for (var i=allsuspects.length; i>=0; i--){
if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1)
   allsuspects[i].parentNode.removeChild(allsuspects[i])
}
}
// removejscssfile("somescript.js", "js")
// removejscssfile("somestyle.css", "css")


//替换已经加载的js/css文件
function createjscssfile(filename, filetype){
if (filetype=="js"){
var fileref=document.createElement('script')
fileref.setAttribute("type","text/javascript")
fileref.setAttribute("src", filename)
}
else if (filetype=="css"){
var fileref=document.createElement("link")
fileref.setAttribute("rel", "stylesheet")
fileref.setAttribute("type", "text/css")
fileref.setAttribute("href", filename)
}
return fileref
}

function replacejscssfile(oldfilename, newfilename, filetype){
var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none"
var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none"
var allsuspects=document.getElementsByTagName(targetelement)
for (var i=allsuspects.length; i>=0; i--){
if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(oldfilename)!=-1){
   var newelement=createjscssfile(newfilename, filetype)
   allsuspects[i].parentNode.replaceChild(newelement, allsuspects[i])
}
}
}
// replacejscssfile("oldscript.js", "newscript.js", "js")
// replacejscssfile("oldstyle.css", "newstyle", "css")