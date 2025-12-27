import { useState } from "react";
import { Header, BotonRegistro } from "@/components/shared";
import { useSidebar } from "@/components/sidebar/Sidebar";
import { KanbanColumn } from "@/components/modulos/leads/kanban/KanbanColumn";
import { RegistrarLead } from "@/components/modulos/leads/modales/RegistrarLead";
import { useLeads } from "@/hooks/useLeads";
import type { Lead, CreateLead, EstadoLead } from "@/types/lead.interface";

export default function LeadsPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);

  const {
    leadsByEstado,
    addLead,
    updateLead,
    deleteLead,
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

  const handleDeleteLead = async (id: string) => {
    await deleteLead(id);
  };

  const handleDrop = async (leadId: string, nuevoEstado: EstadoLead) => {
    await cambiarEstadoLead(leadId, nuevoEstado);
  };

  const kanbanColumns = [
    {
      title: "Nuevo",
      estado: "NUEVO" as EstadoLead,
      leads: leadsByEstado.NUEVO,
      color: "bg-blue-600",
    },
    {
      title: "Contactado",
      estado: "CONTACTADO" as EstadoLead,
      leads: leadsByEstado.CONTACTADO,
      color: "bg-purple-600",
    },
    {
      title: "Cerrado",
      estado: "CERRADO" as EstadoLead,
      leads: leadsByEstado.CERRADO,
      color: "bg-green-600",
    },
    {
      title: "Perdido",
      estado: "PERDIDO" as EstadoLead,
      leads: leadsByEstado.PERDIDO,
      color: "bg-red-600",
    },
  ];

  return (
    <>
      <Header
        title="Leads"
        description="Gestiona tus oportunidades de negocio con el tablero Kanban"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      >
        <BotonRegistro label="Nuevo Lead" onClick={handleOpenModal} />
      </Header>

      {/* Error state - Backend no disponible */}
      {error ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-md">
            <svg
              className="w-16 h-16 text-yellow-600 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Backend no disponible
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              El módulo de Leads está listo, pero el backend aún no está
              conectado. Por favor, implementa el endpoint{" "}
              <code className="bg-gray-200 px-2 py-1 rounded text-xs">
                GET /api/v1/leads
              </code>
            </p>
            <p className="text-xs text-gray-500">
              Mientras tanto, puedes usar el botón "Nuevo Lead" para ver el
              formulario.
            </p>
          </div>
        </div>
      ) : /* Loading state */
      isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando leads...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Instrucciones */}
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-blue-600 shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-blue-900 text-sm mb-1">
                  ¿Cómo usar el tablero Kanban?
                </h3>
                <p className="text-blue-800 text-xs">
                  Arrastra y suelta las tarjetas entre columnas para cambiar el
                  estado de tus leads. Haz clic en una tarjeta para editarla o
                  en el botón X para eliminarla.
                </p>
              </div>
            </div>
          </div>

          {/* Tablero Kanban */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-[calc(100vh-240px)]">
            {kanbanColumns.map((column) => (
              <KanbanColumn
                key={column.estado}
                title={column.title}
                leads={column.leads}
                estado={column.estado}
                color={column.color}
                onEdit={handleEditLead}
                onDelete={handleDeleteLead}
                onDrop={handleDrop}
              />
            ))}
          </div>
        </>
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
    </>
  );
}
