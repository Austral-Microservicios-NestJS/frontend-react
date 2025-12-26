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

// Componentes de maestros
import UsuariosPage from "@/pages/admin/maestros/usuarios/UsuariosPage";
import AgentesPage from "@/pages/broker/agentes/AgentesPage";
import AgenteDniPage from "@/pages/shared/agentes-ia/documentos/agente-dni/AgenteDniPage";
import RamosPage from "@/pages/admin/maestros/ramos/RamosPage";
import ProductosPage from "@/pages/admin/maestros/productos/ProductosPage";
import PolizasPage from "@/pages/shared/gestion-trabajo/polizas/PolizasPage";
import LeadsPage from "@/pages/shared/gestion-trabajo/leads/LeadsPage";
import ClientePolizasPage from "@/pages/shared/gestion-trabajo/clientes/[id]/polizas/ClientePolizasPage";

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
        path: "gestion-trabajo/polizas",
        element: (
          <ProtectedRoute
            requiredRoles={[Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE]}
          >
            <PolizasPage />
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
        path: "admin/maestros/productos",
        element: (
          <ProtectedRoute requiredRoles={[Roles.ADMINISTRADOR]}>
            <ProductosPage />
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
        path: "agentes-ia/agente-dni",
        element: (
          <ProtectedRoute
            requiredRoles={[Roles.ADMINISTRADOR, Roles.BROKER, Roles.AGENTE]}
          >
            <AgenteDniPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
