import { useState } from "react";
import { Header, BotonRegistro, ModalConfirmacion } from "@/components/shared";
import { useSidebar } from "@/hooks/useSidebar";
import { RegistrarRamo } from "@/components/modulos/ramos/modales/RegistrarRamo";
import { EditarRamo } from "@/components/modulos/ramos/modales/EditarRamo";
import { TablaRamos } from "@/components/modulos/ramos/tablas/TablaRamos";
import { useRamos } from "@/hooks/useRamos";
import { ramoApi } from "@/services/ramo.service";
import { useAuthStore } from "@/store/auth.store";
import { Roles } from "@/utils/roles";
import type { Ramo, UpdateRamoDto } from "@/types/ramo.interface";
import { toast } from "sonner";

export default function RamosPage() {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { user } = useAuthStore();
  const isAdmin = user?.rol?.nombreRol === Roles.ADMINISTRADOR;

  const [isRegistrarOpen, setIsRegistrarOpen] = useState(false);
  const [editingRamo, setEditingRamo] = useState<Ramo | null>(null);
  const [ramoAEliminar, setRamoAEliminar] = useState<Ramo | null>(null);

  const { ramos, addRamo, updateRamo, isLoading } = useRamos();
  const deleteRamo = ramoApi.useDelete();

  const handleEdit = (ramo: Ramo) => {
    setEditingRamo(ramo);
  };

  const handleUpdate = async (data: UpdateRamoDto) => {
    if (editingRamo) {
      await updateRamo(editingRamo.idRamo, data);
    }
  };

  const confirmarEliminarRamo = async () => {
    if (!ramoAEliminar) return;
    try {
      await deleteRamo.mutateAsync(ramoAEliminar.idRamo);
      toast.success("Ramo eliminado");
      setRamoAEliminar(null);
    } catch {
      toast.error("No se pudo eliminar el ramo");
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
          <TablaRamos
            ramos={ramos}
            onEdit={handleEdit}
            onDelete={isAdmin ? setRamoAEliminar : undefined}
          />
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

      <ModalConfirmacion
        isOpen={!!ramoAEliminar}
        onClose={() => setRamoAEliminar(null)}
        onConfirm={confirmarEliminarRamo}
        title="Eliminar ramo"
        message={
          ramoAEliminar
            ? `¿Eliminar definitivamente el ramo "${ramoAEliminar.nombre}"? Los productos y leads asociados a este ramo pueden quedar huérfanos. Esta acción no se puede deshacer.`
            : ""
        }
        confirmText="Eliminar definitivamente"
        isLoading={deleteRamo.isPending}
      />
    </>
  );
}
