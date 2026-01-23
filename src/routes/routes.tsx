import { createBrowserRouter } from "react-router-dom";

// Importar roles
import { Roles } from "@/utils/roles";

// Componente de protección de rutas
import ProtectedRoute from "@/routes/ProtectedRoute";

// Importar componentes del dashboard
import { Sidebar } from "@/components/sidebar/Sidebar";
import LoginPage from "@/pages/auth/login/LoginPage";
import Home from "@/pages/shared/home/Home";
import CompaniasPage from "@/pages/admin/maestros/companias/CompaniasPage";
import ActividadesPage from "@/pages/shared/gestion-trabajo/actividades/ActividadesPage";
import TareasPage from "@/pages/shared/gestion-trabajo/tareas/TareasPage";
import ClientesPage from "@/pages/shared/gestion-trabajo/clientes/ClientesPage";
import MapaPage from "@/pages/shared/gestion-trabajo/mapa/MapaPage";

// Componentes de agentes IA
import AgenteDniPage from "@/pages/shared/agentes-ia/documentos/agente-dni/AgenteDniPage";
import AgenteFacturaPage from "@/pages/shared/agentes-ia/documentos/agente-factura/AgenteFacturaPage";
import AgentePolizaPage from "@/pages/shared/agentes-ia/documentos/agente-poliza/AgentePolizaPage";
import AustralAIPage from "@/pages/shared/agentes-ia/austral-ai/AustralAIPage";

// Componentes de maestros - Administrador
import UsuariosPage from "@/pages/admin/maestros/usuarios/UsuariosPage";
import RamosPage from "@/pages/admin/maestros/ramos/RamosPage";
import PolizasPage from "@/pages/shared/gestion-trabajo/polizas/PolizasPage";
import LeadsPage from "@/pages/shared/gestion-trabajo/leads/LeadsPage";
import LeadDetail from "@/pages/shared/gestion-trabajo/leads/LeadDetail";
import ClientePolizasPage from "@/pages/shared/gestion-trabajo/clientes/[id]/polizas/ClientePolizasPage";
import ClienteInversionesPage from "@/pages/shared/gestion-trabajo/clientes/[id]/inversiones/ClienteInversionesPage";
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
    path: "*",
    element: <div>Not Found</div>,
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
        path: "general/mapa",
        element: (
          <ProtectedRoute
            requiredRoles={[Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE]}
          >
            <MapaPage />
          </ProtectedRoute>
        ),
      },
      // Seccion de gestion de trabajo - Modulos compartidos
      {
        path: "gestion-trabajo/actividades",
        element: (
          <ProtectedRoute
            requiredRoles={[Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE]}
          >
            <ActividadesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "gestion-trabajo/tareas",
        element: (
          <ProtectedRoute
            requiredRoles={[Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE]}
          >
            <TareasPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "gestion-trabajo/clientes",
        element: (
          <ProtectedRoute
            requiredRoles={[Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE]}
          >
            <ClientesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "gestion-trabajo/clientes/:id/polizas",
        element: (
          <ProtectedRoute
            requiredRoles={[Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE]}
          >
            <ClientePolizasPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "gestion-trabajo/clientes/:id/inversiones",
        element: (
          <ProtectedRoute
            requiredRoles={[Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE]}
          >
            <ClienteInversionesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "gestion-trabajo/leads",
        element: (
          <ProtectedRoute
            requiredRoles={[Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE]}
          >
            <LeadsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "gestion-trabajo/leads/:id",
        element: (
          <ProtectedRoute
            requiredRoles={[Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE]}
          >
            <LeadDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "gestion-trabajo/polizas",
        element: (
          <ProtectedRoute
            requiredRoles={[Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE]}
          >
            <PolizasPage />
          </ProtectedRoute>
        ),
      },
      // Seccion de Control y Seguimiento
      {
        path: "control-seguimiento/siniestros",
        element: (
          <ProtectedRoute
            requiredRoles={[Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE]}
          >
            <SiniestrosPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "control-seguimiento/comisiones",
        element: (
          <ProtectedRoute
            requiredRoles={[Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE]}
          >
            <ComisionesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "control-seguimiento/cobranzas",
        element: (
          <ProtectedRoute
            requiredRoles={[Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE]}
          >
            <CobranzasPage />
          </ProtectedRoute>
        ),
      },

      // Seccion de maestros - Administrador
      {
        path: "admin/maestros/companias",
        element: (
          <ProtectedRoute requiredRoles={[Roles.ADMINISTRADOR]}>
            <CompaniasPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/maestros/ramos",
        element: (
          <ProtectedRoute requiredRoles={[Roles.ADMINISTRADOR]}>
            <RamosPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/maestros/ramos/:id/productos",
        element: (
          <ProtectedRoute requiredRoles={[Roles.ADMINISTRADOR]}>
            <RamoProductosPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/maestros/usuarios",
        element: (
          <ProtectedRoute requiredRoles={[Roles.ADMINISTRADOR]}>
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
          <ProtectedRoute
            requiredRoles={[Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE]}
          >
            <AustralAIPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "agentes-ia/documentos", // Modulo principal, desde aqui se accede a los modulos de documentos especificos
        element: (
          <ProtectedRoute
            requiredRoles={[Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE]}
          >
            <AgentesDocumentosPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "agentes-ia/agente-dni",
        element: (
          <ProtectedRoute
            requiredRoles={[Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE]}
          >
            <AgenteDniPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "agentes-ia/agente-facturas",
        element: (
          <ProtectedRoute
            requiredRoles={[Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE]}
          >
            <AgenteFacturaPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "agentes-ia/agente-polizas",
        element: (
          <ProtectedRoute
            requiredRoles={[Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE]}
          >
            <AgentePolizaPage />
          </ProtectedRoute>
        ),
      },

      // Seccion de informacion extra solo de vista para Brokers y Agentes
      {
        path: "informacion-extra/companias",
        element: (
          <ProtectedRoute requiredRoles={[Roles.BROKER, Roles.AGENTE]}>
            <CompaniasExtraPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
