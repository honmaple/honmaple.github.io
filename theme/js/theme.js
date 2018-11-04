function setCookie(name,value,expiredays)
{
    var exdate=new Date();
    exdate.setDate(exdate.getDate()+expiredays);
    document.cookie=name+ "=" +escape(value)+ ((expiredays===null) ? "" : ";expires="+exdate.toGMTString() + ";path=/");
}
function getCookie(name)
{
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
function changeTheme(name, css) {
    removeTheme();

    var element = document.createElement('link');
    element.type = "text/css";
    element.id = "theme-css";
    element.rel = "stylesheet";
    element.href = css;
    document.getElementsByTagName("head")[0].appendChild(element);
    setCookie('theme',name,3);
}
function removeTheme() {
    var element = document.getElementById("theme-css");
    if (element) {
        document.getElementsByTagName("head")[0].removeChild(element);
        setCookie("theme","default",3);
    }
}
function toggleTheme() {
    theme = getCookie('theme');
    var index = themeList.indexOf(theme) + 1;
    if (index > 0 && index === themeList.length) {
        return removeTheme();
    }
    return changeTheme(themeList[index],themeCSS[themeList[index]]);
}
var themeList = ["black", "tree"];
var themeCSS = {
    black: "/theme/css/main-black.css",
    tree: "/theme/css/main-tree.css",
};
var theme = getCookie('theme');
if (themeList.indexOf(theme) > -1) {
    changeTheme(theme, themeCSS[theme]);
}
