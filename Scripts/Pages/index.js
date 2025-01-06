import { Header } from "../Components/Header.js";
import { Main, initDropdownListeners } from "../Components/Main.js";
import { getData } from "../Utils/Api.js";

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
  } else {
    suggestionsBox.style.display = "none";
  }
});

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
  }
});

// Initialize dropdown listeners
await initDropdownListeners();