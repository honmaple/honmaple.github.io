(function () {
  const SNIPPET_RADIUS = 56;
  const RESULT_LIMIT = 20;
  const MARK_CLASS = "rounded bg-primary-500/20 px-0.5 text-inherit dark:bg-primary-500/25";

  function stripHtml(value) {
    const text = String(value || "");
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    return doc.body.textContent || "";
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function getQueryTerms(query) {
    const normalized = String(query || "").trim();
    if (!normalized) return [];

    const terms = normalized.split(/\s+/).filter(Boolean);
    return Array.from(new Set(terms));
  }

  function highlight(value, terms) {
    const text = escapeHtml(value);
    if (!terms.length) return text;

    const pattern = terms.map(escapeRegExp).filter(Boolean).join("|");
    if (!pattern) return text;

    return text.replace(new RegExp("(" + pattern + ")", "gi"), '<mark class="' + MARK_CLASS + '">$1</mark>');
  }

  function createSnippet(content, terms) {
    const text = stripHtml(content).replace(/\s+/g, " ").trim();
    if (!text) return "";

    const lowerText = text.toLowerCase();
    const positions = terms
      .map(function (term) {
        return lowerText.indexOf(term.toLowerCase());
      })
      .filter(function (position) {
        return position >= 0;
      });

    const firstMatch = positions.length ? Math.min.apply(Math, positions) : 0;
    const start = Math.max(0, firstMatch - SNIPPET_RADIUS);
    const end = Math.min(text.length, firstMatch + SNIPPET_RADIUS);
    const prefix = start > 0 ? "..." : "";
    const suffix = end < text.length ? "..." : "";

    return prefix + text.slice(start, end) + suffix;
  }

  function getLabels(root) {
    return {
      empty: root.getAttribute("data-search-empty") || "Enter keywords to search.",
      loading: root.getAttribute("data-search-loading") || "Searching...",
      noResults: root.getAttribute("data-search-no-results") || "No results found.",
      error: root.getAttribute("data-search-error") || "Search index failed to load.",
      count: root.getAttribute("data-search-count") || "%d results found.",
    };
  }

  function setStatus(status, text, isCentered) {
    if (status) {
      status.textContent = text;
      status.classList.toggle("text-center", Boolean(isCentered));
    }
  }

  function normalizeDocument(item, index) {
    return {
      id: index,
      title: String(item.title || ""),
      content: stripHtml(item.content || ""),
      permalink: String(item.permalink || ""),
    };
  }

  function createIndex(docs) {
    const Document = window.FlexSearch && window.FlexSearch.Document;
    const Charset = window.FlexSearch && window.FlexSearch.Charset;

    if (!Document) {
      throw new Error("FlexSearch is not loaded.");
    }

    const index = new Document({
      tokenize: "strict",
      encoder: Charset && Charset.CJK,
      document: {
        id: "id",
        index: [
          {
            field: "title",
            tokenize: "strict",
            resolution: 9,
          },
          {
            field: "content",
            tokenize: "strict",
            resolution: 5,
          },
        ],
        store: ["title", "content", "permalink"],
      },
    });

    docs.forEach(function (doc) {
      index.add(doc);
    });

    return index;
  }

  function flattenResults(results) {
    const seen = new Map();

    results.forEach(function (group) {
      (group.result || []).forEach(function (entry) {
        if (!seen.has(entry.id)) {
          seen.set(entry.id, entry.doc);
        }
      });
    });

    return Array.from(seen.values());
  }

  function renderResults(container, docs, terms) {
    container.innerHTML = docs
      .map(function (doc) {
        const title = highlight(doc.title, terms);
        const snippet = highlight(createSnippet(doc.content, terms), terms);
        const titleHtml = doc.permalink
          ? '<a href="' + escapeHtml(doc.permalink) + '" class="hover:text-primary-700 dark:hover:text-primary-500">' + title + "</a>"
          : "<span>" + title + "</span>";

        return (
          '<article class="rounded-lg bg-slate-100/70 px-4 py-3 dark:bg-slate-800/70">' +
          '<h2 class="text-base font-semibold leading-6">' +
          titleHtml +
          "</h2>" +
          (snippet ? '<p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">' + snippet + "</p>" : "") +
          "</article>"
        );
      })
      .join("");
  }

  function syncInput(input) {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q") || "";
    input.value = query;
    return query;
  }

  function updateUrl(query) {
    const url = new URL(window.location.href);
    if (query) {
      url.searchParams.set("q", query);
    } else {
      url.searchParams.delete("q");
    }
    window.history.replaceState({}, "", url);
  }

  async function setupSearchPage() {
    const root = document.querySelector("[data-search-page]");
    if (!root) return;

    const form = root.querySelector("[data-search-form]");
    const input = root.querySelector("[data-search-input]");
    const status = root.querySelector("[data-search-status]");
    const results = root.querySelector("[data-search-results]");
    const indexUrl = root.getAttribute("data-search-index");
    const labels = getLabels(root);

    if (!form || !input || !results || !indexUrl) return;

    let docs = [];
    let index = null;
    let indexReady = null;

    async function loadIndex() {
      if (indexReady) return indexReady;

      indexReady = fetch(indexUrl)
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Search index request failed.");
          }
          return response.json();
        })
        .then(function (items) {
          docs = Array.isArray(items) ? items.map(normalizeDocument) : [];
          index = createIndex(docs);
        });

      return indexReady;
    }

    async function search(query) {
      const terms = getQueryTerms(query);
      results.innerHTML = "";
      updateUrl(query);

      if (!terms.length) {
        setStatus(status, labels.empty);
        return;
      }

      setStatus(status, labels.loading);

      try {
        await loadIndex();
        const found = flattenResults(index.search(query, {
          enrich: true,
          limit: RESULT_LIMIT,
        }));
        const merged = new Map();

        found.forEach(function (doc) {
          if (doc && !merged.has(doc.permalink || doc.title)) {
            merged.set(doc.permalink || doc.title, doc);
          }
        });

        const finalResults = Array.from(merged.values()).slice(0, RESULT_LIMIT);

        if (!finalResults.length) {
          setStatus(status, labels.noResults, true);
          return;
        }

        setStatus(status, labels.count.replace("%d", finalResults.length));
        renderResults(results, finalResults, terms);
      } catch (error) {
        setStatus(status, labels.error);
      }
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      search(input.value.trim());
    });

    search(syncInput(input).trim());
  }

  setupSearchPage();
})();
