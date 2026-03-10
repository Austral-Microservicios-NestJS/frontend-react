import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: readonly string[];
}

const ProtectedRoute = ({ children, requiredRoles = [] }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading: loading, user } = useAuthStore();
  const location = useLocation();

  const hasRole = (roles: readonly string[]) => {
     if (!user || !user.rol) return false;
     return roles.includes(user.rol.nombreRol);
  };

  // Mostrar indicador de carga mientras se verifica la autenticación
  if (loading) {
    return <div>Cargando...</div>;
  }

  // Verificar autenticación
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Verificar roles si se requieren
  if (requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    toast.error("No tienes permisos para acceder a esta página");
    return <Navigate to="/dashboard/home" replace />;
  }

  // Renderizar los componentes hijos si está autorizado
  return children;
};

export default ProtectedRoute;
