/**
 * Live search + tag filter for the Projects page. Progressive enhancement:
 * the full project list is already server-rendered (works with JS off);
 * this script replaces that grid's contents with results fetched from
 * GET /api/projects whenever the search box or a tag chip changes.
 *
 * Note: /api/projects intentionally does not include the live GitHub
 * stats badge (see services/github_service.js) — fetching those per
 * keystroke would multiply calls to GitHub's rate-limited API far faster
 * than a normal page load would. The badge only appears on the initial
 * server-rendered page; search results render without it.
 */
(function () {
  const GRADIENTS = {
    "project-indigo": "bg-gradient-to-br from-indigo-500 to-purple-700",
    "project-green": "bg-gradient-to-br from-emerald-500 to-teal-600",
    "project-blue": "bg-gradient-to-br from-sky-400 to-blue-600",
    "project-rose": "bg-gradient-to-br from-rose-400 to-pink-500",
  };
  const CHIP_ON = ["bg-black", "text-white"];
  const CHIP_OFF = ["bg-gray-200", "text-gray-700"];

  const searchInput = document.getElementById("project-search");
  const grid = document.getElementById("projects-grid");
  const empty = document.getElementById("projects-empty");
  const tagButtons = document.querySelectorAll(".tag-filter-btn");
  if (!searchInput || !grid) return;

  let activeTag = "";

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }

  function renderCard(p) {
    const tags = p.tags.map((t) => `<span class="bg-black text-white text-xs px-3 py-1 rounded-full">${escapeHtml(t)}</span>`).join("");
    return `
      <article class="border-2 border-black rounded-2xl overflow-hidden hover:-translate-y-2 transition-transform">
        <div class="w-full h-56 flex items-center justify-center text-[100px] ${GRADIENTS[p.tone] || ""}" aria-hidden="true">${p.icon}</div>
        <div class="p-6">
          <div class="flex flex-wrap justify-between items-start gap-3 mb-2">
            <h2 class="text-2xl font-bold">${escapeHtml(p.title)}</h2>
            <a href="${p.url}" target="_blank" rel="noopener noreferrer"
               class="bg-black text-white text-sm px-3 py-1.5 rounded-lg flex items-center gap-1 hover:-translate-y-0.5 transition-transform whitespace-nowrap">Code ↗</a>
          </div>
          <p class="text-gray-600 mb-4">${escapeHtml(p.description)}</p>
          <div class="flex flex-wrap gap-2">${tags}</div>
        </div>
      </article>`;
  }

  async function runSearch() {
    const params = new URLSearchParams();
    if (searchInput.value.trim()) params.set("search", searchInput.value.trim());
    if (activeTag) params.set("tag", activeTag);

    const res = await fetch(`/api/projects?${params.toString()}`);
    const projects = await res.json();

    grid.innerHTML = projects.map(renderCard).join("");
    empty.classList.toggle("hidden", projects.length > 0);
  }

  // Debounce: wait until the user pauses typing for 250ms before firing a
  // request, instead of one fetch per keystroke.
  let debounceTimer;
  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runSearch, 250);
  });

  tagButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeTag = btn.dataset.tag;
      tagButtons.forEach((b) => {
        const on = b === btn;
        b.setAttribute("aria-pressed", String(on));
        b.classList.remove(...(on ? CHIP_OFF : CHIP_ON));
        b.classList.add(...(on ? CHIP_ON : CHIP_OFF));
      });
      runSearch();
    });
  });

  // Arriving from the site-wide Ctrl+K search (/projects?search=...): pre-fill
  // and run that search immediately instead of showing the full unfiltered list.
  const initialSearch = new URLSearchParams(window.location.search).get("search");
  if (initialSearch) {
    searchInput.value = initialSearch;
    runSearch();
  }
})();
