function switchTheme(n) {
    const themes = ["light", "dark"];
    const themeStorage = localStorage;

    let oldTheme = themeStorage.getItem("theme");
    // don't switch theme
    if (n) {
        if (oldTheme) {
            window.document.documentElement.setAttribute('data-theme', oldTheme);
        }
        return;
    }
    let newTheme = "";
    if (oldTheme) {
        let index = themes.indexOf(oldTheme);
        if (index == themes.length - 1) {
            newTheme = "";
        } else {
            newTheme = themes[index + 1];
        }
    } else {
        newTheme = themes[0];
    }
    if (newTheme == "") {
        themeStorage.removeItem("theme");
        window.document.documentElement.removeAttribute('data-theme');
    } else {
        themeStorage.setItem("theme", newTheme);
        window.document.documentElement.setAttribute('data-theme', newTheme);
    }
}

switchTheme(true);
