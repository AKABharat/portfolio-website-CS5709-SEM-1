/**
 * Tiny framework-free state container (observable store pattern). There's
 * no React/Redux in this stack, so instead of a state-management library
 * this implements the same core idea in ~25 lines: a single source of
 * truth, subscribe() for reactive UI updates, and persistence to
 * localStorage so state survives navigation between pages. Used here for
 * the site theme; any other cross-page client state can reuse createStore.
 */
function createStore(key, initialValue) {
  let state = initialValue;
  try {
    const saved = localStorage.getItem(key);
    if (saved !== null) state = JSON.parse(saved);
  } catch {
    /* localStorage unavailable (private mode, etc.) — fall back to initialValue */
  }

  const listeners = new Set();

  return {
    get: () => state,
    set(next) {
      state = typeof next === "function" ? next(state) : next;
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch {
        /* ignore persistence failures */
      }
      listeners.forEach((fn) => fn(state));
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}

window.themeStore = createStore("theme", "light");
