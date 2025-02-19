require('dotenv').config();

const BASE_URL = "https://api.edamam.com/api/recipes/v2";
const API_ID = process.env.API_ID;
const API_KEY = process.env.API_KEY;
const USER_ID = process.env.USER_ID;

async function getRecipes(query) {
    try {
        const url = `${BASE_URL}?type=public&q=${query}&app_id=${API_ID}&app_key=${API_KEY}`;
        const response = await fetch(url, {
            headers: {
                'Edamam-Account-User': USER_ID,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Recipes:", JSON.stringify(data, null, 2));
        return data;
    } catch (error) {
        console.error("Error in request:", error.message);
        throw new Error("Failed to fetch recipes");
    }
}

// Test Function
getRecipes("chicken").then(data => console.log(data)).catch(err => console.error(err.message));

module.exports = getRecipes;
