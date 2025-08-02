const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// ✅ Required to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');


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

app.get('/', (req, res) => {
  // Load recipes
  const recipes = JSON.parse(fs.readFileSync('./data/recipes.json', 'utf-8'));

  // Slice the first 4 recipes
  const featuredRecipes = recipes.slice(0, 4);

  // Send them to the home.ejs
  res.render('home', { featuredRecipes });
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
// Map keywords to image filenames
const keywordToImage = {
  burger: 'burger.jpg',
  sandwich: 'sandwich.jpg',
  pizza: 'pizza.jpg',
  pasta: 'pasta.jpg'
};

function getImageFromDescription(description) {
  const descLower = description.toLowerCase();
  for (const keyword in keywordToImage) {
    if (descLower.includes(keyword)) {
      return `/images/${keywordToImage[keyword]}`;
    }
  }
  return '/images/default.jpg'; // fallback image (make sure it's in /public/images)
}

// 📝 Handle form submission
app.post("/recipes", (req, res) => {
  const recipes = getRecipes();

  const autoImage = getImageFromDescription(req.body.description);

  const newRecipe = {
    id: recipes.length ? recipes[recipes.length - 1].id + 1 : 1,
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    image: autoImage
  };

  recipes.push(newRecipe);
  saveRecipes(recipes);
  res.redirect("/recipes");
});







app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


