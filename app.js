const express = require("express");
const app = express();

const {connectDB} = require("./dbConnection");
connectDB();

app.set("view engine", "ejs");

const PORT = 8000;
app.get("/", (req,res)=>{
    res.render("index");
});

app.get("/about", (req,res)=>{
    res.render("about");
});

app.listen(PORT, ()=>{
    console.log("server listening on port: ",PORT);
})