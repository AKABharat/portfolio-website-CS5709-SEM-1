const express = require("express");
const router = express.Router();
const { requireLogin, requireOwner } = require("../middleware/auth");
const { verifyCsrfToken } = require("../middleware/csrf");
const { blogValidation } = require("../middleware/validators");

const {
  blogListHandle,
  blogDetailHandle,
  blogCreatePageHandle,
  blogCreateHandle,
} = require("../controllers/blog_controller");

router.get("/blog", blogListHandle);
router.get("/blog/new", requireLogin, requireOwner, blogCreatePageHandle);
router.post("/blog/new", requireLogin, requireOwner, verifyCsrfToken, ...blogValidation, blogCreateHandle);
router.get("/blog/:id", blogDetailHandle);

module.exports = router;
