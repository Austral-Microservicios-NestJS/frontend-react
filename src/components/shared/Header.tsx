import { Info, ArrowLeft, Menu, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  title: string;
  description: string;
  children?: React.ReactNode;
  onClickInfo?: () => void;
  tutorialActive?: boolean;
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
  showBackButton = false,
  isSidebarOpen = true,
  onToggleSidebar,
}: Props) => {
  const navigate = useNavigate();

  return (
    <header className="mb-4 sticky top-0 z-40">
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm transition-all duration-300">
        <div className="px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            {/* Sección de título */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1.5">
                {onToggleSidebar && (
                  <button
                    onClick={onToggleSidebar}
                    className="p-1.5 text-gray-500 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                    title={isSidebarOpen ? "Ocultar menú" : "Mostrar menú"}
                    aria-label={isSidebarOpen ? "Ocultar menú" : "Mostrar menú"}
                  >
                    {isSidebarOpen ? (
                      <ChevronLeft className="w-5 h-5" />
                    ) : (
                      <Menu className="w-5 h-5" />
                    )}
                  </button>
                )}
                {showBackButton && (
                  <button
                    onClick={() => navigate(-1)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100/80 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                    title="Regresar"
                    aria-label="Regresar"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight truncate">
                  {title}
                </h1>
                {tutorialActive && (
                  <button
                    onClick={onClickInfo}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 focus:ring-2 focus:ring-blue-100 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                    title="Información"
                    aria-label="Ver información"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                )}
              </div>
              <p className="text-sm font-medium text-gray-500 line-clamp-1">
                {description}
              </p>
            </div>

            {/* Sección de acciones */}
            <div className="flex items-center gap-3 shrink-0">{children}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
