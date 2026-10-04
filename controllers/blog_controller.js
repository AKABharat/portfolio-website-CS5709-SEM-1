const blogModel = require("../models/blog");

const blogListHandle = async (req, res) => {
  const blogs = await blogModel.find().sort({ createdAt: -1 });
  res.render("blog", { blogs, loggedIn: !!req.session.userId });
};

const blogDetailHandle = async (req, res) => {
  const blog = await blogModel.findById(req.params.id);
  if (!blog) return res.redirect("/blog");
  res.render("blog-detail", { blog });
};

const blogCreatePageHandle = (req, res) => {
  res.render("blog-create", { error: null });
};

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
