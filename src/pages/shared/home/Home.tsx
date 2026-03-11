import { useAuthStore } from "@/store/auth.store";
import { useSidebar } from "@/hooks/useSidebar";
import { Roles } from "@/utils/roles";
import {
  Menu,
  FilePlus2,
  UserPlus,
  PlusCircle,
  ChevronLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

// Dashboards por rol
import { DashboardAdminEjecutivo } from "@/components/modulos/home/dashboards/DashboardAdminEjecutivo";
import { DashboardBrokerJuridico } from "@/components/modulos/home/dashboards/DashboardBrokerJuridico";
import { DashboardBrokerNatural } from "@/components/modulos/home/dashboards/DashboardBrokerNatural";
import { DashboardVendedor } from "@/components/modulos/home/dashboards/DashboardVendedor";
import { DashboardPuntoVenta } from "@/components/modulos/home/dashboards/DashboardPuntoVenta";
import { DashboardReferenciador } from "@/components/modulos/home/dashboards/DashboardReferenciador";

// ─── Acciones rápidas por rol ─────────────────────────────────────────────────

type QuickAction = {
  label: string;
  icon: any;
  className: string;
  link: string;
};

const QUICK_ACTIONS: Record<string, QuickAction[]> = {
  [Roles.ADMINISTRADOR]: [
    { label: "Crear cliente",  icon: UserPlus,  className: "bg-green-50 border-green-200 hover:bg-green-600 hover:border-green-600 text-green-700 hover:text-white",   link: "/dashboard/gestion-trabajo/clientes" },
    { label: "Crear póliza",   icon: FilePlus2, className: "bg-indigo-50 border-indigo-200 hover:bg-indigo-600 hover:border-indigo-600 text-indigo-700 hover:text-white", link: "/dashboard/gestion-trabajo/polizas" },
    { label: "Crear lead",     icon: PlusCircle, className: "bg-blue-50 border-blue-200 hover:bg-blue-600 hover:border-blue-600 text-blue-700 hover:text-white",          link: "/dashboard/gestion-trabajo/leads" },
  ],
  [Roles.EJECUTIVO_CUENTA]: [
    { label: "Crear cliente",  icon: UserPlus,  className: "bg-green-50 border-green-200 hover:bg-green-600 hover:border-green-600 text-green-700 hover:text-white",   link: "/dashboard/gestion-trabajo/clientes" },
    { label: "Crear póliza",   icon: FilePlus2, className: "bg-indigo-50 border-indigo-200 hover:bg-indigo-600 hover:border-indigo-600 text-indigo-700 hover:text-white", link: "/dashboard/gestion-trabajo/polizas" },
    { label: "Crear lead",     icon: PlusCircle, className: "bg-blue-50 border-blue-200 hover:bg-blue-600 hover:border-blue-600 text-blue-700 hover:text-white",          link: "/dashboard/gestion-trabajo/leads" },
  ],
  [Roles.BROKER]: [
    { label: "Crear lead",     icon: PlusCircle, className: "bg-blue-50 border-blue-200 hover:bg-blue-600 hover:border-blue-600 text-blue-700 hover:text-white",   link: "/dashboard/gestion-trabajo/leads" },
    { label: "Crear cliente",  icon: UserPlus,  className: "bg-green-50 border-green-200 hover:bg-green-600 hover:border-green-600 text-green-700 hover:text-white", link: "/dashboard/gestion-trabajo/clientes" },
  ],
  [Roles.PROMOTOR_VENTA]: [
    { label: "Crear lead",     icon: PlusCircle, className: "bg-blue-50 border-blue-200 hover:bg-blue-600 hover:border-blue-600 text-blue-700 hover:text-white", link: "/dashboard/gestion-trabajo/leads" },
  ],
  [Roles.PUNTO_VENTA]: [
    { label: "Crear cliente",  icon: UserPlus, className: "bg-green-50 border-green-200 hover:bg-green-600 hover:border-green-600 text-green-700 hover:text-white", link: "/dashboard/gestion-trabajo/clientes" },
  ],
  [Roles.REFERENCIADOR]: [
    { label: "Registrar lead", icon: PlusCircle, className: "bg-indigo-50 border-indigo-200 hover:bg-indigo-600 hover:border-indigo-600 text-indigo-700 hover:text-white", link: "/dashboard/gestion-trabajo/leads" },
  ],
};

// ─── Subtítulos por rol ───────────────────────────────────────────────────────

const SUBTITULOS: Record<string, string> = {
  [Roles.ADMINISTRADOR]:    "Vista completa del sistema",
  [Roles.EJECUTIVO_CUENTA]: "Gestión comercial y cuentas",
  [Roles.BROKER]:           "Tu red y cartera de clientes",
  [Roles.PROMOTOR_VENTA]:   "Tus leads y actividad del día",
  [Roles.PUNTO_VENTA]:      "Operación de tu punto de venta",
  [Roles.REFERENCIADOR]:    "Tus referidos y prospectos",
};

// ─── Dashboard por rol ────────────────────────────────────────────────────────

const getDashboard = (rol: string) => {
  switch (rol) {
    case Roles.ADMINISTRADOR:
    case Roles.EJECUTIVO_CUENTA:
      return <DashboardAdminEjecutivo />;
    case Roles.BROKER:
      return <DashboardBrokerJuridico />;
    case Roles.PROMOTOR_VENTA:
      return <DashboardVendedor />;
    case Roles.PUNTO_VENTA:
      return <DashboardPuntoVenta />;
    case Roles.REFERENCIADOR:
      return <DashboardReferenciador />;
    default:
      // Fallback: Broker Natural o rol desconocido
      return <DashboardBrokerNatural />;
  }
};

// ─── Componente principal ─────────────────────────────────────────────────────

const Home = () => {
  const { user } = useAuthStore();
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  const displayName = user?.nombreUsuario || "Usuario";
  const rol = user?.rol?.nombreRol || "";
  const quickActions = QUICK_ACTIONS[rol] ?? [];
  const subtitulo = SUBTITULOS[rol] ?? "¿Qué te gustaría gestionar hoy?";

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-3 mb-5 mt-4">
        {/* Mobile toggle */}
        <div className="flex items-center lg:hidden mb-1">
          <button
            onClick={toggleSidebar}
            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-4">
          {/* Izquierda: toggle + saludo */}
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
                ¡Bienvenido,{" "}
                <span className="text-[#003d5c]">{displayName}</span>!
              </h1>
              <p className="text-gray-500 mt-0.5 text-sm font-medium">
                {subtitulo}
              </p>
            </div>
          </div>

          {/* Derecha: acciones rápidas */}
          {quickActions.length > 0 && (
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
          )}
        </div>
      </div>

      {/* Dashboard específico por rol */}
      {getDashboard(rol)}
    </>
  );
};

export default Home;
