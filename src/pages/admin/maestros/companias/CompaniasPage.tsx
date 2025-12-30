import { useState } from "react";
import { Header, BotonRegistro } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { RegistrarCompania } from "@/components/modulos/companias/modales/RegistrarCompania";
import { CompaniasGrid } from "@/components/modulos/companias/grid/CompaniasGrid";
import { useCompanias } from "@/hooks/useCompanias";

export default function CompaniasPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { companias, addCompania, isLoading } = useCompanias();

  return (
    <>
      <Header
        title="Compañías"
        description="Gestiona las compañías de seguros"
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      >
        <BotonRegistro
          label="Registrar Compañía"
          onClick={() => setIsModalOpen(true)}
        />
      </Header>

      <>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <CompaniasGrid companias={companias} />
        )}
      </>

      <RegistrarCompania
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addCompania={addCompania}
      />
    </>
  );
}
