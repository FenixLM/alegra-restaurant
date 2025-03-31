const axios = require("axios");

const MARKET_URL = "https://recruitment.alegra.com/api/farmers-market/buy";

const buyIngredient = async (ingredient) => {
  try {
    const response = await axios.get(MARKET_URL, {
      params: { ingredient },
    });

    const { quantitySold } = response.data;

    console.log(`🛒 Comprando ${ingredient}...`);
    console.log(`🛒 Cantidad comprada: ${quantitySold}`);
    

    return {
      name: ingredient,
      quantity: quantitySold || 0, // Si no hay stock, devuelve 0
    };
  } catch (error) {
    console.error(`Error al comprar ${ingredient}:`, error.message);
    return { ingredient, quantityBought: 0 };
  }
};

module.exports = { buyIngredient };
