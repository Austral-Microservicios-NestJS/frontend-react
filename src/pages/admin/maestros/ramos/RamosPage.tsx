import { useState } from "react";
import { Header, BotonRegistro } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { RegistrarRamo } from "@/components/modulos/ramos/modales/RegistrarRamo";
import { EditarRamo } from "@/components/modulos/ramos/modales/EditarRamo";
import { TablaRamos } from "@/components/modulos/ramos/tablas/TablaRamos";
import { useRamos } from "@/hooks/useRamos";
import type { Ramo, UpdateRamoDto } from "@/types/ramo.interface";

export default function RamosPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const [isRegistrarOpen, setIsRegistrarOpen] = useState(false);
  const [editingRamo, setEditingRamo] = useState<Ramo | null>(null);
  const { ramos, addRamo, updateRamo, isLoading } = useRamos();

  const handleEdit = (ramo: Ramo) => {
    setEditingRamo(ramo);
  };

  const handleUpdate = async (data: UpdateRamoDto) => {
    if (editingRamo) {
      await updateRamo(editingRamo.idRamo, data);
    }
  };

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
          onClick={() => setIsRegistrarOpen(true)}
        />
      </Header>

      <>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <TablaRamos ramos={ramos} onEdit={handleEdit} />
        )}
      </>

      <RegistrarRamo
        isOpen={isRegistrarOpen}
        onClose={() => setIsRegistrarOpen(false)}
        addRamo={addRamo}
      />

      {editingRamo && (
        <EditarRamo
          isOpen={!!editingRamo}
          onClose={() => setEditingRamo(null)}
          onSubmit={handleUpdate}
          ramo={editingRamo}
        />
      )}
    </>
  );
}
