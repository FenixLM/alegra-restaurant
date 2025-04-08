import { useEffect, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Order } from "../types/types";

interface OrderListProps {
  orders: Order[];
}

const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([] as Order[]);
  const [filterStatus, setFilterStatus] = useState<
    "pending" | "in_progress" | "completed" | "history"
  >("history");

  useEffect(() => {
    const getDataOrders = async () => {
      try {
        const response = await fetch(
          `http://localhost:3004/orders`
          // `https://testapi.urbancitytravel.com/orders`
        );
        if (!response.ok) {
          throw new Error("Error fetching orders");
        }
        const data = await response.json();
        console.log("Fetched orders:", data);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    getDataOrders();
  }, []);

  const filteredOrders = orders.filter(
    (order) => filterStatus === "history" || order.order_status === filterStatus
  );

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const calculateTimeElapsed = (timestamp: string): string => {
    const orderTime = new Date(timestamp).getTime();
    const now = new Date().getTime();
    const elapsed = now - orderTime;

    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);

    return `${minutes}m ${seconds}s`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-food-beige px-2 sm:px-4 py-3 sm:py-4">
        <CardTitle className="text-food-brown flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="text-lg sm:text-xl">Órdenes</span>
          <Tabs defaultValue="all" className="w-full sm:w-auto">
            <TabsList className="bg-food-beige/50 border border-food-brown/20 w-full grid grid-cols-2 sm:grid-cols-3">
              {/* <TabsTrigger
                value="all"
                onClick={() => setFilterStatus("history")}
                className="data-[state=active]:bg-food-orange data-[state=active]:text-white text-xs sm:text-sm"
              >
                Todas
              </TabsTrigger> */}
              <TabsTrigger
                value="preparing"
                onClick={() => setFilterStatus("pending")}
                className="data-[state=active]:bg-food-orange data-[state=active]:text-white text-xs sm:text-sm"
              >
                Preparando
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                onClick={() => setFilterStatus("completed")}
                className="data-[state=active]:bg-food-orange data-[state=active]:text-white text-xs sm:text-sm"
              >
                Completadas
              </TabsTrigger>
              <TabsTrigger
                value="history"
                onClick={() => setFilterStatus("history")}
                className="data-[state=active]:bg-food-orange data-[state=active]:text-white text-xs sm:text-sm"
              >
                Histórico
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 px-2 sm:px-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay órdenes{" "}
            {filterStatus !== "history" ? `en estado "${filterStatus}"` : ""}
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="border rounded-md p-3 sm:p-4 flex flex-col sm:flex-row justify-between sm:items-center hover:bg-gray-50 gap-2"
              >
                <div>
                  <div className="font-medium">
                    {order?.recipe ? order?.recipe?.name : "Receta pendiente"}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">
                    {order.order_status === "in_progress" ? (
                      <span>En preparación</span>
                    ) : (
                      <span>
                        {order.order_status === "completed"
                          ? "Completado:"
                          : "Entregado:"}{" "}
                        {order.created_at ? formatTime(order.created_at) : ""}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <Badge
                    className={
                      order.order_status === "in_progress"
                        ? "bg-food-yellow text-black hover:bg-food-yellow/90"
                        : order.order_status === "completed"
                        ? "bg-food-green hover:bg-food-green/90"
                        : "bg-gray-400 hover:bg-gray-400/90"
                    }
                  >
                    {order.order_status === "in_progress"
                      ? "En preparación"
                      : order.order_status === "completed"
                      ? "Completado"
                      : "Histórico"}
                  </Badge>

                  {/* {order.order_status === "in_progress" && (
                    <button
                      onClick={() => onCompleteOrder(order.id)}
                      className="bg-food-green text-white p-1 rounded-full hover:bg-food-green/80"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </button>
                  )} */}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderList;
