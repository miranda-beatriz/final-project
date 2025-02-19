document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "https://api.edamam.com/api/recipes/v2?type=public&app_id=bf48d5f1&app_key=3b94d1da02571db11df528b9083d5fc3&random=true";
    function getElement(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`Element with ID '${id}' not found!`);
        }
        return element;
    }
    
    const fetchButton = getElement("fetch-random");
    const recipeImage = getElement("recipe-image");
    const recipeTitle = getElement("recipe-title");
    const recipeDescription = getElement("recipe-description");
    const recipeLink = getElement("recipe-link");

    if (!fetchButton || !recipeImage || !recipeTitle || !recipeDescription || !recipeLink) return;

    async function fetchRandomRecipe() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Failed to fetch");
            
            const data = await response.json();
            const recipe = data.hits[0].recipe;
            
            recipeImage.src = recipe.image;
            recipeTitle.textContent = recipe.label;
            recipeDescription.textContent = `Calories: ${Math.round(recipe.calories)}`;
            recipeLink.href = recipe.url;
            recipeLink.style.display = "block";
        } catch (error) {
            console.error("Error fetching recipe:", error);
        }
    }
    
    fetchButton.addEventListener("click", fetchRandomRecipe);
    fetchRandomRecipe(); // Fetch a recipe when the page loads
});
