import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Recipe } from "../types/types";
import { useEffect, useState } from "react";

interface RecipeListProps {
  recipes: Recipe[];
}

const RecipeList = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([] as Recipe[]);
  useEffect(() => {
    const getDataRecipes = async () => {
      try {
        const response = await fetch(
          `http://localhost:3004/recipes`
          // `https://testapi.urbancitytravel.com/recipes`
        );
        if (!response.ok) {
          throw new Error("Error fetching recipes");
        }
        const data = await response.json();
        console.log("Fetched recipes:", data);
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };
    getDataRecipes();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader className="bg-food-beige">
        <CardTitle className="text-food-brown">Recetas Disponibles</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Card
              key={recipe._id}
              className="overflow-hidden border hover:shadow-md transition-shadow"
            >
              <div className="h-48 bg-cover bg-center">
                <div className="w-full h-full bg-black bg-opacity-30 flex items-end p-4">
                  <h3 className="text-white text-xl font-bold drop-shadow-lg">
                    {recipe.name}
                  </h3>
                </div>
              </div>
              <CardContent className="pt-4">
                <p className="text-sm text-gray-600 mb-3">
                  {recipe.instructions}
                </p>
                <p className="text-xs font-medium mb-2">
                  {/* <span className="text-food-orange">
                    Tiempo de preparación: {recipe.preparationTime} min
                  </span> */}
                </p>
                <h4 className="text-sm font-medium mt-3 mb-2">Ingredientes:</h4>
                <ul className="text-sm space-y-1">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{ingredient.name}</span>
                      <span className="text-gray-600">
                        {ingredient.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeList;
