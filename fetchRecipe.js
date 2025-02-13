const axios = require('axios');

const BASE_URL = "https://api.edamam.com/api/recipes/v2";
const API_ID = "bf48d5f1";
const API_KEY = "3b94d1da02571db11df528b9083d5fc3";
const USER_ID = "biamiranda"; // Seu usuário da Edamam

async function getRecipes(query) {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                type: "public",
                q: query,
                app_id: API_ID,
                app_key: API_KEY
            },
            headers: {
                "Edamam-Account-User": USER_ID // Adicionando User ID aqui
            }
        });

        console.log("Receitas:", response.data);
        return response.data;
    } catch (error) {
        console.error("Erro na requisição:", error.response?.data || error.message);
        throw new Error("Erro ao buscar receitas");
    }
}

// Teste da função
getRecipes("chicken").then(data => console.log(data));
