import { createBrowserRouter } from "react-router-dom";

// Importar roles
import { Roles } from "@/utils/roles";

// Componente de protección de rutas
import ProtectedRoute from "@/routes/ProtectedRoute";

// Importar componentes del dashboard
import Dashboard from "@/pages/shared/DashboardPage";
import Home from "@/pages/shared/home/Home";

// Definición de rutas
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/auht/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <div>Not Found</div>,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      // Seccion de analitica
      {
        path: "analitica/comisiones-comercial",
        element: (
          <ProtectedRoute
            requiredRoles={[Roles.ADMINISTRADOR, Roles.COMERCIAL]}
          >
            <ComisionesComercial />
          </ProtectedRoute>
        ),
      },
      // Seccion de recursos humanos
      {
        path: "recursos-humanos/trabajadores",
        element: (
          <ProtectedRoute requiredRoles={[Roles.ADMINISTRADOR]}>
            <TrabajadoresPage />
          </ProtectedRoute>
        ),
      },
      // Seccion de proyectos
      {
        path: "proyectos/clientes",
        element: (
          <ProtectedRoute
            requiredRoles={[Roles.ADMINISTRADOR, Roles.COMERCIAL]}
          >
            <ClientesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "proyectos/proyecciones",
        element: (
          <ProtectedRoute
            requiredRoles={[Roles.ADMINISTRADOR, Roles.COMERCIAL]}
          >
            <ProyeccionesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "proyectos/proyecciones/detalle",
        element: (
          <ProtectedRoute
            requiredRoles={[Roles.ADMINISTRADOR, Roles.COMERCIAL]}
          >
            <DetalleProyeccionesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "proyectos/proyectos",
        element: (
          <ProtectedRoute
            requiredRoles={[Roles.ADMINISTRADOR, Roles.COMERCIAL]}
          >
            <ProyectosPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "proyectos/auditoria-proyectos",
        element: (
          <ProtectedRoute
            requiredRoles={[Roles.ADMINISTRADOR, Roles.COMERCIAL]}
          >
            <AuditoriaProyectoPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "proyectos/asesoria-tecnica",
        element: (
          <ProtectedRoute
            requiredRoles={[Roles.ADMINISTRADOR, Roles.COMERCIAL]}
          >
            <SeleccionIngenieroPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "proyectos/asesoria-tecnica/:idIngeniero",
        element: (
          <ProtectedRoute
            requiredRoles={[Roles.ADMINISTRADOR, Roles.COMERCIAL]}
          >
            <AsesoriaTecnicaPage />
          </ProtectedRoute>
        ),
      },
      // Seccion de despachos
      {
        path: "despachos/productos",
        element: (
          <ProtectedRoute
            requiredRoles={[Roles.ADMINISTRADOR, Roles.COMERCIAL]}
          >
            <ProductosPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
