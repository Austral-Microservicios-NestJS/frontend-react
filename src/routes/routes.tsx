import { createBrowserRouter, Navigate } from "react-router-dom";

// Importar roles
import { Roles, RoleGroups } from "@/utils/roles";

// Componente de protección de rutas
import ProtectedRoute from "@/routes/ProtectedRoute";

// Importar componentes del dashboard
import { Sidebar } from "@/components/sidebar/Sidebar";
import LoginPage from "@/pages/auth/login/LoginPage";
import Home from "@/pages/shared/home/Home";
import CompaniasPage from "@/pages/admin/maestros/companias/CompaniasPage";
import TareasPage from "@/pages/shared/gestion-trabajo/tareas/TareasPage";
import ObservacionPage from "@/pages/shared/gestion-trabajo/observacion/ObservacionPage";
import ClientesPage from "@/pages/shared/gestion-trabajo/clientes/ClientesPage";
import MapaPage from "@/pages/shared/gestion-trabajo/mapa/MapaPage";

// Componentes de agentes IA
import AgenteDniPage from "@/pages/shared/agentes-ia/documentos/agente-dni/AgenteDniPage";
import AgenteFacturaPage from "@/pages/shared/agentes-ia/documentos/agente-factura/AgenteFacturaPage";
import AgentePolizaPage from "@/pages/shared/agentes-ia/documentos/agente-poliza/AgentePolizaPage";
import AustralAIPage from "@/pages/shared/agentes-ia/austral-ai/AustralAIPage";
import InsightsPage from "@/pages/shared/agentes-ia/insights/InsightsPage";
import Perfil from "@/pages/shared/perfil/Perfil";

// Componentes de maestros - Administrador
import UsuariosPage from "@/pages/admin/maestros/usuarios/UsuariosPage";
import RamosPage from "@/pages/admin/maestros/ramos/RamosPage";
import PolizasPage from "@/pages/shared/gestion-trabajo/polizas/PolizasPage";
import LeadsPage from "@/pages/shared/gestion-trabajo/leads/LeadsPage";
import LeadDetail from "@/pages/shared/gestion-trabajo/leads/LeadDetail";
import ClientePolizasPage from "@/pages/shared/gestion-trabajo/clientes/[id]/polizas/ClientePolizasPage";
import ClienteInversionesPage from "@/pages/shared/gestion-trabajo/clientes/[id]/inversiones/ClienteInversionesPage";
import PolizaSiniestrosPage from "@/pages/shared/gestion-trabajo/clientes/[id]/polizas/[polizaId]/siniestros/PolizaSiniestrosPage";
import RamoProductosPage from "@/pages/admin/maestros/ramos/[id]/productos/RamoProductosPage";

// Componentes de Broker
import AgentesPage from "@/pages/broker/agentes/AgentesPage";

// Componentes de control y seguimiento
import SiniestrosPage from "@/pages/shared/control-seguimiento/siniestros/SiniestrosPage";
import ComisionesPage from "@/pages/shared/control-seguimiento/comisiones/ComisionesPage";
import CobranzasPage from "@/pages/shared/control-seguimiento/cobranzas/CobranzasPage";

// Componentes de informacion extra
import CompaniasExtraPage from "@/pages/shared/informacion-extra/companias/CompaniasExtraPage";
import AgentesDocumentosPage from "@/pages/shared/agentes-ia/documentos/AgentesDocumentosPage";

// Definición de rutas
const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/auth/login",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Sidebar />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "perfil",
        element: <Perfil />,
      },
      {
        path: "general/mapa",
        element: (
          <ProtectedRoute requiredRoles={RoleGroups.TODOS_CRM}>
            <MapaPage />
          </ProtectedRoute>
        ),
      },
      // Seccion de gestion de trabajo - Modulos compartidos
      {
        path: "gestion-trabajo/actividades",
        element: <Navigate to="/dashboard/gestion-trabajo/tareas" replace />,
      },
      {
        path: "gestion-trabajo/tareas",
        element: (
          <ProtectedRoute requiredRoles={RoleGroups.TODOS_CRM}>
            <TareasPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "gestion-trabajo/observaciones",
        element: (
          <ProtectedRoute requiredRoles={RoleGroups.TODOS_CRM}>
            <ObservacionPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "gestion-trabajo/clientes",
        element: (
          <ProtectedRoute requiredRoles={RoleGroups.TODOS_CRM}>
            <ClientesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "gestion-trabajo/clientes/:id/polizas",
        element: (
          <ProtectedRoute requiredRoles={RoleGroups.SIN_VENDEDOR}>
            <ClientePolizasPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "gestion-trabajo/clientes/:id/inversiones",
        element: (
          <ProtectedRoute requiredRoles={RoleGroups.SIN_VENDEDOR}>
            <ClienteInversionesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "gestion-trabajo/clientes/:id/polizas/:polizaId/siniestros",
        element: (
          <ProtectedRoute requiredRoles={RoleGroups.SIN_VENDEDOR}>
            <PolizaSiniestrosPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "gestion-trabajo/leads",
        element: (
          <ProtectedRoute requiredRoles={RoleGroups.CON_REFERENCIADOR}>
            <LeadsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "gestion-trabajo/leads/:id",
        element: (
          <ProtectedRoute requiredRoles={RoleGroups.CON_REFERENCIADOR}>
            <LeadDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "gestion-trabajo/polizas",
        element: (
          <ProtectedRoute requiredRoles={RoleGroups.SIN_VENDEDOR}>
            <PolizasPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "gestion-trabajo/gestion-comercial",
        element: <Navigate to="/dashboard/gestion-trabajo/tareas" replace />,
      },
      // Seccion de Control y Seguimiento
      {
        path: "control-seguimiento/siniestros",
        element: (
          <ProtectedRoute requiredRoles={RoleGroups.SIN_VENDEDOR}>
            <SiniestrosPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "control-seguimiento/comisiones",
        element: (
          <ProtectedRoute requiredRoles={RoleGroups.SIN_VENDEDOR}>
            <ComisionesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "control-seguimiento/cobranzas",
        element: (
          <ProtectedRoute requiredRoles={RoleGroups.SIN_VENDEDOR}>
            <CobranzasPage />
          </ProtectedRoute>
        ),
      },

      // Seccion de maestros - Administrador
      {
        path: "admin/maestros/companias",
        element: (
          <ProtectedRoute requiredRoles={RoleGroups.SOLO_ADMIN}>
            <CompaniasPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/maestros/ramos",
        element: (
          <ProtectedRoute requiredRoles={RoleGroups.SOLO_ADMIN}>
            <RamosPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/maestros/ramos/:id/productos",
        element: (
          <ProtectedRoute requiredRoles={RoleGroups.SOLO_ADMIN}>
            <RamoProductosPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/maestros/usuarios",
        element: (
          <ProtectedRoute requiredRoles={[Roles.ADMINISTRADOR, Roles.BROKER]}>
            <UsuariosPage />
          </ProtectedRoute>
        ),
      },

      // Fin seccion maestros

      {
        path: "broker/agentes",
        element: (
          <ProtectedRoute requiredRoles={[Roles.BROKER]}>
            <AgentesPage />
          </ProtectedRoute>
        ),
      },

      // Agentes de IA
      {
        path: "agentes-ia/austral-ai",
        element: (
          <ProtectedRoute requiredRoles={RoleGroups.TODOS_CRM}>
            <AustralAIPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "agentes-ia/insights",
        element: (
          <ProtectedRoute requiredRoles={RoleGroups.TODOS_CRM}>
            <InsightsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "agentes-ia/documentos",
        element: (
          <ProtectedRoute requiredRoles={RoleGroups.TODOS_CRM}>
            <AgentesDocumentosPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "agentes-ia/agente-dni",
        element: (
          <ProtectedRoute requiredRoles={RoleGroups.TODOS_CRM}>
            <AgenteDniPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "agentes-ia/agente-facturas",
        element: (
          <ProtectedRoute requiredRoles={RoleGroups.TODOS_CRM}>
            <AgenteFacturaPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "agentes-ia/agente-polizas",
        element: (
          <ProtectedRoute requiredRoles={RoleGroups.TODOS_CRM}>
            <AgentePolizaPage />
          </ProtectedRoute>
        ),
      },

      // Seccion de informacion extra solo de vista para Brokers
      {
        path: "informacion-extra/companias",
        element: (
          <ProtectedRoute requiredRoles={RoleGroups.BROKERS_E_INFO}>
            <CompaniasExtraPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <div>Not Found</div>,
  },
]);

export default router;
