const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();



const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
const favoritesFile = path.join(__dirname, 'favorites.json');

const API_ID = process.env.EDAMAM_APP_ID;
const API_KEY = process.env.EDAMAM_APP_KEY;
const BASE_URL = 'https://api.edamam.com/search';

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home-page', 'index.html'));
});


app.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        const response = await axios.get(`${BASE_URL}?q=${query}&app_id=${API_ID}&app_key=${API_KEY}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching recipes' });
    }
});

app.get('/random', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}?q=random&app_id=${API_ID}&app_key=${API_KEY}`);
        const recipes = response.data.hits;
        const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
        res.json(randomRecipe);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching random recipe' });
    }
});

// Function to read favorites
const readFavorites = () => {
    if (!fs.existsSync(favoritesFile)) return { wantToMake: [], alreadyMade: [] };
    return JSON.parse(fs.readFileSync(favoritesFile, 'utf8'));
};

// Function to save favorites
const saveFavorites = (favorites) => {
    fs.writeFileSync(favoritesFile, JSON.stringify(favorites, null, 2));
};

// Route to get favorite recipes
app.get('/favorites', (req, res) => {
    res.json(readFavorites());
});

// Route to add a recipe to favorites
app.post('/favorites', (req, res) => {
    const { recipe, category } = req.body; // category: 'wantToMake' or 'alreadyMade'
    if (!recipe || !category) {
        return res.status(400).json({ error: 'Recipe and category are required' });
    }

    const favorites = readFavorites();
    favorites[category].push(recipe);
    saveFavorites(favorites);
    res.json({ message: 'Recipe saved successfully!' });
});

// Route to remove a recipe from favorites
app.delete('/favorites', (req, res) => {
    const { recipeLabel, category } = req.body;
    if (!recipeLabel || !category) {
        return res.status(400).json({ error: 'Recipe label and category are required' });
    }

    const favorites = readFavorites();
    favorites[category] = favorites[category].filter(recipe => recipe.label !== recipeLabel);
    saveFavorites(favorites);
    res.json({ message: 'Recipe removed successfully!' });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:5173`);
});
