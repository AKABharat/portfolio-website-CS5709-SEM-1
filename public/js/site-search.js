/**
 * Innovation feature: site-wide Ctrl+K / Cmd+K command-palette search.
 * Opens a modal, queries GET /api/search as you type (debounced), and
 * lets you navigate the results with the keyboard (↑/↓/Enter) or a click
 * — the same interaction pattern as VS Code's, GitHub's or Slack's
 * quick-open, built here from scratch with no dependency.
 */
(function () {
  const modal = document.getElementById("site-search-modal");
  const input = document.getElementById("site-search-input");
  const resultsList = document.getElementById("site-search-results");
  const emptyMsg = document.getElementById("site-search-empty");
  const hintMsg = document.getElementById("site-search-hint");
  const triggers = [
    document.getElementById("site-search-trigger"),
    document.getElementById("site-search-trigger-mobile"),
  ].filter(Boolean);
  if (!modal || !input) return;

  const TYPE_ICON = { page: "📄", project: "🛠️", blog: "✍️" };
  let activeIndex = -1;
  let currentResults = [];

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }

  function openModal() {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.style.overflow = "hidden";
    input.value = "";
    input.focus();
    showHint();
  }

  function closeModal() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.style.overflow = "";
  }

  function showHint() {
    resultsList.innerHTML = "";
    emptyMsg.classList.add("hidden");
    hintMsg.classList.remove("hidden");
    currentResults = [];
    activeIndex = -1;
  }

  function renderResults(results) {
    currentResults = results;
    activeIndex = results.length ? 0 : -1;
    hintMsg.classList.add("hidden");
    emptyMsg.classList.toggle("hidden", results.length > 0);

    resultsList.innerHTML = results
      .map(
        (r, i) => `
        <li>
          <a href="${r.url}" data-index="${i}"
             class="site-search-result flex items-start gap-3 px-5 py-3 border-b border-gray-100 last:border-0 ${i === 0 ? "bg-gray-100" : ""}">
            <span aria-hidden="true" class="text-lg">${TYPE_ICON[r.type] || "🔗"}</span>
            <span>
              <span class="block font-bold">${escapeHtml(r.title)}</span>
              <span class="block text-gray-500 text-sm">${escapeHtml(r.desc)}</span>
            </span>
          </a>
        </li>`,
      )
      .join("");
  }

  function setActive(index) {
    const items = resultsList.querySelectorAll(".site-search-result");
    items.forEach((el, i) => el.classList.toggle("bg-gray-100", i === index));
    activeIndex = index;
  }

  async function runSearch() {
    const q = input.value.trim();
    if (!q) return showHint();

    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    renderResults(await res.json());
  }

  let debounceTimer;
  input.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runSearch, 200);
  });

  triggers.forEach((btn) => btn.addEventListener("click", openModal));

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  resultsList.addEventListener("click", (e) => {
    const link = e.target.closest(".site-search-result");
    if (link) closeModal(); // let the <a> navigate normally
  });

  window.addEventListener("keydown", (e) => {
    const isOpen = !modal.classList.contains("hidden");
    const isShortcut = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k";

    if (isShortcut) {
      e.preventDefault();
      isOpen ? closeModal() : openModal();
      return;
    }

    if (!isOpen) return;

    if (e.key === "Escape") {
      closeModal();
    } else if (e.key === "ArrowDown" && currentResults.length) {
      e.preventDefault();
      setActive((activeIndex + 1) % currentResults.length);
    } else if (e.key === "ArrowUp" && currentResults.length) {
      e.preventDefault();
      setActive((activeIndex - 1 + currentResults.length) % currentResults.length);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      window.location.href = currentResults[activeIndex].url;
    }
  });
})();
