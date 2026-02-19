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
  type VisibilityState,
  type ColumnResizeMode,
  type ColumnSizingState,
} from "@tanstack/react-table";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  FileText,
  Settings2,
  RotateCcw,
  X,
  Eye,
  EyeOff,
  ChevronsUpDown,
  AlignJustify,
  AlignCenter,
  LayoutList,
} from "lucide-react";
import { useTableStore } from "@/store/table.store";

// ─── Constantes de diseño ─────────────────────────────────────────────────────

const AUSTRAL_AZUL = "#003d5c";

export type TableDensity = "compact" | "normal" | "comfortable";

const DENSITY_CONFIG: Record<
  TableDensity,
  { py: string; px: string; text: string; label: string }
> = {
  compact: { py: "py-1.5", px: "px-3", text: "text-xs", label: "Compacta" },
  normal: { py: "py-2.5", px: "px-3", text: "text-xs", label: "Normal" },
  comfortable: {
    py: "py-3.5",
    px: "px-4",
    text: "text-sm",
    label: "Espaciosa",
  },
};

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

const SkeletonRow = ({
  cols,
  density,
}: {
  cols: number;
  density: TableDensity;
}) => {
  const d = DENSITY_CONFIG[density];
  return (
    <tr className="border-b border-gray-100">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className={`${d.px} ${d.py}`}>
          <div
            className="h-4 rounded bg-gray-200 animate-pulse"
            style={{ width: `${60 + ((i * 37) % 40)}%` }}
          />
        </td>
      ))}
    </tr>
  );
};

// ─── Tipos ───────────────────────────────────────────────────────────────────

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
  defaultDensity?: TableDensity;
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
  defaultDensity = "normal",
}: TableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [density, setDensity] = useState<TableDensity>(defaultDensity);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});
  const columnSelectorRef = useRef<HTMLDivElement>(null);

  const usingServerPagination = serverPagination !== undefined;
  const usingServerSearch = serverSearch !== undefined;
  const isLoading = usingServerPagination && serverPagination.isLoading;
  const d = DENSITY_CONFIG[density];

  // ── Zustand ──────────────────────────────────────────────────────────────
  const {
    columnVisibility,
    setColumnVisibility,
    minimizedColumns,
    setMinimizedColumns,
    resetMinimizedColumns: resetMinimizedColumnsStore,
    toggleColumn,
  } = useTableStore();

  const tableColumnVisibility: VisibilityState =
    columnVisibility[tableId] || initialColumnVisibility;
  const columnasMinimizadas = minimizedColumns[tableId] || {};

  // ── Sincronizar visibilidad inicial ──────────────────────────────────────
  useEffect(() => {
    if (
      Object.keys(initialColumnVisibility).length > 0 &&
      !columnVisibility[tableId]
    ) {
      setColumnVisibility(tableId, initialColumnVisibility);
    }
  }, [tableId, initialColumnVisibility, columnVisibility, setColumnVisibility]);

  // ── Cerrar dropdown al click externo ────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        columnSelectorRef.current &&
        !columnSelectorRef.current.contains(event.target as Node)
      ) {
        setShowColumnSelector(false);
      }
    };
    if (showColumnSelector) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showColumnSelector]);

  // ── TanStack Table ────────────────────────────────────────────────────────
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter: usingServerSearch ? serverSearch.searchTerm : globalFilter,
      columnVisibility: tableColumnVisibility,
      pagination: { pageSize: currentPageSize, pageIndex: 0 },
      columnSizing,
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
    onColumnSizingChange: setColumnSizing,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableMultiSort: true,
    enableColumnResizing: true,
    columnResizeMode: "onChange" as ColumnResizeMode,
    ...(usingServerPagination
      ? { manualPagination: true, pageCount: serverPagination.totalPages }
      : {}),
    initialState: {
      pagination: { pageSize: currentPageSize },
    },
  });

  // ── Helpers de columnas ───────────────────────────────────────────────────
  const getColumnWidth = (columnId: string) =>
    columnasMinimizadas[columnId] ? 30 : undefined;

  const toggleMinimizeColumn = (columnId: string) => {
    setMinimizedColumns(tableId, {
      ...columnasMinimizadas,
      [columnId]: !columnasMinimizadas[columnId],
    });
  };

  const handleHeaderClick = (header: any, event: React.MouseEvent) => {
    if (event.altKey || event.metaKey) {
      event.preventDefault();
      toggleMinimizeColumn(header.column.id);
    } else {
      header.column.getToggleSortingHandler()?.(event);
    }
  };

  const getColumnLabel = (column: any): string => {
    const h = column.columnDef.header;
    return typeof h === "string" ? h : column.id;
  };

  const allColumnsVisible = table
    .getAllLeafColumns()
    .every((col) => tableColumnVisibility[col.id] !== false);

  const toggleAllColumns = () => {
    const newVis: VisibilityState = {};
    table.getAllLeafColumns().forEach((col) => {
      newVis[col.id] = !allColumnsVisible;
    });
    setColumnVisibility(tableId, newVis);
  };

  // ── Paginación calculada ──────────────────────────────────────────────────
  const totalPages = usingServerPagination
    ? serverPagination.totalPages
    : table.getPageCount();
  const currentPage = usingServerPagination
    ? serverPagination.currentPage - 1
    : table.getState().pagination.pageIndex;
  const totalRecords = usingServerPagination
    ? serverPagination.totalRecords
    : table.getFilteredRowModel().rows.length;
  const fromRecord = currentPage * currentPageSize + 1;
  const toRecord = Math.min((currentPage + 1) * currentPageSize, totalRecords);

  const goToPage = (page: number) => {
    if (usingServerPagination) {
      serverPagination.onPageChange(page + 1);
    } else {
      table.setPageIndex(page);
    }
  };

  const pageNumbers = (() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i);
    if (currentPage <= 3) return [0, 1, 2, 3, 4, -1, totalPages - 1];
    if (currentPage >= totalPages - 4)
      return [
        0,
        -1,
        totalPages - 5,
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
      ];
    return [
      0,
      -1,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      -2,
      totalPages - 1,
    ];
  })();

  const activeSearchTerm = usingServerSearch
    ? serverSearch.searchTerm
    : globalFilter;

  const visibleColsCount = table
    .getAllLeafColumns()
    .filter((c) => tableColumnVisibility[c.id] !== false).length;
  const totalColsCount = table.getAllLeafColumns().length;
  const hasHiddenColumns = visibleColsCount < totalColsCount;

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      {(showSearch || showColumnToggle) && (
        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          {/* Búsqueda */}
          {showSearch && (
            <div className="relative flex-1 max-w-sm">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={14}
              />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={activeSearchTerm ?? ""}
                onChange={(e) =>
                  usingServerSearch
                    ? serverSearch.onSearchChange(e.target.value)
                    : setGlobalFilter(e.target.value)
                }
                className="w-full pl-8 pr-8 py-2 border border-gray-300 rounded-lg text-xs text-gray-800 placeholder-gray-400 bg-white outline-none transition-all duration-150 focus:border-gray-400"
              />
              {activeSearchTerm && (
                <button
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                  onClick={() =>
                    usingServerSearch
                      ? serverSearch.onSearchChange("")
                      : setGlobalFilter("")
                  }
                >
                  <X size={13} />
                </button>
              )}
            </div>
          )}

          {/* Controles derecha */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Selector de densidad */}
            <div className="flex items-center gap-0.5 border border-gray-300 rounded-lg overflow-hidden bg-white">
              {[
                {
                  key: "compact" as TableDensity,
                  Icon: AlignJustify,
                  title: "Compacta",
                },
                {
                  key: "normal" as TableDensity,
                  Icon: AlignCenter,
                  title: "Normal",
                },
                {
                  key: "comfortable" as TableDensity,
                  Icon: LayoutList,
                  title: "Espaciosa",
                },
              ].map(({ key, Icon, title }) => (
                <button
                  key={key}
                  title={title}
                  onClick={() => setDensity(key)}
                  className="p-1.5 transition-colors duration-150"
                  style={{
                    backgroundColor:
                      density === key ? AUSTRAL_AZUL : "transparent",
                    color: density === key ? "#fff" : "#9ca3af",
                  }}
                >
                  <Icon size={13} />
                </button>
              ))}
            </div>

            {/* Toggle de columnas */}
            {showColumnToggle && (
              <div className="relative shrink-0" ref={columnSelectorRef}>
                <button
                  onClick={() => setShowColumnSelector(!showColumnSelector)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 border rounded-lg text-xs font-medium transition-colors duration-150"
                  style={{
                    borderColor:
                      hasHiddenColumns || showColumnSelector
                        ? AUSTRAL_AZUL
                        : "#d1d5db",
                    backgroundColor: showColumnSelector
                      ? AUSTRAL_AZUL
                      : "white",
                    color: showColumnSelector
                      ? "#fff"
                      : hasHiddenColumns
                        ? AUSTRAL_AZUL
                        : "#374151",
                  }}
                >
                  <Settings2 size={13} />
                  <span>Columnas</span>
                  {hasHiddenColumns && !showColumnSelector && (
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white ml-0.5"
                      style={{ backgroundColor: AUSTRAL_AZUL }}
                    >
                      {totalColsCount - visibleColsCount}
                    </span>
                  )}
                </button>

                {/* ── Dropdown columnas ──────────────────────────────────── */}
                {showColumnSelector && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    {/* Header */}
                    <div
                      className="flex items-center justify-between px-4 py-3"
                      style={{ backgroundColor: AUSTRAL_AZUL }}
                    >
                      <span className="text-xs font-semibold text-white uppercase tracking-wide">
                        Gestionar Columnas
                      </span>
                      <button
                        onClick={() => setShowColumnSelector(false)}
                        className="text-white/60 hover:text-white transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    {/* Sub-header: toggle all */}
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-gray-50">
                      <span className="text-xs text-gray-500">
                        <span className="font-semibold text-gray-700">
                          {visibleColsCount}
                        </span>{" "}
                        de{" "}
                        <span className="font-semibold text-gray-700">
                          {totalColsCount}
                        </span>{" "}
                        visibles
                      </span>
                      <button
                        onClick={toggleAllColumns}
                        className="text-xs font-medium transition-colors hover:underline"
                        style={{ color: AUSTRAL_AZUL }}
                      >
                        {allColumnsVisible ? "Ocultar todas" : "Mostrar todas"}
                      </button>
                    </div>

                    {/* Lista de columnas */}
                    <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                      {table.getAllLeafColumns().map((column) => {
                        const isVisible =
                          tableColumnVisibility[column.id] !== false;
                        const isMinimized = columnasMinimizadas[column.id];
                        const label = getColumnLabel(column);

                        return (
                          <div
                            key={column.id}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                          >
                            {/* Ojo: toggle visibilidad */}
                            <button
                              onClick={() => toggleColumn(tableId, column.id)}
                              title={
                                isVisible
                                  ? "Ocultar columna"
                                  : "Mostrar columna"
                              }
                              className="flex-shrink-0 transition-colors"
                            >
                              {isVisible ? (
                                <Eye
                                  size={14}
                                  style={{ color: AUSTRAL_AZUL }}
                                />
                              ) : (
                                <EyeOff size={14} className="text-gray-300" />
                              )}
                            </button>

                            {/* Nombre */}
                            <span
                              className={`flex-1 text-xs font-medium ${isVisible ? "text-gray-800" : "text-gray-400 line-through"}`}
                            >
                              {label}
                            </span>

                            {/* Minimizar (solo si visible) */}
                            {isVisible && (
                              <button
                                onClick={() => toggleMinimizeColumn(column.id)}
                                title={
                                  isMinimized
                                    ? "Restaurar ancho"
                                    : "Minimizar columna"
                                }
                                className="flex-shrink-0 p-1 rounded border transition-colors"
                                style={
                                  isMinimized
                                    ? {
                                        backgroundColor: AUSTRAL_AZUL,
                                        borderColor: AUSTRAL_AZUL,
                                        color: "#fff",
                                      }
                                    : {
                                        backgroundColor: "white",
                                        borderColor: "#e5e7eb",
                                        color: "#9ca3af",
                                      }
                                }
                              >
                                <ChevronsUpDown size={11} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-2.5 border-t border-gray-100 flex gap-2 bg-gray-50">
                      <button
                        onClick={() => resetMinimizedColumnsStore(tableId)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg bg-white text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <RotateCcw size={11} />
                        Restablecer
                      </button>
                      <button
                        onClick={() => setShowColumnSelector(false)}
                        className="flex-1 flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-lg text-white transition-colors"
                        style={{ backgroundColor: AUSTRAL_AZUL }}
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Tabla ────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table
            className="w-full border-collapse"
            style={{ tableLayout: "fixed" }}
          >
            {/* THEAD */}
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header, idx) => {
                    const isMinimized = columnasMinimizadas[header.id];
                    const width = getColumnWidth(header.id);
                    const sorted = header.column.getIsSorted();
                    const canSort = header.column.getCanSort();
                    const isLast = idx === headerGroup.headers.length - 1;

                    return (
                      <th
                        key={header.id}
                        onClick={(e) => handleHeaderClick(header, e)}
                        title={
                          canSort
                            ? "Click para ordenar · Alt+Click para minimizar"
                            : undefined
                        }
                        className={`${d.px} py-3 text-left select-none ${canSort ? "cursor-pointer" : ""}`}
                        style={{
                          position: "relative",
                          backgroundColor: "#ffffff",
                          width: width ? `${width}px` : `${header.getSize()}px`,
                          minWidth: width ? `${width}px` : undefined,
                          maxWidth: width ? `${width}px` : undefined,
                          borderRight: !isLast ? "1px solid #e5e7eb" : "none",
                          borderBottom: "2px solid #e5e7eb",
                          transition: "background-color 0.15s ease",
                          overflow: "hidden",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f1f5f9")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "#ffffff")
                        }
                      >
                        {isMinimized ? (
                          <div className="flex items-center justify-center">
                            <span
                              className="text-base font-bold leading-none"
                              style={{ color: AUSTRAL_AZUL }}
                            >
                              •
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <span
                              className="text-xs font-semibold uppercase tracking-wide"
                              style={{ color: AUSTRAL_AZUL }}
                            >
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext(),
                                  )}
                            </span>
                            {canSort && (
                              <span className="shrink-0">
                                {sorted === "asc" ? (
                                  <ArrowUp
                                    size={12}
                                    style={{ color: AUSTRAL_AZUL }}
                                  />
                                ) : sorted === "desc" ? (
                                  <ArrowDown
                                    size={12}
                                    style={{ color: AUSTRAL_AZUL }}
                                  />
                                ) : (
                                  <ArrowUpDown
                                    size={11}
                                    className="text-gray-400"
                                  />
                                )}
                              </span>
                            )}
                            {sorted && header.column.getSortIndex() > 0 && (
                              <span
                                className="text-[9px] font-bold text-white rounded-full w-3.5 h-3.5 flex items-center justify-center flex-shrink-0"
                                style={{
                                  backgroundColor: AUSTRAL_AZUL,
                                }}
                              >
                                {header.column.getSortIndex() + 1}
                              </span>
                            )}
                          </div>
                        )}
                        {/* Handle de redimensionado */}
                        {!isMinimized && header.column.getCanResize() && (
                          <div
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              header.getResizeHandler()(e);
                            }}
                            onTouchStart={(e) => {
                              e.stopPropagation();
                              header.getResizeHandler()(e);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-0 h-full w-1.5 cursor-col-resize select-none touch-none"
                            style={{
                              backgroundColor: header.column.getIsResizing()
                                ? AUSTRAL_AZUL
                                : "transparent",
                              transition: "background-color 0.15s ease",
                            }}
                            onMouseEnter={(e) => {
                              if (!header.column.getIsResizing())
                                e.currentTarget.style.backgroundColor =
                                  "#cbd5e1";
                            }}
                            onMouseLeave={(e) => {
                              if (!header.column.getIsResizing())
                                e.currentTarget.style.backgroundColor =
                                  "transparent";
                            }}
                          />
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            {/* TBODY */}
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                Array.from({ length: Math.min(currentPageSize, 8) }).map(
                  (_, i) => (
                    <SkeletonRow
                      key={i}
                      cols={table.getVisibleLeafColumns().length}
                      density={density}
                    />
                  ),
                )
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row, index) => (
                  <tr
                    key={row.id}
                    className="transition-colors duration-100"
                    style={{
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                    }}
                    onMouseEnter={(e) => {
                      (
                        e.currentTarget as HTMLTableRowElement
                      ).style.backgroundColor = "#eef3f7";
                    }}
                    onMouseLeave={(e) => {
                      (
                        e.currentTarget as HTMLTableRowElement
                      ).style.backgroundColor =
                        index % 2 === 0 ? "#ffffff" : "#f8fafc";
                    }}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const width = getColumnWidth(cell.column.id);
                      const isMinimized = columnasMinimizadas[cell.column.id];
                      return (
                        <td
                          key={cell.id}
                          className={`${d.px} ${d.py} ${d.text} text-gray-700 align-middle`}
                          style={{
                            width: width
                              ? `${width}px`
                              : `${cell.column.getSize()}px`,
                            minWidth: width ? `${width}px` : undefined,
                            maxWidth: width ? `${width}px` : undefined,
                            overflow: "hidden",
                            transition: "all 0.15s ease",
                            whiteSpace: isMinimized ? "nowrap" : undefined,
                          }}
                        >
                          {isMinimized
                            ? null
                            : flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={table.getVisibleLeafColumns().length}
                    className="px-4 py-16 text-center"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "#f1f5f9" }}
                      >
                        <FileText
                          className="w-6 h-6 opacity-30"
                          style={{ color: AUSTRAL_AZUL }}
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-500">
                          {emptyMessage}
                        </p>
                        {activeSearchTerm && (
                          <p className="text-xs text-gray-400">
                            Sin resultados para{" "}
                            <span className="font-medium text-gray-600">
                              "{activeSearchTerm}"
                            </span>
                          </p>
                        )}
                      </div>
                      {activeSearchTerm && (
                        <button
                          onClick={() =>
                            usingServerSearch
                              ? serverSearch.onSearchChange("")
                              : setGlobalFilter("")
                          }
                          className="text-xs font-medium px-4 py-1.5 rounded-lg border transition-colors hover:bg-gray-50"
                          style={{
                            borderColor: AUSTRAL_AZUL,
                            color: AUSTRAL_AZUL,
                          }}
                        >
                          Limpiar búsqueda
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Footer / Paginación ─────────────────────────────────────────── */}
        {showPagination && totalPages >= 1 && !isLoading && (
          <div className="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50">
            {/* Info + selector de page size */}
            <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
              <span>
                Mostrando{" "}
                <span className="font-semibold text-gray-700">
                  {fromRecord}
                </span>
                {" – "}
                <span className="font-semibold text-gray-700">{toRecord}</span>
                {" de "}
                <span className="font-semibold text-gray-700">
                  {totalRecords}
                </span>
                {" registros"}
              </span>

              {!usingServerPagination && (
                <>
                  <span className="text-gray-300">|</span>
                  <div className="flex items-center gap-1.5">
                    <span>Ver</span>
                    <select
                      value={currentPageSize}
                      onChange={(e) => {
                        const size = Number(e.target.value);
                        setCurrentPageSize(size);
                        table.setPageSize(size);
                        table.setPageIndex(0);
                      }}
                      className="border border-gray-300 rounded px-1.5 py-0.5 text-xs font-semibold bg-white outline-none cursor-pointer"
                      style={{ color: AUSTRAL_AZUL }}
                    >
                      {PAGE_SIZE_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <span>por página</span>
                  </div>
                </>
              )}

              {isLoading && (
                <span className="text-xs text-blue-500 animate-pulse">
                  Cargando...
                </span>
              )}
            </div>

            {/* Botones de navegación */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => goToPage(0)}
                  disabled={currentPage === 0}
                  className="p-1.5 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Primera página"
                >
                  <ChevronsLeft size={13} />
                </button>

                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="p-1.5 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Página anterior"
                >
                  <ChevronLeft size={13} />
                </button>

                <div className="flex items-center gap-0.5">
                  {pageNumbers.map((page, i) =>
                    page < 0 ? (
                      <span
                        key={`ellipsis-${i}`}
                        className="w-7 text-center text-xs text-gray-400 select-none"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className="w-7 h-7 rounded-lg text-xs font-medium transition-colors border"
                        style={{
                          backgroundColor:
                            currentPage === page ? AUSTRAL_AZUL : "white",
                          color: currentPage === page ? "#fff" : "#374151",
                          borderColor:
                            currentPage === page ? AUSTRAL_AZUL : "#e5e7eb",
                        }}
                      >
                        {page + 1}
                      </button>
                    ),
                  )}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                  className="p-1.5 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Página siguiente"
                >
                  <ChevronRight size={13} />
                </button>

                <button
                  onClick={() => goToPage(totalPages - 1)}
                  disabled={currentPage >= totalPages - 1}
                  className="p-1.5 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Última página"
                >
                  <ChevronsRight size={13} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
