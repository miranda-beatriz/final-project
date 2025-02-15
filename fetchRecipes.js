const axios = require('axios');
require('dotenv').config(); // Ensure .env is loaded

const BASE_URL = "https://api.edamam.com/api/recipes/v2";
const API_ID = process.env.API_ID;
const API_KEY = process.env.API_KEY;

async function getRecipes(query) {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                type: "public",
                q: query,
                app_id: API_ID,
                app_key: API_KEY
            }
        });

        console.log("Recipes:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error in request:", error.response?.data || error.message);
        throw new Error("Failed to fetch recipes");
    }
}

// Test Function
getRecipes("chicken").then(data => console.log(data));
