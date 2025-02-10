async function searchRecipe() {
    const query = document.getElementById('searchInput').value;
    const response = await fetch(`http://localhost:3000/search?query=${query}`);
    const data = await response.json();
    displayRecipes(data.hits);
}

async function getRandomRecipe() {
    const response = await fetch('http://localhost:3000/random');
    const data = await response.json();
    displayRecipes([data]);
}

function displayRecipes(recipes) {
    const results = document.getElementById('results');
    results.innerHTML = '';
    recipes.forEach(recipe => {
        const div = document.createElement('div');
        div.innerHTML = `<h3>${recipe.recipe.label}</h3><img src="${recipe.recipe.image}" width="200"><p><a href="${recipe.recipe.url}" target="_blank">View Recipe</a></p>`;
        results.appendChild(div);
    });
}
document.getElementById('search-button').addEventListener('click', async () => {
    const query = document.getElementById('search-input').value;
    if (query) {
        const response = await fetch(`/search?query=${query}`);
        const data = await response.json();
        displayRecipes(data);
    }
});

document.getElementById('random-button').addEventListener('click', async () => {
    const response = await fetch('/random');
    const data = await response.json();
    displayRecipes({ hits: [data] });
});

function displayRecipes(data) {
    const results = document.getElementById('recipe-results');
    results.innerHTML = '';
    if (data.hits.length > 0) {
        data.hits.forEach(hit => {
            const recipe = hit.recipe;
            const recipeDiv = document.createElement('div');
            recipeDiv.innerHTML = `
                <h3>${recipe.label}</h3>
                <img src="${recipe.image}" alt="${recipe.label}" width="200">
                <p><a href="${recipe.url}" target="_blank">View Recipe</a></p>
            `;
            results.appendChild(recipeDiv);
        });
    } else {
        results.innerHTML = '<p>No recipes found.</p>';
    }
}
