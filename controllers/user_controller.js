const userModel = require("../models/user");
const bcrypt = require("bcryptjs");

//  singup handle method
const signupPageHandle = async (req, res) => {
  res.render("signup", { error: null });
};

const signupCreationHandle = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ username, password: hashedPassword });
    await newUser.save();
    res.redirect("/login");
  } catch (err) {
    console.log("SIGNUP ERROR:", err);
    res.render("signup", { error: "Username already taken or invalid." });
  }
};

// login method handle

const loginPageHandle = async (req, res) => {
  res.render("login", { error: null });
};

const loginCreationHandle = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.render("login", { error: "Invalid username or password." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.render("login", {
        error: "Something went wrong. Please try again.",
      });
    }
    req.session.userId = user._id;
    req.session.username = user.username;
    res.redirect("/blog");
  } catch (err) {
    console.log("ERROR: ", err);
    res.render("login", { error: "Something went wrong. Please try again." });
  }
};

// logout
const logoutHandle = async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

module.exports = {
  signupPageHandle,
  signupCreationHandle,
  loginPageHandle,
  loginCreationHandle,
  logoutHandle,
};
