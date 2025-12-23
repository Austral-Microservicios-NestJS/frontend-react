import { createBrowserRouter } from "react-router-dom";

// Importar roles
import { Roles } from "@/utils/roles";

// Componente de protección de rutas
import ProtectedRoute from "@/routes/ProtectedRoute";

// Importar componentes del dashboard
import { Sidebar } from "@/components/sidebar/Sidebar";
import LoginPage from "@/pages/auth/login/LoginPage";
import Home from "@/pages/shared/home/Home";
import { CompaniasPage } from "@/pages/admin/maestros/companias/CompaniasPage";

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
      // Seccion de analitica
      {
        path: "admin/maestros/companias",
        element: (
          <ProtectedRoute
            requiredRoles={[Roles.ADMINISTRADOR]}
          >
            <CompaniasPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/maestros/ramos",
        element: (
          <ProtectedRoute
            requiredRoles={[Roles.ADMINISTRADOR]}
          >
            <CompaniasPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/maestros/productos",
        element: (
          <ProtectedRoute
            requiredRoles={[Roles.ADMINISTRADOR]}
          >
            <CompaniasPage />
          </ProtectedRoute>
        ),
      }
    ],
  },
]);

export default router;
