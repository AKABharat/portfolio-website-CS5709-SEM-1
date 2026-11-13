const express = require("express");
const router = express.Router();

const { listProjects, searchBlogPosts, siteSearch } = require("../controllers/api_controller");

// Read-only JSON endpoints consumed by client-side search/filter. Nothing
// here is state-changing, so no CSRF token is required to call them.
router.get("/projects", listProjects);
router.get("/blog", searchBlogPosts);
router.get("/search", siteSearch);

module.exports = router;
