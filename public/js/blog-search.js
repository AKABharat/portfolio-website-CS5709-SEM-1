/**
 * Live search for the Blog page. Progressive enhancement: the full post
 * list is already server-rendered (works with JS off); this replaces the
 * list with results fetched from GET /api/blog whenever the search box
 * changes, debounced so it doesn't fire on every keystroke.
 */
(function () {
  const input = document.getElementById("blog-search");
  const list = document.getElementById("blog-list");
  const empty = document.getElementById("blog-empty");
  if (!input || !list) return;

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }

  function renderPost(post) {
    const date = new Date(post.createdAt).toDateString();
    return `
      <a href="/blog/${post.id}" class="block border-2 border-black rounded-2xl p-6 hover:-translate-y-1 transition-transform">
        <div class="text-2xl font-bold">${escapeHtml(post.title)}</div>
        <div class="text-gray-500 text-sm mt-1">By ${escapeHtml(post.authorName)} · ${date}</div>
        <p class="text-gray-600 mt-3">${escapeHtml(post.excerpt)}</p>
      </a>`;
  }

  async function runSearch() {
    const params = new URLSearchParams();
    if (input.value.trim()) params.set("search", input.value.trim());

    const res = await fetch(`/api/blog?${params.toString()}`);
    const posts = await res.json();

    list.innerHTML = posts.map(renderPost).join("");
    empty.classList.toggle("hidden", posts.length > 0);
  }

  let debounceTimer;
  input.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runSearch, 250);
  });
})();
