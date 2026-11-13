/**
 * Applies the current theme (from window.themeStore) to <html> and wires
 * up the header's toggle button. Runs immediately (not on DOMContentLoaded)
 * so the class is set before first paint, avoiding a flash of the wrong
 * theme when navigating between pages.
 */
(function () {
  function apply(theme) {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }
  apply(window.themeStore.get());
  window.themeStore.subscribe(apply);

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
      window.themeStore.set((t) => (t === "dark" ? "light" : "dark"));
    });
  });
})();
