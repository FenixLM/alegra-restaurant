import axios from "axios";

const MARKET_URL = "https://recruitment.alegra.com/api/farmers-market/buy";

interface BuyResult {
  name: string;
  quantity: number;
}

export const buyIngredient = async (ingredient: string): Promise<BuyResult> => {
  try {
    const response = await axios.get(MARKET_URL, {
      params: { ingredient },
    });

    const { quantitySold } = response.data;

    console.log(`🛒 Comprando ${ingredient}...`);
    console.log(`🛒 Cantidad comprada: ${quantitySold}`);

    return {
      name: ingredient,
      quantity: quantitySold || 0,
    };
  } catch (error: any) {
    console.error(`Error al comprar ${ingredient}:`, error.message);
    return {
      name: ingredient,
      quantity: 0,
    };
  }
};

export default { buyIngredient };
