document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-button");
    const searchInput = document.getElementById("searchInput");
    const randomButton = document.getElementById("random-button");

    if (!searchButton || !searchInput || !randomButton) {
        console.error("DOM elements not found!");
        return;
    }

    searchButton.addEventListener("click", async function () {
        const query = searchInput.value.trim();
        if (query === "") {
            console.error("Please enter a search term.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5173/search", {
                method: "POST", // Agora usando POST
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ query: query }) // Enviando o termo de busca
            });

            if (!response.ok) throw new Error("Error fetching recipes");

            const data = await response.json();
            displayRecipes(data.hits);
        } catch (error) {
            console.error("Error fetching recipes:", error);
        }
    });

    randomButton.addEventListener("click", async function () {
        try {
            const response = await fetch("http://localhost:5173/random");
            const data = await response.json();
            displayRecipes([data]);
        } catch (error) {
            console.error("Error fetching random recipe:", error);
        }
    });
});

function displayRecipes(hits) {
    const results = document.getElementById("recipe-results");
    results.innerHTML = "";

    if (hits && hits.length > 0) {
        hits.forEach(hit => {
            const recipe = hit.recipe;
            const recipeDiv = document.createElement("div");

            recipeDiv.innerHTML = `
                <h3>${recipe.label}</h3>
                <img src="${recipe.image}" alt="${recipe.label}" width="200">
                <p><a href="${recipe.url}" target="_blank">View Recipe</a></p>
            `;

            results.appendChild(recipeDiv);
        });
    } else {
        results.innerHTML = "<p>No recipes found.</p>";
    }
}
