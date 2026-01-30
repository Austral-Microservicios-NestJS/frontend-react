import { useState } from "react";
import { Header, BotonRegistro, ModalConfirmacion } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { RegistrarObservacion } from "@/components/modulos/observacion/modales/RegistrarObservacion";
import { EditarObservacion } from "@/components/modulos/observacion/modales/EditarObservacion";
import { ModalDetalleObservacion } from "@/components/modulos/observacion/modales/ModalDetalleObservacion";
import { TablaObservacion } from "@/components/modulos/observacion/grid/TablaObservacion";
import { useObservacion } from "@/hooks/useObservacion";
import { useAuthStore } from "@/store/auth.store";
import type {
  Observacion,
  UpdateObservacion,
} from "@/types/observacion.interface";

export default function ObservacionPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isRegistrarOpen, setIsRegistrarOpen] = useState(false);
  const [editingObservacion, setEditingObservacion] =
    useState<Observacion | null>(null);
  const [deletingObservacion, setDeletingObservacion] =
    useState<Observacion | null>(null);
  const [viewingObservacion, setViewingObservacion] =
    useState<Observacion | null>(null);
  const { user } = useAuthStore();
  const {
    observaciones,
    addObservacion,
    updateObservacion,
    deleteObservacion,
    isLoading,
  } = useObservacion();

  const handleEdit = (observacion: Observacion) => {
    setEditingObservacion(observacion);
  };

  const handleDeleteClick = (id: number) => {
    const observacion = observaciones.find((o) => o.idObservacion === id);
    if (observacion) {
      setDeletingObservacion(observacion);
    }
  };

  const handleView = (observacion: Observacion) => {
    setViewingObservacion(observacion);
  };

  const handleConfirmDelete = async () => {
    if (deletingObservacion) {
      await deleteObservacion(deletingObservacion.idObservacion);
      setDeletingObservacion(null);
    }
  };

  const handleUpdate = async (data: UpdateObservacion) => {
    if (editingObservacion) {
      await updateObservacion(editingObservacion.idObservacion, data);
    }
  };

  return (
    <>
      <Header
        title="Observaciones"
        description="Gestión de feedback y observaciones de la aplicación"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      >
        <BotonRegistro
          label="Registrar Observación"
          onClick={() => setIsRegistrarOpen(true)}
        />
      </Header>

      <div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <TablaObservacion
            observaciones={observaciones}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onView={handleView}
          />
        )}
      </div>

      {user && (
        <RegistrarObservacion
          isOpen={isRegistrarOpen}
          onClose={() => setIsRegistrarOpen(false)}
          addObservacion={addObservacion}
          user={user}
        />
      )}

      {editingObservacion && (
        <EditarObservacion
          isOpen={!!editingObservacion}
          onClose={() => setEditingObservacion(null)}
          onSubmit={handleUpdate}
          observacion={editingObservacion}
        />
      )}

      {viewingObservacion && (
        <ModalDetalleObservacion
          isOpen={!!viewingObservacion}
          onClose={() => setViewingObservacion(null)}
          observacion={viewingObservacion}
        />
      )}

      {deletingObservacion && (
        <ModalConfirmacion
          isOpen={!!deletingObservacion}
          onClose={() => setDeletingObservacion(null)}
          onConfirm={handleConfirmDelete}
          title="Eliminar Observación"
          message={`¿Estás seguro de eliminar la observación "${deletingObservacion.asunto}"?`}
          confirmText="Eliminar"
        />
      )}
    </>
  );
}
