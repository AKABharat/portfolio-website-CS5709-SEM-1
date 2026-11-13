const express = require("express");
const router = express.Router();

const {
  homeHandle,
  aboutHandle,
  educationHandle,
  professionalKnowledgeHandle,
  projectsHandle,
  galleryHandle,
} = require("../controllers/page_controller");

router.get("/", homeHandle);
router.get("/about", aboutHandle);
router.get("/education", educationHandle);
router.get("/professional-knowledge", professionalKnowledgeHandle);
router.get("/projects", projectsHandle);
router.get("/gallery", (req, res) => galleryHandle(req, res, "Photos"));
router.get("/gallery/pictures", (req, res) => galleryHandle(req, res, "Photos"));
router.get("/gallery/videos", (req, res) => galleryHandle(req, res, "Videos"));
router.get("/readme", (req, res) => res.render("readme"));
router.get("/health", (req, res) => res.json({ status: "ok", uptime: process.uptime() }));

module.exports = router;
