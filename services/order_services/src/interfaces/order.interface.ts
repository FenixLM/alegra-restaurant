import { ObjectId } from "mongoose";

export interface Order {
  id: number;
  order_status: string;
  recipe_id?: string;
  created_at?: Date;
  recipe?: Recipe;
}

export interface Recipe {
  _id: ObjectId;
  [key: string]: any;
}
