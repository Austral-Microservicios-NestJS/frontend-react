import { useAuthStore } from "@/store/auth.store";
import { useSidebar } from "@/hooks/useSidebar";
import { Roles } from "@/utils/roles";
import {
  Menu,
  FilePlus2,
  UserPlus,
  PlusCircle,
  PanelLeftOpen,
  PanelLeftClose,
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

const PRIMARY = "bg-[#003d5c] text-white hover:bg-[#002d44] border border-[#003d5c]";
const SECONDARY = "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200";

const QUICK_ACTIONS: Record<string, QuickAction[]> = {
  [Roles.ADMINISTRADOR]: [
    { label: "Crear cliente",  icon: UserPlus,   className: PRIMARY,   link: "/dashboard/gestion-trabajo/clientes" },
    { label: "Crear póliza",   icon: FilePlus2,  className: SECONDARY, link: "/dashboard/gestion-trabajo/polizas" },
    { label: "Crear lead",     icon: PlusCircle, className: SECONDARY, link: "/dashboard/gestion-trabajo/leads" },
  ],
  [Roles.EJECUTIVO_CUENTA]: [
    { label: "Crear cliente",  icon: UserPlus,   className: PRIMARY,   link: "/dashboard/gestion-trabajo/clientes" },
    { label: "Crear póliza",   icon: FilePlus2,  className: SECONDARY, link: "/dashboard/gestion-trabajo/polizas" },
    { label: "Crear lead",     icon: PlusCircle, className: SECONDARY, link: "/dashboard/gestion-trabajo/leads" },
  ],
  [Roles.BROKER]: [
    { label: "Crear lead",    icon: PlusCircle, className: PRIMARY,   link: "/dashboard/gestion-trabajo/leads" },
    { label: "Crear cliente", icon: UserPlus,   className: SECONDARY, link: "/dashboard/gestion-trabajo/clientes" },
  ],
  [Roles.PROMOTOR_VENTA]: [
    { label: "Crear lead",    icon: PlusCircle, className: PRIMARY, link: "/dashboard/gestion-trabajo/leads" },
  ],
  [Roles.PUNTO_VENTA]: [
    { label: "Crear cliente", icon: UserPlus, className: PRIMARY, link: "/dashboard/gestion-trabajo/clientes" },
  ],
  [Roles.REFERENCIADOR]: [
    { label: "Registrar lead", icon: PlusCircle, className: PRIMARY, link: "/dashboard/gestion-trabajo/leads" },
  ],
};

// ─── Subtítulos por rol ───────────────────────────────────────────────────────

const SUBTITULOS: Record<string, string> = {
  [Roles.ADMINISTRADOR]:    "",
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
  const fechaHoy = new Date().toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

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
                <PanelLeftClose className="w-5 h-5" />
              ) : (
                <PanelLeftOpen className="w-5 h-5" />
              )}
            </button>
            <div>
              <h1 className="text-5xl font-bold text-gray-700">
                Bienvenido, {displayName}
              </h1>
              <p className="text-gray-500 mt-0.5 text-sm font-medium capitalize">
                {rol === Roles.ADMINISTRADOR ? fechaHoy : subtitulo}
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
                  className={`group flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm shadow-sm ${action.className}`}
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
