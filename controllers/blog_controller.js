const mongoose = require("mongoose");
const blogModel = require("../models/blog");

/** Renders the Blog list page with all posts, newest first. */
const blogListHandle = async (req, res) => {
  const blogs = await blogModel.find().sort({ createdAt: -1 });
  res.render("blog", { blogs, loggedIn: !!req.session.userId });
};

/**
 * Renders a single blog post. Validates the id is a well-formed ObjectId
 * before querying so a malformed URL (e.g. /blog/not-an-id) yields a clean
 * redirect instead of a Mongoose CastError (which previously crashed the request).
 */
const blogDetailHandle = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.redirect("/blog");
  const blog = await blogModel.findById(req.params.id);
  if (!blog) return res.redirect("/blog");
  res.render("blog-detail", { blog });
};

/** Renders the "write a post" form. */
const blogCreatePageHandle = (req, res) => {
  res.render("blog-create", { error: null });
};

/** Creates a new blog post authored by the current session's user. */
const blogCreateHandle = async (req, res) => {
  try {
    const { title, content } = req.body;
    const newBlog = new blogModel({
      title,
      content,
      author: req.session.userId,
      authorName: req.session.username,
    });
    await newBlog.save();
    res.redirect("/blog");
  } catch (err) {
    console.log("ERROR: ", err);
    res.render("blog-create", { error: "Something went wrong. Try again." });
  }
};

module.exports = {
  blogListHandle,
  blogDetailHandle,
  blogCreatePageHandle,
  blogCreateHandle,
};
