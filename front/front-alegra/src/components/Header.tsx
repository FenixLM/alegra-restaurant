
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header = ({ activeTab, setActiveTab }: HeaderProps) => {
  const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setIsMenuOpen(false);
    
    // Show toast for tab changes
    toast({
      title: `Mostrando ${value}`,
      description: `Has cambiado a la sección de ${value}`,
      duration: 2000,
    });
  };

  const handleLogoClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
    toast({
      title: "¡Bienvenido!",
      description: "Sistema de donación de comida",
      duration: 3000,
    });
  };

  const renderTabs = () => (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className={`grid grid-cols-4 h-auto bg-food-beige border border-food-brown/20 ${isMobile ? "gap-1 p-1" : ""}`}>
        <TabsTrigger 
          value="dashboard" 
          className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm data-[state=active]:bg-food-orange data-[state=active]:text-white"
        >
          {isMobile ? "Inicio" : "Dashboard"}
        </TabsTrigger>
        <TabsTrigger 
          value="inventario" 
          className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm data-[state=active]:bg-food-orange data-[state=active]:text-white"
        >
          {isMobile ? "Invent." : "Inventario"}
        </TabsTrigger>
        <TabsTrigger 
          value="compras" 
          className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm data-[state=active]:bg-food-orange data-[state=active]:text-white"
        >
          {isMobile ? "Compras" : "Compras"}
        </TabsTrigger>
        <TabsTrigger 
          value="recetas" 
          className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm data-[state=active]:bg-food-orange data-[state=active]:text-white"
        >
          {isMobile ? "Recetas" : "Recetas"}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );

  return (
    <header className="bg-food-beige shadow-md py-2 sm:py-4 sticky top-0 z-10">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="w-full sm:w-auto flex items-center justify-between mb-3 sm:mb-0">
            <div 
              className={`flex items-center space-x-1 sm:space-x-2 cursor-pointer ${isAnimating ? 'animate-bounce-subtle' : ''}`}
              onClick={handleLogoClick}
            >
              <span className="text-food-orange text-2xl sm:text-3xl">🍽️</span>
              <h1 className="text-food-brown text-xl sm:text-2xl font-bold">
                {isMobile ? "Donación" : "Donación Gastronómica"}
              </h1>
            </div>
            
            {isMobile && (
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <button className="p-1 text-food-brown hover:bg-food-orange/10 rounded-md">
                    <Menu size={24} />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-food-beige w-[250px] pt-10">
                  {renderTabs()}
                </SheetContent>
              </Sheet>
            )}
          </div>
          
          {!isMobile && renderTabs()}
        </div>
      </div>
    </header>
  );
};

export default Header;
