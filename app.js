require("dotenv").config();

const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const pageRoutes = require("./routes/pages");
const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blog");
const apiRoutes = require("./routes/api");
const { attachCsrfToken } = require("./middleware/csrf");

/**
 * Express app configuration only — no DB connection or app.listen() here.
 * That split (see server.js) lets tests import this module and exercise
 * routes with Supertest without needing a live MongoDB connection.
 */
const app = express();
app.set("view engine", "ejs");
app.set("trust proxy", 1); // required for secure cookies to work behind Render's reverse proxy

const isProduction = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test";

const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
};

// Persist sessions in MongoDB so logins survive a restart/redeploy, instead
// of the Phase 1 in-memory store. Skipped in tests, which run without a DB.
if (!isTest && process.env.MONGO_URI) {
  sessionOptions.store = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
  });
}

app.use(session(sessionOptions));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(attachCsrfToken);

app.use("/", pageRoutes);
app.use("/", authRoutes);
app.use("/", blogRoutes);
app.use("/api", apiRoutes);

// 404 catch-all
app.use((_req, res) => {
  res.status(404).render("404");
});

module.exports = app;
