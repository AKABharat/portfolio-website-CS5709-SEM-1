const express = require("express");
const router = express.Router();

const { verifyCsrfToken } = require("../middleware/csrf");
const { loginLimiter, signupLimiter } = require("../middleware/rateLimiter");
const { signupValidation, loginValidation } = require("../middleware/validators");

const {
  signupPageHandle,
  signupCreationHandle,
  loginPageHandle,
  loginCreationHandle,
  logoutHandle,
} = require("../controllers/user_controller");

router
  .route("/signup")
  .get(signupPageHandle)
  .post(signupLimiter, verifyCsrfToken, ...signupValidation, signupCreationHandle);

router
  .route("/login")
  .get(loginPageHandle)
  .post(loginLimiter, verifyCsrfToken, ...loginValidation, loginCreationHandle);

// GET for a plain link, POST for the logout form on the Blog page (a POST
// can't be triggered by a stray link or prefetch, unlike a GET).
router.route("/logout").get(logoutHandle).post(logoutHandle);

module.exports = router;
