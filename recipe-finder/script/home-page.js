document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-button");
    const searchInput = document.getElementById("searchInput");
    const randomButton = document.getElementById("random-button");
    const results = document.getElementById("recipe-results");

    if (!searchButton || !searchInput || !randomButton || !results) {
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
            console.log("Searching for:", query);
            const response = await fetch(`http://localhost:5173/search?q=${encodeURIComponent(query)}`);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log("Fetched recipes:", data);
            displayRecipes(data.hits);
        } catch (error) {
            console.error("Error fetching recipes:", error);
            results.innerHTML = "<p>Error fetching recipes. Please try again later.</p>";
        }
    });

    randomButton.addEventListener("click", async function () {
        try {
            console.log("Fetching random recipe...");
            const response = await fetch("http://localhost:5173/random");
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log("Random recipe fetched:", data);
            
            if (data.error) {
                console.log("API returned an error:", data.error);
                results.innerHTML = `<p>${data.error}</p>`;
                return;
            }

            displayRecipes([data]);
        } catch (error) {
            console.error("Error fetching random recipe:", error);
            results.innerHTML = "<p>Error fetching random recipe. Please try again later.</p>";
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
