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
    var element = document.createElement('link');
    element.type = 'text/css';
    element.id = name;
    element.rel = 'stylesheet';
    element.href = css;
    document.getElementsByTagName("head")[0].appendChild(element);
    setCookie('theme',name,3);
}
function removeTheme(name) {
    var element = document.getElementById(name);
    if (element) {
        document.getElementsByTagName("head")[0].removeChild(element);
    }
    setCookie('theme','default',3);
}
function toggleTheme() {
    var theme = getCookie('theme');
    if (theme in themes) {
        removeTheme(theme);
    }else {
        changeTheme("theme-black",themes["theme-black"]);
    }
}
var themes = {
    "theme-black":"/theme/css/main-black.css"
};
var theme = getCookie('theme');
if (theme in themes) {
    changeTheme(theme, themes[theme]);
}
