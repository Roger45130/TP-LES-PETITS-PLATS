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
      <div class="recipePresentation" id="recipeResults">
      <!-- Automatic generation based on the search performed by the user in the search bar in the header and the choices in the ingredients, appliances and utensils in the main -->
      </div>
    </main>
  `;
};
