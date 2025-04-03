import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Purchase } from "../types/types";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface PurchaseHistoryProps {
  purchases: Purchase[];
}

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([] as Purchase[]);

  useEffect(() => {
    const getDataPurchaseHistory = async () => {
      try {
        const response = await fetch(`http://localhost:3004/purchases`);
        if (!response.ok) {
          throw new Error("Error fetching purchase history");
        }
        const data = await response.json();
        console.log("Fetched purchase history:", data);

        setPurchases(data);
      } catch (error) {
        console.error("Error fetching purchase history:", error);
      }
    };
    getDataPurchaseHistory();
  }, []);

  // Format date to a more readable format
  const formatDate = (date?: string) => {
    console.log("Date received:", date); // Log the date received

    if (!date) return "Fecha no disponible"; // Si date es undefined, retorna mensaje

    try {
      const fixedDateString = date.split(".")[0] + "Z"; // Corrige microsegundos
      return format(parseISO(fixedDateString), "dd MMM yyyy, HH:mm", {
        locale: es,
      });
    } catch (error) {
      console.error("Error al formatear la fecha:", error);
      return "Fecha inválida";
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(amount);
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-food-beige">
        <CardTitle className="text-food-brown">Historial de Compras</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {purchases.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay compras registradas
          </div>
        ) : (
          <div className="space-y-6">
            {purchases.map((purchase) => (
              <div
                key={purchase.order_id}
                className="border rounded-lg overflow-hidden"
              >
                <div className="bg-gray-50 p-4 flex justify-between items-center">
                  <div className="font-medium">Compra #{purchase.order_id}</div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600">
                      {/* {formatDate(purchase.purchase_at)} */}
                    </div>
                    <div className="font-bold text-food-green">
                      {purchase.order_id}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Ingrediente</th>
                        <th className="text-right py-2">Cantidad</th>
                        <th className="text-right py-2">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchase.items.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b last:border-0 hover:bg-gray-50"
                        >
                          <td className="py-2">{item.name}</td>
                          <td className="py-2 text-right">{item.quantity}</td>
                          <td className="py-2 text-right">
                            {formatDate(item.purchased_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PurchaseHistory;
