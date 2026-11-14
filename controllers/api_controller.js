const content = require("../services/content_service");
const blogModel = require("../models/blog");

/**
 * Escapes regex metacharacters so user-typed search text is matched
 * literally instead of being interpreted as a pattern. Without this, a
 * single unmatched bracket or parenthesis (e.g. searching for "C++ (")
 * throws a MongoDB error instead of returning "no results", and a
 * crafted pattern could make the query pathologically slow (ReDoS).
 * @param {string} str - Raw user input destined for a $regex filter.
 * @returns {string} The same text with regex-special characters escaped.
 */
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * GET /api/projects?search=&tag=
 * Returns the projects list, optionally filtered by free-text search
 * and/or an exact tag match. Powers the live search/filter UI on the
 * Projects page without a full page reload.
 */
const listProjects = (req, res) => {
  const { search = "", tag = "" } = req.query;
  res.json(content.searchProjects({ search, tag }));
};

/**
 * GET /api/blog?search=
 * Searches blog post titles and content (case-insensitive). Powers the
 * live search box on the Blog page; falls back gracefully to the full
 * list when `search` is empty.
 */
const searchBlogPosts = async (req, res) => {
  const search = String(req.query.search || "").trim();
  const filter = search
    ? { $or: [{ title: { $regex: escapeRegex(search), $options: "i" } }, { content: { $regex: escapeRegex(search), $options: "i" } }] }
    : {};

  const posts = await blogModel.find(filter).sort({ createdAt: -1 }).select("title authorName content createdAt");

  res.json(
    posts.map((b) => ({
      id: b._id,
      title: b.title,
      authorName: b.authorName,
      createdAt: b.createdAt,
      excerpt: b.content.length > 150 ? `${b.content.slice(0, 150)}...` : b.content,
    })),
  );
};

/**
 * GET /api/search?q=
 * Innovation feature: a single site-wide search endpoint (powers the
 * Ctrl+K command palette) that combines matching static pages, projects
 * and blog posts into one ranked-free list of results.
 */
const siteSearch = async (req, res) => {
  const q = String(req.query.q || "").trim();
  if (!q) return res.json([]);
  const needle = q.toLowerCase();

  const staticPages = [
    { title: "Home", url: "/", desc: "Hi, I'm Bharat — software engineer turning raw data into clear decisions." },
    { title: "About", url: "/about", desc: "Background, bio, hobbies and technical skills." },
    { title: "Education", url: "/education", desc: "Degrees and certifications." },
    { title: "Professional Knowledge", url: "/professional-knowledge", desc: "Work experience." },
    { title: "Projects", url: "/projects", desc: "Software, data analytics and web development projects." },
    { title: "Gallery", url: "/gallery", desc: "Photos and videos." },
    { title: "Blog", url: "/blog", desc: "Posts and articles." },
  ];

  const pageMatches = staticPages
    .filter((p) => p.title.toLowerCase().includes(needle) || p.desc.toLowerCase().includes(needle))
    .map((p) => ({ type: "page", title: p.title, url: p.url, desc: p.desc }));

  // Link to the in-site Projects page (filtered to this project), not the
  // external GitHub repo — a "search this site" feature should keep you
  // on this site. The repo link is still one click away from there.
  const projectMatches = content
    .searchProjects({ search: q })
    .map((p) => ({ type: "project", title: p.title, url: `/projects?search=${encodeURIComponent(p.title)}`, desc: p.description }));

  const safeQ = escapeRegex(q);
  const blogMatches = await blogModel
    .find({ $or: [{ title: { $regex: safeQ, $options: "i" } }, { content: { $regex: safeQ, $options: "i" } }] })
    .limit(5)
    .select("title content");

  const blogResults = blogMatches.map((b) => ({
    type: "blog",
    title: b.title,
    url: `/blog/${b._id}`,
    desc: b.content.length > 100 ? `${b.content.slice(0, 100)}...` : b.content,
  }));

  res.json([...pageMatches, ...projectMatches, ...blogResults].slice(0, 12));
};

module.exports = { listProjects, searchBlogPosts, siteSearch, escapeRegex };
