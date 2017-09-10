function setCookie(name,value,expiredays)
{
  var exdate=new Date()
  exdate.setDate(exdate.getDate()+expiredays)
  document.cookie=name+ "=" +escape(value)+ ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
}
function getCookie(c_name)
{
  if (document.cookie.length>0) {
    c_start=document.cookie.indexOf(c_name + "=")
    if (c_start!=-1) {
      c_start=c_start + c_name.length+1
      c_end=document.cookie.indexOf(";",c_start)
      if (c_end==-1) c_end=document.cookie.length
      return unescape(document.cookie.substring(c_start,c_end))
    }
  }
  return ""
}
function changeTheme() {
  var element = document.createElement('link');
  element.type = 'text/css';
  element.id = "theme-snow";
  element.rel = 'stylesheet';
  element.href = '/theme/css/main-snow.css';
  document.getElementsByTagName("head")[0].appendChild(element);
  setCookie('theme',other_theme,3);
}
function removeTheme() {
  var element = document.getElementById("theme-snow");
  if (element) {
    document.getElementsByTagName("head")[0].removeChild(element);
  }
  setCookie('theme',default_theme,3);
}
function toggleTheme() {
  if (getCookie('theme') == other_theme) {
    removeTheme();
  } else {
    changeTheme();
  }
}
var default_theme = 'sea';
var other_theme = 'snow';
if (getCookie('theme') == other_theme) {
  changeTheme();
}
