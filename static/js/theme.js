function switchTheme(n) {
    const themeList = ["theme-tree"];
    const themeStorage = localStorage;

    let oldTheme = themeStorage.getItem("theme");
    // don't switch theme
    if (n) {
        if (oldTheme) {
            document.documentElement.classList.add(oldTheme);
        }
        return
    }
    let newTheme;
    if (oldTheme) {
        let index = themeList.indexOf(oldTheme);
        if (index == themeList.length - 1) {
            newTheme = "default";
        } else {
            newTheme = themeList[index + 1];
        }
    } else {
        newTheme = themeList[0]
    }
    if (oldTheme && document.documentElement.classList.contains(oldTheme)) {
        document.documentElement.classList.remove(oldTheme);
    }
    if (oldTheme == newTheme || newTheme == "default") {
        themeStorage.removeItem("theme");
    } else {
        if (!document.documentElement.classList.contains(newTheme)) {
            document.documentElement.classList.add(newTheme);
        }
        themeStorage.setItem("theme", newTheme);
    }
}
switchTheme(true)
