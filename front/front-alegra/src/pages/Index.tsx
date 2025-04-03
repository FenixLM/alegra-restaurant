import { useState, useEffect } from "react";
import Header from "../components/Header";
import OrderButton from "../components/OrderButton";
import OrderList from "../components/OrderList";
import InventoryList from "../components/InventoryList";
import PurchaseHistory from "../components/PurchaseHistory";
import RecipeList from "../components/RecipeList";
import { TabsContent } from "@/components/ui/tabs";
import { Tabs } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import {
  ingredients,
  purchases,
  recipes,
  initialOrders,
} from "../data/mockData";
import { Order, Recipe, OrderStatus } from "../types/types";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [nextOrderId, setNextOrderId] = useState(initialOrders.length + 1);
  const isMobile = useIsMobile();

  // Handle placing a new order
  const handleOrderPlaced = (recipe: Recipe) => {
    const newOrder: Order = {
      id: nextOrderId,
      recipe_id: recipe._id,
      recipe: recipe,
      order_status: "pending",
      created_at: new Date().toISOString(),
    };

    setOrders([newOrder, ...orders]);
    setNextOrderId(nextOrderId + 1);
  };

  // Handle marking an order as complete
  const handleCompleteOrder = (id: number) => {
    setOrders(
      orders.map((order) =>
        order.id === id
          ? {
              ...order,
              status: "completed",
              completedAt: new Date().toISOString(),
            }
          : order
      )
    );
  };

  // Move completed orders to history after some time
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(
        orders.map((order) => {
          if (order.order_status === "completed" && order.created_at) {
            const completedTime = new Date(order.created_at).getTime();
            const now = new Date().getTime();
            // Move to history after 1 minute (60000 ms)
            if (now - completedTime > 60000) {
              return { ...order, status: "history" };
            }
          }
          return order;
        })
      );
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [orders]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <Toaster />

      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 flex-1">
        <Tabs value={activeTab} className="w-full">
          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4 sm:space-y-8">
            <div className="text-center py-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-food-brown mb-2">
                {isMobile
                  ? "Donación de Comida"
                  : "Sistema de Donación de Comida"}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto px-2">
                Bienvenido al sistema de gestión para la jornada de donación de
                comida. Utilice el botón a continuación para realizar un pedido
                aleatorio a la cocina.
              </p>
            </div>

            <div className="flex justify-center mb-4 sm:mb-6">
              <OrderButton
                recipes={recipes}
                onOrderPlaced={handleOrderPlaced}
                className="text-center mx-auto"
              />
            </div>

            <OrderList />
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent
            value="inventario"
            className="space-y-4 sm:space-y-8 pb-20 sm:pb-0"
          >
            <InventoryList />
          </TabsContent>

          {/* Purchases Tab */}
          <TabsContent
            value="compras"
            className="space-y-4 sm:space-y-8 pb-20 sm:pb-0"
          >
            <PurchaseHistory />
          </TabsContent>

          {/* Recipes Tab */}
          <TabsContent
            value="recetas"
            className="space-y-4 sm:space-y-8 pb-20 sm:pb-0"
          >
            <RecipeList />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-food-beige py-3 sm:py-4 mt-6">
        <div className="container mx-auto px-4 text-center text-food-brown text-sm sm:text-base">
          <p>© {new Date().getFullYear()} Sistema de Donación de Comida</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
