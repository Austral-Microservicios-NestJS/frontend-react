import { useState } from "react";
import { Header, BotonRegistro } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { RegistrarCompania } from "@/components/modulos/companias/modales/RegistrarCompania";
import { EditarCompania } from "@/components/modulos/companias/modales/EditarCompania";
import { CompaniasGrid } from "@/components/modulos/companias/grid/CompaniasGrid";
import { useCompanias } from "@/hooks/useCompanias";
import type { Compania, UpdateCompaniaDto } from "@/types/compania.interface";

export default function CompaniasPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isRegistrarOpen, setIsRegistrarOpen] = useState(false);
  const [editingCompania, setEditingCompania] = useState<Compania | null>(null);
  const { companias, addCompania, updateCompania, isLoading } = useCompanias();

  const handleEdit = (compania: Compania) => {
    setEditingCompania(compania);
  };

  const handleUpdate = async (data: UpdateCompaniaDto) => {
    if (editingCompania) {
      await updateCompania(editingCompania.idCompania, data);
    }
  };

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
          onClick={() => setIsRegistrarOpen(true)}
        />
      </Header>

      <>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <CompaniasGrid companias={companias} onEdit={handleEdit} />
        )}
      </>

      <RegistrarCompania
        isOpen={isRegistrarOpen}
        onClose={() => setIsRegistrarOpen(false)}
        addCompania={addCompania}
      />

      {editingCompania && (
        <EditarCompania
          isOpen={!!editingCompania}
          onClose={() => setEditingCompania(null)}
          onSubmit={handleUpdate}
          compania={editingCompania}
        />
      )}
    </>
  );
}
