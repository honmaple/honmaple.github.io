(() => {
  window.__shortcodes = window.__shortcodes || {};
  window.__shortcodes.memos = window.__shortcodes.memos || {};

  if (window.__shortcodes.memos.ready) return;
  window.__shortcodes.memos.ready = true;

  const selector = "[data-memos]";

  const extractMemos = (data) => {
    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data.memos)) {
      return data.memos;
    }

    if (Array.isArray(data.memoList)) {
      return data.memoList;
    }

    if (Array.isArray(data.items)) {
      return data.items;
    }

    if (Array.isArray(data.data)) {
      return data.data;
    }

    if (data.data && Array.isArray(data.data.memos)) {
      return data.data.memos;
    }

    return [];
  };

  const getMemoDate = (memo) => {
    const value = memo.displayTime || memo.createTime || memo.updateTime || memo.createdAt || memo.updatedAt || memo.createdTs;

    if (!value) {
      return null;
    }

    if (typeof value === "number") {
      return new Date(value > 1000000000000 ? value : value * 1000);
    }

    return new Date(value);
  };

  const formatDate = (date) => {
    if (!date || Number.isNaN(date.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat(document.documentElement.lang || navigator.language, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const configureMarked = (marked) => {
    if (window.__shortcodes.memos.markedConfigured) {
      return;
    }

    marked.use({
      extensions: [
        {
          name: "memoTagParagraph",
          level: "block",
          start(src) {
            return src.match(/^#{1}[^\s#]/)?.index;
          },
          tokenizer(src) {
            const match = src.match(/^(#[^\s#][^\n]*)(?:\n|$)/);

            if (!match) {
              return false;
            }

            return {
              type: "memoTagParagraph",
              raw: match[0],
              text: match[1],
              tokens: this.lexer.inlineTokens(match[1]),
            };
          },
          renderer(token) {
            return `<p>${this.parser.parseInline(token.tokens)}</p>\n`;
          },
        },
        {
          name: "memoTag",
          level: "inline",
          start(src) {
            return src.match(/#(?=\S)/)?.index;
          },
          tokenizer(src) {
            const match = src.match(/^#([^\s#]+)/);

            if (!match) {
              return false;
            }

            return {
              type: "memoTag",
              raw: match[0],
              text: match[0],
            };
          },
          renderer(token) {
            return `<span class="tag">${token.text}</span>`;
          },
        },
      ],
    });

    window.__shortcodes.memos.markedConfigured = true;
  };

  const renderMarkdown = (content, marked) => {
    if (!marked || typeof marked.parse !== "function") {
      return "";
    }

    configureMarked(marked);

    return marked.parse(content, {
      async: false,
      breaks: true,
      gfm: true,
    });
  };

  const renderMemos = (container, memos) => {
    const list = container.querySelector("[data-memos-list]");
    const status = container.querySelector("[data-memos-status]");

    list.textContent = "";
    list.className = "relative pl-5";

    memos.forEach((memo) => {
      const date = getMemoDate(memo);
      const item = document.createElement("div");
      const card = document.createElement("div");
      const meta = document.createElement("div");
      const time = document.createElement("time");
      const content = document.createElement("div");

      item.className = "timeline-item relative pb-3 last:pb-0";
      card.className = "rounded-lg bg-white px-3.5 py-3 transition-none dark:bg-slate-900";
      meta.className = "mb-2 flex items-center justify-between gap-3 text-slate-500 dark:text-slate-400";
      time.className = "block font-mono text-xs uppercase tracking-[0.14em] transition-none";
      content.className = "whitespace-pre-wrap text-base leading-7";

      time.dateTime = date && !Number.isNaN(date.getTime()) ? date.toISOString() : "";
      time.textContent = formatDate(date);
      const memoContent = memo.content || memo.text || "";
      const html = renderMarkdown(memoContent, window.marked);

      if (html) {
        content.className = "prose prose-primary dark:prose-invert prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-pre:my-3";
        content.innerHTML = html;
      } else {
        content.textContent = memoContent;
      }

      if (time.textContent) {
        meta.appendChild(time);

        if (memo.pinned === true) {
          const pinned = document.createElement("span");

          pinned.className = "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-500/10 text-slate-500 dark:text-slate-400";
          pinned.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" class="h-3.5 w-3.5 fill-none stroke-current stroke-2"><path d="m14 4 6 6"></path><path d="m12.5 5.5-4 4L6 9l-2 2 9 9 2-2-.5-2.5 4-4"></path><path d="m8.5 15.5-4 4"></path></svg>';
          meta.appendChild(pinned);
        }

        card.appendChild(meta);
      }

      card.appendChild(content);
      item.appendChild(card);
      list.appendChild(item);
    });

    status.hidden = true;
    list.classList.remove("hidden");
  };

  const fetchMemos = async (endpoint) => {
    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return extractMemos(await response.json());
  };

  const loadContainer = async (container) => {
    if (container.dataset.memosReady === "true") {
      return;
    }

    container.dataset.memosReady = "true";

    const status = container.querySelector("[data-memos-status]");
    const endpoint = container.dataset.endpoint;
    const limit = Number.parseInt(container.dataset.limit || "10", 10);

    if (!endpoint) {
      status.textContent = container.dataset.missing || "";
      return;
    }

    status.textContent = container.dataset.loading || "";

    try {
      const memos = await fetchMemos(endpoint);

      const visibleMemos = memos
        .filter((memo) => memo && (memo.content || memo.text))
        .sort((left, right) => {
          if (left.pinned !== right.pinned) {
            return right.pinned === true ? 1 : -1;
          }

          return (getMemoDate(right)?.getTime() || 0) - (getMemoDate(left)?.getTime() || 0);
        })
        .slice(0, limit);

      if (!visibleMemos.length) {
        status.textContent = container.dataset.empty || "";
        return;
      }

      renderMemos(container, visibleMemos);
    } catch (error) {
      status.textContent = container.dataset.error || "";
    }
  };

  const boot = () => {
    document.querySelectorAll(selector).forEach(loadContainer);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
