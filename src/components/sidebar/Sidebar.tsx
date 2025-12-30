import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { LogOut, Settings, Users, Building2 } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useSidebarStore } from "@/store/sidebar.store";
import { moduleCategories } from "@/routes/modulos";

// useSidebar hook moved to @/hooks/useSidebar.ts to fix HMR

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Usar el store global del sidebar
  const { isSidebarOpen, viewMode, setSidebarOpen, setViewMode } =
    useSidebarStore();

  // Obtener información del usuario desde el contexto de autenticación
  const { user, logout } = useAuthStore();

  // Filtrar módulos según el rol del usuario
  const userRole = user?.rol?.nombreRol || "";

  // Filtrar categorías y sus módulos según el rol del usuario y el modo de vista
  const filteredCategories = moduleCategories
    .map((category) => ({
      ...category,
      modules: category.modules.filter(
        (module) =>
          module.roles.includes(userRole) && module.type.includes(viewMode)
      ),
    }))
    .filter((category) => category.modules.length > 0);

  // Colores según el modo
  const activeColor = viewMode === "CRM" ? "#003D5C" : "#0c4cbaff"; // Verde CRM, Azul índigo ERP

  // Función para cerrar sesión
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Función para navegar a un módulo
  const navigateToModule = (path: any) => {
    navigate(path);
    // En móviles, cerrar el sidebar después de navegar
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      {isSidebarOpen && (
        <aside className="w-64 h-full bg-white flex flex-col fixed top-0 left-0 z-40 border-r border-gray-200">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-evenly gap-3 mb-3">
              <img
                src="/images/logo-austral-main.png"
                alt="Logo Austral"
                className="w-6 h-6"
              />
              <div className="flex flex-col min-w-0">
                <h1 className="text-base font-bold text-gray-900 truncate">
                  Austral Corredores
                </h1>
                <p className="text-xs text-gray-500">Sistema de Gestión</p>
              </div>
            </div>

            {/* User info */}
            {user && (
              <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-xs shrink-0"
                    style={{ backgroundColor: "var(--austral-azul)" }}
                  >
                    {user.nombreUsuario?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">
                      {user.nombreUsuario || "Usuario"}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--austral-azul)" }}
                    >
                      {userRole}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Switch CRM/ERP */}
            <div className="mt-3 p-2 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setViewMode("CRM")}
                  className={`
                    flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-semibold
                    transition-all duration-200
                    ${
                      viewMode === "CRM"
                        ? "bg-(--austral-azul) text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100"
                    }
                  `}
                >
                  <Users className="w-3.5 h-3.5" />
                  CRM
                </button>
                <button
                  onClick={() => setViewMode("ERP")}
                  className={`
                    flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-semibold
                    transition-all duration-200
                    ${
                      viewMode === "ERP"
                        ? "bg-(--austral-azul-ejecutivo) text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100"
                    }
                  `}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  ERP
                </button>
              </div>
            </div>
          </div>

          {/* Navegación */}
          <nav className="flex-1 p-3 overflow-y-auto">
            {userRole ? (
              <div className="space-y-4">
                {filteredCategories.map((category, categoryIndex) => (
                  <div key={category.id} className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          categoryIndex === 0
                            ? "bg-emerald-500"
                            : categoryIndex === 1
                            ? "bg-blue-500"
                            : categoryIndex === 2
                            ? "bg-purple-500"
                            : "bg-orange-500"
                        }`}
                      ></div>
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {category.title}
                      </h3>
                    </div>

                    <div className="space-y-0.5">
                      {category.modules.map((module) => {
                        const isActive = location.pathname.startsWith(
                          module.path
                        );
                        const isAuroraModule = (module as any).isAuroraModule;

                        // Renderizado especial para módulo Austral AI con efecto aurora
                        if (isAuroraModule) {
                          return (
                            <div key={module.id} className="relative group/aurora">
                              {/* Fondo Aurora */}
                              <span
                                aria-hidden
                                className="absolute inset-0 aurora-bg pointer-events-none opacity-90 rounded-lg"
                              />

                              {/* Botón del módulo */}
                              <button
                                onClick={() => navigateToModule(module.path)}
                                className={`
                                  relative w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium
                                  text-sm transition-all
                                  ${
                                    isActive
                                      ? "text-white bg-white/10"
                                      : "text-white hover:bg-white/20"
                                  }
                                `}
                              >
                                <div className="flex items-center justify-center w-7 h-7 rounded-md bg-white/20 text-white transition-colors shrink-0">
                                  <module.icon className="w-4 h-4" />
                                </div>
                                <span className="flex-1 text-left text-sm font-semibold">
                                  {module.name}
                                </span>
                              </button>
                            </div>
                          );
                        }

                        // Renderizado normal para otros módulos
                        return (
                          <button
                            key={module.id}
                            onClick={() => navigateToModule(module.path)}
                            className={`
                            w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium
                            text-sm transition-all duration-200
                            ${
                              isActive
                                ? "text-white shadow-sm"
                                : "text-gray-700 hover:bg-gray-100"
                            }
                          `}
                            style={
                              isActive ? { backgroundColor: activeColor } : {}
                            }
                          >
                            <div
                              className={`
                            flex items-center justify-center w-7 h-7 rounded-md transition-colors shrink-0
                            ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-gray-100 text-gray-600"
                            }
                          `}
                            >
                              <module.icon className="w-4 h-4" />
                            </div>
                            <span className="flex-1 text-left text-sm">
                              {module.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                  <Settings size={18} />
                </div>
                <p className="text-xs">No hay módulos disponibles</p>
              </div>
            )}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 
                     text-white rounded-lg text-sm font-semibold
                     transition-colors hover:opacity-90"
              style={{ backgroundColor: "var(--austral-azul)" }}
            >
              <LogOut size={16} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </aside>
      )}

      {/* Overlay para móviles */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Contenido principal */}
      <main
        className={`
        flex-1 overflow-y-auto transition-all
        ${isSidebarOpen ? "md:ml-64" : "md:ml-0"}
      `}
      >
        <div className="min-h-full bg-gray-50 p-3 lg:p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
