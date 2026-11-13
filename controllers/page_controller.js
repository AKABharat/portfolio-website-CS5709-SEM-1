const content = require("../services/content_service");
const { getRepoStatsBatch } = require("../services/github_service");

/** Renders the home page. */
const homeHandle = (req, res) => res.render("index");

/** Renders the About page with bio info, hobbies and skills from data/about.json. */
const aboutHandle = (req, res) => res.render("about", content.getAbout());

/** Renders the Education page with degrees and certifications. */
const educationHandle = (req, res) =>
  res.render("education", {
    education: content.getEducation(),
    certifications: content.getCertifications(),
  });

/** Renders the Professional Knowledge (work experience) page. */
const professionalKnowledgeHandle = (req, res) =>
  res.render("professional-knowledge", { jobs: content.getJobs() });

/**
 * Renders the Projects page. Innovation feature: fetches live GitHub stats
 * (stars/forks) for every project's repo in parallel and merges them in.
 * getRepoStatsBatch never throws, so the page still renders fine — just
 * without the stats badge — if the GitHub API is slow or unreachable.
 */
const projectsHandle = async (req, res) => {
  const projects = content.getProjects();
  const stats = await getRepoStatsBatch(projects.map((p) => p.repo));
  const withStats = projects.map((p) => ({ ...p, stats: stats[p.repo] || null }));
  res.render("projects", { projects: withStats });
};

/**
 * Renders the Gallery page with photo/video data from JSON and the
 * initially-selected tab ('Photos' or 'Videos').
 */
const galleryHandle = (req, res, initial) =>
  res.render("gallery", {
    initial,
    photos: content.getGalleryPhotos(),
    videos: content.getGalleryVideos(),
  });

module.exports = {
  homeHandle,
  aboutHandle,
  educationHandle,
  professionalKnowledgeHandle,
  projectsHandle,
  galleryHandle,
};
