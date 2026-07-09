(function () {
  const THEME_KEY = "theme-mode";
  const ACTIVE_NAV_CLASSES = ["text-primary-700", "dark:text-primary-500"];
  const BACK_TO_TOP_VISIBLE_CLASSES = ["pointer-events-auto", "translate-y-0", "opacity-100"];
  const BACK_TO_TOP_HIDDEN_CLASSES = ["pointer-events-none", "translate-y-2", "opacity-0"];
  const SM_BREAKPOINT = 640;

  function normalizePath(path) {
    if (!path) return "/";
    const normalized = path.replace(/\/+$/, "");
    return normalized === "" ? "/" : normalized;
  }

  function getPreferredTheme() {
    let saved = null;
    try {
      saved = window.localStorage.getItem(THEME_KEY);
    } catch (error) {}

    if (saved === "dark" || saved === "light") {
      return saved;
    }

    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    const isDark = theme === "dark";
    root.dataset.theme = isDark ? "dark" : "light";
    root.classList.toggle("dark", isDark);

    const toggles = document.querySelectorAll("[data-theme-toggle]");

    toggles.forEach(function (toggle) {
      const icon = toggle.querySelector("[data-theme-icon]");
      const darkLabel = toggle.getAttribute("data-label-dark");
      const lightLabel = toggle.getAttribute("data-label-light");

      toggle.setAttribute("aria-pressed", isDark ? "true" : "false");
      toggle.setAttribute("aria-label", isDark ? lightLabel : darkLabel);
      toggle.setAttribute("title", isDark ? lightLabel : darkLabel);

      if (icon) {
        icon.textContent = isDark ? "☼" : "☾";
      }
    });

    updateGiscusTheme(isDark ? "dark" : "light");
  }

  function persistTheme(theme) {
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch (error) {}
  }

  function setupThemeToggle() {
    const toggles = document.querySelectorAll("[data-theme-toggle]");
    if (!toggles.length) return;

    toggles.forEach(function (toggle) {
      toggle.setAttribute("data-label-dark", toggle.getAttribute("data-label-dark") || toggle.getAttribute("data-theme-dark-label") || "Dark");
      toggle.setAttribute("data-label-light", toggle.getAttribute("data-label-light") || toggle.getAttribute("data-theme-light-label") || "Light");
    });

    applyTheme(getPreferredTheme());

    toggles.forEach(function (toggle) {
      toggle.addEventListener("click", function () {
        const nextTheme = document.documentElement.classList.contains("dark") ? "light" : "dark";
        persistTheme(nextTheme);
        applyTheme(nextTheme);
      });
    });

    if (window.matchMedia) {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      media.addEventListener("change", function () {
        let saved = null;
        try {
          saved = window.localStorage.getItem(THEME_KEY);
        } catch (error) {}
        if (saved !== "dark" && saved !== "light") {
          applyTheme(media.matches ? "dark" : "light");
        }
      });
    }
  }

  function setupMobileMenu() {
    const toggle = document.querySelector("[data-menu-toggle]");
    const panel = document.querySelector("[data-menu-panel]");
    if (!toggle || !panel) return;

    toggle.addEventListener("click", function () {
      const isOpen = panel.classList.toggle("hidden") === false;
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  function setupActiveNav() {
    const current = normalizePath(window.location.pathname);
    const links = document.querySelectorAll("[data-nav-link]");

    links.forEach(function (link) {
      const href = normalizePath(link.getAttribute("href"));
      if (href === "/" ? current === "/" : current.indexOf(href) === 0) {
        link.classList.add.apply(link.classList, ACTIVE_NAV_CLASSES);
      }
    });
  }

  function setupTocHighlight() {
    const toc = document.querySelector(".toc");
    if (!toc) return;

    const tocBody = toc.querySelector("div");
    const tocLinks = Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]'));
    if (!tocLinks.length) return;

    const headings = tocLinks
      .map(function (link) {
        const id = link.getAttribute("href").slice(1);
        return document.getElementById(id);
      })
      .filter(Boolean);

    if (!headings.length) return;

    let activeId = "";
    let ticking = false;
    const activationOffset = 96;
    let clickLockUntil = 0;

    function syncActive() {
      let activeLink = null;

      tocLinks.forEach(function (link) {
        if (link.getAttribute("href") === "#" + activeId) {
          link.setAttribute("aria-current", "true");
          activeLink = link;
        } else {
          link.removeAttribute("aria-current");
        }
      });

      if (!activeLink) return;

      if (!tocBody) return;

      toc.classList.add("is-active");
      tocBody.style.setProperty("--toc-active-top", activeLink.offsetTop + activeLink.offsetHeight / 2 + "px");
    }

    function updateActiveFromScroll() {
      if (Date.now() < clickLockUntil) return;

      let nextActiveId = headings[0].id;

      headings.forEach(function (heading) {
        if (heading.getBoundingClientRect().top <= activationOffset) {
          nextActiveId = heading.id;
        }
      });

      if (nextActiveId !== activeId) {
        activeId = nextActiveId;
        syncActive();
      }
    }

    function requestActiveUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        ticking = false;
        updateActiveFromScroll();
      });
    }

    tocLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        activeId = link.getAttribute("href").slice(1);
        clickLockUntil = Date.now() + 700;
        syncActive();
      });
    });

    window.addEventListener("scroll", requestActiveUpdate, { passive: true });
    window.addEventListener("resize", requestActiveUpdate);

    if (!activeId && headings[0]) {
      activeId = headings[0].id;
      syncActive();
    }

    updateActiveFromScroll();
  }

  function setupFloatingToc() {
    const article = document.querySelector(".page-article");
    const toc = document.querySelector(".toc");
    const placeholder = toc ? toc.parentElement : null;
    if (!article || !toc || !placeholder) return;

    const topOffset = 20;
    const exitOffset = topOffset + 24;
    const viewportGutter = 16;
    const minFloatingWidth = 224;
    const maxFloatingWidth = 352;
    let isFloating = false;

    function resetToc() {
      if (!isFloating) return;
      isFloating = false;
      const tocBody = toc.querySelector("div");

      if (tocBody) {
        tocBody.style.transition = "none";
      }

      toc.classList.remove("is-floating");
      placeholder.style.minHeight = "";
      toc.style.position = "";
      toc.style.left = "";
      toc.style.top = "";
      toc.style.width = "";
      toc.style.zIndex = "";
      toc.style.backgroundColor = "";

      window.requestAnimationFrame(function () {
        if (tocBody) {
          tocBody.style.transition = "";
        }
      });
    }

    function floatToc(articleRect, floatingWidth) {
      if (!isFloating) {
        placeholder.style.minHeight = toc.getBoundingClientRect().height + "px";
        isFloating = true;
      }

      toc.classList.add("is-floating");
      toc.style.position = "fixed";
      toc.style.left = articleRect.right + "px";
      toc.style.top = topOffset + "px";
      toc.style.width = floatingWidth + "px";
      toc.style.zIndex = "30";
      toc.style.backgroundColor = "transparent";
    }

    function syncTocPosition() {
      if (window.innerWidth < SM_BREAKPOINT) {
        resetToc();
        return;
      }

      const articleRect = article.getBoundingClientRect();
      const placeholderRect = placeholder.getBoundingClientRect();
      const availableWidth = window.innerWidth - articleRect.right - viewportGutter;
      const floatingWidth = Math.min(maxFloatingWidth, availableWidth);
      const canFitRight = floatingWidth >= minFloatingWidth;
      const shouldFloat = (isFloating ? placeholderRect.top <= exitOffset : placeholderRect.top <= topOffset) && articleRect.bottom > topOffset;

      if (!canFitRight || !shouldFloat) {
        resetToc();
        return;
      }

      floatToc(articleRect, floatingWidth);
    }

    window.addEventListener("scroll", syncTocPosition, { passive: true });
    window.addEventListener("resize", syncTocPosition);
    syncTocPosition();
  }

  function setupBackToTop() {
    const button = document.querySelector("[data-back-to-top]");
    if (!button) return;

    function syncVisibility() {
      if (window.scrollY > 320) {
        button.classList.remove.apply(button.classList, BACK_TO_TOP_HIDDEN_CLASSES);
        button.classList.add.apply(button.classList, BACK_TO_TOP_VISIBLE_CLASSES);
      } else {
        button.classList.remove.apply(button.classList, BACK_TO_TOP_VISIBLE_CLASSES);
        button.classList.add.apply(button.classList, BACK_TO_TOP_HIDDEN_CLASSES);
      }
    }

    button.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", syncVisibility, { passive: true });
    syncVisibility();
  }

  function getGiscusTheme(theme) {
    return theme === "dark" ? "dark_dimmed" : "light";
  }

  function updateGiscusTheme(theme) {
    const iframe = document.querySelector("iframe.giscus-frame");
    if (!iframe || !iframe.contentWindow) return;

    iframe.contentWindow.postMessage(
      {
        giscus: {
          setConfig: {
            theme: getGiscusTheme(theme),
          },
        },
      },
      "https://giscus.app"
    );
  }

  function setupGiscus() {
    const comments = document.querySelector("[data-giscus]");
    if (!comments) return;

    const button = comments.querySelector(".comments-button");
    const container = comments.querySelector(".comments-panel");
    const scriptTemplate = comments.querySelector("[data-giscus-template]");
    if (!button || !container || !scriptTemplate) return;

    button.addEventListener("click", function () {
      if (comments.classList.contains("is-loaded")) return;

      const source = scriptTemplate.content.querySelector("script");
      if (!source) return;

      comments.classList.add("is-loaded");

      const script = source.cloneNode(false);
      script.setAttribute("data-theme", getGiscusTheme(document.documentElement.classList.contains("dark") ? "dark" : "light"));

      container.appendChild(script);
    });
  }

  setupThemeToggle();
  setupMobileMenu();
  setupActiveNav();
  setupTocHighlight();
  setupFloatingToc();
  setupBackToTop();
  setupGiscus();
})();
