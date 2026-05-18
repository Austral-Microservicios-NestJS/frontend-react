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
  const { user } = useAuthStore();

  const [isRegistrarTareaOpen, setIsRegistrarTareaOpen] = useState(false);
  const [editingTarea, setEditingTarea] = useState<Tarea | null>(null);
  const [deletingTarea, setDeletingTarea] = useState<Tarea | null>(null);
  const { tareas, addTarea, updateTarea, deleteTarea, isLoading: tareasLoading } = useTareas();

  const handleUpdateTarea = async (data: UpdateTarea) => {
    if (editingTarea) await updateTarea(editingTarea.idTarea, data);
  };

  const handleConfirmDeleteTarea = async () => {
    if (deletingTarea) {
      await deleteTarea(deletingTarea.idTarea);
      setDeletingTarea(null);
    }
  };

  return (
    <>
      <Header
        title="Gestión de Trabajo"
        description="Tareas pendientes y seguimiento"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      >
        <BotonRegistro label="Nueva Tarea" onClick={() => setIsRegistrarTareaOpen(true)} />
      </Header>

      <div className="pt-4">
        {tareasLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        ) : (
          <TareasGrid
            tareas={tareas}
            onEdit={setEditingTarea}
            onDelete={setDeletingTarea}
          />
        )}
      </div>

      <RegistrarTarea
        isOpen={isRegistrarTareaOpen}
        onClose={() => setIsRegistrarTareaOpen(false)}
        addTarea={addTarea}
        user={user!}
      />
      {editingTarea && (
        <EditarTarea
          isOpen={!!editingTarea}
          onClose={() => setEditingTarea(null)}
          onSubmit={handleUpdateTarea}
          tarea={editingTarea}
        />
      )}
      <ModalConfirmacion
        isOpen={!!deletingTarea}
        onClose={() => setDeletingTarea(null)}
        onConfirm={handleConfirmDeleteTarea}
        title="Eliminar Tarea"
        message={`¿Estás seguro de eliminar la tarea "${deletingTarea?.asunto}"?`}
        confirmText="Eliminar"
      />
    </>
  );
}
