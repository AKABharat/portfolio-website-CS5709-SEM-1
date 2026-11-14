/** User schema: credentials for signup/login, referenced by Blog.author. Depends on mongoose. */
const mongoose = require("mongoose");

const userModel = mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userModel);
