function setCookie(name,value,expiredays) {
    var exdate=new Date();
    exdate.setDate(exdate.getDate()+expiredays);
    document.cookie=name+ "=" +escape(value)+ ((expiredays===null) ? "" : ";expires="+exdate.toGMTString() + ";path=/");
}
function getCookie(name) {
    if (document.cookie.length>0) {
        start=document.cookie.indexOf(name + "=");
        if (start!=-1) {
            start=start + name.length+1;
            end=document.cookie.indexOf(";",start);
            if (end==-1) end=document.cookie.length;
            return unescape(document.cookie.substring(start,end));
        }
    }
    return "";
}
function changeTheme(name) {
    var element = document.getElementsByTagName("body")[0];
    if (element) {
        if (!element.classList.contains(name)) {
            element.classList.add(name)
            setCookie('theme',name,3);
        }
    }
}
function removeTheme(name) {
    var element = document.getElementsByTagName("body")[0];
    if (element) {
        element.classList.remove(name)
        setCookie("theme","",3);
    }
}
function switchTheme() {
    var theme = getCookie('theme');
    var index = themeList.indexOf(theme) + 1;
    if (index > 0) {
        removeTheme(theme);
        if (themeList.length === 1 || index === themeList.length) {
            return
        }
    }
    return changeTheme(themeList[index]);
}
var themeList = ["theme-tree"];
var theme = getCookie('theme');
if (themeList.indexOf(theme) > -1) {changeTheme(theme);}
