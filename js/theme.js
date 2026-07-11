(function () {
  var storageKey = "theme-mode";
  var root = document.documentElement;
  var saved = null;

  try {
    saved = window.localStorage.getItem(storageKey);
  } catch (error) {}

  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  var theme = saved === "dark" || saved === "light" ? saved : (prefersDark ? "dark" : "light");

  root.dataset.theme = theme;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
})();