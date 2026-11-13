/** Redirects anonymous visitors to /login before reaching a protected route. */
const requireLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  next();
};

/**
 * Restricts blog publishing to the portfolio owner. Phase 1 allowed any
 * registered user to post; setting OWNER_USERNAME (env var) now gates
 * publishing to that one account. If OWNER_USERNAME is unset (e.g. a
 * fresh local clone with no account created yet), it falls back to the
 * Phase 1 behaviour of "any logged-in user" so the feature stays demoable
 * out of the box.
 */
const requireOwner = (req, res, next) => {
  const ownerUsername = process.env.OWNER_USERNAME;
  if (ownerUsername && req.session.username !== ownerUsername) {
    return res.status(403).render("403", {
      message: "Only the portfolio owner can publish blog posts.",
    });
  }
  next();
};

module.exports = { requireLogin, requireOwner };
