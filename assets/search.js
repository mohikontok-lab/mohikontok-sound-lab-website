// Site search for mohikontok.com (static site: searches a JSON index).
// The search form submits with GET to search.html?q=..., and this script
// renders the matching pages. Matching is word-by-word against each page's
// title, description and keywords; title matches rank first.
(function () {
  var params = new URLSearchParams(window.location.search);
  var query = (params.get("q") || "").trim();
  var statusEl = document.getElementById("search-status");
  var resultsEl = document.getElementById("search-results");

  // Prefill every search box on the page with the current query.
  document.querySelectorAll('input[name="q"]').forEach(function (input) {
    input.value = query;
  });

  if (!statusEl || !resultsEl) return;

  function setStatus(text) {
    statusEl.textContent = text;
  }

  if (!query) {
    setStatus("Type something above to search the studio, music, prices, and blog.");
    return;
  }

  var words = query.toLowerCase().split(/\s+/).filter(Boolean);

  function haystack(entry) {
    return (entry.title + " " + entry.description + " " + (entry.keywords || "")).toLowerCase();
  }

  fetch("assets/search-index.json")
    .then(function (resp) {
      if (!resp.ok) throw new Error("index not found");
      return resp.json();
    })
    .then(function (entries) {
      var scored = [];
      entries.forEach(function (entry) {
        var hay = haystack(entry);
        var title = entry.title.toLowerCase();
        var ok = words.every(function (w) { return hay.indexOf(w) !== -1; });
        if (!ok) return;
        var score = 0;
        words.forEach(function (w) {
          score += title.indexOf(w) !== -1 ? 2 : 1;
        });
        scored.push({ entry: entry, score: score });
      });
      scored.sort(function (a, b) { return b.score - a.score; });

      resultsEl.innerHTML = "";
      if (!scored.length) {
        setStatus("No results for “" + query + "”. Try another word — or start here:");
        var popular = [
          ["Book a session", "index.html#booking"],
          ["Recording studio prices", "bronx-recording-studio-prices.html"],
          ["Bengali music", "music.html"],
          ["Rehearsal space", "rehearsal-space-bronx.html"]
        ];
        var list = document.createElement("ul");
        list.className = "search-results";
        popular.forEach(function (item) {
          var li = document.createElement("li");
          var a = document.createElement("a");
          a.href = item[1];
          a.textContent = item[0];
          li.appendChild(a);
          list.appendChild(li);
        });
        resultsEl.appendChild(list);
        return;
      }

      setStatus(scored.length + (scored.length === 1 ? " result" : " results") + " for “" + query + "”:");
      var list = document.createElement("ul");
      list.className = "search-results";
      scored.forEach(function (item) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = item.entry.url;
        a.textContent = item.entry.title;
        var p = document.createElement("p");
        p.textContent = item.entry.description;
        li.appendChild(a);
        li.appendChild(p);
        list.appendChild(li);
      });
      resultsEl.appendChild(list);
    })
    .catch(function () {
      setStatus("Search isn't available right now — please try again in a moment.");
    });
})();
