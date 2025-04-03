
import { Ingredient, Purchase, Recipe, Order } from "../types/types";

export const ingredients: Ingredient[] = [
  { id: 1, name: "Arroz", quantity: 20, unit: "kg" },
  { id: 2, name: "Pollo", quantity: 15, unit: "kg" },
  { id: 3, name: "Tomate", quantity: 8, unit: "kg" },
  { id: 4, name: "Cebolla", quantity: 10, unit: "kg" },
  { id: 5, name: "Ají", quantity: 2, unit: "kg" },
  { id: 6, name: "Papa", quantity: 25, unit: "kg" },
  { id: 7, name: "Lechuga", quantity: 5, unit: "kg" },
  { id: 8, name: "Carne molida", quantity: 12, unit: "kg" },
  { id: 9, name: "Fideos", quantity: 18, unit: "kg" },
  { id: 10, name: "Queso", quantity: 6, unit: "kg" },
  { id: 11, name: "Aceite de oliva", quantity: 4, unit: "L" },
  { id: 12, name: "Sal", quantity: 3, unit: "kg" },
  { id: 13, name: "Pimienta", quantity: 1, unit: "kg" },
  { id: 14, name: "Ajo", quantity: 2, unit: "kg" },
  { id: 15, name: "Limón", quantity: 30, unit: "unidades" }
];

export const purchases: Purchase[] = [
  {
    id: 1,
    date: "2023-10-15",
    ingredients: [
      { name: "Arroz", quantity: 10, unit: "kg" },
      { name: "Pollo", quantity: 8, unit: "kg" },
      { name: "Tomate", quantity: 5, unit: "kg" }
    ],
    total: 120000
  },
  {
    id: 2,
    date: "2023-10-18",
    ingredients: [
      { name: "Cebolla", quantity: 6, unit: "kg" },
      { name: "Ají", quantity: 1, unit: "kg" },
      { name: "Papa", quantity: 15, unit: "kg" }
    ],
    total: 85000
  },
  {
    id: 3,
    date: "2023-10-22",
    ingredients: [
      { name: "Lechuga", quantity: 4, unit: "kg" },
      { name: "Carne molida", quantity: 7, unit: "kg" },
      { name: "Queso", quantity: 3, unit: "kg" }
    ],
    total: 160000
  }
];

export const recipes: Recipe[] = [
  {
    id: 1,
    name: "Arroz con Pollo",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=2072&auto=format&fit=crop",
    description: "Plato tradicional de arroz cocinado con pollo, verduras y especias.",
    ingredients: [
      { name: "Arroz", quantity: 0.5, unit: "kg" },
      { name: "Pollo", quantity: 0.75, unit: "kg" },
      { name: "Cebolla", quantity: 0.2, unit: "kg" },
      { name: "Ajo", quantity: 0.05, unit: "kg" },
      { name: "Pimiento", quantity: 0.2, unit: "kg" }
    ],
    preparationTime: 45
  },
  {
    id: 2,
    name: "Spaghetti Bolognesa",
    image: "https://images.unsplash.com/photo-1556761223-4c4282c73f77?q=80&w=2065&auto=format&fit=crop",
    description: "Pasta italiana con salsa de carne, tomate y hierbas.",
    ingredients: [
      { name: "Fideos", quantity: 0.4, unit: "kg" },
      { name: "Carne molida", quantity: 0.5, unit: "kg" },
      { name: "Tomate", quantity: 0.4, unit: "kg" },
      { name: "Cebolla", quantity: 0.15, unit: "kg" },
      { name: "Ajo", quantity: 0.03, unit: "kg" }
    ],
    preparationTime: 30
  },
  {
    id: 3,
    name: "Ensalada César",
    image: "https://images.unsplash.com/photo-1551248429-40975aa4de74?q=80&w=2090&auto=format&fit=crop",
    description: "Ensalada fresca con lechuga romana, pollo, queso parmesano y aderezo César.",
    ingredients: [
      { name: "Lechuga", quantity: 0.3, unit: "kg" },
      { name: "Pollo", quantity: 0.3, unit: "kg" },
      { name: "Queso", quantity: 0.1, unit: "kg" },
      { name: "Limón", quantity: 2, unit: "unidades" },
      { name: "Aceite de oliva", quantity: 0.05, unit: "L" }
    ],
    preparationTime: 20
  },
  {
    id: 4,
    name: "Sopa de Papa",
    image: "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?q=80&w=2187&auto=format&fit=crop",
    description: "Sopa cremosa de papa con especias y hierbas.",
    ingredients: [
      { name: "Papa", quantity: 0.6, unit: "kg" },
      { name: "Cebolla", quantity: 0.15, unit: "kg" },
      { name: "Ajo", quantity: 0.02, unit: "kg" },
      { name: "Sal", quantity: 0.01, unit: "kg" },
      { name: "Pimienta", quantity: 0.005, unit: "kg" }
    ],
    preparationTime: 35
  },
  {
    id: 5,
    name: "Ají de Gallina",
    image: "https://images.unsplash.com/photo-1617424771170-d333ef3d93d8?q=80&w=2070&auto=format&fit=crop",
    description: "Plato tradicional peruano de pollo deshilachado en salsa cremosa de ají.",
    ingredients: [
      { name: "Pollo", quantity: 0.7, unit: "kg" },
      { name: "Ají", quantity: 0.2, unit: "kg" },
      { name: "Papa", quantity: 0.5, unit: "kg" },
      { name: "Cebolla", quantity: 0.2, unit: "kg" },
      { name: "Queso", quantity: 0.15, unit: "kg" }
    ],
    preparationTime: 60
  },
  {
    id: 6,
    name: "Lasaña de Carne",
    image: "https://images.unsplash.com/photo-1619895092538-128341789043?q=80&w=2070&auto=format&fit=crop",
    description: "Capas de pasta intercaladas con salsa de carne, queso y bechamel.",
    ingredients: [
      { name: "Fideos", quantity: 0.3, unit: "kg" },
      { name: "Carne molida", quantity: 0.6, unit: "kg" },
      { name: "Tomate", quantity: 0.5, unit: "kg" },
      { name: "Queso", quantity: 0.3, unit: "kg" },
      { name: "Cebolla", quantity: 0.15, unit: "kg" }
    ],
    preparationTime: 75
  }
];

export const initialOrders: Order[] = [
  {
    id: 1,
    recipeId: 1,
    recipeName: "Arroz con Pollo",
    status: "preparing",
    timestamp: "2023-11-01T10:30:00"
  },
  {
    id: 2,
    recipeId: 3,
    recipeName: "Ensalada César",
    status: "completed",
    timestamp: "2023-11-01T10:15:00",
    completedAt: "2023-11-01T10:35:00"
  },
  {
    id: 3,
    recipeId: 2,
    recipeName: "Spaghetti Bolognesa",
    status: "history",
    timestamp: "2023-11-01T09:45:00",
    completedAt: "2023-11-01T10:20:00"
  }
];
