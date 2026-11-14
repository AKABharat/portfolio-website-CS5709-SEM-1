/** Blog post schema: title/content authored by a User, read by blog_controller and api_controller. Depends on mongoose. */
const mongoose = require("mongoose");

const blogModel = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorName: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Blog", blogModel);
