const content = require("../services/content_service");

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

/** Renders the Projects page from data/projects.json. */
const projectsHandle = (req, res) => res.render("projects", { projects: content.getProjects() });

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
