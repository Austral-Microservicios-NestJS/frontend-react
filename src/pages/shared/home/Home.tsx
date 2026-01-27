import { LeadsSummaryWidget } from "@/components/modulos/home/LeadsSummaryWidget";
import { QuickActionsWidget } from "@/components/modulos/home/QuickActionsWidget";
import { TasksWidget } from "@/components/modulos/home/TasksWidget";
import { AustralAIPromo } from "@/components/modulos/home/AustralAIPromo";
import { AIInsightsWidget } from "@/components/modulos/home/AIInsightsWidget";
import { useAuthStore } from "@/store/auth.store";
import { useSidebar } from "@/hooks/useSidebar";
import { Menu, FilePlus2, UserPlus, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const { user } = useAuthStore();
  const { toggleSidebar } = useSidebar();
  const displayName = user?.nombreUsuario || "Usuario";

  const quickActions = [
    {
      label: "Crear cliente",
      icon: UserPlus,
      className:
        "bg-green-50 border-green-200 hover:bg-green-600 hover:border-green-600 text-green-700 hover:text-white",
      link: "/dashboard/gestion-trabajo/clientes",
    },
    {
      label: "Crear póliza",
      icon: FilePlus2,
      className:
        "bg-indigo-50 border-indigo-200 hover:bg-indigo-600 hover:border-indigo-600 text-indigo-700 hover:text-white",
      link: "/dashboard/gestion-trabajo/polizas",
    },
    {
      label: "Crear lead",
      icon: PlusCircle,
      className:
        "bg-blue-50 border-blue-200 hover:bg-blue-600 hover:border-blue-600 text-blue-700 hover:text-white",
      link: "/dashboard/gestion-trabajo/leads",
    },
  ];

  return (
    <>
      {/* Custom Header */}
      <div className="flex flex-col gap-3 mb-6 mt-4">
        {/* Mobile Toggle */}
        <div className="flex items-center lg:hidden mb-2">
          <button
            onClick={toggleSidebar}
            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-4">
          {/* Left: Usuario */}
          <div className="ml-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              ¡Hola, <span className="text-[#003d5c]">{displayName}</span>!
            </h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base font-medium">
              ¿Qué te gustaría gestionar hoy?
            </p>
          </div>

          {/* Right: Acciones Rápidas */}
          <div className="hidden lg:flex items-center gap-2">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.link}
                className={`group flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all duration-200 font-medium text-sm ${action.className}`}
              >
                <action.icon className="w-4 h-4" />
                <span>{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        {/* FILA 1: Tareas + Resumen Leads */}
        <div className="col-span-1 md:col-span-1 lg:col-span-4 min-h-[200px]">
          <TasksWidget />
        </div>

        <div className="col-span-1 md:col-span-1 lg:col-span-8 min-h-[200px]">
          <LeadsSummaryWidget />
        </div>

        {/* FILA 2: Insights AI + Austral AI */}
        <div className="col-span-1 md:col-span-1 lg:col-span-7 min-h-[200px]">
          <AIInsightsWidget />
        </div>

        <div className="col-span-1 md:col-span-1 lg:col-span-5 min-h-[200px]">
          <AustralAIPromo />
        </div>

        {/* FILA 3: Acciones (móvil) */}
        <div className="col-span-1 md:col-span-1 lg:hidden min-h-[200px]">
          <QuickActionsWidget />
        </div>
      </div>
    </>
  );
};

export default Home;
