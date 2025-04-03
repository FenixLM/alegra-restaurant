export interface Ingredient {
  id: number;
  name: string;
  quantity: number;
}

export interface Purchase {
  order_id: number;
  items: PurchaseItem[];
}

export interface PurchaseItem {
  id: number;
  name: string;
  quantity: number;
  purchased_at: string;
}

export interface Recipe {
  _id: string;
  name: string;
  instructions: string;
  ingredients: {
    name: string;
    quantity: number;
  }[];
}

export type OrderStatus = "pending" | "in_progress" | "completed";

export interface Order {
  id: number;
  created_at: string;
  order_status: OrderStatus;
  recipe_id?: string;
  recipe?: Recipe;
}
