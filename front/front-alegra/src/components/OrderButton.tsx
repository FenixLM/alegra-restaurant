import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Recipe } from "../types/types";
import { useIsMobile } from "@/hooks/use-mobile";

interface OrderButtonProps {
  recipes: Recipe[];
  onOrderPlaced: (recipe: Recipe) => void;
  className?: string;
}

const OrderButton = ({
  recipes,
  onOrderPlaced,
  className = "",
}: OrderButtonProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const handleOrder = () => {
    setIsLoading(true);

    const createOrder = async () => {
      try {
        // Simulate a network request to create an order
        const response = await fetch("http://localhost:3004/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ recipeId: 1 }), // Example payload
        });

        if (!response.ok) {
          throw new Error("Error creating order");
        }

        const data = await response.json();
        console.log("Order created:", data);
      } catch (error) {
        console.error("Error creating order:", error);
        toast({
          title: "Error",
          description: "No se pudo realizar el pedido. Inténtalo de nuevo.",
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };
    createOrder();
  };

  return (
    <Button
      onClick={handleOrder}
      disabled={isLoading}
      className={`${className} bg-food-orange hover:bg-food-orange/90 text-white font-bold py-3 px-4 sm:py-6 sm:px-8 text-base sm:text-xl rounded-full shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95 w-full sm:w-auto`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>{isMobile ? "Procesando..." : "Procesando su pedido..."}</span>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <span className="mr-2 text-xl sm:text-2xl">🍲</span>
          {isMobile ? "Pedir Plato" : "Pedir Plato Aleatorio"}
        </div>
      )}
    </Button>
  );
};

export default OrderButton;
