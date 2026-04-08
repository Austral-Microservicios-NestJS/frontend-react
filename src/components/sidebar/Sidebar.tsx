import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Settings, Users, Building2, ChevronDown, LayoutGrid, Briefcase, Sparkles, BookOpen } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useSidebarStore } from "@/store/sidebar.store";
import { moduleCategories } from "@/routes/modulos";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";
import { SessionWarningModal } from "@/components/shared/SessionWarningModal";
import { Navbar } from "@/components/shared/Navbar";
import { cn } from "@/lib/utils";

// Tooltip flotante renderizado en el body — escapa cualquier overflow
interface TooltipState { text: string; y: number }

function SidebarTooltip({ tooltip }: { tooltip: TooltipState | null }) {
  if (!tooltip) return null;
  return createPortal(
    <div
      className="fixed z-9999 pointer-events-none select-none"
      style={{ top: tooltip.y, left: 64, transform: "translateY(-50%)" }}
    >
      <div className="flex items-center">
        <div className="w-1.5 h-1.5 bg-gray-900 rotate-45 -mr-0.5 shrink-0" />
        <span className="px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg whitespace-nowrap shadow-lg">
          {tooltip.text}
        </span>
      </div>
    </div>,
    document.body
  );
}

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const tooltipTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTooltip = (text: string, e: React.MouseEvent<HTMLElement>) => {
    if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ text, y: rect.top + rect.height / 2 });
  };
  const hideTooltip = () => {
    tooltipTimeout.current = setTimeout(() => setTooltip(null), 80);
  };

  const { isSidebarOpen, viewMode, setSidebarOpen, setViewMode } = useSidebarStore();

  const { user } = useAuthStore();

  const userRole = user?.rol?.nombreRol || "";

  const filteredCategories = moduleCategories
    .map((category) => ({
      ...category,
      modules: category.modules.filter(
        (module) =>
          (module.roles as readonly string[]).includes(userRole) &&
          module.type.includes(viewMode)
      ),
    }))
    .filter((category) => category.modules.length > 0);

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({ maestros: false });

  const isCategoryOpen = (id: string) => openCategories[id] !== false;
  const toggleCategory = (id: string) =>
    setOpenCategories((prev) => ({ ...prev, [id]: prev[id] === false ? true : false }));

  const activeColor = viewMode === "CRM" ? "#003D5C" : "#0c4cbaff";


  const { showWarning, minutesLeft, extendSession, logoutNow } = useSessionTimeout();

  const navigateToModule = (path: any) => {
    navigate(path);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };


  return (
    <>
      {showWarning && (
        <SessionWarningModal
          minutesLeft={minutesLeft}
          onExtend={extendSession}
          onLogout={logoutNow}
        />
      )}

      <SidebarTooltip tooltip={!isSidebarOpen ? tooltip : null} />
      <Navbar />

      <div className="flex bg-gray-50 overflow-hidden mt-16" style={{ height: "calc(100vh - 4rem)" }}>

        {/* Sidebar — siempre renderizado, transición en width */}
        <aside
          className={cn(
            "bg-white flex flex-col shrink-0 border-r border-gray-200 overflow-hidden",
            "transition-[width] duration-300 ease-in-out",
            // Desktop: en el flujo, mobile: fixed overlay
            "fixed top-16 left-0 bottom-0 z-40",
            "md:relative md:top-auto md:left-auto md:bottom-auto md:z-auto md:h-full",
            isSidebarOpen ? "w-64" : "w-0 md:w-14"
          )}
        >
          {/* Header: avatar + CRM/ERP */}
          <div className={cn(
            "border-b border-gray-200 transition-all duration-300",
            isSidebarOpen ? "p-3" : "p-2"
          )}>
            {/* Switch CRM/ERP */}
            <div className={cn(
              "bg-gray-50 rounded-lg border border-gray-100 transition-all duration-300",
              isSidebarOpen ? "p-1.5" : "p-1"
            )}>
              <div className="flex flex-col gap-1">
                {/* CRM */}
                <button
                  onClick={() => setViewMode("CRM")}
                  onMouseEnter={(e) => !isSidebarOpen && showTooltip("CRM", e)}
                  onMouseLeave={hideTooltip}
                  className={cn(
                    "flex-1 flex items-center rounded-md text-xs font-semibold transition-all duration-200",
                    isSidebarOpen ? "justify-center gap-1.5 py-2 px-3" : "justify-center py-1",
                    viewMode === "CRM"
                      ? "bg-(--austral-azul) text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center shrink-0 transition-all duration-200",
                    !isSidebarOpen && "w-7 h-7 rounded-md",
                    !isSidebarOpen && (viewMode === "CRM" ? "bg-white/20" : "bg-gray-100")
                  )}>
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <span className={cn(
                    "transition-all duration-200 overflow-hidden whitespace-nowrap",
                    isSidebarOpen ? "max-w-xs opacity-100" : "max-w-0 opacity-0"
                  )}>CRM</span>
                </button>
                {/* ERP */}
                <button
                  onClick={() => setViewMode("ERP")}
                  onMouseEnter={(e) => !isSidebarOpen && showTooltip("ERP", e)}
                  onMouseLeave={hideTooltip}
                  className={cn(
                    "flex-1 flex items-center rounded-md text-xs font-semibold transition-all duration-200",
                    isSidebarOpen ? "justify-center gap-1.5 py-2 px-3" : "justify-center py-1",
                    viewMode === "ERP"
                      ? "bg-(--austral-azul-ejecutivo) text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center shrink-0 transition-all duration-200",
                    !isSidebarOpen && "w-7 h-7 rounded-md",
                    !isSidebarOpen && (viewMode === "ERP" ? "bg-white/20" : "bg-gray-100")
                  )}>
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <span className={cn(
                    "transition-all duration-200 overflow-hidden whitespace-nowrap",
                    isSidebarOpen ? "max-w-xs opacity-100" : "max-w-0 opacity-0"
                  )}>ERP</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navegación */}
          <nav className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300",
            isSidebarOpen ? "p-3" : "p-2"
          )}>
            {userRole ? (
              <div className="space-y-1">
                {filteredCategories.map((category, categoryIndex) => {
                  const isOpen = isCategoryOpen(category.id);
                  const categoryMeta = [
                    { dot: "bg-emerald-500", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", Icon: LayoutGrid },
                    { dot: "bg-blue-500",    iconBg: "bg-blue-100",    iconColor: "text-blue-600",    Icon: Briefcase },
                    { dot: "bg-purple-500",  iconBg: "bg-purple-100",  iconColor: "text-purple-600",  Icon: Sparkles },
                    { dot: "bg-orange-500",  iconBg: "bg-orange-100",  iconColor: "text-orange-600",  Icon: BookOpen },
                  ][categoryIndex] ?? { dot: "bg-gray-400", iconBg: "bg-gray-100", iconColor: "text-gray-500", Icon: Settings };

                  const { dot: dotColor, iconBg, iconColor, Icon: CategoryIcon } = categoryMeta;

                  return (
                    <div key={category.id}>
                      {/* Categoría header expandido */}
                      <div className={cn(
                        "transition-all duration-200 overflow-hidden",
                        isSidebarOpen ? "max-h-10 opacity-100 mb-0.5" : "max-h-0 opacity-0"
                      )}>
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="w-full flex items-center justify-between gap-2 px-1 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
                              <CategoryIcon className={`w-3.5 h-3.5 ${iconColor}`} />
                            </div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                              {category.title}
                            </h3>
                          </div>
                          <ChevronDown
                            className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-300 shrink-0 ${
                              isOpen ? "rotate-0" : "-rotate-90"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Categoría header colapsado — ícono clickeable para toggle */}
                      {!isSidebarOpen && (
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="w-full flex justify-center mb-1 mt-1"
                          onMouseEnter={(e) => showTooltip(category.title, e)}
                          onMouseLeave={hideTooltip}
                        >
                          <div className={cn(
                            `w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center transition-opacity`,
                            !isOpen && "opacity-50"
                          )}>
                            <CategoryIcon className={`w-3.5 h-3.5 ${iconColor}`} />
                          </div>
                        </button>
                      )}

                      {/* Módulos */}
                      {isSidebarOpen ? (
                        /* Modo expandido: con animación de colapso por categoría */
                        <div
                          className="grid transition-all duration-300 ease-in-out"
                          style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                        >
                          <div className="overflow-hidden">
                            <div className="space-y-0.5 pb-2">
                              {category.modules.map((module) => {
                                const isActive = location.pathname.startsWith(module.path);
                                const isAuroraModule = (module as any).isAuroraModule;

                                if (isAuroraModule) {
                                  return (
                                    <div key={module.id} className="relative group/aurora overflow-hidden rounded-lg">
                                      <span className="absolute inset-0 aurora-bg rounded-lg opacity-95" />
                                      <button
                                        onClick={() => navigateToModule(module.path)}
                                        className={cn(
                                          "relative w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium text-sm transition-all",
                                          isActive ? "text-white bg-white/10" : "text-white hover:bg-white/20"
                                        )}
                                      >
                                        <div className="flex items-center justify-center w-7 h-7 rounded-md bg-white/20 text-white shrink-0">
                                          <module.icon className="w-4 h-4" />
                                        </div>
                                        <span className="flex-1 text-left text-sm font-semibold">
                                          {module.name}
                                        </span>
                                      </button>
                                    </div>
                                  );
                                }

                                return (
                                  <button
                                    key={module.id}
                                    onClick={() => navigateToModule(module.path)}
                                    className={cn(
                                      "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200",
                                      isActive ? "text-white shadow-sm" : "text-gray-700 hover:bg-gray-100 hover:translate-x-1"
                                    )}
                                    style={isActive ? { backgroundColor: activeColor } : {}}
                                  >
                                    <div className={cn(
                                      "flex items-center justify-center w-7 h-7 rounded-md transition-colors shrink-0",
                                      isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                                    )}>
                                      <module.icon className="w-4 h-4" />
                                    </div>
                                    <span className="flex-1 text-left text-sm">{module.name}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ) : isOpen ? (
                        /* Modo icon-only: solo módulos de categorías abiertas */
                        <div className="space-y-0.5 pb-1">
                          {category.modules.map((module) => {
                            const isActive = location.pathname.startsWith(module.path);
                            const isAuroraModule = (module as any).isAuroraModule;

                            if (isAuroraModule) {
                              return (
                                <div
                                  key={module.id}
                                  className="relative overflow-hidden rounded-lg"
                                  onMouseEnter={(e) => showTooltip(module.name, e)}
                                  onMouseLeave={hideTooltip}
                                >
                                  <span className="absolute inset-0 aurora-bg rounded-lg opacity-95" />
                                  <button
                                    onClick={() => navigateToModule(module.path)}
                                    className="relative w-full flex items-center justify-center py-2 rounded-lg text-white hover:bg-white/20 transition-all"
                                  >
                                    <div className="flex items-center justify-center w-7 h-7 rounded-md bg-white/20">
                                      <module.icon className="w-4 h-4" />
                                    </div>
                                  </button>
                                </div>
                              );
                            }

                            return (
                              <button
                                key={module.id}
                                onClick={() => navigateToModule(module.path)}
                                onMouseEnter={(e) => showTooltip(module.name, e)}
                                onMouseLeave={hideTooltip}
                                className={cn(
                                  "w-full flex items-center justify-center py-2 rounded-lg transition-all duration-200",
                                  isActive ? "text-white shadow-sm" : "text-gray-700 hover:bg-gray-100"
                                )}
                                style={isActive ? { backgroundColor: activeColor } : {}}
                              >
                                <div className={cn(
                                  "flex items-center justify-center w-7 h-7 rounded-md transition-colors",
                                  isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                                )}>
                                  <module.icon className="w-4 h-4" />
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                  <Settings size={18} />
                </div>
                {isSidebarOpen && <p className="text-xs">No hay módulos disponibles</p>}
              </div>
            )}
          </nav>

        </aside>

        {/* Overlay móvil */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 top-16 bg-black/20 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Contenido principal */}
        <main
          className="flex-1 overflow-y-scroll flex flex-col"
          style={{ scrollbarGutter: "stable" }}
        >
          <div className="bg-white lg:p-4 flex-1 flex flex-col">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};
