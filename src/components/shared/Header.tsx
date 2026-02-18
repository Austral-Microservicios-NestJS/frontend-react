import {
  Info,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  title: string;
  description: string;
  children?: React.ReactNode;
  onClickInfo?: () => void;
  tutorialActive?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  showBackButton?: boolean;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export const Header = ({
  title,
  description,
  children,
  onClickInfo,
  tutorialActive = false,
  isCollapsed = false,
  onToggleCollapse,
  showBackButton = false,
  isSidebarOpen = true,
  onToggleSidebar,
}: Props) => {
  const navigate = useNavigate();

  return (
    <header className="mb-4">
      {isCollapsed ? (
        /* Header colapsado */
        <div className="bg-white border-b border-gray-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-base font-semibold text-gray-900">{title}</h1>
              <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                Contraído
              </span>
            </div>
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded transition-colors"
                title="Expandir"
                aria-label="Expandir header"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Header expandido */
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 py-3">
            <div className="flex items-start justify-between gap-4">
              {/* Sección de título */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {onToggleSidebar && (
                    <button
                      onClick={onToggleSidebar}
                      className="p-1 text-gray-500 hover:text-amber-800 hover:bg-gray-50 rounded transition-colors"
                      title={isSidebarOpen ? "Ocultar menú" : "Mostrar menú"}
                      aria-label={
                        isSidebarOpen ? "Ocultar menú" : "Mostrar menú"
                      }
                    >
                      {isSidebarOpen ? (
                        <ChevronLeft className="w-4 h-4" />
                      ) : (
                        <Menu className="w-4 h-4" />
                      )}
                    </button>
                  )}
                  {showBackButton && (
                    <button
                      onClick={() => navigate(-1)}
                      className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors"
                      title="Regresar"
                      aria-label="Regresar"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  )}
                  <h1 className="text-xl font-bold text-gray-900 truncate">
                    {title}
                  </h1>
                  {tutorialActive && (
                    <button
                      onClick={onClickInfo}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Información"
                      aria-label="Ver información"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-500 line-clamp-1">
                  {description}
                </p>
              </div>

              {/* Sección de acciones */}
              <div className="flex items-center gap-2 shrink-0">
                {children}
                {onToggleCollapse && (
                  <button
                    onClick={onToggleCollapse}
                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded transition-colors"
                    title="Contraer"
                    aria-label="Contraer header"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};