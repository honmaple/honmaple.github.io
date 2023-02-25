function highlightResult(element, tokens) {
  var nodeFilter = {
    acceptNode: function (node) {
      if (/^[\t\n\r ]*$/.test(node.nodeValue)) {
        return NodeFilter.FILTER_SKIP
      }
      return NodeFilter.FILTER_ACCEPT
    }
  }
  let walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, nodeFilter, false)
  let node = null;

  while ((node = walker.nextNode())) {
    const text = node.textContent.toLowerCase();
    let found = false;
    for (var i = 0; i < tokens.length && !found; i++) {
      const token = tokens[i].toString();
      const startIndex = text.indexOf(token);
      if (startIndex == -1) {
        continue;
      }
      let range = document.createRange();
      range.setStart(node, startIndex);
      range.setEnd(node, startIndex + token.length);
      let mark = document.createElement('mark');
      range.surroundContents(mark);
      found = true;
    }
    walker.nextNode();
  }
}

function buildResultElement(item) {
  let element = document.createElement("li");
  element.innerHTML = '<div class="entry-header">'
    + `<h1 class="entry-title" data-field="title"><a href="${item.permalink}">${item.title}</a></h1>`
    + '</div>'
    + `<div class="entry-content entry-summary" data-field="content">${item.summary}</div>`
    + '<div class="text-center">'
    + `<a class="btn entry-read-more" href="${item.permalink}">阅读全文 »</a>`
    + '</div>';
  return element;
}

function initSearch() {
  var $searchInput = document.getElementById("search-input");
  var $searchResults = document.querySelector(".search-results");
  var $searchResultsCount = document.querySelector(".search-results__count");
  var $searchResultsItems = document.querySelector(".search-results__items");
  var MAX_ITEMS = 10;

  var indexData;
  var indexInit = async function () {
    if (indexData === undefined) {
      indexData = fetch("/index.json")
        .then(async function(response) {
          let posts = await response.json();
          return {
            index: lunr(function() {
              this.ref("index");
              this.field("title");
              this.field("content");
              posts.forEach(post => {
                this.add(post)
              })
            }),
            posts: posts,
          };
        });
    }
    let res = await indexData;
    return res;
  }

  var currentInput = "";
  var doSearch = async function () {
    var input = $searchInput.value.trim();
    if (input === currentInput) {
      return;
    }
    $searchResults.style.display = input === "" ? "none" : "block";
    $searchResultsItems.innerHTML = "";
    currentInput = input;
    if (currentInput === "") {
      return;
    }

    var data = await indexInit()
    var results = data.index.search(input);

    if (results.length == 0) {
      $searchResultsCount.innerHTML = `<span>No search results for '${currentInput}'.</span>`
    }else {
      $searchResultsCount.innerHTML = `<span>found ${results.length} results for '${currentInput}'</span>`
    }

    var fields = ["title", "content"];
    for (var i = 0; i < Math.min(results.length, MAX_ITEMS); i++) {
      var item = buildResultElement(data.posts[parseInt(results[i].ref)]);
      fields.forEach(function(field) {
        highlightResult(item.querySelector('[data-field=' + field + ']'), currentInput.split(" "));
      })
      $searchResultsItems.appendChild(item);
    }
  }

  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  $searchInput.value = params.q;
  if ($searchInput.value != "") {
    doSearch()
  }
  $searchInput.addEventListener("keyup", async function(event){
    if (event.key == "Enter" || event.keyCode == 13) {
      await doSearch()
    }
  });
}

if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
  initSearch();
} else {
  document.addEventListener("DOMContentLoaded", initSearch);
}