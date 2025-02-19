const fetch = require('node-fetch');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const getRecipes = require('./fetchRecipes.js');

const app = express();
const PORT = 5173;
app.use(cors());
app.use(express.json());

const favoritesFile = path.join(__dirname, 'favorites.json');
const BASE_URL = "https://api.edamam.com/api/recipes/v2";
const API_ID = process.env.API_ID;
const API_KEY = process.env.API_KEY;
const USER_ID = process.env.USER_ID;

console.log("User ID:", USER_ID);
console.log("API_ID:", API_ID);
console.log("API_KEY:", API_KEY);


// 🔥 Buscar receitas com a API usando fetch
app.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        const url = `${BASE_URL}?type=public&q=${query}&app_id=${API_ID}&app_key=${API_KEY}`;
        const response = await fetch(url, {
            headers: {
                'Edamam-Account-User': USER_ID
            }
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error fetching recipes:", error);
        res.status(500).json({ error: 'Error fetching recipes' });
    }
});
app.get('/random', async (req, res) => {
    try {
        console.log("Fetching random recipe...");
        const url = `${BASE_URL}?type=public&q=chicken&app_id=${API_ID}&app_key=${API_KEY}`;
        const response = await fetch(url, {
            headers: { 'Edamam-Account-User': USER_ID }
        });

        if (!response.ok) {
            console.error(`Erro na API: ${response.status} - ${response.statusText}`);
            return res.status(response.status).json({ error: `API error: ${response.statusText}` });
        }

        const data = await response.json();
        if (!data.hits || data.hits.length === 0) {
            return res.json({ error: "No recipes found" });
        }
        const randomIndex = Math.floor(Math.random() * data.hits.length);
        res.json(data.hits[randomIndex].recipe);
        
    } catch (error) {
        console.error("Error fetching random recipe:", error);
        res.status(500).json({ error: 'Internal server error while fetching random recipe' });
    }
});


// 🔥 Favoritos
const readFavorites = () => {
    if (!fs.existsSync(favoritesFile)) return { wantToMake: [], alreadyMade: [] };
    return JSON.parse(fs.readFileSync(favoritesFile, 'utf8'));
};

const saveFavorites = (favorites) => {
    fs.writeFileSync(favoritesFile, JSON.stringify(favorites, null, 2));
};

app.get('/favorites', (req, res) => {
    res.json(readFavorites());
});

app.post('/favorites', (req, res) => {
    const { recipe, category } = req.body;
    if (!recipe || !category) {
        return res.status(400).json({ error: 'Recipe and category are required' });
    }

    const favorites = readFavorites();
    favorites[category].push(recipe);
    saveFavorites(favorites);
    res.json({ message: 'Recipe saved successfully!' });
});

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

app.use(express.static(path.join(__dirname, "public")));

// 🔥 Inicia o servidor
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
