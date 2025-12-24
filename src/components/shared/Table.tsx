import { useState, useEffect, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type SortingState,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  ChevronDown,
  FileText,
  Columns3,
  RotateCcw,
  Info,
} from "lucide-react";
import { useTableStore } from "@/store/table.store";

interface ServerPaginationConfig {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

interface ServerSearchConfig {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchPlaceholder?: string;
  pageSize?: number;
  showSearch?: boolean;
  showPagination?: boolean;
  showColumnToggle?: boolean;
  emptyMessage?: string;
  className?: string;
  initialColumnVisibility?: Record<string, boolean>;
  tableId?: string;
  serverPagination?: ServerPaginationConfig;
  serverSearch?: ServerSearchConfig;
}

export const Table = <T,>({
  data = [],
  columns = [],
  searchPlaceholder = "Buscar...",
  pageSize = 10,
  showSearch = true,
  showPagination = true,
  showColumnToggle = true,
  emptyMessage = "No hay datos disponibles",
  className = "",
  initialColumnVisibility = {},
  tableId = "default",
  serverPagination,
  serverSearch,
}: TableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const columnSelectorRef = useRef<HTMLDivElement>(null);

  // Zustand store para visibilidad de columnas y columnas minimizadas
  const {
    columnVisibility,
    setColumnVisibility,
    minimizedColumns,
    setMinimizedColumns,
    resetMinimizedColumns: resetMinimizedColumnsStore,
  } = useTableStore();
  const tableColumnVisibility =
    columnVisibility[tableId] || initialColumnVisibility;
  const columnasMinimizadas = minimizedColumns[tableId] || {};

  // Determinar si se está usando paginación/búsqueda del servidor
  const usingServerPagination = serverPagination !== undefined;
  const usingServerSearch = serverSearch !== undefined;

  // Sincronizar visibilidad de columnas con Zustand
  useEffect(() => {
    if (
      Object.keys(initialColumnVisibility).length > 0 &&
      !columnVisibility[tableId]
    ) {
      setColumnVisibility(tableId, initialColumnVisibility);
    }
  }, [tableId, initialColumnVisibility, columnVisibility, setColumnVisibility]);

  // Las columnas minimizadas se manejan automáticamente con Zustand

  // Cerrar el selector de columnas al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        columnSelectorRef.current &&
        !columnSelectorRef.current.contains(event.target as Node)
      ) {
        setShowColumnSelector(false);
      }
    }

    if (showColumnSelector) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showColumnSelector]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter: usingServerSearch ? serverSearch.searchTerm : globalFilter,
      columnVisibility: tableColumnVisibility,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: usingServerSearch
      ? serverSearch.onSearchChange
      : setGlobalFilter,
    onColumnVisibilityChange: (updater) => {
      const newVisibility =
        typeof updater === "function"
          ? updater(tableColumnVisibility)
          : updater;
      setColumnVisibility(tableId, newVisibility);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableMultiSort: true,
    ...(usingServerPagination
      ? {
          manualPagination: true,
          pageCount: serverPagination.totalPages,
        }
      : {}),
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
  });

  // Función para manejar click en encabezado
  const handleHeaderClick = (header: any, event: React.MouseEvent) => {
    if (event.altKey || event.metaKey) {
      // Alt/Option + Click = Minimizar/Restaurar columna
      event.preventDefault();
      setMinimizedColumns(tableId, {
        ...columnasMinimizadas,
        [header.column.id]: !columnasMinimizadas[header.column.id],
      });
    } else {
      // Click normal = Ordenar
      header.column.getToggleSortingHandler()?.(event);
    }
  };

  // Función para obtener el ancho de la columna
  const getColumnWidth = (columnId: string) => {
    if (columnasMinimizadas[columnId]) {
      return 30; // Ancho minimizado
    }
    return undefined; // Ancho automático
  };

  // Función para alternar minimización de columna
  const toggleMinimizeColumn = (columnId: string) => {
    const currentMinimized = columnasMinimizadas[columnId] || false;
    setMinimizedColumns(tableId, {
      ...columnasMinimizadas,
      [columnId]: !currentMinimized,
    });
  };

  // Función para resetear columnas minimizadas
  const resetMinimizedColumns = () => {
    resetMinimizedColumnsStore(tableId);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Barra de búsqueda y controles */}
      {(showSearch || showColumnToggle) && (
        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center sm:justify-between">
          {/* Búsqueda */}
          {showSearch && (
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={
                  usingServerSearch
                    ? serverSearch.searchTerm
                    : globalFilter ?? ""
                }
                onChange={(e) =>
                  usingServerSearch
                    ? serverSearch.onSearchChange(e.target.value)
                    : setGlobalFilter(e.target.value)
                }
                className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg transition-all duration-200 text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          )}

          {/* Selector de columnas */}
          {showColumnToggle && (
            <div className="relative shrink-0" ref={columnSelectorRef}>
              <button
                onClick={() => setShowColumnSelector(!showColumnSelector)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-gray-700 text-xs font-medium w-full sm:w-auto"
              >
                <Columns3 size={14} />
                <span>Columnas</span>
              </button>

              {/* Dropdown de columnas - MEJORADO */}
              {showColumnSelector && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
                  <div className="p-3">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900">
                        Gestionar Columnas
                      </h3>
                      <button
                        onClick={() => setShowColumnSelector(false)}
                        className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                      >
                        ×
                      </button>
                    </div>

                    {/* Lista de columnas - MINIMIZAR */}
                    <div className="space-y-1.5 max-h-64 overflow-y-auto mb-3">
                      {table.getAllLeafColumns().map((column) => {
                        const isMinimized = columnasMinimizadas[column.id];
                        return (
                          <div
                            key={column.id}
                            className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-gray-50"
                          >
                            <span className="flex-1 text-sm text-gray-700 font-medium">
                              {typeof column.columnDef.header === "string"
                                ? column.columnDef.header
                                : column.id}
                            </span>
                            <button
                              onClick={() => toggleMinimizeColumn(column.id)}
                              className={`text-xs px-3 py-1.5 rounded font-medium transition-all duration-200 ${
                                isMinimized
                                  ? "bg-blue-500 text-white hover:bg-blue-600 shadow-sm"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                              title={
                                isMinimized
                                  ? "Restaurar columna"
                                  : "Minimizar columna"
                              }
                            >
                              {isMinimized ? "Restaurar" : "Minimizar"}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Botón restablecer */}
                    <button
                      onClick={() => {
                        resetMinimizedColumns();
                        setShowColumnSelector(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <RotateCcw size={14} />
                      Restaurar Columnas
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-amber-800 border-b border-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const isMinimized = columnasMinimizadas[header.id];
                    const width = getColumnWidth(header.id);
                    return (
                      <th
                        key={header.id}
                        className="px-2 sm:px-3 py-2 text-left text-xs font-semibold text-white cursor-pointer hover:bg-amber-700 whitespace-nowrap group relative"
                        onClick={(e) => handleHeaderClick(header, e)}
                        title="Click para ordenar | Alt+Click para minimizar"
                        style={{
                          width: width ? `${width}px` : undefined,
                          minWidth: width ? `${width}px` : undefined,
                          maxWidth: width ? `${width}px` : undefined,
                          transition: "all 0.2s ease-in-out",
                        }}
                      >
                        <div className="flex items-center gap-1.5">
                          {isMinimized ? (
                            <div className="flex items-center justify-center h-full">
                              <span className="transform -rotate-90 text-[10px] whitespace-nowrap origin-center">
                                {typeof header.column.columnDef.header ===
                                "string"
                                  ? header.column.columnDef.header
                                  : "•"}
                              </span>
                            </div>
                          ) : (
                            <>
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                              {header.column.getCanSort() && (
                                <div className="flex items-center gap-0.5">
                                  {/* Indicador de orden para multi-sorting */}
                                  {header.column.getIsSorted() && (
                                    <span className="text-[10px] font-bold text-white bg-amber-600 rounded-full w-3.5 h-3.5 flex items-center justify-center">
                                      {header.column.getSortIndex() + 1}
                                    </span>
                                  )}
                                  <div className="flex flex-col">
                                    <ChevronUp
                                      size={10}
                                      className={`${
                                        header.column.getIsSorted() === "asc"
                                          ? "text-white"
                                          : "text-amber-300"
                                      }`}
                                    />
                                    <ChevronDown
                                      size={10}
                                      className={`${
                                        header.column.getIsSorted() === "desc"
                                          ? "text-white"
                                          : "text-amber-300"
                                      }`}
                                    />
                                  </div>
                                </div>
                              )}
                            </>
                          )}

                          {/* Tooltip para Alt+Click */}
                          <div className="absolute top-full left-0 mt-1 px-1.5 py-0.5 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            <Info size={8} className="inline mr-0.5" />
                            Alt+Click para minimizar
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-200">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row, index) => {
                  const rowClassName = `transition-colors duration-150 ${
                    index % 2 === 0
                      ? "bg-white hover:bg-gray-50"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`;

                  return (
                    <tr key={row.id} className={rowClassName}>
                      {row.getVisibleCells().map((cell) => {
                        const width = getColumnWidth(cell.column.id);
                        const isMinimized = columnasMinimizadas[cell.column.id];
                        return (
                          <td
                            key={cell.id}
                            className="px-2 sm:px-3 py-2 text-xs text-gray-900 whitespace-nowrap"
                            style={{
                              width: width ? `${width}px` : undefined,
                              minWidth: width ? `${width}px` : undefined,
                              maxWidth: width ? `${width}px` : undefined,
                              overflow: isMinimized ? "hidden" : "visible",
                              transition: "all 0.2s ease-in-out",
                            }}
                          >
                            {isMinimized ? (
                              <div
                                className="h-full w-full"
                                title="Columna minimizada"
                              />
                            ) : (
                              flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-2 sm:px-4 py-12 text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">
                        {emptyMessage}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {showPagination &&
          (usingServerPagination
            ? serverPagination.totalPages > 1
            : table.getPageCount() > 1) && (
            <div className="px-3 py-2.5 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <span>Mostrando</span>
                <span className="font-medium">
                  {usingServerPagination
                    ? (serverPagination.currentPage - 1) * pageSize + 1
                    : table.getState().pagination.pageIndex *
                        table.getState().pagination.pageSize +
                      1}
                </span>
                <span>a</span>
                <span className="font-medium">
                  {usingServerPagination
                    ? Math.min(
                        serverPagination.currentPage * pageSize,
                        serverPagination.totalRecords
                      )
                    : Math.min(
                        (table.getState().pagination.pageIndex + 1) *
                          table.getState().pagination.pageSize,
                        table.getFilteredRowModel().rows.length
                      )}
                </span>
                <span>de</span>
                <span className="font-medium">
                  {usingServerPagination
                    ? serverPagination.totalRecords
                    : table.getFilteredRowModel().rows.length}
                </span>
                <span>resultados</span>
                {usingServerPagination && serverPagination.isLoading && (
                  <span className="ml-1.5 text-[10px] text-blue-600 animate-pulse">
                    Cargando...
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    usingServerPagination
                      ? serverPagination.onPageChange(1)
                      : table.setPageIndex(0)
                  }
                  disabled={
                    usingServerPagination
                      ? serverPagination.currentPage === 1
                      : !table.getCanPreviousPage()
                  }
                  className="inline-flex items-center gap-0.5 px-2 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                >
                  <ChevronsLeft size={14} />
                </button>

                <button
                  onClick={() =>
                    usingServerPagination
                      ? serverPagination.onPageChange(
                          serverPagination.currentPage - 1
                        )
                      : table.previousPage()
                  }
                  disabled={
                    usingServerPagination
                      ? serverPagination.currentPage === 1
                      : !table.getCanPreviousPage()
                  }
                  className="inline-flex items-center gap-0.5 px-2 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                >
                  <ChevronLeft size={14} />
                  <span className="hidden sm:inline">Anterior</span>
                </button>

                <div className="flex items-center gap-0.5">
                  {Array.from(
                    {
                      length: Math.min(
                        5,
                        usingServerPagination
                          ? serverPagination.totalPages
                          : table.getPageCount()
                      ),
                    },
                    (_, i) => {
                      let page;
                      const currentPage = usingServerPagination
                        ? serverPagination.currentPage - 1
                        : table.getState().pagination.pageIndex;
                      const totalPages = usingServerPagination
                        ? serverPagination.totalPages
                        : table.getPageCount();

                      if (totalPages <= 5) {
                        page = i;
                      } else if (currentPage <= 2) {
                        page = i;
                      } else if (currentPage >= totalPages - 3) {
                        page = totalPages - 5 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={page}
                          onClick={() =>
                            usingServerPagination
                              ? serverPagination.onPageChange(page + 1)
                              : table.setPageIndex(page)
                          }
                          className={`w-7 h-7 text-xs font-medium rounded-lg transition-colors duration-150 ${
                            currentPage === page
                              ? "bg-amber-800 text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {page + 1}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  onClick={() =>
                    usingServerPagination
                      ? serverPagination.onPageChange(
                          serverPagination.currentPage + 1
                        )
                      : table.nextPage()
                  }
                  disabled={
                    usingServerPagination
                      ? serverPagination.currentPage >=
                        serverPagination.totalPages
                      : !table.getCanNextPage()
                  }
                  className="inline-flex items-center gap-0.5 px-2 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                >
                  <span className="hidden sm:inline">Siguiente</span>
                  <ChevronRight size={14} />
                </button>

                <button
                  onClick={() =>
                    usingServerPagination
                      ? serverPagination.onPageChange(
                          serverPagination.totalPages
                        )
                      : table.setPageIndex(table.getPageCount() - 1)
                  }
                  disabled={
                    usingServerPagination
                      ? serverPagination.currentPage >=
                        serverPagination.totalPages
                      : !table.getCanNextPage()
                  }
                  className="inline-flex items-center gap-0.5 px-2 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                >
                  <ChevronsRight size={14} />
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};