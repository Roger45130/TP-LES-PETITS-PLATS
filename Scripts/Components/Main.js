import { getData } from "../Utils/Api.js";

// Fonction principale qui retourne le code HTML du composant principal
export const Main = async () => {
  return `
    <main class="container" style="display: none;" id="recipePresentation">
      <div class="choicemenu">
        <!-- Conteneur pour les menus de navigation -->
        <div class="list">
          <!-- Section pour la navigation par ingrédients -->
          <section class="ingredientsNav" style="position: relative;">
            <h3 class="titleIngredients">Ingrédients</h3>
            <i class="fa-solid fa-angle-down"></i>
            <div class="listIngredients" style="display: none; position: absolute; top: 100%; left: 0; width: 195px; max-height: 200px; overflow-y: auto; background-color: white; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); z-index: 10;"></div>
          </section>
          <!-- Section pour la navigation par appareils -->
          <section class="appareilsNav" style="position: relative;">
            <h3 class="titleAppareils">Appareils</h3>
            <i class="fa-solid fa-angle-down"></i>
            <div class="listAppareils" style="display: none; position: absolute; top: 100%; left: 0; width: 195px; max-height: 200px; overflow-y: auto; background-color: white;box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); z-index: 10;"></div>
          </section>
          <!-- Section pour la navigation par ustensiles -->
          <section class="ustensilesNav" style="position: relative;">
            <h3 class="titleUstensiles">Ustensiles</h3>
            <i class="fa-solid fa-angle-down"></i>
            <div class="listUstensiles" style="display: none; position: absolute; top: 100%; left: 0; width: 195px; max-height: 200px; overflow-y: auto; background-color: white; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); z-index: 10;"></div>
          </section>
        </div>
        <!-- Titre pour le nombre de recettes -->
        <div class="TitleText">
          <section class="Text">
            <h3 class="titleText">1500 recettes</h3>
          </section>
        </div>
      </div>
      <!-- Conteneur pour afficher les sélections choisies par l'utilisateur -->
      <div class="selection__Dropdown"></div>
      <!-- Conteneur pour afficher les résultats des recettes -->
      <div class="recipePresentation" id="recipeResults"></div>
    </main>
  `;
};

// Fonction pour gérer les événements des menus dropdown
export const initDropdownListeners = async () => {
  const data = await getData(); // Récupérer les données JSON

  // Fonction pour remplir les listes déroulantes
  const populateDropdown = (dataKey, className) => {
    const uniqueItems = new Set();

    data.recipes.forEach((recipe) => {
      if (dataKey === "ingredients") {
        recipe.ingredients.forEach((ingredient) => uniqueItems.add(ingredient.ingredient));
      } else if (dataKey === "appliance") {
        uniqueItems.add(recipe.appliance);
      } else if (dataKey === "ustensils") {
        recipe.ustensils.forEach((ustensil) => uniqueItems.add(ustensil));
      }
    });

    const dropdown = document.querySelector(`.${className}`);
    dropdown.innerHTML = ""; // Réinitialiser le contenu

    Array.from(uniqueItems).forEach((item) => {
      const option = document.createElement("div");
      option.className = className.slice(4); // Ex: "listIngredients"
      option.textContent = item;
      option.style.cursor = "pointer";
      option.style.padding = "10px";

      // Changer la couleur de fond au survol
      option.addEventListener("mouseenter", () => {
        option.style.backgroundColor = "#FFD15B";
      });

      option.addEventListener("mouseleave", () => {
        option.style.backgroundColor = "#FFFFFF";
      });

      // Action lorsque l'utilisateur clique sur un élément
      option.addEventListener("click", async () => {
        const selectionDropdown = document.querySelector(".selection__Dropdown");
        const selectionDiv = document.createElement("div");
        selectionDiv.className = "selectionsDropdown";
        selectionDiv.innerHTML = `
          <h3 class="subtitle__SelectionDropdown">${item}</h3>
          <i class="fa-solid fa-xmark SelectionDropdown" style="cursor: pointer;"></i>
        `;

        // Permet de supprimer l'élément sélectionné
        selectionDiv.querySelector(".SelectionDropdown").addEventListener("click", () => {
          selectionDiv.remove(); // Supprimer l'élément
          updateRecipes(); // Mettre à jour les recettes affichées
        });

        selectionDropdown.appendChild(selectionDiv); // Ajouter l'élément sélectionné

        dropdown.style.display = "none"; // Fermer la liste déroulante
        updateRecipes(); // Mettre à jour les recettes
      });

      dropdown.appendChild(option);
    });

    dropdown.style.display = "block"; // Afficher la liste déroulante
  };

  // Fonction pour mettre à jour les recettes affichées selon les sélections
  const updateRecipes = () => {
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

    const recipeResults = document.querySelector("#recipeResults");
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

  // Ajouter des gestionnaires d'événements pour les menus
  document.querySelector(".titleIngredients").addEventListener("click", () => {
    populateDropdown("ingredients", "listIngredients");
  });

  document.querySelector(".titleAppareils").addEventListener("click", () => {
    populateDropdown("appliance", "listAppareils");
  });

  document.querySelector(".titleUstensiles").addEventListener("click", () => {
    populateDropdown("ustensils", "listUstensiles");
  });
};