const APP_ID = "bf48d5f1";
const APP_KEY = "3b94d1da02571db11df528b9083d5fc3";
const API_URL = `https://api.edamam.com/api/recipes/v2?type=public&q=chicken&app_id=bf48d5f1&app_key=3b94d1da02571db11df528b9083d5fc3&from=0&to=10`;


document.addEventListener("DOMContentLoaded", () => {
    fetchRecipes();
    loadFavorites();
});

// Fetch recipes from Edamam API
async function fetchRecipes() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        displayRecipes(data.hits.map(hit => hit.recipe));
    } catch (error) {
        console.error("Error fetching recipes:", error);
    }
}

// Display fetched recipes from API
function displayRecipes(recipeList) {
    const container = document.querySelector(".recipe-search .recipe-container");
    container.innerHTML = "";

    recipeList.forEach(recipe => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");

        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.label}">
            <h3>${recipe.label}</h3>
            <button onclick="addToFavorites('${recipe.label}', '${recipe.image}', 'wantToMake')">Want to Make</button>
            <button onclick="addToFavorites('${recipe.label}', '${recipe.image}', 'alreadyMade')">Already Made</button>
        `;

        container.appendChild(recipeCard);
    });
}

// Load favorites from localStorage
function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || { wantToMake: [], alreadyMade: [] };
    displayFavorites("wantToMake", favorites.wantToMake);
    displayFavorites("alreadyMade", favorites.alreadyMade);
}

// Save favorites to localStorage
function saveFavorites(favorites) {
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Display favorite recipes in their respective sections
function displayFavorites(category, recipeList) {
    const container = document.querySelector(`.${category} .recipe-container`);
    container.innerHTML = "";

    recipeList.forEach(recipe => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");

        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.label}">
            <h3>${recipe.label}</h3>
            <button onclick="removeRecipe('${recipe.label}', '${category}')">Remove</button>
        `;

        container.appendChild(recipeCard);
    });
}

// Add a recipe to favorites
async function addToFavorites(label, image, category) {
    const response = await fetch('/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipe: { label, image }, category })
    });

    const result = await response.json();
    alert(result.message);
    loadFavorites();
}


// Remove a recipe from favorites
async function removeRecipe(label, category) {
    const response = await fetch('/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeLabel: label, category })
    });

    const result = await response.json();
    alert(result.message);
    loadFavorites(); // Atualizar favoritos após remoção
}
