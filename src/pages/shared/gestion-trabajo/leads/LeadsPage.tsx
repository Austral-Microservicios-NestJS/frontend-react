import { useState, useRef, useMemo } from "react";
import { Header, BotonRegistro } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { RegistrarLead } from "@/components/modulos/leads/modales/RegistrarLead";
import { useLeads } from "@/hooks/useLeads";
import type { Lead, CreateLead } from "@/types/lead.interface";
import { EstadoLead, tipoSeguroOptions } from "@/types/lead.interface";
import {
  LayoutGrid,
  List,
  Search,
  Filter,
  Users,
  Target,
  Ban,
  CheckCircle2,
  MoreHorizontal,
  Calendar,
  Building2,
  Phone,
  Mail,
  ArrowRight,
  Tag,
  X,
  ChevronDown,
  Clock,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";

type EstadoKey = "NUEVO" | "EN_PROCESO" | "COTIZADO" | "CERRADO" | "PERDIDO";

type ColumnDef = {
  estado: EstadoKey;
  title: string;
  color: string;
  active: string;
  badge: string;
};

const ESTADO_COLUMNS: ColumnDef[] = [
  { estado: "NUEVO",      title: "Nuevo",      color: "bg-indigo-500",  active: "bg-indigo-500 text-white border-indigo-500",   badge: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { estado: "EN_PROCESO", title: "En proceso", color: "bg-blue-500",    active: "bg-blue-500 text-white border-blue-500",       badge: "bg-blue-50 text-blue-700 border-blue-200" },
  { estado: "COTIZADO",   title: "Cotizado",   color: "bg-amber-500",   active: "bg-amber-500 text-white border-amber-500",     badge: "bg-amber-50 text-amber-700 border-amber-200" },
  { estado: "CERRADO",    title: "Cerrado",    color: "bg-emerald-500", active: "bg-emerald-500 text-white border-emerald-500", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { estado: "PERDIDO",    title: "Perdido",    color: "bg-rose-500",    active: "bg-rose-500 text-white border-rose-500",       badge: "bg-rose-50 text-rose-700 border-rose-200" },
];

function diasDesde(fecha: string): number {
  return Math.floor((Date.now() - new Date(fecha).getTime()) / (1000 * 60 * 60 * 24));
}

export default function LeadsPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [leadToEdit, setLeadToEdit]     = useState<Lead | null>(null);
  const [viewMode, setViewMode]         = useState<"kanban" | "list">("kanban");
  const [searchQuery, setSearchQuery]   = useState("");
  const [tipoSeguroFilter, setTipoSeguroFilter] = useState<string>("");
  const [estadoFilter, setEstadoFilter] = useState<EstadoKey | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const {
    leads,
    leadsByEstado,
    filterByEstado,
    addLead,
    updateLead,
    cambiarEstadoLead,
    isLoading,
    error,
  } = useLeads();

  const filteredByEstado = useMemo(
    () => filterByEstado(searchQuery, tipoSeguroFilter || undefined),
    [searchQuery, tipoSeguroFilter, leads]
  );

  const isFiltering    = searchQuery.trim() !== "" || tipoSeguroFilter !== "";
  const activeByEstado = isFiltering ? filteredByEstado : leadsByEstado;

  const totalFiltered = useMemo(() => {
    if (estadoFilter) return activeByEstado[estadoFilter]?.length ?? 0;
    return isFiltering
      ? Object.values(filteredByEstado).reduce((a, b) => a + b.length, 0)
      : leads.length;
  }, [activeByEstado, estadoFilter, isFiltering, filteredByEstado, leads]);

  const visibleColumns = estadoFilter
    ? ESTADO_COLUMNS.filter((c) => c.estado === estadoFilter)
    : ESTADO_COLUMNS;

  const allFilteredLeads = useMemo(() => {
    const all = Object.values(activeByEstado).flat();
    const result = estadoFilter ? all.filter((l) => l.estado === estadoFilter) : all;
    return [...result].sort((a, b) => {
      const timeA = new Date(a.fechaUltimoCambioEstado).getTime();
      const timeB = new Date(b.fechaUltimoCambioEstado).getTime();
      return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
    });
  }, [activeByEstado, estadoFilter, sortOrder]);

  const handleOpenModal = () => { setLeadToEdit(null); setIsModalOpen(true); };
  const handleEditLead  = (lead: Lead) => { setLeadToEdit(lead); setIsModalOpen(true); };

  const handleSubmitLead = async (data: CreateLead) => {
    if (leadToEdit) {
      await updateLead(leadToEdit.idLead, data);
    } else {
      await addLead(data);
    }
  };

  const handleDrop = async (leadId: string, nuevoEstado: EstadoLead) => {
    await cambiarEstadoLead(leadId, nuevoEstado);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setTipoSeguroFilter("");
    setEstadoFilter(null);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "desc" ? "asc" : "desc");
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <p className="mt-4 text-sm text-gray-500 font-medium">Cargando leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      <Header
        title="Gestión de Leads"
        description="Gestiona tus oportunidades de negocio"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      >
        <div className="flex items-center gap-3">
          <div className="flex bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode("kanban")}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === "kanban"
                  ? "bg-gray-100 text-gray-900 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              title="Vista tablero"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === "list"
                  ? "bg-gray-100 text-gray-900 shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              title="Vista lista"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <BotonRegistro label="Nuevo Lead" onClick={handleOpenModal} />
        </div>
      </Header>

      {error ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center bg-white border border-red-100 rounded-xl p-8 max-w-md shadow-sm">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Ban className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Backend no disponible</h3>
            <p className="text-sm text-gray-600">No se pudo conectar con el servidor. Por favor intenta más tarde.</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden flex flex-col p-6 gap-4">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
            <StatsCard
              title={isFiltering || estadoFilter ? "Resultados" : "Total Leads"}
              value={totalFiltered}
              icon={Users}
              color="text-blue-600"
              bg="bg-blue-50"
            />
            <StatsCard title="Nuevos"   value={activeByEstado.NUEVO.length}     icon={Target}       color="text-indigo-600"  bg="bg-indigo-50" />
            <StatsCard title="Ganados"  value={activeByEstado.CERRADO.length}   icon={CheckCircle2} color="text-emerald-600" bg="bg-emerald-50" />
            <StatsCard title="Perdidos" value={activeByEstado.PERDIDO.length}   icon={Ban}          color="text-rose-600"    bg="bg-rose-50" />
          </div>


          {/* Search + filters */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nombre, email, teléfono, empresa..."
                className="pl-9 pr-9 bg-white border-gray-200 h-9 text-sm rounded-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilterDropdown((v) => !v)}
                className={`h-9 rounded-md ${
                  tipoSeguroFilter
                    ? "border-blue-400 text-blue-600 bg-blue-50"
                    : "text-gray-600 border-gray-200 hover:bg-white"
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                {tipoSeguroFilter
                  ? tipoSeguroOptions.find((o) => o.value === tipoSeguroFilter)?.label ?? "Tipo"
                  : "Tipo seguro"}
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
              {showFilterDropdown && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                  <button
                    onClick={() => { setTipoSeguroFilter(""); setShowFilterDropdown(false); }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                      !tipoSeguroFilter ? "font-semibold text-blue-600" : "text-gray-700"
                    }`}
                  >
                    Todos los tipos
                  </button>
                  {tipoSeguroOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setTipoSeguroFilter(opt.value); setShowFilterDropdown(false); }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                        tipoSeguroFilter === opt.value ? "font-semibold text-blue-600" : "text-gray-700"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleSortOrder}
              className="h-9 rounded-md text-gray-600 border-gray-200 hover:bg-gray-50"
              title={sortOrder === "desc" ? "Ordenar: Más recientes primero" : "Ordenar: Más antiguos primero"}
            >
              {sortOrder === "desc" ? (
                <ArrowDown className="w-4 h-4 mr-2" />
              ) : (
                <ArrowUp className="w-4 h-4 mr-2" />
              )}
              <span className="text-sm">
                {sortOrder === "desc" ? "Recientes" : "Antiguos"}
              </span>
            </Button>
          </div>

          {/* Estado filter tabs */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={() => setEstadoFilter(null)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                estadoFilter === null
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              Todos ({leads.length})
            </button>
            {ESTADO_COLUMNS.map((col) => (
              <button
                key={col.estado}
                onClick={() => setEstadoFilter(estadoFilter === col.estado ? null : col.estado)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                  estadoFilter === col.estado
                    ? col.active
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {col.title} ({activeByEstado[col.estado].length})
              </button>
            ))}
            {(isFiltering || estadoFilter) && (
              <button
                onClick={clearFilters}
                className="text-xs text-blue-500 hover:text-blue-700 underline ml-1"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Contenido principal */}
          {viewMode === "kanban" ? (
            <div className="flex-1 overflow-auto min-h-0">
              <div
                className={`flex gap-4 h-full pb-2 ${
                  visibleColumns.length > 1 ? "min-w-[900px]" : ""
                }`}
              >
                {visibleColumns.map((col) => (
                  <LeadColumn
                    key={col.estado}
                    title={col.title}
                    count={activeByEstado[col.estado].length}
                    leads={activeByEstado[col.estado]}
                    estado={col.estado}
                    statusColor={col.color}
                    onDrop={handleDrop}
                    onEdit={handleEditLead}
                    single={visibleColumns.length === 1}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-auto min-h-0">
              <LeadList leads={allFilteredLeads} onEdit={handleEditLead} />
            </div>
          )}
        </div>
      )}

      <RegistrarLead
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setLeadToEdit(null); }}
        onSubmit={handleSubmitLead}
        leadToEdit={leadToEdit}
      />
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, color, bg }: {
  title: string; value: number; icon: any; color: string; bg: string;
}) {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
        <h3 className="text-xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
      <div className={`p-2 rounded-md ${bg}`}>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
    </div>
  );
}

function LeadColumn({
  title,
  count,
  leads,
  estado,
  statusColor,
  onDrop,
  onEdit,
  single,
}: {
  title: string;
  count: number;
  leads: Lead[];
  estado: EstadoKey;
  statusColor: string;
  onDrop: (id: string, estado: EstadoLead) => void;
  onEdit: (lead: Lead) => void;
  single: boolean;
}) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const dragCounter = useRef(0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    if (e.dataTransfer.types.includes("text/plain")) setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDraggingOver(false);
  };

  const handleDropEvent = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    dragCounter.current = 0;
    const leadId = e.dataTransfer.getData("text/plain");
    if (leadId) onDrop(leadId, estado as EstadoLead);
  };

  return (
    <div
      className={`flex flex-col rounded-lg border transition-colors ${
        single ? "flex-1" : "w-72 shrink-0"
      } ${isDraggingOver ? "bg-blue-50 border-blue-300" : "bg-gray-50 border-gray-200"}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDropEvent}
    >
      <div className="px-3 py-2.5 border-b border-gray-200 bg-white rounded-t-lg flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${statusColor}`} />
          <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
        </div>
        <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded">{count}</span>
      </div>
      <div className="flex-1 p-2 space-y-2 overflow-y-auto">
        {leads.length === 0 ? (
          <div className="h-24 flex items-center justify-center border border-dashed border-gray-200 rounded-md m-1">
            <p className="text-xs font-medium text-gray-400">Sin leads</p>
          </div>
        ) : (
          leads.map((lead) => <LeadCard key={lead.idLead} lead={lead} onEdit={onEdit} />)
        )}
      </div>
    </div>
  );
}

function LeadCard({ lead, onEdit }: { lead: Lead; onEdit: (lead: Lead) => void }) {
  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", lead.idLead);
  };

  const priorityConfig: Record<string, { bar: string; badge: string; label: string }> = {
    ALTA:  { bar: "bg-red-500",     badge: "bg-red-50 text-red-700 border-red-200",           label: "Alta" },
    MEDIA: { bar: "bg-amber-400",   badge: "bg-amber-50 text-amber-700 border-amber-200",     label: "Media" },
    BAJA:  { bar: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Baja" },
  };

  const p   = priorityConfig[lead.prioridad] ?? priorityConfig.MEDIA;
  const dias = diasDesde(lead.fechaCreacion);

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="group relative bg-white rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all active:cursor-grabbing overflow-hidden"
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${p.bar} rounded-l-xl`} />

      <div className="pl-4 pr-3 pt-3 pb-3">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${p.badge}`}>
              {p.label}
            </span>
            {lead.tipoSeguro && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
                {lead.tipoSeguro.replace("_", " ")}
              </span>
            )}
          </div>
          <button
            className="text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => { e.stopPropagation(); onEdit(lead); }}
            title="Editar"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

        <h4
          className="font-semibold text-gray-900 text-sm leading-snug mb-1 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => onEdit(lead)}
        >
          {lead.nombre}
        </h4>

        {lead.empresa && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
            <Building2 className="w-3 h-3 shrink-0" />
            <span className="truncate">{lead.empresa}</span>
          </div>
        )}

        {(lead.email || lead.telefono) && (
          <div className="space-y-1 mb-3">
            {lead.email && (
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                <span className="truncate">{lead.email}</span>
              </div>
            )}
            {lead.telefono && (
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <Phone className="w-3 h-3 text-gray-400 shrink-0" />
                <span>{lead.telefono}</span>
              </div>
            )}
          </div>
        )}

        {lead.notas && (
          <div className="mb-3 px-2.5 py-2 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-[10px] text-gray-500 italic line-clamp-2 leading-relaxed">
              "{lead.notas}"
            </p>
          </div>
        )}

        <div className="pt-2.5 border-t border-gray-100 space-y-2">
          <div className="flex items-center gap-3 text-[10px] text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>
                {new Date(lead.fechaCreacion).toLocaleDateString("es-PE", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>
            <div className={`flex items-center gap-1 ${dias > 7 ? "text-amber-500 font-medium" : ""}`}>
              <Clock className="w-3 h-3" />
              <span>{dias}d</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              <span className="uppercase tracking-wide">{lead.fuente?.replace(/_/g, " ")}</span>
            </div>
          </div>
          <Link
            to={`/dashboard/gestion-trabajo/leads/${lead.idLead}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-1 text-[11px] font-semibold text-white bg-[#0066CC] hover:bg-[#0052A3] w-full py-1.5 rounded-lg transition-colors shadow-sm"
          >
            Ver detalle
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function LeadList({ leads, onEdit }: { leads: Lead[]; onEdit: (lead: Lead) => void }) {
  const estadoBadge: Record<string, string> = {
    NUEVO:      "bg-indigo-50 text-indigo-700 border-indigo-200",
    EN_PROCESO: "bg-blue-50 text-blue-700 border-blue-200",
    COTIZADO:   "bg-amber-50 text-amber-700 border-amber-200",
    CERRADO:    "bg-emerald-50 text-emerald-700 border-emerald-200",
    PERDIDO:    "bg-rose-50 text-rose-700 border-rose-200",
  };

  if (leads.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center border border-dashed border-gray-200 rounded-lg bg-white">
        <p className="text-sm text-gray-400">Sin leads para mostrar</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Lead</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Estado</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tipo seguro</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Dias</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Contacto</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {leads.map((lead) => {
            const dias = diasDesde(lead.fechaCreacion);
            return (
              <tr key={lead.idLead} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{lead.nombre}</p>
                  {lead.empresa && <p className="text-xs text-gray-500">{lead.empresa}</p>}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                      estadoBadge[lead.estado] ?? "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
                  >
                    {lead.estado}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-[11px] px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200 font-medium">
                    {lead.tipoSeguro?.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium ${dias > 7 ? "text-amber-600" : "text-gray-500"}`}>
                    {dias}d
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="text-xs text-gray-500 space-y-0.5">
                    {lead.email    && <p className="truncate max-w-[160px]">{lead.email}</p>}
                    {lead.telefono && <p>{lead.telefono}</p>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 justify-end">
                    <button
                      onClick={() => onEdit(lead)}
                      className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                    >
                      Editar
                    </button>
                    <Link
                      to={`/dashboard/gestion-trabajo/leads/${lead.idLead}`}
                      className="text-xs font-semibold text-[#0066CC] hover:text-[#0052A3]"
                    >
                      Ver detalle
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
