const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

const {
  signupPageHandle,
  signupCreationHandle,
  loginPageHandle,
  loginCreationHandle,
  logoutHandle,
} = require("../controllers/user_controller");

router.route("/signup").get(signupPageHandle).post(signupCreationHandle);

router.route("/login").get(loginPageHandle).post(loginCreationHandle);

router.route("/logout").get(logoutHandle);

module.exports = router;
