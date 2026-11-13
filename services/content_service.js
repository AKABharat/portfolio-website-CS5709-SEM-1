const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");

/** In-memory cache of parsed JSON files, keyed by filename. */
const cache = new Map();

/**
 * Reads and parses a JSON file from /data, caching the result in memory so
 * the disk is only hit once per file for the lifetime of the process.
 * @param {string} fileName - JSON file name inside the data/ directory.
 * @returns {*} Parsed JSON content.
 */
function readJson(fileName) {
  if (cache.has(fileName)) return cache.get(fileName);
  const raw = fs.readFileSync(path.join(DATA_DIR, fileName), "utf-8");
  const parsed = JSON.parse(raw);
  cache.set(fileName, parsed);
  return parsed;
}

const getProjects = () => readJson("projects.json");
const getEducation = () => readJson("education.json");
const getCertifications = () => readJson("certifications.json");
const getJobs = () => readJson("jobs.json");
const getAbout = () => readJson("about.json");
const getGalleryPhotos = () => readJson("gallery-photos.json");
const getGalleryVideos = () => readJson("gallery-videos.json");

/**
 * Case-insensitive substring match across a set of fields of an object.
 * @param {object} item - Object to test.
 * @param {string[]} fields - Keys of `item` to search within.
 * @param {string} term - Search term.
 * @returns {boolean} True when the term appears in any field.
 */
function matchesSearch(item, fields, term) {
  if (!term) return true;
  const needle = term.toLowerCase();
  return fields.some((field) => {
    const value = item[field];
    if (Array.isArray(value)) return value.some((v) => String(v).toLowerCase().includes(needle));
    return String(value ?? "").toLowerCase().includes(needle);
  });
}

/**
 * Filters the projects list by free-text search and/or an exact tag match.
 * @param {{search?: string, tag?: string}} query - Filter options.
 * @returns {object[]} Matching projects.
 */
function searchProjects({ search = "", tag = "" } = {}) {
  return getProjects()
    .filter((p) => matchesSearch(p, ["title", "description", "tags"], search))
    .filter((p) => !tag || p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));
}

/**
 * Filters gallery photos by free-text search and/or category.
 * @param {{search?: string, category?: string}} query - Filter options.
 * @returns {object[]} Matching photos.
 */
function searchGalleryPhotos({ search = "", category = "" } = {}) {
  return getGalleryPhotos()
    .filter((p) => matchesSearch(p, ["label", "caption", "category"], search))
    .filter((p) => !category || category === "All" || p.category === category);
}

module.exports = {
  getProjects,
  getEducation,
  getCertifications,
  getJobs,
  getAbout,
  getGalleryPhotos,
  getGalleryVideos,
  searchProjects,
  searchGalleryPhotos,
};
