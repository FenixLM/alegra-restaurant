export interface Ingredient {
  name: string;
  quantity: number;
}

export interface Recipe {
  ingredients: Ingredient[];
}

export interface OrderRequest {
  id: string;
  recipe: Recipe;
}

export interface MarketOrderData {
  ingredients: Ingredient[];
  orderRequest: OrderRequest;
}
