export const Header = () => {
  return `
      <header class="header">
        <img
          src="Assets/Images/Banner__Header.jpg"
          alt="Plat Asiatique"
          class="HeaderPicture"
        />
        <div class="overlay">
          <div class="logo">
            <img
            src="Assets/Logo/LogoLesPetitsPlats.png"
            alt="Logo Le Petits Plats"
            class="LogoLesPetitsPlats"
            />
          </div>
        </div>
          <h1
            class="titleResearch">
            Cherchez parmi plus de 1500 recettes du quotidien, simples et
            délicieuses
          </h1>
          <div
            class="searchBar">
            <input
              type="text"
              class="searchInput"
              placeholder="Recherchez une recette, un ingrédient..."
            />
            <div class="suggestions" style="display: none; position: absolute; background: #ffffff; z-index: 10; width: 90%; overflow-y: auto;"></div>
            <button class="searchButton">
              <i class="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </div>
      </header>
    `;
};
