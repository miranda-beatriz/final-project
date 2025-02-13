document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-button");
    const searchInput = document.getElementById("searchInput");
    const randomButton = document.getElementById("random-button");

    // Verifica se os elementos existem antes de adicionar eventos
    if (!searchButton || !searchInput || !randomButton) {
        console.error("Elementos do DOM não foram encontrados!");
        return;
    }

    searchButton.addEventListener("click", async function () {
        const query = searchInput.value.trim();

        if (query === "") {
            console.error("Por favor, digite um termo de pesquisa.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5173/search?query=${query}`);
            if (!response.ok) throw new Error("Erro ao buscar receitas");

            const data = await response.json();
            displayRecipes(data.hits);
        } catch (error) {
            console.error("Erro ao buscar receitas:", error);
        }
    });

    randomButton.addEventListener("click", async function () {
        try {
            const response = await fetch("http://localhost:5173/random");
            const data = await response.json();
            displayRecipes([data]);
        } catch (error) {
            console.error("Erro ao buscar receita aleatória:", error);
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
                <p><a href="${recipe.url}" target="_blank">Ver Receita</a></p>
            `;

            results.appendChild(recipeDiv);
        });
    } else {
        results.innerHTML = "<p>Nenhuma receita encontrada.</p>";
    }
}
