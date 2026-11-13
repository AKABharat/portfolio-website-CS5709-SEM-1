const { body, validationResult } = require("express-validator");

/**
 * Builds a validation-chain + error-handling pair for a classic
 * render-on-error form. On failure it re-renders `view` with the first
 * validation message in `error`, matching the app's existing error UX
 * instead of returning raw JSON to a server-rendered page.
 * @param {string} view - EJS view to re-render on validation failure.
 * @param {import('express-validator').ValidationChain[]} chains - Field validators.
 * @returns {Array<Function>} Express middleware chain.
 */
const validate = (view, chains) => [
  ...chains,
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    res.render(view, { error: errors.array()[0].msg });
  },
];

const signupValidation = validate("signup", [
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be 3-30 characters.")
    .isAlphanumeric()
    .withMessage("Username can only contain letters and numbers."),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters."),
]);

const loginValidation = validate("login", [
  body("username").trim().notEmpty().withMessage("Username is required."),
  body("password").notEmpty().withMessage("Password is required."),
]);

const blogValidation = validate("blog-create", [
  body("title").trim().isLength({ min: 3, max: 120 }).withMessage("Title must be 3-120 characters."),
  body("content").trim().isLength({ min: 10, max: 20000 }).withMessage("Post content must be at least 10 characters."),
]);

module.exports = { signupValidation, loginValidation, blogValidation };
