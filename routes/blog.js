const express = require("express");
const router = express.Router();
const { requireLogin } = require("../middleware/auth");

const {
  blogListHandle,
  blogDetailHandle,
  blogCreatePageHandle,
  blogCreateHandle,
} = require("../controllers/blog_controller");

router.get("/blog", blogListHandle);
router.get("/blog/new", requireLogin, blogCreatePageHandle);
router.post("/blog/new", requireLogin, blogCreateHandle);
router.get("/blog/:id", blogDetailHandle);

module.exports = router;