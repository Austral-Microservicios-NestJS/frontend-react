import { useState } from "react";
import { Header, BotonRegistro, ModalConfirmacion } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { RegistrarActividad } from "@/components/modulos/actividades/modales/RegistrarActividad";
import { EditarActividad } from "@/components/modulos/actividades/modales/EditarActividad";
import { ActividadesGrid } from "@/components/modulos/actividades/grid/ActividadesGrid";
import { useActividades } from "@/hooks/useActividades";
import { useAuthStore } from "@/store/auth.store";
import type { Actividad, UpdateActividad } from "@/types/actividad.interface";

export default function ActividadesPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isRegistrarOpen, setIsRegistrarOpen] = useState(false);
  const [editingActividad, setEditingActividad] = useState<Actividad | null>(
    null
  );
  const [deletingActividad, setDeletingActividad] = useState<Actividad | null>(
    null
  );
  const { user } = useAuthStore();
  const { actividades, addActividad, updateActividad, deleteActividad } =
    useActividades();

  const handleEdit = (actividad: Actividad) => {
    setEditingActividad(actividad);
  };

  const handleDeleteClick = (actividad: Actividad) => {
    setDeletingActividad(actividad);
  };

  const handleConfirmDelete = async () => {
    if (deletingActividad) {
      await deleteActividad(deletingActividad.idActividad);
      setDeletingActividad(null);
    }
  };

  const handleUpdate = async (data: any) => {
    if (editingActividad) {
      const updateData: UpdateActividad = {
        titulo: data.titulo,
        descripcion: data.descripcion,
        tipoActividad: data.tipoActividad,
        fechaActividad: data.fechaActividad,
      };
      await updateActividad(editingActividad.idActividad, updateData);
    }
  };

  return (
    <>
      <Header
        title="Actividades"
        description="Gestiona tus actividades pendientes"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      >
        <BotonRegistro
          label="Registrar Actividad"
          onClick={() => setIsRegistrarOpen(true)}
        />
      </Header>

      <ActividadesGrid
        actividades={actividades}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <RegistrarActividad
        isOpen={isRegistrarOpen}
        onClose={() => setIsRegistrarOpen(false)}
        onSubmit={addActividad}
        user={user!}
      />

      {editingActividad && (
        <EditarActividad
          isOpen={!!editingActividad}
          onClose={() => setEditingActividad(null)}
          onSubmit={handleUpdate}
          actividad={editingActividad}
        />
      )}

      <ModalConfirmacion
        isOpen={!!deletingActividad}
        onClose={() => setDeletingActividad(null)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Actividad"
        message={`¿Estás seguro de eliminar la actividad "${deletingActividad?.titulo}"?`}
        confirmText="Eliminar"
      />
    </>
  );
}
