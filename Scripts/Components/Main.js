import { getData } from "../Utils/Api.js";

// Fonction principale qui retourne le code HTML du composant principal
export const Main = async () => {
  return `
    <main class="container" style="display: none;" id="recipePresentation">
      <div class="choicemenu">
        <!-- Conteneur pour les menus de navigation -->
        <div class="list">
          <!-- Section pour la navigation par ingrédients -->
          <section class="ingredientsNav">
            <h3 class="titleIngredients">Ingrédients</h3>
            <i class="fa-solid fa-angle-down"></i>
          </section>
          <!-- Section pour la navigation par appareils -->
          <section class="appareilsNav">
            <h3 class="titleAppareils">Appareils</h3>
            <i class="fa-solid fa-angle-down"></i>
          </section>
          <!-- Section pour la navigation par ustensiles -->
          <section class="ustensilesNav">
            <h3 class="titleUstensiles">Ustensiles</h3>
            <i class="fa-solid fa-angle-down"></i>
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

// Fonction pour gérer les événements des dropdowns
export const initDropdownListeners = async () => {
  // Sélection des éléments principaux (ingrédients, appareils, ustensiles)
  const ingredientsNav = document.querySelector(".ingredientsNav");
  const appareilsNav = document.querySelector(".appareilsNav");
  const ustensilesNav = document.querySelector(".ustensilesNav");
  const recipeResults = document.querySelector("#recipeResults");

  // Fonction pour créer et afficher un dropdown
  const dropdownHandler = async (targetClass, dataKey) => {
    const data = await getData(); // Récupérer les données JSON
    const items = new Set(); // Ensemble pour stocker les valeurs uniques

    // Remplir les éléments en fonction de la clé (ingredients, appliance, ustensils)
    data.recipes.forEach((recipe) => {
      if (dataKey === "ingredients") {
        recipe.ingredients.forEach((ingredient) => items.add(ingredient.ingredient));
      } else if (dataKey === "appliance") {
        items.add(recipe.appliance);
      } else if (dataKey === "ustensils") {
        recipe.ustensils.forEach((ustensil) => items.add(ustensil));
      }
    });

    // Créer un conteneur pour la liste déroulante
    const dropdown = document.createElement("div");
    dropdown.className = "dropdown";
    dropdown.style.position = "absolute"; // Positionner sous l'élément parent
    dropdown.style.top = "100%"; // Juste en dessous de l'élément parent
    dropdown.style.backgroundColor = "#FFFFFF"; // Couleur de fond
    dropdown.style.maxHeight = "250px"; // Limiter la hauteur
    dropdown.style.overflowY = "auto"; // Activer le scroll si nécessaire
    dropdown.style.width = "195px"; // Largeur fixe
    dropdown.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)"; // Ombre pour le style

    // Ajouter chaque élément de la liste déroulante
    Array.from(items).forEach((item) => {
      const dropdownItem = document.createElement("div");
      dropdownItem.className = "dropdown-item";
      dropdownItem.textContent = item; // Texte de l'élément
      dropdownItem.style.padding = "10px"; // Espacement
      dropdownItem.style.cursor = "pointer"; // Curseur pointer

      // Changer la couleur de fond au survol
      dropdownItem.addEventListener("mouseenter", () => {
        dropdownItem.style.backgroundColor = "#FFD15B";
      });

      dropdownItem.addEventListener("mouseleave", () => {
        dropdownItem.style.backgroundColor = "#FFFFFF";
      });

      // Action lorsque l'utilisateur clique sur un élément
      dropdownItem.addEventListener("click", async () => {
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
        dropdown.remove(); // Fermer la liste déroulante
        updateRecipes(); // Mettre à jour les recettes
      });

      dropdown.appendChild(dropdownItem); // Ajouter l'élément au dropdown
    });

    const targetElement = document.querySelector(`.${targetClass}`);

    // Supprimer toute ancienne liste déroulante
    const existingDropdown = targetElement.querySelector(".dropdown");
    if (existingDropdown) {
      existingDropdown.remove();
    }

    targetElement.appendChild(dropdown); // Ajouter la nouvelle liste déroulante
  };

  // Mettre à jour les recettes affichées selon les sélections
  const updateRecipes = async () => {
    const data = await getData(); // Récupérer les données
    const selectedItems = Array.from(document.querySelectorAll(".subtitle__SelectionDropdown"))
      .map((el) => el.textContent); // Récupérer les éléments sélectionnés

    // Filtrer les recettes correspondant aux sélections
    const filteredRecipes = data.recipes.filter((recipe) => {
      return selectedItems.every((item) => {
        return (
          recipe.ingredients.some((ingredient) => ingredient.ingredient === item) ||
          recipe.appliance === item ||
          recipe.ustensils.includes(item)
        );
      });
    });

    // Mettre à jour le conteneur des recettes
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

  // Ajouter des gestionnaires d'événements pour chaque menu
  ingredientsNav.addEventListener("click", () => dropdownHandler("ingredientsNav", "ingredients"));
  appareilsNav.addEventListener("click", () => dropdownHandler("appareilsNav", "appliance"));
  ustensilesNav.addEventListener("click", () => dropdownHandler("ustensilesNav", "ustensils"));
};