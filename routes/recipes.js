// routes/recipes.js
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data/recipes.json");

// GET all recipes and render home.ejs
router.get("/", (req, res) => {
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).send("Error reading data");
    }
    const recipes = JSON.parse(data);
    res.render("home", { recipes });
  });
});

module.exports = router;
