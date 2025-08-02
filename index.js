const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); // to read form body
app.set("view engine", "ejs");

// Read recipe data
const getRecipes = () => {
  const data = fs.readFileSync('./data/recipes.json');
  return JSON.parse(data);
};

// Save recipe data
const saveRecipes = (recipes) => {
  fs.writeFileSync('./data/recipes.json', JSON.stringify(recipes, null, 2));
};

// Routes

app.get("/", (req, res) => {
  const recipes = getRecipes();
  res.render("home", { recipes });
});

app.get("/recipes", (req, res) => {
  const recipes = getRecipes();
  res.render("recipes", { recipes });
});

app.get("/recipes/:id", (req, res) => {
  const recipes = getRecipes();
  const recipe = recipes.find(r => r.id === parseInt(req.params.id));
  if (recipe) {
    res.render("recipe", { recipe });
  } else {
    res.status(404).send("Recipe not found.");
  }
});

// ➕ Show the form
app.get("/add", (req, res) => {
  res.render("add");
});

// 📝 Handle form submission
app.post("/recipes", (req, res) => {
  const recipes = getRecipes();
  const newRecipe = {
    id: recipes.length ? recipes[recipes.length - 1].id + 1 : 1,
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    image: req.body.image || null
  };

  recipes.push(newRecipe);
  saveRecipes(recipes);
  res.redirect("/recipes");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

