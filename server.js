const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const path = require('path');


const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'home-page', 'index.html'));
});

const API_ID = process.env.EDAMAM_APP_ID;
const API_KEY = process.env.EDAMAM_APP_KEY;
const BASE_URL = 'https://api.edamam.com/search';

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

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:5173`);
});
