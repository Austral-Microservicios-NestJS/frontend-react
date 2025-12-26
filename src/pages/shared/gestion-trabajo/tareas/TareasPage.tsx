import { useState } from "react";
import { Header, BotonRegistro } from "@/components/shared";
import { useSidebar } from "@/components/sidebar/Sidebar";
import { RegistrarTarea } from "@/components/modulos/tareas/modales/RegistrarTarea";
import { TareasGrid } from "@/components/modulos/tareas/grid/TareasGrid";
import { useTareas } from "@/hooks/useTareas";
import { useAuthStore } from "@/store/auth.store";

export default function TareasPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuthStore();
  const { tareas, addTarea, isLoading } = useTareas();

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
          onClick={() => setIsModalOpen(true)}
        />
      </Header>

      <div>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <TareasGrid tareas={tareas} />
        )}
      </div>

      <RegistrarTarea
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addTarea={addTarea}
        user={user!}
      />
    </>
  );
}