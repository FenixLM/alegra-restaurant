import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Ingredient } from "../types/types";

const InventoryList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>(
    []
  );

  useEffect(() => {
    const getDataInventory = async () => {
      try {
        const response = await fetch(`http://localhost:3004/inventory`);
        if (!response.ok) {
          throw new Error("Error fetching ingredients");
        }
        const data = await response.json();
        console.log("Fetched ingredients:", data);

        setIngredients(data);
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    };
    getDataInventory();
  }, []);

  useEffect(() => {
    const filteredIngredients = ingredients.filter((ingredient) =>
      ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredIngredients(filteredIngredients);
  }, [searchTerm, ingredients]);
  const getStockLevelColor = (quantity: number): string => {
    if (quantity >= 4) return "bg-green-100 text-green-800 border-green-300";
    if (quantity >= 2) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-red-100 text-red-800 border-red-300";
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-food-beige">
        <CardTitle className="text-food-brown flex justify-between items-center">
          <span>Inventario de Ingredientes</span>
          <Input
            type="search"
            placeholder="Buscar ingrediente..."
            className="max-w-xs bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="py-2 px-4 text-left font-medium text-gray-600">
                  Ingrediente
                </th>
                <th className="py-2 px-4 text-left font-medium text-gray-600">
                  Cantidad
                </th>
                <th className="py-2 px-4 text-left font-medium text-gray-600">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredIngredients.map((ingredient) => (
                <tr key={ingredient.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{ingredient.name}</td>
                  <td className="py-3 px-4">{ingredient.quantity}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${getStockLevelColor(
                        ingredient.quantity
                      )}`}
                    >
                      {ingredient.quantity >= 4
                        ? "Stock alto"
                        : ingredient.quantity >= 2
                        ? "Stock medio"
                        : "Stock bajo"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredIngredients.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No se encontraron ingredientes con "{searchTerm}"
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryList;
