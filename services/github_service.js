/**
 * Innovation feature: live GitHub repository stats (stars, forks, last
 * push) fetched from the public GitHub REST API, so the Projects page
 * shows real, current numbers instead of static hardcoded ones.
 *
 * Cached in memory for 10 minutes per process. This matters because
 * GitHub's unauthenticated API allows only 60 requests/hour per IP,
 * shared across every visitor hitting this Render instance — without
 * caching, a few page loads in quick succession could exhaust it.
 */
const CACHE_TTL_MS = 10 * 60 * 1000;
const cache = new Map();

/**
 * Fetches star/fork/last-updated stats for a single "owner/repo" slug.
 * Resolves to null on any failure (rate limit, network error, 404) so the
 * caller can render the page normally without the enhancement rather than
 * fail the whole request over a third-party API hiccup.
 * @param {string} repo - "owner/name" GitHub repository slug.
 * @returns {Promise<{stars:number, forks:number, updatedAt:string}|null>}
 */
async function getRepoStats(repo) {
  // Never make a real network call from automated tests: it would make
  // the suite slow, flaky and dependent on GitHub's availability/rate
  // limit for something that isn't the behaviour under test.
  if (process.env.NODE_ENV === "test") return null;

  const cached = cache.get(repo);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.data;

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "akabharat-portfolio" },
    });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const json = await res.json();
    const data = {
      stars: json.stargazers_count,
      forks: json.forks_count,
      updatedAt: json.pushed_at,
    };
    cache.set(repo, { at: Date.now(), data });
    return data;
  } catch {
    return null;
  }
}

/**
 * Fetches stats for several repos in parallel, returning a map keyed by
 * repo slug. Entries that failed to fetch are simply omitted, never throw.
 * @param {string[]} repos - List of "owner/name" slugs.
 * @returns {Promise<Record<string, object>>}
 */
async function getRepoStatsBatch(repos) {
  const results = await Promise.all(repos.map((r) => getRepoStats(r)));
  return repos.reduce((acc, repo, i) => {
    if (results[i]) acc[repo] = results[i];
    return acc;
  }, {});
}

module.exports = { getRepoStats, getRepoStatsBatch };
