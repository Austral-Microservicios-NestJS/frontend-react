import { useState } from "react";
import { Header, BotonRegistro, ModalConfirmacion } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { RegistrarTarea } from "@/components/modulos/tareas/modales/RegistrarTarea";
import { EditarTarea } from "@/components/modulos/tareas/modales/EditarTarea";
import { TareasGrid } from "@/components/modulos/tareas/grid/TareasGrid";
import { useTareas } from "@/hooks/useTareas";
import { useAuthStore } from "@/store/auth.store";
import type { Tarea, UpdateTarea } from "@/types/tarea.interface";

export default function TareasPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isRegistrarOpen, setIsRegistrarOpen] = useState(false);
  const [editingTarea, setEditingTarea] = useState<Tarea | null>(null);
  const [deletingTarea, setDeletingTarea] = useState<Tarea | null>(null);
  const { user } = useAuthStore();
  const { tareas, addTarea, updateTarea, deleteTarea, isLoading } = useTareas();

  const handleEdit = (tarea: Tarea) => {
    setEditingTarea(tarea);
  };

  const handleDeleteClick = (tarea: Tarea) => {
    setDeletingTarea(tarea);
  };

  const handleConfirmDelete = async () => {
    if (deletingTarea) {
      await deleteTarea(deletingTarea.idTarea);
      setDeletingTarea(null);
    }
  };

  const handleUpdate = async (data: UpdateTarea) => {
    if (editingTarea) {
      await updateTarea(editingTarea.idTarea, data);
    }
  };

  return (
    <>
      <Header
        title="Tareas"
        description="Gestiona tus tareas y pendientes"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      >
        <BotonRegistro
          label="Registrar Tarea"
          onClick={() => setIsRegistrarOpen(true)}
        />
      </Header>

      <div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <TareasGrid
            tareas={tareas}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        )}
      </div>

      <RegistrarTarea
        isOpen={isRegistrarOpen}
        onClose={() => setIsRegistrarOpen(false)}
        addTarea={addTarea}
        user={user!}
      />

      {editingTarea && (
        <EditarTarea
          isOpen={!!editingTarea}
          onClose={() => setEditingTarea(null)}
          onSubmit={handleUpdate}
          tarea={editingTarea}
        />
      )}

      <ModalConfirmacion
        isOpen={!!deletingTarea}
        onClose={() => setDeletingTarea(null)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Tarea"
        message={`¿Estás seguro de eliminar la tarea "${deletingTarea?.asunto}"?`}
        confirmText="Eliminar"
      />
    </>
  );
}
