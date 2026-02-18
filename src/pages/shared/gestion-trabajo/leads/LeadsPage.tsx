import { useState, useRef } from "react";
import { Header, BotonRegistro } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { RegistrarLead } from "@/components/modulos/leads/modales/RegistrarLead";
import { useLeads } from "@/hooks/useLeads";
import type { Lead, CreateLead } from "@/types/lead.interface";
import { EstadoLead } from "@/types/lead.interface";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";

export default function LeadsPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

  const {
    leads,
    leadsByEstado,
    addLead,
    updateLead,
    cambiarEstadoLead,
    isLoading,
    error,
  } = useLeads();

  const handleOpenModal = () => {
    setLeadToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setLeadToEdit(lead);
    setIsModalOpen(true);
  };

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

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-sm text-gray-500 font-medium">
            Cargando leads...
          </p>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Backend no disponible
            </h3>
            <p className="text-sm text-gray-600">
              No se pudo conectar con el servidor. Por favor intenta más tarde.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-hidden flex flex-col p-6 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard
              title="Total Leads"
              value={leads.length}
              icon={Users}
              color="text-blue-600"
              bg="bg-blue-50"
            />
            <StatsCard
              title="Nuevos"
              value={leadsByEstado.NUEVO.length}
              icon={Target}
              color="text-indigo-600"
              bg="bg-indigo-50"
            />
            <StatsCard
              title="Ganados"
              value={leadsByEstado.CERRADO.length}
              icon={CheckCircle2}
              color="text-emerald-600"
              bg="bg-emerald-50"
            />
            <StatsCard
              title="Perdidos"
              value={leadsByEstado.PERDIDO.length}
              icon={Ban}
              color="text-rose-600"
              bg="bg-rose-50"
            />
          </div>

          {/* Filters & Search */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar leads..."
                className="pl-9 bg-white border-gray-200 focus:border-blue-500 transition-colors h-9 text-sm rounded-md"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600 border-gray-200 hover:bg-white hover:text-gray-900 h-9 rounded-md"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>

          {/* Kanban Board */}
          <div className="flex-1 overflow-x-auto pb-4">
            <div className="flex gap-4 h-full min-w-[1000px]">
              <LeadColumn
                title="Nuevo"
                count={leadsByEstado.NUEVO.length}
                leads={leadsByEstado.NUEVO}
                estado="NUEVO"
                statusColor="bg-indigo-500"
                onDrop={handleDrop}
                onEdit={handleEditLead}
              />
              <LeadColumn
                title="Contactado"
                count={leadsByEstado.CONTACTADO.length}
                leads={leadsByEstado.CONTACTADO}
                estado="CONTACTADO"
                statusColor="bg-blue-500"
                onDrop={handleDrop}
                onEdit={handleEditLead}
              />
              <LeadColumn
                title="Cerrado"
                count={leadsByEstado.CERRADO.length}
                leads={leadsByEstado.CERRADO}
                estado="CERRADO"
                statusColor="bg-emerald-500"
                onDrop={handleDrop}
                onEdit={handleEditLead}
              />
              <LeadColumn
                title="Perdido"
                count={leadsByEstado.PERDIDO.length}
                leads={leadsByEstado.PERDIDO}
                estado="PERDIDO"
                statusColor="bg-rose-500"
                onDrop={handleDrop}
                onEdit={handleEditLead}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de registro/edición */}
      <RegistrarLead
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setLeadToEdit(null);
        }}
        onSubmit={handleSubmitLead}
        leadToEdit={leadToEdit}
      />
    </div>
  );
}

// Minimalist Stats Card
function StatsCard({ title, value, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {title}
        </p>
        <h3 className="text-xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
      <div className={`p-2 rounded-md ${bg}`}>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
    </div>
  );
}

// Clean Column Component with DnD
function LeadColumn({
  title,
  count,
  leads,
  estado,
  statusColor,
  onDrop,
  onEdit,
}: any) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const dragCounter = useRef(0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.types.includes("text/plain")) {
      setIsDraggingOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDraggingOver(false);
    }
  };

  const handleDropEvent = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    dragCounter.current = 0;

    const leadId = e.dataTransfer.getData("text/plain");
    if (leadId && leadId !== "") {
      onDrop(leadId, estado);
    }
  };

  return (
    <div
      className={`flex-1 flex flex-col h-full rounded-lg border transition-colors duration-200 ${
        isDraggingOver
          ? "bg-blue-50 border-blue-300"
          : "bg-gray-50 border-gray-200"
      }`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDropEvent}
    >
      <div className="px-3 py-2.5 border-b border-gray-200 bg-white rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${statusColor}`} />
          <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
        </div>
        <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded">
          {count}
        </span>
      </div>

      <div className="flex-1 p-2 space-y-2 overflow-y-auto custom-scrollbar">
        {leads.length === 0 ? (
          <div className="h-24 flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-200 rounded-md m-1">
            <p className="text-xs font-medium">Sin leads</p>
          </div>
        ) : (
          leads.map((lead: Lead) => (
            <LeadCard key={lead.idLead} lead={lead} onEdit={onEdit} />
          ))
        )}
      </div>
    </div>
  );
}

// Lead Card with DnD
function LeadCard({
  lead,
  onEdit,
}: {
  lead: Lead;
  onEdit: (lead: Lead) => void;
}) {
  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", lead.idLead);
  };

  const priorityConfig: Record<string, { bar: string; badge: string; label: string }> = {
    ALTA:  { bar: "bg-red-500",    badge: "bg-red-50 text-red-700 border-red-200",     label: "Alta" },
    MEDIA: { bar: "bg-amber-400",  badge: "bg-amber-50 text-amber-700 border-amber-200", label: "Media" },
    BAJA:  { bar: "bg-emerald-400",badge: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Baja" },
  };

  const p = priorityConfig[lead.prioridad] ?? priorityConfig.MEDIA;

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="group relative bg-white rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-200 active:cursor-grabbing overflow-hidden"
    >
      {/* Barra de prioridad izquierda */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${p.bar} rounded-l-xl`} />

      <div className="pl-4 pr-3 pt-3 pb-3">
        {/* Header: badges */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${p.badge}`}>
              {p.label}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200">
              {lead.tipoSeguro.replace("_", " ")}
            </span>
          </div>
          <button
            className="text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => { e.stopPropagation(); onEdit(lead); }}
            title="Editar"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Nombre */}
        <h4
          className="font-semibold text-gray-900 text-sm leading-snug mb-1 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => onEdit(lead)}
        >
          {lead.nombre}
        </h4>

        {/* Empresa */}
        {lead.empresa && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
            <Building2 className="w-3 h-3 shrink-0" />
            <span className="truncate">{lead.empresa}</span>
          </div>
        )}

        {/* Contacto */}
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

        {/* Notas */}
        {lead.notas && (
          <div className="mb-3 px-2.5 py-2 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-[10px] text-gray-500 italic line-clamp-2 leading-relaxed">
              "{lead.notas}"
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
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
            <div className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              <span className="uppercase tracking-wide">{lead.fuente?.replace(/_/g, " ")}</span>
            </div>
          </div>

          <Link
            to={`/dashboard/gestion-trabajo/leads/${lead.idLead}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-white bg-[#0066CC] hover:bg-[#0052A3] px-3 py-1.5 rounded-lg transition-colors shadow-sm"
          >
            Ver detalle
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
