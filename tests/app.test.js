const request = require("supertest");
const app = require("../app");

describe("static pages", () => {
  test("GET / renders the home page", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toContain("Bharat");
  });

  test.each(["/about", "/education", "/professional-knowledge", "/projects", "/gallery", "/login", "/signup", "/readme"])(
    "GET %s returns 200",
    async (path) => {
      const res = await request(app).get(path);
      expect(res.status).toBe(200);
    },
  );

  test("GET /health reports ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  test("unknown route returns 404", async () => {
    const res = await request(app).get("/this-route-does-not-exist");
    expect(res.status).toBe(404);
  });
});

describe("JSON API (Phase 3 search/filter)", () => {
  // /api/blog isn't tested here since it queries MongoDB directly, and
  // these tests run against app.js with no live DB connection (see
  // app.js/server.js split). /api/projects is DB-free (reads data/*.json
  // via content_service), so it's safe to exercise without a database.
  test("GET /api/projects returns the full list with no query", async () => {
    const res = await request(app).get("/api/projects");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("GET /api/projects?search= filters by title/description/tags", async () => {
    const res = await request(app).get("/api/projects").query({ search: "weather" });
    expect(res.status).toBe(200);
    expect(res.body.every((p) => p.title.toLowerCase().includes("weather"))).toBe(true);
  });

  test("GET /api/projects?tag= filters by exact tag", async () => {
    const res = await request(app).get("/api/projects").query({ tag: "Python" });
    expect(res.status).toBe(200);
    expect(res.body.every((p) => p.tags.includes("Python"))).toBe(true);
  });
});

describe("auth form protection", () => {
  test("POST /login without a CSRF token is rejected", async () => {
    const res = await request(app).post("/login").send({ username: "x", password: "y" });
    expect(res.status).toBe(403);
  });

  test("POST /signup without a CSRF token is rejected", async () => {
    const res = await request(app).post("/signup").send({ username: "x", password: "password1" });
    expect(res.status).toBe(403);
  });

  test("login page embeds a CSRF token for the form to submit", async () => {
    const res = await request(app).get("/login");
    expect(res.text).toMatch(/name="_csrf" value="[a-f0-9]+"/);
  });
});
