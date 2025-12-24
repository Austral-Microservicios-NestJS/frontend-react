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

      // Seccion de maestros
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
            <CompaniasPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/maestros/productos",
        element: (
          <ProtectedRoute requiredRoles={[Roles.ADMINISTRADOR]}>
            <CompaniasPage />
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
      }
    ],
  },
]);

export default router;
