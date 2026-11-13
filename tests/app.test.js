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
