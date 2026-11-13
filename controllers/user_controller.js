const userModel = require("../models/user");
const bcrypt = require("bcryptjs");

const GENERIC_LOGIN_ERROR = "Invalid username or password.";

/** Renders the sign-up form. */
const signupPageHandle = async (req, res) => {
  res.render("signup", { error: null });
};

/** Creates a new user account with a bcrypt-hashed password. */
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

/** Renders the login form. */
const loginPageHandle = async (req, res) => {
  res.render("login", { error: null });
};

/**
 * Authenticates a user. Both "unknown username" and "wrong password" fail
 * with the same generic message so a visitor can't enumerate which
 * usernames exist on the site by reading the error text.
 */
const loginCreationHandle = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });
    const passwordMatch = user ? await bcrypt.compare(password, user.password) : false;

    if (!user || !passwordMatch) {
      return res.render("login", { error: GENERIC_LOGIN_ERROR });
    }

    req.session.userId = user._id;
    req.session.username = user.username;
    res.redirect("/blog");
  } catch (err) {
    console.log("ERROR: ", err);
    res.render("login", { error: "Something went wrong. Please try again." });
  }
};

/** Destroys the session and clears the session cookie. */
const logoutHandle = async (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
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
