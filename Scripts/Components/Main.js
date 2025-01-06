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
      <div class="selection__Dropdown"></div>
      <div class="recipePresentation" id="recipeResults"></div>
    </main>
  `;
};

export const initDropdownListeners = async () => {
  const ingredientsNav = document.querySelector(".ingredientsNav");
  const appareilsNav = document.querySelector(".appareilsNav");
  const ustensilesNav = document.querySelector(".ustensilesNav");
  const recipeResults = document.querySelector("#recipeResults");

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
    dropdown.style.backgroundColor = "#FFFFFF";
    dropdown.style.maxHeight = "250px";
    dropdown.style.overflowY = "auto";
    dropdown.style.width = "195px";
    dropdown.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";

    Array.from(items).forEach((item) => {
      const dropdownItem = document.createElement("div");
      dropdownItem.className = "dropdown-item";
      dropdownItem.textContent = item;
      dropdownItem.style.padding = "10px";
      dropdownItem.style.cursor = "pointer";

      dropdownItem.addEventListener("mouseenter", () => {
        dropdownItem.style.backgroundColor = "#FFD15B";
      });

      dropdownItem.addEventListener("mouseleave", () => {
        dropdownItem.style.backgroundColor = "#FFFFFF";
      });

      dropdownItem.addEventListener("click", async () => {
        const selectionDropdown = document.querySelector(".selection__Dropdown");
        const selectionDiv = document.createElement("div");
        selectionDiv.className = "selectionsDropdown";
        selectionDiv.innerHTML = `
          <h3 class="subtitle__SelectionDropdown">${item}</h3>
          <i class="fa-solid fa-xmark SelectionDropdown" style="cursor: pointer;"></i>
        `;

        selectionDiv.querySelector(".SelectionDropdown").addEventListener("click", () => {
          selectionDiv.remove();
          updateRecipes();
        });

        selectionDropdown.appendChild(selectionDiv);

        dropdown.remove(); // Ferme la dropdown
        updateRecipes();
      });

      dropdown.appendChild(dropdownItem);
    });

    const targetElement = document.querySelector(`.${targetClass}`);

    // Supprimer la liste déroulante existante si elle est déjà présente
    const existingDropdown = targetElement.querySelector(".dropdown");
    if (existingDropdown) {
      existingDropdown.remove();
    }

    targetElement.appendChild(dropdown);
  };

  const updateRecipes = async () => {
    const data = await getData();
    const selectedItems = Array.from(document.querySelectorAll(".subtitle__SelectionDropdown"))
      .map((el) => el.textContent);

    const filteredRecipes = data.recipes.filter((recipe) => {
      return selectedItems.every((item) => {
        return (
          recipe.ingredients.some((ingredient) => ingredient.ingredient === item) ||
          recipe.appliance === item ||
          recipe.ustensils.includes(item)
        );
      });
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
  };

  ingredientsNav.addEventListener("click", () => dropdownHandler("ingredientsNav", "ingredients"));
  appareilsNav.addEventListener("click", () => dropdownHandler("appareilsNav", "appliance"));
  ustensilesNav.addEventListener("click", () => dropdownHandler("ustensilesNav", "ustensils"));
};