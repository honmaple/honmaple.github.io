(() => {
  window.__shortcodes = window.__shortcodes || {};

  const selector = "[data-img-lightbox]";
  const stylesheetId = "drift-glightbox-style";
  const vendorScriptId = "drift-glightbox-script";
  const state = window.__shortcodes.lightbox || {
    lightbox: null,
  };

  window.__shortcodes.lightbox = state;

  const getCurrentScript = () => {
    return document.currentScript || document.querySelector("script[data-glightbox-src]");
  };

  const loadStylesheet = () => {
    if (document.getElementById(stylesheetId)) {
      return;
    }

    const currentScript = getCurrentScript();
    const href = currentScript && currentScript.dataset.glightboxCss;

    if (!href) {
      return;
    }

    const link = document.createElement("link");
    link.id = stylesheetId;
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  };

  const refreshLightbox = () => {
    if (!window.GLightbox) {
      return;
    }

    if (state.lightbox) {
      state.lightbox.destroy();
    }

    state.lightbox = window.GLightbox({
      selector,
      touchNavigation: true,
      keyboardNavigation: true,
      loop: false,
      zoomable: false,
      draggable: false,
      openEffect: "zoom",
      closeEffect: "fade",
      slideEffect: "slide",
    });
  };

  const loadScript = () => {
    if (window.GLightbox) {
      refreshLightbox();
      return;
    }

    const existingScript = document.getElementById(vendorScriptId);

    if (existingScript) {
      existingScript.addEventListener("load", refreshLightbox, { once: true });
      return;
    }

    const currentScript = getCurrentScript();
    const src = currentScript && currentScript.dataset.glightboxSrc;

    if (!src) {
      return;
    }

    const script = document.createElement("script");
    script.id = vendorScriptId;
    script.src = src;
    script.defer = true;
    script.addEventListener("load", refreshLightbox, { once: true });
    document.head.appendChild(script);
  };

  const boot = () => {
    loadStylesheet();
    loadScript();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
