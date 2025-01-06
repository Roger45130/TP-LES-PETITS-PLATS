import { getData } from "../Utils/Api.js";

export const Main = async () => {
  return `
    <main class="container" style="display: none;" id="recipePresentation">
      <div class="choicemenu">
        <div class="list">
          <section class="ingredientsNav">
            <h3 class="titleIngredients">Ingrédients</h3>
            <i class="fa-solid fa-angle-down"></i>
          </section>
          <section class="appareilsNav">
            <h3 class="titleAppareils">Appareils</h3>
            <i class="fa-solid fa-angle-down"></i>
          </section>
          <section class="ustensilesNav">
            <h3 class="titleUstensiles">Ustensiles</h3>
            <i class="fa-solid fa-angle-down"></i>
          </section>
        </div>
        <div class="TitleText">
          <section class="Text">
            <h3 class="titleText">1500 recettes</h3>
          </section>
        </div>
      </div>
      <div id="selectionsContainer"></div>
      <div class="recipePresentation" id="recipeResults">
      <!-- Automatic generation based on the search performed by the user in the search bar in the header and the choices in the ingredients, appliances and utensils in the main -->
      </div>
    </main>
  `;
};

export const initDropdownListeners = async () => {
  const ingredientsNav = document.querySelector(".ingredientsNav");
  const appareilsNav = document.querySelector(".appareilsNav");
  const ustensilesNav = document.querySelector(".ustensilesNav");
  const recipeResults = document.querySelector("#recipeResults");
  const selectionsContainer = document.querySelector("#selectionsContainer");

  const dropdownHandler = async (targetClass, dataKey) => {
    const data = await getData();
    const items = new Set();

    data.recipes.forEach((recipe) => {
      if (dataKey === "ingredients") {
        recipe.ingredients.forEach((ingredient) => items.add(ingredient.ingredient));
      } else if (dataKey === "appliance") {
        items.add(recipe.appliance);
      } else if (dataKey === "ustensils") {
        recipe.ustensils.forEach((ustensil) => items.add(ustensil));
      }
    });

    const dropdown = document.createElement("div");
    dropdown.className = "dropdown";
    dropdown.style.position = "absolute";
    dropdown.style.top = "100%";
    dropdown.style.left = "0";

    Array.from(items).forEach((item) => {
      const dropdownItem = document.createElement("div");
      dropdownItem.className = "dropdown-item";
      dropdownItem.textContent = item;
      dropdownItem.addEventListener("click", async () => {
        const filteredRecipes = data.recipes.filter((recipe) => {
          if (dataKey === "ingredients") {
            return recipe.ingredients.some((ingredient) => ingredient.ingredient === item);
          } else if (dataKey === "appliance") {
            return recipe.appliance === item;
          } else if (dataKey === "ustensils") {
            return recipe.ustensils.includes(item);
          }
        });

        recipeResults.innerHTML = filteredRecipes
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

        const selection = document.createElement("div");
        selection.className = "selectionsDropdown";
        selection.innerHTML = `
          <h3 class="subtitle__SelectionDropdown">${item}</h3>
          <i class="fa-solid fa-xmark SelectionDropdown"></i>
        `;
        selectionsContainer.appendChild(selection);

        selection.querySelector(".fa-xmark__SelectionDropdown").addEventListener("click", () => {
          selectionsContainer.removeChild(selection);
        });
      });
      dropdown.appendChild(dropdownItem);
    });

    const targetElement = document.querySelector(`.${targetClass}`);
    targetElement.appendChild(dropdown);
  };

  ingredientsNav.addEventListener("click", () => dropdownHandler("ingredientsNav", "ingredients"));
  appareilsNav.addEventListener("click", () => dropdownHandler("appareilsNav", "appliance"));
  ustensilesNav.addEventListener("click", () => dropdownHandler("ustensilesNav", "ustensils"));
};