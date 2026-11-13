const rateLimit = require("express-rate-limit");

/**
 * Throttles repeated login/signup submissions from the same IP to blunt
 * brute-force and credential-stuffing attempts. On the standard
 * express-session store this resets on restart, same as sessions
 * themselves; swap to a shared store if horizontally scaling.
 */
const makeAuthLimiter = (view) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) =>
      res.status(429).render(view, { error: "Too many attempts. Please wait a few minutes and try again." }),
  });

const loginLimiter = makeAuthLimiter("login");
const signupLimiter = makeAuthLimiter("signup");

module.exports = { loginLimiter, signupLimiter };
