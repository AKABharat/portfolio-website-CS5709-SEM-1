const content = require("../services/content_service");

describe("content_service", () => {
  test("getProjects returns the seeded projects", () => {
    expect(content.getProjects().length).toBeGreaterThanOrEqual(4);
  });

  test("searchProjects filters by free-text search", () => {
    const results = content.searchProjects({ search: "RFM" });
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe("rfm-analysis-dashboard");
  });

  test("searchProjects filters by tag", () => {
    const results = content.searchProjects({ tag: "Python" });
    expect(results.every((p) => p.tags.includes("Python"))).toBe(true);
  });

  test("searchGalleryPhotos filters by category", () => {
    const results = content.searchGalleryPhotos({ category: "Work" });
    expect(results.every((p) => p.category === "Work")).toBe(true);
    expect(results.length).toBeGreaterThan(0);
  });

  test("searchGalleryPhotos with category 'All' returns everything", () => {
    expect(content.searchGalleryPhotos({ category: "All" }).length).toBe(content.getGalleryPhotos().length);
  });
});
