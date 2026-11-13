const content = require("../services/content_service");
const blogModel = require("../models/blog");

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
    ? { $or: [{ title: { $regex: search, $options: "i" } }, { content: { $regex: search, $options: "i" } }] }
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

module.exports = { listProjects, searchBlogPosts };
