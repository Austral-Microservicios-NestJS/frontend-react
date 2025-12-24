import { useState } from "react";
import { Header, BotonRegistro } from "@/components/shared";
import { useSidebar } from "@/components/sidebar/Sidebar";
import { RegistrarActividad } from "@/components/modulos/actividades/modales/RegistrarActividad";
import { ActividadesGrid } from "@/components/modulos/actividades/grid/ActividadesGrid";
import { useActividades } from "@/hooks/useActividades";
import { useAuthStore } from "@/store/auth.store";

export default function ActividadesPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { user } = useAuthStore();
  const { actividades, addActividad } = useActividades();

  return (
    <>
      <Header
        title="Actividades"
        description="Gestion tus actividades pendientes"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      >
        <BotonRegistro 
          label="Registrar Actividad"
          onClick={() => setIsModalOpen(true)}
        />

      </Header>

      {/* Aquí iría el contenido principal de la página de actividades */}
      <ActividadesGrid actividades={actividades} />
      
      <RegistrarActividad 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addActividad={addActividad}
        user={user!}
      />
    </>
  );
}
