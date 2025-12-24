import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface GridProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  columns?: {
    default: number; // columnas por defecto
    sm?: number; // small screens
    md?: number; // medium screens
    lg?: number; // large screens
    xl?: number; // extra large screens
  };
  pageSize?: number;
  pageSizeOptions?: number[];
  showPagination?: boolean;
  emptyMessage?: string;
  className?: string;
  gap?: number;
}

export const Grid = <T,>({
  data = [],
  renderItem,
  columns = { default: 1, sm: 2, md: 3, lg: 4 },
  pageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  showPagination = true,
  emptyMessage = "No hay datos disponibles",
  className = "",
  gap = 4,
}: GridProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);

  // Calcular paginación
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  // Generar clases de columnas responsivas
  const getGridColumns = () => {
    const classes = [`grid-cols-${columns.default}`];
    if (columns.sm) classes.push(`sm:grid-cols-${columns.sm}`);
    if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
    if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`);
    return classes.join(" ");
  };

  // Manejar cambio de página
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Manejar cambio de items por página
  const handleItemsPerPageChange = (newSize: number) => {
    setItemsPerPage(newSize);
    setCurrentPage(1); // Resetear a la primera página
  };

  // Resetear cuando cambian los datos
  useState(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  });

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Grid de items */}
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">{emptyMessage}</p>
        </div>
      ) : (
        <div className={`grid ${getGridColumns()} gap-${gap}`}>
          {currentData.map((item, index) => (
            <div key={startIndex + index}>{renderItem(item, startIndex + index)}</div>
          ))}
        </div>
      )}

      {/* Paginación */}
      {showPagination && data.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-4">
          {/* Info y selector de items por página */}
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <span>
              Mostrando {startIndex + 1} - {Math.min(endIndex, data.length)} de{" "}
              {data.length}
            </span>
            <div className="flex items-center gap-2">
              <span>Mostrar:</span>
              <select
                value={itemsPerPage}
                onChange={(e) =>
                  handleItemsPerPageChange(Number(e.target.value))
                }
                className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-offset-0 outline-none transition-all"
                style={{ 
                  borderColor: 'var(--austral-azul)'
                }}
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Controles de paginación */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Primera página"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Página anterior"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Números de página */}
            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  if (totalPages <= 7) return true;
                  if (page === 1 || page === totalPages) return true;
                  if (page >= currentPage - 1 && page <= currentPage + 1)
                    return true;
                  return false;
                })
                .map((page, index, array) => (
                  <div key={page} className="flex items-center">
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-1 text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => goToPage(page)}
                      className={`min-w-7 h-7 px-2 rounded text-xs font-medium transition-colors ${
                        currentPage === page
                          ? "text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      style={
                        currentPage === page
                          ? { backgroundColor: "var(--austral-azul)" }
                          : {}
                      }
                    >
                      {page}
                    </button>
                  </div>
                ))}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Página siguiente"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Última página"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
