require("dotenv").config();

const express = require("express");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blog");
const mongoose = require("mongoose");

const app = express();
const PORT = 8000;
app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongodb (Database) Connected"))
  .catch((err) => console.log("ERROR: ", err));

app.use("/", authRoutes);
app.use("/", blogRoutes);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/education", (req, res) => {
  res.render("education");
});

app.get("/professional-knowledge", (req, res) => {
  res.render("professional-knowledge");
});

app.get("/projects", (req, res) => {
  res.render("projects");
});

app.get("/gallery", (req, res) => {
  res.render("gallery");
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log("Logout error: ", err);
    res.clearCookie("connect.sid");
    res.redirect("/blog");
  });
});

// 404 catch-all 
app.use((req, res) => {
  res.status(404).render("404");
});

app.listen(PORT, () => {
  console.log("server listening on port: ", PORT);
});
