const crypto = require("crypto");

/**
 * Lightweight CSRF protection (synchroniser-token pattern) that does not
 * depend on the deprecated `csurf` package. A random token is stored in the
 * session and mirrored to `res.locals.csrfToken` so every EJS form can embed
 * it as a hidden field; `verifyCsrfToken` rejects state-changing requests
 * whose submitted token does not match the one in the session.
 */

/** Ensures the session has a CSRF token and exposes it to views. */
const attachCsrfToken = (req, res, next) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(24).toString("hex");
  }
  res.locals.csrfToken = req.session.csrfToken;
  next();
};

/** Rejects POST/PUT/DELETE requests whose `_csrf` field doesn't match the session token. */
const verifyCsrfToken = (req, res, next) => {
  const submitted = req.body?._csrf;
  if (!submitted || submitted !== req.session.csrfToken) {
    return res.status(403).send("Form session expired. Please go back and try again.");
  }
  next();
};

module.exports = { attachCsrfToken, verifyCsrfToken };
