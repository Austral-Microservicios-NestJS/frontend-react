import { LeadsSummaryWidget } from "@/components/modulos/home/LeadsSummaryWidget";
import { QuickActionsWidget } from "@/components/modulos/home/QuickActionsWidget";
import { TasksWidget } from "@/components/modulos/home/TasksWidget";
import { InsuranceNews } from "@/components/modulos/home/InsuranceNews";
import { AustralAIPromo } from "@/components/modulos/home/AustralAIPromo";
import { useAuthStore } from "@/store/auth.store";
import { useSidebar } from "@/hooks/useSidebar";
import { Menu } from "lucide-react";

const Home = () => {
  const { user } = useAuthStore();
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const displayName = user?.nombreUsuario || "Usuario";

  return (
    <>
      {/* Custom Header */}
      <div className="flex flex-col gap-3 mb-4 mt-4">
        {/* Mobile Toggle */}
        <div className="flex items-center lg:hidden mb-2">
          <button
            onClick={toggleSidebar}
            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-4 border-white shadow-lg ring-1 ring-gray-200">
              <img
                src={user?.foto || "https://github.com/shadcn.png"}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
              ¡Hola,{" "}
              <span className="text-[--austral-azul]">{displayName}</span>!
            </h1>
            <p className="text-gray-500 mt-0.5 text-xs md:text-sm font-medium">
              ¿Qué te gustaría gestionar hoy?
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Hero Section - Austral AI Promo */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <AustralAIPromo />
        </div>

        {/* Widget Lateral Superior - Acciones Rápidas */}
        <div className="col-span-1">
          <QuickActionsWidget />
        </div>

        {/* Fila Inferior */}
        <div className="col-span-1 md:col-span-2">
          <LeadsSummaryWidget />
        </div>

        <div className="col-span-1">
          <TasksWidget />
        </div>

        <div className="col-span-1">
          <InsuranceNews />
        </div>
      </div>
    </>
  );
};

export default Home;
