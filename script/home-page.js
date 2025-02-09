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
