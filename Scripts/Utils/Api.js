const BASE_URL = "Data/recipes.json";

// Fonction pour récupérer les données JSON depuis la source
export const getData = async () => {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des données");
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur de récupération des données :", error);
    throw error;
  }
};
