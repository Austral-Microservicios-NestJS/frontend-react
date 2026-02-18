import { LeadsSummaryWidget } from "@/components/modulos/home/LeadsSummaryWidget";
import { QuickActionsWidget } from "@/components/modulos/home/QuickActionsWidget";
import { TasksWidget } from "@/components/modulos/home/TasksWidget";
import { AustralAIPromo } from "@/components/modulos/home/AustralAIPromo";
import { AIInsightsWidget } from "@/components/modulos/home/AIInsightsWidget";
import { useAuthStore } from "@/store/auth.store";
import { useSidebar } from "@/hooks/useSidebar";
import { Menu, FilePlus2, UserPlus, PlusCircle, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const { user } = useAuthStore();
  const { isSidebarOpen, toggleSidebar } = useSidebar();
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
      <div className="flex flex-col gap-3 mb-5 mt-4">
        {/* Mobile Toggle */}
        <div className="flex items-center lg:hidden mb-1">
          <button
            onClick={toggleSidebar}
            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-4">
          {/* Left: Toggle sidebar + Usuario */}
          <div className="flex items-center gap-3 ml-2">
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
              title={isSidebarOpen ? "Ocultar menú" : "Mostrar menú"}
            >
              {isSidebarOpen ? (
                <ChevronLeft className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                ¡Bienvenido, <span className="text-[#003d5c]">{displayName}</span>!
              </h1>
              <p className="text-gray-500 mt-0.5 text-sm font-medium">
                ¿Qué te gustaría gestionar hoy?
              </p>
            </div>
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
        {/* FILA 1: TasksWidget + LeadsSummary */}
        <div className="col-span-1 md:col-span-1 lg:col-span-4">
          <TasksWidget />
        </div>

        <div className="col-span-1 md:col-span-1 lg:col-span-8">
          <LeadsSummaryWidget />
        </div>

        {/* FILA 2: Insights AI + Austral AI */}
        <div className="col-span-1 md:col-span-1 lg:col-span-7">
          <AIInsightsWidget />
        </div>

        <div className="col-span-1 md:col-span-1 lg:col-span-5">
          <AustralAIPromo />
        </div>

        {/* FILA 3: Acciones (móvil) */}
        <div className="col-span-1 md:col-span-2 lg:hidden">
          <QuickActionsWidget />
        </div>
      </div>
    </>
  );
};

export default Home;
