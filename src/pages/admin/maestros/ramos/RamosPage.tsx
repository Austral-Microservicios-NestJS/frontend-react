import { useState } from "react";
import { Header, BotonRegistro } from "@/components/shared";
import { useSidebar } from "@/components/sidebar/Sidebar";
import { RegistrarRamo } from "@/components/modulos/ramos/modales/RegistrarRamo";
import { RamosGrid } from "@/components/modulos/ramos/grid/RamosGrid";
import { useRamos } from "@/hooks/useRamos";

export default function RamosPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { ramos, addRamo, isLoading } = useRamos();

  return (
    <>
      <Header
        title="Ramos de Seguro"
        description="Gestiona los ramos de seguros del sistema"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      >
        <BotonRegistro
          label="Registrar Ramo"
          onClick={() => setIsModalOpen(true)}
        />
      </Header>

      <>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <RamosGrid ramos={ramos} />
        )}
      </>

      <RegistrarRamo
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addRamo={addRamo}
      />
    </>
  );
}
