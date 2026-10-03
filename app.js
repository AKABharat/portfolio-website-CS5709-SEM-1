const express = require("express");
const app = express();

const { connectDB } = require("./dbConnection");
connectDB();

app.set("view engine", "ejs");

const PORT = 8000;
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

app.get("/gallery/pictures", (req, res) => {
  res.render("gallery-pictures");
});

app.get("/gallery/videos", (req, res) => {
  res.render("gallery-videos");
});

app.listen(PORT, () => {
  console.log("server listening on port: ", PORT);
});
