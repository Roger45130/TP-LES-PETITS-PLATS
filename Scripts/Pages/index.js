import { Header } from "../Components/Header.js";
import { Main, initDropdownListeners } from "../Components/Main.js";
import { getData } from "../Utils/Api.js";

// Fonction pour effacer les paramètres de l'URL
const clearURLParams = () => {
  const url = new URL(window.location.href);
  url.search = ""; // Efface tous les paramètres de l'URL
  history.replaceState(null, "", url.toString());
};

// Effacer les paramètres de l'URL lors du chargement initial de la page
clearURLParams();

document.body.innerHTML = `
  <div class="wrapper">
    ${Header()}
    ${await Main()}
  </div>
`;

const searchInput = document.querySelector(".searchInput");
const searchButton = document.querySelector(".searchButton");
const suggestionsBox = document.querySelector(".suggestions");
const recipePresentation = document.querySelector("#recipePresentation");
const recipeResults = document.querySelector("#recipeResults");

// Fonction pour mettre à jour l'URL avec les paramètres de recherche
const updateURL = (key, value) => {
  const url = new URL(window.location.href);
  url.searchParams.set(key, value);
  history.replaceState(null, "", url.toString());
};

// Gestion de l'entrée dans la barre de recherche
searchInput.addEventListener("input", async (event) => {
  const query = event.target.value.trim().toLowerCase();

  if (query.length >= 3) {
    const data = await getData();
    const matchingRecipes = data.recipes.filter((recipe) => {
      return (
        recipe.name.toLowerCase().includes(query) ||
        recipe.ingredients.some((ingredient) =>
          ingredient.ingredient.toLowerCase().includes(query)
        )
      );
    });

    const suggestions = matchingRecipes
      .map((recipe) => `<div class="suggestion">${recipe.name}</div>`)
      .join("");

    suggestionsBox.innerHTML = suggestions;
    suggestionsBox.style.display = "block";

    // Mettre à jour l'URL avec la recherche
    updateURL("search", query);
  } else {
    suggestionsBox.style.display = "none";
  }
});

// Gestion du clic sur le bouton de recherche
searchButton.addEventListener("click", async () => {
  const query = searchInput.value.trim().toLowerCase();

  if (query.length >= 3) {
    const data = await getData();
    const matchingRecipes = data.recipes.filter((recipe) => {
      return (
        recipe.name.toLowerCase().includes(query) ||
        recipe.ingredients.some((ingredient) =>
          ingredient.ingredient.toLowerCase().includes(query)
        )
      );
    });

    recipeResults.innerHTML = matchingRecipes
      .map(
        (recipe) => `
          <section class="cards">
            <div class="imageWrapper">
              <img
                src="Assets/Images/${recipe.image}"
                alt="${recipe.name}"
                class="RecipePicture"
              />
              <div class="timerecipe">
                <h4 class="subtitle__time">${recipe.time}min</h4>
              </div>
            </div>
            <h3 class="recipeTitle">${recipe.name}</h3>
            <div class="recipeDetails">
              <div class="recipe">
                <h4 class="subtitle__h4__recipe">Recette</h4>
                <p class="paragraph">${recipe.description}</p>
              </div>
              <div class="ingredients">
                <h4 class="subtitle__h4__ingredient">Ingrédients</h4>
                <div class="ingredientsDetails">
                  ${recipe.ingredients
                    .map(
                      (ingredient) => `
                        <div class="ingredientName">
                          <div class="name">${ingredient.ingredient}</div>
                          <div class="quantity">${
                            ingredient.quantity ? `${ingredient.quantity} ${ingredient.unit || ""}` : ""
                          }</div>
                        </div>
                      `
                    )
                    .join("")}
                </div>
              </div>
            </div>
          </section>
        `
      )
      .join("");

    recipePresentation.style.display = "block";

    // Mettre à jour l'URL avec la recherche
    updateURL("search", query);
  }
});

// Fonction pour mettre à jour l'URL lors de la sélection dans les menus dropdown
const updateDropdownURL = (key, value) => {
  const url = new URL(window.location.href);
  const currentValues = url.searchParams.get(key)
    ? url.searchParams.get(key).split(",")
    : [];
  if (!currentValues.includes(value)) {
    currentValues.push(value);
  }
  url.searchParams.set(key, currentValues.join(","));
  history.replaceState(null, "", url.toString());
};

// Initialize dropdown listeners avec gestion des mises à jour URL
await initDropdownListeners();
document.querySelectorAll(".listIngredients, .listAppareils, .listUstensiles").forEach((dropdown) => {
  dropdown.addEventListener("click", (event) => {
    if (event.target.textContent) {
      const key =
        dropdown.classList.contains("listIngredients")
          ? "ingredients"
          : dropdown.classList.contains("listAppareils")
          ? "appliances"
          : "ustensils";
      updateDropdownURL(key, event.target.textContent.trim().toLowerCase());
    }
  });
});